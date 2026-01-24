# Code Playground - Technical Knowledge Base

Complete A-Z documentation of the Docker-sandboxed code execution system.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Request Flow (A-Z)](#request-flow-a-z)
4. [Frontend Components](#frontend-components)
5. [Backend API](#backend-api)
6. [Executor Service](#executor-service)
7. [Docker Sandbox](#docker-sandbox)
8. [Security Model](#security-model)
9. [File Reference](#file-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   CodePlayground.tsx                         │   │
│  │  ┌─────────────────┐    ┌─────────────────────────────────┐ │   │
│  │  │  Monaco Editor  │    │         Terminal Output          │ │   │
│  │  │  (code input)   │    │         (execution result)       │ │   │
│  │  └─────────────────┘    └─────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ POST /api/execute/
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DJANGO BACKEND (:8000)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  executor/views.py                                           │   │
│  │  - Rate limiting (30/min user, 10/min anon)                 │   │
│  │  - Request validation                                        │   │
│  │  - Logging to ExecutionLog model                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ POST /execute
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   EXECUTOR SERVICE (:8001)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  FastAPI + Docker SDK                                        │   │
│  │  - Spawns isolated containers                               │   │
│  │  - Applies resource limits                                   │   │
│  │  - Returns stdout/stderr                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ docker.containers.run()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DOCKER SANDBOX CONTAINER                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Isolated execution environment                              │   │
│  │  - 100MB memory limit                                        │   │
│  │  - 5 second timeout                                          │   │
│  │  - No network access                                         │   │
│  │  - Read-only filesystem                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 19.2.1 | UI framework, component-based architecture |
| **Vite** | 6.2.0 | Development server, bundler, HMR |
| **TypeScript** | 5.8.2 | Type safety, better DX |
| **@monaco-editor/react** | 4.6.0 | VS Code's editor in the browser |

### Backend (Django)

| Library | Purpose |
|---------|---------|
| **Django** | Web framework, ORM, admin |
| **Django REST Framework** | API serializers, views, authentication |
| **httpx** | Async HTTP client to call executor service |
| **djangorestframework-simplejwt** | JWT authentication |
| **django-cors-headers** | CORS handling for frontend |

### Executor Service (FastAPI)

| Library | Purpose |
|---------|---------|
| **FastAPI** | High-performance async API framework |
| **uvicorn** | ASGI server |
| **docker** (Python SDK) | Programmatic Docker container management |
| **pydantic** | Request/response validation |

### Docker Sandboxes

| Image | Base | Size | Purpose |
|-------|------|------|---------|
| `code-sandbox-python` | python:3.11-alpine | ~50MB | Python execution |
| `code-sandbox-javascript` | node:20-alpine | ~60MB | JavaScript execution |
| `code-sandbox-sql` | alpine:3.19 + sqlite | ~10MB | SQL queries |

---

## Request Flow (A-Z)

### Step 1: User Types Code

**File**: `components/CodePlayground.tsx`

```tsx
// Monaco Editor captures user input
<Editor
  language={getMonacoLanguage(language)}  // "python", "javascript", "sql"
  value={code}
  onChange={handleEditorChange}
/>
```

The Monaco Editor provides:
- Syntax highlighting
- Auto-completion
- Bracket matching
- Line numbers

---

### Step 2: User Clicks "Run Code" or Presses Ctrl+Enter

**File**: `components/CodePlayground.tsx`

```tsx
const executeCode = useCallback(async () => {
  setIsRunning(true);
  
  // Call the backend API
  const response = await fetch(`${API_BASE_URL}/api/execute/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: code,
      language: getApiLanguage(language)  // Normalize: "js" -> "javascript"
    })
  });
  
  const result = await response.json();
  // Display result.output or result.error
}, [code, language]);
```

**What happens**:
1. `isRunning` state turns true → spinner shows
2. HTTP POST sent to Django backend
3. Response parsed and displayed

---

### Step 3: Django Receives Request

**File**: `backend/executor/views.py`

```python
class ExecuteCodeView(APIView):
    throttle_classes = [AnonCodeExecutionThrottle, CodeExecutionThrottle]
    
    def post(self, request):
        # 1. Validate input
        serializer = ExecuteCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. Forward to executor service
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                f"{executor_url}/execute",
                json={"code": code, "language": language}
            )
        
        # 3. Log execution
        ExecutionLog.objects.create(...)
        
        return Response(response.json())
