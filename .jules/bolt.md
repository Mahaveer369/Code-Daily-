## 2026-08-02 - MarkdownRenderer Re-render Bottleneck
**Learning:** `MarkdownRenderer` uses heavy Regex parsing on every render. Because it is used alongside fast-changing state like text inputs (e.g., ChatBot typing, Bookmark notes), typing causes the entire component tree to re-render, leading to noticeable input lag and CPU spikes.
**Action:** Always wrap heavy string-to-JSX parsers in `React.memo` to prevent re-renders from parent state changes, and use `useMemo` on the parsed result so it only recalculates when the string actually changes.
