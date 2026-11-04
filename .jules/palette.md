## 2025-02-28 - ARIA labels for icon-only dashboard buttons
**Learning:** Found an icon-only "Download PDF" button in the dashboard that was visually informative but inaccessible to screen readers. Relying solely on standard `title` attributes on buttons does not reliably substitute for `aria-label` when conveying action intent to all assistive technologies.
**Action:** Always add an explicit `aria-label` to buttons containing only icons, and pair it with `aria-hidden="true"` on the nested `<svg>` to ensure the button's action is announced cleanly without redundant SVG element noise.
