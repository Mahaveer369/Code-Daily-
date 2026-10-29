## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2025-02-28 - [Fix Insecure Randomness in User IDs and Verification Codes]
**Vulnerability:** Weak PRNG `Math.random()` was being used to generate sensitive data (user IDs and verification codes).
**Learning:** `Math.random()` is not cryptographically secure, meaning its outputs can be predicted or lead to collisions, posing a security risk for sensitive identifiers.
**Prevention:** Always use cryptographically secure random number generators (CSPRNG) like `crypto.randomUUID()` or `crypto.getRandomValues()` for sensitive identifiers.
