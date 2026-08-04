## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2026-08-04 - Form Labels Unlinked from Inputs
**Learning:** Form labels must be explicitly linked to inputs via `htmlFor` and `id` for screen readers to properly announce the input's purpose, and for clicking the label to focus the input.
**Action:** Always verify that every `<label>` tag includes an `htmlFor` attribute matching its corresponding `<input>`'s `id` attribute.
