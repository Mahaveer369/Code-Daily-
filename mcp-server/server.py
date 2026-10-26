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
from schemas import AVAILABLE_TOOLS

# Load environment variables
load_dotenv()

# Initialize MCP server
server = Server("code-daily-docs")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return AVAILABLE_TOOLS


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
