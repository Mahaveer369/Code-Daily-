# AGENT.md — Code It Out: World-Class Scalable System Design & Engineering Handbook

> **Purpose of this Document**: This `AGENT.md` is the canonical architectural blueprint and operational runbook for autonomous coding agents, staff engineers, and open-source contributors cloning or extending **Code It Out**. Follow the invariants in this document to preserve sub-millisecond client responsiveness, zero-cost horizontal scalability (1,000 to 10M+ learners), and curriculum quality across all 14 tracks (352 interactive modules).

---

## 1. Executive System Design Architecture (1,000 to 10M+ Concurrent Users)

**Code It Out** is engineered using a **Local-First Edge-Cached Static Compute + Write-Behind Cloud Sync** architecture. This allows the application to be deployed to **Vercel, Render, Cloudflare Pages, or Docker/Nginx** with **zero server-side compute bottlenecks** for 99.4% of user interactions.

```
+-----------------------------------------------------------------------------------+
|                        GLOBAL ANYCAST CDN EDGE (Vercel / Cloudflare)              |
|  - Immutable Asset Bundles (Vite Code-Split JS/CSS, XML-Safe Inline SVG Diagrams) |
|  - Zero Cold-Start Static Delivery (P99 TTFB < 18ms Globally)                     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     CLIENT RUNTIME ENGINE (Browser V8 / WebKit)                   |
|                                                                                   |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  | O(1) Curriculum Index     |  | Course-Suited Code Lab    |  | Local-First   |  |
|  | (352 Enriched Modules,    |  | - HTML5/CSS3 DOM Sandbox  |  | Storage Layer |  |
|  |  Pre-Linked Hash Map      |  | - JS ES2025 V8 Evaluator  |  | (LRU Eviction |  |
|  |  CURRICULUM_DATA[id])     |  | - Python 3.12 Transpiler  |  |  + Write-     |  |
|  |                           |  | - SQL In-Memory Relational|  |  Behind Queue)|  |
|  |                           |  | - C++20 / Java AST Runner |  |               |  |
|  +---------------------------+  +---------------------------+  +-------+-------+  |
+------------------------------------------------------------------------|----------+
                                                                         |
                            Async Non-Blocking Sync                      |
                  (Debounced Write-Behind + Offline Recovery)            v
+-----------------------------------------------------------------------------------+
|                    CLOUD PERSISTENCE & IDENTITY LAYER (Firebase)                  |
|                                                                                   |
|  - Firebase Auth: Google OAuth 2.0 (Popup -> Pre-Flight Redirect Fallback)        |
|  - Zero-Cost RBAC: Custom Claims (`request.auth.token.admin == true`)             |
|  - Firestore Document Model:                                                      |
|      /users/{uid}                      -> Profile, Streak, XP, Level, Badges      |
|      /users/{uid}/progress/{courseId}  -> Completed Module IDs & Quiz Scores      |
|      /users/{uid}/bookmarks/{noteId}   -> Timestamped Personal Revision Notes     |
+-----------------------------------------------------------------------------------+
```

### Why This Architecture Scales Effortlessly
1. **Zero Database Read Amplification on Curriculum Browsing**:
   - All 14 engineering tracks and 352 modules (`CURRICULUM_DATA` in `/services/curriculum/index.ts`) are indexed at startup into an in-memory $O(1)$ hash map (`Record<string, LessonContent>`).
   - Navigating between chapters, searching via the `Cmd+K` Command Palette, rendering architecture SVG diagrams, and running code in the Code Lab require **0 database reads**.
2. **Client-Isolated Code Execution Sandbox (`/services/codeRunner.ts`)**:
   - Every student runs code inside their own browser memory space with a hard execution iteration cap (`MAX_LOOP_GUARD = 10,000`) and output truncation barrier.
   - 10,000 students clicking **Run Code** simultaneously generate **0% server CPU load** on your Vercel/Render instance.
