import { DailyPlan, Category, LessonContent } from '../types';
import { db } from './db';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const getApiKey = () => import.meta.env.VITE_PERPLEXITY_API_KEY || '';

export const callPerplexity = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

const getCuratedDailyPlan = (today: string): DailyPlan => ({
  date: today,
  topics: [
    {
      category: Category.CS_CORE,
      title: "Process vs Thread & Context Switching",
      difficulty: "Medium",
      question: "What is the exact architectural difference between an OS Process and a Thread?",
      shortAnswer: "A process is an isolated executing program with its own virtual address space (Page Table / CR3). A thread is a lightweight execution unit within a process that shares the heap and global memory with sibling threads.",
      detailedExplanation: "### Deep Dive: Process vs Thread\n\n1. **Memory Isolation**: Processes have independent virtual address spaces. A crash in one process does not corrupt another.\n2. **Context Switching Overhead**: Switching between threads of the same process is faster because TLB address mappings remain valid.\n3. **Communication**: Threads communicate via shared memory (requiring mutexes/atomics); processes require Inter-Process Communication (IPC, pipes, shared memory).",
      tags: ["OS", "Concurrency", "Memory"]
    },
    {
      category: Category.DBMS,
      title: "ACID Properties & Write-Ahead Logging (WAL)",
      difficulty: "Medium",
      question: "How do production relational databases guarantee ACID properties during a sudden power loss?",
      shortAnswer: "Atomicity and Durability are enforced via Write-Ahead Logging (WAL / ARIES) flushed to disk via fsync before commit, while Isolation uses MVCC snapshots and locks.",
      detailedExplanation: "### Deep Dive: ACID\n\n- **Atomicity**: Guaranteed by undo transaction logs during crash recovery.\n- **Consistency**: Enforced through schema rules, foreign keys, and integrity constraints.\n- **Isolation**: Prevents concurrency anomalies using isolation levels (Read Committed, Repeatable Read, Serializable).\n- **Durability**: Achieved by appending redo records to the Write-Ahead Log on disk before acknowledging commits.",
      tags: ["Transactions", "SQL", "ACID"]
    },
    {
      category: Category.SYSTEM_DESIGN,
      title: "Layer 4 vs Layer 7 Load Balancing",
      difficulty: "Medium",
      question: "How does a Layer 4 Transport load balancer differ from a Layer 7 Application load balancer?",
      shortAnswer: "Layer 4 load balancers operate at the transport layer (TCP/UDP) routing based on IP and port without reading HTTP payloads, while Layer 7 balancers inspect HTTP headers, cookies, and URL paths for smart routing.",
      detailedExplanation: "### Layer 4 vs Layer 7 Load Balancing\n\n- **L4 (Transport)**: Ultra-fast packet forwarding (e.g., AWS NLB, IPVS). Cannot route based on URL path.\n- **L7 (Application)**: Terminates TLS and inspects HTTP payloads (e.g., NGINX, Envoy, AWS ALB). Supports path routing (`/api` vs `/static`), JWT auth, and rate limiting.",
      tags: ["Scalability", "Networking", "System Design"]
    },
    {
      category: Category.DSA,
      title: "Binary Search & Monotonic Predicate Invariants",
      difficulty: "Easy",
      question: "When can Binary Search be applied beyond simple sorted arrays, and what is the loop invariant?",
      shortAnswer: "Binary search applies to any monotonic boolean condition F(x) that transitions once from False to True, halving the search space in O(log N) time.",
      detailedExplanation: "### Binary Search Invariants\n\nAlways maintain a closed search interval `[low, high]`:\n```python\nlow, high = 0, len(arr) - 1\nwhile low <= high:\n    mid = low + (high - low) // 2\n    if arr[mid] == target:\n        return mid\n    elif arr[mid] < target:\n        low = mid + 1\n    else:\n        high = mid - 1\nreturn -1\n```",
      tags: ["Algorithms", "Searching", "Binary Search"]
    }
  ]
});

export const generateDailyPlan = async (): Promise<DailyPlan> => {
  const today = new Date().toDateString();

  const systemPrompt = `You are a senior Computer Science educator.
Generate a structured JSON response containing one "Question of the Day" for each category:
1. CS Fundamentals
2. DBMS
3. System Design
4. DSA`;

  try {
    let content = '';
    const serverRes = await fetch('/api/gemini/daily-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ today, systemPrompt }),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      content = data.text || '';
    } else if (getApiKey()) {
      content = await callPerplexity(systemPrompt, `Generate today's study plan for: ${today}`);
    }

    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as DailyPlan;
      }
    }
  } catch (error) {
    console.warn("Using curated daily plan fallback:", error);
  }

  return getCuratedDailyPlan(today);
};

const CS_DICTIONARY: Record<string, string> = {
  deadlock: "A deadlock occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another.",
  thread: "A thread is the smallest unit of execution within an OS process, sharing the parent process's virtual memory space, heap, and file descriptors.",
  process: "A process is an executing program instance with its own dedicated virtual memory address space, page table, stack, and heap.",
  acid: "ACID defines the four pillars of database transactions: Atomicity, Consistency, Isolation, and Durability, ensuring reliability under concurrent operations.",
  mutex: "A mutex (mutual exclusion) is a synchronization primitive that limits access to a shared critical section to a single thread at a time.",
  semaphore: "A semaphore is a signaling counter used to control access to finite resources among multiple threads via wait (P) and signal (V) operations.",
  btree: "A B+ Tree is a self-balancing N-ary search tree optimized for block storage systems, keeping all records in sorted leaf pages linked sequentially.",
  sharding: "Sharding horizontally partitions data across multiple independent database nodes by a shard key to scale write throughput and storage.",
  caching: "Caching stores hot data in fast volatile memory (RAM / Redis) to serve reads in sub-millisecond latency using eviction policies like LRU or LFU.",
  closure: "A closure is a function bundled with lexical references to variables in its outer enclosing scope, preserving them even after the outer function completes.",
  flexbox: "CSS Flexbox is a one-dimensional layout model for distributing space and aligning items along a single row or column axis."
};

