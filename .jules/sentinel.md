## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-08-15 - [Remove insecure SubprocessExecutor fallback in code executor]
**Vulnerability:** Arbitrary Code Execution (RCE) on the host server
**Learning:** `executor_service/executor.py` had a fallback mechanism (`SubprocessExecutor`) that would use `subprocess.run` to execute user-provided code directly on the host if Docker was unavailable. This bypassed all sandbox limits (memory, networking, filesystem isolation, timeout bypasses in some scenarios) and allowed trivial host takeover.
**Prevention:** Systems designed for sandboxed code execution should fail securely (Fail-Safe Default) rather than falling back to an insecure, native execution model. If the secure sandbox environment (Docker) is unavailable, the service should reject execution requests entirely rather than compromise the host server.