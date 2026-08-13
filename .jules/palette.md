## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.

## 2024-08-13 - Form Controls Should Rely on Semantic HTML Linking
**Learning:** Labels created with `<label>` wrapping or visually adjacent text are not inherently linked to their `<input>` element for screen readers unless explicitly associated using `htmlFor` matching the input `id`. Without this, accessibility testing and user navigation break. Also, icon-only buttons require explicit `aria-label` tags for screen readers to convey meaning.
**Action:** Always link form labels to their inputs using `htmlFor` and `id`. Use explicit `aria-label` tags for icon-only buttons to improve screen reader accessibility and navigation.
