"""
FastAPI application for sandboxed code execution.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from models import ExecuteRequest, ExecuteResponse, HealthResponse
from executor import executor


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting Code Executor Service...")
    
    # Check Docker connection
    if executor.check_health():
        logger.info("✓ Docker connection established")
        available = executor.list_images()
        if available:
            logger.info(f"✓ Available sandbox images: {available}")
        else:
            logger.warning("⚠ No sandbox images found. Please build them first.")
    else:
        logger.warning("⚠ Docker connection failed. Execution will not work.")
    
    yield
    
    logger.info("Shutting down Code Executor Service...")


app = FastAPI(
    title="Code Executor Service",
    description="Secure, sandboxed code execution via Docker containers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    docker_ready = executor.check_health()
    return HealthResponse(
        status="healthy" if docker_ready else "degraded",
        executor_ready=docker_ready,
        supported_languages=settings.SUPPORTED_LANGUAGES
    )


@app.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """
    Execute code in a sandboxed Docker container.
    
    Supports Python, JavaScript, and SQL.
    
    Resource limits:
    - Memory: 100MB
    - Timeout: 5 seconds
    - No network access
    """
    logger.info(f"Executing {request.language} code ({len(request.code)} chars)")
    
    # Normalize language
    language = request.language.value
    if language == "js":
        language = "javascript"
    
    # Execute code
    success, output, error, execution_time_ms = await executor.execute(
        code=request.code,
        language=language,
        stdin=request.stdin
    )
    
    logger.info(f"Execution completed: success={success}, time={execution_time_ms}ms")
    
    return ExecuteResponse(
        success=success,
        output=output,
        error=error,
        execution_time_ms=execution_time_ms,
        language=language
    )


@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "Code Executor",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