```

**Why this layer exists**:
- Rate limiting (protects executor from abuse)
- Authentication (can track user executions)
- Logging (analytics, debugging)
- Abstraction (frontend doesn't know about executor service)

---

### Step 4: Executor Service Runs Code

**File**: `executor_service/main.py`

```python
@app.post("/execute")
async def execute_code(request: ExecuteRequest):
    success, output, error, execution_time_ms = await executor.execute(
        code=request.code,
        language=language
    )
    return ExecuteResponse(...)
```

**File**: `executor_service/executor.py`

```python
async def execute(self, code: str, language: str):
    async with self._semaphore:  # Limit concurrent executions
        return await self._execute_in_container(code, language)
```

The executor:
1. Encodes code as base64 (to safely pass special characters)
2. Spawns a Docker container with resource limits
3. Runs the code inside the container
4. Captures stdout/stderr
5. Returns the result

---

### Step 5: Docker Container Executes Code

**File**: `executor_service/executor.py`

```python
container = self.client.containers.run(
    image="code-sandbox-python:latest",
    command=["sh", "-c", f"echo '{encoded_code}' | base64 -d > /tmp/code.py && python /tmp/code.py"],
    
    # SECURITY LIMITS
    mem_limit="100m",           # 100MB RAM
    memswap_limit="100m",       # No swap
    network_disabled=True,      # No internet
    read_only=True,             # Can't modify filesystem
    tmpfs={'/tmp': 'size=10m'}, # Small writable area
    user="nobody",              # Non-root user
)
```

**Container lifecycle**:
1. Container spawns (takes ~50ms)
2. Code is decoded from base64
3. Code is written to `/tmp/code.py`
4. Python runs the code
5. stdout/stderr are captured
6. Container is destroyed

---

### Step 6: Response Returns to User

The response propagates back:

```
Container → Executor (Docker SDK logs)
         → Executor (FastAPI response)
         → Django (httpx response)
         → Frontend (fetch response)
         → UI (state update)
```

**Final response format**:
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "error": null,
  "execution_time_ms": 45,
  "language": "python"
}
```

---

## Frontend Components

### CodePlayground.tsx

| State | Type | Purpose |
|-------|------|---------|
| `code` | string | Current code in editor |
| `output` | string | stdout from execution |
| `error` | string | stderr or error message |
| `isRunning` | boolean | Shows loading spinner |
| `executionTime` | number | ms taken to execute |
| `history` | array | Last 10 executions |

**Key functions**:

| Function | Purpose |
|----------|---------|
| `executeCode()` | Sends code to API, handles response |
| `handleRun()` | Click handler for "Run Code" button |
| `handleReset()` | Resets code to initial state |
| `handleClear()` | Clears terminal output |
| `getMonacoLanguage()` | Maps language to Monaco syntax |
| `getApiLanguage()` | Normalizes language for API |

---

## Backend API

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/execute/` | Execute code |
| GET | `/api/execute/health/` | Check executor health |

### Models

**ExecutionLog** (`executor/models.py`):
```python
class ExecutionLog(models.Model):
    user = ForeignKey(User)          # Who ran the code
    language = CharField()           # python/javascript/sql
    code_hash = CharField()          # SHA256 for deduplication
    code_length = IntegerField()     # For analytics
    status = CharField()             # success/error/timeout
    execution_time_ms = IntegerField()
    created_at = DateTimeField()
```

### Rate Limiting

| User Type | Limit |
|-----------|-------|
| Authenticated | 30 requests/minute |
| Anonymous | 10 requests/minute |

---

## Executor Service

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/execute` | Run code in sandbox |
| GET | `/health` | Service health check |
| GET | `/` | Service info |

### Configuration (`config.py`)

| Setting | Default | Purpose |
|---------|---------|---------|
| `EXECUTION_TIMEOUT_SECONDS` | 5 | Max execution time |
| `MAX_MEMORY_MB` | 100 | Container memory limit |
| `MAX_OUTPUT_SIZE` | 10000 | Truncate output at 10KB |
| `MAX_CONCURRENT_EXECUTIONS` | 10 | Semaphore limit |

### Fallback Mode

When Docker SDK fails (e.g., version incompatibility), the executor falls back to subprocess:

