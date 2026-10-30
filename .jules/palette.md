## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2026-10-30 - Prevent Redundant SVG Screen Reader Announcements
**Learning:** When an `aria-label` is added to an icon-only button, screen readers may still try to announce the nested `<svg>` element, creating confusion or redundant noise.
**Action:** Add `aria-hidden="true"` to any `<svg>` nested inside a button that already provides its context via `aria-label`.
