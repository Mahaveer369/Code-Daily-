## 2024-05-14 - Icon-Only Chat Buttons Lack ARIA Labels
**Learning:** Floating action buttons and icon-only inline buttons (like send message buttons) often lack text content. Without an `aria-label`, these critical interaction points are invisible or confusing to screen reader users.
**Action:** Always ensure any icon-only interactive element, such as chat toggles or submit buttons without visible text, includes a descriptive `aria-label` attribute.
## 2024-05-15 - Interactive Custom Controls Must Use Native Buttons
**Learning:** Custom UI controls (like window control dots in a code editor) implemented using `<div>` elements with `onClick` handlers are completely invisible to screen readers and unreachable via keyboard navigation. Additionally, duplicate attributes in JSX like `aria-label` will cause build errors in Vite/esbuild.
**Action:** Always replace `<div>` based interactive elements with native `<button>` tags, include an `aria-label`, and add `focus-visible` styles to ensure keyboard accessibility. Also, ensure JSX attributes are not duplicated.
