## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-30 - [Replace cryptographically weak Math.random() with crypto.randomUUID()]
**Vulnerability:** Use of cryptographically weak `Math.random()` for generating unique identifiers (verification codes, user IDs).
**Learning:** `Math.random()` provides predictable random numbers, making it unsuitable for generating unique or secure identifiers, such as verification codes, which could potentially be guessed or brute-forced if used for security purposes.
**Prevention:** Use `crypto.randomUUID()` to generate secure, unpredictable universally unique identifiers instead of relying on `Math.random()`.
