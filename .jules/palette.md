## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-05-15 - Unlinked Form Labels Impair Screen Reader Experience
**Learning:** Using simple `<label>` elements without explicitly linking them to their corresponding `<input>` fields (via `htmlFor` and `id` attributes) breaks screen reader announcements when navigating form fields. Additionally, clicking the unlinked label text fails to focus the input field, reducing usability for all users, especially those using pointers.
**Action:** Always link a `<label>` to its `<input>` by matching the `htmlFor` attribute of the label with the `id` attribute of the input.
