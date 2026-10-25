## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-25 - [Fix Remote Code Execution vulnerability in fallback executor]
**Vulnerability:** Remote Code Execution (RCE) via `SubprocessExecutor`
**Learning:** When Docker is unavailable, the `DockerExecutor` would fall back to a `SubprocessExecutor` which passed user-submitted code directly to `subprocess.run` (e.g., `subprocess.run(["python3", "-c", code], ...)`). This bypassed all sandboxing and allowed arbitrary code execution directly on the host system.
**Prevention:** The executor service now strictly requires Docker for sandboxed code execution. If Docker is unavailable, execution is disabled via a fail-safe `DummyExecutor` that simply returns a security error. Never fall back to insecure local execution for arbitrary user code.
