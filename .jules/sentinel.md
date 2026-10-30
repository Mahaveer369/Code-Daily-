## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-31 - [Remove Hardcoded Firebase API Key]
**Vulnerability:** Hardcoded Firebase API Key and configuration secrets found in `services/firebase.ts`.
**Learning:** Default configuration values were hardcoded as fallbacks if environment variables were missing. This exposes sensitive project identifiers and keys to version control.
**Prevention:** Never hardcode secrets or sensitive keys in the source code. Always rely solely on environment variables or secure secret management systems.
