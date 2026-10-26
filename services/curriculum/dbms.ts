import { LessonContent } from '../../types';

export const DBMS_MODULES: Record<string, LessonContent> = {
  'db-1': {
    id: 'db-1',
    title: 'Introduction to DBMS',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# Introduction to DBMS: Engine Architecture & Storage Models

In senior engineering interviews, database questions evaluate your mental model of disk I/O, buffer management, execution engines, and storage formats.

---

## 1. System Architecture: Relational DB Engine Internals

\`\`\`
   SQL Query: SELECT * FROM users WHERE age > 30;
                      │
                      ▼
┌──────────────────────────────────────────────┐
│  Parser & Lexer (Abstract Syntax Tree)       │
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│  Query Optimizer (Cost-Based Optimizer - CBO)│  Uses statistics, index selectivity
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│  Execution Engine (Volcano Iterator Model)   │  Next() calls pipeline tuple streams
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│  Buffer Pool Manager (RAM Page Frames)       │  Clock sweep / LRU-K page cache
└──────────────┬───────────────────────────────┘
               │ Cache Miss (Read 8KB/16KB page)
               ▼
┌──────────────────────────────────────────────┐
│  OS File System & Storage Disks (NVMe SSD)   │
└──────────────────────────────────────────────┘
\`\`\`

---

## 2. Row-Oriented vs Column-Oriented Storage

| Dimension | Row-Oriented (OLTP: Postgres, MySQL) | Column-Oriented (OLAP: Snowflake, ClickHouse) |
| :--- | :--- | :--- |
| **Physical Layout** | Full row tuples packed contiguously on page | Column values packed contiguously on disk blocks |
| **Best Workload** | High-frequency point writes & lookups (\`INSERT\`, \`UPDATE\`) | Analytical aggregations (\`SUM\`, \`AVG\`, \`GROUP BY\`) |
| **I/O Efficiency** | Reads entire row even if querying 1 column | Reads ONLY requested columns (dramatic I/O reduction) |
| **Compression Ratio**| Low ($1.5\\times\\text{--}2\\times$) due to mixed types | High ($5\\times\\text{--}10\\times$) using Run-Length / Delta encoding |
`,
    quizzes: [
      {
        id: 'db1-q1',
        question: "Why is a column-oriented database vastly superior for large aggregate queries?",
        options: [
          "It avoids disk fragmentation completely",
          "It reads only the specific column blocks from disk rather than scanning full row tuples, drastically cutting I/O bandwidth",
          "It does not require transactions",
          "It automatically encrypts strings"
        ],
        correctAnswerIndex: 1,
        explanation: "Columnar databases only load requested columns into RAM, achieving orders of magnitude lower I/O on analytical queries."
      }
    ],
    codingChallenge: {
      title: "Columnar to Row Projection",
      description: "Implement a projection transformer that converts a columnar record dictionary into row-based dictionaries.",
      language: "python",
      starterCode: `def columnar_to_rows(columnar_table: dict) -> list:
    # columnar_table = {"id": [1, 2], "name": ["Alice", "Bob"]}
    # Output: [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
    pass
`,
      solutionCode: `def columnar_to_rows(columnar_table: dict) -> list:
    if not columnar_table:
        return []
    keys = list(columnar_table.keys())
    row_count = len(columnar_table[keys[0]])
    rows = []
    for i in range(row_count):
        row = {k: columnar_table[k][i] for k in keys}
        rows.append(row)
    return rows
`,
      hint: "Iterate across the row indices and assemble key-value pairs per row."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "How does the Buffer Pool prevent slow disk reads from bottlenecking high-throughput OLTP systems?",
        answer: "The Buffer Pool acts as a dedicated in-memory page cache (usually 70-80% of server RAM). Dirty pages are modified directly in memory and acknowledged once written to the sequential Write-Ahead Log (WAL). A background flusher thread lazily writes dirty pages back to data files."
      }
    ],
    resources: [
      { title: "Database Internals: A Deep Dive", type: "Book", authorOrSource: "Alex Petrov" }
    ]
  },

  'db-2': {
    id: 'db-2',
    title: 'ER Model',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Entity-Relationship (ER) Modeling at Scale

Designing database schemas for production requires balancing domain clarity against query performance, constraint enforcement, and future sharding boundaries.

---

## 1. Relationship Cardinality & Foreign Key Strategy
- **One-to-One (1:1)**: Co-locate into single table unless splitting for vertical partitioning (e.g. \`users\` vs \`user_security_credentials\` with restricted access).
- **One-to-Many (1:N)**: Foreign key on child table with non-clustered index on the FK column.
- **Many-to-Many (M:N)**: Junction table with composite primary key \`(student_id, course_id)\`.

---

## 2. Production SDE-2 Dilemma: Database-Level Foreign Keys
- *Monolith Era*: Use foreign key constraints (\`ON DELETE CASCADE\`) for automatic referential integrity.
- *High-Scale Microservices Era (Google/Uber)*: **Ban database-level foreign keys!**
  - Why? Cross-table lock contention, replication serialization delays, and incompatibility with horizontal sharding.
  - Integrity is enforced at the Application/Service layer instead.
`,
    quizzes: [
      {
        id: 'db2-q1',
        question: "Why do high-throughput FAANG systems often avoid database-enforced foreign key constraints?",
        options: [
          "Foreign keys are not supported in standard SQL",
          "Foreign key checks trigger row-level locks on parent tables during writes and break across distributed sharded nodes",
          "Foreign keys cause SSD hardware degradation",
          "Foreign keys prevent using indexes"
        ],
        correctAnswerIndex: 1,
        explanation: "Foreign key checks require locking rows in the parent table during child insertions, which degrades concurrent write performance and cannot span across sharded physical databases."
      }
    ],
    codingChallenge: {
      title: "Junction Table Query",
      description: "Write SQL to find all students enrolled in more than 2 courses from a junction table.",
      language: "sql",
      starterCode: `-- Schema: enrollments (student_id INT, course_id INT)
SELECT student_id 
FROM enrollments 
-- Your code here
`,
      solutionCode: `SELECT student_id, COUNT(course_id) AS enrolled_courses
FROM enrollments
GROUP BY student_id
HAVING COUNT(course_id) > 2;
`,
      hint: "Use GROUP BY with a HAVING clause."
    },
    interviewQuestions: [
      {
        companyTag: 'Uber',
        question: "How do you model soft deletes without breaking UNIQUE constraints?",
        answer: "Instead of a boolean `is_deleted`, use a nullable timestamp `deleted_at`. Create a partial index: `CREATE UNIQUE INDEX idx_user_email ON users(email) WHERE deleted_at IS NULL;` in PostgreSQL, allowing deleted emails to be reused while keeping active ones unique."
      }
    ],
    resources: [
      { title: "PostgreSQL Documentation: Constraints & Indexes", type: "Documentation", authorOrSource: "PostgreSQL Global Development Group" }
    ]
  },

  'db-3': {
    id: 'db-3',
    title: 'Relational Model & Constraints',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# The Relational Model: Keys, Invariants & Integrity

The relational model organizes data into first-class mathematical relations (tables) with strict attribute types and relational algebra operations.

---

## 1. Key Taxonomy
- **Superkey**: Any set of attributes that uniquely identifies a tuple.
- **Candidate Key**: A minimal superkey (no extraneous attributes).
- **Primary Key (PK)**: Selected candidate key used as physical clustering index in MySQL InnoDB.
- **Surrogate Key vs Natural Key**:
  - *Natural Key*: Social Security Number, Email. (Risk: Data privacy, changes over time).
  - *Surrogate Key*: Auto-increment BIGINT or UUIDv7. (Advantage: Monotonic, immutable).
`,
    quizzes: [
      {
        id: 'db3-q1',
        question: "Why is a monotonic UUID (like UUIDv7) preferred over random UUIDv4 as a primary key?",
        options: [
          "UUIDv7 uses less disk space",
          "Monotonic UUIDs insert sequentially, avoiding expensive B+ Tree page splits and cache fragmentation",
          "UUIDv4 cannot be indexed",
          "UUIDv7 is compatible with IPv6"
        ],
        correctAnswerIndex: 1,
        explanation: "Random UUIDv4 causes random I/O and continuous B+ tree page splits. Time-ordered UUIDv7 preserves sequential append performance."
      }
    ],
    codingChallenge: {
      title: "Candidate Key Minimalizer",
      description: "Given a list of superkeys, identify which ones are minimal candidate keys (i.e. no subset is also a valid superkey).",
      language: "python",
      starterCode: `def find_candidate_keys(superkeys: list) -> list:
    # superkeys = [{"id", "email"}, {"id"}, {"ssn", "name"}, {"ssn"}]
    # Return minimal keys: [{"id"}, {"ssn"}]
    pass
`,
      solutionCode: `def find_candidate_keys(superkeys: list) -> list:
    candidate_keys = []
    # Sort by set size ascending
    sorted_keys = sorted(superkeys, key=lambda s: len(s))
    for k in sorted_keys:
        is_minimal = True
        for existing in candidate_keys:
            if existing.issubset(k):
                is_minimal = False
                break
        if is_minimal:
            candidate_keys.append(k)
    return candidate_keys
`,
      hint: "Sort by size ascending, then filter out any key that is a superset of an existing candidate key."
    },
    interviewQuestions: [
      {
        companyTag: 'Stripe',
        question: "Why does Stripe use prefixed IDs (e.g. `ch_1M4...` for charges, `cus_9...` for customers)?",
        answer: "Prefixed IDs provide self-describing types in API logs, simplify client debugging, prevent accidental parameter swapping in API calls, and allow routing directly at the proxy gateway layer."
      }
    ],
    resources: [
      { title: "Designing Data-Intensive Applications (Ch. 2)", type: "Book", authorOrSource: "Martin Kleppmann" }
    ]
  },

  'db-4': {
    id: 'db-4',
    title: 'Normalization & De-normalization',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Database Normalization (1NF to BCNF) & Intentional De-normalization

Normalization eliminates data redundancy and update anomalies. In production SDE-2 architectures, intentional de-normalization is applied to optimize high-volume read paths.

---

## 1. Normal Forms Summary

\`\`\`
Unnormalized ──► 1NF (Atomic columns, unique rows)
                     │
                     ▼
                 2NF (1NF + No partial dependencies on composite PK)
                     │
                     ▼
                 3NF (2NF + No transitive dependencies A -> B -> C)
                     │
                     ▼
                 BCNF (Boyce-Codd: For every functional dependency X -> Y, X is a Superkey)
\`\`\`

---

## 2. Intentional De-normalization Trade-Offs

| Normalized (3NF) | De-normalized (Production Read-Optimized) |
| :--- | :--- |
| **Write Cost**: Low (single update location) | **Write Cost**: High (must update duplicate fields across tables) |
| **Read Cost**: High (multiple \`JOIN\` operations) | **Read Cost**: Fast $O(1)$ single-table point read |
| **Anomaly Risk**: Zero update/deletion anomalies | **Anomaly Risk**: High risk of data divergence without transactions |
`,
    quizzes: [
      {
        id: 'db4-q1',
        question: "When is 3NF violated by transitive dependency?",
        options: [
          "When a column contains JSON arrays",
          "When a non-key attribute depends on another non-key attribute (A -> B -> C)",
          "When a table has two primary keys",
          "When foreign keys are disabled"
        ],
        correctAnswerIndex: 1,
        explanation: "Transitive dependency occurs when non-key attribute X determines non-key attribute Y, rather than depending directly on the primary key."
      }
    ],
    codingChallenge: {
      title: "De-normalization Sync Trigger",
      description: "Write an idempotent function that simulates syncing user name updates into cached order summary records.",
      language: "python",
      starterCode: `def sync_user_update(orders_db: list, user_id: int, new_name: str) -> int:
    # orders_db: list of dicts [{"order_id": 1, "user_id": 10, "cached_user_name": "Old"}]
    # Return count of updated order records
    pass
`,
      solutionCode: `def sync_user_update(orders_db: list, user_id: int, new_name: str) -> int:
    updated = 0
    for order in orders_db:
        if order.get("user_id") == user_id:
            if order.get("cached_user_name") != new_name:
                order["cached_user_name"] = new_name
                updated += 1
    return updated
`,
      hint: "Update all records matching the user_id and count modifications."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "How do you maintain consistency when de-normalizing user profile names into historical video stream logs?",
        answer: "Recognize whether the historical log needs the point-in-time name (immutable snapshot) or the current name. For point-in-time, never update historical logs. For current name, do not de-normalize into high-volume logs; join at query time or rely on an asynchronous CDC (Change Data Capture) pipeline via Debezium."
      }
    ],
    resources: [
      { title: "Database Systems: The Complete Book", type: "Book", authorOrSource: "Garcia-Molina, Ullman, Widom" }
    ]
  },

  'db-5': {
    id: 'db-5',
    title: 'SQL Deep Dive',
    estimatedReadingTime: '24 mins',
    contentMarkdown: `
# Advanced SQL: Window Functions, CTEs & Query Plans

Senior software engineers must write sophisticated analytical queries and understand how the query planner executes them.

---

## 1. Window Functions vs GROUP BY
- \`GROUP BY\` collapses rows into single aggregates.
- **Window Functions (\`OVER (...)\`)** compute aggregates across a partitioned window while **preserving each individual row identity**.

\`\`\`sql
-- Running sum and dense rank per department
SELECT 
    employee_id, 
    department_id, 
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank,
    SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id) AS running_dept_total
FROM employees;
\`\`\`

---

## 2. Reading EXPLAIN ANALYZE
- **Seq Scan (Full Table Scan)**: Reads every page from disk ($O(N)$). Bad for large OLTP tables.
- **Index Scan**: Traverses B+ Tree index, then reads row page from table ($O(\\log N)$).
- **Index Only Scan**: All required columns exist in index (Covering Index). Zero heap lookups!
`,
    quizzes: [
      {
        id: 'db5-q1',
        question: "What makes an 'Index Only Scan' the fastest possible query execution plan in PostgreSQL?",
        options: [
          "It ignores the WHERE clause",
          "All requested columns are stored directly inside the B+ tree leaf nodes, completely bypassing table heap disk I/O",
          "It compiles SQL into C++ machine code",
          "It runs strictly in CPU cache L1"
        ],
        correctAnswerIndex: 1,
        explanation: "Covering indexes contain all queried columns in the index itself, avoiding table heap lookups entirely."
      }
    ],
    codingChallenge: {
      title: "Top N Salaries per Department",
      description: "Write SQL using window functions to find the top 2 highest-paid employees in each department.",
      language: "sql",
      starterCode: `-- Schema: employees (id, name, department_id, salary)
WITH RankedEmployees AS (
    -- Your CTE here
)
SELECT department_id, name, salary
FROM RankedEmployees
-- Filter top 2
`,
      solutionCode: `WITH RankedEmployees AS (
    SELECT 
        department_id, 
        name, 
        salary,
        DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank_num
    FROM employees
)
SELECT department_id, name, salary
FROM RankedEmployees
WHERE rank_num <= 2
ORDER BY department_id, rank_num;
`,
      hint: "Use DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) inside a CTE."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?",
        answer: "Given salaries [100, 100, 80]: ROW_NUMBER() assigns strictly distinct sequential numbers [1, 2, 3]; RANK() assigns [1, 1, 3] (ties get same rank, next rank is skipped); DENSE_RANK() assigns [1, 1, 2] (ties get same rank, no rank numbers skipped)."
      }
    ],
    resources: [
      { title: "Use The Index, Luke! A Guide to Database Performance", type: "Documentation", authorOrSource: "Markus Winand" }
    ]
  },

  'db-6': {
    id: 'db-6',
    title: 'Transactions & ACID Internals',
    estimatedReadingTime: '26 mins',
    contentMarkdown: `
# Transactions & ACID: Write-Ahead Logging & Checkpointing

ACID transactions are the gold standard for reliable state transitions. The internal engine relies on Write-Ahead Logging (WAL) and ARIES recovery algorithm.

---

## 1. System Architecture: The Write-Ahead Log (WAL)

\`\`\`
Client: COMMIT Transaction #402
               │
               ▼
┌───────────────────────────────┐
│ Write WAL Record to OS Buffer │  Append-only sequential disk write (0.1ms)
└──────────────┬────────────────┘
               │ fsync()
               ▼
┌───────────────────────────────┐
│     Disk WAL (Log File)       │  <-- Acknowledged to client as COMMITTED!
└───────────────────────────────┘
               │
      (Asynchronous Lazy Flush)
               ▼
┌───────────────────────────────┐
│  Data Pages (B+ Tree on Disk) │  Random I/O delayed until Checkpoint!
└───────────────────────────────┘
\`\`\`

---

## 2. ACID Pillars in Depth
1. **Atomicity**: Either all operations persist or none do. Ensured by **Undo Logging** in the WAL.
2. **Consistency**: State moves from one valid state to another, preserving invariants and constraints.
3. **Isolation**: Concurrent transactions do not produce race conditions. Enforced by **Locks or MVCC**.
4. **Durability**: Committed data survives crashes. Ensured by **Redo Logging** in WAL with \`fsync()\`.
`,
    quizzes: [
      {
        id: 'db6-q1',
        question: "Why does Write-Ahead Logging (WAL) allow high write throughput even with slow random disk I/O?",
        options: [
          "WAL writes in memory only without ever touching disk",
          "WAL converts random page updates into fast sequential append-only disk writes before acknowledging commits",
          "WAL compresses data by 90%",
          "WAL bypasses OS kernel locks"
        ],
        correctAnswerIndex: 1,
        explanation: "Sequential append writes are orders of magnitude faster than random disk updates. Modifying pages in memory while logging to sequential WAL delivers top speed with durability."
      }
    ],
    codingChallenge: {
      title: "Miniature WAL Recovery Simulator",
      description: "Implement a crash recovery mechanism that replays COMMITTED transactions from a WAL log and rolls back uncommitted transactions.",
      language: "python",
      starterCode: `def recover_from_wal(wal_records: list, initial_state: dict) -> dict:
    # wal_records: list of tuples:
    # ("START", tx_id), ("SET", tx_id, key, val), ("COMMIT", tx_id), ("ABORT", tx_id)
    # Return restored state dictionary containing only committed mutations
    pass
`,
      solutionCode: `def recover_from_wal(wal_records: list, initial_state: dict) -> dict:
    state = dict(initial_state)
    committed_txs = set()
    tx_mutations = {} # tx_id -> list of (key, val)

    for record in wal_records:
        action = record[0]
        tx_id = record[1]
        if action == "START":
            tx_mutations[tx_id] = []
        elif action == "SET":
            tx_mutations[tx_id].append((record[2], record[3]))
        elif action == "COMMIT":
            committed_txs.add(tx_id)

    # Replay only committed transactions in order
    for record in wal_records:
        if record[0] == "COMMIT":
            tx_id = record[1]
            for key, val in tx_mutations.get(tx_id, []):
                state[key] = val

    return state
`,
      hint: "Track which transactions reached COMMIT; apply mutations only for committed transactions."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "What happens during database Checkpointing?",
        answer: "Checkpointing flushes all dirty in-memory buffer pages to the actual table data files on disk and writes a checkpoint marker to the WAL. During crash recovery, the engine only needs to replay WAL logs starting from the latest checkpoint, bounding recovery time to seconds."
      }
    ],
    resources: [
      { title: "ARIES: A Transaction Recovery Method", type: "Whitepaper", authorOrSource: "C. Mohan (IBM Research)" }
    ]
  },

  'db-7': {
    id: 'db-7',
    title: 'Indexing Internals: B+ Trees vs LSM Trees',
    estimatedReadingTime: '25 mins',
    contentMarkdown: `
# Indexing Internals: B+ Trees vs LSM Trees

Indexes are the single most impactful architectural element determining database read and write latency.

---

## 1. System Architecture: B+ Tree Structure

\`\`\`
                       ┌──────────────┐
                       │ Root Page    │  [Key: 50, Key: 100]
                       └──────┬───────┘
              ┌───────────────┴───────────────┐
              ▼                               ▼
       ┌──────────────┐                ┌──────────────┐
       │ Internal Page│ [Key: 20]      │ Internal Page│ [Key: 75]
       └──────┬───────┘                └──────┬───────┘
       ┌──────┴──────┐                 ┌──────┴──────┐
       ▼             ▼                 ▼             ▼
┌─────────────┐┌─────────────┐  ┌─────────────┐┌─────────────┐
│ Leaf Page A ││ Leaf Page B │  │ Leaf Page C ││ Leaf Page D │
│ [1..19]     ││ [20..49]    │  │ [50..74]    ││ [75..100]   │
└──────┬──────┘└──────┬──────┘  └──────┬──────┘└─────────────┘
       └──────────────┴────────────────┴────────► Doubly Linked Leaf List!
\`\`\`

---

## 2. B+ Tree vs Log-Structured Merge (LSM) Tree

| Characteristic | B+ Tree (Postgres, MySQL, Oracle) | LSM Tree (Cassandra, RocksDB, Scylla) |
| :--- | :--- | :--- |
| **Write Strategy** | In-place page updates with random I/O | Append to MemTable in RAM, flush to SSTables on disk |
| **Write Amplification**| High (writing 10 bytes rewrites full 16KB page) | Low (pure sequential sequential writes) |
| **Read Speed** | Fast $O(\\log N)$ point lookups | Slower (must check MemTable + Bloom Filters + SSTables) |
| **Compaction** | None (leaf nodes split/merge organically) | Heavy background compaction (Merge Sort of SSTables) |
`,
    quizzes: [
      {
        id: 'db7-q1',
        question: "Why do B+ Trees store all actual record pointers in leaf nodes rather than internal nodes?",
        options: [
          "To reduce CPU clock cycles",
          "Internal nodes store only keys and page pointers, maximizing node branching factor (fan-out) and keeping tree height low (3-4 levels for billions of records)",
          "To allow using binary search instead of hashing",
          "Because leaf nodes are stored in RAM while internal nodes are on disk"
        ],
        correctAnswerIndex: 1,
        explanation: "By storing data strictly in leaf nodes, internal nodes maximize branching factor (fan-out of 100-200), keeping the tree extremely shallow (3-4 I/O hops)."
      }
    ],
    codingChallenge: {
      title: "Composite Index Matcher",
      description: "Write a function that verifies if a composite index (A, B, C) can be used to optimize a given query filter following the Leftmost Prefix Rule.",
      language: "python",
      starterCode: `def can_use_composite_index(index_cols: list, query_cols: set) -> bool:
    # index_cols: ["A", "B", "C"]
    # query_cols: {"A", "B"} -> True
    # query_cols: {"B", "C"} -> False (violates leftmost prefix)
    pass
`,
      solutionCode: `def can_use_composite_index(index_cols: list, query_cols: set) -> bool:
    if not index_cols or not query_cols:
        return False
    # Must match sequentially from index 0
    for i, col in enumerate(index_cols):
        if col in query_cols:
            continue
        else:
            # First missing column: ensure we matched at least the first column
            return i > 0
    return True
`,
      hint: "The index can be used if and only if the query conditions include the leftmost prefix column."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "Why did RocksDB choose an LSM Tree instead of a B+ Tree for flash SSD storage?",
        answer: "SSDs have limited write endurance and suffer heavy write amplification from random in-place page writes. LSM Trees convert all writes into continuous sequential writes, preserving SSD longevity and achieving 10x higher write throughput."
      }
    ],
    resources: [
      { title: "The Log-Structured Merge-Tree (LSM-Tree)", type: "Whitepaper", authorOrSource: "O'Neil, Cheng, Gawlick, O'Neil" }
    ]
  },

  'db-8': {
    id: 'db-8',
    title: 'Concurrency Control: MVCC & 2PL',
    estimatedReadingTime: '26 mins',
    contentMarkdown: `
# Concurrency Control: Multi-Version Concurrency Control (MVCC) & 2PL

Preventing dirty reads, non-repeatable reads, and phantom reads without grinding transaction throughput to zero.

---

## 1. The ANSI SQL Isolation Levels & Anomalies

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ (Occurs) | ❌ | ❌ | ❌ |
| **Read Committed** (Default PG) | ✅ (Prevented) | ❌ | ❌ | ❌ |
| **Repeatable Read** | ✅ | ✅ | ❌ (Prevented in PG MVCC) | ❌ |
| **Serializable** | ✅ | ✅ | ✅ | ✅ |

---

## 2. Multi-Version Concurrency Control (MVCC) Internals
- **Core Principle**: *Readers never block writers, and writers never block readers!*
- **Tuple Header Columns (PostgreSQL)**:
  - \`xmin\`: Transaction ID that created the row version.
  - \`xmax\`: Transaction ID that updated/deleted the row version.
- When Transaction #50 reads, it sees a snapshot of rows where \`xmin <= 50\` and \`xmax > 50\` or NULL.
`,
    quizzes: [
      {
        id: 'db8-q1',
        question: "What is the primary breakthrough of Multi-Version Concurrency Control (MVCC)?",
        options: [
          "It removes all database locks completely",
          "Readers never block writers, and writers never block readers",
          "It automatically encrypts historical rows",
          "It forces all transactions to execute sequentially"
        ],
        correctAnswerIndex: 1,
        explanation: "By maintaining historical row versions with transaction timestamps, reads view a point-in-time snapshot without taking read locks that block concurrent writes."
      }
    ],
    codingChallenge: {
      title: "MVCC Snapshot Visibility Checker",
      description: "Implement a function that determines whether a tuple is visible to a transaction given its xmin, xmax, and the transaction's read snapshot.",
      language: "python",
      starterCode: `def is_tuple_visible(xmin: int, xmax: int, current_tx_id: int) -> bool:
    # A row is visible if created before or by current_tx_id,
    # and either never deleted (xmax is None) or deleted after current_tx_id
    pass
`,
      solutionCode: `def is_tuple_visible(xmin: int, xmax: int, current_tx_id: int) -> bool:
    # Tuple created after snapshot is invisible
    if xmin > current_tx_id:
        return False
    # If deleted before or by current_tx_id, it is invisible
    if xmax is not None and xmax <= current_tx_id:
        return False
    return True
`,
      hint: "Verify xmin <= current_tx_id and xmax is None or xmax > current_tx_id."
    },
    interviewQuestions: [
      {
        companyTag: 'Stripe',
        question: "What is Write Skew in Snapshot Isolation and how do you prevent it?",
        answer: "Write Skew happens when two concurrent transactions read overlapping data (e.g., Doctor on-call count >= 2) and concurrently mutate disjoint rows (Doctor A leaves, Doctor B leaves). Both commit under Snapshot Isolation, leaving 0 doctors on call. Prevention requires Serializable Isolation (SSI) or explicit `SELECT ... FOR UPDATE` row locks."
      }
    ],
    resources: [
      { title: "A Critique of ANSI SQL Isolation Levels", type: "Whitepaper", authorOrSource: "Berenson et al. (SIGMOD 1995)" }
    ]
  }
};
