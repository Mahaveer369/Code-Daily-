## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## 2025-03-05 - useMemo for O(N*M) loop optimizations in render
**Learning:** During rendering, nested loops like `.find()` inside a `.map()` mapping over a fixed list (e.g. mapping `COURSES` and then finding progress in `userProgress`) are performance bottlenecks. This results in O(N*M) lookups on every render tick.
**Action:** Always check if we can memoize array lookups by pre-computing a `Map` mapping `id` -> `data` outside the render loop using `useMemo` where the dependencies are the source array, transforming an O(N*M) operation into O(N+M).
