## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.

## 2024-08-12 - useMemo for calculations inside render loops
**Learning:** Calculating derived state within a `.map()` loop (like `getCourseProgressPercent` inside `COURSES.map`) causes O(N*M) operations during every render cycle (where N is courses and M is user progress items).
**Action:** Use `useMemo` to pre-calculate these derived values into a hash map once when dependencies change, making the render loop lookup O(1).
