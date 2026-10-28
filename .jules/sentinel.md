## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-28 - [Fix Client-side Code Execution Vulnerability]
**Vulnerability:** Arbitrary JavaScript code execution vulnerability through `new Function()`.
**Learning:** The code playground feature used `new Function('console', ...)` as a fallback to execute user-provided JavaScript code locally in the browser when the backend was unavailable. While it is a "playground," running untrusted code directly in the main window's context exposes the application to Cross-Site Scripting (XSS). An attacker could craft malicious code that, if run by a user (e.g., through a shared link or social engineering), could steal tokens, access localStorage, or perform actions on the user's behalf.
**Prevention:** Never use `eval()` or `new Function()` to execute untrusted code in the main browser context. If client-side execution is strictly required, use isolated environments like Sandboxed `iframe`s with restricted permissions (`sandbox="allow-scripts"` without `allow-same-origin`) or Web Workers. In this case, we enforce execution solely via the secure backend Docker sandbox.
