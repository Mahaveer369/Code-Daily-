import { LessonContent } from '../../types';

export const NETWORK_MODULES: Record<string, LessonContent> = {
  'cn-1': {
    id: 'cn-1',
    title: 'OSI Model Deep Dive',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# OSI 7-Layer Model: Encapsulation & Protocol Data Units (PDUs)

The OSI model defines the conceptual separation of concerns in network communication.

---

## 1. System Architecture: Packet Encapsulation Flow

\`\`\`
Layer 7: Application  [HTTP Header + Data]                (PDU: Data)
             │
             ▼
Layer 4: Transport    [TCP Header] [HTTP Header + Data]   (PDU: Segment)
             │
             ▼
Layer 3: Network      [IP Header] [TCP] [HTTP]            (PDU: Packet)
             │
             ▼
Layer 2: Data Link    [Ethernet Header] [IP] [TCP] [FCS]  (PDU: Frame - MAC Addresses)
             │
             ▼
Layer 1: Physical     10110010101010010101010             (PDU: Bits / Photons)
\`\`\`

---

## 2. Layer Functions & Key Protocols
- **Layer 7 (Application)**: HTTP, DNS, gRPC, SMTP, SSH.
- **Layer 4 (Transport)**: TCP (reliable, ordered, connection-oriented), UDP (unreliable, datagram). Port numbers lives here.
- **Layer 3 (Network)**: IPv4, IPv6, ICMP. Routers operate here using IP routing tables (BGP, OSPF).
- **Layer 2 (Data Link)**: Ethernet, Wi-Fi. Switches operate here using MAC Address tables (ARP protocol translates IP to MAC).
`,
    quizzes: [
      {
        id: 'cn1-q1',
        question: "At which OSI layer does an L4 load balancer operate when routing packets based on destination port?",
        options: [
          "Layer 2 (Data Link)",
          "Layer 4 (Transport)",
          "Layer 7 (Application)",
          "Layer 3 (Network)"
        ],
        correctAnswerIndex: 1,
        explanation: "Transport layer manages TCP/UDP ports and connection state without inspecting application payloads."
      }
    ],
    codingChallenge: {
      title: "Header Size Calculator",
      description: "Calculate total packet overhead in bytes given Ethernet (14 bytes), IPv4 (20 bytes), and TCP (20 bytes) headers.",
      language: "python",
      starterCode: `def calculate_packet_overhead(payload_bytes: int) -> dict:
    # Standard: Ethernet 14B, IPv4 20B, TCP 20B, FCS 4B
    pass
`,
      solutionCode: `def calculate_packet_overhead(payload_bytes: int) -> dict:
    headers_overhead = 14 + 20 + 20 + 4 # 58 bytes
    total_bytes = payload_bytes + headers_overhead
    efficiency = round((payload_bytes / total_bytes) * 100, 2)
    return {
        "overhead_bytes": headers_overhead,
        "total_bytes": total_bytes,
        "efficiency_pct": efficiency
    }
`,
      hint: "Add up 14 + 20 + 20 + 4 to get standard Ethernet packet frame overhead."
    },
    interviewQuestions: [
      {
        companyTag: 'Cisco',
        question: "How does the Address Resolution Protocol (ARP) discover a local machine's MAC address?",
        answer: "When host A wants to send a frame to IP B on the same subnet, it broadcasts an ARP Request frame to `FF:FF:FF:FF:FF:FF`: 'Who has IP B? Tell Host A'. Host B receives the broadcast and replies with an ARP Reply unicast containing its MAC address. Host A caches this in its ARP table."
      }
    ],
    resources: [
      { title: "Computer Networking: A Top-Down Approach", type: "Book", authorOrSource: "Kurose & Ross" }
    ]
  },

  'cn-2': {
    id: 'cn-2',
    title: 'TCP/IP Protocol Suite & Congestion Control',
    estimatedReadingTime: '24 mins',
    contentMarkdown: `
# TCP Internals: 3-Way Handshake, Flow Control & BBR

TCP converts an unreliable IP packet network into a reliable, ordered, full-duplex byte stream.

---

## 1. TCP 3-Way Handshake & Teardown

\`\`\`
Client                                             Server
  │                SYN (seq=x)                        │
  ├──────────────────────────────────────────────────►│  (Listen -> SYN_RCVD)
  │                                                   │
  │            SYN-ACK (seq=y, ack=x+1)               │
  │◄──────────────────────────────────────────────────┤  (Allocates TCB memory)
  │                                                   │
  │                ACK (ack=y+1)                      │
  ├──────────────────────────────────────────────────►│  (Established!)
\`\`\`

---

## 2. Flow Control vs Congestion Control
- **Flow Control (Sliding Window)**: Protects the **receiver** buffer from being overwhelmed (advertised in TCP Window field).
- **Congestion Control**: Protects the **intermediate network** from bufferbloat and packet drops.
  - *Classic Loss-Based (CUBIC, Reno)*: Increases window until packet loss occurs, then cuts window in half.
  - *Modern Model-Based (Google BBR)*: Measures bottleneck bandwidth and round-trip propagation delay (BtlBw and RTprop) to maximize throughput without queuing buffers.
`,
    quizzes: [
      {
        id: 'cn2-q1',
        question: "What is the primary danger of a SYN Flood DDoS attack and how do SYN Cookies resolve it?",
        options: [
          "SYN floods consume hard drive space",
          "SYN floods exhaust server RAM by opening half-open connection tables; SYN Cookies encode connection state inside the initial TCP sequence number so the server allocates zero memory until the final ACK arrives",
          "SYN floods corrupt SSL keys",
          "SYN cookies compress TCP headers"
        ],
        correctAnswerIndex: 1,
        explanation: "SYN Cookies cryptographically encode connection state into sequence number Y, allowing the server to allocate zero state until the client returns the valid ACK."
      }
    ],
    codingChallenge: {
      title: "TCP Sliding Window Transmitter",
      description: "Simulate a sliding window packet sender that transmits packets up to the window size and slides forward on acknowledgment.",
      language: "python",
      starterCode: `class SlidingWindowSender:
    def __init__(self, window_size: int, total_packets: int):
        self.window_size = window_size
        self.total_packets = total_packets
        self.base = 0

    def sendable_packets(self) -> list:
        # Return list of packet IDs currently allowed to be in-flight
        pass

    def receive_ack(self, ack_num: int):
        # ack_num cumulative acknowledges packets up to ack_num
        pass
`,
      solutionCode: `class SlidingWindowSender:
    def __init__(self, window_size: int, total_packets: int):
        self.window_size = window_size
        self.total_packets = total_packets
        self.base = 0

    def sendable_packets(self) -> list:
        limit = min(self.base + self.window_size, self.total_packets)
        return list(range(self.base, limit))

    def receive_ack(self, ack_num: int):
        if ack_num >= self.base:
            self.base = min(ack_num + 1, self.total_packets)
`,
      hint: "Advance self.base to ack_num + 1; sendable packets span base to base + window_size."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "Why does TCP have a TIME_WAIT state of 2MSL (Maximum Segment Lifetime)?",
        answer: "Two reasons: 1) To ensure the final ACK arrives safely at the remote peer (if lost, the remote peer will retransmit FIN, and our node must resend ACK rather than RST); 2) To allow lingering duplicate packets from the connection to die out in the network before a new socket reuses the same (IP, Port) 4-tuple."
      }
    ],
    resources: [
      { title: "BBR: Congestion-Based Congestion Control", type: "Whitepaper", authorOrSource: "Google (ACM Queue 2016)" }
    ]
  },

  'cn-3': {
    id: 'cn-3',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# HTTP Evolution: Multiplexing, Head-of-Line Blocking & QUIC

From text-based HTTP/1.1 to binary framing in HTTP/2 and UDP-based HTTP/3.

---

## 1. Evolution Matrix

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 (QUIC) |
| :--- | :--- | :--- | :--- |
| **Transport** | TCP | TCP | **UDP** |
| **Format** | Text / ASCII headers | Binary Framing | Binary Framing (QPACK) |
| **Multiplexing** | No (Head-of-Line blocking at HTTP level) | Yes (Multiple streams over 1 TCP socket) | Yes (Independent streams over UDP) |
| **TCP HoL Blocking** | Yes | **Severe** (1 dropped packet stalls all streams!) | **Zero** (Dropped packet stalls only that 1 stream!) |
| **Handshake Latency** | 2 RTT (TCP + TLS 1.2) | 2 RTT (TCP + TLS 1.2/1.3) | **0-1 RTT (Single combined handshake)** |
| **Connection Migration**| Broken on IP change (WiFi $\\to$ 5G) | Broken on IP change | **Preserved via 64-bit Connection ID!** |
`,
    quizzes: [
      {
        id: 'cn3-q1',
        question: "What is the critical flaw in HTTP/2 multiplexing that HTTP/3 was engineered to solve?",
        options: [
          "HTTP/2 uses too much RAM",
          "TCP Head-of-Line blocking: because all HTTP/2 streams share a single TCP connection, a single dropped packet stalls ALL streams until TCP retransmits",
          "HTTP/2 does not support HTTPS",
          "HTTP/2 cannot stream video"
        ],
        correctAnswerIndex: 1,
        explanation: "In HTTP/2, all streams share one TCP connection. If one packet drops, TCP halts delivery of all subsequent bytes across all streams until retransmission succeeds. HTTP/3 uses UDP so dropped packets stall only their specific stream."
      }
    ],
    codingChallenge: {
      title: "HTTP/2 Binary Frame Parser",
      description: "Parse an HTTP/2 9-byte frame header into Length, Type, Flags, and Stream Identifier.",
      language: "python",
      starterCode: `def parse_http2_frame_header(header_bytes: bytes) -> dict:
    # 9 bytes total:
    # Length: 24 bits (3 bytes)
    # Type: 8 bits (1 byte)
    # Flags: 8 bits (1 byte)
    # Stream ID: 31 bits (4 bytes, ignore first reserved bit)
    pass
`,
      solutionCode: `def parse_http2_frame_header(header_bytes: bytes) -> dict:
    length = int.from_bytes(header_bytes[0:3], 'big')
    frame_type = header_bytes[3]
    flags = header_bytes[4]
    stream_id = int.from_bytes(header_bytes[5:9], 'big') & 0x7FFFFFFF
    return {
        "length": length,
        "type": frame_type,
        "flags": flags,
        "stream_id": stream_id
    }
`,
      hint: "Use int.from_bytes(..., 'big') and mask stream_id with 0x7FFFFFFF to drop the reserved bit."
    },
    interviewQuestions: [
      {
        companyTag: 'Cloudflare',
        question: "How does QUIC connection migration prevent mobile stream interruptions when switching from Wi-Fi to Cellular?",
        answer: "TCP connections are bound to a 4-tuple (Src IP, Src Port, Dst IP, Dst Port). When switching Wi-Fi to 5G, the client IP changes, breaking the TCP socket. QUIC uses a random 64-bit Connection ID independent of IP/port. When the IP changes, the client transmits packets with the same Connection ID, and the server seamlessly continues the session without handshakes."
      }
    ],
    resources: [
      { title: "RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport", type: "RFC", authorOrSource: "IETF" }
    ]
  },

  'cn-4': {
    id: 'cn-4',
    title: 'DNS & Domain Resolution',
    estimatedReadingTime: '18 mins',
    contentMarkdown: `
# DNS Hierarchy: Recursive Resolvers, Anycast & DNSSEC

DNS maps human domain names (\`api.google.com\`) to machine routable IP addresses.

---

## 1. Resolution Flow: Root to Authoritative
1. Client checks OS Cache & \`/etc/hosts\`.
2. Asks **Recursive Resolver** (e.g. \`8.8.8.8\` or ISP).
3. Resolver queries **Root Nameserver (\`.\`)** $\\to$ returns TLD server (\`.com\`).
4. Resolver queries **TLD Nameserver (\`.com\`)** $\\to$ returns Authoritative server (\`ns1.google.com\`).
5. Resolver queries **Authoritative Nameserver** $\\to$ returns \`A\` record (\`142.250.190.46\`).
`,
    quizzes: [
      {
        id: 'cn4-q1',
        question: "How does BGP Anycast routing allow DNS providers (like 1.1.1.1 or 8.8.8.8) to offer single-digit millisecond latency worldwide?",
        options: [
          "They use satellite lasers",
          "Multiple data centers worldwide announce the EXACT SAME IP address via BGP, routing users to the geographically nearest PoP",
          "They disable all caching",
          "They run on client browsers"
        ],
        correctAnswerIndex: 1,
        explanation: "BGP Anycast advertises the same IP address from hundreds of data centers globally. Routers naturally direct packets to the closest physical PoP."
      }
    ],
    codingChallenge: {
      title: "DNS Cache with TTL Expiry",
      description: "Implement a simulated DNS resolver cache with TTL-based expiration.",
      language: "python",
      starterCode: `import time

class DnsCache:
    def __init__(self):
        self.store = {} # domain -> (ip, expiry_timestamp)

    def set_record(self, domain: str, ip: str, ttl_seconds: int):
        pass

    def resolve(self, domain: str):
        # Return IP if valid, None if expired or missing
        pass
`,
      solutionCode: `import time

class DnsCache:
    def __init__(self):
        self.store = {}

    def set_record(self, domain: str, ip: str, ttl_seconds: int):
        self.store[domain] = (ip, time.time() + ttl_seconds)

    def resolve(self, domain: str):
        if domain in self.store:
            ip, expiry = self.store[domain]
            if time.time() < expiry:
                return ip
            del self.store[domain]
        return None
`,
      hint: "Store time.time() + ttl_seconds and delete record if current time exceeds expiry."
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: "How does Route 53 execute Latency-Based Routing?",
        answer: "AWS maintains ongoing latency probe measurements between user IP networks worldwide and all AWS regions. When a DNS request arrives, Route 53 inspects the client subnet (via EDNS Client Subnet) and returns the public IP of the region offering the lowest historical latency."
      }
    ],
    resources: [
      { title: "DNS and BIND (5th Edition)", type: "Book", authorOrSource: "Cricket Liu, Paul Albitz" }
    ]
  },

  'cn-5': {
    id: 'cn-5',
    title: 'Sockets & WebSockets',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Full-Duplex WebSockets & Real-Time Connection Scaling

WebSockets provide persistent, low-overhead bidirectional communication over a single TCP connection.

---

## 1. WebSocket Upgrade Handshake
Begins as a standard HTTP/1.1 request:
\`\`\`http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
\`\`\`
Server responds with \`101 Switching Protocols\`. Subsequent communication shifts to framed WebSocket binary packets (2–10 byte overhead vs 500+ bytes for HTTP headers).
`,
    quizzes: [
      {
        id: 'cn5-q1',
        question: "Why does scaling to 1,000,000 concurrent WebSocket connections require tuning the Linux OS `ulimit -n` and Epoll?",
        options: [
          "Sockets use excessive CPU clock cycles",
          "Each open TCP socket is an open file descriptor in Linux; default limits (1024) drop new connections, and Epoll is needed for O(1) event notification",
          "WebSockets require GPU acceleration",
          "Linux does not support IP addresses"
        ],
        correctAnswerIndex: 1,
        explanation: "In Linux, sockets are file descriptors. Serving 1M connections requires bumping `fs.file-max` and using Epoll event loops to avoid O(N) polling."
      }
    ],
    codingChallenge: {
      title: "WebSocket Sec-WebSocket-Accept Calculator",
      description: "Compute the Sec-WebSocket-Accept response header given the client Sec-WebSocket-Key following RFC 6455.",
      language: "python",
      starterCode: `import hashlib
import base64

GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def compute_accept_key(client_key: str) -> str:
    # SHA-1 of (client_key + GUID), then base64 encoded
    pass
`,
      solutionCode: `import hashlib
import base64

GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def compute_accept_key(client_key: str) -> str:
    combined = (client_key + GUID).encode('utf-8')
    sha1_hash = hashlib.sha1(combined).digest()
    return base64.b64encode(sha1_hash).decode('utf-8')
`,
      hint: "Concatenate client key with standard RFC GUID, compute sha1 digest, then base64 encode."
    },
    interviewQuestions: [
      {
        companyTag: 'Slack',
        question: "How do you broadcast messages across 50,000 WebSocket server instances when users are connected to different servers?",
        answer: "Use Redis Pub/Sub or Apache Kafka as a backplane event bus. When a user posts a message to Channel X on Server 12, Server 12 publishes to `channel:X`. All WebSocket servers subscribed to `channel:X` receive the event and push it locally to their connected client sockets."
      }
    ],
    resources: [
      { title: "RFC 6455: The WebSocket Protocol", type: "RFC", authorOrSource: "IETF" }
    ]
  },

  'cn-6': {
    id: 'cn-6',
    title: 'Network Security: TLS, CORS, XSS & CSRF',
    estimatedReadingTime: '24 mins',
    contentMarkdown: `
# Application & Network Security: TLS 1.3, CORS, XSS & CSRF

Security fundamentals required for securing production web architectures.

---

## 1. Threat & Mitigation Matrix

| Vulnerability | Mechanism | Attack Vector | SDE-2 Defense |
| :--- | :--- | :--- | :--- |
| **XSS (Cross-Site Scripting)** | Malicious JavaScript executed in user browser | Injected via unsanitized input or reflected URLs | Content Security Policy (\`CSP\`), HTML entity escaping, \`HttpOnly\` cookies |
| **CSRF (Cross-Site Request Forgery)**| Malicious site tricks authenticated browser into issuing unauthorized POST | \`<img src="bank.com/transfer?amt=1000">\` | **SameSite=Strict** cookies, Anti-CSRF Synchronizer Tokens |
| **CORS Misconfiguration** | \`Access-Control-Allow-Origin: *\` with credentials | Exposes internal API data to third-party domains | Explicit origin whitelisting without wildcard credentials |
`,
    quizzes: [
      {
        id: 'cn6-q1',
        question: "Why does setting the `HttpOnly` flag on session cookies mitigate XSS impact?",
        options: [
          "It encrypts the network packets",
          "It prevents client-side JavaScript (`document.cookie`) from accessing the cookie, stopping attackers from stealing tokens via injected scripts",
          "It forces the cookie to expire in 1 hour",
          "It restricts the cookie to GET requests"
        ],
        correctAnswerIndex: 1,
        explanation: "HttpOnly instructs browsers that the cookie cannot be read via `document.cookie`, neutralizing session theft via XSS."
      }
    ],
    codingChallenge: {
      title: "CORS Origin Validator",
      description: "Write an origin validation function that matches incoming request origins against an allowed domain pattern list.",
      language: "python",
      starterCode: `def is_origin_allowed(origin: str, allowed_domains: list) -> bool:
    # allowed_domains: ["example.com", "*.company.org"]
    # Return True if origin matches exact or wildcard rule
    pass
`,
      solutionCode: `import fnmatch

def is_origin_allowed(origin: str, allowed_domains: list) -> bool:
    # Strip protocol if present
    clean_origin = origin.replace("https://", "").replace("http://", "").split(":")[0]
    for pattern in allowed_domains:
        clean_pat = pattern.replace("https://", "").replace("http://", "")
        if fnmatch.fnmatch(clean_origin, clean_pat):
            return True
    return False
`,
      hint: "Use fnmatch to handle wildcard patterns like *.company.org."
    },
    interviewQuestions: [
      {
        companyTag: 'Stripe',
        question: "How does TLS 1.3 achieve zero-roundtrip (0-RTT) resumption and what security risk does it introduce?",
        answer: "0-RTT allows clients resuming a connection to send application data in the very first packet using a pre-shared key (PSK). The risk is Replay Attacks: an eavesdropper can intercept and retransmit the 0-RTT packet. To mitigate, servers must reject 0-RTT for non-idempotent HTTP methods (e.g. POST charges)."
      }
    ],
    resources: [
      { title: "OWASP Top 10 Web Application Security Risks", type: "Documentation", authorOrSource: "OWASP Foundation" }
    ]
  },

  'cn-7': {
    id: 'cn-7',
    title: 'Load Balancers & Proxies',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Reverse Proxies & L4/L7 Load Balancers: Nginx, HAProxy & Envoy

Understanding the proxy mechanics that terminate TLS, buffer uploads, and balance upstream clusters.

---

## 1. Forward Proxy vs Reverse Proxy
- **Forward Proxy (Client-Side)**: Sits in front of clients (e.g. corporate VPN). Hides client IPs from servers.
- **Reverse Proxy (Server-Side)**: Sits in front of servers. Hides server infrastructure from clients. Provides caching, rate limiting, and SSL offloading.
`,
    quizzes: [
      {
        id: 'cn7-q1',
        question: "Why should SSL/TLS termination be offloaded to reverse proxies (Nginx/Envoy) in front of application instances?",
        options: [
          "Application code cannot perform cryptography",
          "TLS asymmetric math is CPU intensive; centralized proxies handle handshakes efficiently and reuse persistent unencrypted TCP/HTTP connections to internal app backends",
          "Certificates only work on proxies",
          "It eliminates the need for firewalls"
        ],
        correctAnswerIndex: 1,
        explanation: "Offloading TLS isolates heavy cryptographic computation to optimized edge proxies, allowing application pods to focus entirely on business logic."
      }
    ],
    codingChallenge: {
      title: "Weighted Round Robin Balancer",
      description: "Implement a weighted round-robin server selector where servers with higher weights receive proportionally more requests.",
      language: "python",
      starterCode: `class WeightedBalancer:
    def __init__(self, servers_weights: dict):
        # {"S1": 3, "S2": 1}
        pass

    def next_server(self) -> str:
        pass
`,
      solutionCode: `class WeightedBalancer:
    def __init__(self, servers_weights: dict):
        self.pool = []
        for server, weight in servers_weights.items():
            self.pool.extend([server] * weight)
        self.idx = 0

    def next_server(self) -> str:
        if not self.pool:
            return None
        server = self.pool[self.idx]
        self.idx = (self.idx + 1) % len(self.pool)
        return server
`,
      hint: "Populate a list repeating each server proportional to its weight, then cycle through with modulo."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "Why did modern cloud infrastructure shift from Nginx to Envoy as the preferred sidecar proxy?",
        answer: "Envoy was built from scratch for dynamic microservices: it supports dynamic discovery APIs (xDS: LDS, RDS, CDS, EDS) allowing routing, cluster endpoints, and TLS certs to update dynamically in memory without restarting the process or dropping connections."
      }
    ],
    resources: [
      { title: "Envoy Architecture Overview", type: "Documentation", authorOrSource: "Envoy Project" }
    ]
  },

  'cn-8': {
    id: 'cn-8',
    title: 'CDNs & Edge Computing',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# Content Delivery Networks (CDNs) & Edge Computing

Moving static and dynamic computation to Points of Presence (PoPs) within 10ms of end users.

---

## 1. Cache-Control Header Directives
- \`public\`: Can be cached by browser and intermediate CDNs.
- \`private\`: Can ONLY be cached by the end user's browser.
- \`no-cache\`: Must revalidate with origin server via \`ETag\` before serving.
- \`no-store\`: Do not cache anywhere (sensitive banking data).
- \`s-maxage=86400\`: Overrides max-age specifically for shared caches (CDNs).
`,
    quizzes: [
      {
        id: 'cn8-q1',
        question: "What does the `Cache-Control: no-cache` directive actually tell the browser and CDN to do?",
        options: [
          "Never store the file on disk",
          "Store the file in cache, but ALWAYS send a conditional request (with ETag or If-Modified-Since) to the origin server before serving it",
          "Delete the file immediately",
          "Only cache for 1 second"
        ],
        correctAnswerIndex: 1,
        explanation: "Contrary to common belief, `no-cache` does store the asset in cache, but mandates revalidation with origin before each use."
      }
    ],
    codingChallenge: {
      title: "ETag Conditional Validator",
      description: "Write a function that validates an incoming If-None-Match header against the current resource ETag and returns 304 Not Modified if matching.",
      language: "python",
      starterCode: `def handle_conditional_request(if_none_match: str, current_etag: str) -> int:
    # Return 304 if matches; 200 if modified or header missing
    pass
`,
      solutionCode: `def handle_conditional_request(if_none_match: str, current_etag: str) -> int:
    if not if_none_match:
        return 200
    # Strip weak ETag prefix 'W/' if present
    clean_client = if_none_match.strip().lstrip("W/").strip('"')
    clean_current = current_etag.strip().lstrip("W/").strip('"')
    return 304 if clean_client == clean_current else 200
`,
      hint: "Compare cleaned ETag strings; return 304 if equal."
    },
    interviewQuestions: [
      {
        companyTag: 'Cloudflare',
        question: "How do you invalidate a cached asset across 300 global CDN PoPs in under 150 milliseconds?",
        answer: "Instead of invalidating each file path individually, use Cache Tags (Surrogate Keys). When generating content, attach tags (e.g., `Cache-Tag: product-1234`). When the product updates, publish a purge message to a globally distributed in-memory pub/sub mesh (using Bloom filter summaries at edge nodes) to invalidate matching tags."
      }
    ],
    resources: [
      { title: "High Performance Browser Networking (Ch. 10)", type: "Book", authorOrSource: "Ilya Grigorik" }
    ]
  },

  'cn-9': {
    id: 'cn-9',
    title: 'REST vs GraphQL vs gRPC',
    estimatedReadingTime: '22 mins',
    contentMarkdown: `
# API Paradigms: REST vs GraphQL vs gRPC

Choosing the optimal serialization, transport, and contract protocol for public vs internal APIs.

---

## 1. Architectural Comparison

| Dimension | REST (JSON / HTTP 1.1) | GraphQL (JSON / HTTP) | gRPC (Protobuf / HTTP/2) |
| :--- | :--- | :--- | :--- |
| **Best For** | Public developer APIs | Complex mobile clients with nested views | Internal high-throughput microservices |
| **Payload Size** | Large (redundant JSON keys) | Variable (client specifies fields) | **Minimal (binary Protocol Buffers)** |
| **Over/Under Fetching**| High (fixed endpoint schemas) | **Zero (exact field query)** | Zero |
| **Streaming** | Server-Sent Events (SSE) | Subscriptions (WebSockets) | **Native Bi-directional Streaming** |
| **Contract** | OpenAPI / Swagger (optional) | Strict GraphQL Schema Definition | **Strict .proto IDL compiler** |
`,
    quizzes: [
      {
        id: 'cn9-q1',
        question: "Why is gRPC significantly faster than REST/JSON for inter-service communication inside data centers?",
        options: [
          "gRPC avoids using TCP",
          "Protocol Buffers serialize into compact binary without text encoding, and HTTP/2 multiplexes requests over persistent sockets with header compression (HPACK)",
          "gRPC only works in Python",
          "JSON is blocked by firewalls"
        ],
        correctAnswerIndex: 1,
        explanation: "Binary Protobuf encoding is 5-10x faster to serialize than JSON strings, and HTTP/2 eliminates handshake overhead via multiplexing."
      }
    ],
    codingChallenge: {
      title: "Protobuf Varint Decoder",
      description: "Decode an integer encoded with Protocol Buffers 7-bit variable-length encoding (Varint).",
      language: "python",
      starterCode: `def decode_varint(varint_bytes: bytes) -> int:
    # Each byte has 7 bits of data; MSB indicates if more bytes follow
    pass
`,
      solutionCode: `def decode_varint(varint_bytes: bytes) -> int:
    res = 0
    shift = 0
    for b in varint_bytes:
        res |= (b & 0x7F) << shift
        if not (b & 0x80):
            break
        shift += 7
    return res
`,
      hint: "Iterate bytes, mask off the MSB (b & 0x7F), shift by 7 bits each iteration, and break when MSB is 0."
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: "When would you intentionally choose REST over gRPC for an external client-facing API?",
        answer: "Choose REST when building third-party public developer APIs. Standard web browsers, curl, Postman, and HTTP CDNs natively cache GET requests. gRPC requires generated client stubs and does not cache naturally on public CDNs."
      }
    ],
    resources: [
      { title: "gRPC: Up and Running", type: "Book", authorOrSource: "Kasun Indrasiri, Danesh Kuruppu" }
    ]
  },

  'cn-10': {
    id: 'cn-10',
    title: 'Network Troubleshooting Tools',
    estimatedReadingTime: '20 mins',
    contentMarkdown: `
# Linux Network Diagnostics: tcpdump, netstat, ss & traceroute

How SDE-2 engineers debug real-world production network anomalies in production environments.

---

## 1. Diagnostic Command Toolkit
- \`ss -tulpn\`: Inspect active listening sockets, socket states (ESTABLISHED, CLOSE_WAIT), and PID owners.
- \`tcpdump -i eth0 -nn 'port 443'\`: Capture live raw packet headers passing through network interfaces.
- \`traceroute -T -p 443 host\`: Discovers routing hops using ICMP or TCP SYN packets with incrementing TTLs.
- \`mtr host\`: Continuous traceroute + ping analyzing packet loss at intermediate ISP routers.
`,
    quizzes: [
      {
        id: 'cn1-q2',
        question: "How does `traceroute` discover the IP addresses of intermediate routers along a network path?",
        options: [
          "It asks the destination router for its routing table",
          "It sends packets with incrementing Time-To-Live (TTL = 1, 2, 3...); each router decrements TTL, drops the packet when TTL reaches 0, and returns an ICMP Time Exceeded message containing its IP",
          "It reads DNS PTR records",
          "It connects to port 80 on every router"
        ],
        correctAnswerIndex: 1,
        explanation: "Traceroute sends packets starting with TTL=1. Each intermediate router decrements TTL, drops it at 0, and emits an ICMP Time Exceeded packet back to source."
      }
    ],
    codingChallenge: {
      title: "Subnet IP Range Calculator",
      description: "Given an IPv4 CIDR string (e.g. '192.168.1.0/24'), calculate total usable host IP addresses.",
      language: "python",
      starterCode: `def usable_hosts(cidr: str) -> int:
    # Host count = 2^(32 - prefix) - 2 (subtract network and broadcast)
    pass
`,
      solutionCode: `def usable_hosts(cidr: str) -> int:
    prefix = int(cidr.split('/')[1])
    if prefix >= 31:
        return 0
    host_bits = 32 - prefix
    return (2 ** host_bits) - 2
`,
      hint: "Usable hosts = 2^(32 - prefix) - 2."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "If a server's sockets are accumulating thousands of connections in CLOSE_WAIT state, what is the root cause?",
        answer: "CLOSE_WAIT means the remote peer sent a FIN packet and closed their side of the socket, but the LOCAL application code failed to call `close()` on the socket descriptor. It is an application-level bug (e.g. hanging thread pool or leaking unclosed HTTP response streams)."
      }
    ],
    resources: [
      { title: "Linux Observability with BPF", type: "Book", authorOrSource: "David Calavera, Lorenzo Fontana" }
    ]
  },

  'cn-11': {
    id: 'cn-11',
    title: 'FAANG Interview: Design a Global CDN',
    estimatedReadingTime: '26 mins',
    contentMarkdown: `
# FAANG System Design: Global Content Delivery Network (Akamai / Cloudflare)

A premier SDE-2 system design interview scenario testing routing, cache clustering, and live invalidation at scale.

---

## 1. System Architecture: Distributed Edge Topology

\`\`\`
Client (London) ──► London Edge PoP (BGP Anycast)
                          │
                   Hit: Returns in 2ms
                   Miss: Fetch from Tier-2 Regional Shield (Dublin)
                                │
                         Hit: Returns in 15ms
                         Miss: Fetch from Origin Server (US-East AWS S3)
\`\`\`

---

## 2. Key Architecture Components
1. **BGP Anycast Routing**: Directs client requests to nearest PoP.
2. **Two-Tier Caching Hierarchy**: Edge PoPs check regional origin shields before hammering the central data store.
3. **Consistent Hashing at Edge**: Ensures repeated requests for the same video/asset hash to the same edge server memory.
4. **Instant Purge Mesh**: Low-latency event bus broadcasting invalidation tokens to all PoPs.
`,
    quizzes: [
      {
        id: 'cn11-q1',
        question: "Why do global CDNs use Origin Shields between Edge PoPs and customer origin servers?",
        options: [
          "To translate IPv4 to IPv6",
          "To collapse cache misses from hundreds of global edge PoPs into a single intermediate cache tier, preventing origin server overload",
          "To run WebAssembly programs",
          "To bypass BGP routing"
        ],
        correctAnswerIndex: 1,
        explanation: "Origin shields aggregate cache misses across dozens of peripheral PoPs, drastically reducing origin egress and CPU load."
      }
    ],
    codingChallenge: {
      title: "CDN Cache Hit Ratio Tracker",
      description: "Implement a sliding metrics window that calculates the cache hit ratio percentage over recent requests.",
      language: "python",
      starterCode: `class CdnMetrics:
    def __init__(self):
        self.hits = 0
        self.misses = 0

    def record_hit(self):
        pass

    def record_miss(self):
        pass

    def hit_ratio_pct(self) -> float:
        # Return percentage rounded to 2 decimal places
        pass
`,
      solutionCode: `class CdnMetrics:
    def __init__(self):
        self.hits = 0
        self.misses = 0

    def record_hit(self):
        self.hits += 1

    def record_miss(self):
        self.misses += 1

    def hit_ratio_pct(self) -> float:
        total = self.hits + self.misses
        if total == 0:
            return 0.0
        return round((self.hits / total) * 100, 2)
`,
      hint: "Hit ratio = (hits / total) * 100."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "How does Netflix Open Connect deploy hardware appliances directly inside ISP networks?",
        answer: "Netflix partners with global ISPs to install custom Open Connect Appliances (OCAs) directly inside internet service provider exchange points. Overnight during low network usage, OCA boxes pre-fetch tomorrow's anticipated popular video chunks, serving 95%+ of video traffic locally from within the user's ISP."
      }
    ],
    resources: [
      { title: "Netflix Open Connect Architecture", type: "Engineering Blog", authorOrSource: "Netflix Technology Blog" }
    ]
  },

  'cn-12': {
    id: 'cn-12',
    title: 'FAANG Interview: Video Streaming Architecture',
    estimatedReadingTime: '28 mins',
    contentMarkdown: `
# FAANG System Design: Video Streaming at Scale (YouTube / Netflix)

How modern platforms stream petabytes of video data using chunked encoding and Adaptive Bitrate Streaming (ABR).

---

## 1. System Architecture: Transcoding & Chunked Delivery

\`\`\`
Video Upload (Raw 4K ProRes 100GB)
               │
               ▼
┌───────────────────────────────┐
│ Chunking & Ingestion Service  │  Splits video into 2-6 second chunks (.m4s / .ts)
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│ Distributed Transcoder Worker │  Parallel transcode to 1080p, 720p, 480p, 360p
│ (H.264 / H.265 / AV1)         │  Generates MPD (DASH) & M3U8 (HLS) Manifests
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│ Cloud Storage & Edge CDNs     │  Edge PoPs cache popular video chunks
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│ Video Player (Client Browser) │  Adaptive Bitrate (ABR) algorithm shifts quality!
└───────────────────────────────┘
\`\`\`

---

## 2. Adaptive Bitrate Streaming (HLS & MPEG-DASH)
- Video is fragmented into small chunks (typically 2 to 6 seconds each).
- The player fetches a **Manifest File** (e.g. \`master.m3u8\`) listing available bitrates and chunk URLs.
- The player dynamically measures download speed and buffer occupancy:
  - If buffer is full and bandwidth is high $\\to$ fetch 4K/1080p chunk.
  - If network drops to 3G $\\to$ drop immediately to 480p chunk without interrupting playback!
`,
    quizzes: [
      {
        id: 'cn12-q1',
        question: "Why does Adaptive Bitrate Streaming (HLS/DASH) divide video files into 2-6 second chunks rather than streaming a single MP4 file?",
        options: [
          "MP4 files cannot be encrypted",
          "Chunking allows the client player to switch resolution dynamically between segments without buffering as network throughput changes",
          "Web browsers cannot download files larger than 10MB",
          "TCP cannot stream video"
        ],
        correctAnswerIndex: 1,
        explanation: "By breaking video into independent multi-second segments at varying bitrates, players seamlessly adjust video quality mid-playback as network conditions fluctuate."
      }
    ],
    codingChallenge: {
      title: "Adaptive Bitrate Selector",
      description: "Implement a client-side ABR algorithm that selects the highest video bitrate feasible given measured bandwidth with a 20% safety margin.",
      language: "python",
      starterCode: `def select_bitrate(measured_kbps: int, available_profiles: dict) -> str:
    # available_profiles = {"1080p": 5000, "720p": 2500, "480p": 1000, "360p": 500}
    # Pick highest resolution whose required kbps <= measured_kbps * 0.8
    pass
`,
      solutionCode: `def select_bitrate(measured_kbps: int, available_profiles: dict) -> str:
    safe_bandwidth = measured_kbps * 0.8
    # Sort profiles by bitrate descending
    sorted_profiles = sorted(available_profiles.items(), key=lambda x: x[1], reverse=True)
    for profile, req_kbps in sorted_profiles:
        if req_kbps <= safe_bandwidth:
            return profile
    # Return lowest if none fit
    return sorted_profiles[-1][0]
`,
      hint: "Sort available profiles descending; select the first one where req_kbps <= measured_kbps * 0.8."
    },
    interviewQuestions: [
      {
        companyTag: 'Netflix',
        question: "How does Netflix optimize video encoding per-title and per-shot rather than using a static bitrate ladder?",
        answer: "Static bitrates waste bandwidth on low-motion scenes (e.g. talking heads) and under-allocate to high-action scenes. Netflix uses Per-Title and Dynamic Optimizer encoding: each video shot is analyzed for spatial detail and temporal motion, generating a customized convex Pareto-optimal bitrate curve that cuts bandwidth by 25-30% while improving video quality."
      }
    ],
    resources: [
      { title: "Dynamic Optimizer: A Per-Shot Optimization Framework", type: "Engineering Blog", authorOrSource: "Netflix Technology Blog" }
    ]
  }
};
