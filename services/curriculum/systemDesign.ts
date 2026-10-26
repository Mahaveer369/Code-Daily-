import { LessonContent } from '../../types';

export const SYSTEM_DESIGN_MODULES: Record<string, LessonContent> = {
  'sd-1': {
    id: 'sd-1',
    title: 'Scalability Basics',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Scalability Basics: Vertical vs Horizontal Scaling

In FAANG SDE-2 system design interviews, scalability is not just "adding more servers"—it is the ability of a system to maintain performance (latency, throughput) and availability as load increases linearly or exponentially, while keeping cost bounded.

---

## 1. System Architecture: Vertical vs Horizontal Scaling

\`\`\`
Vertical Scaling (Scale-Up)            Horizontal Scaling (Scale-Out)
┌───────────────────────┐             ┌────────┐  ┌────────┐  ┌────────┐
│  Single Mega-Server   │             │ App #1 │  │ App #2 │  │ App #3 │
│  - 128 vCPUs          │             └───┬────┘  └───┬────┘  └───┬────┘
│  - 1 TB RAM           │                 │           │           │
│  - NVMe RAID          │                 └───────────┼───────────┘
│                       │                             ▼
│  * Hardware Limits    │                  ┌─────────────────────┐
│  * Single Point Fail  │                  │  Load Balancer (L4) │
└───────────────────────┘                  └─────────────────────┘
\`\`\`

---

## 2. Quantitative Trade-Off Matrix

| Dimension | Vertical Scaling (Scale-Up) | Horizontal Scaling (Scale-Out) |
| :--- | :--- | :--- |
| **Hardware Limit** | Hard ceiling (PCIe lanes, socket count) | Elastic (theoretically boundless) |
| **Availability / SPOF** | High risk — hardware maintenance = downtime | Resilient — $N-1$ fault tolerance |
| **Data Consistency** | Simple — ACID on single host memory/bus | Complex — 2PC, Raft, Paxos, Eventual Consistency |
| **Cost Curve** | Super-linear (high-end RAM/chips cost $5\\times$ more) | Linear (commodity server nodes) |
| **Network Overhead** | Low (inter-process bus communication) | High (RPC serialization, TCP handshakes) |

---

## 3. Production Failure Modes & SDE-2 Edge Cases

1. **The Thundering Herd Problem**: When a single mega-cache restarts in a scaled-up architecture, thousands of simultaneous queries hit the database, causing cascading failure.
2. **Stateless Web Tier Requirement**: Horizontal scaling requires removing in-memory sessions from application servers. Sessions must live in distributed Redis clusters or signed JWTs.
3. **Network Partition Latency Spikes**: Adding 10 commodity nodes across Availability Zones introduces cross-rack latency ($0.5\\text{ms} \\to 2.5\\text{ms}$) which must be accounted for in p99 SLA budgets.

---

## 4. SDE-2 Back-of-the-Envelope Estimation Math

\`\`\`
Scenario: 100 Million Daily Active Users (DAU)
- Requests/Day: 100M * 50 actions = 5,000,000,000 requests/day
- Average QPS: 5B / 86,400 ≈ 58,000 requests/sec
- Peak QPS (2x): 116,000 requests/sec
- Bandwidth (10KB payload): 116,000 * 10KB = 1.16 GB/sec (9.28 Gbps)
- Server count (Each node handles 2,000 QPS): 116,000 / 2,000 = 58 nodes + 20% buffer = 70 nodes
\`\`\`
`,
    quizzes: [
      {
        id: 'sd1-q1',
        question: "When must a team transition from vertical scaling to horizontal scaling?",
        options: [
          "When traffic increases by more than 10%",
          "When hitting hardware memory bus limits or needing high availability without SPOF",
          "When switching programming languages",
          "When using microservices instead of monoliths"
        ],
        correctAnswerIndex: 1,
        explanation: "Vertical scaling hits hard physical hardware limits and remains a Single Point of Failure (SPOF). Horizontal scaling provides fault tolerance and elastic capacity."
      },
      {
        id: 'sd1-q2',
        question: "What is the primary prerequisite for horizontally scaling an application web tier?",
        options: [
          "Eliminating all database joins",
          "Making the application layer stateless and offloading sessions to distributed storage",
          "Using NoSQL databases exclusively",
          "Implementing GraphQL instead of REST"
        ],
        correctAnswerIndex: 1,
        explanation: "Application nodes must be stateless so any incoming request can be handled by any server without session affinity failure."
      }
    ],
    codingChallenge: {
      title: "Capacity Planning Calculator",
      description: "Write a function that calculates peak QPS, required server nodes, and network throughput in Gbps given DAU, actions per user, payload size in KB, and server QPS capacity.",
      language: "python",
      starterCode: `def capacity_planner(dau, actions_per_user, payload_kb, server_qps_capacity, peak_factor=2.0):
    # Calculate:
    # 1. peak_qps (integer)
    # 2. servers_needed (integer, with 20% safety headroom)
    # 3. network_gbps (float rounded to 2 decimal places)
    pass
`,
      solutionCode: `import math

def capacity_planner(dau, actions_per_user, payload_kb, server_qps_capacity, peak_factor=2.0):
    total_reqs = dau * actions_per_user
    avg_qps = total_reqs / 86400
    peak_qps = math.ceil(avg_qps * peak_factor)
    
    raw_servers = peak_qps / server_qps_capacity
    servers_needed = math.ceil(raw_servers * 1.20) # 20% safety buffer
    
    # Bytes per sec to Gbps: bytes * 8 / 10^9
    bytes_per_sec = peak_qps * (payload_kb * 1024)
    network_gbps = round((bytes_per_sec * 8) / (10**9), 2)
    
    return {
        "peak_qps": peak_qps,
        "servers_needed": servers_needed,
        "network_gbps": network_gbps
    }
`,
      hint: "Average QPS = total daily requests / 86,400. Multiply by peak factor, then add 20% server buffer."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "How do you handle state when scaling an e-commerce checkout flow across 200 stateless instances?",
        answer: "Decouple state into three layers: 1) Client stores idempotent checkout token; 2) Distributed fast cache (Redis cluster with Master-Replica across AZs) holds cart and transient reservation state with strict TTLs; 3) Relational DB (Spanner or Aurora) holds final persistent transactional records with optimistic locking to prevent double-booking."
      },
      {
        companyTag: 'Netflix',
        question: "What metric triggers horizontal autoscaling without causing thrashing?",
        answer: "Relying on CPU alone causes lagging scale-up and thrashing. Combine P95 request latency, queue depth (or worker saturation), and concurrent active connections with a 5-minute cooldown stabilization window to prevent flapping."
      }
    ],
    resources: [
      { title: "Designing Data-Intensive Applications (Ch. 1)", type: "Book", authorOrSource: "Martin Kleppmann" },
      { title: "Google SRE Book: Addressing Cascading Failures", type: "Whitepaper", authorOrSource: "Google Engineering" }
    ]
  },

  'sd-2': {
    id: 'sd-2',
    title: 'Load Balancing',
    estimatedReadingTime: '25 mins',
    contentMarkdown: `
# Load Balancing & Consistent Hashing

A load balancer (LB) is a reverse proxy distributing client traffic across upstream servers. In SDE-2 system design, the key challenge is balancing request distribution, health checking, SSL termination, and state preservation.

---

## 1. System Architecture: L4 vs L7 & Consistent Hashing

\`\`\`
Client Requests
      │
      ▼
┌───────────────────────────────┐
│   Layer 4 Load Balancer       │  (IP + TCP Port Hash / Direct Server Return)
│   (e.g., Maglev / AWS NLB)    │  Throughput: 10M+ pps, zero payload parsing
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│   Layer 7 Load Balancer       │  (Path routing /auth -> App1, /feed -> App2)
│   (e.g., Envoy / Nginx / ALB) │  TLS termination, HTTP/2, Header inspection
└───────┬───────────────┬───────┘
        │               │
        ▼               ▼
   ┌─────────┐     ┌─────────┐
   │ Node A  │     │ Node B  │  (Consistent Hash Ring with Virtual Nodes)
   └─────────┘     └─────────┘
\`\`\`

---

## 2. Load Balancing Algorithms & Trade-Offs

| Algorithm | Mechanism | Best Use Case | Downside |
| :--- | :--- | :--- | :--- |
| **Round Robin / Weighted** | Sequential rotation | Identical stateless servers | Ignores request processing cost |
| **Least Connections** | Routes to min active sockets | Long-lived requests (WebSockets, uploads) | Requires central connection tracking |
| **Consistent Hashing** | Keys and nodes on circular ring | Caching clusters, stateful routing | Node departure requires virtual ring re-balance |
| **Power of Two Choices** | Pick 2 random, choose least loaded | High-scale distributed clusters | Slight randomness variance |

---

## 3. Deep Dive: Consistent Hashing Ring with Virtual Nodes

In naive hashing: $\\text{server} = \\text{hash}(key) \\pmod N$. If $N$ changes, almost **100% of keys remap**, causing massive cache storms.

In **Consistent Hashing**:
1. Hash space is arranged as a circle $[0, 2^{32}-1]$.
2. Nodes and keys are mapped onto the ring. A key is assigned to the first node encountered moving clockwise.
3. When a node is added/removed, only $K/N$ keys are remapped on average!
4. **Virtual Nodes**: To prevent hot-spots and uneven distribution, each physical node is replicated $V$ times (e.g. 150–200 virtual tokens per physical node).

---

## 4. Production Failure Modes
- **Zombie Nodes & Flapping Health Checks**: If health-check timeouts are too tight, a momentarily saturated node fails health checks, causing traffic to shift to remaining nodes, taking them down in a cascading wave.
- **Connection Draining (Graceful Degradation)**: Removing a node must allow in-flight HTTP requests to complete before socket shutdown.
`,
    quizzes: [
      {
        id: 'sd2-q1',
        question: "Why are Virtual Nodes essential in Consistent Hashing?",
        options: [
          "To enable hardware virtualization and Docker containers",
          "To ensure uniform key distribution across the ring and prevent hot-spot clustering",
          "To encrypt keys on the ring using AES-256",
          "To allow HTTP/3 QUIC protocol streaming"
        ],
        correctAnswerIndex: 1,
        explanation: "Without virtual nodes, random hash placement creates non-uniform arc lengths, causing some physical servers to receive significantly more keys than others."
      },
      {
        id: 'sd2-q2',
        question: "When should an architect select Layer 4 load balancing over Layer 7?",
        options: [
          "When needing header-based routing or path rewrite",
          "When throughput demands millions of packets per second and TLS termination is handled downstream",
          "When sticky cookies are strictly required",
          "When running WebSockets with JSON payload validation"
        ],
        correctAnswerIndex: 1,
        explanation: "Layer 4 inspects only TCP/UDP packets, achieving extreme packet-per-second throughput with minimal CPU overhead."
      }
    ],
    codingChallenge: {
      title: "Consistent Hash Ring Implementation",
      description: "Implement a basic Consistent Hash Ring with virtual nodes and binary search ring lookup.",
      language: "python",
      starterCode: `import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, replicas=3):
        self.replicas = replicas
        self.ring = []        # Sorted list of hash values
        self.hash_to_node = {} # hash -> physical node

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)

    def add_node(self, node: str):
        # Add virtual nodes
        pass

    def get_node(self, key: str) -> str:
        # Return physical node for key
        pass
`,
      solutionCode: `import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, replicas=3):
        self.replicas = replicas
        self.ring = []
        self.hash_to_node = {}

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)

    def add_node(self, node: str):
        for i in range(self.replicas):
            v_key = f"{node}#v{i}"
            h = self._hash(v_key)
            self.ring.append(h)
            self.hash_to_node[h] = node
        self.ring.sort()

    def get_node(self, key: str) -> str:
        if not self.ring:
            return None
        h = self._hash(key)
        idx = bisect.bisect_right(self.ring, h)
        if idx == len(self.ring):
            idx = 0
        return self.hash_to_node[self.ring[idx]]
`,
      hint: "Use bisect.bisect_right to locate the first node clockwise on the sorted hash list."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "How does DynamoDB use consistent hashing to handle node failure without data loss?",
        answer: "Dynamo replicates each key clockwise to the next $N-1$ distinct physical nodes on the ring (preference list). Sloppy quorum ($W + R > N$) and hinted handoff ensure that if a designated node is down, a temporary neighbor holds the write."
      },
      {
        companyTag: 'Meta',
        question: "Explain Direct Server Return (DSR) in high-throughput load balancing.",
        answer: "In DSR, request packets pass through the load balancer, but the response packets travel directly from application servers to the client without going back through the LB. This eliminates the LB outbound bandwidth bottleneck."
      }
    ],
    resources: [
      { title: "Maglev: A Fast and Reliable Software Network Load Balancer", type: "Whitepaper", authorOrSource: "Google (OSDI 2016)" },
      { title: "Consistent Hashing and Random Trees", type: "Whitepaper", authorOrSource: "Karger et al. (MIT)" }
    ]
  },

  'sd-3': {
    id: 'sd-3',
    title: 'Caching Strategies',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Distributed Caching Strategies: Patterns & Eviction

In high-throughput systems, the fastest query is the one that never touches disk. Caching reduces database load and lowers latency from tens of milliseconds to sub-millisecond territory.

---

## 1. System Architecture: Caching Topologies

\`\`\`
   Client
     │
     ▼
┌──────────────┐     Hit: 1-5ms
│   Edge CDN   ├────────────────────────┐
└──────┬───────┘                        │
       │ Miss                           ▼
       ▼                          ┌───────────┐
┌──────────────┐     Hit: 0.5ms   │  Client   │
│ App Web Tier ├─────────────────►│ Response  │
└──────┬───────┘                  └─────▲─────┘
       │                                │
       ├──────────────►┌──────────────┐ │
       │ (Cache-Aside) │ Redis / Memc ├─┘
       ▼ Miss          └──────────────┘
┌──────────────┐
│ Primary DB   │ (Disk I/O: 15-50ms)
└──────────────┘
\`\`\`

---

## 2. Cache Invalidation Patterns

| Pattern | Mechanism | Read Performance | Write Performance | Consistency Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Cache-Aside (Lazy Loading)** | App reads cache; if miss, reads DB & writes back | Fast on hot keys | Zero cache overhead on write | Stale data if DB updated directly |
| **Read-Through** | App talks only to Cache provider; cache loads from DB | Transparent to app | Neutral | Same as Cache-Aside |
| **Write-Through** | Writes to cache and DB synchronously | Fast subsequent reads | Slower writes (dual write penalty) | Highly consistent |
| **Write-Behind (Write-Back)** | Writes to cache immediately; async batched write to DB | Fastest write SLA | Ultra fast | Data loss if cache crashes before sync |

---

## 3. Cache Pitfalls & SDE-2 Antidotes

1. **Cache Penetration**: Malicious requests query non-existent keys (e.g. \`user_id=-9999\`), constantly hitting the database.
   - *Fix*: **Bloom Filter** at the entry boundary or cache empty results with short TTL (\`60s\`).
2. **Cache Stampede (Thundering Herd)**: A high-traffic key expires, causing 10,000 concurrent threads to miss cache and hit DB at once.
   - *Fix*: **Distributed Mutex (Redlock)** so only 1 thread recalculates, or **Probabilistic Early Recomputation (XFetch)**.
3. **Cache Avalanche**: Hundreds of cached keys share the exact same TTL and expire simultaneously at midnight.
   - *Fix*: Add **random jitter** to TTLs (\`TTL = base_ttl + rand(0, 300)\`).
`,
    quizzes: [
      {
        id: 'sd3-q1',
        question: "How do you completely mitigate a Cache Avalanche?",
        options: [
          "Increase cache memory size by 4x",
          "Add randomized jitter to key expiration TTLs so keys do not expire simultaneously",
          "Switch from Redis to Memcached",
          "Disable all key expiration"
        ],
        correctAnswerIndex: 1,
        explanation: "Adding random jitter (e.g. Base TTL + rand(1, 300) seconds) smooths eviction distribution across time."
      },
      {
        id: 'sd3-q2',
        question: "What is the primary role of a Bloom Filter in front of a cache?",
        options: [
          "Compressing JSON objects before storage",
          "Determining definitively if a key DOES NOT exist to prevent Cache Penetration",
          "Encrypting user passwords",
          "Managing LRU eviction pointers"
        ],
        correctAnswerIndex: 1,
        explanation: "A Bloom Filter has zero false negatives: if it says an element is not present, it is guaranteed not to exist, stopping unnecessary DB lookups."
      }
    ],
    codingChallenge: {
      title: "LRU Cache Implementation (O(1) Time)",
      description: "Implement a Least Recently Used (LRU) Cache with get and put operations operating in O(1) time complexity.",
      language: "python",
      starterCode: `class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {} # key -> Node
        # Initialize dummy head and tail
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass
`,
      solutionCode: `class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev = node.prev
        nxt = node.next
        prev.next = nxt
        nxt.prev = prev

    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add_to_front(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
`,
      hint: "Combine a hash map with a doubly linked list. Move accessed nodes to the head; evict from the tail."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "How does Facebook handle cache consistency across regional database replicas?",
        answer: "Meta uses McRouter and lease tokens. When an update commits to MySQL master, the replication stream (via Wormhole / Binlog tailers) invalidates memcached keys across remote regions. Leases prevent stale data writes during race conditions."
      }
    ],
    resources: [
      { title: "Scaling Memcache at Facebook", type: "Whitepaper", authorOrSource: "NSDI 2013" }
    ]
  },

  'sd-4': {
    id: 'sd-4',
    title: 'Database Sharding',
    estimatedReadingTime: '25 mins',
    contentMarkdown: `
# Database Sharding & Partitioning Strategies

When data size exceeds single-node disk capacity or write throughput exceeds single-node IOPS, horizontal partitioning (sharding) becomes non-negotiable.

---

## 1. System Architecture: Sharding Topology

\`\`\`
                     Client Application
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Routing / Proxy    │ (Vitess / Citus / Hash Router)
                  └──────────┬───────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │ Hash(ID) % 3 == 0   │ Hash(ID) % 3 == 1   │ Hash(ID) % 3 == 2
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Shard 0    │      │   Shard 1    │      │   Shard 2    │
│  Users 0..33M│      │ Users 34..66M│      │ Users 67..99M│
│ (Primary/Rep)│      │ (Primary/Rep)│      │ (Primary/Rep)│
└──────────────┘      └──────────────┘      └──────────────┘
\`\`\`

---

## 2. Sharding Strategies Compared

| Strategy | Shard Key Example | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Range-Based** | Alphabetical (\`A-M\`, \`N-Z\`) or Dates | Easy range queries (\`BETWEEN\`) | Severe hot-spots (e.g. today's date) |
| **Hash-Based** | \`hash(user_id) % N\` | Uniform write & read distribution | Cross-shard range queries require scatter-gather |
| **Directory-Based** | Lookup service table | Dynamic reassignment of partitions | Lookup table is a critical SPOF and latency hop |
| **Entity-Group** | Shard by \`tenant_id\` | Co-locates related data, allows local ACID | Large enterprise tenants create hot shards |

---

## 3. High-Order Challenges in Distributed Sharding
- **Cross-Shard Joins**: Traditional SQL \`JOIN\` across shards requires pulling full tables over the network. *SDE-2 Solution*: De-normalize data or execute parallel scatter-gather in the proxy tier.
- **Distributed Transactions (2-Phase Commit)**: 2PC guarantees atomicity across shards but incurs heavy latency locks (blocking if coordinator crashes). Prefer the **Saga Pattern** or eventual consistency.
- **Resharding Live Systems**: Increasing shard count from $N$ to $2N$ without downtime requires dual-writing, background bulk backfill, CDC catchup, and atomic cutover.
`,
    quizzes: [
      {
        id: 'sd4-q1',
        question: "Why is sharding by created_at timestamp considered an anti-pattern for write-heavy workloads?",
        options: [
          "Timestamps take too much memory to index",
          "All incoming writes target the current active day/hour shard, creating a severe hot-spot while older shards sit idle",
          "Time zones prevent UTC conversion",
          "PostgreSQL cannot partition by date"
        ],
        correctAnswerIndex: 1,
        explanation: "All current writes funnel into a single partition, nullifying the throughput benefits of having multiple database nodes."
      }
    ],
    codingChallenge: {
      title: "Hash-Based Shard Router",
      description: "Implement a shard router that maps a user ID and tenant ID to the appropriate shard and detects when a query requires a scatter-gather operation.",
      language: "python",
      starterCode: `class ShardRouter:
    def __init__(self, shard_count: int):
        self.shard_count = shard_count

    def get_shard(self, key: str) -> int:
        pass

    def route_query(self, query_filter: dict) -> list:
        # If 'user_id' in filter -> return single shard index [shard_id]
        # If no shard key -> return all shards [0..shard_count-1] (scatter-gather)
        pass
`,
      solutionCode: `import hashlib

class ShardRouter:
    def __init__(self, shard_count: int):
        self.shard_count = shard_count

    def get_shard(self, key: str) -> int:
        h = int(hashlib.sha256(str(key).encode('utf-8')).hexdigest(), 16)
        return h % self.shard_count

    def route_query(self, query_filter: dict) -> list:
        if 'user_id' in query_filter:
            return [self.get_shard(query_filter['user_id'])]
        return list(range(self.shard_count))
`,
      hint: "Hash user_id for point lookup; return all shard indices if the partition key is missing."
    },
    interviewQuestions: [
      {
        companyTag: 'Uber',
        question: "How would you shard a geospatial database storing real-time driver coordinates?",
        answer: "Avoid sharding by lat/long ranges due to geographic density imbalances (e.g., Manhattan vs. rural Kansas). Use Google S2 Geometry or Uber H3 hexagonal hierarchical spatial indexes. Map hexagon cell IDs through consistent hashing across storage nodes to distribute load evenly."
      }
    ],
    resources: [
      { title: "Sharding Pinterest: How We Scaled to Millions", type: "Engineering Blog", authorOrSource: "Pinterest Engineering" }
    ]
  },

  'sd-5': {
    id: 'sd-5',
    title: 'Message Queues & Event-Driven Architecture',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Message Queues: Decoupling, Backpressure & Exactly-Once Semantics

Message brokers (Apache Kafka, RabbitMQ, AWS SQS) decouple producers from consumers, buffer traffic spikes, and allow asynchronous event-driven workflows.

---

## 1. System Architecture: Log-Based vs Queue-Based

\`\`\`
RabbitMQ (AMQP Queue Broker)          Apache Kafka (Distributed Commit Log)
┌───────────┐                         ┌────────────────────────────────────┐
│ Producer  │                         │ Topic: orders                      │
└─────┬─────┘                         │ Partition 0: [e0][e1][e2][e3][e4]  │
      ▼                               │ Partition 1: [e0][e1][e2][e3]      │
┌───────────┐                         └──────────────────┬─────────────────┘
│ Queue     │ (Deletes on ACK)                           │ (Retains by TTL)
└─────┬─────┘                                            ▼
      ▼                                      Consumer Group: Fulfillment
┌───────────┐                                Consumer 1 -> Partition 0 (Offset: 3)
│ Consumer  │                                Consumer 2 -> Partition 1 (Offset: 2)
└───────────┘
\`\`\`

---

## 2. Broker Comparison Matrix

| Feature | RabbitMQ / ActiveMQ | Apache Kafka / Pulsar |
| :--- | :--- | :--- |
| **Model** | Smart broker, dumb consumer (stores state, tracks ACK) | Dumb broker, smart consumer (append-only log, client tracks offset) |
| **Message Ordering** | Guaranteed per-queue only | Guaranteed strictly per **partition** |
| **Replayability** | No (deleted once processed) | Yes (replay historical events by rewinding offset) |
| **Throughput** | 10k–50k msgs/sec | 1M+ msgs/sec (zero-copy OS page cache reads) |

---

## 3. SDE-2 Concurrency & Delivery Guarantees
- **At-Most-Once**: Messages may be lost, never duplicated (fire and forget).
- **At-Least-Once**: Messages never lost, but may duplicate during network timeouts. **Consumer must be idempotent!**
- **Idempotency Key Pattern**: Store \`message_id\` in a distributed lock or database unique constraint table within the processing transaction.
`,
    quizzes: [
      {
        id: 'sd5-q1',
        question: "How does Apache Kafka guarantee strict message ordering?",
        options: [
          "Globally across the entire cluster using NTP clocks",
          "Strictly within a single partition using sequence offsets",
          "By sorting messages alphabetically in memory",
          "By using two-phase commit on every produce call"
        ],
        correctAnswerIndex: 1,
        explanation: "Kafka provides strict FIFO ordering only within individual partitions, determined by the message partition key."
      }
    ],
    codingChallenge: {
      title: "Idempotent Message Consumer",
      description: "Implement a consumer handler that processes banking balance updates while ensuring duplicate message deliveries are ignored.",
      language: "python",
      starterCode: `class BankConsumer:
    def __init__(self):
        self.processed_ids = set()
        self.balances = {} # account_id -> balance

    def process_message(self, message_id: str, account_id: str, amount: float) -> bool:
        # Return True if processed; False if skipped duplicate
        pass
`,
      solutionCode: `class BankConsumer:
    def __init__(self):
        self.processed_ids = set()
        self.balances = {}

    def process_message(self, message_id: str, account_id: str, amount: float) -> bool:
        if message_id in self.processed_ids:
            return False # Duplicate ignored
        
        self.processed_ids.add(message_id)
        current = self.balances.get(account_id, 0.0)
        self.balances[account_id] = current + amount
        return True
`,
      hint: "Track processed message IDs before mutating state."
    },
    interviewQuestions: [
      {
        companyTag: 'Apple',
        question: "How do you handle consumer group rebalancing in Kafka without causing message processing pauses?",
        answer: "Use Cooperative Sticky Assignors (introduced in Kafka 2.4). Rather than revoking all partitions during a consumer join/leave, it performs incremental cooperative rebalances, revoking only the specific partition reassigned, maintaining 99% stream throughput."
      }
    ],
    resources: [
      { title: "Kafka: The Definitive Guide", type: "Book", authorOrSource: "Neha Narkhede et al." }
    ]
  },

  'sd-6': {
    id: 'sd-6',
    title: 'Microservices & Service Mesh',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Microservices Architecture & Service Mesh

Microservices decompose applications into independently deployable domain services. The complexity shifts from application code into network communication, observability, and resilience.

---

## 1. System Architecture: Ingress & Service Mesh

\`\`\`
   Mobile / Web Clients
            │
            ▼
┌───────────────────────────────┐
│       API Gateway Tier        │  Rate Limiting, Auth, Request Collapsing
└───────────────┬───────────────┘
                │ mTLS
    ┌───────────┴───────────┐
    ▼                       ▼
┌─────────────────┐   ┌─────────────────┐
│ Service A (Pod) │   │ Service B (Pod) │
│ ┌─────────────┐ │   │ ┌─────────────┐ │
│ │ App Logic   │ │   │ │ App Logic   │ │
│ └──────▲──────┘ │   │ └──────▲──────┘ │
│        │        │   │        │        │
│ ┌──────▼──────┐ │   │ ┌──────▼──────┐ │
│ │Envoy Sidecar│◄├───┼►│Envoy Sidecar│ │ (mTLS, Retries, Circuit Breaker)
│ └─────────────┘ │   │ └─────────────┘ │
└─────────────────┘   └─────────────────┘
\`\`\`

---

## 2. Resiliency Patterns
- **Circuit Breaker (Netflix Hystrix / Envoy)**: If error rate exceeds 50% over 10s, trip circuit to Open state. Fail fast immediately without hammering failing service.
- **Bulkhead Pattern**: Isolate thread pools per downstream service so a slow recommendation engine doesn't exhaust the payment worker pool.
- **Distributed Tracing (OpenTelemetry)**: Inject \`trace_id\` and \`span_id\` into HTTP/gRPC headers across all microservice hops.
`,
    quizzes: [
      {
        id: 'sd6-q1',
        question: "What is the primary function of a Circuit Breaker in a microservices network?",
        options: [
          "To cut electrical power to server racks during overheating",
          "To fail fast when a downstream service is struggling, preventing cascading timeouts from consuming thread pools",
          "To decrypt SSL certificates",
          "To round-robin load balance traffic"
        ],
        correctAnswerIndex: 1,
        explanation: "Circuit breakers prevent cascading failures by rejecting requests immediately when downstream failure thresholds are exceeded."
      }
    ],
    codingChallenge: {
      title: "Circuit Breaker State Machine",
      description: "Implement a Circuit Breaker with CLOSED, OPEN, and HALF_OPEN states based on consecutive failure counts.",
      language: "python",
      starterCode: `class CircuitBreaker:
    def __init__(self, failure_threshold=3):
        self.failure_threshold = failure_threshold
        self.state = "CLOSED" # CLOSED, OPEN, HALF_OPEN
        self.failure_count = 0

    def record_success(self):
        pass

    def record_failure(self):
        pass

    def can_execute(self) -> bool:
        pass
`,
      solutionCode: `class CircuitBreaker:
    def __init__(self, failure_threshold=3):
        self.failure_threshold = failure_threshold
        self.state = "CLOSED"
        self.failure_count = 0

    def record_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def record_failure(self):
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

    def can_execute(self) -> bool:
        return self.state != "OPEN"
`,
      hint: "Flip to OPEN when failures reach threshold; reset on success."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "How do you maintain data consistency in microservices without using distributed 2-Phase Commit?",
        answer: "Use the Saga Pattern via Choreography (events) or Orchestration (central workflow coordinator). Each service executes local transactions and publishes compensating events (rollbacks) if a subsequent step in the business process fails."
      }
    ],
    resources: [
      { title: "Building Microservices (2nd Edition)", type: "Book", authorOrSource: "Sam Newman" }
    ]
  },

  'sd-7': {
    id: 'sd-7',
    title: 'CAP & PACELC Theorem',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# CAP Theorem & PACELC: Distributed Consistency Trade-Offs

Distributed databases must choose how they behave when network links inevitably fail.

---

## 1. System Architecture: The Network Partition

\`\`\`
   Data Center US-East                     Data Center US-West
┌────────────────────────┐             ┌────────────────────────┐
│        Node A          │             │        Node B          │
│   Account Bal: $100    │   X X X X   │   Account Bal: $100    │
│                        │ (Partition) │                        │
└────────────────────────┘             └────────────────────────┘
            ▲                                      ▲
            │ Deposit $50                          │ Withdraw $100
         Client 1                               Client 2

CP Choice: Reject write (preserve consistency, sacrifice availability)
AP Choice: Accept writes (preserve availability, create divergent state)
\`\`\`

---

## 2. PACELC Theorem: Beyond Network Partitions
Eric Brewer's CAP only explains behavior during rare network Partitions ($P$).
Daniel Abadi extended it with **PACELC**:
- If there is a **Partition ($P$)**: Choose between **Availability ($A$)** or **Consistency ($C$)**.
- **Else ($E$)**: When running normally, choose between **Latency ($L$)** or **Consistency ($C$)**.

| System | Classification | Behavior |
| :--- | :--- | :--- |
| **Apache Cassandra / Dynamo** | **PA/EL** | During partition: Available. Normal: Low latency via eventual consistency. |
| **Google Spanner / CockroachDB** | **PC/EC** | During partition: Consistent (fails write if no quorum). Normal: Strong consistency via TrueTime/Paxos. |
| **MongoDB (Default)** | **PC/EC** | Primary-secondary setup rejects writes if primary loses majority. |
`,
    quizzes: [
      {
        id: 'sd7-q1',
        question: "In the PACELC theorem, what trade-off must a distributed system make when there is NO network partition?",
        options: [
          "Security vs Encryption",
          "Latency vs Consistency",
          "Throughput vs Storage",
          "CPU vs Memory"
        ],
        correctAnswerIndex: 1,
        explanation: "During normal operations (Else), replicating writes synchronously ensures Consistency at the cost of higher Latency."
      }
    ],
    codingChallenge: {
      title: "Quorum Consistency Verifier",
      description: "Write a function to determine if a distributed read/write configuration satisfies strict quorum consistency (W + R > N).",
      language: "python",
      starterCode: `def is_strong_quorum(n_nodes: int, write_quorum: int, read_quorum: int) -> bool:
    # W + R > N guarantees read overlaps with latest write node
    pass
`,
      solutionCode: `def is_strong_quorum(n_nodes: int, write_quorum: int, read_quorum: int) -> bool:
    return (write_quorum + read_quorum) > n_nodes and write_quorum <= n_nodes and read_quorum <= n_nodes
`,
      hint: "Check W + R > N and ensure individual quorums do not exceed total node count."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "How does Google Spanner achieve external consistency (linearizability) globally?",
        answer: "Spanner uses TrueTime API backed by atomic clocks and GPS receivers in each data center. TrueTime bounds clock uncertainty (epsilon <= 7ms), allowing Spanner to wait out the uncertainty window before committing transactions, ensuring monotonic global ordering without central locks."
      }
    ],
    resources: [
      { title: "Spanner: Google's Globally-Distributed Database", type: "Whitepaper", authorOrSource: "Google (OSDI 2012)" }
    ]
  },

  'sd-8': {
    id: 'sd-8',
    title: 'Design URL Shortener',
    estimatedReadingTime: '25 mins',
    contentMarkdown: `
# End-to-End System Design: Scalable URL Shortener (TinyURL)

A quintessential FAANG SDE-2 interview question testing data encoding, hashing collisions, distributed ID generation, and high-read caching.

---

## 1. System Architecture

\`\`\`
Client Request: GET /xyz123
        │
        ▼
┌──────────────────┐
│   Cloudflare CDN │ (Hit: 301/302 Redirect directly from Edge)
└────────┬─────────┘
         │ Miss
         ▼
┌──────────────────┐
│   API Gateway    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐        Cache Hit
│ Web Service Tier ├────────────────►┌───────────────┐
└────────┬─────────┘                 │ Redis Cluster │
         │ Cache Miss                └───────────────┘
         ▼
┌──────────────────┐
│ NoSQL / RDBMS    │ (Primary Table: [short_code, original_url, user_id, created_at])
└──────────────────┘
\`\`\`

---

## 2. Key Generation Strategy: Base62 vs MD5

- **Character Set**: \`[a-zA-Z0-9]\` = 62 characters.
- **Length**: $62^7 \\approx 3.5 \\text{ Trillion}$ unique URLs (more than enough for 100 years at 1,000 URLs/sec).
- **Generation Approach**:
  1. *Bad*: \`MD5(long_url)[:7]\` $\\to$ high collision probability, requires DB roundtrip to verify collision.
  2. *Good (FAANG SDE-2)*: **Distributed Unique ID Generator (Snowflake / ZooKeeper Token Range)** $\\to$ convert 64-bit integer into Base62 string!

---

## 3. SDE-2 Trade-Off: 301 vs 302 Redirect
- **301 Moved Permanently**: Browser caches redirect. Subsequent requests never hit your server. *Pro*: Zero server load. *Con*: Cannot track analytics / click counts accurately.
- **302 Found (Temporary)**: Browser asks your server every time. *Pro*: 100% accurate click analytics. *Con*: Higher infrastructure load.
`,
    quizzes: [
      {
        id: 'sd8-q1',
        question: "Why is a 302 redirect preferred over a 301 redirect for a commercial URL shortener?",
        options: [
          "302 redirects run faster over HTTPS",
          "302 redirects prevent browser-side permanent caching, allowing tracking of click analytics on every visit",
          "301 redirects are deprecated in HTTP/2",
          "302 redirects compress long URLs"
        ],
        correctAnswerIndex: 1,
        explanation: "302 prevents browsers from caching the destination permanently, ensuring every click hits the shortener for analytics logging."
      }
    ],
    codingChallenge: {
      title: "Base62 Encoder/Decoder",
      description: "Implement Base62 encoding and decoding functions for mapping 64-bit integers to short URLs.",
      language: "python",
      starterCode: `CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(num: int) -> str:
    pass

def decode_base62(short_str: str) -> int:
    pass
`,
      solutionCode: `CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(num: int) -> str:
    if num == 0:
        return CHARS[0]
    res = []
    while num > 0:
        res.append(CHARS[num % 62])
        num //= 62
    return "".join(reversed(res))

def decode_base62(short_str: str) -> int:
    num = 0
    for char in short_str:
        num = num * 62 + CHARS.index(char)
    return num
`,
      hint: "Repeatedly mod and divide by 62; reverse the resulting characters."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "How do you prevent two concurrent workers from generating the same short URL code?",
        answer: "Decouple short code generation from incoming URLs using a Distributed Token Range Service (e.g. ZooKeeper). Allocate integer ranges (e.g., Worker 1 gets 1..1,000,000; Worker 2 gets 1,000,001..2,000,000). Workers increment locally in memory without distributed locks."
      }
    ],
    resources: [
      { title: "System Design Primer: URL Shortener", type: "Documentation", authorOrSource: "GitHub Open Source" }
    ]
  },

  'sd-9': {
    id: 'sd-9',
    title: 'Design Twitter Feed',
    estimatedReadingTime: '28 mins',
    contentMarkdown: `
# End-to-End System Design: Real-Time Social News Feed (Twitter / Instagram)

The ultimate test of read-heavy vs write-heavy architectural trade-offs: Fan-out-on-Write vs Fan-out-on-Read.

---

## 1. System Architecture: Hybrid Fan-out Feed System

\`\`\`
[Post Tweet]
User ────────────────► API Gateway ──► Post Service ──► DB & Kafka
                                                            │
                     ┌──────────────────────────────────────┘
                     ▼
           Fan-out Worker Service
                     │
         Is user a Celebrity (>100k followers)?
               /                \\
             Yes                 No
             /                    \\
  (Do NOT push to 10M feeds)    (Push tweet ID to Redis Timeline)
            │                                  │
            ▼                                  ▼
   Stored in User Tweets Table       User Follower Redis Lists
            │                                  │
            └──────────────┬───────────────────┘
                           │
       [Get Feed]          ▼
User ───────────────► Feed Service
                     Merged: Redis Timeline + Celebrity Pull!
\`\`\`

---

## 2. Fan-out On Write (Push) vs Fan-out On Read (Pull)

| Metric | Fan-Out On Write (Push) | Fan-Out On Read (Pull) | Hybrid (SDE-2 Benchmark) |
| :--- | :--- | :--- | :--- |
| **Mechanism** | On post, inject tweet ID into every follower's Redis list | On feed fetch, query followees' tweets and sort in memory | Push for regular users; Pull for high-follower celebrities |
| **Read Latency** | $O(1)$ — read precomputed Redis list | $O(N \\log K)$ — slow multi-query join | $O(1)$ fast reads, protected write tier |
| **Write Latency** | $O(\\text{Followers})$ — catastrophic for Elon Musk (100M writes) | $O(1)$ fast single write | $O(\\text{Followers})$ capped at 50,000 |
`,
    quizzes: [
      {
        id: 'sd9-q1',
        question: "Why does a pure Fan-Out-On-Write architecture fail when a celebrity with 50M followers posts a message?",
        options: [
          "JSON serialization fails on large arrays",
          "It triggers 50 million writes into individual follower timeline caches, consuming massive CPU and causing cascading queue delays",
          "Redis does not support more than 10,000 keys",
          "PostgreSQL cannot store tweets"
        ],
        correctAnswerIndex: 1,
        explanation: "The 'Celebrity Problem': a single tweet creates a massive write storm of 50M updates that blocks message queues."
      }
    ],
    codingChallenge: {
      title: "K-Way Feed Merger",
      description: "Implement a feed generator that merges multiple user timelines sorted by timestamp using a Min-Heap / Max-Heap in O(N log K) time.",
      language: "python",
      starterCode: `import heapq

def merge_feeds(timelines: list) -> list:
    # Each timeline is a list of tuples: (timestamp, tweet_id) sorted descending by timestamp
    # Return merged top tweets sorted descending by timestamp
    pass
`,
      solutionCode: `import heapq

def merge_feeds(timelines: list) -> list:
    heap = []
    # Initialize heap with the first tweet of each non-empty timeline
    for i, t in enumerate(timelines):
        if t:
            # Store negative timestamp for max-heap behavior with heapq
            heapq.heappush(heap, (-t[0][0], t[0][0], t[0][1], i, 0))

    result = []
    while heap:
        _, ts, tweet_id, tl_idx, tweet_idx = heapq.heappop(heap)
        result.append((ts, tweet_id))
        
        # Advance pointer in the timeline we popped from
        next_idx = tweet_idx + 1
        if next_idx < len(timelines[tl_idx]):
            next_t = timelines[tl_idx][next_idx]
            heapq.heappush(heap, (-next_t[0], next_t[0], next_t[1], tl_idx, next_idx))
            
    return result
`,
      hint: "Use heapq with pointers to each timeline to maintain O(log K) insertion cost."
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: "How do you rank feeds dynamically based on machine learning scoring without adding 500ms latency to every fetch?",
        answer: "Two-stage ranking pipeline: 1) Retrieval Phase pulls top 500 candidate post IDs from Redis/Cassandra cache in 10ms; 2) Scoring Phase runs a lightweight ML ranker (logistic regression or GBDT) on the 500 candidates in parallel to compute final relevance scores within 25ms."
      }
    ],
    resources: [
      { title: "Twitter's Timelines at Scale", type: "Engineering Blog", authorOrSource: "Twitter Engineering" }
    ]
  }
};
