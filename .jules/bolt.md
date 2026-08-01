## 2025-03-08 - React.memo on pure presentational components

**Learning:** Pure presentational components like `MarkdownRenderer` that receive strings as props but perform heavy operations internally (like regex parsing of markdown) can cause severe typing lag when used in lists or when parent state updates frequently (like controlled input components such as ChatBot).
**Action:** Always wrap heavy pure presentational components with `React.memo` to skip re-renders and prevent performance bottlenecks when parent state changes but props don't.
