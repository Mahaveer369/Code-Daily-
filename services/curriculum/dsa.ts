import { LessonContent } from '../../types';

export const DSA_MODULES: Record<string, LessonContent> = {
  'ds-1': {
    id: 'ds-1',
    title: 'Complexity Analysis & Amortization',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Complexity Analysis: Big-O, Amortized Math & Master Theorem

In FAANG SDE-2 interviews, you must evaluate worst-case, average-case, and amortized complexity with mathematical rigor.

---

## 1. Amortized Analysis: The Dynamic Array Doubling Proof
When an array of capacity $N$ is full, it allocates $2N$ slots and copies $N$ elements.
- Cost of $N$ insertions without resize: $N \\times O(1) = N$.
- Cost of resize: $1 + 2 + 4 + 8 + \\dots + N = 2N - 1$.
- Total work for $N$ operations: $N + 2N - 1 = 3N - 1$.
- **Amortized cost per insertion**: $\\frac{3N - 1}{N} \\approx 3 = O(1)$!
`,
    quizzes: [
      {
        id: 'ds1-q1',
        question: "Why does multiplying array capacity by 2 yield O(1) amortized insertion, whereas adding a fixed constant (e.g. +100) yields O(N) amortized insertion?",
        options: [
          "Constants cannot be divided",
          "Doubling geometric series converges to a constant ratio (3N total work / N insertions), whereas fixed increments require resizing every 100 elements, yielding O(N^2) total work for N insertions",
          "Memory allocation fails on constant addition",
          "C++ forbids constant increments"
        ],
        correctAnswerIndex: 1,
        explanation: "Geometric resizing amortizes copying work over an exponentially growing number of free operations, keeping average cost bounded at O(1)."
      }
    ],
    codingChallenge: {
      title: "Amortized Operations Counter",
      description: "Simulate dynamic array insertions and calculate the exact total memory copy operations performed during resizes.",
      language: "python",
      starterCode: `def count_resize_copies(total_insertions: int, initial_capacity: int = 1) -> int:
    # When current_size == capacity, capacity doubles and copies current_size elements
    pass
`,
      solutionCode: `def count_resize_copies(total_insertions: int, initial_capacity: int = 1) -> int:
    copies = 0
    capacity = initial_capacity
    size = 0
    for _ in range(total_insertions):
        if size == capacity:
            copies += size
            capacity *= 2
        size += 1
    return copies
`,
      hint: "Track capacity and size; accumulate copies whenever size equals capacity before insertion."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "What is the space complexity of an in-place QuickSort implementation?",
        answer: "O(log N) auxiliary space on the call stack for the recursive calls, provided the implementation recurses on the smaller partition first and tail-call eliminates the larger partition."
      }
    ],
    resources: [
      { title: "Introduction to Algorithms (CLRS)", type: "Book", authorOrSource: "Cormen, Leiserson, Rivest, Stein" }
    ]
  },

  'ds-2': {
    id: 'ds-2',
    title: 'Arrays & Two-Pointers',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Arrays: CPU Cache Locality, Two-Pointers & Sliding Window

Arrays are contiguous memory blocks. Iterating sequentially leverages hardware CPU cache prefetching (Spatial Locality).

---

## 1. Algorithmic Patterns
- **Two Pointers (Opposite Ends)**: Sorted array search, Container with Most Water ($O(N)$ time, $O(1)$ space).
- **Two Pointers (Fast & Slow)**: In-place duplicate removal, partition algorithms.
- **Sliding Window (Dynamic)**: Longest substring with K distinct characters ($O(N)$ with hash map).
`,
    quizzes: [
      {
        id: 'ds2-q1',
        question: "Why is iterating through a 2D array row-by-row substantially faster than column-by-column in C/C++/Python?",
        options: [
          "Columns use more bits",
          "Row-major layout stores adjacent row elements contiguously in RAM, exploiting CPU L1/L2 cache lines (64 bytes)",
          "Compilers optimize rows automatically",
          "Python forbids column iteration"
        ],
        correctAnswerIndex: 1,
        explanation: "Row-major memory layout ensures cache line hits when accessing adjacent columns in the same row. Accessing column-by-column causes continuous cache misses."
      }
    ],
    codingChallenge: {
      title: "Container With Most Water",
      description: "Find two lines that together with the x-axis form a container containing the maximum amount of water.",
      language: "python",
      starterCode: `def max_area(height: list) -> int:
    # Two pointers at 0 and len(height)-1
    pass
`,
      solutionCode: `def max_area(height: list) -> int:
    left = 0
    right = len(height) - 1
    max_w = 0
    while left < right:
        h = min(height[left], height[right])
        w = right - left
        max_w = max(max_w, h * w)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_w
`,
      hint: "Use two pointers from left and right; advance the pointer with the smaller height."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "How do you find the minimum size subarray with sum >= target in O(N) time?",
        answer: "Use a dynamic Sliding Window: maintain a window [left, right], expand right adding to sum until sum >= target, then shrink left updating min_length until sum < target. Each element is visited at most twice (once by right, once by left), yielding O(N) linear time."
      }
    ],
    resources: [
      { title: "What Every Programmer Should Know About Memory", type: "Whitepaper", authorOrSource: "Ulrich Drepper" }
    ]
  },

  'ds-3': {
    id: 'ds-3',
    title: 'Linked Lists',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Linked Lists: Pointer Mutation, Cycle Detection & Sentinel Nodes

Testing pointer hygiene, memory manipulation, and edge-case management.

---

## 1. Critical Patterns
- **Sentinel (Dummy) Node**: \`dummy = ListNode(0); dummy.next = head\`. Eliminates edge cases when mutating the head node.
- **Floyd's Tortoise and Hare**: Slow pointer moves 1 step; fast pointer moves 2 steps.
  - Cycle exists if \`slow == fast\`.
  - Cycle start located by resetting \`slow = head\` and advancing both 1 step!
`,
    quizzes: [
      {
        id: 'ds3-q1',
        question: "In Floyd's cycle detection, after slow and fast meet, why does resetting one pointer to head and advancing both by 1 step find the cycle start?",
        options: [
          "It is a random heuristic",
          "Mathematical proof shows distance from head to cycle entrance equals distance from meeting point to cycle entrance modulo cycle length",
          "It resets memory registers",
          "Linked lists have symmetric lengths"
        ],
        correctAnswerIndex: 1,
        explanation: "Algebraic derivation: If distance to cycle is k, and meeting point is m steps inside cycle, k = (n*C - m), meaning stepping from head and meeting point simultaneously meets at the entrance."
      }
    ],
    codingChallenge: {
      title: "Reverse Linked List (In-Place)",
      description: "Reverse a singly linked list in-place in O(N) time and O(1) space.",
      language: "python",
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    pass
`,
      solutionCode: `def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
      hint: "Track prev, curr, and nxt pointers."
    },
    interviewQuestions: [
      {
        companyTag: 'Microsoft',
        question: "How do you reverse nodes of a linked list in k-group?",
        answer: "First verify there are at least k nodes remaining. Reverse the k nodes using the standard iterative reversal pointer pattern. Recursively or iteratively connect the previous group's tail to the newly reversed group's head, and link the new tail to the recursive call on the next group."
      }
    ],
    resources: [
      { title: "LeetCode Curated 75: Linked List", type: "Documentation", authorOrSource: "LeetCode" }
    ]
  },

  'ds-4': {
    id: 'ds-4',
    title: 'Stacks & Queues: Monotonic Structures',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Stacks & Queues: Monotonic Stacks & Deques

Monotonic structures maintain elements in strictly ascending or descending order, reducing $O(N^2)$ brute-force comparisons to $O(N)$ linear time.

---

## 1. The Monotonic Stack Pattern
Used for problems like **Next Greater Element**, **Daily Temperatures**, and **Largest Rectangle in Histogram**.
- Every element is pushed onto the stack exactly once and popped at most once.
- Amortized time complexity: **$O(N)$**.
`,
    quizzes: [
      {
        id: 'ds4-q1',
        question: "What is the time complexity of the Next Greater Element algorithm using a monotonic stack for an array of size N?",
        options: [
          "O(N^2)",
          "O(N)",
          "O(N log N)",
          "O(2^N)"
        ],
        correctAnswerIndex: 1,
        explanation: "Each element is pushed once and popped at most once, bounding total operations to 2N = O(N)."
      }
    ],
    codingChallenge: {
      title: "Daily Temperatures (Monotonic Stack)",
      description: "Given an array of daily temperatures, return an array answer where answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
      language: "python",
      starterCode: `def daily_temperatures(temperatures: list) -> list:
    # temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
    # Return [1, 1, 4, 2, 1, 1, 0, 0]
    pass
`,
      solutionCode: `def daily_temperatures(temperatures: list) -> list:
    n = len(temperatures)
    ans = [0] * n
    stack = [] # indices of temperatures in monotonic decreasing order

    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)

    return ans
