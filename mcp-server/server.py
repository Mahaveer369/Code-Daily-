"""
MCP Server for Code-Daily - Intelligent Documentation Assistant

This server provides tools for fetching documentation, code examples,
and AI-powered explanations for programming concepts.
"""

import os
import asyncio
from dotenv import load_dotenv
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from tools import (
    fetch_docs,
    search_code_examples,
    explain_concept,
    get_interview_questions,
    get_learning_resources
)

# Load environment variables
load_dotenv()

# Initialize MCP server
server = Server("code-daily-docs")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return [
        Tool(
            name="fetch_docs",
            description="Fetch official documentation for a programming concept, function, or library. Returns formatted documentation with examples.",
            inputSchema={
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "The concept, function, or library to look up (e.g., 'Python asyncio', 'React useState', 'SQL JOIN')"
                    },
                    "language": {
                        "type": "string",
                        "description": "Programming language context",
                        "enum": ["python", "javascript", "typescript", "java", "cpp", "sql", "general"]
                    }
                },
                "required": ["topic"]
            }
        ),
        Tool(
            name="search_code_examples",
            description="Search for real-world code examples from GitHub and Stack Overflow. Returns practical code snippets with explanations.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "What to search for (e.g., 'binary search implementation', 'REST API with authentication')"
                    },
                    "language": {
                        "type": "string",
                        "description": "Programming language",
                        "enum": ["python", "javascript", "typescript", "java", "cpp", "go", "rust"]
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Number of examples to return (1-5)",
                        "default": 3
                    }
                },
                "required": ["query", "language"]
            }
        ),
        Tool(
            name="explain_concept",
            description="Get an AI-powered explanation of a programming concept with analogies, examples, and best practices.",
            inputSchema={
                "type": "object",
                "properties": {
                    "concept": {
                        "type": "string",
                        "description": "The concept to explain (e.g., 'recursion', 'dependency injection', 'CAP theorem')"
                    },
                    "difficulty": {
                        "type": "string",
                        "description": "Target difficulty level",
                        "enum": ["beginner", "intermediate", "advanced"],
                        "default": "intermediate"
                    },
                    "include_code": {
                        "type": "boolean",
                        "description": "Include code examples in explanation",
                        "default": True
                    }
                },
                "required": ["concept"]
            }
        ),
        Tool(
            name="get_interview_questions",
            description="Generate interview questions for a given topic, tailored for different company levels.",
            inputSchema={
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "Topic to generate questions for (e.g., 'binary trees', 'system design', 'React hooks')"
                    },
                    "company_level": {
                        "type": "string",
                        "description": "Target company level",
                        "enum": ["FAANG", "startup", "general"],
                        "default": "general"
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of questions to generate (1-10)",
                        "default": 5
                    }
                },
                "required": ["topic"]
            }
        ),
        Tool(
            name="get_learning_resources",
            description="Find curated learning resources including tutorials, videos, courses, and books for a topic.",
            inputSchema={
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "Topic to find resources for"
                    },
                    "resource_type": {
                        "type": "string",
                        "description": "Type of resource",
                        "enum": ["all", "tutorial", "video", "course", "book"],
                        "default": "all"
                    }
                },
                "required": ["topic"]
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    try:
        if name == "fetch_docs":
            result = await fetch_docs(
                topic=arguments["topic"],
                language=arguments.get("language", "general")
            )
        elif name == "search_code_examples":
            result = await search_code_examples(
                query=arguments["query"],
                language=arguments["language"],
                max_results=arguments.get("max_results", 3)
            )
        elif name == "explain_concept":
            result = await explain_concept(
                concept=arguments["concept"],
                difficulty=arguments.get("difficulty", "intermediate"),
                include_code=arguments.get("include_code", True)
            )
        elif name == "get_interview_questions":
            result = await get_interview_questions(
                topic=arguments["topic"],
                company_level=arguments.get("company_level", "general"),
                count=arguments.get("count", 5)
            )
        elif name == "get_learning_resources":
            result = await get_learning_resources(
                topic=arguments["topic"],
                resource_type=arguments.get("resource_type", "all")
            )
        else:
            result = f"Unknown tool: {name}"
        
        return [TextContent(type="text", text=result)]
    
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
