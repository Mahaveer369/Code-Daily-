## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Fake Buttons Break Keyboard Accessibility
**Learning:** Using `<div>` or `<span>` tags with `onClick` handlers (like the window control dots in the code playground) creates elements that screen readers cannot identify as interactive, and they lack native keyboard focus and activation support.
**Action:** Always use native `<button>` tags for interactive elements. Ensure they have clear `aria-label`s if they lack text content, and include `focus-visible` styling (e.g., `focus-visible:ring-2`) to support keyboard navigation.
