## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2025-05-20 - Explicit Form Label Linking
**Learning:** Screen reader users and users with motor difficulties benefit immensely from explicitly linked forms. When a `<label>` lacks an `htmlFor` attribute that matches the `<input>`'s `id`, clicking the label doesn't focus the input, and screen readers may fail to announce the label correctly when the input receives focus.
**Action:** Always link form labels (`<label>`) explicitly to their corresponding inputs (`<input>`, `<textarea>`, `<select>`) using matching `htmlFor` and `id` attributes.
