## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## $(date +%Y-%m-%d) - Array find inside loop (O(n²) problem)
**Learning:** Calling `.find()` inside a `.map()` loop creates an O(n²) time complexity operation which scales poorly as data structures grow. The dashboard was previously calling `.find()` on the user's progress history for every available course rendering in the dashboard.
**Action:** Always replace O(n²) nested search loops in frontend components by pre-computing a lookup map (using `useMemo` in React) to change the time complexity to O(n) hash map lookups.