export const getFastDefinition = async (term: string): Promise<string> => {
  const cleanTerm = term.trim().toLowerCase();
  try {
    const serverRes = await fetch('/api/gemini/define', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term }),
    });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.text) return data.text.trim();
    } else if (getApiKey()) {
      const content = await callPerplexity(
        "You are a CS expert. Define terms concisely in max 30 words.",
        `Define "${term}" in CS context.`
      );
      if (content) return content.trim();
    }
  } catch (error) {
    // Fallback to dictionary
  }

  for (const [key, val] of Object.entries(CS_DICTIONARY)) {
    if (cleanTerm.includes(key)) return val;
  }
  return `${term}: A core concept in Computer Science and Software Engineering. Open the interactive track module or visualizer for step-by-step code walkthroughs.`;
};

const pendingRequests = new Map<string, Promise<LessonContent>>();

export const generateLessonContent = async (moduleId: string, topicTitle: string, category: string): Promise<LessonContent> => {
  const cached = db.getLesson(moduleId);
  if (cached) return cached;

  if (pendingRequests.has(moduleId)) {
    return pendingRequests.get(moduleId)!;
  }

  const fetchPromise = (async () => {
    try {
      const systemPrompt = `You are a Senior Engineer creating course content. Return ONLY valid JSON.`;
      const userPrompt = `Create a learning module for: "${topicTitle}" in "${category}".`;

      let content = '';
      if (getApiKey()) {
        content = await callPerplexity(systemPrompt, userPrompt);
      } else {
        const serverRes = await fetch('/api/gemini/lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userPrompt }),
        });
        if (serverRes.ok) {
          const data = await serverRes.json();
          content = data.text || '';
        }
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const lesson = JSON.parse(jsonMatch[0]) as LessonContent;
        lesson.id = moduleId;
        db.saveLesson(moduleId, lesson);
        return lesson;
      }

      throw new Error("Could not parse lesson content");
    } catch (error) {
      return {
        id: moduleId,
        title: topicTitle,
        estimatedReadingTime: "10 min",
        contentMarkdown: `# ${topicTitle}\n\nContent is being generated. Please refresh.`,
        quizzes: [],
        resources: []
      } as LessonContent;
    } finally {
      pendingRequests.delete(moduleId);
    }
  })();

  pendingRequests.set(moduleId, fetchPromise);
  return fetchPromise;
};

const getOfflineTutorResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('process') || q.includes('thread')) {
    return `### Process vs Thread\n\n- **Process**: Independent execution environment with its own virtual address space, page table, and system handles.\n- **Thread**: Lightweight unit of execution sharing the process's heap and global state.\n\n**Key Takeaway**: Threads share memory (fast communication, requires synchronization); processes are isolated (safe, requires IPC).`;
  }
  if (q.includes('acid') || q.includes('transaction') || q.includes('sql')) {
    return `### SQL & ACID Transactions\n\n- **Atomicity**: Entire transaction succeeds or rolls back via Undo logs.\n- **Consistency**: All integrity constraints and foreign keys hold.\n- **Isolation**: Concurrent transactions execute without interference (MVCC / 2PL).\n- **Durability**: Committed changes survive crashes via Write-Ahead Logging (WAL).`;
  }
  if (q.includes('binary search') || q.includes('two sum') || q.includes('dsa')) {
    return `### Algorithm Strategy\n\n- For **sorted arrays**, use **Binary Search** (\`O(log N)\` time, \`O(1)\` space) or **Two Pointers**.\n- For **unsorted pair lookups**, use a **Hash Map** (\`O(N)\` time, \`O(N)\` space).\n\n\`\`\`python\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\`\`\``;
  }
  return `### Interactive Study Tutor\n\nHere is how to master **${query.slice(0, 50)}**:\n\n1. **Intuition First**: Break the problem into input, state transition, and output invariant.\n2. **Time & Space Complexity**: Always compare the brute-force \`O(N^2)\` baseline against an optimal \`O(N)\` or \`O(log N)\` approach.\n3. **Hands-On Practice**: Try running a quick test in the **Live Code Sandbox** or step through the **Dry-Run Visualizer**!`;
};

export class ChatService {
  async sendMessageStream(message: string): Promise<AsyncIterable<string>> {
    let content = "";
    try {
      const serverRes = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (serverRes.ok) {
        const data = await serverRes.json();
        content = data.text || "";
      } else if (getApiKey()) {
        content = await callPerplexity(
          "You are an expert CS tutor. Be concise, accurate, and code-focused.",
          message
        );
      }
    } catch (err) {
      // Fallback to offline tutor response
    }

    if (!content) {
      content = getOfflineTutorResponse(message);
    }

    async function* textGenerator() {
      yield content;
    }
    return textGenerator();
  }
}
