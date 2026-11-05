import { LessonContent } from '../../types';

export const DSA_MODULES: Record<string, LessonContent> = {
  'ds-1': {
    id: 'ds-1',
    title: 'Big-O Time & Space Complexity Analysis',
    estimatedReadingTime: '25 mins',
    beginnerSummary:
      'Complete masterclass on Time Complexity and Space Complexity: learn Asymptotic Notations (Big-O, Big-Omega Ω, Big-Theta Θ), Input vs. Auxiliary & Call-Stack Space, and the exact mathematical reason WHY algorithms run in O(1), O(log N), O(√N), O(N), O(N log N), O(N²), O(N³), O(2^N), or O(N!).',
    realWorldAnalogy:
      'Sending a 1TB hard drive across town via courier takes 30 minutes whether it holds 1 file or 1,000,000 files — that is O(1) Constant Time. Looking up a word in a sorted dictionary by opening the middle page and halving the remaining pages each step is O(log N). Reading every page once is O(N). Comparing every page with every other page is O(N²).',
    keyTakeaways: [
      'Time Complexity T(N) counts elementary CPU operations as input size N grows; Space Complexity S(N) = Input Space + Auxiliary Space (heap allocations + recursion call-stack depth).',
      'WHY O(log N): Halving N each step (N -> N/2 -> N/4 -> ... -> 1) takes k = log2(N) steps (only 20 steps for N = 1,000,000).',
      'WHY O(N log N): Splitting N into halves creates log2(N) recursion levels, and merging/partitioning all N elements at each level does O(N) work => N work/level × log2(N) levels = O(N log N) (or running an O(log N) binary search / heap op inside an O(N) loop).',
      'WHY O(N) vs O(N²): A single pass or two-pointer scan visits each element a constant number of times (<= 2N = O(N)), whereas nested pair loops perform N(N-1)/2 = O(N²) comparisons.',
      'Growth Hierarchy (Fastest to Slowest): O(1) < O(log N) < O(√N) < O(N) < O(N log N) < O(N²) < O(N³) < O(2^N) < O(N!).'
    ],
    syntaxCheatTable: [
      { syntax: 'O(1) — Constant Time & Space', description: 'Fixed number of CPU instructions; never depends on N', example: 'arr[i], hash_map[key], stack.push(x), n*(n+1)//2' },
      { syntax: 'O(log N) — Logarithmic', description: 'Problem size divides by 2 (or k) on every iteration', example: 'Binary Search, BST lookup, while n > 1: n //= 2' },
      { syntax: 'O(√N) — Square Root', description: 'Loop runs while i * i <= N', example: 'Primality test, enumerating all factors of N' },
      { syntax: 'O(N) — Linear', description: 'Visits each of N elements a constant number of times', example: 'Single loop, Two Pointers (L++, R--), Sliding Window' },
      { syntax: 'O(N log N) — Linearithmic', description: 'log2(N) divide-and-conquer levels × O(N) work per level (or N × O(log N))', example: 'Merge Sort, Quick Sort (avg), Heap Sort, Sorting + Scan' },
      { syntax: 'O(N²) — Quadratic', description: 'Nested loop comparing all pairs: N(N-1)/2 operations', example: 'Bubble / Insertion / Selection Sort, 2D N×N matrix traversal' },
      { syntax: 'O(2^N) & O(N!) — Exponential / Factorial', description: 'Branching twice per step (2^N) or generating all permutations (N!)', example: 'Naive fib(n-1)+fib(n-2), Power Set (2^N), Travelling Salesman (N!)' }
    ],
    complexityTable: [
      {
        operation: 'O(1) — Constant Time & Space',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1) Auxiliary',
        notes: 'WHY: Executes a fixed number of instructions (e.g., array index Base + i*W or hash lookup). At N=10⁶ -> 1 operation.'
      },
      {
        operation: 'O(log N) — Logarithmic (Halving)',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1) Iterative / O(log N) Recursive Stack',
        notes: 'WHY: Halves search space each step: N / 2^k = 1 => k = log₂(N). At N=10⁶ -> only ~20 operations!'
      },
      {
        operation: 'O(√N) — Square Root Loop',
        timeComplexity: 'O(√N)',
        spaceComplexity: 'O(1) Auxiliary',
        notes: 'WHY: Loop condition i * i <= N stops at i = √N (e.g., prime/divisor check). At N=10⁶ -> 1,000 operations.'
      },
      {
        operation: 'O(N) — Linear Scan / Two Pointers',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) Pointers / O(N) Hash or Stack',
        notes: 'WHY: Visits each element a constant number of times (c·N). Two Pointers moves L and R at most N times total (2N = O(N)).'
      },
      {
        operation: 'O(N log N) — Linearithmic (Divide & Conquer / Sorting)',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N) Merge Sort / O(log N) QuickSort Stack',
        notes: 'WHY: (1) Recursion tree has log₂(N) levels and merges N items per level = N × log₂(N), OR (2) N iterations each doing O(log N) Binary Search / Heap op.'
      },
      {
        operation: 'O(N²) — Quadratic (Nested Pair Loops)',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1) Loop / O(N²) 2D Matrix',
        notes: 'WHY: Outer loop runs N times × inner loop runs N times = N² (or 1+2+...+(N-1) = N(N-1)/2 = O(N²)). At N=10⁶ -> 10¹² ops (TLE!).'
      },
      {
        operation: 'O(N³) — Cubic (Triple Nested Loops)',
        timeComplexity: 'O(N³)',
        spaceComplexity: 'O(N²) Matrix Storage',
        notes: 'WHY: Three nested loops over 1..N (e.g., standard Matrix Multiplication or Floyd-Warshall shortest paths).'
      },
      {
        operation: 'O(2^N) — Exponential (Binary Recursion Tree)',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N) Call-Stack Depth',
        notes: 'WHY: Each call branches into 2 sub-calls of size N-1 (1 + 2 + 4 + ... + 2^N = 2^(N+1)-1 nodes), while max stack depth is N.'
      },
      {
        operation: 'O(N!) — Factorial (All Permutations)',
        timeComplexity: 'O(N!)',
        spaceComplexity: 'O(N) Call-Stack Depth',
        notes: 'WHY: N choices at level 1 × (N-1) at level 2 × ... × 1 = N! leaves. At N=20 -> 2.43 × 10¹⁸ operations.'
      }
    ],
    fillBlankExercise: {
      prompt: 'When Merge Sort splits an array of size N into halves across log₂(N) levels and performs O(N) merge work at each level, what is the total time complexity?',
      codeBefore: '# log2(N) levels * O(N) work per level = ',
      answer: 'O(N log N)',
      codeAfter: ' total time complexity',
      hint: 'Multiply N by log N: written as O(N log N).'
    },
    mustSolveExercises: [
      {
        id: 'ds1-ex-1',
        title: 'Exercise 1: Derive Logarithmic Time O(log N) from Halving Loop',
        difficulty: 'Essential',
        scenario: 'Inspect the loop below where i starts at N and divides by 2 on every step until reaching 1. State its exact Big-O Time Complexity.',
        codeBefore: `def halving_steps(n: int) -> int:\n    steps = 0\n    while n > 1:\n        n = n // 2\n        steps += 1\n    return steps\n# Time Complexity = `,
        answer: 'O(log N)',
        acceptedAnswers: ['O(log N)', 'O(logn)', 'O(log_2 N)', 'O(log2 N)'],
        codeAfter: ` # Space Complexity = O(1)`,
        hint: 'Since n is divided by 2 each step (N / 2^k = 1), k = log2(N). Write O(log N).',
        explanation: 'Dividing n by 2 on every iteration means after k steps, n / (2^k) = 1, so 2^k = N and k = log2(N) = O(log N) time and O(1) space.',
        xp: 50
      },
      {
        id: 'ds1-ex-2',
        title: 'Exercise 2: Why N Iterations of Binary Search is O(N log N)',
        difficulty: 'Core Practice',
        scenario: 'The outer loop runs N times. Inside each iteration, binary_search(arr, x) takes O(log N) time. What is the combined Time Complexity?',
        codeBefore: `for x in items:              # Runs N times\n    idx = binary_search(arr, x) # Takes O(log N) per call\n# Total Time Complexity = `,
        answer: 'O(N log N)',
        acceptedAnswers: ['O(N log N)', 'O(n log n)', 'O(NlogN)', 'O(nlogn)'],
        codeAfter: ` # N * O(log N)`,
        hint: 'Multiply the outer loop count (N) by the inner operation cost (log N): O(N log N).',
        explanation: 'When an O(log N) operation (like Binary Search or Heap push/pop) executes inside a loop of N iterations, total work is N × O(log N) = O(N log N).',
        xp: 60
      },
      {
        id: 'ds1-ex-3',
        title: 'Exercise 3: Triangular Nested Loop Complexity',
        difficulty: 'Core Practice',
        scenario: 'Here the inner loop starts at j = i + 1 and runs to N - 1, performing 1 + 2 + 3 + ... + (N - 1) = N(N - 1)/2 comparisons. What is the Big-O Time Complexity?',
        codeBefore: `for i in range(n):\n    for j in range(i + 1, n):\n        compare(arr[i], arr[j])\n# Total Time Complexity = `,
        answer: 'O(N^2)',
        acceptedAnswers: ['O(N^2)', 'O(n^2)', 'O(N²)', 'O(n²)'],
        codeAfter: ` # Because N(N-1)/2 = (N^2 - N)/2`,
        hint: 'Drop constants (1/2) and lower-order terms (-N/2) from N²/2: write O(N^2) or O(N²).',
        explanation: 'The sum 1 + 2 + ... + (N - 1) equals N(N - 1)/2 = 0.5*N² - 0.5*N. Dropping the constant 0.5 and lower-order term N leaves O(N²).',
        xp: 60
      },
      {
        id: 'ds1-ex-4',
        title: 'Exercise 4: Call-Stack Space Complexity of Binary Recursion',
        difficulty: 'Mastery Challenge',
        scenario: 'Naive recursive fib(n) takes O(2^N) time because of 2^N calls. However, how much Auxiliary Call-Stack Space does it use at peak depth?',
        codeBefore: `def fib(n: int) -> int:\n    if n <= 1: return n\n    return fib(n - 1) + fib(n - 2)\n# Time = O(2^N) | Auxiliary Call-Stack Space = `,
        answer: 'O(N)',
        acceptedAnswers: ['O(N)', 'O(n)'],
        codeAfter: ` # Maximum depth of recursion tree is N frames`,
        hint: 'At any moment, only one root-to-leaf path (fib(n) -> fib(n-1) -> ... -> fib(1)) is active on the call stack. Write O(N).',
        explanation: 'Even though 2^N total calls happen over time, fib(n-1) finishes and pops its stack frames before fib(n-2) starts. Thus at most N stack frames coexist in memory: O(N) space!',
        xp: 75
      }
    ],
    contentMarkdown: `# Big-O Time & Space Complexity Analysis: Complete Masterclass

## 1. Everything Present in Time Complexity & Space Complexity

When evaluating an algorithm, raw execution time in milliseconds changes depending on whether the code runs on a laptop, a phone, or a cloud server. To measure an algorithm's **true mathematical efficiency**, Computer Science uses **Asymptotic Complexity Analysis** as a function of the input size $N$:

### A. Time Complexity $T(N)$
- **Definition**: How the count of elementary CPU operations (comparisons, arithmetic, pointer assignments, array lookups) grows as input size $N \\to \\infty$.
- **Why we don't count seconds**: An algorithm doing $N^2$ operations will always eventually lose to an algorithm doing $N \\log N$ operations once $N$ is large enough, regardless of hardware speed.

### B. Space Complexity $S(N)$ (Input Space vs. Auxiliary Space)
Every running program consumes two distinct categories of RAM:
1. **Input Space**: Memory occupied by the input data itself (e.g., an input array \`nums\` of length $N$ takes $O(N)$ input space).
2. **Auxiliary Space $S_{\\text{aux}}(N)$**: The **extra temporary memory** allocated by your algorithm to solve the problem. In technical interviews and competitive programming, *"Space Complexity"* almost always refers to **Auxiliary Space**, which consists of:
   - **Heap Allocations**: New arrays, lists, hash maps (\`dict\`/\`set\`), strings, or tree/graph nodes created inside the function.
   - **Recursion Call-Stack Space**: Every active recursive function call pushes a **Stack Frame** (storing local variables, parameters, and return address) onto the CPU Call Stack. If recursion goes $D$ levels deep before hitting a base case, it consumes **$O(D)$ auxiliary stack space**!

### C. The Three Asymptotic Notations ($O$, $\\Omega$, $\\Theta$)

| Notation | Name | Mathematical Meaning | Engineering Usage |
| :--- | :--- | :--- | :--- |
| **$O(f(N))$** | **Big-O (Upper Bound)** | $T(N) \\le c \\cdot f(N)$ for all $N \\ge N_0$ | **Worst-Case Guarantee**: The algorithm will *never* take more steps than this ceiling. |
| **$\\Omega(f(N))$** | **Big-Omega (Lower Bound)** | $T(N) \\ge c \\cdot f(N)$ for all $N \\ge N_0$ | **Best-Case Floor**: The minimum steps required (e.g., finding target at \`arr[0]\` is $\\Omega(1)$). |
| **$\\Theta(f(N))$** | **Big-Theta (Tight Bound)** | $c_1 \\cdot f(N) \\le T(N) \\le c_2 \\cdot f(N)$ | **Exact Growth Rate**: Used when Best Case and Worst Case grow at the exact same rate. |

### D. The 4 Golden Rules for Simplifying Big-O
1. **Drop Multiplicative Constants**: $T(N) = 3N + 5 \\implies O(N)$ (because $3$ is a fixed constant independent of $N$).
2. **Drop Non-Dominant (Lower-Order) Terms**: $T(N) = N^2 + 100N + 500 \\implies O(N^2)$ (at $N = 10^6$, $N^2 = 10^{12}$ whereas $100N = 10^8$, which is $0.01\\%$).
3. **Sequential Steps Add ($O(A + B)$)**: Two separate loops—one over array \`A\` of size $N$ followed by one over array \`B\` of size $M$—take **$O(N + M)$** time.
4. **Nested Steps Multiply ($O(A \\times B)$)**: A loop of size $N$ containing an inner loop of size $M$ takes **$O(N \\times M)$** time.

---

## 2. Deep-Dive: WHY Each Complexity Is $O(1)$, $O(\\log N)$, $O(N)$, $O(N \\log N)$, $O(N^2)$, $O(2^N)$, or $O(N!)$

Let's examine **every single complexity class**, trace the math behind **WHY** it has that formula, and inspect both its Time and Space behavior.

---

### Class 1: Why is it $O(1)$? (Constant Time & $O(1)$ Space)
- **Why is it $O(1)$ Time**: The CPU executes a **fixed number of instructions** that does not depend on $N$. Whether the array has $10$ items or $10,000,000$ items:
  - Reading \`arr[i]\` computes a single memory address: $\\text{BaseAddress} + (i \\times 8\\text{ bytes}) \\implies 1\\text{ operation}$.
  - Hash map lookup \`seen[key]\` hashes the key and jumps directly to the bucket $\\implies O(1)\\text{ average time}$.
  - Mathematical formula \`total = n * (n + 1) // 2\` performs 1 addition, 1 multiplication, and 1 division $\\implies 3\\text{ ops} = O(1)$.
- **Why is it $O(1)$ Space**: Using a fixed number of scalar variables (\`left = 0\`, \`right = n - 1\`, \`max_sum = 0\`) allocates the exact same 24 bytes of RAM regardless of $N$.

---

### Class 2: Why is it $O(\\log N)$? (Logarithmic Time & Space)
- **Why is it $O(\\log N)$ Time**: Whenever an algorithm **cuts the remaining problem size in half** (or divides/multiplies by any constant factor $c > 1$) on every step:
$$\\text{Start: } N \\xrightarrow{\\div 2} \\frac{N}{2} \\xrightarrow{\\div 2} \\frac{N}{4} \\xrightarrow{\\div 2} \\frac{N}{8} \\xrightarrow{\\div 2} \\dots \\xrightarrow{\\div 2} \\frac{N}{2^k} = 1$$
Solve for the number of steps $k$:
$$\\frac{N}{2^k} = 1 \\iff 2^k = N \\iff k = \\log_2(N) = O(\\log N)$$
- **Concrete Scale**: For $N = 1,048,576$ ($2^{20}$), an $O(\\log N)$ Binary Search takes **at most 20 comparisons**!
- **Space Complexity Contrast**:
  - **Iterative Binary Search**: Uses \`low\`, \`high\`, \`mid\` variables $\\implies \\mathbf{O(1)}$ **Auxiliary Space**.
  - **Recursive Binary Search**: Pushes 1 stack frame per halving step $\\implies \\mathbf{O(\\log N)}$ **Call-Stack Space**.

---

### Class 3: Why is it $O(\\sqrt{N})$? (Square-Root Time)
- **Why is it $O(\\sqrt{N})$ Time**: Consider finding all divisors of $N$ or checking if $N$ is prime using a loop \`while i * i <= n:\`:
  - The loop stops the moment $i^2 > N \\iff i > \\sqrt{N}$.
  - For $N = 1,000,000$, the loop runs only $\\sqrt{1,000,000} = \\mathbf{1,000}$ iterations instead of $1,000,000$!

---

### Class 4: Why is it $O(N)$? (Linear Time & $O(N)$ Space)
- **Why is it $O(N)$ Time**: The algorithm processes each of the $N$ input elements a **constant number of times** ($1\\times$, $2\\times$, or $3\\times$):
  1. **Single Loop**: \`for x in arr:\` runs $N$ iterations $\\implies O(N)$.
  2. **Two Pointers / Sliding Window**: Why is a \`while\` loop inside a \`for\` loop in Sliding Window still $O(N)$ and NOT $O(N^2)$? Because \`right\` moves from $0 \\to N-1$ ($N$ steps total) and \`left\` **only moves forward** from $0 \\to N-1$ (at most $N$ steps total across the *entire* algorithm). Total pointer movements $= N + N = 2N = \\mathbf{O(N)}$!
- **Why is it $O(N)$ Space**:
  1. **Heap Allocation**: Creating a hash table \`seen = set()\`, frequency map, or output list of up to $N$ elements allocates $O(N)$ RAM.
  2. **Linear Recursion Stack**: \`def factorial(n): return 1 if n <= 1 else n * factorial(n - 1)\` holds $N$ open stack frames simultaneously before unwinding $\\implies \\mathbf{O(N)}$ stack space.

---

### Class 5: Why is it $O(N \\log N)$? (Linearithmic Time — The 2 Exact Causes)

Students often ask: **"Where does $O(N \\log N)$ actually come from?"** It arises in two specific ways:

#### Cause A: Divide-and-Conquer Recursion Tree (Merge Sort, Quick Sort, TimSort)
\`\`\`text
Level 0 (1 array of size N):          [       N elements       ]          --> O(N) merge work
                                           /              \\
Level 1 (2 halves of size N/2):     [ N/2 elements ] [ N/2 elements ]     --> 2 * (N/2) = O(N) work
                                      /        \\       /        \\
Level 2 (4 quarters of size N/4):  [N/4]     [N/4]   [N/4]     [N/4]      --> 4 * (N/4) = O(N) work
...
Level log2(N) (N base cases of 1): [1] [1] ... [1] (N leaves)             --> N * 1 = O(N) work
\`\`\`
1. **How many levels tall is the tree?** Since we divide $N$ by $2$ at each level until reaching $1$, there are **$\\log_2(N)$ levels**.
2. **How much work happens at each level?** Merging (in Merge Sort) or partitioning (in Quick Sort) across all subarrays at any single level scans every element once = **$N$ operations per level**.
3. **Multiply Levels $\\times$ Work per Level**:
$$\\text{Total Time} = \\underbrace{\\log_2(N)}_{\\text{Tree Height}} \\times \\underbrace{N}_{\\text{Work per Level}} = \\mathbf{O(N \\log N)}$$

#### Cause B: Running an $O(\\log N)$ Operation Inside an $O(N)$ Loop
Whenever a loop runs $N$ times, and each iteration performs an **$O(\\log N)$** operation (such as Binary Search \`bisect\` or Heap \`heappush\`/\`heappop\`):
$$\\sum_{i=1}^{N} O(\\log N) = N \\times O(\\log N) = \\mathbf{O(N \\log N)}$$
- **Example**: Heap Sort inserts $N$ elements into a Binary Heap ($N \\times O(\\log N)$) and extracts the minimum $N$ times ($N \\times O(\\log N)$) $\\implies O(N \\log N)$ Time and $O(1)$ In-Place Space!

---

### Class 6: Why is it $O(N^2)$? (Quadratic Time & Space)
- **Why is it $O(N^2)$ Time**:
  1. **Full Nested Loops**: Outer loop runs $N$ times, and for *every* outer step, inner loop runs $N$ times: $N \\times N = N^2$.
  2. **Triangular Pair Loops** (Bubble Sort, Selection Sort, Insertion Sort, checking all pairs \`(i, j)\` where \`j > i\`):
     - When \`i = 0\`, inner loop runs $N - 1$ times.
     - When \`i = 1\`, inner loop runs $N - 2$ times.
     - ...
     - When \`i = N - 2\`, inner loop runs $1$ time.
$$\\text{Total Operations} = (N - 1) + (N - 2) + \\dots + 2 + 1 = \\frac{N(N - 1)}{2} = \\frac{1}{2}N^2 - \\frac{1}{2}N = \\mathbf{O(N^2)}$$
- **Why is it $O(N^2)$ Space**: Allocating a 2D grid \`dp = [[0] * n for _ in range(n)]\` or an $N \\times N$ Adjacency Matrix allocates $N^2$ cells in RAM.

---

### Class 7: Why is it $O(N^3)$? (Cubic Time)
- **Why is it $O(N^3)$ Time**: Three nested loops each iterating $1 \\dots N$ (such as multiplying two $N \\times N$ matrices or running the Floyd-Warshall All-Pairs Shortest Path algorithm):
$$N \\times N \\times N = \\mathbf{O(N^3)}$$

---

### Class 8: Why is it $O(2^N)$? (Exponential Time vs. $O(N)$ Space)
- **Why is it $O(2^N)$ Time**: When a recursive function makes **2 recursive calls** of size $N - 1$ on each step (e.g., unmemoized \`fib(n - 1) + fib(n - 2)\` or generating all subsets / Power Set of $N$ elements):
  - Level 0 makes $1$ call ($2^0$).
  - Level 1 makes $2$ calls ($2^1$).
  - Level 2 makes $4$ calls ($2^2$).
  - Level $N$ makes $2^N$ calls.
$$\\text{Total Calls} = 2^0 + 2^1 + 2^2 + \\dots + 2^N = 2^{N+1} - 1 = \\mathbf{O(2^N)}$$
- **Why Call-Stack Space is Only $O(N)$**: The CPU does **not** hold all $2^N$ calls in memory at once! It explores the left branch \`fib(n) -> fib(n-1) -> ... -> fib(1)\` down to depth $N$, pops stack frames as it returns, and reuses that same stack memory for the right branch. Thus **Auxiliary Stack Space = $\\mathbf{O(N)}$**.

---

### Class 9: Why is it $O(N!)$? (Factorial Time)
- **Why is it $O(N!)$ Time**: When generating all permutations of $N$ distinct elements (or brute-force Travelling Salesman Problem):
  - Position 1 has $N$ choices.
  - For each choice, Position 2 has $N - 1$ remaining choices.
  - Position 3 has $N - 2$ choices... down to $1$.
$$\\text{Total Permutations} = N \\times (N - 1) \\times (N - 2) \\times \\dots \\times 2 \\times 1 = \\mathbf{O(N!)}$$

---

## 3. Master Operation Count Table Across Input Scales ($N = 10$ to $N = 1,000,000$)

Assuming a modern CPU executes ~$10^8$ ($100,000,000$) simple operations per second:

| Complexity Class | $N = 10$ | $N = 1,000$ | $N = 100,000$ ($10^5$) | $N = 1,000,000$ ($10^6$) | Typical Verdict at $N = 10^5$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **$O(1)$ Constant** | $1$ op | $1$ op | $1$ op | $1$ op (~$1\text{ ns}$) | **Instant Pass** |
| **$O(\log_2 N)$ Logarithmic** | $3$ ops | $10$ ops | $17$ ops | $20$ ops (~$20\text{ ns}$) | **Instant Pass** |
| **$O(\sqrt{N})$ Square Root** | $3$ ops | $32$ ops | $316$ ops | $1,000$ ops (~$10\text{ }\mu\text{s}$) | **Instant Pass** |
| **$O(N)$ Linear** | $10$ ops | $1,000$ ops | $10^5$ ops (~$1\text{ ms}$) | $10^6$ ops (~$10\text{ ms}$) | **Fast Pass** |
| **$O(N \log_2 N)$ Linearithmic** | $33$ ops | $10,000$ ops | $1.7 \times 10^6$ ops (~$17\text{ ms}$) | $2 \times 10^7$ ops (~$0.2\text{ s}$) | **Optimal Sort Pass** |
| **$O(N^2)$ Quadratic** | $100$ ops | $10^6$ ops (~$10\text{ ms}$) | $10^{10}$ ops (~$100\text{ sec}$) | $10^{12}$ ops (~$2.8\text{ hours}$) | **TLE (Time Limit Exceeded)** |
| **$O(2^N)$ Exponential** | $1,024$ ops | $> 10^{300}$ ops | $\infty$ | $\infty$ | **Only feasible for $N \le 25$** |
| **$O(N!)$ Factorial** | $3.6 \times 10^6$ ops | $\infty$ | $\infty$ | $\infty$ | **Only feasible for $N \le 11$** |

---

## 4. Space Complexity Deep-Dive: Heap vs. Call Stack Comparison

| Code Pattern | Time Complexity | Auxiliary Space | Exact Cause of Memory Consumption |
| :--- | :--- | :--- | :--- |
| \`total = 0; for x in arr: total += x\` | $O(N)$ | **$O(1)$** | Reuses a single 8-byte integer variable \`total\` across all $N$ iterations. |
| \`Iterative Binary Search (low, high, mid)\` | $O(\log N)$ | **$O(1)$** | Only 3 integer pointer variables; zero recursion frames. |
| \`Recursive Binary Search(arr, low, high)\` | $O(\log N)$ | **$O(\log N)$ Stack** | Pushes at most $\lceil \log_2 N \rceil$ stack frames before hitting base case. |
| \`Merge Sort(arr)\` | $O(N \log N)$ | **$O(N)$ Heap + Stack** | Allocates temporary \`left\`/\`right\` merge arrays totaling $N$ elements + $\log_2 N$ stack frames. |
| \`Tail-Optimized QuickSort\` | $O(N \log N)$ avg | **$O(\log N)$ Stack** | In-place partitioning on input array; recursing on smaller half bounds stack to $\log_2 N$. |
| \`Naive Recursive fib(n)\` | $O(2^N)$ | **$O(N)$ Stack** | Binary recursion tree has $2^N$ nodes, but maximum root-to-leaf call stack depth is $N$. |
| \`2D Dynamic Programming Grid dp[N][M]\` | $O(N \times M)$ | **$O(N \times M)$ Heap** | Allocates $N \times M$ cells on the heap (can often be rolling-row optimized to $O(M)$). |

---

## 5. Interactive Live Complexity Lab (Try it Yourself)

Click **Try it Yourself →** to pop open the Interactive Code Editor (with Fullscreen & Close controls) and trace the exact operation counts of **$O(1)$, $O(\log N)$, $O(\sqrt{N})$, $O(N)$, $O(N \log N)$, and $O(N^2)$** side by side:

\`\`\`python
def trace_all_complexities(n: int):
    # 1. O(1) Constant Time
    ops_o1 = 1

    # 2. O(log N) Logarithmic Time (halving N -> N/2 -> ... -> 1)
    ops_log_n = 0
    temp = n
    while temp > 1:
        temp = temp // 2
        ops_log_n += 1

    # 3. O(sqrt(N)) Square-Root Time (i * i <= N)
    ops_sqrt_n = 0
    i = 1
    while i * i <= n:
        ops_sqrt_n += 1
        i += 1

    # 4. O(N) Linear Time (single pass)
    ops_on = n

    # 5. O(N log N) Linearithmic Time (log2(N) levels * N work per level)
    ops_n_log_n = n * ops_log_n

    # 6. O(N^2) Quadratic Time (triangular pair comparisons N*(N-1)//2)
    ops_on2 = (n * (n - 1)) // 2

    print(f"=== EXACT OPERATION COUNTS FOR INPUT SIZE N = {n} ===")
    print(f"1. O(1) Constant          : {ops_o1} op")
    print(f"2. O(log N) Logarithmic   : {ops_log_n} ops (halving steps)")
    print(f"3. O(sqrt N) Square Root  : {ops_sqrt_n} ops")
    print(f"4. O(N) Linear            : {ops_on} ops")
    print(f"5. O(N log N) Divide&Conq : {ops_n_log_n} ops ({ops_log_n} levels * {n} work/level)")
    print(f"6. O(N^2) Quadratic Pairs : {ops_on2} ops")

trace_all_complexities(1024)
\`\`\``,
    quizzes: [
      {
        id: 'ds1-q1',
        question: 'Why is the time complexity of Merge Sort O(N log N) instead of O(N²)?',
        options: [
          'Because splitting an array of size N in half repeatedly creates log₂(N) levels in the recursion tree, and merging across all subarrays at each level performs O(N) linear work: log₂(N) levels × O(N) work/level = O(N log N).',
          'Because Merge Sort skips half of the elements in the input array without reading them.',
          'Because Merge Sort uses a hash table of size log N.',
          'Because recursion automatically divides any O(N²) algorithm by N.'
        ],
        correctAnswerIndex: 0,
        explanation: 'Merge Sort divides N by 2 at each depth (giving log₂(N) levels), and two-pointer merging across each level touches every element once (O(N) work per level), totaling O(N log N).'
      },
      {
        id: 'ds1-q2',
        question: 'What is the Time Complexity and Auxiliary Call-Stack Space Complexity of naive recursive Fibonacci: def fib(n): return n if n <= 1 else fib(n-1) + fib(n-2)?',
        options: [
          'Time: O(2^N), Auxiliary Call-Stack Space: O(N)',
          'Time: O(2^N), Auxiliary Call-Stack Space: O(2^N)',
          'Time: O(N log N), Auxiliary Call-Stack Space: O(log N)',
          'Time: O(N²), Auxiliary Call-Stack Space: O(1)'
        ],
        correctAnswerIndex: 0,
        explanation: 'Each call branches into 2 calls of size N-1, producing ~2^N total calls over time. However, only one root-to-leaf path of length N is active on the call stack at any instant, so Auxiliary Space is O(N).'
      },
      {
        id: 'ds1-q3',
        question: 'Why does a Dynamic Sliding Window with an outer for-loop (right = 0..N-1) and an inner while-loop (left += 1) still run in O(N) time rather than O(N²)?',
        options: [
          'Because the left pointer never resets to 0; both left and right only move forward at most N times across the entire execution, resulting in at most 2N = O(N) total steps.',
          'Because while-loops do not count toward Time Complexity.',
          'Because Python optimizes nested loops into O(1).',
          'Because right moves backward when left moves forward.'
        ],
        correctAnswerIndex: 0,
        explanation: 'By aggregate amortized analysis, right increments N times and left increments at most N times across the whole run, so total inner + outer steps <= 2N = O(N).'
      }
    ],
    codingChallenge: {
      title: 'Live Complexity Operation Counter: O(1) vs O(log N) vs O(N log N) vs O(N²)',
      description: 'Run and experiment with the exact operation counts for all major complexity classes at N = 1024.',
      language: 'python',
      starterCode: `def compare_growth(n: int):
    log_steps = 0
    temp = n
    while temp > 1:
        temp = temp // 2
        log_steps += 1

    linear_ops = n
    n_log_n_ops = n * log_steps
    quadratic_ops = (n * (n - 1)) // 2

    print(f"Input N = {n}")
    print(f"O(log N)   = {log_steps} ops")
    print(f"O(N)       = {linear_ops} ops")
    print(f"O(N log N) = {n_log_n_ops} ops")
    print(f"O(N^2)     = {quadratic_ops} ops")
    return n_log_n_ops

compare_growth(1024)
`,
      solutionCode: `def compare_growth(n: int):
    log_steps = 0
    temp = n
    while temp > 1:
        temp = temp // 2
        log_steps += 1
    return n * log_steps
`,
      hint: 'Notice how at N = 1024, O(log N) is just 10 steps, O(N log N) is 10,240 ops, and O(N²) is 523,776 ops!'
    },
    interviewQuestions: [
      {
        companyTag: 'Google / Meta',
        question: 'Explain why building a Binary Heap from an unsorted array of N elements using bottom-up heapify (sift-down) takes O(N) time instead of O(N log N).',
        answer: 'In bottom-up heapify, N/2 nodes are leaves (0 swaps), N/4 nodes are at height 1 (at most 1 swap), N/8 at height 2 (at most 2 swaps), and only 1 root node is at height log₂(N). Summing Σ (N / 2^(h+1)) * h converges to O(N) via the geometric-arithmetic series, whereas inserting N items one by one from the top takes O(N log N).'
      },
      {
        companyTag: 'Amazon / Microsoft',
        question: 'What is the space complexity of recursive QuickSort in the best case vs worst case, and how do you guarantee O(log N) auxiliary stack space?',
        answer: 'Naive recursive QuickSort uses O(log N) stack frames on average when partitions are balanced, but degrades to O(N) stack depth on already-sorted pivots. By always recursing on the smaller partition first and using a tail-loop for the larger partition, auxiliary stack space is strictly bounded to O(log N) even in the worst case.'
      }
    ],
    resources: [
      { title: 'Introduction to Algorithms (CLRS) — Chapter 3: Growth of Functions', type: 'Book', authorOrSource: 'Cormen, Leiserson, Rivest, Stein' }
    ]
  },

  'ds-2': {
    id: 'ds-2',
    title: 'Arrays, Two Pointers & Sliding Window',
    estimatedReadingTime: '20 mins',
    beginnerSummary:
      'Arrays store elements in contiguous memory addresses for O(1) random access. The Two Pointers and Sliding Window techniques eliminate redundant nested loops, reducing O(N²) brute-force subarray scans down to O(N) linear time and O(1) auxiliary space.',
    realWorldAnalogy:
      'Sliding Window is like looking through a 3-car train window frame as it rolls forward: to update the passenger count when advancing one car, you simply subtract the car leaving the left edge and add the new car entering the right edge in O(1) time instead of recounting the whole train!',
    keyTakeaways: [
      'Contiguous array memory gives O(1) index lookup: Address(A[i]) = Base_Address + i × Element_Size.',
      'Opposite-End Two Pointers (L=0, R=N-1) solve sorted pair-sum, palindrome, and Container With Most Water in O(N) time and O(1) space.',
      'Dynamic Sliding Window expands Right to satisfy a condition and shrinks Left to optimize window size — visiting each element at most twice (2N = O(N) time).'
    ],
    syntaxCheatTable: [
      { syntax: 'L, R = 0, len(arr) - 1', description: 'Opposite-direction Two Pointers', example: 'while L < R: ...' },
      { syntax: 'window_sum += arr[i] - arr[i-k]', description: 'Fixed-size K Sliding Window O(1) transition', example: 'Max subarray sum of size K' },
      { syntax: 'prefix[i+1] = prefix[i] + arr[i]', description: 'Prefix Sum array for O(1) range sum queries', example: 'sum(L..R) = prefix[R+1] - prefix[L]' }
    ],
    fillBlankExercise: {
      prompt: 'In Opposite-End Two Pointers on an array of length n, what is the initial index of the right pointer?',
      codeBefore: 'left = 0\nright = ',
      answer: 'n - 1',
      codeAfter: '\nwhile left < right:',
      hint: 'Zero-based indexing means the last element is at n - 1.'
    },
    contentMarkdown: `# Arrays, Two Pointers & Sliding Window (Pure Explanation + Complexity)

## 1. Pure Concept: Contiguous Memory & Cache Locality

An **Array** stores elements back-to-back in a single contiguous block of RAM. Because every element has a fixed byte width $W$ (e.g., 8 bytes for a 64-bit integer), the CPU calculates the exact RAM address of \`arr[i]\` in **1 instruction**:
$$\\text{Address}(\\text{arr}[i]) = \\text{BaseAddress} + (i \\times W)$$

This gives **strict $O(1)$ random access**. Furthermore, when the CPU reads \`arr[0]\`, hardware prefetchers load an entire **64-byte L1 cache line** (8 adjacent integers) at once—making sequential array iteration 10×–50× faster than pointer-chasing linked lists!

---

## 2. Step-by-Step Dry Run: Two Pointers vs Brute Force

**Problem**: Given sorted array \`nums = [2, 4, 7, 11, 15]\` and \`target = 15\`, find two indices whose values sum to \`15\`.

- **Naive Brute Force ($O(N^2)$ Time, $O(1)$ Space)**: Checks every pair \`(i, j)\` $\\rightarrow$ $\\frac{N(N-1)}{2}$ comparisons.
- **Optimal Two Pointers ($O(N)$ Time, $O(1)$ Space)**:
  - **Step 1**: \`L = 0\` (\`2\`), \`R = 4\` (\`15\`). Sum $= 2 + 15 = 17 > 15$. Since array is sorted, only decrementing \`R\` can reduce the sum $\\rightarrow$ \`R = 3\`.
  - **Step 2**: \`L = 0\` (\`2\`), \`R = 3\` (\`11\`). Sum $= 2 + 11 = 13 < 15$. Only incrementing \`L\` can increase the sum $\\rightarrow$ \`L = 1\`.
  - **Step 3**: \`L = 1\` (\`4\`), \`R = 3\` (\`11\`). Sum $= 4 + 11 = 15 == \\text{target}$! Return \`[1, 3]\` in just 3 steps!

---

## 3. Time & Space Complexity Breakdown with Concrete Examples

| Operation / Pattern | Best Case $\\Omega$ | Average Case $\\Theta$ | Worst Case $O$ | Auxiliary Space | Why & Concrete Example ($N = 10^5$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Random Access \`arr[i]\`** | $\\Omega(1)$ | $\\Theta(1)$ | **$O(1)$** | **$O(1)$** | Direct base + offset address arithmetic (~1 ns). |
| **Insert / Delete at Middle** | $\\Omega(1)$ (at tail) | $\\Theta(N)$ | **$O(N)$** | **$O(1)$** | Inserting at \`arr[0]\` shifts all $100,000$ elements right by 1 slot. |
| **Opposite Two Pointers** | $\\Omega(1)$ | $\\Theta(N)$ | **$O(N)$** | **$O(1)$** | Each step moves \`L++\` or \`R--\`; at most $N = 100,000$ comparisons, using only 2 integer variables (16 bytes). |
| **Dynamic Sliding Window** | $\\Omega(N)$ | $\\Theta(N)$ | **$O(N)$** | **$O(1)$ or $O(K)$** | \`right\` moves $N$ times and \`left\` moves at most $N$ times $\\implies \\le 2N$ total operations! |

---

## 4. Interactive Live Code Example (Try it Yourself)

Click **Try it Yourself →** to pop open the Code Editor and trace both **Container With Most Water (Two Pointers)** and **Sliding Window Maximum Sum**:

\`\`\`python
def max_water_container(height: list) -> int:
    left, right = 0, len(height) - 1
    best_area = 0
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        best_area = max(best_area, w * h)
        # Always move the shorter wall inward to seek a taller boundary
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best_area

def max_subarray_window_k(nums: list, k: int) -> int:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]  # O(1) slide!
        max_sum = max(max_sum, window_sum)
    return max_sum

heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
print("Max Water Area (O(N) Time, O(1) Space):", max_water_container(heights))
print("Max Sum of K=3 Window (O(N) Time, O(1) Space):", max_subarray_window_k([2, 1, 5, 1, 3, 2], 3))
\`\`\``,
    quizzes: [
      {
        id: 'ds2-q1',
        question: 'Why does a Dynamic Sliding Window with an inner while-loop still run in O(N) linear time instead of O(N²)?',
        options: [
          'Because while-loops are ignored in Big-O',
          'Because the left pointer only moves forward from 0 to N-1 across the entire execution; each element is added once by right and removed at most once by left (<= 2N total operations)',
          'Because arrays have at most 100 elements',
          'It actually runs in O(N²)'
        ],
        correctAnswerIndex: 1,
        explanation: 'Amortized pointer progress: neither left nor right ever moves backward, so total pointer increments across the entire algorithm cannot exceed 2N = O(N).'
      }
    ],
    codingChallenge: {
      title: 'Container With Most Water (O(N) Two Pointers)',
      description: 'Find two vertical lines that together with the x-axis form a container holding the maximum water in O(N) time and O(1) auxiliary space.',
      language: 'python',
      starterCode: `def max_area(height: list) -> int:
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

sample = [1, 8, 6, 2, 5, 4, 8, 3, 7]
print("Input Heights:", sample)
print("Maximum Water Container Area:", max_area(sample))
`,
      solutionCode: `def max_area(height: list) -> int:
    left, right = 0, len(height) - 1
    max_w = 0
    while left < right:
        max_w = max(max_w, min(height[left], height[right]) * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_w
`,
      hint: 'Use two pointers from left and right; advance the pointer with the smaller height.'
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: 'How do you find the minimum length subarray with sum >= target in O(N) time and O(1) space (for positive numbers)?',
        answer: 'Maintain a dynamic window [left, right]. Expand right and add nums[right] to current_sum. Whenever current_sum >= target, record min(ans, right - left + 1) and shrink the window by subtracting nums[left] and incrementing left. Each element is processed at most twice -> O(N) time, O(1) space.'
      }
    ],
    resources: [
      { title: 'What Every Programmer Should Know About Memory', type: 'Whitepaper', authorOrSource: 'Ulrich Drepper' }
    ]
  },

  'ds-3': {
    id: 'ds-3',
    title: 'Linked Lists & Fast/Slow Pointers',
    estimatedReadingTime: '18 mins',
    beginnerSummary:
      'A Linked List stores elements in dynamically allocated nodes connected via next pointers. Unlike arrays, inserting or deleting a node given its predecessor takes O(1) time without shifting memory, while Floyd’s Fast & Slow Pointer technique detects cycles and midpoints in O(N) time and O(1) space.',
    realWorldAnalogy:
      'An Array is a row of numbered theater seats bolted together; a Linked List is a treasure hunt where each clue card holds a value and the exact GPS address of the next clue card.',
    keyTakeaways: [
      'Always use a Dummy (Sentinel) Node (dummy = ListNode(0, head)) when the head node itself might be deleted or reversed.',
      'In-place iterative reversal rewires curr.next = prev using 3 pointers (prev, curr, nxt) in O(N) time and O(1) auxiliary space.',
      'Floyd’s Tortoise & Hare advances slow by 1 step and fast by 2 steps — finding the middle node or detecting cycles in O(1) space.'
    ],
    syntaxCheatTable: [
      { syntax: 'dummy = ListNode(0, head)', description: 'Sentinel node eliminating null-head edge cases', example: 'return dummy.next' },
      { syntax: 'slow = slow.next; fast = fast.next.next', description: 'Floyd Fast/Slow pointer movement', example: 'Middle node or Cycle detection' },
      { syntax: 'curr.next = prev', description: 'Core pointer reversal step', example: 'O(N) Time, O(1) Space' }
    ],
    fillBlankExercise: {
      prompt: 'In Floyd’s cycle detection algorithm, if slow moves 1 step per iteration, how many steps does fast move?',
      codeBefore: 'slow = slow.next\nfast = ',
      answer: 'fast.next.next',
      codeAfter: '',
      hint: 'Chain .next twice on fast.'
    },
    contentMarkdown: `# Linked Lists: Pointer Manipulation, Reversal & Floyd's Cycle Detection

## 1. Pure Concept Explanation: Node Memory Layout vs Arrays

Each node in a **Singly Linked List** is an independent heap allocation containing two fields:
1. \`val\`: The payload data (e.g. 8 bytes).
2. \`next\`: An 8-byte memory pointer referencing the next \`ListNode\` in RAM (or \`None\` / \`nullptr\` at the tail).

\`\`\`text
[ val: 10 | next: 0x7F20 ] ---> [ val: 20 | next: 0x9A10 ] ---> [ val: 30 | next: None ]
   (Head @ 0x4B00)                 (Node 2 @ 0x7F20)               (Tail @ 0x9A10)
\`\`\`

Because nodes are scattered across the heap rather than contiguous, **random access \`list[k]\` takes $O(k)$ time** (you must walk $k$ pointers from \`head\`). However, **inserting or deleting a node after a known pointer takes strict $O(1)$ time** (just 2 pointer assignments, zero element shifting!).

---

## 2. Step-by-Step Dry Run: Iterative In-Place Reversal ($O(N)$ Time, $O(1)$ Space)

Given \`10 -> 20 -> 30 -> None\`, we initialize \`prev = None\` and \`curr = head (10)\`:
1. **Iteration 1 (\`curr = 10\`)**: Save \`nxt = 20\`. Point \`10.next = None\`. Advance \`prev = 10\`, \`curr = 20\`.
2. **Iteration 2 (\`curr = 20\`)**: Save \`nxt = 30\`. Point \`20.next = 10\`. Advance \`prev = 20\`, \`curr = 30\`.
3. **Iteration 3 (\`curr = 30\`)**: Save \`nxt = None\`. Point \`30.next = 20\`. Advance \`prev = 30\`, \`curr = None\`.
4. **Loop Terminates**: \`prev\` is the new head of \`30 -> 20 -> 10 -> None\`!

---

## 3. Time & Space Complexity Comparison (Iterative vs Recursive vs Hash Set)

| Linked List Operation / Algorithm | Time Complexity $T(N)$ | Auxiliary Space $S(N)$ | Concrete Example & Engineering Explanation |
| :--- | :--- | :--- | :--- |
| **Insert / Delete at Head** | **$O(1)$** | **$O(1)$** | Rewires \`new_node.next = head; head = new_node\` in 2 CPU ops. |
| **Search / Index Lookup ($k$-th node)** | **$O(N)$** | **$O(1)$** | Must traverse $N$ pointers sequentially from \`head\`. |
| **Iterative Reversal (3 Pointers)** | **$O(N)$** | **$O(1)$** | Visits each node once; uses only 3 pointer variables (\`24 bytes\`) regardless of $N$. |
| **Recursive Reversal** | **$O(N)$** | **$O(N)$ Stack** | Allocates $N$ stack frames! On $N = 50,000$, crashes with \`RecursionError\`. |
| **Cycle Detection (Hash Set vs Floyd’s)** | **$O(N)$** | **$O(N)$ vs $O(1)$** | A \`visited\` Set uses $O(N)$ RAM; Floyd’s Tortoise & Hare uses **$O(1)$ space** (2 pointers)! |

---

## 4. Interactive Live Linked List Lab (Try it Yourself)

Click **Try it Yourself →** to open the Popup Code Editor and run in-place reversal and Floyd's middle-node finder:

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

def reverse_linked_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next      # 1. Save next node
        curr.next = prev     # 2. Reverse pointer
        prev = curr          # 3. Advance prev
        curr = nxt           # 4. Advance curr
    return prev

# Build 10 -> 20 -> 30 -> 40
head = ListNode(10, ListNode(20, ListNode(30, ListNode(40))))
print("Original List:", to_list(head))
reversed_head = reverse_linked_list(head)
print("Reversed List (O(N) Time, O(1) Space):", to_list(reversed_head))
\`\`\``,
    quizzes: [
      {
        id: 'ds3-q1',
        question: "In Floyd's cycle detection, why is its space complexity O(1) while a Hash Set approach is O(N)?",
        options: [
          'Floyd’s algorithm deletes nodes as it goes',
          'Floyd’s algorithm only stores two pointer variables (slow and fast) in memory regardless of how many million nodes are in the list',
          'Hash Sets take O(N²) space',
          'Linked lists do not use RAM'
        ],
        correctAnswerIndex: 1,
        explanation: 'Floyd’s Tortoise and Hare uses only two references (slow and fast), requiring constant O(1) auxiliary space.'
      }
    ],
    codingChallenge: {
      title: 'Reverse Linked List In-Place (O(N) Time, O(1) Space)',
      description: 'Reverse a singly linked list iteratively in O(N) time and O(1) auxiliary memory.',
      language: 'python',
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Test Dry Run
n1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
rev = reverse_list(n1)
vals = []
while rev:
    vals.append(rev.val)
    rev = rev.next
print("Reversed Linked List:", vals)
`,
      solutionCode: `def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
      hint: 'Track prev, curr, and nxt pointers.'
    },
    interviewQuestions: [
      {
        companyTag: 'Microsoft',
        question: 'How do you reverse nodes of a linked list in k-group in O(N) time and O(1) space?',
        answer: 'Use a dummy head node. Before reversing each group, check if k nodes remain. Reverse those k nodes in-place using the 3-pointer pattern, connect the previous group tail to the new group head, and advance the pointer to the next group.'
      }
    ],
    resources: [
      { title: 'Stanford CS Library: Linked List Basics & Pointer Problems', type: 'Documentation', authorOrSource: 'Nick Parlante (Stanford CS)' }
    ]
  },

  'ds-4': {
    id: 'ds-4',
    title: 'Stacks, Queues & Monotonic Stack',
    estimatedReadingTime: '22 mins',
    beginnerSummary:
      'A Stack is a Last-In, First-Out (LIFO) structure where push and pop happen at the top in O(1) time. A Queue is First-In, First-Out (FIFO). A Monotonic Stack keeps elements sorted to solve Next Greater Element and Histogram problems in O(N) time instead of O(N²).',
    realWorldAnalogy:
      'A Stack is a stack of cafeteria trays (you take the top tray that was placed last — LIFO). A Queue is a checkout line at a store (the first person in line is served first — FIFO).',
    keyTakeaways: [
      'Stack operations (push, pop, peek) are O(1) time; in Python, use a list for a Stack and collections.deque for an O(1) Queue.',
      'Never use list.pop(0) for a Queue in Python because shifting N-1 elements left takes O(N) time — use deque.popleft() which is O(1)!',
      'In a Monotonic Stack, each of the N elements is pushed once and popped at most once, proving amortized O(N) time and O(N) space.'
    ],
    syntaxCheatTable: [
      { syntax: 'stack.append(x) / stack.pop()', description: 'O(1) LIFO Stack push and pop', example: 'Valid Parentheses, Undo history' },
      { syntax: 'deque.append(x) / deque.popleft()', description: 'O(1) FIFO Queue enqueue and dequeue', example: 'BFS Level-order traversal' },
      { syntax: 'while stack and arr[stack[-1]] < x:', description: 'Monotonic Decreasing Stack invariant', example: 'Next Greater Element in O(N)' }
    ],
    fillBlankExercise: {
      prompt: 'In Python’s collections.deque, which method removes and returns the leftmost (front) element in O(1) time?',
      codeBefore: 'from collections import deque\nq = deque([10, 20, 30])\nfront = q.',
      answer: 'popleft',
      codeAfter: '()',
      hint: 'Combines pop and left into one method name.'
    },
    contentMarkdown: `# Stacks, Queues & Monotonic Structures (Pure Concept + Complexity Proof)

## 1. Pure Concept: LIFO Stack vs FIFO Queue vs Monotonic Stack

1. **Stack (LIFO — Last-In, First-Out)**: Supports \`push(x)\`, \`pop()\`, and \`peek()\` at a single end in **$O(1)$ time**. Used for function call stacks, bracket matching, and DFS.
2. **Queue (FIFO — First-In, First-Out)**: Enqueues at the back (\`tail\`) and dequeues from the front (\`head\`) in **$O(1)$ time** when backed by a doubly-linked list or circular ring buffer (\`collections.deque\`).
3. **Monotonic Stack**: A stack whose elements (or their array values) are maintained in strictly **increasing** or **decreasing** order. Whenever a new element \`arr[i]\` violates monotonicity, we pop smaller/larger elements from the stack—instantly discovering their **Next Greater** or **Next Smaller** element!

---

## 2. Step-by-Step Dry Run: Next Greater Element (\`[73, 74, 75, 71, 69, 72, 76]\`)

We want to find how many days until a warmer temperature for each day:
- **Day 0 (\`73\`)**: Stack empty $\\rightarrow$ push index \`0\`. Stack: \`[0 (73)]\`
- **Day 1 (\`74\`)**: \`74 > 73\` $\\rightarrow$ pop \`0\`, set \`ans[0] = 1 - 0 = 1\`. Push \`1\`. Stack: \`[1 (74)]\`
- **Day 2 (\`75\`)**: \`75 > 74\` $\\rightarrow$ pop \`1\`, set \`ans[1] = 2 - 1 = 1\`. Push \`2\`. Stack: \`[2 (75)]\`
- **Day 3 (\`71\`) & Day 4 (\`69\`)**: Smaller than \`75\` $\\rightarrow$ push \`3\`, push \`4\`. Stack: \`[2 (75), 3 (71), 4 (69)]\`
- **Day 5 (\`72\`)**: \`72 > 69\` (pop \`4\`, \`ans[4] = 1\`) and \`72 > 71\` (pop \`3\`, \`ans[3] = 2\`). Push \`5\`. Stack: \`[2 (75), 5 (72)]\`
- **Day 6 (\`76\`)**: \`76 > 72\` (pop \`5\`, \`ans[5] = 1\`) and \`76 > 75\` (pop \`2\`, \`ans[2] = 4\`). Push \`6\`.

---

## 3. Mathematical Time & Space Complexity Proof

Why is a Monotonic Stack **$O(N)$ Time** even though there is a \`while\` loop inside a \`for\` loop?
- **Aggregate Amortized Proof**: Every index $i \\in [0, N-1]$ is pushed onto the stack **exactly once** ($N$ pushes total). An index can only be popped inside the \`while\` loop if it is currently on the stack—so across the **entire** run of the algorithm, \`stack.pop()\` executes **at most $N$ times**!
- **Total Operations**: $N \\text{ pushes} + (\\le N \\text{ pops}) \\le 2N = \\mathbf{O(N)}$ **Time Complexity**!
- **Space Complexity**: In the worst case (a strictly decreasing array like \`[90, 80, 70, 60]\`), no elements are popped during the scan, so the stack holds $N$ indices $\\implies \\mathbf{O(N)}$ **Auxiliary Space**.

---

## 4. Interactive Monotonic Stack Lab (Try it Yourself)

Click **Try it Yourself →** to pop up the Code Editor and run the $O(N)$ Monotonic Stack solver:

\`\`\`python
def daily_temperatures(temperatures: list) -> list:
    n = len(temperatures)
    ans = [0] * n
    stack = []  # Stores indices in monotonic decreasing order of temperature

    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)

    return ans

temps = [73, 74, 75, 71, 69, 72, 76, 73]
print("Daily Temperatures:", temps)
print("Days Until Warmer (O(N) Time, O(N) Space):", daily_temperatures(temps))
\`\`\``,
    quizzes: [
      {
        id: 'ds4-q1',
        question: 'What is the time and auxiliary space complexity of the Next Greater Element algorithm using a monotonic stack for an array of size N?',
        options: [
          'O(N²) Time, O(1) Space',
          'O(N) Time, O(N) Auxiliary Space',
          'O(N log N) Time, O(log N) Space',
          'O(2^N) Time, O(N) Space'
        ],
        correctAnswerIndex: 1,
        explanation: 'Each element is pushed once and popped at most once (<= 2N operations = O(N) time), and the stack holds at most N indices (O(N) space).'
      }
    ],
    codingChallenge: {
      title: 'Daily Temperatures (O(N) Monotonic Stack)',
      description: 'Given daily temperatures, return how many days you must wait after day i for a warmer temperature.',
      language: 'python',
      starterCode: `def daily_temperatures(temperatures: list) -> list:
    n = len(temperatures)
    ans = [0] * n
    stack = []

    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)

    return ans

print("Result:", daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
`,
      solutionCode: `def daily_temperatures(temperatures: list) -> list:
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
    return ans
`,
      hint: 'Maintain indices of temperatures in a stack in decreasing order; pop when encountering a warmer day.'
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: 'How do you implement a Sliding Window Maximum in O(N) time and O(K) space?',
        answer: 'Use a Monotonic Decreasing Deque storing array indices of size at most K. Before pushing index i: 1) Pop indices from the back whose values are <= nums[i]; 2) Pop the front index if it fell outside the window (front <= i - k); 3) The front of the deque is always the maximum for the current window in O(1).'
      }
    ],
    resources: [
      { title: "Competitive Programmer's Handbook: Amortized & Monotonic Structures", type: 'Book', authorOrSource: 'Antti Laaksonen' }
    ]
  },

  'ds-5': {
    id: 'ds-5',
    title: 'Binary Trees, BSTs & Tree Traversals',
    estimatedReadingTime: '24 mins',
    beginnerSummary:
      'A Binary Tree is a hierarchical structure where each node has at most two children (left and right). A Binary Search Tree (BST) enforces the ordering invariant Left < Root < Right, enabling O(log N) search on balanced trees and sorted output via In-Order Traversal.',
    realWorldAnalogy:
      'A balanced Binary Search Tree is like the ’20 Questions’ game: every yes/no comparison eliminates half of the remaining possibilities, finding 1 item among 1,000,000 in just 20 steps!',
    keyTakeaways: [
      'In-Order Traversal (Left -> Root -> Right) of a Binary Search Tree visits nodes in strictly sorted ascending order.',
      'Tree traversals (DFS Pre/In/Post-Order and BFS Level-Order) visit every node once -> O(N) Time Complexity.',
      'Space Complexity of DFS on a tree of height H is O(H) call-stack frames: O(log N) for balanced trees, but O(N) for a skewed degenerate tree!'
    ],
    syntaxCheatTable: [
      { syntax: 'In-Order: Left -> Root -> Right', description: 'Yields sorted ascending values on a BST', example: 'Validate BST, Kth Smallest Element' },
      { syntax: 'Pre-Order: Root -> Left -> Right', description: 'Processes parent before children', example: 'Clone / Serialize Binary Tree' },
      { syntax: 'Post-Order: Left -> Right -> Root', description: 'Bottom-up subtree aggregation', example: 'Tree Height, Diameter, LCA' },
      { syntax: 'Level-Order (BFS via Queue)', description: 'Visits nodes level by level from top to bottom', example: 'Right Side View, Minimum Depth' }
    ],
    fillBlankExercise: {
      prompt: 'Which DFS traversal order visits Left Subtree, then Root, then Right Subtree (producing sorted order on a BST)?',
      codeBefore: '# BST Sorted Traversal Order: ',
      answer: 'Inorder',
      codeAfter: ' Traversal',
      hint: 'Root is visited IN between Left and Right (Inorder).'
    },
    contentMarkdown: `# Binary Trees, BSTs & Traversals (Pure Concept + Time/Space Examples)

## 1. Pure Concept: Tree Anatomy & The BST Invariant

A **Binary Tree** consists of nodes containing \`val\`, \`left\`, and \`right\`.
- **Height ($H$)**: Number of edges on the longest path from the root to a leaf.
  - **Balanced Binary Tree**: $H \\approx \\log_2 N$ (e.g., $N = 1,023 \\implies H = 9$).
  - **Skewed (Degenerate) Tree**: Every node has only one child (looks like a linked list) $\\implies H = N - 1$.
- **Binary Search Tree (BST) Invariant**: For every node $u$, **all** keys in \`u.left\` are $< u.\\text{val}$, and **all** keys in \`u.right\` are $> u.\\text{val}$.

---

## 2. Step-by-Step Dry Run: All 4 Tree Traversals

Consider this balanced BST:
\`\`\`text
        50
       /  \\
     25    75
    /  \\     \\
  12   37    88
\`\`\`
1. **Pre-Order (\`Root, Left, Right\`)**: \`[50, 25, 12, 37, 75, 88]\` (Root \`50\` comes first).
2. **In-Order (\`Left, Root, Right\`)**: \`[12, 25, 37, 50, 75, 88]\` (**Strictly sorted!**).
3. **Post-Order (\`Left, Right, Root\`)**: \`[12, 37, 25, 88, 75, 50]\` (Children computed before Root \`50\`).
4. **Level-Order BFS (Queue)**: Level 0: \`[50]\`, Level 1: \`[25, 75]\`, Level 2: \`[12, 37, 88]\`.

---

## 3. Complete Time & Space Complexity Breakdown

| Operation / Algorithm | Best / Balanced Case | Worst / Skewed Case | Auxiliary Space $S(N)$ | Concrete Memory & Operation Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **BST Search / Insert / Delete** | **$O(\\log N)$ Time** | **$O(N)$ Time** | $O(1)$ Iterative / $O(H)$ Recursive | At $N = 10^6$: Balanced tree checks **20 nodes**; skewed tree checks **$1,000,000$ nodes** (fix via AVL / Red-Black Tree). |
| **DFS Traversal (Pre / In / Post)** | **$O(N)$ Time** | **$O(N)$ Time** | **$O(H)$ Call Stack** | Visits all $N$ nodes. Call stack holds at most $H$ active ancestor frames: $O(\\log N)$ balanced vs $O(N)$ skewed. |
| **BFS Level-Order Traversal** | **$O(N)$ Time** | **$O(N)$ Time** | **$O(W) = O(N)$ Queue** | Max queue width $W$ occurs at the bottom level of a complete binary tree, which contains $\\lceil N/2 \\rceil = O(N)$ nodes! |
| **Morris In-Order Traversal** | **$O(N)$ Time** | **$O(N)$ Time** | **$O(1)$ Auxiliary** | Temporarily threads predecessor right pointers to return up the tree without a recursion stack! |

---

## 4. Interactive Binary Tree & LCA Lab (Try it Yourself)

Click **Try it Yourself →** to pop open the Code Editor and run In-Order BST traversal and Lowest Common Ancestor (LCA):

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode) -> list:
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

def lowest_common_ancestor(root: TreeNode, p_val: int, q_val: int):
    if not root or root.val == p_val or root.val == q_val:
        return root
    left = lowest_common_ancestor(root.left, p_val, q_val)
    right = lowest_common_ancestor(root.right, p_val, q_val)
    if left and right:
        return root
    return left if left else right

# Build BST: 50 -> (25 -> (12, 37), 75 -> (None, 88))
bst = TreeNode(50, TreeNode(25, TreeNode(12), TreeNode(37)), TreeNode(75, None, TreeNode(88)))
print("In-Order Sorted BST Output:", inorder_traversal(bst))
lca = lowest_common_ancestor(bst, 12, 37)
print("Lowest Common Ancestor of 12 and 37:", lca.val)
\`\`\``,
    quizzes: [
      {
        id: 'ds5-q1',
        question: 'What is the auxiliary space complexity of recursive Depth-First Search (DFS) on a Binary Tree with N nodes and height H?',
        options: [
          'Always O(1)',
          'O(H) call stack frames — which is O(log N) for a balanced tree and O(N) for a skewed tree',
          'O(N²) stack frames',
          'O(2^N) memory'
        ],
        correctAnswerIndex: 1,
        explanation: 'Recursive DFS only keeps the current root-to-node path on the call stack, so maximum stack depth equals the tree height H.'
      }
    ],
    codingChallenge: {
      title: 'Lowest Common Ancestor & BST In-Order Traversal',
      description: 'Find the Lowest Common Ancestor (LCA) of two nodes in O(N) time and O(H) auxiliary stack space.',
      language: 'python',
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: TreeNode, p: int, q: int) -> TreeNode:
    if not root or root.val == p or root.val == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right

root = TreeNode(3, TreeNode(5, TreeNode(6), TreeNode(2)), TreeNode(1, TreeNode(0), TreeNode(8)))
print("LCA of 5 and 1:", lowest_common_ancestor(root, 5, 1).val)
print("LCA of 6 and 2:", lowest_common_ancestor(root, 6, 2).val)
`,
      solutionCode: `def lowest_common_ancestor(root: TreeNode, p: int, q: int) -> TreeNode:
    if not root or root.val == p or root.val == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    return root if (left and right) else (left or right)
`,
      hint: 'Post-order bottom-up search: if left and right both return non-null, the current root is the LCA.'
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: 'Why does checking only (node.left.val < node.val < node.right.val) fail to validate a Binary Search Tree?',
        answer: 'Because the BST invariant applies to the ENTIRE subtree, not just immediate children! A node in the left subtree of 50 could be the right child of 25 with value 60 (60 > 25 locally, but invalid because 60 > 50). You must pass valid range bounds (min_val, max_val) down recursively in O(N) time.'
      }
    ],
    resources: [
      { title: 'Algorithms (4th Edition): Balanced Search Trees', type: 'Book', authorOrSource: 'Robert Sedgewick' }
    ]
  },

  'ds-6': {
    id: 'ds-6',
    title: 'Graphs: BFS, DFS, Dijkstra & Topological Sort',
    estimatedReadingTime: '26 mins',
    beginnerSummary:
      'Graphs model networks of vertices (V) connected by edges (E). Breadth-First Search (BFS) finds shortest paths in unweighted graphs in O(V + E) time, Topological Sort orders dependencies in DAGs, and Dijkstra’s algorithm finds shortest paths in non-negative weighted graphs in O((V + E) log V) time.',
    realWorldAnalogy:
      'BFS is like ripples spreading outward in concentric circles when you drop a stone in water (finding the closest nodes first); DFS is exploring a single cave tunnel all the way to the end before backtracking.',
    keyTakeaways: [
      'Adjacency Lists use O(V + E) space (ideal for sparse real-world graphs), whereas Adjacency Matrices use O(V²) space.',
      'BFS uses a FIFO Queue and guarantees the shortest path in unweighted graphs in O(V + E) time and O(V) space.',
      'Dijkstra uses a Min-Heap Priority Queue to greedily relax edges in O((V + E) log V) time (requires non-negative edge weights).'
    ],
    syntaxCheatTable: [
      { syntax: 'Adjacency List: adj[u].append(v)', description: 'O(V + E) space graph representation', example: 'Default choice for sparse graphs' },
      { syntax: 'BFS (Queue + visited set)', description: 'Unweighted shortest path in O(V + E)', example: 'Word Ladder, Shortest Grid Path' },
      { syntax: 'Kahn’s Topo Sort (indegree == 0)', description: 'Orders DAG tasks & detects cycles in O(V + E)', example: 'Course Schedule, Build Systems' },
      { syntax: 'Dijkstra (heapq Min-Heap)', description: 'Weighted shortest path in O((V + E) log V)', example: 'Network routing, Maps ETA' }
    ],
    fillBlankExercise: {
      prompt: 'What is the time complexity of Breadth-First Search (BFS) and Depth-First Search (DFS) on a graph with V vertices and E edges using an Adjacency List?',
      codeBefore: '# Graph Traversal Time Complexity: ',
      answer: 'O(V + E)',
      codeAfter: '',
      hint: 'Sum of vertices V and edges E inside O(...).'
    },
    contentMarkdown: `# Graph Algorithms: Representations, BFS, DFS, Topological Sort & Dijkstra

## 1. Pure Concept: Adjacency List vs Adjacency Matrix Space & Time

A graph $G = (V, E)$ has $|V|$ vertices and $|E|$ edges. How we store it in memory directly dictates both Time and Space Complexity:

| Representation | Space Complexity | Check Edge \`(u, v)\` | Iterate Neighbors of \`u\` | Concrete Example ($V = 100,000$, $E = 300,000$) |
| :--- | :--- | :--- | :--- | :--- |
| **Adjacency List** | **$O(V + E)$** | $O(\\text{deg}(u))$ | **$O(\\text{deg}(u))$** | Uses **~3.2 MB RAM** ($400,000$ ints). Full BFS takes **$0.4\\text{ ms}$**! |
| **Adjacency Matrix** | **$O(V^2)$** | **$O(1)$** | $O(V)$ | Needs $10^{10}$ cells = **40 GB RAM** (Out-of-Memory crash!). |

---

## 2. Step-by-Step Complexity Derivations for Core Graph Algorithms

1. **BFS & DFS ($T = O(V + E)$, $S = O(V)$)**:
   - **Time**: Every vertex is enqueued/visited at most once ($O(V)$), and we scan the adjacency list of each vertex once. Across all vertices, the sum of adjacency list lengths is $\\sum \\text{deg}(u) = E$ (or $2E$ for undirected). Total time $= O(V + E)$.
   - **Space**: The \`visited\` set holds $V$ vertices ($O(V)$), and the BFS queue / DFS stack holds at most $V$ vertices ($O(V)$).
2. **Kahn's Topological Sort ($T = O(V + E)$, $S = O(V)$)**:
   - Computes \`indegree[v]\` for all $V$ nodes in $O(V + E)$, pushes \`indegree == 0\` nodes to a queue, and decrements neighbor indegrees once per edge ($E$ times). If \`visited_count < V\`, a **cycle** exists!
3. **Dijkstra's Shortest Path ($T = O((V + E) \\log V)$, $S = O(V)$)**:
   - Each edge relaxation can push a \`(new_dist, v)\` pair into the binary Min-Heap ($O(\\log V)$ per push/pop), yielding $O((V + E) \\log V)$ time.

---

## 3. Interactive Graph Lab: Topological Sort & Dijkstra (Try it Yourself)

Click **Try it Yourself →** to open the Popup Code Editor and run Kahn's Topological Sort and Dijkstra's Shortest Path:

\`\`\`python
from collections import deque
import heapq

def can_finish_courses(num_courses: int, prerequisites: list) -> tuple:
    adj = {i: [] for i in range(num_courses)}
    indegree = [0] * num_courses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1

    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    topo_order = []
    while queue:
        u = queue.popleft()
        topo_order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    return len(topo_order) == num_courses, topo_order

def dijkstra_shortest_path(n: int, edges: list, start: int) -> dict:
    adj = {i: [] for i in range(n)}
    for u, v, w in edges:
        adj[u].append((v, w))
    dist = {i: float('inf') for i in range(n)}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    return dist

ok, order = can_finish_courses(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
print("Topological Sort Valid:", ok, "| Execution Order:", order)
print("Dijkstra Shortest Distances from Node 0:", dijkstra_shortest_path(4, [(0,1,2), (0,2,6), (1,2,1), (1,3,5), (2,3,1)], 0))
\`\`\``,
    quizzes: [
      {
        id: 'ds6-q1',
        question: "Why does Dijkstra's algorithm fail when applied to graphs with negative edge weights?",
        options: [
          'Priority queues cannot store negative numbers',
          'Dijkstra greedily assumes that once the minimum-distance node is popped from the heap, its shortest path can never be improved later — a negative edge down the road violates this monotonic invariant',
          'It causes infinite loops on trees',
          'Adjacency lists forbid negative integers'
        ],
        correctAnswerIndex: 1,
        explanation: 'Dijkstra relies on non-negative edge weights so path costs only increase as edges are added. Negative edge weights require Bellman-Ford in O(V * E) time.'
      }
    ],
    codingChallenge: {
      title: "Course Schedule (Kahn's O(V + E) Topological Sort)",
      description: 'Determine if all courses can be completed given prerequisite pairs using indegree topological sorting.',
      language: 'python',
      starterCode: `from collections import deque

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

print("DAG [[1,0],[2,1]] Can Finish:", can_finish(3, [[1, 0], [2, 1]]))
print("Cycle [[1,0],[0,1]] Can Finish:", can_finish(2, [[1, 0], [0, 1]]))
`,
      solutionCode: `from collections import deque

def can_finish(num_courses: int, prerequisites: list) -> bool:
    adj = {i: [] for i in range(num_courses)}
    indegree = [0] * num_courses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    visited = 0
    while queue:
        u = queue.popleft()
        visited += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return visited == num_courses
`,
      hint: 'Calculate in-degrees; push in-degree 0 nodes to queue; decrement neighbors on pop.'
    },
    interviewQuestions: [
      {
        companyTag: 'Uber',
        question: 'How does Uber calculate route ETAs across a city road network with 10M edges in real time?',
        answer: 'Raw Dijkstra on 10M edges takes seconds. Production routing engines preprocess the road graph using Contraction Hierarchies (CH) and hexagonal H3 spatial indexing, allowing bidirectional Dijkstra over shortcut edges to finish in < 5 milliseconds.'
      }
    ],
    resources: [
      { title: 'Contraction Hierarchies: Fast and Exact Routing', type: 'Whitepaper', authorOrSource: 'Geisberger et al.' }
    ]
  },

  'ds-7': {
    id: 'ds-7',
    title: 'Dynamic Programming (Memoization & Tabulation)',
    estimatedReadingTime: '28 mins',
    beginnerSummary:
      'Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and caching each subproblem’s answer once — transforming O(2^N) exponential recursion into O(N) or O(N × W) polynomial time.',
    realWorldAnalogy:
      'If someone asks you "1+1+1+1+1", you count to 5. If they add "+1" at the end, you do not recount from scratch — you remember the previous answer (5) and add 1 to get 6 in O(1) time! That is Memoization.',
    keyTakeaways: [
      'A problem is solved with DP when it has: 1) Overlapping Subproblems (same state computed repeatedly) and 2) Optimal Substructure.',
      'Top-Down Memoization caches recursive calls in a dictionary/array (Time: O(States × Transitions), Space: O(States) + O(Depth) stack).',
      'Bottom-Up Tabulation fills an iterative array from base cases and allows Space Optimization (dropping O(N) or O(M×N) space down to O(1) or O(N)).'
    ],
    syntaxCheatTable: [
      { syntax: 'Naive Recursion: O(2^N) Time', description: 'Recomputes identical subproblems exponentially', example: 'fib(40) makes 331,160,281 calls!' },
      { syntax: 'Top-Down Memoization: O(N) Time', description: 'Caches dp[state] on first computation', example: 'Space: O(N) cache + O(N) call stack' },
      { syntax: 'Bottom-Up Tabulation: O(N) Time', description: 'Iterative loop from base cases', example: 'Space: O(N) table (zero recursion overhead)' },
      { syntax: 'Space-Optimized DP: O(1) Space', description: 'Keeps only the last 1-2 states/rows needed', example: 'prev2, prev1 = prev1, prev1 + prev2' }
    ],
    fillBlankExercise: {
      prompt: 'When optimizing a 1D DP recurrence where dp[i] only depends on dp[i-1] and dp[i-2], what can the auxiliary space complexity be reduced to?',
      codeBefore: '# Space-Optimized Fibonacci / Climbing Stairs Space: ',
      answer: 'O(1)',
      codeAfter: '',
      hint: 'Constant space notation.'
    },
    contentMarkdown: `# Dynamic Programming: Pure Concept, Complexity Evolution & Space Optimization

## 1. Pure Concept: Why Naive Recursion Explodes to $O(2^N)$

Consider computing \`fib(5)\` or **Climbing Stairs** where $f(n) = f(n-1) + f(n-2)$:
- Without caching, $f(5)$ computes $f(4)$ and $f(3)$. Then $f(4)$ recomputes $f(3)$ and $f(2)$ from scratch!
- The recursion tree branches by 2 at every level, performing **$O(2^N)$ operations** ($2^{50} \\approx 1.12 \\times 10^{15}$ ops $\\approx 13\\text{ days}$ of CPU time!).
- By storing each computed state $f(k)$ in a table (\`dp[k]\`), there are only **$N$ distinct states**, and each state takes **$O(1)$ work** to combine $f(k-1) + f(k-2)$ $\\implies$ **$O(N)$ Time** ($50$ ops $\\approx 50\\text{ nanoseconds}$)!

---

## 2. The 4-Stage DP Complexity Progression (Every Interviewer Expects This!)

| Implementation Stage | Time Complexity $T(N)$ | Auxiliary Space $S(N)$ | Concrete $N = 45$ Operations & Memory |
| :--- | :--- | :--- | :--- |
| **1. Naive Recursion** | **$O(2^N)$** | **$O(N)$ Call Stack** | $2.27 \\times 10^9$ calls (~4.5 seconds) + 45 stack frames. |
| **2. Top-Down Memoization** | **$O(N)$** | **$O(N)$ Cache + $O(N)$ Stack** | **45 operations** (~0.001 ms); uses dict + call stack. |
| **3. Bottom-Up 1D Tabulation** | **$O(N)$** | **$O(N)$ Array** | **45 loop iterations**; allocates 1 array of length 46 (zero recursion). |
| **4. Space-Optimized Bottom-Up** | **$O(N)$** | **$O(1)$ Auxiliary** | **45 loop iterations**; uses only **2 variables** (\`prev1\`, \`prev2\` = 16 bytes)! |

---

## 3. 2D DP Complexity Example: Coin Change & 0/1 Knapsack

For **Coin Change** with target \`amount = A\` and \`C\` coin denominations:
- **State Definition**: \`dp[a]\` = fewest coins needed to make amount \`a\`.
- **Recurrence**: $\\text{dp}[a] = \\min_{c \\in \\text{coins}} (1 + \\text{dp}[a - c])$.
- **Time Complexity**: $A$ states $\\times C$ transitions per state $= \\mathbf{O(A \\times C)}$.
- **Space Complexity**: A 1D array \`dp[0..A]\` of size $A + 1 = \\mathbf{O(A)}$ auxiliary space.

---

## 4. Interactive DP Lab: Coin Change & Space-Optimized DP (Try it Yourself)

Click **Try it Yourself →** to pop open the Code Editor and run both $O(1)$-space Climbing Stairs and $O(A \\times C)$ Coin Change:

\`\`\`python
def climb_stairs_space_optimized(n: int) -> int:
    # O(N) Time, O(1) Auxiliary Space (only 2 variables!)
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

def coin_change(coins: list, amount: int) -> int:
    # O(amount * len(coins)) Time, O(amount) Auxiliary Space
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != float('inf') else -1

print("Climbing n=10 Stairs (O(N) Time, O(1) Space):", climb_stairs_space_optimized(10))
print("Fewest Coins for 11 using [1, 2, 5]:", coin_change([1, 2, 5], 11))
\`\`\``,
    quizzes: [
      {
        id: 'ds7-q1',
        question: 'When optimizing a 2D dynamic programming grid (M rows by N columns) where DP[i][j] depends only on DP[i-1][j] and DP[i][j-1], what is the optimal auxiliary space complexity?',
        options: [
          'O(M * N)',
          'O(min(M, N)) using a rolling 1D array',
          'O(2^N)',
          'O(M!)'
        ],
        correctAnswerIndex: 1,
        explanation: 'Because row i depends only on row i-1, you only need a single rolling 1D array of length N (or min(M, N) by transposing), reducing space from O(M*N) to O(min(M,N)).'
      }
    ],
    codingChallenge: {
      title: 'Coin Change (Bottom-Up Tabulation)',
      description: 'Compute the fewest number of coins needed to make up a given amount in O(A * C) time and O(A) space.',
      language: 'python',
      starterCode: `def coin_change(coins: list, amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])

    return dp[amount] if dp[amount] != float('inf') else -1

print("Coins [1, 2, 5] -> Amount 11:", coin_change([1, 2, 5], 11))
print("Coins [2] -> Amount 3:", coin_change([2], 3))
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
      hint: 'dp[i] represents minimum coins for amount i; initialize with infinity and base case dp[0] = 0.'
    },
    interviewQuestions: [
      {
        companyTag: 'Apple',
        question: 'How do you solve the Longest Increasing Subsequence (LIS) in O(N log N) time instead of O(N²) DP?',
        answer: 'Maintain a monotonic array `tails` where `tails[k]` stores the smallest tail element of any increasing subsequence of length k+1 found so far. For each number x, binary search (bisect_left) its position in `tails` in O(log N) time. Total time: O(N log N), Auxiliary Space: O(N).'
      }
    ],
    resources: [
      { title: 'Dynamic Programming Patterns & State Reduction', type: 'Documentation', authorOrSource: 'Code It Out Academy' }
    ]
  }
};
