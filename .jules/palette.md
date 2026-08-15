## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.
## 2024-05-24 - Explicit Form Label Links
**Learning:** Form labels in this React application must be explicitly linked to their corresponding input fields using matching `htmlFor` and `id` attributes. Implicit wrapping is either not used or not sufficient for the current styling/accessibility goals, which caused screen reader and focus issues.
**Action:** Always ensure any `<label>` added or modified has a `htmlFor` attribute that exactly matches the `id` of its associated `<input>`, `<select>`, or `<textarea>`.
