# AI App

## Purpose
Integrates External AI services (specifically **Perplexity API**) to enhance the learning experience.

## Features
- **Explain This**: Uses LLMs to simplify complex lesson content based on student difficulty level.
- **Future**: Recommendations, Code debugging assistance.

## Architecture
- **Service Layer (`services.py`)**: Handles the raw HTTP requests to Perplexity. This isolates external API logic from our Views.
- **Views**: Consume the service. If we switch AI providers later (e.g., to OpenAI), we only change `services.py`.
