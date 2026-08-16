## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Form Label Accessibility and Associated Inputs
**Learning:** React form labels (`<label>`) need their `htmlFor` tags specifically linked to the `id` tags of the corresponding `input` fields for adequate screen reader support and proper focus handling.
**Action:** Always verify that every `<label>` tag possesses a matching `htmlFor` prop, correctly associating it with an `<input>` field's `id`. For icon-only buttons, always provide an `aria-label`.
