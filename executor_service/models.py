"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class Language(str, Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    JS = "js"
    SQL = "sql"


class ExecuteRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50000, description="Code to execute")
    language: Language = Field(..., description="Programming language")
    stdin: Optional[str] = Field(default=None, max_length=10000, description="Optional stdin input")
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "print('Hello, World!')",
                "language": "python"
            }
        }


class ExecuteResponse(BaseModel):
    success: bool = Field(..., description="Whether execution completed without errors")
    output: str = Field(..., description="stdout output from execution")
    error: Optional[str] = Field(default=None, description="stderr or error message")
    execution_time_ms: int = Field(..., description="Execution time in milliseconds")
    language: str = Field(..., description="Language that was executed")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "output": "Hello, World!\n",
                "error": None,
                "execution_time_ms": 45,
                "language": "python"
            }
        }


class HealthResponse(BaseModel):
    status: str
    executor_ready: bool
    supported_languages: list[str]
