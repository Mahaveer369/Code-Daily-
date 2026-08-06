## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2026-08-06 - Form Labels Unlinked from Inputs
**Learning:** Form labels missing the `htmlFor` attribute (and inputs missing corresponding `id` attributes) severely break keyboard accessibility and screen reader support, as clicking the label does not focus the input.
**Action:** Always link `<label>` elements to their corresponding `<input>` fields using matching `htmlFor` and `id` attributes to ensure proper accessibility and interaction behavior.
