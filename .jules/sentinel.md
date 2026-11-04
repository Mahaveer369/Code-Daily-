## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2025-02-27 - [Fix Hardcoded Secrets in Firebase Configuration]
**Vulnerability:** Hardcoded API key and other Firebase configuration details were present as fallbacks in the frontend code (`services/firebase.ts`).
**Learning:** Hardcoding secrets as fallbacks in frontend code exposes them in the built artifacts, allowing attackers to extract them easily. This can lead to unauthorized access to the Firebase project and associated resources.
**Prevention:** Always rely strictly on environment variables for sensitive configuration data. Ensure that the application fails fast (e.g., throws an error) if critical environment variables are missing during initialization.
