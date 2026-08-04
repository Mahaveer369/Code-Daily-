## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.
## 2025-03-05 - Inconsistent API Caching for UI Events
**Learning:** Found an anti-pattern where some API calls (`generateLessonContent`) use proper caching and in-flight deduplication, while others (`getFastDefinition`) do not. Uncached UI-triggered API calls create massive redundant requests when users rapidly click or trigger the same event multiple times.
**Action:** Always verify that frequently triggered API calls from the UI have both an in-memory cache and a pending-request tracking mechanism to deduplicate in-flight requests.
