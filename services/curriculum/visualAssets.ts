// High-Resolution Self-Contained SVG Blueprints & Data-URI Visual Assets
// Guarantees 0ms network latency, 100% offline resilience, and zero broken images at any concurrency scale.

export const escapeXml = (unsafe: string): string => {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const encodeSvgDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

export const HERO_ACADEMY_VISUAL_URI = encodeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050914" />
      <stop offset="50%" stop-color="#0b1528" />
      <stop offset="100%" stop-color="#06101f" />
    </linearGradient>
    <linearGradient id="emeraldBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" stroke-width="0.7" />
    </pattern>
  </defs>
  <rect width="800" height="450" fill="url(#bgGrad)" />
  <rect width="800" height="450" fill="url(#grid)" />

  <!-- Subtle Ambient Luminance -->
  <circle cx="170" cy="120" r="130" fill="#10b981" fill-opacity="0.11" />
  <circle cx="630" cy="300" r="160" fill="#0ea5e9" fill-opacity="0.11" />

  <!-- Left Cluster: Distributed System Architecture -->
  <g transform="translate(32, 36)">
    <rect x="0" y="0" width="232" height="168" rx="12" fill="#0b1426" stroke="#334155" stroke-width="1.5" />
    <rect x="14" y="14" width="144" height="20" rx="4" fill="#10b981" fill-opacity="0.18" />
    <text x="22" y="28" fill="#34d399" font-family="monospace" font-size="10" font-weight="bold">DISTRIBUTED CONSENSUS</text>
    <circle cx="44" cy="82" r="19" fill="#162238" stroke="#10b981" stroke-width="2" />
    <text x="32" y="86" fill="#f8fafc" font-family="monospace" font-size="10" font-weight="bold">LB-1</text>
    <circle cx="118" cy="60" r="15" fill="#162238" stroke="#38bdf8" stroke-width="1.8" />
    <text x="111" y="64" fill="#bae6fd" font-family="monospace" font-size="9">N1</text>
    <circle cx="118" cy="106" r="15" fill="#162238" stroke="#38bdf8" stroke-width="1.8" />
    <text x="111" y="110" fill="#bae6fd" font-family="monospace" font-size="9">N2</text>
    <rect x="166" y="48" width="48" height="72" rx="6" fill="#162238" stroke="#f59e0b" stroke-width="1.8" />
    <text x="176" y="88" fill="#fde68a" font-family="monospace" font-size="10" font-weight="bold">WAL</text>
    <line x1="63" y1="76" x2="103" y2="62" stroke="#10b981" stroke-width="1.8" />
    <line x1="63" y1="88" x2="103" y2="102" stroke="#10b981" stroke-width="1.8" />
    <line x1="133" y1="62" x2="166" y2="74" stroke="#38bdf8" stroke-width="1.8" />
    <line x1="133" y1="102" x2="166" y2="92" stroke="#38bdf8" stroke-width="1.8" />
    <text x="16" y="148" fill="#94a3b8" font-family="monospace" font-size="10">Raft Quorum · P99 &lt; 8ms</text>
  </g>

  <!-- Center Hub: Code It Out Execution Engine and Asymptotic Graph -->
  <g transform="translate(282, 36)">
    <rect x="0" y="0" width="236" height="378" rx="16" fill="#091224" stroke="#10b981" stroke-width="2" />
    <rect x="14" y="14" width="208" height="30" rx="7" fill="#132038" />
    <circle cx="28" cy="29" r="4.5" fill="#ef4444" />
    <circle cx="42" cy="29" r="4.5" fill="#f59e0b" />
    <circle cx="56" cy="29" r="4.5" fill="#10b981" />
    <text x="72" y="33" fill="#e2e8f0" font-family="monospace" font-size="10" font-weight="bold">code_it_out_ide.ts</text>

    <!-- Balanced Binary Search Tree Graph -->
    <circle cx="118" cy="82" r="16" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" />
    <text x="110" y="86" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold">50</text>
    <line x1="105" y1="95" x2="68" y2="128" stroke="#34d399" stroke-width="1.8" />
    <line x1="131" y1="95" x2="168" y2="128" stroke="#34d399" stroke-width="1.8" />

    <circle cx="64" cy="140" r="14" fill="#162238" stroke="#38bdf8" stroke-width="1.8" />
    <text x="57" y="144" fill="#bae6fd" font-family="monospace" font-size="10">25</text>
    <circle cx="172" cy="140" r="14" fill="#162238" stroke="#38bdf8" stroke-width="1.8" />
    <text x="165" y="144" fill="#bae6fd" font-family="monospace" font-size="10">75</text>

    <line x1="56" y1="152" x2="38" y2="180" stroke="#475569" stroke-width="1.5" />
    <line x1="72" y1="152" x2="90" y2="180" stroke="#475569" stroke-width="1.5" />
    <line x1="164" y1="152" x2="146" y2="180" stroke="#475569" stroke-width="1.5" />
    <line x1="180" y1="152" x2="198" y2="180" stroke="#475569" stroke-width="1.5" />

    <circle cx="36" cy="192" r="11" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
    <text x="29" y="196" fill="#94a3b8" font-family="monospace" font-size="9">12</text>
    <circle cx="92" cy="192" r="11" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
    <text x="85" y="196" fill="#94a3b8" font-family="monospace" font-size="9">37</text>
    <circle cx="144" cy="192" r="11" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
    <text x="137" y="196" fill="#94a3b8" font-family="monospace" font-size="9">63</text>
    <circle cx="200" cy="192" r="11" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
    <text x="193" y="196" fill="#94a3b8" font-family="monospace" font-size="9">88</text>

    <!-- Complexity and Live Telemetry Box -->
    <rect x="16" y="218" width="204" height="142" rx="10" fill="#060a13" stroke="#1e293b" stroke-width="1.2" />
    <text x="26" y="240" fill="#34d399" font-family="monospace" font-size="10" font-weight="bold">Time: O(log N) | Space: O(H)</text>
    <text x="26" y="258" fill="#93c5fd" font-family="monospace" font-size="9.5">N=10^6 -&gt; 20 steps (0.02 ms)</text>
    <text x="26" y="276" fill="#f8fafc" font-family="monospace" font-size="9.5">Stack: 20 frames (1.2 KB RAM)</text>
    <rect x="26" y="290" width="184" height="4" rx="2" fill="url(#emeraldBar)" />
    <text x="26" y="314" fill="#fbbf24" font-family="monospace" font-size="10">18 Tracks · 452 Deep Modules</text>
    <text x="26" y="334" fill="#10b981" font-family="monospace" font-size="10" font-weight="bold">✓ POPUP IDE &amp; SANDBOX READY</text>
  </g>

  <!-- Bottom Left: Hardware and OS Kernel Pipeline -->
  <g transform="translate(32, 220)">
    <rect x="0" y="0" width="232" height="194" rx="12" fill="#0b1426" stroke="#334155" stroke-width="1.5" />
    <text x="16" y="26" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold">MEMORY &amp; KERNEL PIPELINE</text>
    <rect x="16" y="40" width="200" height="32" rx="6" fill="#162238" stroke="#1e293b" stroke-width="1" />
    <text x="26" y="60" fill="#e2e8f0" font-family="monospace" font-size="10">L1/L2 Cache · 64B Line · MESI</text>
    <rect x="16" y="82" width="200" height="32" rx="6" fill="#162238" stroke="#1e293b" stroke-width="1" />
    <text x="26" y="102" fill="#34d399" font-family="monospace" font-size="10">Virtual Memory · TLB · Paging</text>
    <rect x="16" y="124" width="200" height="32" rx="6" fill="#162238" stroke="#1e293b" stroke-width="1" />
    <text x="26" y="144" fill="#fbbf24" font-family="monospace" font-size="10">epoll() · Async Event Loop</text>
    <text x="16" y="176" fill="#94a3b8" font-family="monospace" font-size="10">Deterministic Complexity Proofs</text>
  </g>

  <!-- Right Cluster: Agentic Harness, AI and Full-Stack Engine -->
  <g transform="translate(536, 36)">
    <rect x="0" y="0" width="232" height="378" rx="12" fill="#0b1426" stroke="#334155" stroke-width="1.5" />
    <text x="16" y="28" fill="#a78bfa" font-family="monospace" font-size="10" font-weight="bold">AI, HARNESS &amp; FULL-STACK</text>
    <rect x="16" y="44" width="200" height="64" rx="8" fill="#162238" stroke="#8b5cf6" stroke-width="1.2" />
    <text x="26" y="66" fill="#f8fafc" font-family="monospace" font-size="10" font-weight="bold">Agentic Harness &amp; MCP</text>
    <text x="26" y="86" fill="#c4b5fd" font-family="monospace" font-size="9">Observe -&gt; Act -&gt; Compact -&gt; Test</text>

    <rect x="16" y="122" width="200" height="64" rx="8" fill="#162238" stroke="#10b981" stroke-width="1.2" />
    <text x="26" y="144" fill="#f8fafc" font-family="monospace" font-size="10" font-weight="bold">React 19 + TypeScript</text>
    <text x="26" y="164" fill="#6ee7b7" font-family="monospace" font-size="9">Fiber Reconciliation · Hooks</text>

    <rect x="16" y="200" width="200" height="64" rx="8" fill="#162238" stroke="#0ea5e9" stroke-width="1.2" />
    <text x="26" y="222" fill="#f8fafc" font-family="monospace" font-size="10" font-weight="bold">SQL &amp; B+Tree Storage</text>
    <text x="26" y="242" fill="#7dd3fc" font-family="monospace" font-size="9">ACID · MVCC · WAL Recovery</text>

    <rect x="16" y="278" width="200" height="80" rx="8" fill="#081120" stroke="#10b981" stroke-width="1.5" />
    <text x="26" y="304" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">CODE IT OUT ACADEMY</text>
    <text x="26" y="324" fill="#e2e8f0" font-family="monospace" font-size="10">452 Interactive Modules</text>
    <text x="26" y="342" fill="#94a3b8" font-family="monospace" font-size="9">Popup Code Lab + Fullscreen IDE</text>
  </g>
</svg>
`);

interface TrackVisualPalette {
  primary: string;
  secondary: string;
  badge: string;
  diagramLabel: string;
  nodes: [string, string, string];
  subLabels: [string, string, string];
  memoryCells: [string, string, string, string];
  timeBadge: string;
  spaceBadge: string;
}

const TRACK_PALETTES: Record<string, TrackVisualPalette> = {
  'c-html': {
    primary: '#f97316',
    secondary: '#fb923c',
    badge: 'DOM & SEMANTIC TREE',
    diagramLabel: 'HTML5 Document Object Model · AOM Tree',
    nodes: ['<document>', '<main role>', '<canvas/svg>'],
    subLabels: ['Byte Stream', 'DOM Nodes', 'WCAG 2.2 AA'],
    memoryCells: ['<html>', '<head>', '<body>', '<main>'],
    timeBadge: 'WHATWG HTML5 Spec',
    spaceBadge: 'DOM & AOM Tree'
  },
  'c-css': {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    badge: 'LAYOUT & RENDER PIPELINE',
    diagramLabel: 'CSSOM · Subgrid · GPU Compositor',
    nodes: ['Box Model', 'Flex & Grid', 'GPU Composite'],
    subLabels: ['Cascade Rules', 'Reflow Pass', '60fps Layer'],
    memoryCells: ['CSSOM', 'Layout', 'Paint', 'GPU Tile'],
    timeBadge: '60fps GPU Composite',
    spaceBadge: 'Blink Layout Engine'
  },
  'c-js': {
    primary: '#eab308',
    secondary: '#facc15',
    badge: 'V8 ENGINE & EVENT LOOP',
    diagramLabel: 'Call Stack · Microtasks · Closures',
    nodes: ['Call Stack', 'Microtasks', 'V8 Heap GC'],
    subLabels: ['Lexical Scope', 'Promise Queue', 'JIT TurboFan'],
    memoryCells: ['Frame[0]', 'Closure*', 'MicroQ', 'HeapObj'],
    timeBadge: 'V8 TurboFan JIT',
    spaceBadge: 'Event Loop Tick'
  },
  'c-ts': {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    badge: 'STATIC TYPE CHECKER',
    diagramLabel: 'AST · Generics · Type Narrowing',
    nodes: ['Generic <T>', 'Control Flow', 'Zero-Cost JS'],
    subLabels: ['Type AST', 'Discriminated', 'Type Erasure'],
    memoryCells: ['ASTNode', 'Type<T>', 'Union|', 'EmitJS'],
    timeBadge: 'Strict Type Safety',
    spaceBadge: '0B Erased Types'
  },
  'c-react': {
    primary: '#06b6d4',
    secondary: '#22d3ee',
    badge: 'FIBER RECONCILIATION',
    diagramLabel: 'State -> Fiber WorkLoop -> Commit',
    nodes: ['useState/Hook', 'Fiber Diff', 'DOM Commit'],
    subLabels: ['Render Lane', 'Double Buffer', 'Layout Effect'],
    memoryCells: ['Hook[0]', 'Current', 'WorkInP', 'DOMRef'],
    timeBadge: 'Concurrent Fiber',
    spaceBadge: 'Double-Buffered Tree'
  },
  'c1': {
    primary: '#10b981',
    secondary: '#34d399',
    badge: 'CPYTHON & ASYNCIO VM',
    diagramLabel: 'Source -> Bytecode -> PVM Stack',
    nodes: ['PyObject*', 'Bytecode VM', 'Asyncio Loop'],
    subLabels: ['RefCount + GC', 'ceval.c Frame', 'Task Coroutine'],
    memoryCells: ['ob_refcnt', 'ob_type*', 'PyCode', 'DictHash'],
    timeBadge: 'CPython 3.12 VM',
    spaceBadge: 'PyObject Arena Heap'
  },
  'c5': {
    primary: '#6366f1',
    secondary: '#818cf8',
    badge: 'B+TREE & MVCC STORAGE',
    diagramLabel: 'SQL Parser -> Optimizer -> WAL',
    nodes: ['Query Plan', 'B+Tree Index', 'WAL & MVCC'],
    subLabels: ['Cost Optimizer', '8KB Page Leaf', 'Snapshot Read'],
    memoryCells: ['RootPg', 'Branch', 'Leaf8KB', 'WAL_LSN'],
    timeBadge: 'ACID & MVCC Engine',
    spaceBadge: '8KB Buffer Pages'
  },
  'c4': {
    primary: '#10b981',
    secondary: '#2dd4bf',
    badge: 'ALGORITHMS & COMPLEXITY',
    diagramLabel: 'Pointers · Trees · Graphs · Dynamic Prog',
    nodes: ['O(log N) Search', 'Graph/Tree', 'DP State Table'],
    subLabels: ['L / Mid / R', 'BFS / Dijkstra', 'Optimal Sub'],
    memoryCells: ['A[0]=2', 'A[1]=7', 'A[2]=11', 'A[3]=15'],
    timeBadge: 'O(N) / O(log N)',
    spaceBadge: 'O(1) / O(N) Aux'
  },
  'c11': {
    primary: '#ec4899',
    secondary: '#f472b6',
    badge: 'RAII MEMORY & JVM JIT',
    diagramLabel: 'vtable Dispatch · Smart Pointers · GC',
    nodes: ['Stack & RAII', 'vptr -> vtable', 'JVM G1GC/JIT'],
    subLabels: ['Zero Leak', 'Dynamic Call', 'Escape Analysis'],
    memoryCells: ['vptr*', 'vtable[0]', 'unique_p', 'align64'],
    timeBadge: 'Zero-Overhead RAII',
    spaceBadge: 'vtable & C2 JIT'
  },
  'c3': {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    badge: 'KERNEL, PAGING & EBPF',
    diagramLabel: 'Syscall -> CFS Scheduler -> Page Table',
    nodes: ['Ring 0 Kernel', 'TLB & Paging', 'epoll / cgroups'],
    subLabels: ['Context Switch', '4-Level Radix', 'I/O Multiplex'],
    memoryCells: ['CR3_Reg', 'PGD->PTE', 'TLB_Hit', 'epoll_fd'],
    timeBadge: 'Linux Ring 0 Kernel',
    spaceBadge: '4KB Page Frame'
  },
  'c7': {
    primary: '#0284c7',
    secondary: '#38bdf8',
    badge: 'TCP/IP, TLS 1.3 & QUIC',
    diagramLabel: 'DNS -> TLS Handshake -> HTTP/3 Streams',
    nodes: ['DNS Anycast', 'TLS 1.3 & QUIC', 'L7 Proxy CDN'],
    subLabels: ['UDP 0-RTT', 'ECDHE Cipher', 'BBR Congestion'],
    memoryCells: ['SYN_Pkt', 'TLS_1RTT', 'QUIC_Str', 'Edge_CDN'],
    timeBadge: '1-RTT Handshake',
    spaceBadge: 'Multiplexed Streams'
  },
  'c6': {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    badge: 'HIGH-SCALE DISTRIBUTED',
    diagramLabel: 'Edge CDN -> Consistent Hash -> Shards',
    nodes: ['Load Balancer', 'Redis Cluster', 'Raft Quorum'],
    subLabels: ['Virtual Nodes', 'Read Replicas', 'Kafka Log'],
    memoryCells: ['Ring_01', 'Shard_A', 'Redis_L1', 'Quorum_3'],
    timeBadge: '99.999% High Avail',
    spaceBadge: 'Sharded Quorum'
  },
  'c2': {
    primary: '#14b8a6',
    secondary: '#2dd4bf',
    badge: 'CPU PIPELINE & COMPILERS',
    diagramLabel: 'Fetch -> Decode -> ALU -> L1 Cache',
    nodes: ['5-Stage Pipe', 'MESI L1/L2', 'LLVM SSA IR'],
    subLabels: ['Branch Predict', 'Cache Line', 'Register Alloc'],
    memoryCells: ['IF/ID', 'EX/ALU', 'L1_64B', 'SSA_Phi'],
    timeBadge: '1.0 CPI Pipeline',
    spaceBadge: '64B Cache Line'
  },
  'c12': {
    primary: '#a855f7',
    secondary: '#c084fc',
    badge: 'TRANSFORMERS & RAG',
    diagramLabel: 'Tokenize -> Self-Attention -> HNSW Vector',
    nodes: ['Q·K^T Matrix', 'LoRA & RLHF', 'Vector HNSW'],
    subLabels: ['KV Cache', '4-Bit Quant', 'Hybrid Search'],
    memoryCells: ['Q_Vec', 'K_Cache', 'Attn_W', 'HNSW_L0'],
    timeBadge: 'FlashAttention-2',
    spaceBadge: 'Paged KV-Cache'
  },
  'c-harness': {
    primary: '#10b981',
    secondary: '#38bdf8',
    badge: 'AGENTIC HARNESS & MCP',
    diagramLabel: 'Observe -> Tool Loop -> Context Compact -> Verify',
    nodes: ['MCP Tool Loop', 'Context Compact', 'Eval & Sandbox'],
    subLabels: ['JSON-RPC 2.0', 'KV Prefix Cache', 'SWE-bench Pass'],
    memoryCells: ['PrefixKV', 'MCP_Call', 'Compact', 'TestPass'],
    timeBadge: '90% KV-Cache Hit',
    spaceBadge: 'Bounded Context'
  },
  'c-git': {
    primary: '#f97316',
    secondary: '#38bdf8',
    badge: 'GIT DAG & GITHUB CI/CD',
    diagramLabel: 'Working Tree -> Staging Index -> Commit DAG -> PR',
    nodes: ['git add (Index)', 'git commit (DAG)', 'git push / PR'],
    subLabels: ['Blob SHA Hash', 'Tree & Parent', 'GitHub Actions'],
    memoryCells: ['HEAD->main', 'Blob_a1f', 'Tree_9c2', 'Commit_7e'],
    timeBadge: 'Content-Addressable',
    spaceBadge: 'Merkle Commit DAG'
  },
  'c-docker': {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    badge: 'CONTAINERS & K8S CONTROL PLANE',
    diagramLabel: 'OverlayFS Image -> containerd Pod -> kube-scheduler -> Cilium eBPF',
    nodes: ['Multi-Stage OCI', 'K8s API & etcd', 'Pod Autoscaler'],
    subLabels: ['cgroups v2', 'Raft Consensus', 'Gateway & CNI'],
    memoryCells: ['Layer_RO', 'Pod_Ready', 'etcd_Rev', 'HPA_Scale'],
    timeBadge: 'OCI & CNCF Native',
    spaceBadge: 'Distroless Image'
  },
  'c-terraform': {
    primary: '#8b5cf6',
    secondary: '#38bdf8',
    badge: 'TERRAFORM DAG & GITOPS CI/CD',
    diagramLabel: 'HCL Config -> State Lock & Plan DAG -> OPA Gate -> Argo Rollout',
    nodes: ['terraform plan', 'OPA & Checkov', 'ArgoCD Canary'],
    subLabels: ['S3 State Lock', 'OIDC Federated', 'SLSA Provenance'],
    memoryCells: ['tfplan', 'Lock_S3', 'OIDC_JWT', 'Canary_100%'],
    timeBadge: 'Declarative IaC DAG',
    spaceBadge: 'Zero-Drift GitOps'
  }
};

const trackUriCache: Record<string, string> = {};

export const getTrackVisualDataUri = (courseId: string): string => {
  if (trackUriCache[courseId]) return trackUriCache[courseId];
  const cfg = TRACK_PALETTES[courseId] || TRACK_PALETTES['c4'];
  const safeId = escapeXml(courseId.replace(/[^a-zA-Z0-9_-]/g, ''));
  const badge = escapeXml(cfg.badge);
  const diagramLabel = escapeXml(cfg.diagramLabel);
  const n0 = escapeXml(cfg.nodes[0]);
  const n1 = escapeXml(cfg.nodes[1]);
  const n2 = escapeXml(cfg.nodes[2]);
  const s0 = escapeXml(cfg.subLabels[0]);
  const s1 = escapeXml(cfg.subLabels[1]);
  const s2 = escapeXml(cfg.subLabels[2]);
  const c0 = escapeXml(cfg.memoryCells[0]);
  const c1 = escapeXml(cfg.memoryCells[1]);
  const c2 = escapeXml(cfg.memoryCells[2]);
  const c3 = escapeXml(cfg.memoryCells[3]);
  const tBadge = escapeXml(cfg.timeBadge);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240">
  <defs>
    <linearGradient id="g-${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060c18" />
      <stop offset="55%" stop-color="#0c1629" />
      <stop offset="100%" stop-color="#07101f" />
    </linearGradient>
    <pattern id="p-${safeId}" width="22" height="22" patternUnits="userSpaceOnUse">
      <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#1e293b" stroke-width="0.65" />
    </pattern>
  </defs>
  <rect width="640" height="240" fill="url(#g-${safeId})" />
  <rect width="640" height="240" fill="url(#p-${safeId})" />
  <circle cx="545" cy="48" r="105" fill="${cfg.primary}" fill-opacity="0.14" />
  <circle cx="85" cy="195" r="85" fill="${cfg.secondary}" fill-opacity="0.09" />

  <!-- Top Architecture Header Bar -->
  <rect x="20" y="14" width="256" height="24" rx="6" fill="${cfg.primary}" fill-opacity="0.18" stroke="${cfg.primary}" stroke-width="1.2" />
  <text x="30" y="30" fill="${cfg.secondary}" font-family="monospace" font-size="10.5" font-weight="bold">${badge}</text>
  <rect x="476" y="14" width="144" height="24" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
  <text x="548" y="30" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="10" font-weight="bold">${tBadge}</text>

  <!-- 3 Architecture Pipeline Nodes -->
  <g transform="translate(20, 50)">
    <rect x="0" y="0" width="176" height="84" rx="10" fill="#101b30" stroke="${cfg.primary}" stroke-width="1.6" />
    <rect x="12" y="10" width="68" height="16" rx="4" fill="${cfg.primary}" fill-opacity="0.18" />
    <text x="18" y="21" fill="${cfg.secondary}" font-family="monospace" font-size="9" font-weight="bold">STAGE 01</text>
    <text x="14" y="46" fill="#f8fafc" font-family="monospace" font-size="13" font-weight="bold">${n0}</text>
    <text x="14" y="68" fill="#94a3b8" font-family="monospace" font-size="10">${s0}</text>

    <line x1="176" y1="42" x2="210" y2="42" stroke="${cfg.primary}" stroke-width="2" stroke-dasharray="4 3" />
    <polygon points="208,37 217,42 208,47" fill="${cfg.primary}" />

    <rect x="217" y="0" width="176" height="84" rx="10" fill="#101b30" stroke="${cfg.secondary}" stroke-width="1.6" />
    <rect x="229" y="10" width="68" height="16" rx="4" fill="${cfg.secondary}" fill-opacity="0.18" />
    <text x="235" y="21" fill="${cfg.secondary}" font-family="monospace" font-size="9" font-weight="bold">STAGE 02</text>
    <text x="231" y="46" fill="#f8fafc" font-family="monospace" font-size="13" font-weight="bold">${n1}</text>
    <text x="231" y="68" fill="#cbd5e1" font-family="monospace" font-size="10">${s1}</text>

    <line x1="393" y1="42" x2="427" y2="42" stroke="${cfg.secondary}" stroke-width="2" stroke-dasharray="4 3" />
    <polygon points="425,37 434,42 425,47" fill="${cfg.secondary}" />

    <rect x="434" y="0" width="166" height="84" rx="10" fill="#101b30" stroke="#10b981" stroke-width="1.6" />
    <rect x="446" y="10" width="68" height="16" rx="4" fill="#10b981" fill-opacity="0.18" />
    <text x="452" y="21" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">STAGE 03</text>
    <text x="448" y="46" fill="#f8fafc" font-family="monospace" font-size="13" font-weight="bold">${n2}</text>
    <text x="448" y="68" fill="#34d399" font-family="monospace" font-size="10">${s2}</text>
  </g>

  <!-- Memory and Pointer Strip -->
  <g transform="translate(20, 148)">
    <rect x="0" y="0" width="600" height="36" rx="7" fill="#091120" stroke="#1e293b" stroke-width="1.2" />
    <text x="12" y="22" fill="#64748b" font-family="monospace" font-size="9.5" font-weight="bold">STATE TRACE:</text>
    <rect x="102" y="6" width="105" height="24" rx="4" fill="#132038" stroke="${cfg.primary}" stroke-width="1" />
    <text x="154" y="22" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">${c0}</text>
    <rect x="217" y="6" width="105" height="24" rx="4" fill="#132038" stroke="${cfg.secondary}" stroke-width="1" />
    <text x="269" y="22" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">${c1}</text>
    <rect x="332" y="6" width="105" height="24" rx="4" fill="#132038" stroke="#38bdf8" stroke-width="1" />
    <text x="384" y="22" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">${c2}</text>
    <rect x="447" y="6" width="140" height="24" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1" />
    <text x="517" y="22" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-size="10" font-weight="bold">${c3}</text>
  </g>

  <!-- Footer Strip -->
  <text x="20" y="216" fill="#cbd5e1" font-family="monospace" font-size="11">${diagramLabel}</text>
  <text x="620" y="216" text-anchor="end" fill="${cfg.secondary}" font-family="monospace" font-size="11" font-weight="bold">25 CHAPTERS · POPUP IDE</text>
</svg>`;

  const uri = encodeSvgDataUri(svg);
  trackUriCache[courseId] = uri;
  return uri;
};

