"""
Tool implementations for Code-Daily MCP Server.

Each tool fetches documentation, code examples, or AI-powered explanations
from external sources.
"""

import os
import httpx
from typing import Optional

# API Configuration
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"
GITHUB_API_URL = "https://api.github.com"


def get_perplexity_key() -> str:
    return os.getenv("PERPLEXITY_API_KEY", "")


def get_github_token() -> Optional[str]:
    return os.getenv("GITHUB_TOKEN")


async def call_perplexity(system_prompt: str, user_prompt: str) -> str:
    """Make a request to Perplexity API."""
    api_key = get_perplexity_key()
    if not api_key:
        return "Error: PERPLEXITY_API_KEY not configured"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            PERPLEXITY_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "sonar",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7
            }
        )
        response.raise_for_status()
        data = response.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "No response")


async def search_github(query: str, language: str, max_results: int = 3) -> list[dict]:
    """Search GitHub for code examples."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = get_github_token()
    if token:
        headers["Authorization"] = f"token {token}"
    
    search_query = f"{query} language:{language}"
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{GITHUB_API_URL}/search/code",
            headers=headers,
            params={"q": search_query, "per_page": max_results}
        )
        
        if response.status_code == 403:
            return [{"error": "GitHub API rate limit. Add GITHUB_TOKEN for higher limits."}]
        
        if response.status_code != 200:
            return []
        
        data = response.json()
        return data.get("items", [])


# ============================================================================
# TOOL IMPLEMENTATIONS
# ============================================================================

async def fetch_docs(topic: str, language: str = "general") -> str:
    """
    Fetch official documentation for a programming concept.
    Uses Perplexity to search and summarize documentation.
    """
    system_prompt = """You are a documentation expert. Fetch and summarize official documentation.
    
Format your response as:
## [Topic Name]

### Overview
Brief description of what this is.

### Syntax/Usage
```language
code example
```

### Parameters/Properties
- param1: description
- param2: description

### Examples
Practical examples with explanations.

### Common Pitfalls
Things to watch out for.

### See Also
- Related concepts
"""
    
    user_prompt = f"Fetch documentation for '{topic}' in {language}. Include syntax, examples, and common use cases."
    
    result = await call_perplexity(system_prompt, user_prompt)
    return f"📚 **Documentation: {topic}**\n\n{result}"


async def search_code_examples(query: str, language: str, max_results: int = 3) -> str:
    """
    Search for real-world code examples from GitHub.
    Returns practical code snippets with explanations.
    """
    # First, try GitHub search
    github_results = await search_github(query, language, max_results)
    
    # Then use Perplexity to generate practical examples
    system_prompt = f"""You are a senior {language} developer. Provide practical code examples.

Format each example as:
### Example [N]: [Title]
**Use case:** Brief description

```{language}
// Complete, runnable code
```

**Explanation:** Step-by-step breakdown
**Best Practices:** Key things to note
"""
    
    user_prompt = f"""Provide {max_results} practical {language} code examples for: "{query}"

Make examples:
1. Production-ready and well-commented
2. Follow best practices
3. Handle edge cases
4. Be runnable as-is"""
    
    result = await call_perplexity(system_prompt, user_prompt)
    
    # Add GitHub sources if available
    sources = ""
    if github_results and not github_results[0].get("error"):
        sources = "\n\n---\n📎 **GitHub References:**\n"
        for item in github_results[:3]:
            repo = item.get("repository", {}).get("full_name", "Unknown")
            path = item.get("path", "")
            sources += f"- [{repo}/{path}]({item.get('html_url', '#')})\n"
    
    return f"💻 **Code Examples: {query}**\n\n{result}{sources}"


async def explain_concept(concept: str, difficulty: str = "intermediate", include_code: bool = True) -> str:
    """
    Get an AI-powered explanation with analogies and examples.
    """
    difficulty_context = {
        "beginner": "Explain like I'm new to programming. Use simple analogies.",
        "intermediate": "Assume familiarity with basic programming concepts.",
        "advanced": "Dive deep into internals, optimizations, and edge cases."
    }
    
    code_instruction = "Include practical code examples." if include_code else "Focus on conceptual explanation without code."
    
    system_prompt = f"""You are an expert CS educator. Explain concepts clearly and memorably.

{difficulty_context.get(difficulty, difficulty_context['intermediate'])}

Format your explanation as:
## [Concept Name]

### 🎯 What is it?
One-line definition.

### 💡 Simple Analogy
Real-world analogy to understand the concept.

### 🔍 How it Works
Step-by-step explanation.

### ✅ When to Use
- Use case 1
- Use case 2

### ❌ When NOT to Use
- Anti-pattern 1

### 📝 Code Example (if applicable)
```language
// Practical example
```

### 🏋️ Practice Question
A question to test understanding.
"""
    
    user_prompt = f"Explain '{concept}' for a {difficulty} level learner. {code_instruction}"
    
    result = await call_perplexity(system_prompt, user_prompt)
    return f"🧠 **Concept Explanation: {concept}** (Level: {difficulty.title()})\n\n{result}"


async def get_interview_questions(topic: str, company_level: str = "general", count: int = 5) -> str:
    """
    Generate interview questions for a given topic.
    """
    level_context = {
        "FAANG": "Focus on system design, scalability, and edge cases. Include follow-up questions.",
        "startup": "Balance between practical coding and system thinking. Include real-world scenarios.",
        "general": "Cover fundamentals with moderate complexity."
    }
    
    system_prompt = f"""You are a senior tech interviewer at a {company_level} company.

Generate interview questions with this format for each:

### Question [N]: [Title]
**Difficulty:** Easy/Medium/Hard
**Company Tags:** Google, Amazon, etc.

**Question:**
The actual interview question.

**Key Points to Cover:**
- Point 1
- Point 2

**Sample Answer:**
A concise, strong answer.

**Follow-up Questions:**
- Follow-up 1
- Follow-up 2
"""
    
    user_prompt = f"""Generate {count} interview questions about '{topic}' for {company_level} level interviews.
    
{level_context.get(company_level, level_context['general'])}

Mix difficulty levels and include both conceptual and practical questions."""
    
    result = await call_perplexity(system_prompt, user_prompt)
    return f"🎯 **Interview Questions: {topic}** ({company_level.upper()} Level)\n\n{result}"


async def get_learning_resources(topic: str, resource_type: str = "all") -> str:
    """
    Find curated learning resources for a topic.
    """
    type_filter = "" if resource_type == "all" else f"Focus on {resource_type}s."
    
    system_prompt = """You are a learning curator. Recommend the best resources.

Format your response as:

## 📚 Books
- **[Title]** by Author - Brief description

## 🎥 Video Courses
- **[Course Name]** on Platform - Description, level

## 📝 Tutorials & Articles
- **[Title]** - Platform/Author - Brief description

## 🛠️ Practice Platforms
- **[Platform]** - What it offers

## 💡 Tips
Best practices for learning this topic.
"""
    
    user_prompt = f"Recommend the best learning resources for '{topic}'. {type_filter} Include free and paid options."
    
    result = await call_perplexity(system_prompt, user_prompt)
    return f"📖 **Learning Resources: {topic}**\n\n{result}"
