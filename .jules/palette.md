## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.
## 2024-05-18 - Missing ARIA Labels on Responsive Icon-Only Buttons
**Learning:** Buttons that hide their text on smaller screens (`hidden sm:inline`) become functionally icon-only on mobile devices. If they lack an `aria-label`, they are completely inaccessible to screen readers on those devices, leading to silent failures in user navigation and interactions.
**Action:** Always verify that responsive buttons, where text is hidden conditionally using CSS (like `hidden sm:inline`), explicitly include an `aria-label` or `aria-labelledby` to ensure accessibility remains intact when the text disappears on smaller screens. Additionally, nested SVGs should have `aria-hidden="true"` to prevent redundant reading.
