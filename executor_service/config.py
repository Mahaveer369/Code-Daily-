"""
Configuration settings for the sandbox executor service.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Execution limits
    EXECUTION_TIMEOUT_SECONDS: int = int(os.getenv("EXECUTION_TIMEOUT", "5"))
    MAX_MEMORY_MB: int = int(os.getenv("MAX_MEMORY_MB", "100"))
    MAX_OUTPUT_SIZE: int = int(os.getenv("MAX_OUTPUT_SIZE", "10000"))  # 10KB
    
    # Container settings
    NETWORK_DISABLED: bool = True
    READ_ONLY_ROOT: bool = True
    
    # Concurrency
    MAX_CONCURRENT_EXECUTIONS: int = int(os.getenv("MAX_CONCURRENT", "10"))
    
    # Docker image names
    PYTHON_IMAGE: str = "code-sandbox-python:latest"
    JAVASCRIPT_IMAGE: str = "code-sandbox-javascript:latest"
    SQL_IMAGE: str = "code-sandbox-sql:latest"
    
    # Supported languages
    SUPPORTED_LANGUAGES: list = ["python", "javascript", "js", "sql"]
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8001"))


settings = Settings()
