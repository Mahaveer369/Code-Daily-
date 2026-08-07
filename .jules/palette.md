## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-08-07 - Inaccessible Window Control Dots
**Learning:** Interactive UI controls styled as window dots (e.g., reset, clear, run in CodePlayground) are often implemented using inaccessible `<div>` tags with `onClick` handlers. This prevents keyboard navigation and lacks screen reader support.
**Action:** Always implement interactive UI controls using native `<button>` tags with descriptive `aria-label`s and clear `focus-visible` styles for accessibility.
