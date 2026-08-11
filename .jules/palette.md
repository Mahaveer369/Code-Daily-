## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Unlinked Form Labels Impair Accessibility
**Learning:** Found that form labels for critical fields (like Email and Password in login forms) lacked the `htmlFor` attribute linking them to their corresponding `input` fields via `id`. This prevents screen readers from properly identifying the fields and removes the UX benefit of focusing the input when clicking the label.
**Action:** Always link `<label>` elements to their corresponding `<input>` elements using matching `htmlFor` and `id` attributes to ensure screen reader support and proper focus behavior upon clicking.