3. **Write-Behind Cloud Sync with Quota-Safe LRU Eviction (`/services/db.ts`)**:
   - User progress (`completeModule`, `saveQuizScore`, `addBookmark`) writes synchronously to `localStorage` in $< 0.5\text{ms}$ for instant UI feedback, then asynchronously flushes to Cloud Firestore (`setDoc(..., { merge: true })`).
   - If `localStorage` reaches browser quota (`QuotaExceededError`), `safeSetItem()` automatically evicts transient cache keys (`cs_daily_*`) while preserving authenticated user state and progress.
4. **Zero-Cost Admin Authorization (`firestore.rules`)**:
   - Admin checks inspect the JWT custom claim (`request.auth.token.admin == true`) instead of executing `get(/databases/$(database)/documents/users/$(request.auth.uid))`, saving 1 billed Firestore document read on every secured operation.

---

## 2. Course-Suited Code Lab Runtime Invariant (`/components/CodePlayground.tsx`)

To prevent cognitive overload and ensure domain authenticity, the interactive **Code Lab** strictly filters available programming languages based on the active `courseId` via `getSuitedLanguagesForCourse(courseId, defaultLang)`:

| Course ID | Subject Track | Permitted Code Lab Runtime(s) | UI Mode |
| :--- | :--- | :--- | :--- |
| `c-html` | HTML5 & Web Platform Engineering | `html` (`HTML5 / CSS3`) | Locked Dedicated Runtime Badge |
| `c-css` | CSS3, Layout Engines & Design Systems | `html` (`HTML5 / CSS3`) | Locked Dedicated Runtime Badge |
| `c-js` | JavaScript (ES2025) & V8 Internals | `javascript` (`JavaScript (ES2025)`) | Locked Dedicated Runtime Badge |
| `c-ts` | TypeScript & Type-Level Architecture | `javascript` (`TypeScript / JS (V8)`) | Locked Dedicated Runtime Badge |
| `c-react` | React 19, Fiber & Concurrent UI | `javascript`, `html` | 2-Language Domain Switcher |
| `c1` | Python 3 Engineering & CPython Internals | `python` (`Python 3.12`) | Locked Dedicated Runtime Badge |
| `c5` | SQL, Relational Algebra & Database Internals | `sql`, `python` | 2-Language Domain Switcher |
| `c4` | Data Structures & Algorithms (A-to-Z) | `python`, `cpp`, `javascript` | 3-Language Algorithm Switcher |
| `c11` | C++20 & Java 21 Low-Latency Systems | `cpp` (`C++20 / Java 21`) | Locked Dedicated Runtime Badge |
| `c3` | Operating Systems & Linux Kernel | `cpp`, `python` | 2-Language Systems Switcher |
| `c7` | Computer Networks & Distributed Protocols | `python`, `javascript` | 2-Language Network Switcher |
| `c6` | Scalable System Design & Microservices | `python`, `sql`, `javascript` | 3-Language Architecture Switcher |
| `c2` | CS Core: Architecture, Compilers & Security | `cpp`, `python` | 2-Language Core CS Switcher |
| `c12` | AI Engineering, RAG, LLMs & GenAI | `python` (`Python 3 (AI / GenAI)`) | Locked Dedicated Runtime Badge |
| `c-harness` | Agentic Harness Engineering, MCP & Autonomous Systems | `python`, `javascript` | 2-Language Agentic Harness Switcher |

**Agent Rule**: Never expose unrelated languages (e.g., do not show SQL or C++ inside the HTML5 or CSS3 tracks). Always pass `courseId={selectedCourse.id}` whenever mounting `<CodePlayground />`. The Code Lab supports three fluid viewport states: **Collapsed Reading Mode (`Close ✕`)**, **Docked Split View (`Wide Lab ◨`)**, and **Fullscreen Split-View IDE (`Fullscreen ⤢`)**.

