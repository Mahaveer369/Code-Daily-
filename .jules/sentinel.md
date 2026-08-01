## 2025-02-28 - Cross-Site Scripting (XSS) in MarkdownRenderer
**Vulnerability:** The `MarkdownRenderer` component in `components/MarkdownRenderer.tsx` uses `dangerouslySetInnerHTML={{ __html: svg }}` to render SVG content without sanitization. An attacker could provide a malicious SVG containing script tags or attributes (e.g., `<svg onload="alert(1)">`) to execute arbitrary JavaScript in the user's browser.
**Learning:** React's `dangerouslySetInnerHTML` is inherently dangerous and bypassing it without sanitization allows XSS. Even seemingly safe content like SVGs can carry malicious scripts.
**Prevention:** Always sanitize any dynamic HTML or SVG content before injecting it into the DOM using a library like `dompurify`.
