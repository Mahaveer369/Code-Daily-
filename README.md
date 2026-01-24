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

## ✨ Features

- **🎯 Monaco Code Editor** - VS Code-powered editor with syntax highlighting, autocomplete, and bracket matching
- **🐳 Docker Sandbox Execution** - Secure, isolated code execution with memory/CPU limits
- **🔐 Multi-language Support** - Python, JavaScript, and SQL execution
- **📊 Execution History** - Track past code runs with execution times
- **🤖 AI-Powered Assistance** - Integrated Perplexity API for intelligent help
- **🔒 Rate Limiting** - 30 req/min (authenticated) or 10 req/min (anonymous)
- **📝 MCP Server** - Intelligent documentation and learning tools

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                             │
│                      CodePlayground (Monaco)                        │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ POST /api/execute/
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DJANGO BACKEND (:8000)                           │
│             Rate Limiting • Auth • Logging                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ POST /execute
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 EXECUTOR SERVICE (:8001)                            │
│            FastAPI + Docker SDK                                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ docker.containers.run()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   DOCKER SANDBOX CONTAINER                          │
│  100MB mem • 5s timeout • No network • Read-only FS                │
└─────────────────────────────────────────────────────────────────────┘
```

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

## 📁 Project Structure

```
Code-Daily-/
├── components/              # React components
│   └── CodePlayground.tsx   # Monaco editor + execution UI
├── backend/                 # Django REST API
│   ├── executor/            # Code execution app
│   │   ├── views.py         # API endpoints
│   │   └── models.py        # ExecutionLog model
│   └── config/              # Django settings
├── executor_service/        # FastAPI code executor
│   ├── main.py              # FastAPI application
│   ├── executor.py          # Docker container management
│   └── sandboxes/           # Dockerfile for each language
├── mcp-server/              # MCP documentation tools
│   └── tools.py             # AI-powered learning tools
├── docker-compose.yml       # Multi-service orchestration
├── KNOWLEDGE.md             # Complete technical documentation
└── COMMANDS.md              # Terminal commands reference
```

---

## 🛡️ Security

The Docker sandbox provides multiple layers of protection:

| Constraint | Value | Purpose |
|------------|-------|---------|
| Memory | 100MB | Prevents memory bombs |
| Timeout | 5 seconds | Prevents infinite loops |
| Network | Disabled | No data exfiltration |
| Filesystem | Read-only | Prevents persistence |
| User | nobody | No privilege escalation |

---

## 🔧 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, TypeScript, Monaco Editor |
| **Backend** | Django, Django REST Framework, JWT Auth |
| **Executor** | FastAPI, Docker SDK, Pydantic |
| **Database** | PostgreSQL 15 |
| **Orchestration** | Docker Compose |

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