```python
class SubprocessExecutor:
    async def execute(self, code, language):
        result = subprocess.run(
            ["python3", "-c", code],
            capture_output=True,
            timeout=5
        )
        return True, result.stdout, result.stderr, execution_time
```

⚠️ **Warning**: Fallback mode has no isolation. Use only for development.

---

## Docker Sandbox

### Image Specifications

**Python Sandbox** (`sandboxes/Dockerfile.python`):
```dockerfile
FROM python:3.11-alpine
RUN adduser -D -u 1000 sandbox
USER sandbox
```

**JavaScript Sandbox** (`sandboxes/Dockerfile.javascript`):
```dockerfile
FROM node:20-alpine
RUN adduser -D -u 1000 sandbox
USER sandbox
```

### Container Constraints

| Constraint | Value | Purpose |
|------------|-------|---------|
| Memory | 100MB | Prevents memory bombs |
| CPU | 50% of 1 core | Prevents CPU hogging |
| Network | Disabled | No data exfiltration |
| Filesystem | Read-only | Prevents persistence |
| User | nobody | No privilege escalation |
| Timeout | 5 seconds | Prevents infinite loops |

---

## Security Model

### Threat Mitigation

| Threat | Mitigation |
|--------|------------|
| Fork bomb | Memory limit, process limits |
| Infinite loop | 5-second timeout |
| Network access | Network disabled |
| File exfiltration | Read-only filesystem |
| Resource exhaustion | Semaphore (max 10 concurrent) |
| Code injection | Base64 encoding, container isolation |
| Privilege escalation | Non-root user, no-new-privileges |

### What Users CAN Do

- Print output to stdout
- Use standard library functions
- Basic file I/O in `/tmp` (10MB limit)
- Raise exceptions (captured as stderr)

### What Users CANNOT Do

- Access the internet
- Read host filesystem
- Install packages
- Spawn background processes
- Access other containers
- Run longer than 5 seconds

---

## File Reference

### Frontend (`/components/`)

| File | Lines | Purpose |
|------|-------|---------|
| [CodePlayground.tsx](file:///home/mahaveer/Desktop/Code-Daily-/components/CodePlayground.tsx) | ~320 | Monaco editor + execution UI |

### Backend (`/backend/executor/`)

| File | Purpose |
|------|---------|
| [views.py](file:///home/mahaveer/Desktop/Code-Daily-/backend/executor/views.py) | API views |
| [models.py](file:///home/mahaveer/Desktop/Code-Daily-/backend/executor/models.py) | ExecutionLog model |
| [serializers.py](file:///home/mahaveer/Desktop/Code-Daily-/backend/executor/serializers.py) | Request/response validation |
| [urls.py](file:///home/mahaveer/Desktop/Code-Daily-/backend/executor/urls.py) | URL routing |
| [tests.py](file:///home/mahaveer/Desktop/Code-Daily-/backend/executor/tests.py) | Unit tests |

### Executor Service (`/executor_service/`)

| File | Purpose |
|------|---------|
| [main.py](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/main.py) | FastAPI application |
| [executor.py](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/executor.py) | Docker container management |
| [models.py](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/models.py) | Pydantic models |
| [config.py](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/config.py) | Settings |

### Docker (`/executor_service/sandboxes/`)

| File | Purpose |
|------|---------|
| [Dockerfile.python](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/sandboxes/Dockerfile.python) | Python sandbox image |
| [Dockerfile.javascript](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/sandboxes/Dockerfile.javascript) | Node.js sandbox image |
| [Dockerfile.sql](file:///home/mahaveer/Desktop/Code-Daily-/executor_service/sandboxes/Dockerfile.sql) | SQLite sandbox image |

### Orchestration

| File | Purpose |
|------|---------|
| [docker-compose.yml](file:///home/mahaveer/Desktop/Code-Daily-/docker-compose.yml) | Multi-service deployment |
| [start-docker.sh](file:///home/mahaveer/Desktop/Code-Daily-/start-docker.sh) | Quick start script |

---

## Quick Reference: Start Services

```bash
# Terminal 1: Frontend
npm install && npm run dev

# Terminal 2: Backend
cd backend && source venv/bin/activate
pip install httpx
python manage.py runserver 8000

# Terminal 3: Executor
cd executor_service
pip install -r requirements.txt
python main.py
```

**Or with Docker Compose**:
```bash
chmod +x start-docker.sh
./start-docker.sh
```
