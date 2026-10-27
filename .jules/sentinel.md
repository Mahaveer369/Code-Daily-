## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-27 - [Fix Hardcoded Firebase Secrets]
**Vulnerability:** Hardcoded Firebase secrets/API keys fallback strings in code.
**Learning:** Fallback strings in configuration loading (like `import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6JRK0s2xeVhe86q2lJEe6tl-OMuNPpuI"`) commit sensitive secrets directly into version control, making them accessible to attackers. This is a critical security vulnerability even if the intent was to provide developer convenience.
**Prevention:** Always rely strictly on environment variables for sensitive configurations. Do not use string literal fallbacks for API keys or secrets. Handle missing configurations gracefully in the application code without exposing secrets.
