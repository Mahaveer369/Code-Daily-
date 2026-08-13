## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.

## 2024-08-02 - O(N) nested loops in mapped lists
**Learning:** Array `.find()` and `.filter()` operations inside React `.map()` render loops are a common source of hidden O(M*N) performance bottlenecks, especially when rendering lists like courses or leaderboards that lookup user progress.
**Action:** Extract these expensive lookups into O(1) hash maps by pre-calculating them with `useMemo` at the top level of the component whenever the underlying list changes.
