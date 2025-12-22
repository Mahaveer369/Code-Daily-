# MCP Server for Code-Daily

An intelligent documentation assistant powered by MCP (Model Context Protocol).

## Features

- 📚 **fetch_docs** - Fetch official documentation for any programming concept
- 💻 **search_code_examples** - Find real-world code examples from GitHub
- 🧠 **explain_concept** - AI-powered explanations with analogies
- 🎯 **get_interview_questions** - Generate interview prep questions
- 📖 **get_learning_resources** - Find tutorials and courses

## Setup

```bash
cd mcp-server
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

## Usage

### Standalone
```bash
python server.py
```

### With Claude Desktop
Add to `~/.config/claude_desktop/config.json`:
```json
{
  "mcpServers": {
    "code-daily-docs": {
      "command": "python",
      "args": ["/path/to/mcp-server/server.py"]
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PERPLEXITY_API_KEY` | Yes | Perplexity API key for AI responses |
| `GITHUB_TOKEN` | No | GitHub token for higher rate limits |
