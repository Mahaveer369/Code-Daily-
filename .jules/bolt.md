## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.

## 2024-08-08 - O(n) Hash Map Lookup for Render Loops
**Learning:** Found an O(n^2) bottleneck in `Dashboard.tsx` where an `Array.prototype.find()` was used inside a `map()` loop over courses during rendering. Using `useMemo` to construct a hash map reduces this to O(n) creation + O(1) lookups, providing a significant performance boost for list rendering.
**Action:** Always look for O(n^2) nested loops in React render methods and replace them with O(n) hash map lookups using `useMemo`.
