## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-08-05 - Interactive Divs Used as Controls
**Learning:** Decorative-looking interactive elements (like MacOS-style window control dots) are frequently implemented as `<div>` elements with `onClick` handlers, which fails to provide proper keyboard and screen reader accessibility out of the box.
**Action:** Always convert custom interactive UI controls into native `<button>` tags and ensure they have an `aria-label` and distinct `focus-visible` states so keyboard users can navigate to and operate them.
