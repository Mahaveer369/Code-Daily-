## 2024-05-24 - [Fix XSS Vulnerability in MarkdownRenderer]
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML`
**Learning:** `dangerouslySetInnerHTML` was being used to inject AI-generated SVG images into the DOM without prior sanitization. This is dangerous since SVG can contain `<script>` tags or inline event handlers like `onload` or `onerror` which execute JavaScript.
**Prevention:** Any dynamic content (especially if generated or fetched externally) being injected as HTML or SVG via `dangerouslySetInnerHTML` must be sanitized first, e.g. using `DOMPurify`.

## 2024-10-26 - [Fix Authorization Bypass in Local Login Fallback]
**Vulnerability:** Authorization bypass via email address string matching in local fallback login flow.
**Learning:** The fallback authentication system (`handleContinueLocally`) was automatically granting administrative access if the provided string (email address) contained the substring 'admin'. This meant any attacker could bypass normal authentication and escalate their privileges by using an arbitrary email like `user-admin@example.com` or `admin@test.com`.
**Prevention:** Never infer user roles or permissions based on string matching against user-provided input (like email addresses). Roles must always be strictly verified against a trusted backend authority, and in local fallback environments, default to the lowest privilege level ('user').
