## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-05-24 - [Fix Hardcoded Secrets in Firebase Config]
**Vulnerability:** Hardcoded API keys and configuration secrets
**Learning:** `services/firebase.ts` contained hardcoded API keys and sensitive project configuration values as fallbacks when environment variables were missing. These secrets can easily be leaked in public repositories or client-side bundles.
**Prevention:** Configuration should rely exclusively on environment variables (e.g. `import.meta.env`) and never have hardcoded fallback values in source code. We must fail securely or gracefully if required secrets are missing, rather than including them directly.
