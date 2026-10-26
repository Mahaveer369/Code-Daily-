import { LessonContent } from '../../types';

export const PYTHON_AND_CORE_MODULES: Record<string, LessonContent> = {
  'py-1': {
    id: 'py-1',
    title: 'Intro & CPython Internals',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Python Internals: CPython, PyObject & The Global Interpreter Lock (GIL)

Understanding how CPython executes Python bytecode and manages thread concurrency under the GIL.

---

## 1. System Architecture: The CPython Pipeline

\`\`\`
Python Source Code (.py)
          │
          ▼
AST & Parser (Lexer + Parser)
          │
          ▼
Bytecode Compiler (.pyc)
          │
          ▼
Python Virtual Machine (PVM)
   ┌───────────────────────────────────────────┐
   │  ceval.c (Giant C switch-case loop)       │
   │  - Evaluates opcodes: LOAD_FAST, BINARY_ADD│
   │  - Protected by GIL (Global Interpreter)  │
   └───────────────────────────────────────────┘
\`\`\`

---

## 2. The Global Interpreter Lock (GIL) Deep Dive
- In CPython, memory management is **NOT thread-safe** due to reference counting (\`ob_refcnt\`).
- The GIL is a mutual exclusion lock preventing multiple OS threads from executing Python bytecode simultaneously on separate CPU cores.
- **CPU-bound tasks**: Multi-threading provides **zero speedup** (often slows down due to lock thrashing). Use \`multiprocessing\` or C-extensions releasing GIL.
- **I/O-bound tasks**: Multi-threading works effectively because threads release the GIL during network/disk I/O syscalls!
`,
    quizzes: [
      {
        id: 'py1-q1',
        question: "Why does multi-threading in CPython fail to accelerate CPU-bound workloads across multi-core processors?",
        options: [
          "Python threads are not real OS threads",
          "The Global Interpreter Lock (GIL) forces all threads to serialize execution on a single core when executing bytecode",
          "Python cannot allocate more than 4GB RAM",
          "CPython does not support multi-core CPUs"
        ],
        correctAnswerIndex: 1,
        explanation: "The GIL serializes bytecode execution so only one thread runs at any moment, regardless of how many CPU cores are physically available."
      }
    ],
    codingChallenge: {
      title: "Thread vs Process Workload Selector",
      description: "Write a function that analyzes workload profiles and recommends threading, multiprocessing, or asyncio.",
      language: "python",
      starterCode: `def select_concurrency_model(is_cpu_bound: bool, high_connection_count: bool) -> str:
    # Return 'multiprocessing', 'asyncio', or 'threading'
    pass
`,
      solutionCode: `def select_concurrency_model(is_cpu_bound: bool, high_connection_count: bool) -> str:
    if is_cpu_bound:
        return 'multiprocessing'
    elif high_connection_count:
        return 'asyncio'
    else:
        return 'threading'
`,
      hint: "Use multiprocessing for CPU bound workloads; asyncio for high concurrent I/O connections."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "How does PEP 703 (Free-threaded Python / No-GIL Python 3.13) remove the GIL?",
        answer: "PEP 703 replaces global reference counting with biased reference counting (thread-local reference counts), multi-version memory allocators (mimalloc), and thread-safe immortal objects, allowing true parallel multi-core Python execution without a central GIL."
      }
    ],
    resources: [
      { title: "CPython Internals Book", type: "Book", authorOrSource: "Anthony Shaw" }
    ]
  },

  'py-2': {
    id: 'py-2',
    title: 'Variables & Memory Management',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Variables, Memory Allocation & Garbage Collection

Python uses Reference Counting as its primary memory manager, backed by a Generational Cyclic Garbage Collector.

---

## 1. Everything is a PyObject Pointer
In CPython, an integer is not a raw 4-byte primitive; it is a full 28-byte C struct:
\`\`\`c
struct _object {
    _PyObject_HEAD_EXTRA // doubly linked list pointers
    Py_ssize_t ob_refcnt; // Reference count (8 bytes)
    struct _typeobject *ob_type; // Pointer to type (8 bytes)
};
\`\`\`

---

## 2. Cyclic Garbage Collection (Generations 0, 1, 2)
Reference counting alone **fails on circular references** (\`A.next = B; B.prev = A\`).
CPython detects cycles using 3 generational lists:
- **Generation 0**: Newly allocated objects. Collected frequently.
- **Generation 1**: Survives Gen 0 collections.
- **Generation 2**: Long-lived objects (e.g. imported modules). Collected rarely.
`,
    quizzes: [
      {
        id: 'py2-q1',
        question: "Why does Python pre-allocate and cache small integers from -5 to 256 in memory?",
        options: [
          "They are prime numbers",
          "To eliminate thousands of heap malloc() allocations for commonly used integers and loop counters",
          "Because 256 is 2^8",
          "It is required by the POSIX standard"
        ],
        correctAnswerIndex: 1,
        explanation: "Small integers are frequently used as loop indices and counters. Reusing static singleton objects saves significant heap allocation overhead."
      }
    ],
    codingChallenge: {
      title: "Circular Reference Breaker",
      description: "Use Python's weakref module to break a circular reference between Parent and Child objects.",
      language: "python",
      starterCode: `import weakref

class Parent:
    def __init__(self):
        self.child = None

class Child:
    def __init__(self, parent):
        # Store weak reference to parent instead of strong reference
        pass
`,
      solutionCode: `import weakref

class Parent:
    def __init__(self):
        self.child = None

class Child:
    def __init__(self, parent):
        self.parent_ref = weakref.ref(parent)

    @property
    def parent(self):
        return self.parent_ref()
`,
      hint: "Use weakref.ref(parent) to prevent incrementing the reference count."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "Why did Instagram disable Python's Generational GC in their Django web server workers?",
        answer: "Instagram used pre-forking uWSGI servers with shared master memory. Python's cyclic GC periodically wrote generation header pointers into memory pages, triggering Linux Copy-On-Write (COW) across all child processes and destroying 30% of server RAM sharing. Disabling GC saved gigabytes of RAM."
      }
    ],
    resources: [
      { title: "Dismissing Python Garbage Collection at Instagram", type: "Engineering Blog", authorOrSource: "Instagram Engineering" }
    ]
  },

  'py-3': {
    id: 'py-3',
    title: 'Control Flow & Bytecode Execution',
    estimatedReadingTime: '16 mins',
    contentMarkdown: `
# Control Flow: Bytecode Disassembly & PVM Stack Machine

Exploring how Python transforms loops, conditionals, and comprehensions into PVM stack instructions.

---

## 1. Disassembling with \`dis\`
\`\`\`python
import dis
def square(x):
    return x * x
dis.dis(square)
\`\`\`
Output:
\`\`\`
1           0 RESUME                   0
2           2 LOAD_FAST                0 (x)
            4 LOAD_FAST                0 (x)
            6 BINARY_OP                5 (*)
           10 RETURN_VALUE
\`\`\`
Python's PVM is a **Stack Machine**: values are pushed onto the evaluation stack and popped by arithmetic operations.
`,
    quizzes: [
      {
        id: 'py3-q1',
        question: "Why are list comprehensions faster than standard for-loops with list.append() in CPython?",
        options: [
          "Comprehensions use multithreading",
          "Comprehensions execute with a dedicated optimized LIST_APPEND opcode in C bytecode, avoiding dynamic Python method lookups on every iteration",
          "Comprehensions compile into C++",
          "For-loops cannot be unrolled"
        ],
        correctAnswerIndex: 1,
        explanation: "List comprehensions bypass the overhead of looking up `list.append` in the local/global namespace and call the underlying C function directly."
      }
    ],
    codingChallenge: {
      title: "Fast List Comprehension Filter",
      description: "Write a high-performance list comprehension that filters even numbers and squares them.",
      language: "python",
      starterCode: `def square_evens(nums: list) -> list:
    pass
`,
      solutionCode: `def square_evens(nums: list) -> list:
    return [x * x for x in nums if x % 2 == 0]
`,
      hint: "Combine [x * x for x in nums if x % 2 == 0]."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "What is the difference between an iterator and a generator in Python?",
        answer: "An iterator is any object implementing `__iter__()` and `__next__()`. A generator is a function using `yield` that automatically produces an iterator and preserves its local stack frame state across calls, yielding memory efficiency for huge datasets."
      }
    ],
    resources: [
      { title: "Fluent Python (2nd Edition)", type: "Book", authorOrSource: "Luciano Ramalho" }
    ]
  },

  'py-4': {
    id: 'py-4',
    title: 'Functions, Scope & Closures',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Functions: The LEGB Rule, Closures & Decorators

Understanding variable lookup scoping rules and how lexical closures capture state in memory.

---

## 1. The LEGB Scope Hierarchy
When a variable is referenced, Python searches in strict order:
1. **L - Local**: Inside current function body.
2. **E - Enclosing**: Inside any enclosing function closures (\`nonlocal\`).
3. **G - Global**: Top-level module variables (\`global\`).
4. **B - Built-in**: Pre-assigned names (\`len\`, \`range\`, \`Exception\`).

---

## 2. Closure Memory Cells
A closure remembers values in enclosing scopes even after the outer function has returned. Values are stored in special \`__closure__\` cell objects.
`,
    quizzes: [
      {
        id: 'py4-q1',
        question: "What happens when you modify an outer function's variable inside a nested function without using the `nonlocal` keyword?",
        options: [
          "It modifies the global variable",
          "Python treats it as an assignment creating a new local variable, and prior reads in that function raise an UnboundLocalError",
          "It throws a syntax error on compilation",
          "It automatically creates a pointer"
        ],
        correctAnswerIndex: 1,
        explanation: "Assigning to a variable inside a function marks it as local to that scope. If read prior to assignment, it raises `UnboundLocalError`."
      }
    ],
    codingChallenge: {
      title: "Memoization Decorator",
      description: "Write a functional decorator that caches function results based on arguments.",
      language: "python",
      starterCode: `def memoize(fn):
    # Cache dictionary in closure
    pass
`,
      solutionCode: `def memoize(fn):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper
`,
      hint: "Use a dictionary inside the decorator closure keyed by args."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "Why should you never use mutable default arguments (like `def func(items=[]):`) in Python?",
        answer: "Default argument expressions are evaluated once when the function definition is executed at module load time, not on each invocation. A mutable object (like a list or dict) is shared across all subsequent calls, causing state leaks."
      }
    ],
    resources: [
      { title: "Python Reference Manual: Scopes and Namespaces", type: "Documentation", authorOrSource: "python.org" }
    ]
  },

  'py-5': {
    id: 'py-5',
    title: 'Lists vs Tuples: Memory Layout',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Lists vs Tuples: Over-Allocation & Immutability

Examining physical C array layout differences and memory allocations between lists and tuples.

---

## 1. Memory Overhead Comparison
\`\`\`python
import sys
sys.getsizeof(())      # 40 bytes (fixed tuple struct)
sys.getsizeof([])      # 56 bytes (dynamic array struct with capacity buffers)
\`\`\`

---

## 2. Dynamic Array Over-Allocation Formula
When appending to a Python list, CPython does not allocate 1 slot; it over-allocates according to:
\`\`\`c
new_allocated = (size_t)newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6);
\`\`\`
This balances memory footprint against avoiding continuous \`realloc()\` calls.
`,
    quizzes: [
      {
        id: 'py5-q1',
        question: "Why is a tuple immutable and hashable, while a list is mutable and unhashable?",
        options: [
          "Tuples use 16-bit encoding",
          "Tuples have a fixed length determined at creation, ensuring their memory and hash values remain invariant for dictionary keys",
          "Lists cannot store strings",
          "Tuples are stored in CPU registers"
        ],
        correctAnswerIndex: 1,
        explanation: "Immutability guarantees that a tuple's hash value will never change, a requirement for using items as dictionary keys or set elements."
      }
    ],
    codingChallenge: {
      title: "Tuple vs List Memory Comparator",
      description: "Calculate the memory difference in bytes between a tuple and a list containing the same N integers.",
      language: "python",
      starterCode: `import sys

def memory_difference(n: int) -> int:
    # Return sys.getsizeof(list) - sys.getsizeof(tuple)
    pass
`,
      solutionCode: `import sys

def memory_difference(n: int) -> int:
    t = tuple(range(n))
    l = list(range(n))
    return sys.getsizeof(l) - sys.getsizeof(t)
`,
      hint: "Create tuple(range(n)) and list(range(n)) and compare sys.getsizeof."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "Why does Python have `namedtuple` and `dataclass(slots=True)`?",
        answer: "By default, Python class instances store attributes in a dynamic `__dict__` hash table, consuming ~150 bytes per instance. Using `__slots__` or namedtuple replaces the dict with a fixed C array of pointers, cutting memory consumption by 60% when storing millions of objects."
      }
    ],
    resources: [
      { title: "CPython listobject.c Implementation", type: "Documentation", authorOrSource: "GitHub python/cpython" }
    ]
  },

  'cs-1': {
    id: 'cs-1',
    title: 'Number Systems & Floating Point Precision',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Number Systems: Two's Complement & IEEE 754 Floating Point

Why does \`0.1 + 0.2 == 0.30000000000000004\`? How computers represent integers and real numbers in silicon.

---

## 1. Two's Complement (Signed Integers)
- Leading bit \`1\` indicates negative value.
- To negate: **Invert all bits and add 1** (\`~x + 1\`).
- Eliminates the double-zero problem (+0 and -0) and allows standard addition circuits to perform subtraction.

---

## 2. IEEE 754 Double Precision (64-Bit Float)
\`\`\`
[1 bit Sign] [11 bits Exponent (bias 1023)] [52 bits Mantissa / Fraction]
\`\`\`
Numbers like $0.1$ ($1/10$) repeat infinitely in binary: $0.0001100110011\\dots_2$. When truncated to 53 bits of precision, slight rounding errors occur.
`,
    quizzes: [
      {
        id: 'cs1-q1',
        question: "Why should financial monetary amounts never be stored using standard 64-bit IEEE 754 float types?",
        options: [
          "Floats cannot store negative numbers",
          "Binary floating-point cannot accurately represent decimal fractions like 0.1, accumulating rounding errors that cause financial discrepancies",
          "Floats are limited to $10,000",
          "Databases do not support floats"
        ],
        correctAnswerIndex: 1,
        explanation: "Binary floating-point cannot represent base-10 fractions precisely. Financial systems use integer cents or high-precision Decimal types."
      }
    ],
    codingChallenge: {
      title: "Float Epsilon Comparison",
      description: "Write a function that compares two floating-point numbers for equality within a specified epsilon tolerance.",
      language: "python",
      starterCode: `def float_equals(a: float, b: float, epsilon: float = 1e-9) -> bool:
    pass
`,
      solutionCode: `def float_equals(a: float, b: float, epsilon: float = 1e-9) -> bool:
    return abs(a - b) <= epsilon
`,
      hint: "Return abs(a - b) <= epsilon."
    },
    interviewQuestions: [
      {
        companyTag: 'Stripe',
        question: "How does Stripe store and process money amounts in their APIs?",
        answer: "Stripe represents all monetary amounts as integers in the smallest currency unit (e.g. cents for USD: $10.00 is represented as `1000`). This completely eliminates floating-point rounding errors across databases and arithmetic operations."
      }
    ],
    resources: [
      { title: "What Every Computer Scientist Should Know About Floating-Point Arithmetic", type: "Whitepaper", authorOrSource: "David Goldberg" }
    ]
  },

  'cs-2': {
    id: 'cs-2',
    title: 'Boolean Logic & Bitwise Optimization',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Boolean Logic & Bitwise Optimization Tricks

Bitwise operations execute in 1 CPU cycle and enable ultra-fast sets, masks, and mathematical shortcuts.

---

## 1. Bitwise Ninja Tricks
- **Check Power of Two**: \`x > 0 and (x & (x - 1)) == 0\`
- **Isolate Lowest Set Bit**: \`x & (-x)\` (exploits Two's complement negation)
- **Swap without Temp**: \`a ^= b; b ^= a; a ^= b;\`
- **XOR Single Number**: In an array where every element appears twice except one, XORing all elements yields the unique element ($x \\oplus x = 0$).
`,
    quizzes: [
      {
        id: 'cs2-q1',
        question: "What does the bitwise expression `x & (x - 1)` accomplish?",
        options: [
          "Multiplies x by 2",
          "Clears the lowest set bit (rightmost 1) of x",
          "Calculates x modulo 2",
          "Inverts all bits"
        ],
        correctAnswerIndex: 1,
        explanation: "Subtracting 1 flips the rightmost 1 and all trailing zeros; ANDing with x clears that lowest set bit (Brian Kernighan's algorithm)."
      }
    ],
    codingChallenge: {
      title: "Count Set Bits (Hamming Weight)",
      description: "Count the number of 1 bits in an integer using Brian Kernighan's bit manipulation in O(k) time where k is number of set bits.",
      language: "python",
      starterCode: `def count_set_bits(n: int) -> int:
    pass
`,
      solutionCode: `def count_set_bits(n: int) -> int:
    count = 0
    while n > 0:
        n &= (n - 1)
        count += 1
    return count
`,
      hint: "Repeatedly clear the lowest set bit using n &= (n - 1) and increment count."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "How do you find the two non-repeating elements in an array where every other element appears twice?",
        answer: "XOR all elements to get `X = a ^ b`. Find a set bit in X (e.g. `diff_bit = X & (-X)`). Divide the array into two groups: those with `diff_bit` set and those without. XOR each group independently; the two results are `a` and `b` in O(N) time and O(1) space."
      }
    ],
    resources: [
      { title: "Hacker's Delight (2nd Edition)", type: "Book", authorOrSource: "Henry S. Warren Jr." }
    ]
  },

  'cs-3': {
    id: 'cs-3',
    title: 'Computer Architecture: Cache Lines & False Sharing',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Computer Architecture: CPU Caches, Cache Lines & False Sharing

Modern computers are memory-latency bound. Understanding L1/L2/L3 caches and memory barriers is critical for high-concurrency systems.

---

## 1. Latency Numbers Every Programmer Should Know
- **L1 Cache Reference**: $0.5\\text{ ns}$ (4 CPU cycles)
- **L2 Cache Reference**: $3\\text{ ns}$ (14 CPU cycles)
- **L3 Cache Reference**: $15\\text{ ns}$ (Shared across cores)
- **Main Memory (DRAM)**: $60\\text{--}100\\text{ ns}$ (200x slower than L1!)
- **NVMe SSD Read**: $10,000\\text{ ns}$ ($10\\,\\mu\\text{s}$)
- **Cross-Datacenter RTT**: $50,000,000\\text{ ns}$ ($50\\text{ ms}$)

---

## 2. False Sharing
When two threads on separate CPU cores mutate independent variables that happen to share the same **64-byte Cache Line**, the MESI hardware cache coherence protocol constantly invalidates the cache line across both cores, causing severe slowdown.
- *Antidote*: **Cache Line Padding** (pad variables with 64 bytes of empty memory).
`,
    quizzes: [
      {
        id: 'cs3-q1',
        question: "What is False Sharing in multi-threaded CPU architectures?",
        options: [
          "Threads sharing files over NFS",
          "Threads on different CPU cores modifying independent variables that reside within the same 64-byte cache line, causing continuous hardware cache invalidations",
          "Memory leaks in heap allocators",
          "Virtual machine memory ballooning"
        ],
        correctAnswerIndex: 1,
        explanation: "Hardware cache coherency operates at the granularity of 64-byte cache lines. If variables share a line, writes on one core invalidate the other core's cache."
      }
    ],
    codingChallenge: {
      title: "Cache Line Alignment Calculator",
      description: "Calculate how many padding bytes are required to align a struct of a given size to the next 64-byte cache line boundary.",
      language: "python",
      starterCode: `def bytes_to_cache_align(current_bytes: int, cache_line_size: int = 64) -> int:
    pass
`,
      solutionCode: `def bytes_to_cache_align(current_bytes: int, cache_line_size: int = 64) -> int:
    rem = current_bytes % cache_line_size
    return (cache_line_size - rem) if rem != 0 else 0
`,
      hint: "Calculate remainder modulo 64; return 64 - remainder if non-zero."
    },
    interviewQuestions: [
      {
        companyTag: 'Intel',
        question: "What is the role of the CPU branch predictor and how does branch misprediction impact performance?",
        answer: "Modern CPUs use deep 14-20 stage pipelines. The branch predictor guesses which way an `if/else` conditional will branch and speculatively executes instructions. On misprediction, the entire CPU pipeline must be flushed and refilled, wasting 15-20 clock cycles."
      }
    ],
    resources: [
      { title: "Computer Architecture: A Quantitative Approach", type: "Book", authorOrSource: "Hennessy & Patterson" }
    ]
  },

  'cs-4': {
    id: 'cs-4',
    title: 'Compilers, Interpreters & JIT',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Compilers, Interpreters & JIT Compilation

From source code strings to Abstract Syntax Trees, SSA intermediate representation, and machine code.

---

## 1. Compilation Phases
1. **Lexical Analysis (Scanner)**: Text characters $\\to$ Stream of Tokens.
2. **Parsing (Syntax Analysis)**: Tokens $\\to$ Abstract Syntax Tree (AST) using context-free grammars.
3. **Semantic Analysis**: Type checking, scope resolution.
4. **Intermediate Representation (IR)**: Static Single Assignment (SSA) form (e.g. LLVM IR).
5. **Optimization**: Dead code elimination, loop unrolling, inlining.
6. **Code Generation**: Translates IR to target architecture machine instructions (x86-64 / ARM64).
`,
    quizzes: [
      {
        id: 'cs4-q1',
        question: "How does a Just-In-Time (JIT) compiler (like V8 or PyPy) achieve near C++ execution speeds for dynamic languages?",
        options: [
          "It disables type checking",
          "It monitors runtime execution, identifies 'hot' loops, and compiles frequently executed bytecode into native machine code using speculative type assumptions",
          "It compresses JavaScript files",
          "It converts code into HTML"
        ],
        correctAnswerIndex: 1,
        explanation: "JIT engines profile hot execution paths and compile them directly into native machine code with speculative type optimizations."
      }
    ],
    codingChallenge: {
      title: "Simple Arithmetic Lexer",
      description: "Tokenize a mathematical expression string like '3 + 42 * 5' into NUMBER and OPERATOR tokens.",
      language: "python",
      starterCode: `def tokenize_expression(expr: str) -> list:
    # Return list of tuples: [("NUM", 3), ("OP", "+"), ("NUM", 42), ("OP", "*"), ("NUM", 5)]
    pass
`,
      solutionCode: `def tokenize_expression(expr: str) -> list:
    tokens = []
    i = 0
    while i < len(expr):
        c = expr[i]
        if c.isspace():
            i += 1
            continue
        if c in '+-*/':
            tokens.append(("OP", c))
            i += 1
        elif c.isdigit():
            num_str = ""
            while i < len(expr) and expr[i].isdigit():
                num_str += expr[i]
                i += 1
            tokens.append(("NUM", int(num_str)))
        else:
            i += 1
    return tokens
`,
      hint: "Iterate with index i, collect consecutive digits for NUM, and recognize operator characters."
    },
    interviewQuestions: [
      {
        companyTag: 'Apple',
        question: "What is Static Single Assignment (SSA) form and why do compilers like LLVM use it?",
        answer: "In SSA form, every variable is assigned exactly once. If a variable is mutated across branches, a Phi function merges the versions. SSA drastically simplifies compiler optimization algorithms like constant propagation, dead code elimination, and register allocation."
      }
    ],
    resources: [
      { title: "Crafting Interpreters", type: "Book", authorOrSource: "Robert Nystrom" }
    ]
  },

  'cs-5': {
    id: 'cs-5',
    title: 'Networking Basics & Epoll',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Networking Basics: I/O Multiplexing (select, poll, epoll)

How modern event-driven web servers (Nginx, Node.js, Netty) handle 100,000+ concurrent connections on a single thread.

---

## 1. The C10K Problem & I/O Multiplexing
- **One-Thread-Per-Client**: Fails at 10,000 clients due to 8MB thread stack memory overhead and context switch exhaustion.
- **select / poll**: $O(N)$ scanning. Checks every socket in an array on every tick.
- **Linux Epoll**: **$O(1)$ Event-Driven**. Sockets register with the kernel; when data arrives on a network interface card (NIC), the hardware interrupt adds the socket to an Epoll ready-list.
`,
    quizzes: [
      {
        id: 'cs5-q1',
        question: "Why does Linux Epoll scale to 100,000 connections whereas `select()` degrades severely past 1,024?",
        options: [
          "Epoll uses TCP acceleration",
          "`select` copies a fixed 1024-bit mask to kernel space and scans all descriptors in O(N) time; Epoll registers descriptors once in an in-kernel Red-Black tree and returns only active sockets in O(1) time",
          "Epoll runs on the GPU",
          "select does not support sockets"
        ],
        correctAnswerIndex: 1,
        explanation: "Epoll avoids scanning inactive sockets by maintaining an in-kernel ready-list populated by network card interrupts."
      }
    ],
    codingChallenge: {
      title: "Event-Loop Queue Simulation",
      description: "Implement a micro-event loop that dequeues ready I/O events and invokes their registered callbacks.",
      language: "python",
      starterCode: `class MicroEventLoop:
    def __init__(self):
        self.callbacks = {} # fd -> callback
        self.ready_queue = []

    def register(self, fd: int, cb):
        self.callbacks[fd] = cb

    def push_ready(self, fd: int):
        self.ready_queue.append(fd)

    def run_once(self) -> int:
        # Run all callbacks in ready_queue; return count executed
        pass
`,
      solutionCode: `class MicroEventLoop:
    def __init__(self):
        self.callbacks = {}
        self.ready_queue = []

    def register(self, fd: int, cb):
        self.callbacks[fd] = cb

    def push_ready(self, fd: int):
        self.ready_queue.append(fd)

    def run_once(self) -> int:
        count = 0
        events = list(self.ready_queue)
        self.ready_queue.clear()
        for fd in events:
            if fd in self.callbacks:
                self.callbacks[fd]()
                count += 1
        return count
`,
      hint: "Snapshot and clear the ready queue, then invoke the callback for each file descriptor."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "What is the difference between Edge-Triggered (ET) and Level-Triggered (LT) mode in Linux Epoll?",
        answer: "Level-Triggered (LT) notifies you repeatedly as long as there is unread data in the socket buffer. Edge-Triggered (ET) notifies you ONLY ONCE when new data arrives. With ET, the application must loop and read with `recv()` in non-blocking mode until it returns `EAGAIN` or `EWOULDBLOCK`, otherwise subsequent data will stall indefinitely."
      }
    ],
    resources: [
      { title: "The C10K Problem", type: "Whitepaper", authorOrSource: "Dan Kegel" }
    ]
  }
};
