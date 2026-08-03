## 2024-06-25 - Interactive Window Controls Accessibility
**Learning:** Found interactive macOS-style window control dots (Reset, Clear, Run) implemented as inaccessible `<div>` tags with `onClick` handlers. This completely prevented keyboard navigation and screen reader access to essential functionality.
**Action:** Always use native `<button>` elements for interactive controls, especially icon-only ones, and ensure they have `aria-label` attributes and clear `focus-visible` styling (e.g., `focus-visible:ring-2`) to support keyboard navigation.
