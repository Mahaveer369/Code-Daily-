## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-24 - Accessibility Issue Pattern with Multiple Icon-Only Action Buttons
**Learning:** Discovered a recurring accessibility pattern across the application where various utility and action buttons (e.g., Download PDF, Clear Console, Add Bookmark) rely solely on icons without text. The previous fix on chatbot buttons was not an isolated incident.
**Action:** Need to systematically audit and add `aria-label` attributes to all utility icon buttons across the codebase to ensure screen reader users can identify their function.
