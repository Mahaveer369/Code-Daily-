"""
Docker container executor for sandboxed code execution.
"""
import asyncio
import docker
import time
import base64
from typing import Tuple, Optional
from config import settings


class DockerExecutor:
    """Manages Docker containers for secure code execution."""
    
    def __init__(self):
        self.client = docker.from_env()
        self._semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_EXECUTIONS)
    
    def _get_image_for_language(self, language: str) -> str:
        """Get the Docker image name for a given language."""
        language = language.lower()
        if language == "python":
            return settings.PYTHON_IMAGE
        elif language in ["javascript", "js"]:
            return settings.JAVASCRIPT_IMAGE
        elif language == "sql":
            return settings.SQL_IMAGE
        else:
            raise ValueError(f"Unsupported language: {language}")
    
    def _get_command_for_language(self, language: str, code: str) -> list:
        """Get the execution command for a given language."""
        # Base64 encode to safely pass code with special characters
        encoded_code = base64.b64encode(code.encode()).decode()
        
        language = language.lower()
        if language == "python":
            return [
                "sh", "-c",
                f"echo '{encoded_code}' | base64 -d > /tmp/code.py && python /tmp/code.py"
            ]
        elif language in ["javascript", "js"]:
            return [
                "sh", "-c",
                f"echo '{encoded_code}' | base64 -d > /tmp/code.js && node /tmp/code.js"
            ]
        elif language == "sql":
            return [
                "sh", "-c",
                f"echo '{encoded_code}' | base64 -d > /tmp/query.sql && sqlite3 :memory: < /tmp/query.sql"
            ]
        else:
            raise ValueError(f"Unsupported language: {language}")
    
    async def execute(
        self,
        code: str,
        language: str,
        stdin: Optional[str] = None
    ) -> Tuple[bool, str, Optional[str], int]:
        """
        Execute code in a sandboxed Docker container.
        
        Returns:
            Tuple of (success, output, error, execution_time_ms)
        """
        async with self._semaphore:
            return await self._execute_in_container(code, language, stdin)
    
    async def _execute_in_container(
        self,
        code: str,
        language: str,
        stdin: Optional[str] = None
    ) -> Tuple[bool, str, Optional[str], int]:
        """Execute code inside an isolated Docker container."""
        start_time = time.time()
        
        try:
            image = self._get_image_for_language(language)
            command = self._get_command_for_language(language, code)
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self._run_container(image, command, stdin)
            )
            
            execution_time_ms = int((time.time() - start_time) * 1000)
            return result[0], result[1], result[2], execution_time_ms
            
        except docker.errors.ImageNotFound:
            execution_time_ms = int((time.time() - start_time) * 1000)
            return False, "", f"Sandbox image not found for {language}. Please build the images first.", execution_time_ms
        except docker.errors.ContainerError as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            return False, "", str(e), execution_time_ms
        except Exception as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            return False, "", f"Execution error: {str(e)}", execution_time_ms
    
    def _run_container(
        self,
        image: str,
        command: list,
        stdin: Optional[str] = None
    ) -> Tuple[bool, str, Optional[str]]:
        """Run a container with strict resource limits."""
        container = None
        try:
            container = self.client.containers.run(
                image=image,
                command=command,
                detach=True,
                mem_limit=f"{settings.MAX_MEMORY_MB}m",
                memswap_limit=f"{settings.MAX_MEMORY_MB}m",  # Disable swap
                cpu_period=100000,
                cpu_quota=50000,  # 50% of one CPU
                network_disabled=settings.NETWORK_DISABLED,
                read_only=settings.READ_ONLY_ROOT,
                tmpfs={'/tmp': 'size=10m,mode=1777'},  # Writable temp directory
                security_opt=["no-new-privileges"],
                user="nobody",  # Run as unprivileged user
            )
            
            # Wait for container with timeout
            result = container.wait(timeout=settings.EXECUTION_TIMEOUT_SECONDS)
            
            # Get logs
            stdout = container.logs(stdout=True, stderr=False).decode('utf-8', errors='replace')
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8', errors='replace')
            
            # Truncate output if too large
            if len(stdout) > settings.MAX_OUTPUT_SIZE:
                stdout = stdout[:settings.MAX_OUTPUT_SIZE] + "\n...[output truncated]"
            if len(stderr) > settings.MAX_OUTPUT_SIZE:
                stderr = stderr[:settings.MAX_OUTPUT_SIZE] + "\n...[error truncated]"
            
            exit_code = result.get('StatusCode', 1)
            
            if exit_code == 0:
                return True, stdout, stderr if stderr else None
            else:
                return False, stdout, stderr if stderr else f"Process exited with code {exit_code}"
                
        except Exception as e:
            if "timed out" in str(e).lower() or "timeout" in str(e).lower():
                return False, "", f"Execution timed out after {settings.EXECUTION_TIMEOUT_SECONDS} seconds"
            raise
        finally:
            # Always cleanup container
            if container:
                try:
                    container.remove(force=True)
                except:
                    pass
    
    def check_health(self) -> bool:
        """Check if Docker is accessible and images are available."""
        try:
            self.client.ping()
            return True
        except:
            return False
    
    def list_images(self) -> list:
        """List available sandbox images."""
        available = []
        for lang, image in [
            ("python", settings.PYTHON_IMAGE),
            ("javascript", settings.JAVASCRIPT_IMAGE),
            ("sql", settings.SQL_IMAGE)
        ]:
            try:
                self.client.images.get(image)
                available.append(lang)
            except docker.errors.ImageNotFound:
                pass
        return available


