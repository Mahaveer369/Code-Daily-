<div align="center">

# 🚀 Code Daily - AI-Powered Learning Platform

A comprehensive CS learning platform with **Docker-sandboxed code execution**, interactive Monaco editor, and AI-powered assistance.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://djangoproject.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://docker.com)

</div>

---

## 📖 The Story So Far

Code Daily started as a vision to create an interactive, secure, and robust platform for computer science education. Over its development cycle, it has evolved into a powerful multi-service application.

Here is what has happened so far:
1. **Interactive Frontend:** We built a highly responsive React frontend using Vite and TypeScript. We integrated the VS Code-powered **Monaco Editor** to provide syntax highlighting, auto-completion, and a terminal-like experience right in the browser.
2. **Robust Backend:** A Django REST API was established to handle user requests, enforce rate limiting, and log code executions, ensuring the system remains stable under load.
3. **Secure Sandboxing:** To allow users to run arbitrary Python, JavaScript, and SQL code safely, we implemented a FastAPI-based **Executor Service**. This service takes incoming code and runs it inside tightly constrained, ephemeral **Docker containers** (no network access, 100MB memory limit, 5s timeout).
4. **AI Integration:** An MCP Server was built to provide intelligent documentation and learning tools. Jules (the AI Assistant) was heavily involved in shaping the features, optimizing the architecture, and squashing bugs.

---

## 🏗️ How the Code is Structured

The repository is built on a modern **multi-service architecture** to ensure separation of concerns and high scalability.

### 1. Frontend (`/components`, `/services`, `/root`)
- **Tech:** React 19, Vite, TypeScript, Tailwind CSS, Monaco Editor.
- **Role:** Presents the `CodePlayground` to the user. It handles the code editor state, captures user input, and simulates local persistence for lessons using `localStorage`.

### 2. Django Backend (`/backend`)
- **Tech:** Django, Django REST Framework, PostgreSQL.
- **Role:** Acts as the primary API gateway. It receives code execution requests from the frontend, applies rate limits (30 req/min for authenticated, 10 for anonymous), logs executions, and routes the validated request to the Executor Service.

### 3. FastAPI Executor Service (`/executor_service`)
- **Tech:** FastAPI, Uvicorn, Docker SDK, Pydantic.
- **Role:** Handles the actual execution of user code. It communicates with the host's Docker daemon to spin up isolated containers based on pre-built images for Python, JS, and SQL. It manages timeouts, memory limits, and captures `stdout/stderr`.

### 4. MCP Server (`/mcp-server`)
- **Tech:** Python.
- **Role:** Provides AI-powered learning tools and intelligent documentation integrations.

---

## 🤖 What Jules Does

**Jules** is the extremely skilled AI software engineering assistant working on this repository. Here is how Jules contributes to Code Daily:

- **Feature Implementation:** Jules actively writes code across the entire stack. From building out React components in the frontend to wiring up complex asynchronous logic in the FastAPI Executor Service.
- **Bug Squashing & Testing:** Jules identifies and resolves bugs. Jules writes and runs tests using `vitest` (Frontend), `pytest` (Executor/MCP), and Django's test framework to ensure everything runs smoothly.
- **Code Refactoring & Optimization:** Jules ensures the codebase remains clean, performant, and adheres to best practices, such as mocking API calls during tests and correctly configuring Docker sandboxing.
- **Documentation & Context:** Jules maintains up-to-date documentation (like this `README.md` and `KNOWLEDGE.md`) and strictly follows the instructions in the `AGENTS.md` and memory constraints to ensure code correctness and safety.

Whenever a user requests a change, Jules explores the codebase, forms a step-by-step plan, verifies all actions, and ensures safe, tested code is committed.

---

## ✨ Features

- **🎯 Monaco Code Editor** - VS Code-powered editor with syntax highlighting, autocomplete, and bracket matching
- **🐳 Docker Sandbox Execution** - Secure, isolated code execution with memory/CPU limits
- **🔐 Multi-language Support** - Python, JavaScript, and SQL execution
- **📊 Execution History** - Track past code runs with execution times
- **🤖 AI-Powered Assistance** - Integrated Perplexity API for intelligent help
- **🔒 Rate Limiting** - 30 req/min (authenticated) or 10 req/min (anonymous)
- **📝 MCP Server** - Intelligent documentation and learning tools

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Mahaveer369/Code-Daily-.git
cd Code-Daily-

# Start all services
chmod +x start-docker.sh
./start-docker.sh
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Executor Service**: http://localhost:8001

### Option 2: Manual Setup

**Prerequisites**: Node.js, Python 3.11+, Docker

```bash
# Terminal 1: Frontend
npm install && npm run dev

# Terminal 2: Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000

# Terminal 3: Executor Service
cd executor_service
pip install -r requirements.txt
python main.py
```

---

## 📚 Documentation

- **[KNOWLEDGE.md](./KNOWLEDGE.md)** - Complete A-Z technical documentation
- **[COMMANDS.md](./COMMANDS.md)** - All terminal commands reference

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Mahaveer369">Mahaveer</a>
</div>
