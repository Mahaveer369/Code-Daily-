## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.
## 2024-11-06 - Hidden Conditional Text & Mobile ARIA Labels
**Learning:** When text is conditionally hidden via responsive classes (e.g. `hidden sm:inline`) on interactive elements like buttons, it can cause screen readers to read unintuitive labels (like "⌘K") or leave the element completely devoid of context for mobile users if no visual fallback is provided.
**Action:** Always provide an explicit `aria-label` for buttons where primary text is conditionally hidden, and provide a visual icon fallback (e.g. a magnifying glass for search) that is visible when the text is hidden (e.g. `sm:hidden`).