# Singleton instance with fallback
try:
    executor = DockerExecutor()
    print("✓ Docker executor initialized successfully")
except Exception as e:
    print(f"⚠ Docker unavailable: {e}")
    print("⚠ Falling back to subprocess executor (limited security)")
    
    # Fallback executor using subprocess (less secure, for development only)
    class SubprocessExecutor:
        """Fallback executor using subprocess when Docker is unavailable."""
        
        def __init__(self):
            self._semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_EXECUTIONS)
        
        async def execute(self, code: str, language: str, stdin=None):
            """Execute code using subprocess (development fallback)."""
            import subprocess
            import time
            
            async with self._semaphore:
                start_time = time.time()
                
                try:
                    if language == "python":
                        result = subprocess.run(
                            ["python3", "-c", code],
                            capture_output=True,
                            text=True,
                            timeout=settings.EXECUTION_TIMEOUT_SECONDS
                        )
                    elif language in ["javascript", "js"]:
                        result = subprocess.run(
                            ["node", "-e", code],
                            capture_output=True,
                            text=True,
                            timeout=settings.EXECUTION_TIMEOUT_SECONDS
                        )
                    elif language == "sql":
                        # SQLite in-memory execution
                        result = subprocess.run(
                            ["sqlite3", ":memory:", code],
                            capture_output=True,
                            text=True,
                            timeout=settings.EXECUTION_TIMEOUT_SECONDS
                        )
                    else:
                        return False, "", f"Unsupported language: {language}", 0
                    
                    execution_time = int((time.time() - start_time) * 1000)
                    
                    if result.returncode == 0:
                        return True, result.stdout, result.stderr if result.stderr else None, execution_time
                    else:
                        return False, result.stdout, result.stderr, execution_time
                        
                except subprocess.TimeoutExpired:
                    return False, "", f"Execution timed out after {settings.EXECUTION_TIMEOUT_SECONDS}s", settings.EXECUTION_TIMEOUT_SECONDS * 1000
                except FileNotFoundError as e:
                    return False, "", f"Runtime not found: {e}", 0
                except Exception as e:
                    return False, "", str(e), 0
        
        def check_health(self):
            return True
        
        def list_images(self):
            return ["python", "javascript", "sql"]
    
    executor = SubprocessExecutor()
