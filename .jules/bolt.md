## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## 2024-08-16 - O(N) Lookups in Render Loops
**Learning:** Found an $O(N)$ `.find()` operation running on every iteration of a render loop in `Dashboard.tsx`. This causes $O(N \cdot M)$ complexity which can cause jank on re-renders, especially when states like `userProgress` update frequently.
**Action:** Always extract $O(N)$ lookups outside of render loops. Use `React.useMemo` to pre-calculate values into an $O(1)$ lookup hash map before mapping over components to ensure $O(N+M)$ complexity.
