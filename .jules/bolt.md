## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## 2024-08-01 - Redundant API Calls for Tags
**Learning:** Functions triggered by repetitive user actions (like clicking tags for definitions) can generate a high volume of identical network requests if uncached, burning API quota unnecessarily.
**Action:** Always consider wrapping external API calls in a simple Map cache if the input space is small and the expected output is deterministic.
