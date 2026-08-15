## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Inaccessible Custom UI Controls (divs as buttons)
**Learning:** Custom UI controls intended to mimic OS features (like macOS-style window control dots) are frequently built using `<div>` elements with `onClick` handlers. This creates inaccessible elements that lack keyboard focus support, semantic meaning, and screen reader announcements.
**Action:** Always refactor interactive `<div>` or `<span>` elements into semantic `<button>` tags, ensuring they have appropriate `aria-label`s and `focus-visible` styles for keyboard navigation.
