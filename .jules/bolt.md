## 2024-08-01 - React.memo on Static Renderers
**Learning:** Complex static renderers (like MarkdownRenderer) that do string parsing and regex matching are prime targets for unnecessary re-renders when embedded in components with frequently updating state (like ChatBot receiving stream chunks). The default shallow compare in React.memo is highly effective here since the props (`content` string) are primitive.
**Action:** Always check if expensive UI components are being re-rendered unnecessarily in loops or during stream updates, and wrap them in React.memo if their props are primarily static primitives or primitive-like objects.

## 2026-08-04 - Hooks in JSX
**Learning:** Never put hooks (like `useMemo`) directly inside the JSX return statement (e.g., `return <div>{useMemo(...)}</div>`). This violates the Rules of Hooks and causes the code review to fail and the build/runtime to potentially break.
**Action:** Always call hooks at the top-level of the component function.
