## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-05-25 - [Remove Hardcoded Firebase API Key]
**Vulnerability:** A hardcoded Firebase API Key was present in `services/firebase.ts`.
**Learning:** Hardcoded API keys in source code (even for client-side use) are poor practice, as they get tracked in version control and can easily be scraped if the repository is ever made public or accessed inappropriately.
**Prevention:** Always use environment variables to store secrets and API keys, and access them using mechanisms like `import.meta.env` (for Vite) or `process.env`.
