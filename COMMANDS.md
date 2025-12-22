# Code-Daily Application Commands

This file contains all terminal commands needed to run the Code-Daily application.

---

## 🚀 Quick Start (Run Everything)

```bash
# Terminal 1: Backend (Django)
cd /home/mahaveer/Desktop/Code-Daily-/backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend (Vite/React)
cd /home/mahaveer/Desktop/Code-Daily-
npm run dev

# Terminal 3: MCP Server (Optional - for Claude Desktop)
cd /home/mahaveer/Desktop/Code-Daily-/mcp-server
source venv/bin/activate
python server.py
```

---

## 📦 Backend (Django REST API)

### First Time Setup
```bash
cd /home/mahaveer/Desktop/Code-Daily-/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

### Run Backend Server
```bash
cd /home/mahaveer/Desktop/Code-Daily-/backend
source venv/bin/activate
python manage.py runserver
```
**Access:** http://localhost:8000

### Admin Panel
**URL:** http://localhost:8000/admin

---

## 🎨 Frontend (React + Vite)

### First Time Setup
```bash
cd /home/mahaveer/Desktop/Code-Daily-
npm install
```

### Run Frontend Dev Server
```bash
cd /home/mahaveer/Desktop/Code-Daily-
npm run dev
```
**Access:** http://localhost:5173

### Build for Production
```bash
cd /home/mahaveer/Desktop/Code-Daily-
npm run build
```

---

## 🤖 MCP Server (Intelligent Documentation)

### First Time Setup
```bash
cd /home/mahaveer/Desktop/Code-Daily-/mcp-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your PERPLEXITY_API_KEY
```

### Run MCP Server
```bash
cd /home/mahaveer/Desktop/Code-Daily-/mcp-server
source venv/bin/activate
python server.py
```

### Test MCP Tools
```bash
cd /home/mahaveer/Desktop/Code-Daily-/mcp-server
source venv/bin/activate
python test_tools.py
```

---

## 🔄 Git Commands

### Push Changes to GitHub
```bash
cd /home/mahaveer/Desktop/Code-Daily-
git add -A
git commit -m "Your commit message"
git push origin main
```

### Pull Latest Changes
```bash
cd /home/mahaveer/Desktop/Code-Daily-
git pull origin main
```

---

## 📁 Project Structure

```
Code-Daily-/
├── backend/          # Django REST API (Port 8000)
│   ├── manage.py
│   ├── venv/
│   └── .env          # Backend secrets (PERPLEXITY_API_KEY, DB config)
│
├── mcp-server/       # MCP Server for AI tools
│   ├── server.py     # Main MCP server
│   ├── tools.py      # Tool implementations
│   ├── venv/
│   └── .env          # MCP secrets (PERPLEXITY_API_KEY)
│
├── components/       # React components
├── services/         # Frontend services (gemini.ts, firebase.ts)
├── package.json      # Frontend dependencies
└── .env              # Frontend secrets (VITE_PERPLEXITY_API_KEY)
```

---

## 🔑 Environment Variables Summary

| File | Variable | Purpose |
|------|----------|---------|
| `backend/.env` | `PERPLEXITY_API_KEY` | AI explanations in backend |
| `backend/.env` | `GOOGLE_CLIENT_ID/SECRET` | OAuth login |
| `mcp-server/.env` | `PERPLEXITY_API_KEY` | MCP tool AI responses |
| `mcp-server/.env` | `GITHUB_TOKEN` | (Optional) Higher GitHub API limits |
| `.env` (root) | `VITE_PERPLEXITY_API_KEY` | Frontend chatbot |
