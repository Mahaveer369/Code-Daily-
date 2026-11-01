## 2024-05-24 - Missing ARIA labels and focus states on icon buttons
**Learning:** This app heavily relies on icon-only buttons (like the ChatBot floating action button and send button) without `aria-label` attributes, making them inaccessible to screen readers. Furthermore, keyboard users lack clear focus indicators (`focus-visible` classes) on many interactive elements.
**Action:** Always verify icon-only buttons have descriptive `aria-label`s and ensure interactive elements provide a visible focus ring for keyboard navigation (`focus-visible:ring-2`, etc.).

## 2024-05-25 - ARIA labels for responsive buttons
**Learning:** In this application, many buttons are responsive and hide their descriptive text on smaller screens (e.g. using `hidden sm:inline`). This creates an accessibility issue for screen reader users on mobile devices, as the button effectively becomes an icon-only button without an accessible name.
**Action:** When working with responsive buttons that conditionally hide their text, always provide a permanent `aria-label` attribute on the `<button>` element to ensure the accessible name is available regardless of viewport size, and apply `aria-hidden="true"` to any nested decorative SVGs.