export const buildLessonArchitectureSvg = (
  courseId: string,
  chapterNum: number,
  title: string,
  sectionGroup: string,
  keyTerms: [string, string, string]
): string => {
  const cfg = TRACK_PALETTES[courseId] || TRACK_PALETTES['c4'];
  const safeTitle = escapeXml(title.replace(/[<>&"]/g, '').slice(0, 52));
  const safeGroup = escapeXml(sectionGroup.replace(/[<>&"]/g, '').slice(0, 32).toUpperCase());
  const t0 = escapeXml(keyTerms[0].replace(/[<>&"]/g, '').slice(0, 22));
  const t1 = escapeXml(keyTerms[1].replace(/[<>&"]/g, '').slice(0, 22));
  const t2 = escapeXml(keyTerms[2].replace(/[<>&"]/g, '').slice(0, 22));
  const m0 = escapeXml(cfg.memoryCells[0]);
  const m1 = escapeXml(cfg.memoryCells[1]);
  const m2 = escapeXml(cfg.memoryCells[2]);
  const m3 = escapeXml(cfg.memoryCells[3]);
  const timeBadge = escapeXml(cfg.timeBadge);
  const spaceBadge = escapeXml(cfg.spaceBadge);

  // ONLY render the Big-O Complexity Curves plot on the dedicated Time & Space Complexity module (ds-1: courseId === 'c4' && chapterNum === 1)
  const isComplexityModule = courseId === 'c4' && chapterNum === 1;

  const rightPanelSvg = isComplexityModule
    ? `<!-- PANEL 3 (RIGHT): Asymptotic Time and Space Complexity Growth Plot (Exclusively for ds-1) -->
    <g transform="translate(552, 62)">
      <rect x="0" y="0" width="292" height="206" rx="10" fill="#0b1324" stroke="#1e293b" stroke-width="1.2" />
      <text x="14" y="20" fill="#fbbf24" font-family="monospace" font-size="9.5" font-weight="bold">3. TIME &amp; SPACE COMPLEXITY CURVES</text>

      <!-- Graph Axes -->
      <line x1="34" y1="154" x2="272" y2="154" stroke="#475569" stroke-width="1.5" />
      <line x1="34" y1="34" x2="34" y2="154" stroke="#475569" stroke-width="1.5" />
      <text x="12" y="44" fill="#64748b" font-family="monospace" font-size="8">Ops</text>
      <text x="242" y="166" fill="#64748b" font-family="monospace" font-size="8">Input N</text>

      <!-- O(2^N) / O(N^2) Curve (Red/Rose) -->
      <path d="M 34 152 Q 80 140 135 38" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 2" />
      <text x="140" y="44" fill="#fb7185" font-family="monospace" font-size="8.5" font-weight="bold">O(N²) / O(2^N)</text>

      <!-- O(N log N) Curve (Amber) -->
      <path d="M 34 152 Q 120 132 215 56" fill="none" stroke="#f59e0b" stroke-width="2" />
      <text x="210" y="54" fill="#fbbf24" font-family="monospace" font-size="8.5" font-weight="bold">O(N log N)</text>

      <!-- O(N) Linear Curve (Cyan) -->
      <line x1="34" y1="152" x2="255" y2="86" stroke="#38bdf8" stroke-width="2" />
      <text x="234" y="82" fill="#38bdf8" font-family="monospace" font-size="8.5" font-weight="bold">O(N)</text>

      <!-- O(log N) and O(1) Optimal Curve (Emerald) -->
      <path d="M 34 152 Q 110 132 268 128" fill="none" stroke="#10b981" stroke-width="2.6" />
      <text x="198" y="123" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">O(log N) &amp; O(1)</text>

      <!-- Bottom Complexity Legend Pill -->
      <rect x="14" y="172" width="264" height="24" rx="5" fill="#070c18" stroke="#1e293b" stroke-width="1" />
      <text x="20" y="188" fill="#cbd5e1" font-family="monospace" font-size="8.5">O(1) &lt; O(log N) &lt; O(N) &lt; O(N log N) &lt; O(N²)</text>
    </g>`
    : `<!-- PANEL 3 (RIGHT): Production Verification and Execution Invariants -->
    <g transform="translate(552, 62)">
      <rect x="0" y="0" width="292" height="206" rx="10" fill="#0b1324" stroke="#1e293b" stroke-width="1.2" />
      <text x="14" y="20" fill="#34d399" font-family="monospace" font-size="9.5" font-weight="bold">3. PRODUCTION ARCHITECTURE &amp; INVARIANTS</text>

      <rect x="14" y="32" width="264" height="46" rx="7" fill="#111d35" stroke="${cfg.primary}" stroke-width="1.2" />
      <text x="24" y="48" fill="${cfg.secondary}" font-family="monospace" font-size="8.5" font-weight="bold">LAYER A · CONSTRUCT &amp; SYNTAX</text>
      <text x="24" y="66" fill="#f8fafc" font-family="monospace" font-size="10.5" font-weight="bold">${t0}</text>

      <rect x="14" y="86" width="264" height="46" rx="7" fill="#111d35" stroke="${cfg.secondary}" stroke-width="1.2" />
      <text x="24" y="102" fill="#38bdf8" font-family="monospace" font-size="8.5" font-weight="bold">LAYER B · RUNTIME ENGINE</text>
      <text x="24" y="120" fill="#f8fafc" font-family="monospace" font-size="10.5" font-weight="bold">${timeBadge} · ${spaceBadge}</text>

      <rect x="14" y="140" width="264" height="52" rx="7" fill="#064e3b" fill-opacity="0.45" stroke="#10b981" stroke-width="1.2" />
      <text x="24" y="157" fill="#6ee7b7" font-family="monospace" font-size="8.5" font-weight="bold">LAYER C · HANDS-ON VERIFICATION</text>
      <text x="24" y="176" fill="#ffffff" font-family="monospace" font-size="10" font-weight="bold">Must-Solve Exercises + Popup Lab</text>
    </g>`;

  const topRightLabel = isComplexityModule
    ? `TIME: ${timeBadge} | SPACE: ${spaceBadge}`
    : `${timeBadge} · ${spaceBadge}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 310" width="100%" height="310">
    <defs>
      <linearGradient id="hdrGrad-${chapterNum}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0f1b33" />
        <stop offset="100%" stop-color="#0b1324" />
      </linearGradient>
      <pattern id="bgGrid-${chapterNum}" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.6" />
      </pattern>
    </defs>

    <!-- Outer Blueprint Frame -->
    <rect width="860" height="310" rx="14" fill="#070c18" stroke="#1e293b" stroke-width="1.5" />
    <rect width="860" height="310" rx="14" fill="url(#bgGrid-${chapterNum})" />

    <!-- Top Header Bar -->
    <rect x="16" y="14" width="828" height="36" rx="8" fill="url(#hdrGrad-${chapterNum})" stroke="#1e293b" stroke-width="1" />
    <circle cx="34" cy="32" r="5" fill="${cfg.primary}" />
    <text x="48" y="36" fill="${cfg.secondary}" font-family="monospace" font-size="11.5" font-weight="bold">CH ${chapterNum} SYSTEM ARCHITECTURE BLUEPRINT · ${safeGroup}</text>
    <text x="828" y="36" text-anchor="end" fill="#34d399" font-family="monospace" font-size="10.5" font-weight="bold">${topRightLabel}</text>

    <!-- PANEL 1 (LEFT): Execution Pipeline and State Machine -->
    <g transform="translate(16, 62)">
      <rect x="0" y="0" width="524" height="122" rx="10" fill="#0b1324" stroke="#1e293b" stroke-width="1.2" />
      <text x="14" y="20" fill="#94a3b8" font-family="monospace" font-size="9.5" font-weight="bold">1. STEP-BY-STEP EXECUTION STATE PIPELINE</text>

      <!-- Node 1 -->
      <rect x="14" y="30" width="146" height="76" rx="8" fill="#111d35" stroke="${cfg.primary}" stroke-width="1.6" />
      <text x="24" y="48" fill="${cfg.secondary}" font-family="monospace" font-size="9" font-weight="bold">STEP 01 · INPUT</text>
      <text x="24" y="70" fill="#ffffff" font-family="monospace" font-size="11.5" font-weight="bold">${t0}</text>
      <text x="24" y="90" fill="#94a3b8" font-family="monospace" font-size="9.5">Init &amp; Validation</text>

      <line x1="160" y1="68" x2="186" y2="68" stroke="${cfg.primary}" stroke-width="2" stroke-dasharray="4 2" />
      <polygon points="183,63 191,68 183,73" fill="${cfg.primary}" />

      <!-- Node 2 -->
      <rect x="191" y="30" width="146" height="76" rx="8" fill="#111d35" stroke="${cfg.secondary}" stroke-width="1.6" />
      <text x="201" y="48" fill="#38bdf8" font-family="monospace" font-size="9" font-weight="bold">STEP 02 · TRANSFORM</text>
      <text x="201" y="70" fill="#ffffff" font-family="monospace" font-size="11.5" font-weight="bold">${t1}</text>
      <text x="201" y="90" fill="#cbd5e1" font-family="monospace" font-size="9.5">Core State Transition</text>

      <line x1="337" y1="68" x2="363" y2="68" stroke="${cfg.secondary}" stroke-width="2" stroke-dasharray="4 2" />
      <polygon points="360,63 368,68 360,73" fill="${cfg.secondary}" />

      <!-- Node 3 -->
      <rect x="368" y="30" width="142" height="76" rx="8" fill="#0d2329" stroke="#10b981" stroke-width="1.6" />
      <text x="378" y="48" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">STEP 03 · OUTPUT</text>
      <text x="378" y="70" fill="#ffffff" font-family="monospace" font-size="11.5" font-weight="bold">${t2}</text>
      <text x="378" y="90" fill="#6ee7b7" font-family="monospace" font-size="9.5">Verified Invariant</text>
    </g>

    <!-- PANEL 2 (BOTTOM LEFT): Internal Engine State Trace -->
    <g transform="translate(16, 194)">
      <rect x="0" y="0" width="524" height="74" rx="10" fill="#0b1324" stroke="#1e293b" stroke-width="1.2" />
      <text x="14" y="19" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold">2. INTERNAL ENGINE STATE &amp; EXECUTION TRACE</text>

      <!-- 4 State Cells -->
      <g transform="translate(14, 27)">
        <rect x="0" y="0" width="114" height="36" rx="6" fill="#132038" stroke="${cfg.primary}" stroke-width="1.2" />
        <text x="8" y="13" fill="#64748b" font-family="monospace" font-size="8">STAGE [01]</text>
        <text x="8" y="28" fill="#f8fafc" font-family="monospace" font-size="10.5" font-weight="bold">${m0}</text>

        <rect x="122" y="0" width="114" height="36" rx="6" fill="#132038" stroke="${cfg.secondary}" stroke-width="1.2" />
        <text x="130" y="13" fill="#38bdf8" font-family="monospace" font-size="8">STAGE [02]</text>
        <text x="130" y="28" fill="#f8fafc" font-family="monospace" font-size="10.5" font-weight="bold">${m1}</text>

        <rect x="244" y="0" width="114" height="36" rx="6" fill="#132038" stroke="#64748b" stroke-width="1.2" />
        <text x="252" y="13" fill="#94a3b8" font-family="monospace" font-size="8">STAGE [03]</text>
        <text x="252" y="28" fill="#f8fafc" font-family="monospace" font-size="10.5" font-weight="bold">${m2}</text>

        <rect x="366" y="0" width="130" height="36" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.4" />
        <text x="374" y="13" fill="#6ee7b7" font-family="monospace" font-size="8">VERIFIED [04]</text>
        <text x="374" y="28" fill="#ffffff" font-family="monospace" font-size="10.5" font-weight="bold">${m3}</text>
      </g>
    </g>

    ${rightPanelSvg}

    <!-- Bottom Caption Strip -->
    <text x="20" y="292" fill="#cbd5e1" font-family="monospace" font-size="11">${safeTitle}</text>
    <text x="840" y="292" text-anchor="end" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">✓ Verified Architecture Blueprint</text>
  </svg>`;
};

