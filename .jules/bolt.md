## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.

## 2024-08-02 - O(n^2) nested loop in Dashboard mapping
**Learning:** In React components like `Dashboard.tsx`, computing state values during render inside `.map()` functions (e.g. `getCourseProgressPercent` calling `userProgress.find()` inside `COURSES.map()`) introduces an O(n^2) rendering bottleneck, especially when the arrays grow.
**Action:** Use `useMemo` to construct a hash map (O(1) lookups) from the array beforehand so that `.map()` lookups become O(n).
