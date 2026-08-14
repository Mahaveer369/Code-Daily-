## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Unlinked Form Labels Impair Keyboard and Screen Reader UX
**Learning:** Form labels (`<label>`) without an explicit `htmlFor` attribute linking to the input's `id` fail to provide screen reader context and prevent users from focusing the input by clicking the label text. This is a common oversight in custom-styled forms.
**Action:** Always explicitly link form labels to their inputs using matching `htmlFor` and `id` attributes.
