from mcp.types import Tool

AVAILABLE_TOOLS = [
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
