## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2026-08-12 - Semantic Elements for Custom Controls
**Learning:** Decorative or custom UI elements that serve as interactive controls (like the 'window control' dots in the code editor) are frequently implemented using non-semantic tags like `<div>` with `onClick` handlers. This pattern completely breaks keyboard navigation and screen reader accessibility, rendering the controls unusable for assistive technology users.
**Action:** Always replace interactive `<div>` tags with native `<button>` elements. Ensure these custom controls have descriptive `aria-label` attributes and clear `focus-visible` states so they are both discoverable by screen readers and operable via keyboard.
