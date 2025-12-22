
import { LessonContent } from '../types';

export const SEED_DATA: Record<string, LessonContent> = {
  // =====================
  // PYTHON MODULES
  // =====================
  'py-1': {
    id: 'py-1',
    title: 'Intro & History',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Python: The Serpent that Swallowed the World

## 1. History & Context
Python was conceived in the late 1980s by **Guido van Rossum** at CWI in the Netherlands. Its core philosophy is summarized in *The Zen of Python* (\`import this\`).

## 2. Why Python?
- **Readable Syntax**: Code reads like English
- **Versatile**: Web, ML, Data Science, Automation
- **Huge Ecosystem**: pip has 400,000+ packages

## 3. How Python Works
\`\`\`
Source Code (.py) → Bytecode (.pyc) → Python Virtual Machine (PVM)
\`\`\`

## 4. The GIL (Global Interpreter Lock)
CPython has a mutex preventing multiple threads from executing bytecode simultaneously.
    `,
    quizzes: [
      { id: 'q1', question: "Who created Python?", options: ["Dennis Ritchie", "Guido van Rossum", "James Gosling", "Bjarne Stroustrup"], correctAnswerIndex: 1, explanation: "Guido van Rossum created Python in 1989." },
      { id: 'q2', question: "What does GIL stand for?", options: ["Global Import Lock", "Global Interpreter Lock", "General Interface Layer", "Global Instance Loader"], correctAnswerIndex: 1, explanation: "GIL = Global Interpreter Lock" }
    ],
    codingChallenge: { title: "Hello World", description: "Print 'Hello Code IIT Out'", language: "python", starterCode: "# Print a greeting\n", solutionCode: "print('Hello Code IIT Out')", hint: "Use print()" },
    resources: [{ title: "Python Documentation", type: "Documentation", authorOrSource: "python.org" }],
    interviewQuestions: [{ question: "What is the GIL?", companyTag: "Google", answer: "A mutex in CPython preventing parallel thread execution." }]
  },
  'py-2': {
    id: 'py-2',
    title: 'Variables & Memory',
    estimatedReadingTime: '12 mins',
    contentMarkdown: `
# Variables & Memory Management

## 1. Variables in Python
Variables are **references** to objects in memory, not containers.

\`\`\`python
x = 10      # x points to integer object 10
y = x       # y points to the SAME object
\`\`\`

## 2. Memory: Stack vs Heap
- **Stack**: Function calls, local references
- **Heap**: All Python objects live here

## 3. Reference Counting
Python tracks how many references point to each object.
    `,
    quizzes: [
      { id: 'q1', question: "Where do Python objects live?", options: ["Stack", "Heap", "Register", "Cache"], correctAnswerIndex: 1, explanation: "All Python objects are stored on the Heap." }
    ],
    codingChallenge: { title: "Variable Swap", description: "Swap two variables without a temp variable", language: "python", starterCode: "a = 5\nb = 10\n# Swap a and b\n", solutionCode: "a = 5\nb = 10\na, b = b, a", hint: "Python allows tuple unpacking" },
    resources: [],
    interviewQuestions: []
  },
  'py-3': {
    id: 'py-3',
    title: 'Control Flow',
    estimatedReadingTime: '10 mins',
    contentMarkdown: `
# Control Flow in Python

## 1. Conditionals
\`\`\`python
if x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
else:
    print("Zero")
\`\`\`

## 2. Loops
\`\`\`python
for i in range(5):
    print(i)

while condition:
    # do something
\`\`\`

## 3. Comprehensions
\`\`\`python
squares = [x**2 for x in range(10)]
\`\`\`
    `,
    quizzes: [
      { id: 'q1', question: "What does range(5) produce?", options: ["1-5", "0-4", "0-5", "1-4"], correctAnswerIndex: 1, explanation: "range(5) produces 0, 1, 2, 3, 4" }
    ],
    codingChallenge: { title: "FizzBuzz", description: "Print 1-15, but 'Fizz' for multiples of 3, 'Buzz' for 5", language: "python", starterCode: "for i in range(1, 16):\n    # Your code\n", solutionCode: "for i in range(1, 16):\n    if i % 15 == 0: print('FizzBuzz')\n    elif i % 3 == 0: print('Fizz')\n    elif i % 5 == 0: print('Buzz')\n    else: print(i)", hint: "Check divisibility with %" },
    resources: [],
    interviewQuestions: []
  },

  // =====================
  // CS FUNDAMENTALS
  // =====================
  'cs-1': {
    id: 'cs-1',
    title: 'Number Systems',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Number Systems in Computer Science

## 1. Binary (Base 2)
Computers only understand 0s and 1s.
- \`1010\` in binary = 10 in decimal

## 2. Hexadecimal (Base 16)
Used for memory addresses, colors (HTML).
- \`0xFF\` = 255 in decimal

## 3. Conversions
| Decimal | Binary | Hex |
|---------|--------|-----|
| 10 | 1010 | A |
| 15 | 1111 | F |
| 255 | 11111111 | FF |
    `,
    quizzes: [
      { id: 'q1', question: "What is 1010 in decimal?", options: ["8", "10", "12", "14"], correctAnswerIndex: 1, explanation: "1010 = 8+2 = 10" }
    ],
    codingChallenge: { title: "Binary to Decimal", description: "Convert binary string to decimal", language: "python", starterCode: "def binary_to_decimal(binary_str):\n    # Your code\n    pass", solutionCode: "def binary_to_decimal(binary_str):\n    return int(binary_str, 2)", hint: "int() can take a base parameter" },
    resources: [],
    interviewQuestions: []
  },
  'cs-2': {
    id: 'cs-2',
    title: 'Boolean Logic',
    estimatedReadingTime: '12 mins',
    contentMarkdown: `
# Boolean Logic & Gates

## 1. Basic Gates
- **AND**: Both inputs must be 1
- **OR**: At least one input is 1
- **NOT**: Inverts the input
- **XOR**: Exactly one input is 1

## 2. Truth Tables
| A | B | AND | OR | XOR |
|---|---|-----|----|----|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |
    `,
    quizzes: [
      { id: 'q1', question: "1 XOR 1 = ?", options: ["0", "1", "2", "Undefined"], correctAnswerIndex: 0, explanation: "XOR returns 0 when both inputs are equal" }
    ],
    codingChallenge: { title: "XOR Swap", description: "Swap two numbers using XOR", language: "python", starterCode: "a, b = 5, 10\n# Swap using XOR", solutionCode: "a, b = 5, 10\na = a ^ b\nb = a ^ b\na = a ^ b", hint: "a ^ b ^ b = a" },
    resources: [],
    interviewQuestions: []
  },
  'cs-3': {
    id: 'cs-3',
    title: 'Computer Architecture',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Computer Architecture

## 1. CPU Components
- **ALU**: Arithmetic Logic Unit - performs calculations
- **Registers**: Ultra-fast storage (8-64 of them)
- **Control Unit**: Fetches and decodes instructions

## 2. Memory Hierarchy
\`\`\`
Registers (fastest) → L1 Cache → L2 Cache → L3 Cache → RAM → SSD → HDD (slowest)
\`\`\`

## 3. Fetch-Decode-Execute Cycle
1. **Fetch**: Get instruction from RAM
2. **Decode**: Understand what to do
3. **Execute**: Perform the operation
    `,
    quizzes: [
      { id: 'q1', question: "What is the fastest memory?", options: ["RAM", "SSD", "Registers", "L1 Cache"], correctAnswerIndex: 2, explanation: "Registers are inside the CPU, making them fastest" }
    ],
    codingChallenge: { title: "Cache Simulation", description: "Simulate cache hit/miss", language: "python", starterCode: "cache = {}\ndef get(key):\n    # Return 'HIT' or 'MISS'\n    pass", solutionCode: "cache = {}\ndef get(key):\n    if key in cache:\n        return 'HIT'\n    cache[key] = True\n    return 'MISS'", hint: "Check if key exists in dict" },
    resources: [],
    interviewQuestions: [{ question: "Explain the memory hierarchy", companyTag: "Intel", answer: "Registers > L1 > L2 > L3 > RAM > Disk. Speed decreases, capacity increases." }]
  },

  // =====================
  // OPERATING SYSTEMS
  // =====================
  'os-1': {
    id: 'os-1',
    title: 'Process Management',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Process vs Thread

## 1. What is a Process?
A program in execution with its own memory space.

## 2. What is a Thread?
Lightweight process sharing memory with other threads.

## 3. Key Differences
| Process | Thread |
|---------|--------|
| Own memory | Shared memory |
| Heavy to create | Lightweight |
| IPC needed | Direct communication |

## 4. Process States
\`New → Ready → Running → Waiting → Terminated\`
    `,
    quizzes: [
      { id: 'q1', question: "Threads share what?", options: ["Nothing", "Memory", "CPU", "Disk"], correctAnswerIndex: 1, explanation: "Threads share the same memory space" }
    ],
    codingChallenge: { title: "Thread Example", description: "Create a simple thread", language: "python", starterCode: "import threading\n# Create a thread that prints 'Hello'", solutionCode: "import threading\ndef hello():\n    print('Hello')\nt = threading.Thread(target=hello)\nt.start()", hint: "Use threading.Thread(target=func)" },
    resources: [],
    interviewQuestions: [{ question: "Process vs Thread?", companyTag: "Amazon", answer: "Processes have separate memory, threads share memory within a process." }]
  },
  'os-2': {
    id: 'os-2',
    title: 'CPU Scheduling',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# CPU Scheduling Algorithms

## 1. FCFS (First Come First Serve)
Simple queue - first process runs first.

## 2. SJF (Shortest Job First)
Smallest burst time runs first.

## 3. Round Robin
Each process gets a time quantum (e.g., 10ms).

## 4. Priority Scheduling
Higher priority runs first. Risk: starvation.

## Metrics
- **Turnaround Time**: Completion - Arrival
- **Waiting Time**: Turnaround - Burst
    `,
    quizzes: [
      { id: 'q1', question: "Which algorithm prevents starvation?", options: ["SJF", "Priority", "Round Robin", "FCFS"], correctAnswerIndex: 2, explanation: "Round Robin gives every process a fair share" }
    ],
    codingChallenge: { title: "FCFS Simulator", description: "Calculate waiting times for FCFS", language: "python", starterCode: "def fcfs(burst_times):\n    # Return list of waiting times\n    pass", solutionCode: "def fcfs(burst_times):\n    wait = [0]\n    for i in range(1, len(burst_times)):\n        wait.append(wait[-1] + burst_times[i-1])\n    return wait", hint: "Each process waits for all previous to complete" },
    resources: [],
    interviewQuestions: []
  },

  // =====================
  // DSA MODULES
  // =====================
  'ds-1': {
    id: 'ds-1',
    title: 'Complexity Analysis',
    estimatedReadingTime: '12 mins',
    contentMarkdown: `
# Big O Notation

## Time Complexity
- **O(1)**: Constant - hash lookup
- **O(log n)**: Logarithmic - binary search
- **O(n)**: Linear - simple loop
- **O(n log n)**: Linearithmic - merge sort
- **O(n²)**: Quadratic - nested loops

## Space Complexity
How much memory your algorithm uses.

## Common Patterns
- Single loop: O(n)
- Nested loops: O(n²)
- Divide and conquer: O(log n)
    `,
    quizzes: [
      { id: 'q1', question: "Binary search is?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswerIndex: 2, explanation: "Binary search halves the search space each time" }
    ],
    codingChallenge: { title: "Time Complexity", description: "What is the complexity of this code?", language: "python", starterCode: "# for i in range(n):\n#     for j in range(n):\n#         print(i, j)\n# Answer: O(?)", solutionCode: "# Answer: O(n²)", hint: "Count the nested loops" },
    resources: [],
    interviewQuestions: []
  },
  'ds-2': {
    id: 'ds-2',
    title: 'Arrays',
    estimatedReadingTime: '10 mins',
    contentMarkdown: `
# Arrays - Contiguous Memory

## What is an Array?
Fixed-size, contiguous block of memory.

## Operations
| Operation | Time |
|-----------|------|
| Access | O(1) |
| Search | O(n) |
| Insert | O(n) |
| Delete | O(n) |

## Dynamic Arrays
Python lists auto-resize when full (amortized O(1) append).
    `,
    quizzes: [
      { id: 'q1', question: "Array access is?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswerIndex: 0, explanation: "Direct index calculation makes it O(1)" }
    ],
    codingChallenge: { title: "Reverse Array", description: "Reverse an array in-place", language: "python", starterCode: "def reverse(arr):\n    # Reverse in-place\n    pass", solutionCode: "def reverse(arr):\n    left, right = 0, len(arr)-1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1", hint: "Two pointer technique" },
    resources: [],
    interviewQuestions: []
  },

  // =====================
  // DBMS MODULES
  // =====================
  'db-1': {
    id: 'db-1',
    title: 'Introduction to DBMS',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# DBMS vs File System

## Why DBMS?
- **Data Integrity**: Constraints ensure valid data
- **Concurrency**: Multiple users simultaneously
- **Security**: Access control
- **Backup**: Recovery from failures

## Types of Databases
| Type | Examples |
|------|----------|
| Relational | MySQL, PostgreSQL |
| Document | MongoDB |
| Key-Value | Redis |
| Graph | Neo4j |
    `,
    quizzes: [
      { id: 'q1', question: "Which is relational?", options: ["MongoDB", "Redis", "PostgreSQL", "Cassandra"], correctAnswerIndex: 2, explanation: "PostgreSQL is a relational database" }
    ],
    codingChallenge: { title: "Create Table", description: "Write SQL to create a users table", language: "sql", starterCode: "-- Create a users table with id, name, email", solutionCode: "CREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100) UNIQUE\n);", hint: "Use CREATE TABLE" },
    resources: [],
    interviewQuestions: []
  },
  'db-4': {
    id: 'db-4',
    title: 'Normalization',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Database Normalization

## 1NF (First Normal Form)
- Atomic values only (no arrays)
- Each row is unique

## 2NF
- 1NF + No partial dependencies
- All non-key columns depend on entire primary key

## 3NF
- 2NF + No transitive dependencies

## BCNF
- Stricter 3NF - every determinant is a candidate key
    `,
    quizzes: [
      { id: 'q1', question: "1NF requires?", options: ["No nulls", "Atomic values", "Foreign keys", "Indexes"], correctAnswerIndex: 1, explanation: "1NF requires all values to be atomic (indivisible)" }
    ],
    codingChallenge: { title: "Normalize Table", description: "Split an unnormalized table", language: "sql", starterCode: "-- Original: orders(order_id, customer_name, customer_email, product)\n-- Normalize it", solutionCode: "-- Customers(customer_id, name, email)\n-- Orders(order_id, customer_id, product)", hint: "Separate customer data" },
    resources: [],
    interviewQuestions: []
  },

  // =====================
  // SYSTEM DESIGN
  // =====================
  'sd-1': {
    id: 'sd-1',
    title: 'Scalability Basics',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Horizontal vs Vertical Scaling

## Vertical Scaling (Scale Up)
- Add more CPU/RAM to one machine
- Simpler but has limits
- Single point of failure

## Horizontal Scaling (Scale Out)
- Add more machines
- No upper limit
- Requires load balancing

## When to Use What?
- Start vertical (simpler)
- Go horizontal when hitting limits
    `,
    quizzes: [
      { id: 'q1', question: "Adding more servers is?", options: ["Vertical", "Horizontal", "Diagonal", "Linear"], correctAnswerIndex: 1, explanation: "Horizontal scaling adds more machines" }
    ],
    codingChallenge: { title: "Load Estimation", description: "Calculate required servers", language: "python", starterCode: "def servers_needed(requests_per_sec, server_capacity):\n    pass", solutionCode: "def servers_needed(requests_per_sec, server_capacity):\n    import math\n    return math.ceil(requests_per_sec / server_capacity)", hint: "Divide and round up" },
    resources: [],
    interviewQuestions: [{ question: "When would you scale vertically?", companyTag: "Netflix", answer: "When traffic is low and simplicity matters more than resilience." }]
  },
  'sd-2': {
    id: 'sd-2',
    title: 'Load Balancing',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Load Balancing

## Algorithms
1. **Round Robin**: Rotate through servers
2. **Least Connections**: Send to least busy
3. **IP Hash**: Same client → same server
4. **Weighted**: More capacity → more requests

## Layer 4 vs Layer 7
- **L4**: TCP/UDP level, faster
- **L7**: HTTP level, smarter routing

## Tools
- Nginx, HAProxy, AWS ALB
    `,
    quizzes: [
      { id: 'q1', question: "Which ensures sticky sessions?", options: ["Round Robin", "Random", "IP Hash", "Least Connections"], correctAnswerIndex: 2, explanation: "IP Hash routes same client to same server" }
    ],
    codingChallenge: { title: "Round Robin", description: "Implement round robin selection", language: "python", starterCode: "class RoundRobin:\n    def __init__(self, servers):\n        pass\n    def next(self):\n        pass", solutionCode: "class RoundRobin:\n    def __init__(self, servers):\n        self.servers = servers\n        self.idx = 0\n    def next(self):\n        server = self.servers[self.idx]\n        self.idx = (self.idx + 1) % len(self.servers)\n        return server", hint: "Use modulo for cycling" },
    resources: [],
    interviewQuestions: []
  },
  'sd-3': {
    id: 'sd-3',
    title: 'Caching',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Caching Strategies

## Cache Patterns
1. **Cache-Aside**: App checks cache first, then DB
2. **Write-Through**: Write to cache and DB together
3. **Write-Behind**: Write to cache, async to DB

## Eviction Policies
- **LRU**: Least Recently Used
- **LFU**: Least Frequently Used
- **TTL**: Time To Live

## Tools
- Redis, Memcached, CDN (CloudFront)
    `,
    quizzes: [
      { id: 'q1', question: "What is LRU?", options: ["Last Recently Updated", "Least Recently Used", "Less Resource Usage", "Low Ram Utilization"], correctAnswerIndex: 1, explanation: "LRU evicts the least recently accessed item" }
    ],
    codingChallenge: { title: "Simple Cache", description: "Implement a cache with TTL", language: "python", starterCode: "class Cache:\n    def get(self, key): pass\n    def set(self, key, value, ttl): pass", solutionCode: "import time\nclass Cache:\n    def __init__(self):\n        self.store = {}\n    def get(self, key):\n        if key in self.store:\n            val, exp = self.store[key]\n            if time.time() < exp:\n                return val\n        return None\n    def set(self, key, value, ttl):\n        self.store[key] = (value, time.time() + ttl)", hint: "Store expiry time with value" },
    resources: [],
    interviewQuestions: []
  }
};