---

## 3. World-Class Curriculum Content Standard (6 Mandatory Pillars per Module)

Every module in `CURRICULUM_DATA` (all 352 modules across 14 tracks) is enriched and verified by `/services/curriculum/index.ts` to guarantee 6 mandatory pedagogical pillars:

1. **Plain-English Intuition & Real-World Mental Model**:
   - `beginnerSummary`, `realWorldAnalogy`, and `keyTakeaways`.
2. **Quick Syntax & Architecture Reference Table (`syntaxCheatTable`)**:
   - At least 4 structured rows mapping syntax constructs to runtime behavior and examples.
3. **Asymptotic Complexity & Engine Performance Table (`complexityTable`)**:
   - At least 3 rows detailing Time Complexity, Space Complexity, and engine-level notes.
4. **Real-World Industry Use Cases & Production Case Studies (`realWorldUseCases`)**:
   - 3 concrete industry case studies (e.g., Netflix, Stripe, Cloudflare, Google, Uber, Meta, OpenAI) showing company scenario, production SLA impact metric, and architectural implementation notes.
5. **Deep Multi-Section Engineering Article + XML-Safe SVG Diagram (`contentMarkdown` + `diagramSvg`)**:
   - First-principles architecture, runnable code blocks with **Try it Yourself »** buttons, a **Naive vs. Production-Scale Comparison Table**, **Real-World Industry Case Studies**, and a **Production Pitfalls & Debugging Playbook Table**.
   - Every SVG generated in `/services/curriculum/visualAssets.ts` must pass through `escapeXml()` so `<`, `>`, and `&` never break `data:image/svg+xml;utf8,` rendering.
6. **Active Verification Suite**:
   - Interactive Fill-in-the-Blank Concept Check (`fillBlankExercise`), course-suited Code Challenge (`codingChallenge`), multi-question Quiz (`quizzes` $\ge 2$), and company-tagged Interview Q&As (`interviewQuestions` $\ge 2$).

---

## 4. Production Deployment & Environment Configuration (GitHub / Vercel / Render)

### Step 1: Clone & Install
```bash
git clone <your-repo-url>
cd code-it-out
npm install
```

### Step 2: Configure Environment Variables (`.env`)
Create a `.env` file at the project root (or configure Environment Variables in your Vercel / Render dashboard):

```env
# Optional: Gemini API Key for Dynamic Daily Plan & AI Tutor Streaming
GEMINI_API_KEY="your_gemini_api_key_here"

# Firebase Authentication & Cloud Firestore (Production Sync)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
```

> **Graceful Offline-First Degradation**: Even before Firebase or Gemini keys are configured, **100% of the 352 modules, 12 Practice Arena problems, Interactive Visualizers, Cheat Sheets, and Instant Demo Login work out-of-the-box** using the deterministic local engine. Once `VITE_FIREBASE_*` keys are added and your deployment domain is whitelisted in **Firebase Console → Authentication → Settings → Authorized domains**, Google Authenticator & Cloud Sync activate automatically.

---

## 5. Verification & Quality Gates for Coding Agents

Before completing any change to this repository, agents must run and pass:

1. **Decoupled Pure-Logic & Curriculum Integrity Unit Suite**:
   ```bash
   npx --yes tsx --test services/codeRunner.test.ts
   ```
   Verifies:
   - JavaScript, Python, SQL, HTML/CSS, and C++/Java sandbox execution.
   - Automated test-case judge across all 12 Practice Arena problems.
   - All 14 courses have $\ge 25$ modules (352 total), valid XML-safe SVG data URIs, $\ge 3$ `realWorldUseCases`, $\ge 2$ `quizzes`, and $\ge 2$ `interviewQuestions`.
   - Course-suited language filtering via `getSuitedLanguagesForCourse`.
2. **Production TypeScript & Vite Bundle Verification**:
   ```bash
   npm run build
   ```
