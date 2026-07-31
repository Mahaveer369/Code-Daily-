## 2024-05-24 - Missing ARIA labels and focus states on icon buttons
**Learning:** This app heavily relies on icon-only buttons (like the ChatBot floating action button and send button) without `aria-label` attributes, making them inaccessible to screen readers. Furthermore, keyboard users lack clear focus indicators (`focus-visible` classes) on many interactive elements.
**Action:** Always verify icon-only buttons have descriptive `aria-label`s and ensure interactive elements provide a visible focus ring for keyboard navigation (`focus-visible:ring-2`, etc.).
