"""
Test script to verify MCP tools work correctly.
Run: python test_tools.py
"""

import asyncio
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from tools import (
    fetch_docs,
    search_code_examples,
    explain_concept,
    get_interview_questions,
    get_learning_resources
)


async def test_explain_concept():
    """Test the explain_concept tool."""
    print("\n" + "="*60)
    print("Testing: explain_concept")
    print("="*60)
    
    result = await explain_concept(
        concept="binary search",
        difficulty="beginner",
        include_code=True
    )
    
    print(result[:1000] + "..." if len(result) > 1000 else result)
    return True


async def test_fetch_docs():
    """Test the fetch_docs tool."""
    print("\n" + "="*60)
    print("Testing: fetch_docs")
    print("="*60)
    
    result = await fetch_docs(
        topic="Python list comprehension",
        language="python"
    )
    
    print(result[:1000] + "..." if len(result) > 1000 else result)
    return True


async def test_get_interview_questions():
    """Test the get_interview_questions tool."""
    print("\n" + "="*60)
    print("Testing: get_interview_questions")
    print("="*60)
    
    result = await get_interview_questions(
        topic="hash tables",
        company_level="general",
        count=2
    )
    
    print(result[:1000] + "..." if len(result) > 1000 else result)
    return True


async def main():
    print("="*60)
    print("MCP Server Tools Test Suite")
    print("="*60)
    
    # Check API key
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        print("ERROR: PERPLEXITY_API_KEY not set!")
        return
    
    print(f"✓ API Key configured: {api_key[:10]}...")
    
    # Run tests
    try:
        await test_explain_concept()
        print("\n✅ explain_concept: PASSED")
    except Exception as e:
        print(f"\n❌ explain_concept: FAILED - {e}")
    
    try:
        await test_fetch_docs()
        print("\n✅ fetch_docs: PASSED")
    except Exception as e:
        print(f"\n❌ fetch_docs: FAILED - {e}")
    
    try:
        await test_get_interview_questions()
        print("\n✅ get_interview_questions: PASSED")
    except Exception as e:
        print(f"\n❌ get_interview_questions: FAILED - {e}")
    
    print("\n" + "="*60)
    print("All tests completed!")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
