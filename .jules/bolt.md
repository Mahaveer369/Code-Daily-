## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## 2024-03-08 - O(1) Hash Map lookups inside list mapping loops
**Learning:** When mapping over large arrays (like `COURSES.map`) and doing a lookup (like `.find()` on `userProgress`) inside that loop, the complexity balloons to O(N * M) which causes a performance hit on render loops.
**Action:** Use `useMemo` at the top level of the component to pre-calculate a derived hash map (e.g. `Map<string, number>`) from the array, enabling O(1) lookups and reducing the overall render complexity to O(N + M).