`,
      hint: "Maintain indices of temperatures in a stack in decreasing order; pop when encountering a warmer day."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "How do you implement a Sliding Window Maximum in O(N) time?",
        answer: "Use a Monotonic Double-Ended Queue (Deque) storing indices. Maintain elements in strictly descending order. For each new element: 1) Pop elements from the right smaller than the current element; 2) Evict indices from the left that have fallen outside the window (idx <= i - k); 3) The front of the deque is the maximum for the current window."
      }
    ],
    resources: [
      { title: "Competitive Programmer's Handbook: Amortized Analysis", type: "Book", authorOrSource: "Antti Laaksonen" }
    ]
  },

  'ds-5': {
    id: 'ds-5',
    title: 'Trees & Balanced BSTs',
    estimatedReadingTime: '24 mins',
    contentMarkdown: `
# Trees: Balanced BSTs, Traversals & Lowest Common Ancestor

Trees model hierarchical relations and form the basis of relational database indexes (B+ Trees) and memory allocators (Red-Black Trees).

---

## 1. Traversals
- **Pre-order (Root, Left, Right)**: Serialization / cloning.
- **In-order (Left, Root, Right)**: Yields sorted order on a BST!
- **Post-order (Left, Right, Root)**: Bottom-up evaluation (calculating subtree heights, deleting trees).
- **Level-order (BFS)**: Breadth-first level by level via Queue.
`,
    quizzes: [
      {
        id: 'ds5-q1',
        question: "What traversal order produces elements in monotonically non-decreasing order when applied to a Binary Search Tree (BST)?",
        options: [
          "Pre-order",
          "In-order",
          "Post-order",
          "Level-order"
        ],
        correctAnswerIndex: 1,
        explanation: "In-order traversal visits Left Subtree (< Root), then Root, then Right Subtree (> Root), yielding strictly sorted order."
      }
    ],
    codingChallenge: {
      title: "Lowest Common Ancestor in Binary Tree",
      description: "Find the lowest common ancestor of two given nodes p and q in a binary tree.",
      language: "python",
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    pass
`,
      solutionCode: `def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if not root or root == p or root == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root # Both branches returned a target node -> root is LCA!
    return left if left else right
`,
      hint: "Post-order bottom-up search: if left and right both return non-null, the current root is the LCA."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "How do you serialize and deserialize a binary tree to and from a string in O(N) time?",
        answer: "Use pre-order traversal with a delimiter (e.g. comma) and a sentinel marker (e.g. '#') for null nodes. For deserialization, convert the string into a queue of tokens and recursively construct the tree: pop token, if '#', return null; otherwise create node and recursively assign left and right children."
      }
    ],
    resources: [
      { title: "Algorithms (4th Edition): Balanced Search Trees", type: "Book", authorOrSource: "Robert Sedgewick" }
    ]
  },

  'ds-6': {
    id: 'ds-6',
    title: 'Graph Algorithms: BFS, DFS & Shortest Path',
    estimatedReadingTime: '26 mins',
    contentMarkdown: `
# Graph Algorithms: Traversal, Dijkstra & Disjoint Sets (Union-Find)

Graphs model social connections, dependency trees, network routing, and recommendation topologies.

---

## 1. Graph Algorithms Matrix

| Algorithm | Data Structure | Time Complexity | Use Case |
| :--- | :--- | :--- | :--- |
| **BFS** | Queue | $O(V + E)$ | Unweighted shortest path |
| **DFS** | Stack / Recursion | $O(V + E)$ | Cycle detection, Connected components |
| **Topological Sort** | Indegree Array / DFS | $O(V + E)$ | Task dependencies, Build systems |
| **Dijkstra** | Priority Queue (Min-Heap) | $O((V + E) \\log V)$ | Non-negative weighted shortest path |
| **Union-Find** | Disjoint Set + Rank | $O(E \\cdot \\alpha(V)) \\approx O(E)$ | Dynamic connectivity, Kruskal's MST |
`,
    quizzes: [
      {
        id: 'ds6-q1',
        question: "Why does Dijkstra's algorithm fail when applied to graphs with negative edge weights?",
        options: [
          "Priority queues cannot store negative numbers",
          "Dijkstra assumes that adding an edge to a path always increases its total cost (greedy property); negative edges invalidate the finalized shortest path guarantee",
          "It causes infinite loops on trees",
          "It violates Kirchhoff's laws"
        ],
        correctAnswerIndex: 1,
        explanation: "Dijkstra marks visited nodes as finalized based on greedy optimality. A negative edge can retroactively lower the cost of a finalized node, requiring Bellman-Ford instead."
      }
    ],
    codingChallenge: {
      title: "Course Schedule (Cycle Detection / Topo Sort)",
      description: "Determine if it is possible to finish all courses given prerequisite dependencies (Kahn's algorithm using indegree).",
      language: "python",
      starterCode: `def can_finish(num_courses: int, prerequisites: list) -> bool:
    # prerequisites = [[1, 0]] means course 0 is prereq for 1
    pass
`,
      solutionCode: `from collections import deque

def can_finish(num_courses: int, prerequisites: list) -> bool:
    adj = {i: [] for i in range(num_courses)}
    indegree = [0] * num_courses

    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1

    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == num_courses
`,
      hint: "Calculate in-degrees; push in-degree 0 nodes to queue; decrement neighbors on pop."
    },
    interviewQuestions: [
      {
        companyTag: 'Uber',
        question: "How does Uber calculate route ETAs across a city road network with 10M edges in real time?",
        answer: "Raw Dijkstra on 10M edges takes several seconds. Uber uses Contraction Hierarchies (CH) and Custom Contraction Hierarchies (CCH). Roads are preprocessed into a hierarchical graph with shortcut edges; queries execute bidirectional Dijkstra on the contracted graph in under 5 milliseconds."
      }
    ],
    resources: [
      { title: "Contraction Hierarchies: Fast and Exact Routing", type: "Whitepaper", authorOrSource: "Geisberger et al. (Karlsruhe Institute of Technology)" }
    ]
  },

  'ds-7': {
    id: 'ds-7',
    title: 'Dynamic Programming: Memoization & Tabulation',
    estimatedReadingTime: '28 mins',
    contentMarkdown: `
# Dynamic Programming: State Formulation & Optimization

Dynamic Programming solves problems with **Optimal Substructure** and **Overlapping Subproblems**.

---

## 1. Top-Down (Memoization) vs Bottom-Up (Tabulation)
- **Top-Down**: Recursive formulation with a memoization table/dict. Intuitive to write, but incurs stack recursion overhead.
- **Bottom-Up**: Iterative state transitions starting from base cases. Enables **Space Optimization** (e.g. keeping only the last 2 rows of a 2D matrix).

---

## 2. Classic SDE-2 Paradigms
1. **0/1 Knapsack**: Decide to include/exclude element; iterate weight capacity backwards to optimize space to $O(W)$.
2. **Longest Common Subsequence (LCS)**: 2D table tracking character matches.
3. **Interval DP**: Merge stones, Matrix Chain Multiplication.
`,
    quizzes: [
      {
        id: 'ds7-q1',
        question: "When optimizing a 2D dynamic programming grid where DP[i][j] depends only on DP[i-1][j] and DP[i-1][j-1], what is the optimal space complexity?",
        options: [
          "O(M * N)",
          "O(N) (1D array of column size)",
          "O(1)",
          "O(log N)"
        ],
        correctAnswerIndex: 1,
        explanation: "Because row i depends strictly on row i-1, you only need to store the previous row, reducing space from O(M*N) to O(N)."
      }
    ],
    codingChallenge: {
      title: "Coin Change (Fewest Coins)",
      description: "Compute the fewest number of coins needed to make up a given amount. If impossible, return -1.",
      language: "python",
      starterCode: `def coin_change(coins: list, amount: int) -> int:
    pass
`,
      solutionCode: `def coin_change(coins: list, amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])

    return dp[amount] if dp[amount] != float('inf') else -1
`,
      hint: "dp[i] represents minimum coins for amount i; initialize with infinity."
    },
    interviewQuestions: [
      {
        companyTag: 'Apple',
        question: "How do you solve the Longest Increasing Subsequence (LIS) in O(N log N) time?",
        answer: "Maintain a dynamic array `tails` where `tails[i]` stores the smallest tail of all increasing subsequences of length i+1. For each number x in the input, binary search (bisect_left) in `tails`: if x is larger than all elements, append it; otherwise replace the first element >= x. The length of `tails` at the end is the length of LIS in O(N log N)."
      }
    ],
    resources: [
      { title: "Dynamic Programming Patterns", type: "Documentation", authorOrSource: "LeetCode Discuss" }
    ]
  }
};
