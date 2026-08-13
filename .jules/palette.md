## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-24 - Form Label Click Targets
**Learning:** Form labels missing explicit `htmlFor` attributes linked to the `id` of their target inputs fail to transfer focus when clicked, significantly degrading usability for mouse users and reducing standard accessibility compliance.
**Action:** Always verify that `<label>` tags explicitly link to their `<input>` fields using matching `htmlFor` and `id` props, particularly in authentication and data-entry forms.