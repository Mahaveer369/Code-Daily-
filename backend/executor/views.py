import os
import hashlib
import httpx
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.conf import settings

from .serializers import ExecuteCodeSerializer, ExecuteResultSerializer
from .models import ExecutionLog


logger = logging.getLogger(__name__)


class CodeExecutionThrottle(UserRateThrottle):
    """Rate limit for authenticated users: 30/minute"""
    rate = '30/minute'


class AnonCodeExecutionThrottle(AnonRateThrottle):
    """Rate limit for anonymous users: 10/minute"""
    rate = '10/minute'


class ExecuteCodeView(APIView):
    """
    POST /api/execute/
    
    Execute code in a sandboxed Docker container.
    Supports Python, JavaScript, and SQL.
    """
    
    permission_classes = [AllowAny]
    throttle_classes = [AnonCodeExecutionThrottle, CodeExecutionThrottle]
    
    def post(self, request):
        # Validate input
        serializer = ExecuteCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        code = serializer.validated_data['code']
        language = serializer.validated_data['language']
        stdin = serializer.validated_data.get('stdin')
        
        # Normalize language
        if language == 'js':
            language = 'javascript'
        
        # Get executor service URL
        executor_url = os.getenv('EXECUTOR_SERVICE_URL', 'http://localhost:8001')
        
        try:
            # Call the executor service
            with httpx.Client(timeout=10.0) as client:
                response = client.post(
                    f"{executor_url}/execute",
                    json={
                        "code": code,
                        "language": language,
                        "stdin": stdin
                    }
                )
            
            if response.status_code == 200:
                result = response.json()
                
                # Log execution (async in production)
                self._log_execution(
                    request.user if request.user.is_authenticated else None,
                    language,
                    code,
                    result.get('success', False),
                    result.get('execution_time_ms', 0)
                )
                
                return Response(result)
            else:
                logger.error(f"Executor service error: {response.status_code}")
                return Response(
                    {
                        "success": False,
                        "output": "",
                        "error": "Execution service error. Please try again.",
                        "execution_time_ms": 0,
                        "language": language
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
                
        except httpx.TimeoutException:
            return Response(
                {
                    "success": False,
                    "output": "",
                    "error": "Execution timed out",
                    "execution_time_ms": 10000,
                    "language": language
                }
            )
        except httpx.ConnectError:
            logger.error("Cannot connect to executor service")
            return Response(
                {
                    "success": False,
                    "output": "",
                    "error": "Execution service unavailable. Please try again later.",
                    "execution_time_ms": 0,
                    "language": language
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.exception("Unexpected error in code execution")
            return Response(
                {
                    "success": False,
                    "output": "",
                    "error": str(e),
                    "execution_time_ms": 0,
                    "language": language
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _log_execution(self, user, language, code, success, execution_time_ms):
        """Log execution for analytics."""
        try:
            code_hash = hashlib.sha256(code.encode()).hexdigest()
            ExecutionLog.objects.create(
                user=user,
                language=language,
                code_hash=code_hash,
                code_length=len(code),
                status='success' if success else 'error',
                execution_time_ms=execution_time_ms
            )
        except Exception as e:
            logger.warning(f"Failed to log execution: {e}")


class ExecutorHealthView(APIView):
    """
    GET /api/execute/health/
    
    Check executor service health.
    """
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        executor_url = os.getenv('EXECUTOR_SERVICE_URL', 'http://localhost:8001')
        
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(f"{executor_url}/health")
            
            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response(
                    {"status": "degraded", "executor_ready": False},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
        except Exception as e:
            return Response(
                {"status": "unavailable", "executor_ready": False, "error": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
