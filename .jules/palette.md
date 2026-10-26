## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-10-26 - Interactive UI Decorators (Window Dots) Need Semantics
**Learning:** Decorative UI elements that have functionality attached via `onClick` (like window control dots) are inherently inaccessible when implemented as `<div>` tags. They lack keyboard focusability and screen reader semantics.
**Action:** Always implement interactive visual elements as semantic `<button>` tags with descriptive `aria-label` attributes and clear `focus-visible` styling to ensure they are accessible via keyboard and screen readers, even if they appear purely decorative.
