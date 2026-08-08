## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-08-08 - Use semantic button tags over clickable div elements for keyboard accessibility
**Learning:** Interactive elements such as custom styled icon "dots" or toggles are frequently implemented as `div` tags with `onClick` handlers. This creates a trap for keyboard users who cannot tab to or activate these elements.
**Action:** Always replace `div` based buttons with native `<button>` tags, maintaining existing utility classes while adding specific `focus-visible` styles and `aria-label`s for screen reader support.
