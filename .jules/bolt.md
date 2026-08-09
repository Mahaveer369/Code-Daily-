## 2026-08-09 - Optimization of array nested loop inside rendering map
**Learning:** In a codebase with arrays nested in loops, specifically inside rendering maps (like mapping courses and looking up progress items), a simple `.find()` causes O(N*M) algorithmic complexity rendering loops.
**Action:** Replaced O(N) array search inside mapping loop with an O(1) hash map lookup inside `useMemo()` to optimize rendering algorithmic complexity to O(N+M) and reducing rendering time.
