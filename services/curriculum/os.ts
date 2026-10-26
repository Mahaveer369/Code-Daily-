import { LessonContent } from '../../types';

export const OS_MODULES: Record<string, LessonContent> = {
  'os-1': {
    id: 'os-1',
    title: 'Process Management: Process vs Thread',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Process & Thread Internals: Virtual Memory & Context Switching

In systems engineering, understanding the exact cost of processes, threads, and fibers is crucial for concurrency and throughput tuning.

---

## 1. System Architecture: Process vs Thread Memory Layout

\`\`\`
Process Virtual Address Space (Isolated 48-bit Virtual Memory)
┌──────────────────────────────────────────────┐
│ Text Segment (Binary Executable Machine Code)│
├──────────────────────────────────────────────┤
│ Data / BSS (Global & Static Variables)       │
├──────────────────────────────────────────────┤
│ Heap (Dynamic Allocation - malloc / new)     │  <-- Shared across threads!
│                    ▼                         │
│                    ▲                         │
├──────────────────────────────────────────────┤
│ Thread 2 Stack & Registers (Local Frames)    │
├──────────────────────────────────────────────┤
│ Thread 1 Stack & Registers (Local Frames)    │
├──────────────────────────────────────────────┤
│ Kernel Space (Privileged Ring 0 Mappings)    │
└──────────────────────────────────────────────┘
\`\`\`

---

## 2. Quantitative Context Switch Costs

| Operation | Microseconds | What Happens Under the Hood |
| :--- | :--- | :--- |
| **User Thread Switch** | $0.2\\text{--}0.5\\,\\mu\\text{s}$ | Saves registers, switches stack pointer (no address space change). |
| **Process Context Switch** | $1.5\\text{--}3.0\\,\\mu\\text{s}$ | Flushes Translation Lookaside Buffer (TLB), reloads \`CR3\` page directory, destroys CPU L1/L2 cache locality. |
| **System Call (\`syscall\`)** | $0.05\\text{--}0.1\\,\\mu\\text{s}$ | CPU switches from Ring 3 (User) to Ring 0 (Kernel). |
`,
    quizzes: [
      {
        id: 'os1-q1',
        question: "Why is a process context switch significantly more expensive than a thread context switch within the same process?",
        options: [
          "Threads run on different CPUs",
          "Process context switching switches memory address spaces, invalidating the TLB cache and degrading CPU cache locality",
          "Threads do not have stacks",
          "Processes require disk reads"
        ],
        correctAnswerIndex: 1,
        explanation: "Switching address spaces forces the CPU to flush or invalidate the Translation Lookaside Buffer (TLB), causing subsequent memory reads to incur slow multi-level page table walks."
      }
    ],
    codingChallenge: {
      title: "Context Switch Simulator",
      description: "Calculate total CPU overhead time spent on context switches given thread switch counts, process switch counts, and their microsecond penalties.",
      language: "python",
      starterCode: `def calculate_switch_overhead_ms(thread_switches: int, process_switches: int) -> float:
    # Thread switch = 0.5 microseconds
    # Process switch = 2.5 microseconds
    # Return total overhead in milliseconds rounded to 3 decimal places
    pass
`,
      solutionCode: `def calculate_switch_overhead_ms(thread_switches: int, process_switches: int) -> float:
    thread_micros = thread_switches * 0.5
    process_micros = process_switches * 2.5
    total_micros = thread_micros + process_micros
    return round(total_micros / 1000.0, 3)
`,
      hint: "Convert microseconds to milliseconds by dividing by 1000."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "What is the difference between fork() and clone() in the Linux kernel?",
        answer: "In Linux, both processes and threads are represented internally by `task_struct`. `fork()` calls `clone(SIGCHLD)` with separate memory copies (using Copy-On-Write). Creating a POSIX pthread calls `clone()` passing flags `CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND`, sharing memory, file descriptors, and signal handlers."
      }
    ],
    resources: [
      { title: "Operating Systems: Three Easy Pieces (Ch. 4-6)", type: "Book", authorOrSource: "Arpaci-Dusseau" }
    ]
  },

  'os-2': {
    id: 'os-2',
    title: 'CPU Scheduling & CFS',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# CPU Scheduling: Completely Fair Scheduler (CFS) & Real-Time Policies

Modern multi-core operating systems balance throughput, latency, fairness, and thermal efficiency.

---

## 1. Classical Algorithms vs Linux CFS
- **First-Come First-Served (FCFS)**: Suffers from the Convoy Effect.
- **Shortest Job First (SJF)**: Mathematically optimal average wait time, but impossible to predict exact future CPU burst lengths without heuristics.
- **Linux CFS (Completely Fair Scheduler)**:
  - Uses a **Red-Black Tree** ordered by \`vruntime\` (virtual runtime).
  - The task that has run the least (minimum \`vruntime\`, leftmost in the RB-Tree) runs next.
  - Nice values ($-20$ to $+19$) assign weights that scale how fast \`vruntime\` advances.
`,
    quizzes: [
      {
        id: 'os2-q1',
        question: "How does the Linux Completely Fair Scheduler (CFS) decide which task to run next?",
        options: [
          "It uses a FIFO queue",
          "It selects the task with the lowest virtual runtime (vruntime) from a Red-Black tree",
          "It picks randomly",
          "It prioritizes tasks with the highest memory usage"
        ],
        correctAnswerIndex: 1,
        explanation: "CFS maintains tasks in a self-balancing Red-Black tree keyed by virtual runtime. The leftmost node has consumed the least CPU time and is scheduled next."
      }
    ],
    codingChallenge: {
      title: "Round Robin Quantum Scheduler",
      description: "Implement a Round Robin scheduler simulation that returns the execution order and finish times for a list of burst tasks.",
      language: "python",
      starterCode: `def round_robin_schedule(tasks: list, quantum: int) -> dict:
    # tasks = [{"id": "T1", "burst": 10}, {"id": "T2", "burst": 4}]
    # Return {"finish_times": {"T1": 14, "T2": 8}}
    pass
`,
      solutionCode: `from collections import deque

def round_robin_schedule(tasks: list, quantum: int) -> dict:
    queue = deque()
    for t in tasks:
        queue.append({"id": t["id"], "remaining": t["burst"]})
    
    current_time = 0
    finish_times = {}
    
    while queue:
        item = queue.popleft()
        t_id = item["id"]
        rem = item["remaining"]
        
        exec_time = min(quantum, rem)
        current_time += exec_time
        rem -= exec_time
        
        if rem > 0:
            item["remaining"] = rem
            queue.append(item)
        else:
            finish_times[t_id] = current_time
            
    return {"finish_times": finish_times}
`,
      hint: "Use a FIFO deque to cycle tasks until their remaining bursts hit 0."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "What is CPU Throttling in Docker / Kubernetes and how does it affect p99 latency?",
        answer: "Kubernetes CFS quotas allocate CPU bandwidth over 100ms periods (e.g. 2 cores = 200ms per 100ms quota). If a multithreaded application burns its 200ms quota in the first 20ms of the period, the Linux kernel completely throttles the container for the remaining 80ms, causing severe multi-millisecond p99 latency spikes."
      }
    ],
    resources: [
      { title: "Linux Kernel Documentation: CFS Scheduler", type: "Documentation", authorOrSource: "Linux Kernel Archives" }
    ]
  },

  'os-3': {
    id: 'os-3',
    title: 'Memory Management: Paging & Virtual Memory',
    estimatedReadingTime: '25 mins',
    contentMarkdown: `
# Virtual Memory: Multi-Level Page Tables, TLB & Page Faults

Virtual memory provides hardware memory isolation, pointer safety, and the illusion of contiguous private address spaces.

---

## 1. System Architecture: 4-Level Page Table Translation (x86-64)

\`\`\`
Virtual Address: [PGD 9 bits] [PUD 9 bits] [PMD 9 bits] [PTE 9 bits] [Offset 12 bits]
       │
       ▼
   CR3 Register ──► PGD Page ──► PUD Page ──► PMD Page ──► PTE Page ──► Physical 4KB Page Frame!
                          ▲
                          │
          TLB (Translation Lookaside Buffer): Cache in CPU hardware
          Hit: 1 clock cycle (0.3ns) | Miss: 4 DRAM accesses (200ns)
\`\`\`

---

## 2. The Page Fault Lifecycle
1. CPU tries to access virtual address.
2. MMU checks PTE; valid bit is \`0\` $\\to$ triggers CPU **Hardware Interrupt #14 (Page Fault)**.
3. OS Kernel traps into interrupt handler:
   - Is it invalid pointer address? $\\to$ Send **SIGSEGV (Segmentation Fault)**.
   - Is it valid but swapped to disk? $\\to$ Read 4KB page from swap into RAM frame, update PTE valid bit to \`1\`, restart user instruction!
`,
    quizzes: [
      {
        id: 'os3-q1',
        question: "What causes a Segmentation Fault (SIGSEGV) in C/C++?",
        options: [
          "Division by zero",
          "Attempting to read or write a virtual address not mapped in the process's page table or violating permission flags (e.g. writing to read-only text segment)",
          "Running out of hard drive space",
          "A network connection dropping"
        ],
        correctAnswerIndex: 1,
        explanation: "SIGSEGV is generated by the OS when the CPU MMU encounters an unmapped address or a permission violation (such as writing to code/text memory)."
      }
    ],
    codingChallenge: {
      title: "Page Table Address Splitter",
      description: "Write a function that breaks a 64-bit virtual memory address into its 4-level page table indices (PGD, PUD, PMD, PTE) and page offset.",
      language: "python",
      starterCode: `def split_virtual_address(va: int) -> dict:
    # 48-bit canonical address:
    # Bits 0-11: Offset (12 bits)
    # Bits 12-20: PTE (9 bits)
    # Bits 21-29: PMD (9 bits)
    # Bits 30-38: PUD (9 bits)
    # Bits 39-47: PGD (9 bits)
    pass
`,
      solutionCode: `def split_virtual_address(va: int) -> dict:
    offset = va & 0xFFF
    pte = (va >> 12) & 0x1FF
    pmd = (va >> 21) & 0x1FF
    pud = (va >> 30) & 0x1FF
    pgd = (va >> 39) & 0x1FF
    return {
        "pgd": pgd,
        "pud": pud,
        "pmd": pmd,
        "pte": pte,
        "offset": offset
    }
`,
      hint: "Use bit shifts (>>) and bitwise AND with 0x1FF (9 bits) and 0xFFF (12 bits)."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "Why does Redis recommend disabling Transparent Huge Pages (THP) on Linux servers?",
        answer: "Linux THP uses 2MB pages instead of 4KB. When Redis executes background snapshots (BGSAVE) using fork(), it relies on Copy-On-Write (COW). With THP, modifying a tiny 10-byte string forces copying an entire 2MB memory page rather than 4KB, causing massive memory bloat and latency spikes."
      }
    ],
    resources: [
      { title: "Understanding the Linux Virtual Memory Manager", type: "Book", authorOrSource: "Mel Gorman" }
    ]
  },

  'os-4': {
    id: 'os-4',
    title: 'Deadlocks & Concurrency Traps',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Deadlocks: Coffman Conditions & Prevention

A deadlock is a permanent stall where concurrent tasks are blocked waiting for resources held by each other.

---

## 1. The 4 Necessary Coffman Conditions
All four must hold simultaneously for a deadlock to exist:
1. **Mutual Exclusion**: Non-shareable resource.
2. **Hold and Wait**: Process holds resource A while requesting resource B.
3. **No Preemption**: Resources cannot be forcibly revoked.
4. **Circular Wait**: $P_0 \\to P_1 \\to \\dots \\to P_n \\to P_0$.

---

## 2. Production Prevention: Strict Global Lock Ordering
The simplest, most effective FAANG production pattern is **Lock Ordering**:
Assign every lock a monotonic integer ID. Always acquire locks in ascending ID order:

\`\`\`python
# Thread 1 and Thread 2 both acquire in exact order:
first_lock = min(lock_a.id, lock_b.id)
second_lock = max(lock_a.id, lock_b.id)
acquire(first_lock)
acquire(second_lock)
\`\`\`
`,
    quizzes: [
      {
        id: 'os4-q1',
        question: "How does strict global lock ordering completely eliminate deadlocks?",
        options: [
          "It disables mutual exclusion",
          "It breaks the Circular Wait condition because locks can only be requested in an acyclic order",
          "It enables automatic rollback",
          "It converts threads to processes"
        ],
        correctAnswerIndex: 1,
        explanation: "By enforcing a global acquisition order, cycles in the Resource Allocation Graph become mathematically impossible, breaking the Circular Wait condition."
      }
    ],
    codingChallenge: {
      title: "Deadlock Detection in Resource Graph",
      description: "Detect if a cycle exists in a resource allocation graph using Depth-First Search.",
      language: "python",
      starterCode: `def has_deadlock(graph: dict) -> bool:
    # graph: {"P1": ["R1"], "R1": ["P2"], "P2": ["R2"], "R2": ["P1"]}
    # Return True if cycle exists
    pass
`,
      solutionCode: `def has_deadlock(graph: dict) -> bool:
    visited = set()
    rec_stack = set()

    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    for node in graph:
        if node not in visited:
            if dfs(node):
                return True
    return False
`,
      hint: "Track nodes currently in the recursion stack to identify back-edges."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "What is priority inversion and how does Priority Inheritance solve it?",
        answer: "Priority inversion occurs when a low-priority thread holds a lock needed by a high-priority thread, but a medium-priority thread preempts the low-priority thread, effectively starving the high-priority task. Priority Inheritance temporarily boosts the low-priority thread to the high-priority level until it releases the lock."
      }
    ],
    resources: [
      { title: "The Deadlock Empire: Concurrency Game", type: "Documentation", authorOrSource: "deadlockempire.github.io" }
    ]
  },

  'os-5': {
    id: 'os-5',
    title: 'File Systems & Inodes',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# File Systems: Inodes, Ext4 & Page Cache

How Linux translates file path strings (\`/var/log/app.log\`) into storage blocks on NVMe disks.

---

## 1. Inode Architecture
- **Inode**: Stores file metadata (size, permissions, owner, timestamps, block pointers). **Does NOT store file name!**
- **Directory**: A special file whose data blocks contain mappings: \`(filename -> inode_number)\`.
- **Hard Link**: Another directory entry pointing to the same inode number. File data is deleted only when inode link count reaches 0.
- **Soft Link (Symlink)**: A separate inode whose data contains the target path string.
`,
    quizzes: [
      {
        id: 'os5-q1',
        question: "Why can a hard link not span across different disk partitions/filesystems?",
        options: [
          "Hard links require encryption",
          "Inode numbers are unique only within a specific local filesystem partition",
          "Hard links are limited to 4KB",
          "Operating systems ban cross-partition files"
        ],
        correctAnswerIndex: 1,
        explanation: "Inode numbers are partition-local indices; partition A and partition B have independent inode tables with colliding numbers."
      }
    ],
    codingChallenge: {
      title: "Hard Link Counter Simulator",
      description: "Implement a simulated inode table where deleting a filename decreases link count and frees disk blocks only when link count hits 0.",
      language: "python",
      starterCode: `class InodeFS:
    def __init__(self):
        self.inodes = {} # inode_id -> {"ref_count": int, "blocks": list}
        self.dirs = {}   # filename -> inode_id

    def unlink(self, filename: str) -> bool:
        # Return True if blocks were freed (link count hit 0), False otherwise
        pass
`,
      solutionCode: `class InodeFS:
    def __init__(self):
        self.inodes = {}
        self.dirs = {}

    def unlink(self, filename: str) -> bool:
        if filename not in self.dirs:
            return False
        inode_id = self.dirs.pop(filename)
        inode = self.inodes.get(inode_id)
        if not inode:
            return False
        
        inode["ref_count"] -= 1
        if inode["ref_count"] <= 0:
            del self.inodes[inode_id]
            return True # Blocks freed
        return False
`,
      hint: "Decrement the inode ref_count; delete from self.inodes when count reaches 0."
    },
    interviewQuestions: [
      {
        companyTag: 'Apple',
        question: "Why does `lsof` show deleted files still consuming disk space?",
        answer: "When a file is unlinked (`rm`), its directory pointer is removed, but if an active process holds an open file descriptor to that inode, the kernel preserves the inode and data blocks. Space is reclaimed only when the process closes the file descriptor or terminates."
      }
    ],
    resources: [
      { title: "Practical File System Design", type: "Book", authorOrSource: "Dominic Giampaolo" }
    ]
  },

  'os-6': {
    id: 'os-6',
    title: 'Synchronization: Mutex, Semaphores & CAS',
    estimatedReadingTime: '24 mins',
    contentMarkdown: `
# Concurrency Synchronization: Mutex, Semaphores, Futex & CAS

Low-level concurrency primitives dictate multi-threaded scaling in high-performance engines.

---

## 1. Primitives Compared
- **Compare-And-Swap (CAS)**: Atomic CPU instruction (\`LOCK CMPXCHG\`). Foundation of lock-free data structures.
- **Spinlock**: Busy-waits in a CPU loop. Good only if lock hold time is less than context switch overhead ($<0.5\\,\\mu\\text{s}$).
- **Futex (Fast Userspace Mutex)**: Uncontended lock acquisition takes zero system calls in user space; only sleeps in the kernel if contested!
- **Counting Semaphore**: Maintains a resource permit counter (useful for thread pool throttles).
`,
    quizzes: [
      {
        id: 'os6-q1',
        question: "Why is a Linux futex dramatically faster than a traditional kernel-level semaphore?",
        options: [
          "Futexes run on the GPU",
          "Futex uses an atomic CAS in user space when uncontended, avoiding expensive kernel system call context switches in 95% of cases",
          "Futexes disable multi-threading",
          "Futexes allocate zero bytes"
        ],
        correctAnswerIndex: 1,
        explanation: "Futex executes atomic instructions directly in user space without entering kernel mode unless contention actually occurs."
      }
    ],
    codingChallenge: {
      title: "Lock-Free Atomic Counter via CAS",
      description: "Simulate an atomic increment using a loop with Compare-And-Swap (CAS).",
      language: "python",
      starterCode: `class AtomicCounter:
    def __init__(self, val=0):
        self.val = val

    def compare_and_swap(self, expected: int, new_val: int) -> bool:
        if self.val == expected:
            self.val = new_val
            return True
        return False

    def increment(self) -> int:
        # Loop until CAS succeeds
        pass
`,
      solutionCode: `class AtomicCounter:
    def __init__(self, val=0):
        self.val = val

    def compare_and_swap(self, expected: int, new_val: int) -> bool:
        if self.val == expected:
            self.val = new_val
            return True
        return False

    def increment(self) -> int:
        while True:
            current = self.val
            if self.compare_and_swap(current, current + 1):
                return current + 1
`,
      hint: "Read current value, calculate new value, and retry the loop until CAS returns True."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "What is the ABA problem in lock-free concurrency and how is it solved?",
        answer: "The ABA problem occurs when thread 1 reads value A, gets preempted; thread 2 changes A to B and back to A. Thread 1 resumes and CAS succeeds thinking nothing changed, corrupting pointer chains. Solved using tagged pointers or generation counters (e.g., storing a tuple of (value, version_counter)) so the comparison checks both."
      }
    ],
    resources: [
      { title: "The Art of Multiprocessor Programming", type: "Book", authorOrSource: "Maurice Herlihy, Nir Shavit" }
    ]
  }
};
