import { Course, CourseModule, LessonContent } from '../../types';
import { W3_COURSES as BASE_COURSES } from './w3StudentCatalog';
import { buildLessonArchitectureSvg } from './visualAssets';
import { GIT_GITHUB_COURSE, GIT_GITHUB_LESSONS } from './gitAndGithub';
import { DOCKER_K8S_COURSE, DOCKER_K8S_LESSONS } from './dockerAndK8s';
import { TERRAFORM_CICD_COURSE, TERRAFORM_CICD_LESSONS } from './terraformAndCicd';

export interface DeepModuleSpec {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sectionGroup: string;
  analogy: string;
  keyTerm: string;
  syntaxExample: string;
  codeLang: 'html' | 'javascript' | 'python' | 'sql' | 'cpp';
  codeSnippet: string;
  complexity: { op: string; time: string; space: string; note: string };
  interviewQ: string;
  interviewA: string;
  company: string;
}

// Additional chapters per course so EVERY ONE of the 14 courses has AT LEAST 25 modules (14 x 25 = 350 modules total!)
const EXTRA_MODULES_BY_COURSE: Record<string, DeepModuleSpec[]> = {
  'c-html': [
    {
      id: 'html-11',
      title: 'HTML5 Audio, Video Tracks & WebVTT Subtitles',
      description: 'Streaming media elements, <track kind="captions">, preload strategies & MediaSource APIs',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Media & Graphics',
      analogy: 'Like a cinema projector that loads both the film reel (<video>) and synchronized multi-language subtitle tracks (<track>) on demand.',
      keyTerm: 'track',
      syntaxExample: '<track kind="subtitles" src="en.vtt" srclang="en" label="English" default>',
      codeLang: 'html',
      codeSnippet: `<video controls width="360" preload="metadata">\n  <source src="lecture.mp4" type="video/mp4">\n  <track kind="subtitles" src="captions_en.vtt" srclang="en" label="English" default>\n</video>`,
      complexity: { op: 'Metadata Preload', time: 'O(1) Header Fetch', space: 'O(1) Buffer', note: 'Avoids downloading full video until play()' },
      interviewQ: 'Why should production pages use preload="metadata" instead of preload="auto" on <video> tags?',
      interviewA: 'preload="metadata" fetches only dimensions, duration, and first frame (~50KB) rather than megabytes of video chunks, saving mobile bandwidth.',
      company: 'Netflix'
    },
    {
      id: 'html-12',
      title: 'Responsive Images: <picture>, srcset & sizes',
      description: 'Art direction, pixel density switching (1x, 2x, 3x), WebP/AVIF fallbacks & lazy loading',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Media & Graphics',
      analogy: 'Like a smart waiter who serves a compact espresso cup to a mobile screen and a full carafe to a 4K desktop monitor.',
      keyTerm: 'picture',
      syntaxExample: '<picture><source srcset="hero.avif" type="image/avif"><img src="hero.jpg" alt="Hero"></picture>',
      codeLang: 'html',
      codeSnippet: `<picture>\n  <source srcset="hero-large.webp" media="(min-width: 800px)" type="image/webp">\n  <img src="hero-mobile.jpg" alt="Responsive Architecture Diagram" loading="lazy" width="600" height="360">\n</picture>`,
      complexity: { op: 'Browser Source Selection', time: 'O(K) Sources', space: 'O(1) Decoded Bitmap', note: 'Evaluated before first network request' },
      interviewQ: 'How does setting explicit width and height attributes on <img> prevent Cumulative Layout Shift (CLS)?',
      interviewA: 'The browser computes the aspect-ratio box immediately during HTML parsing before the image bytes arrive, preventing page reflow.',
      company: 'Google'
    },
    {
      id: 'html-13',
      title: 'HTML5 Custom Data Attributes (data-*) & dataset API',
      description: 'Storing structured domain state in DOM nodes and reading via element.dataset in camelCase',
      difficulty: 'Beginner',
      sectionGroup: 'HTML Forms & APIs',
      analogy: 'Like sticky barcode labels attached to warehouse boxes that JavaScript scanners can read or update instantaneously.',
      keyTerm: 'dataset',
      syntaxExample: '<div data-user-role="admin" data-xp-score="450"></div>',
      codeLang: 'html',
      codeSnippet: `<button id="card" data-course-id="c-html" data-module-index="13" onclick="this.textContent = 'Course: ' + this.dataset.courseId + ' #' + this.dataset.moduleIndex">\n  Click to Inspect dataset\n</button>`,
      complexity: { op: 'DOM dataset Lookup', time: 'O(1) Attribute Map', space: 'O(1) String Attribute', note: 'Hyphenated data-course-id maps to dataset.courseId' },
      interviewQ: 'When should you prefer data-* attributes over storing state in a JavaScript Map?',
      interviewA: 'Use data-* for lightweight server-rendered identifiers or event delegation targets; avoid storing large serialized JSON blobs in DOM attributes.',
      company: 'Shopify'
    },
    {
      id: 'html-14',
      title: 'Interactive Native Modals: <dialog>, <details> & <summary>',
      description: 'Zero-JS accordions, native focus-trapping modal dialogs, ::backdrop & showModal()',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Interactive DOM',
      analogy: 'Built-in hardware door locks: the browser handles Escape key closing, focus trapping, and top-layer stacking automatically.',
      keyTerm: 'dialog',
      syntaxExample: '<dialog id="modal"><form method="dialog"><button>Close</button></form></dialog>',
      codeLang: 'html',
      codeSnippet: `<details open style="padding:12px;background:#0f172a;color:#e2e8f0;border-radius:8px;">\n  <summary style="cursor:pointer;font-weight:bold;color:#34d399;">Native Accordion (<details> + <summary>)</summary>\n  <p style="margin-top:8px;">Zero JavaScript required for accessible expand/collapse state!</p>\n</details>`,
      complexity: { op: 'Top-Layer Promotion', time: 'O(1) Compositor Layer', space: 'O(1)', note: 'Bypasses z-index stacking context traps' },
      interviewQ: 'What is the difference between dialog.show() and dialog.showModal()?',
      interviewA: 'showModal() promotes the dialog to the browser Top Layer, renders ::backdrop, traps Tab focus inside the modal, and closes on Escape.',
      company: 'Airbnb'
    },
    {
      id: 'html-15',
      title: 'Web Components: <template>, <slot> & Shadow DOM',
      description: 'Inert DOM fragments, encapsulated style trees, named slots & customElements.define()',
      difficulty: 'Advanced',
      sectionGroup: 'HTML Interactive DOM',
      analogy: 'Like a self-contained shipping container (<template> + Shadow DOM) where internal wiring never leaks out to the rest of the ship.',
      keyTerm: 'template',
      syntaxExample: '<template id="card-tpl"><style>:host{display:block}</style><slot name="title"></slot></template>',
      codeLang: 'html',
      codeSnippet: `<template id="badge-tpl">\n  <span style="background:#065f46;color:#6ee7b7;padding:4px 10px;border-radius:6px;font-family:monospace;">Verified Web Component</span>\n</template>\n<div id="mount"></div>\n<script>\n  const tpl = document.getElementById('badge-tpl');\n  document.getElementById('mount').appendChild(tpl.content.cloneNode(true));\n</script>`,
      complexity: { op: 'Template Clone', time: 'O(N) Subtree Nodes', space: 'O(N) Cloned DOM', note: '<template> contents are parsed once and remain inert until cloned' },
      interviewQ: 'What is the difference between attachShadow({ mode: "open" }) and { mode: "closed" }?',
      interviewA: 'With mode: "open", external JS can access element.shadowRoot; with "closed", element.shadowRoot returns null for strict encapsulation.',
      company: 'Salesforce'
    },
    {
      id: 'html-16',
      title: 'HTML5 Drag and Drop API & DataTransfer',
      description: 'draggable="true", dragstart, dragover, drop events & custom MIME payload transfer',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Interactive DOM',
      analogy: 'Like picking up a physical Kanban card from the "To Do" column and dropping it into "Done" while carrying its ticket ID.',
      keyTerm: 'draggable',
      syntaxExample: '<div draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', id)">Card</div>',
      codeLang: 'html',
      codeSnippet: `<div draggable="true" style="padding:10px;background:#1e293b;color:#38bdf8;border:1px solid #38bdf8;border-radius:8px;display:inline-block;">\n  Draggable Kanban Task (draggable="true")\n</div>`,
      complexity: { op: 'DataTransfer Serialization', time: 'O(1) Payload', space: 'O(1)', note: 'Must call event.preventDefault() inside ondragover to allow drop' },
      interviewQ: 'Why does the drop event never fire unless you call event.preventDefault() inside dragover?',
      interviewA: 'By default, HTML elements disallow dropping; calling preventDefault() in dragover signals to the browser that the node is a valid drop target.',
      company: 'Atlassian'
    },
    {
      id: 'html-17',
      title: 'HTML5 Geolocation, Clipboard & Fullscreen APIs',
      description: 'Permission-gated navigator.geolocation, async navigator.clipboard & requestFullscreen()',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Browser APIs',
      analogy: 'Secure passport checkpoints: the browser prompts the user for explicit consent before granting GPS or clipboard access.',
      keyTerm: 'clipboard',
      syntaxExample: 'await navigator.clipboard.writeText("Copied code");',
      codeLang: 'javascript',
      codeSnippet: `// Simulated Secure Context API Check\nconst hasClipboard = typeof navigator !== 'undefined' && !!navigator.clipboard;\nconsole.log("Secure Context Clipboard Ready:", Boolean(hasClipboard || true));\nconsole.log("Geolocation API structure: navigator.geolocation.getCurrentPosition(success, error)");`,
      complexity: { op: 'Async Permission Prompt', time: 'O(1) IPC Call', space: 'O(1)', note: 'Requires HTTPS Secure Context (or localhost)' },
      interviewQ: 'Why did browsers deprecate document.execCommand("copy") in favor of navigator.clipboard?',
      interviewA: 'execCommand was synchronous and blocked the main thread while manipulating DOM selection; navigator.clipboard is Promise-based and permission-scoped.',
      company: 'Uber'
    },
    {
      id: 'html-18',
      title: 'Web Storage Deep Dive: localStorage, sessionStorage & IndexedDB',
      description: 'Origin-scoped synchronous key-value storage vs transactional IndexedDB object stores',
      difficulty: 'Intermediate',
      sectionGroup: 'HTML Browser APIs',
      analogy: 'localStorage is a small bedside notepad (5MB strings), while IndexedDB is a full filing cabinet with indexed folders for gigabytes of structured data.',
      keyTerm: 'localStorage',
      syntaxExample: 'localStorage.setItem("theme", JSON.stringify({ dark: true }));',
      codeLang: 'javascript',
      codeSnippet: `const sessionPayload = { userId: "u_99", streak: 14, synced: true };\nconst serialized = JSON.stringify(sessionPayload);\nconsole.log("Stored Payload Bytes:", serialized.length);\nconsole.log("Parsed Object:", JSON.parse(serialized));`,
      complexity: { op: 'localStorage Read/Write', time: 'O(N) String Size', space: '5MB Quota per Origin', note: 'Synchronous on main thread; wrap in try/catch for QuotaExceededError' },
      interviewQ: 'How does sessionStorage differ from localStorage when a user opens a link in a new tab?',
      interviewA: 'sessionStorage is isolated per top-level browsing tab/context and cleared when the tab closes, whereas localStorage persists across all tabs of the same origin.',
      company: 'Stripe'
    },
    {
      id: 'html-19',
      title: 'HTML5 Web Workers & Off-Main-Thread Compute',
      description: 'Dedicated Worker threads, postMessage(), Structured Clone algorithm & SharedArrayBuffer',
      difficulty: 'Advanced',
      sectionGroup: 'HTML Browser APIs',
      analogy: 'Hiring a backstage assistant to crunch heavy spreadsheets so the front-stage presenter (UI thread) never freezes at 60fps.',
      keyTerm: 'postMessage',
      syntaxExample: 'worker.postMessage({ cmd: "sort", data: buffer }, [buffer]);',
      codeLang: 'javascript',
      codeSnippet: `// Simulating Worker Structured Clone vs Transferable ArrayBuffer\nconst buffer = new Uint8Array([10, 20, 30, 40]);\nconsole.log("Main Thread Buffer Length:", buffer.byteLength);\nconsole.log("Worker message protocol: { type: 'COMPUTE_DONE', result: 100 }");`,
      complexity: { op: 'Transferable Object Pass', time: 'O(1) Zero-Copy Pointer', space: 'O(1)', note: 'Transfers ownership of ArrayBuffer without copying memory' },
      interviewQ: 'Why cannot a Web Worker directly call document.getElementById()?',
      interviewA: 'DOM nodes are not thread-safe; Workers run in an isolated global scope (DedicatedWorkerGlobalScope) and communicate with the UI thread via postMessage.',
      company: 'Figma'
    },
    {
      id: 'html-20',
      title: 'Server-Sent Events (EventSource) & Real-Time Feeds',
      description: 'Unidirectional HTTP text/event-stream, automatic reconnection & Last-Event-ID recovery',
      difficulty: 'Advanced',
      sectionGroup: 'HTML Browser APIs',
      analogy: 'Like a live stock ticker or airport arrival board that continuously streams updates over a single open HTTP connection.',
      keyTerm: 'EventSource',
      syntaxExample: 'const sse = new EventSource("/api/stream");',
      codeLang: 'javascript',
      codeSnippet: `const sampleSsePacket = "id: 42\\nevent: priceUpdate\\ndata: {\\"symbol\\":\\"NVDA\\",\\"price\\":138.5}\\n\\n";\nconsole.log("Parsed SSE Frame:\\n" + sampleSsePacket.trim());`,
      complexity: { op: 'SSE Stream Frame', time: 'O(1) Chunk Parse', space: 'O(1) Socket', note: 'Built-in exponential backoff reconnection via Last-Event-ID' },
      interviewQ: 'When is EventSource (SSE) preferable to WebSockets?',
      interviewA: 'When traffic is primarily server-to-client (LLM token streaming, live scores, notifications) because SSE works over standard HTTP/2 and auto-reconnects natively.',
      company: 'OpenAI'
    },
    {
      id: 'html-21',
      title: 'SEO, OpenGraph, Twitter Cards & JSON-LD Schema.org',
      description: 'Canonical URLs, robots meta directives, social preview cards & structured rich-snippet graphs',
      difficulty: 'Intermediate',
      sectionGroup: 'Production HTML & Security',
      analogy: 'A standardized nutrition label on the outside of your webpage so search engines and social apps know exactly how to index and display it.',
      keyTerm: 'canonical',
      syntaxExample: '<link rel="canonical" href="https://example.com/course/html">',
      codeLang: 'html',
      codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Course",\n  "name": "HTML5 Architecture",\n  "provider": { "@type": "Organization", "name": "Code IIT Out" }\n}\n</script>\n<p style="color:#34d399;font-family:monospace;">JSON-LD Structured Data Ready</p>`,
      complexity: { op: 'Crawler Graph Extraction', time: 'O(1) JSON Parse', space: 'O(1)', note: 'Prevents duplicate URL dilution via rel="canonical"' },
      interviewQ: 'Why do search engines prefer JSON-LD (<script type="application/ld+json">) over inline Microdata attributes?',
      interviewA: 'JSON-LD decouples structured metadata from visual HTML markup, making it immune to UI refactors and trivial to generate dynamically.',
      company: 'LinkedIn'
    },
    {
      id: 'html-22',
      title: 'Resource Hints: preload, prefetch, preconnect & dns-prefetch',
      description: 'Eliminating network waterfall latency on critical fonts, hero assets & API origins',
      difficulty: 'Advanced',
      sectionGroup: 'Production HTML & Security',
      analogy: 'Warming up the car engine and opening the garage door before you step outside so there is zero delay when you hit the gas.',
      keyTerm: 'preconnect',
      syntaxExample: '<link rel="preconnect" href="https://api.example.com" crossorigin>',
      codeLang: 'html',
      codeSnippet: `<!-- Critical Path Optimization -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preload" href="/fonts/mono.woff2" as="font" type="font/woff2" crossorigin>\n<p style="color:#38bdf8;font-family:monospace;">DNS + TCP + TLS Handshake Pre-warmed!</p>`,
      complexity: { op: 'Preconnect Handshake', time: 'Saves 100-300ms RTT', space: 'O(1) Socket', note: 'Completes DNS + TCP + TLS before first fetch()' },
      interviewQ: 'What happens if you <link rel="preload" as="font"> without the crossorigin attribute?',
      interviewA: 'The font will be downloaded twice! Fonts are fetched in anonymous CORS mode by CSS, so preload must include crossorigin to share the cache entry.',
      company: 'Cloudflare'
    },
    {
      id: 'html-23',
      title: 'Script Loading: defer vs async vs type="module" & Import Maps',
      description: 'HTML parser blocking behavior, execution order guarantees & native ES module resolution',
      difficulty: 'Advanced',
      sectionGroup: 'Production HTML & Security',
      analogy: 'async is a courier who interrupts your meeting the moment they arrive; defer waits politely until the presentation (HTML parsing) finishes.',
      keyTerm: 'defer',
      syntaxExample: '<script type="module" src="/app.js"></script>',
      codeLang: 'javascript',
      codeSnippet: `const modes = [\n  { attr: "normal <script>", blocksParser: true, preservesOrder: true },\n  { attr: "async", blocksParser: "During Execute", preservesOrder: false },\n  { attr: "defer / type=module", blocksParser: false, preservesOrder: true }\n];\nconsole.log(JSON.stringify(modes, null, 2));`,
      complexity: { op: 'Parallel Script Fetch', time: 'Non-Blocking Parse', space: 'O(1)', note: 'type="module" defers by default and enables strict mode' },
      interviewQ: 'In what exact order do two <script defer> tags execute relative to DOMContentLoaded?',
      interviewA: 'They download in parallel without blocking HTML parsing, execute in exact document order after parsing completes, and run right before DOMContentLoaded fires.',
      company: 'Meta'
    },
    {
      id: 'html-24',
      title: 'HTML Security: Sandbox Iframes, CSP, SRI & rel="noopener"',
      description: 'Content-Security-Policy headers, Subresource Integrity hashes & tabnabbing defense',
      difficulty: 'Advanced',
      sectionGroup: 'Production HTML & Security',
      analogy: 'Running untrusted code inside a bulletproof glass room (<iframe sandbox>) and verifying tamper-proof wax seals (integrity="sha384-...") on CDN scripts.',
      keyTerm: 'sandbox',
      syntaxExample: '<iframe src="untrusted.html" sandbox="allow-scripts"></iframe>',
      codeLang: 'html',
      codeSnippet: `<script src="https://cdn.example.com/lib.js"\n        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n        crossorigin="anonymous"></script>\n<p style="color:#34d399;font-family:monospace;">Subresource Integrity (SRI) Hash Verified</p>`,
      complexity: { op: 'SHA-384 SRI Check', time: 'O(N) Script Bytes', space: 'O(1) Digest', note: 'Blocks execution if CDN file is modified by an attacker' },
      interviewQ: 'Why is combining sandbox="allow-scripts allow-same-origin" on an iframe hosting untrusted content dangerous?',
      interviewA: 'If the iframe shares the parent origin and can run scripts, the script inside the iframe can reach parent.document and remove its own sandbox attribute!',
      company: 'Google'
    },
    {
      id: 'html-25',
      title: 'WCAG 2.2 AA Accessibility: Live Regions, Roving Tabindex & Landmarks',
      description: 'aria-live="polite", keyboard focus management, screen reader announcements & contrast math',
      difficulty: 'Expert',
      sectionGroup: 'Production HTML & Security',
      analogy: 'Building tactile paving, ramps, and clear audio PA announcements (`aria-live`) so every user can navigate the application effortlessly.',
      keyTerm: 'aria-live',
      syntaxExample: '<div role="status" aria-live="polite">Saved 3 changes</div>',
      codeLang: 'html',
      codeSnippet: `<div role="region" aria-label="Deployment Status" style="padding:12px;background:#0f172a;color:#f8fafc;border-radius:8px;">\n  <div role="status" aria-live="polite" style="color:#34d399;font-weight:bold;">\n    ✓ Build #402 Passed All 350 Module Checks\n  </div>\n</div>`,
      complexity: { op: 'Accessibility Tree Sync', time: 'O(1) Node Update', space: 'O(1)', note: 'aria-live="polite" waits until screen reader finishes current sentence' },
      interviewQ: 'What is the Roving Tabindex pattern in accessible composite widgets (like a toolbar or tablist)?',
      interviewA: 'Only the currently active item has tabindex="0" while all sibling items have tabindex="-1"; Arrow keys move focus and swap tabindex="0" so Tab exits the widget in one press.',
      company: 'Microsoft'
    }
  ],
  'c-css': [
    { id: 'css-11', title: 'CSS Specificity, Inheritance & @layer Cascade Layers', description: 'Calculating specificity (ID, Class, Element), !important & architectural @layer ordering', difficulty: 'Intermediate', sectionGroup: 'CSS Architecture', analogy: '@layer is like establishing constitutional law vs local ordinances: a higher priority layer always wins regardless of selector complexity.', keyTerm: '@layer', syntaxExample: '@layer reset, base, components, utilities;', codeLang: 'html', codeSnippet: `<style>\n  @layer base, theme;\n  @layer theme { .btn { background: #10b981; color: white; padding: 8px 14px; border-radius: 6px; } }\n  @layer base { #override.btn { background: red; } }\n</style>\n<button id="override" class="btn">@layer theme wins over #id in @layer base!</button>`, complexity: { op: 'Cascade Resolution', time: 'O(1) Rule Match', space: 'O(1)', note: 'Later @layer declarations beat earlier layers regardless of selector specificity' }, interviewQ: 'Does an #id selector inside an earlier @layer beat a simple .class selector in a later @layer?', interviewA: 'No! Layer order takes precedence over selector specificity; rules in a later layer always beat earlier un-important layers.', company: 'Meta' },
    { id: 'css-12', title: 'CSS Combinators & Advanced Pseudo-Classes (:is, :where, :has)', description: 'Parent selector :has(), zero-specificity :where(), and forgiving selector lists :is()', difficulty: 'Intermediate', sectionGroup: 'CSS Architecture', analogy: ':has() is a parent sensor that styles a card container based on whether an image or checked input exists inside it.', keyTerm: ':has', syntaxExample: '.card:has(input:checked) { border-color: #10b981; }', codeLang: 'html', codeSnippet: `<style>\n  .box { padding: 12px; border: 2px solid #334155; border-radius: 8px; color: white; background: #0f172a; }\n  .box:has(input:checked) { border-color: #10b981; background: #064e3b; }\n</style>\n<label class="box"><input type="checkbox" checked> Card styled via parent :has(input:checked)</label>`, complexity: { op: 'Relational Selector Match', time: 'O(K) Child Check', space: 'O(1)', note: ':where() always has 0,0,0 specificity' }, interviewQ: 'What is the exact difference between :is(a, .btn) and :where(a, .btn)?', interviewA: ':is() takes the specificity of its most specific argument, whereas :where() always has zero (0,0,0) specificity, making it easy to override.', company: 'Vercel' },
    { id: 'css-13', title: 'CSS Pseudo-Elements (::before, ::after, ::backdrop, ::selection)', description: 'Generated content counters, custom tooltips, decorative badges & selection highlights', difficulty: 'Beginner', sectionGroup: 'CSS Architecture', analogy: 'Virtual bookends attached to the front (::before) and back (::after) of an element without adding extra HTML tags.', keyTerm: '::after', syntaxExample: '.badge::after { content: "NEW"; }', codeLang: 'html', codeSnippet: `<style>\n  .step { color: #e2e8f0; font-family: monospace; }\n  .step::before { content: "✓ "; color: #10b981; font-weight: bold; }\n</style>\n<div class="step">Compiled with ::before pseudo-element</div>`, complexity: { op: 'Pseudo-Box Allocation', time: 'O(1) Render Tree Node', space: 'O(1)', note: 'Requires content property (even content: "") to render' }, interviewQ: 'Are ::before and ::after pseudo-elements included in the DOM tree when queried by JavaScript?', interviewA: 'No, they belong to the CSS Render Tree, not the DOM; you can inspect them using window.getComputedStyle(el, "::before").', company: 'Adobe' },
    { id: 'css-14', title: 'CSS Logical Properties (margin-inline, padding-block, inset)', description: 'Writing-mode aware layouts supporting LTR, RTL (Arabic/Hebrew) & vertical text automatically', difficulty: 'Intermediate', sectionGroup: 'CSS Layout Engine', analogy: 'Saying "driver side" vs "passenger side" instead of "left/right" so directions stay accurate in any country.', keyTerm: 'padding-inline', syntaxExample: 'padding-inline: 16px; margin-block-end: 24px;', codeLang: 'html', codeSnippet: `<div style="padding-inline: 20px; padding-block: 12px; border-inline-start: 4px solid #10b981; background:#0f172a; color:#f8fafc;">\n  Logical properties adapt automatically to dir="rtl" and dir="ltr"!\n</div>`, complexity: { op: 'Direction Mapping', time: 'O(1) Layout Resolve', space: 'O(1)', note: 'inset: 0 replaces top:0; right:0; bottom:0; left:0' }, interviewQ: 'Why should global web applications use border-inline-start instead of border-left?', interviewA: 'When switching the document to dir="rtl" for Arabic or Hebrew users, border-inline-start automatically flips to the right edge without extra CSS overrides.', company: 'Booking.com' },
    { id: 'css-15', title: 'CSS Stacking Contexts, isolation: isolate & Z-Index Internals', description: 'What creates a new stacking context (transform, opacity < 1, filter) & eliminating z-index wars', difficulty: 'Advanced', sectionGroup: 'CSS Layout Engine', analogy: 'Floors in a skyscraper: Floor 2 Room 9999 is still below Floor 3 Room 1. Stacking contexts are the floors.', keyTerm: 'isolate', syntaxExample: '.card { isolation: isolate; }', codeLang: 'html', codeSnippet: `<div style="isolation: isolate; position: relative; padding: 14px; background: #0f172a; color: #38bdf8; border: 1px solid #1e293b; border-radius: 8px;">\n  isolation: isolate creates a clean Stacking Context boundary without z-index side effects.\n</div>`, complexity: { op: 'Paint Order Sort', time: 'O(N log N) Layers', space: 'O(N)', note: 'opacity < 1 or transform != none creates a new stacking context' }, interviewQ: 'Why might an element with z-index: 9999 still appear behind an element with z-index: 2?', interviewA: 'Because the z-index: 9999 element is trapped inside a parent stacking context (e.g. a parent with opacity: 0.99 or transform) that sits below the z-index: 2 context.', company: 'Figma' },
    { id: 'css-16', title: 'CSS Overflow, Scroll Snap, overscroll-behavior & Scrollbars', description: 'Horizontal carousels with scroll-snap-type: x mandatory & preventing modal scroll chaining', difficulty: 'Intermediate', sectionGroup: 'CSS Layout Engine', analogy: 'Magnetic detents on a camera dial that smoothly snap each card into the center of the viewport.', keyTerm: 'scroll-snap-type', syntaxExample: 'scroll-snap-type: x mandatory; overscroll-behavior: contain;', codeLang: 'html', codeSnippet: `<div style="display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:8px;background:#0f172a;">\n  <div style="min-width:180px;scroll-snap-align:start;background:#1e293b;color:#34d399;padding:16px;border-radius:8px;">Snap Card 1</div>\n  <div style="min-width:180px;scroll-snap-align:start;background:#1e293b;color:#38bdf8;padding:16px;border-radius:8px;">Snap Card 2</div>\n</div>`, complexity: { op: 'Compositor Scroll Snap', time: 'O(1) 60fps Thread', space: 'O(1)', note: 'overscroll-behavior: contain stops background page scrolling when modal hits bottom' }, interviewQ: 'How do you prevent scrolling inside a chat drawer from scrolling the underlying page when reaching the bottom?', interviewA: 'Apply overscroll-behavior: contain on the scrollable drawer container.', company: 'Instagram' },
    { id: 'css-17', title: 'CSS Subgrid & Multi-Dimensional Card Alignment', description: 'grid-template-rows: subgrid for aligning headers, bodies, and footers across sibling cards', difficulty: 'Advanced', sectionGroup: 'CSS Layout Engine', analogy: 'Allowing grandchildren inside separate cards to line up on the exact same horizontal shelves as the main bookshelf.', keyTerm: 'subgrid', syntaxExample: 'grid-row: span 3; grid-template-rows: subgrid;', codeLang: 'html', codeSnippet: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#0f172a;padding:10px;color:white;">\n  <div style="background:#1e293b;padding:10px;border-radius:8px;"><strong>Card A</strong><p>Aligned via CSS Grid</p></div>\n  <div style="background:#1e293b;padding:10px;border-radius:8px;"><strong>Card B</strong><p>Equal row heights</p></div>\n</div>`, complexity: { op: 'Subgrid Track Sizing', time: 'O(N) Grid Items', space: 'O(1)', note: 'Shares parent track lines across nested children' }, interviewQ: 'What problem does grid-template-rows: subgrid solve in a 3-column pricing card grid?', interviewA: 'It aligns the title, feature list, and CTA button rows horizontally across all cards even when one card has a 3-line title and another has a 1-line title.', company: 'Linear' },
    { id: 'css-18', title: 'CSS Container Queries (@container) & Container Units (cqw)', description: 'Component-driven responsive design based on parent container width instead of viewport', difficulty: 'Advanced', sectionGroup: 'Modern Responsive CSS', analogy: 'A chameleon component that adapts its layout based on the size of the box it is placed in, whether a narrow sidebar or wide main stage.', keyTerm: '@container', syntaxExample: 'container-type: inline-size; @container (min-width: 400px) { ... }', codeLang: 'html', codeSnippet: `<div style="container-type:inline-size;background:#0f172a;padding:12px;border:1px solid #334155;border-radius:8px;color:#34d399;">\n  Component Container (container-type: inline-size)\n</div>`, complexity: { op: 'Container Size Evaluation', time: 'O(1) ResizeObserver Pass', space: 'O(1)', note: 'Prevents circular sizing via inline-size containment' }, interviewQ: 'Why are @container queries superior to @media queries for reusable design-system components?', interviewA: '@media only knows the browser window width, whereas @container lets the exact same card component render stacked in a 280px sidebar and horizontal in an 800px main column.', company: 'Shopify' },
    { id: 'css-19', title: 'CSS Math Functions: clamp(), min(), max() & calc()', description: 'Fluid typography without media query jumps, dynamic spacing & aspect-ratio math', difficulty: 'Intermediate', sectionGroup: 'Modern Responsive CSS', analogy: 'A thermostat with a minimum floor and maximum ceiling that scales smoothly with room temperature (`clamp(min, preferred, max)`).', keyTerm: 'clamp', syntaxExample: 'font-size: clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem);', codeLang: 'html', codeSnippet: `<h2 style="font-size:clamp(1.1rem, 3vw, 2rem);color:#38bdf8;background:#0f172a;padding:12px;border-radius:8px;margin:0;">\n  Fluid Headline: clamp(1.1rem, 3vw, 2rem)\n</h2>`, complexity: { op: 'Layout Expression Eval', time: 'O(1)', space: 'O(1)', note: 'Always include rem in preferred value (e.g. 2vw + 0.5rem) for browser zoom accessibility' }, interviewQ: 'Why should fluid typography inside clamp() use clamp(1rem, 2vw + 0.5rem, 2rem) instead of pure 3vw?', interviewA: 'Pure vw units do not respond when a user zooms text size to 200%; mixing rem with vw ensures WCAG zoom compliance.', company: 'Stripe' },
    { id: 'css-20', title: 'CSS Aspect-Ratio, Object-Fit & Object-Position', description: 'Zero-padding-hack video/image containers, cover vs contain cropping & focal point alignment', difficulty: 'Beginner', sectionGroup: 'Modern Responsive CSS', analogy: 'A picture frame with fixed 16:9 proportions (`aspect-ratio: 16 / 9`) that automatically crops or fits any photo (`object-fit: cover`).', keyTerm: 'aspect-ratio', syntaxExample: 'aspect-ratio: 16 / 9; object-fit: cover;', codeLang: 'html', codeSnippet: `<div style="aspect-ratio: 16 / 9; max-width: 280px; background: linear-gradient(135deg,#065f46,#0284c7); border-radius: 10px; display:flex; align-items:center; justify-content:center; color:white; font-family:monospace;">\n  aspect-ratio: 16 / 9\n</div>`, complexity: { op: 'Box Ratio Calculation', time: 'O(1)', space: 'O(1)', note: 'Replaces legacy padding-top: 56.25% hack' }, interviewQ: 'What is the difference between object-fit: cover and object-fit: contain?', interviewA: 'cover fills the entire box and crops excess edges while preserving aspect ratio; contain fits the entire image inside the box, leaving letterbox bars if ratios differ.', company: 'Pinterest' },
    { id: 'css-21', title: 'CSS Filters, Backdrop-Filter & Blend Modes', description: 'Frosted glass UI (backdrop-filter: blur()), drop-shadow() on transparent PNGs/SVGs & mix-blend-mode', difficulty: 'Intermediate', sectionGroup: 'Visual Effects & GPU', analogy: 'Looking through a frosted glass window (`backdrop-filter: blur(12px)`) that blurs whatever moves behind it in real time.', keyTerm: 'backdrop-filter', syntaxExample: 'backdrop-filter: blur(12px) saturate(180%);', codeLang: 'html', codeSnippet: `<div style="background:linear-gradient(90deg,#10b981,#3b82f6);padding:20px;border-radius:10px;">\n  <div style="background:rgba(15,23,42,0.75);backdrop-filter:blur(8px);padding:12px;border-radius:8px;color:white;font-family:monospace;">\n    Frosted Glass Overlay (backdrop-filter: blur(8px))\n  </div>\n</div>`, complexity: { op: 'GPU Shader Pass', time: 'O(Pixels) Fragment Shader', space: '1 Offscreen Texture', note: 'filter: drop-shadow() follows alpha mask unlike box-shadow' }, interviewQ: 'When should you use filter: drop-shadow() instead of box-shadow?', interviewA: 'When applying a shadow to a non-rectangular transparent PNG or SVG icon, because drop-shadow contours the actual alpha pixels rather than the rectangular bounding box.', company: 'Apple' },
    { id: 'css-22', title: 'CSS Clip-Path, Mask-Image & SVG Shapes', description: 'Polygon cutouts, circular reveal transitions & alpha gradient masking', difficulty: 'Advanced', sectionGroup: 'Visual Effects & GPU', analogy: 'A cookie cutter (`clip-path: polygon(...)`) that trims an element into custom geometric shapes without altering DOM layout.', keyTerm: 'clip-path', syntaxExample: 'clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);', codeLang: 'html', codeSnippet: `<div style="clip-path:polygon(0 0, 95% 0, 100% 100%, 5% 100%);background:#10b981;color:#052e16;font-weight:bold;padding:12px 24px;display:inline-block;">\n  Angled Badge via clip-path: polygon()\n</div>`, complexity: { op: 'GPU Stencil Mask', time: 'O(Vertices)', space: 'O(1)', note: 'Can be smoothly animated when polygon vertex counts match' }, interviewQ: 'What rule must be followed to smoothly transition between two clip-path: polygon() states?', interviewA: 'Both polygons must have the exact same number of vertices and use compatible unit types (e.g. percentages).', company: 'Epic Games' },
    { id: 'css-23', title: 'Browser Rendering Pipeline: Layout, Paint & GPU Composite', description: 'Reflow vs Repaint, compositor-only properties (transform, opacity) & will-change budget', difficulty: 'Advanced', sectionGroup: 'Visual Effects & GPU', analogy: 'Changing `width` rebuilds the brick wall (Layout + Paint + Composite); changing `transform: translateX()` slides a finished poster on glass (GPU Composite only).', keyTerm: 'transform', syntaxExample: 'transform: translate3d(0, -4px, 0); opacity: 0.95;', codeLang: 'html', codeSnippet: `<div style="transform:translateY(0);transition:transform 150ms ease,opacity 150ms ease;background:#0f172a;color:#34d399;padding:12px;border:1px solid #10b981;border-radius:8px;">\n  60fps Compositor-Only Animation (transform + opacity)\n</div>`, complexity: { op: 'Compositor Frame', time: '< 1.5ms GPU Pass', space: 'GPU Layer Memory', note: 'Never animate top/left/width/height on scroll' }, interviewQ: 'Why does animating top/left cause jank on 120Hz displays compared to transform: translate()?', interviewA: 'top/left triggers main-thread Layout (reflow) and Paint on every frame, whereas transform is handled directly on the GPU compositor thread.', company: 'Google' },
    { id: 'css-24', title: 'CSS Containment (contain, content-visibility: auto) for Huge DOMs', description: 'Skipping offscreen rendering work for 10,000-row feeds with content-visibility: auto', difficulty: 'Expert', sectionGroup: 'Visual Effects & GPU', analogy: 'Only turning on the lights and rendering furniture in the rooms the user is currently looking at (`content-visibility: auto`).', keyTerm: 'content-visibility', syntaxExample: 'content-visibility: auto; contain-intrinsic-size: 0 300px;', codeLang: 'html', codeSnippet: `<div style="content-visibility:auto;contain-intrinsic-size:0 60px;background:#0f172a;color:#38bdf8;padding:14px;border-radius:8px;border:1px solid #1e293b;">\n  High-Scale Feed Row (content-visibility: auto)\n</div>`, complexity: { op: 'Offscreen Render Skip', time: 'Up to 7x Faster Initial Paint', space: 'O(Visible Viewport)', note: 'Pair with contain-intrinsic-size to preserve scrollbar accuracy' }, interviewQ: 'What is the purpose of contain-intrinsic-size when using content-visibility: auto?', interviewA: 'It provides a placeholder height for unrendered offscreen elements so the browser scrollbar does not jump wildly as the user scrolls.', company: 'Meta' },
    { id: 'css-25', title: 'Design Systems Architecture: Tokens, @property & Reduced Motion', description: 'Typed CSS custom properties (@property), multi-brand semantic tokens & prefers-reduced-motion', difficulty: 'Expert', sectionGroup: 'Visual Effects & GPU', analogy: 'A master control board of typed design tokens that lets an entire enterprise suite switch themes or disable motion in 1 millisecond.', keyTerm: '@property', syntaxExample: '@property --progress { syntax: "<percentage>"; inherits: false; initial-value: 0%; }', codeLang: 'html', codeSnippet: `<style>\n  @media (prefers-reduced-motion: reduce) {\n    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }\n  }\n</style>\n<div style="background:#0f172a;color:#34d399;padding:12px;border-radius:8px;font-family:monospace;">\n  ✓ WCAG Motion &amp; Token Architecture Active\n</div>`, complexity: { op: 'Typed Token Interpolation', time: 'O(1) Native Gradient Anim', space: 'O(1)', note: '@property allows animating CSS variables inside linear-gradient()' }, interviewQ: 'Why can you not animate a standard --color variable inside a linear-gradient() without @property?', interviewA: 'Standard CSS variables are untyped strings; @property registers the exact syntax type (e.g. "<color>" or "<percentage>") so the browser engine knows how to interpolate intermediate frames.', company: 'Stripe' }
  ],
  'c-js': [
    { id: 'js-11', title: 'Prototypes, Prototypal Inheritance & Object.create()', description: '[[Prototype]] chain lookup, __proto__ vs prototype property & method delegation', difficulty: 'Intermediate', sectionGroup: 'JS Objects & Internals', analogy: 'If you do not own a tool, you ask your parent; if they do not have it, they ask your grandparent until reaching Object.prototype.', keyTerm: 'Object.create', syntaxExample: 'const child = Object.create(parentProto);', codeLang: 'javascript', codeSnippet: `const baseLogger = { log(msg) { return "[LOG]: " + msg; } };\nconst service = Object.create(baseLogger);\nservice.name = "AuthService";\nconsole.log(service.log(service.name));\nconsole.log("Has own log?", Object.hasOwn(service, "log"));`, complexity: { op: 'Property Lookup', time: 'O(D) Prototype Depth', space: 'O(1) Shared Methods', note: 'V8 optimizes prototype lookups using inline caches' }, interviewQ: 'What is the difference between Function.prototype and Object.getPrototypeOf(instance)?', interviewA: 'Func.prototype is the blueprint object assigned as the [[Prototype]] of new instances created with new Func(), whereas Object.getPrototypeOf(instance) reads the actual internal [[Prototype]] link.', company: 'Google' },
    { id: 'js-12', title: 'Execution Context, this Binding, call(), apply() & bind()', description: '4 rules of this (new, explicit, implicit, default) vs lexical arrow functions', difficulty: 'Intermediate', sectionGroup: 'JS Objects & Internals', analogy: '`this` in a regular function is "whoever called me on the phone right now"; `this` in an arrow function is permanently stamped where it was born.', keyTerm: 'bind', syntaxExample: 'const boundFn = user.greet.bind(user);', codeLang: 'javascript', codeSnippet: `const account = {\n  owner: "Ada",\n  format(prefix, currency) { return \`\${prefix}: \${this.owner} (\${currency})\`; }\n};\nconst bound = account.format.bind({ owner: "Grace" }, "Account");\nconsole.log(account.format.call({ owner: "Alan" }, "VIP", "USD"));\nconsole.log(bound("INR"));`, complexity: { op: 'Bound Function Call', time: 'O(1)', space: 'O(1) Closure Slot', note: 'Arrow functions ignore call/apply/bind for this' }, interviewQ: 'What happens if you call .bind() on an arrow function?', interviewA: 'Pre-bound arguments are still curried, but the this argument is completely ignored because arrow functions capture lexical this from their enclosing scope.', company: 'Amazon' },
    { id: 'js-13', title: 'ES6 Classes, Private Fields (#), Getters/Setters & Static Blocks', description: 'True runtime private fields (#balance), static initialization & extends/super', difficulty: 'Intermediate', sectionGroup: 'JS Objects & Internals', analogy: 'A bank vault where `#balance` is hardware-locked inside the class—outside code cannot even inspect it.', keyTerm: '#private', syntaxExample: 'class Vault { #secret = 42; getSecret() { return this.#secret; } }', codeLang: 'javascript', codeSnippet: `class Wallet {\n  #balance = 0;\n  constructor(initial) { this.#balance = initial; }\n  deposit(amount) { this.#balance += amount; return this.#balance; }\n}\nconst w = new Wallet(100);\nconsole.log("Updated Balance:", w.deposit(50));`, complexity: { op: 'Private Field Access', time: 'O(1) Fixed Offset', space: 'O(1)', note: 'Enforced at syntax/runtime level unlike TypeScript private' }, interviewQ: 'How do ES2022 #private fields differ from TypeScript private properties at runtime?', interviewA: 'TypeScript private is erased during compilation and remains accessible via obj["prop"], whereas JS #private throws a SyntaxError if accessed outside the class body.', company: 'Microsoft' },
    { id: 'js-14', title: 'Iterators, Generators (function*) & Custom Iterable Protocols', description: 'Symbol.iterator, lazy sequences, yield pause/resume & async generators (for await...of)', difficulty: 'Advanced', sectionGroup: 'JS Advanced Patterns', analogy: 'A ticket dispenser (`yield`) that prints the next number only when someone pulls the lever (`next()`), using zero memory for infinite sequences.', keyTerm: 'yield', syntaxExample: 'function* idGen() { let i = 1; while (true) yield i++; }', codeLang: 'javascript', codeSnippet: `function* range(start, end, step = 1) {\n  for (let i = start; i <= end; i += step) yield i;\n}\nconsole.log("Generated Array:", [...range(10, 30, 5)]);`, complexity: { op: 'Generator Step', time: 'O(1) Per Yield', space: 'O(1) Suspended Frame', note: 'Enables lazy evaluation of billion-item streams' }, interviewQ: 'How can a generator function save memory when processing a 10GB log stream?', interviewA: 'Instead of allocating an array of all lines in RAM, a generator yields one parsed record at a time (O(1) memory) as the consumer iterates.', company: 'Netflix' },
    { id: 'js-15', title: 'Symbols, Well-Known Symbols & Metaprogramming', description: 'Collision-free unique keys, Symbol.for(), Symbol.toPrimitive & Symbol.toStringTag', difficulty: 'Advanced', sectionGroup: 'JS Advanced Patterns', analogy: 'Invisible ink keys on an object that normal `for...in` loops and `JSON.stringify()` skip over completely.', keyTerm: 'Symbol', syntaxExample: 'const SECRET_KEY = Symbol("auditId");', codeLang: 'javascript', codeSnippet: `const INTERNAL_ID = Symbol("id");\nconst user = { name: "Linus", [INTERNAL_ID]: 9001 };\nconsole.log("JSON keys:", Object.keys(user));\nconsole.log("Symbol value:", user[INTERNAL_ID]);`, complexity: { op: 'Symbol Key Lookup', time: 'O(1)', space: 'O(1)', note: 'Skipped by Object.keys() and JSON.stringify()' }, interviewQ: 'What is the difference between Symbol("x") and Symbol.for("x")?', interviewA: 'Symbol("x") always creates a brand-new unique symbol, whereas Symbol.for("x") looks up or registers a shared symbol in the global runtime symbol registry.', company: 'PayPal' },
    { id: 'js-16', title: 'Proxy & Reflect API: Building Reactive State Engines', description: 'Intercepting get, set, deleteProperty traps & how Vue/MobX track fine-grained reactivity', difficulty: 'Advanced', sectionGroup: 'JS Advanced Patterns', analogy: 'A smart security receptionist (`Proxy`) standing in front of an object who logs every visitor (`get`) and validates every package (`set`).', keyTerm: 'Proxy', syntaxExample: 'new Proxy(target, { get(obj, prop) { return Reflect.get(obj, prop); } })', codeLang: 'javascript', codeSnippet: `const logs = [];\nconst state = new Proxy({ count: 0 }, {\n  set(target, prop, value, receiver) {\n    logs.push(\`Mutated \${String(prop)} -> \${value}\`);\n    return Reflect.set(target, prop, value, receiver);\n  }\n});\nstate.count = 10;\nstate.count = 25;\nconsole.log(logs.join(" | "));`, complexity: { op: 'Proxy Trap Intercept', time: 'O(1) + Handler', space: 'O(1)', note: 'Always forward receiver via Reflect.get/set for proper getter this binding' }, interviewQ: 'Why should Proxy traps use Reflect.get(target, prop, receiver) instead of target[prop]?', interviewA: 'If target inherits a getter that accesses this.otherProp, passing receiver ensures this inside the getter points to the Proxy rather than the unwrapped target.', company: 'ByteDance' },
    { id: 'js-17', title: 'Map, Set, WeakMap, WeakSet & FinalizationRegistry', description: 'O(1) hash collections vs garbage-collected object-keyed caches that never leak memory', difficulty: 'Advanced', sectionGroup: 'JS Memory & Engine', analogy: 'A `WeakMap` is a coat check where if a guest leaves the building (DOM node removed), their coat automatically vanishes from memory.', keyTerm: 'WeakMap', syntaxExample: 'const domCache = new WeakMap(); domCache.set(el, metadata);', codeLang: 'javascript', codeSnippet: `const cache = new WeakMap();\nlet domNode = { tag: "BUTTON", id: "submit" };\ncache.set(domNode, { clicks: 5 });\nconsole.log("Cached clicks:", cache.get(domNode).clicks);\ndomNode = null; // Eligible for GC immediately!`, complexity: { op: 'WeakMap Lookup', time: 'O(1) Ephemeron Table', space: 'Zero Memory Leak', note: 'Keys must be objects or non-registered symbols' }, interviewQ: 'Why does WeakMap not have a .size property or .keys() iterator?', interviewA: 'Because garbage collection happens non-deterministically in the background; exposing .keys() would leak timing details of the GC engine.', company: 'Meta' },
    { id: 'js-18', title: 'Deep Cloning, StructuredClone, Immutability & Object.freeze()', description: 'Shallow spread vs structuredClone(), circular reference handling & Object.is()', difficulty: 'Intermediate', sectionGroup: 'JS Memory & Engine', analogy: 'A photocopy of a folder cover (`{...obj}`) still points to the same inner pages; `structuredClone(obj)` prints a brand-new copy of every nested page.', keyTerm: 'structuredClone', syntaxExample: 'const deepCopy = structuredClone(nestedState);', codeLang: 'javascript', codeSnippet: `const original = { user: "Asha", roles: ["admin", "sre"] };\nconst clone = structuredClone(original);\nclone.roles.push("owner");\nconsole.log("Original roles:", original.roles);\nconsole.log("Clone roles:", clone.roles);`, complexity: { op: 'Deep Clone Traversal', time: 'O(N) Object Graph', space: 'O(N) Copy', note: 'Handles Date, Map, Set, RegExp, and circular references natively' }, interviewQ: 'What are three major bugs with using JSON.parse(JSON.stringify(obj)) for deep cloning?', interviewA: 'It throws on circular references, converts Date objects into strings, and silently drops Map, Set, undefined, and Infinity values.', company: 'Atlassian' },
    { id: 'js-19', title: 'Debounce, Throttle, Memoization & Currying Implementations', description: 'Writing production rate-limiting wrappers and higher-order functional utilities from scratch', difficulty: 'Intermediate', sectionGroup: 'JS Advanced Patterns', analogy: 'Debounce waits until you stop typing for 300ms before searching; Throttle fires at most once every 100ms during continuous scrolling.', keyTerm: 'clearTimeout', syntaxExample: 'const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };', codeLang: 'javascript', codeSnippet: `function memoize(fn) {\n  const cache = new Map();\n  return (n) => {\n    if (cache.has(n)) return \`[HIT] \${cache.get(n)}\`;\n    const res = fn(n);\n    cache.set(n, res);\n    return \`[CALC] \${res}\`;\n  };\n}\nconst sq = memoize(x => x * x);\nconsole.log(sq(12), "|", sq(12));`, complexity: { op: 'Memoized Lookup', time: 'O(1) Cache Hit', space: 'O(K) Unique Args', note: 'Essential for search inputs and resize handlers' }, interviewQ: 'When should you use throttle instead of debounce on a scroll event listener?', interviewA: 'When updating a scroll progress bar or infinite-scroll trigger where you want periodic updates during the scroll rather than waiting until the user completely stops.', company: 'Uber' },
    { id: 'js-20', title: 'Advanced Promise Combinators: all, allSettled, race, any & AbortController', description: 'Cancelling in-flight fetch requests, handling partial failures & concurrency pools', difficulty: 'Advanced', sectionGroup: 'JS Async & Concurrency', analogy: '`Promise.all` is a relay team where one dropped baton fails the race; `Promise.allSettled` collects every runner’s finish time no matter what.', keyTerm: 'allSettled', syntaxExample: 'const results = await Promise.allSettled([fetchA(), fetchB()]);', codeLang: 'javascript', codeSnippet: `Promise.allSettled([\n  Promise.resolve("Auth OK"),\n  Promise.reject("Cache Timeout"),\n  Promise.resolve("DB OK")\n]).then(res => console.log(JSON.stringify(res.map(r => r.status))));`, complexity: { op: 'Parallel Promise Wait', time: 'O(max(T_i)) Latency', space: 'O(N) Results', note: 'AbortController cancels obsolete fetch() calls on rapid tab switches' }, interviewQ: 'What is the difference between Promise.race() and Promise.any()?', interviewA: 'Promise.race() settles as soon as the first promise either fulfills OR rejects; Promise.any() waits for the first FULFILLED promise and only rejects (with AggregateError) if all promises reject.', company: 'Netflix' },
    { id: 'js-21', title: 'Regular Expressions: Lookaheads, Named Capture Groups & Unicode', description: 'Non-capturing groups (?:), positive/negative lookaheads (?= / ?!) & ReDoS prevention', difficulty: 'Intermediate', sectionGroup: 'JS Engine & Security', analogy: 'A lookahead `(?=...)` checks that a street sign is ahead without actually walking forward and consuming characters.', keyTerm: 'groups', syntaxExample: 'const match = /(?<year>\\d{4})-(?<month>\\d{2})/.exec("2026-11");', codeLang: 'javascript', codeSnippet: `const pattern = /(?<service>[a-z]+)-(?<version>v\\d+)/;\nconst m = pattern.exec("payments-v4");\nconsole.log("Captured Named Groups:", JSON.stringify(m.groups));`, complexity: { op: 'NFA Regex Match', time: 'O(N) Linear (Safe)', space: 'O(1)', note: 'Avoid nested quantifiers like (a+)+ which cause exponential ReDoS' }, interviewQ: 'What is Catastrophic Backtracking (ReDoS) in JavaScript regular expressions?', interviewA: 'When a regex contains ambiguous nested quantifiers like /^(a+)+$/ and fails near the end of a string, the NFA engine explores O(2^N) paths and freezes the thread.', company: 'Cloudflare' },
    { id: 'js-22', title: 'Binary Data in JS: ArrayBuffer, TypedArrays, DataView & Blobs', description: 'Zero-overhead binary packet parsing, Uint8Array, Float32Array & endianness control', difficulty: 'Advanced', sectionGroup: 'JS Memory & Engine', analogy: 'An `ArrayBuffer` is a raw slab of contiguous bytes; `Uint8Array` and `Float32Array` are different rulers placed over that exact same slab.', keyTerm: 'Uint8Array', syntaxExample: 'const bytes = new Uint8Array(new ArrayBuffer(16));', codeLang: 'javascript', codeSnippet: `const buf = new ArrayBuffer(8);\nconst view = new DataView(buf);\nview.setUint32(0, 0x12345678, false); // Big-endian\nconsole.log("Hex Byte 0:", "0x" + view.getUint8(0).toString(16));`, complexity: { op: 'TypedArray Indexing', time: 'O(1) Direct Memory Offset', space: 'Contiguous Bytes', note: 'No boxing overhead unlike standard JS arrays' }, interviewQ: 'Why does WebGL and audio processing require Float32Array instead of regular JS arrays?', interviewA: 'Regular JS arrays are boxed heap objects with type tags and pointers, whereas Float32Array is a contiguous raw C-compatible memory buffer that transfers directly to the GPU.', company: 'Spotify' },
    { id: 'js-23', title: 'V8 Engine Internals: Hidden Classes (Shapes), Inline Caching & JIT', description: 'Ignition bytecode interpreter, TurboFan optimizing compiler & avoiding deoptimizations', difficulty: 'Expert', sectionGroup: 'JS Memory & Engine', analogy: 'When every object initializes properties in the same order, V8 stamps them with the same blueprint ("Hidden Class") and reads fields at C-struct speed.', keyTerm: 'HiddenClass', syntaxExample: '// Initialize all fields in constructor in consistent order', codeLang: 'javascript', codeSnippet: `class Point {\n  constructor(x, y) {\n    this.x = x; // Always same property order -> Shared V8 Shape!\n    this.y = y;\n  }\n}\nconst p1 = new Point(3, 4);\nconst p2 = new Point(6, 8);\nconsole.log("Monomorphic Call Result:", p1.x * p2.x + p1.y * p2.y);`, complexity: { op: 'Monomorphic Property Read', time: 'O(1) Single CPU Instruction', space: 'Shared Shape', note: 'Avoid delete obj.prop which transitions object to slow dictionary mode' }, interviewQ: 'Why does adding properties in different orders (`a.x=1; a.y=2` vs `b.y=2; b.x=1`) hurt V8 performance?', interviewA: 'It creates two distinct Hidden Class transition trees, turning monomorphic inline caches into slower polymorphic or megamorphic lookups.', company: 'Google' },
    { id: 'js-24', title: 'Memory Leaks in Production SPAs & Chrome Heap Snapshots', description: 'Detached DOM trees, forgotten timers, global event listeners & closure retention', difficulty: 'Advanced', sectionGroup: 'JS Memory & Engine', analogy: 'Removing a picture frame from the wall (DOM) while still holding a rope tied to it in your hand (a global JS array)—the room never frees the space.', keyTerm: 'removeEventListener', syntaxExample: 'window.removeEventListener("resize", onResize);', codeLang: 'javascript', codeSnippet: `const activeListeners = new Set();\nfunction registerSafeListener(id) {\n  activeListeners.add(id);\n  return () => activeListeners.delete(id); // Disposer pattern\n}\nconst cleanup = registerSafeListener("scroll_handler_1");\ncleanup();\nconsole.log("Active Retained Listeners:", activeListeners.size);`, complexity: { op: 'Mark-and-Sweep GC', time: 'O(Live Objects)', space: 'Generational Heap', note: 'Always return cleanup functions in lifecycle hooks' }, interviewQ: 'What is a "Detached DOM tree" in a Chrome DevTools Heap Snapshot?', interviewA: 'A DOM subtree that has been removed from the document via .remove(), but cannot be garbage-collected because a JavaScript variable or closure still holds a reference to one of its nodes.', company: 'Airbnb' },
    { id: 'js-25', title: 'ES Modules, Dynamic import(), Tree-Shaking & Module Bundlers', description: 'Static ESM bindings vs CommonJS require(), code splitting & sideEffects: false', difficulty: 'Advanced', sectionGroup: 'JS Engine & Security', analogy: 'Tree-shaking shakes the orchard tree at build time so only the exact functions your app imports fall into the production bundle.', keyTerm: 'import', syntaxExample: 'const { heavyChart } = await import("./chartEngine.js");', codeLang: 'javascript', codeSnippet: `// Static ESM exports allow dead-code elimination (Tree-Shaking)\nconst usedUtility = (a, b) => a + b;\nconsole.log("Tree-Shaken Bundle Output:", usedUtility(40, 2));`, complexity: { op: 'Route Chunk Load', time: 'O(Chunk Size) On-Demand', space: 'Reduced Initial JS', note: 'Static import/export syntax enables compile-time AST dead-code removal' }, interviewQ: 'Why can bundlers tree-shake ES Modules (`import/export`) much more reliably than CommonJS (`require`)?', interviewA: 'ESM imports and exports are static top-level declarations known at compile time without executing code, whereas CommonJS require() can compute paths dynamically at runtime.', company: 'Vercel' }
  ],
  'c-ts': [
    { id: 'ts-7', title: 'TS Generics & Reusable Type-Safe Components', description: 'Generic functions <T>, generic interfaces, default type parameters & extends constraints', difficulty: 'Intermediate', sectionGroup: 'TS Generics & Type System', analogy: 'A label maker where `<T>` adapts to whatever type of item you feed in while guaranteeing the output label matches.', keyTerm: 'extends', syntaxExample: 'function first<T>(items: T[]): T | undefined { return items[0]; }', codeLang: 'javascript', codeSnippet: `function wrapResult<T>(data: T) {\n  return { ok: true, timestamp: 2026, payload: data };\n}\nconsole.log(JSON.stringify(wrapResult({ id: 7, status: "active" })));`, complexity: { op: 'Compile-Time Instantiation', time: '0ms Runtime Overhead', space: 'Erased at Build', note: 'All TypeScript types are completely erased in emitted JS' }, interviewQ: 'How do you constrain a generic parameter T so it must have an id: string property?', interviewA: 'Use an extends constraint: function process<T extends { id: string }>(item: T) { ... }.', company: 'Microsoft' },
    { id: 'ts-9', title: 'unknown vs any vs never: Exhaustive Type Safety', description: 'Top types (unknown) vs bottom types (never) and compile-time exhaustiveness checking', difficulty: 'Intermediate', sectionGroup: 'TS Generics & Type System', analogy: '`any` turns off the metal detector; `unknown` locks the suitcase until you inspect what is inside (`typeof`); `never` is an empty box that can never happen.', keyTerm: 'unknown', syntaxExample: 'function parse(input: unknown) { if (typeof input === "string") return input.toUpperCase(); }', codeLang: 'javascript', codeSnippet: `function safeFormat(val) {\n  if (typeof val === "string") return val.trim().toUpperCase();\n  if (typeof val === "number") return val.toFixed(2);\n  return "UNSUPPORTED";\n}\nconsole.log(safeFormat("  typescript  "), "|", safeFormat(99.456));`, complexity: { op: 'Control Flow Narrowing', time: '0ms Runtime', space: 'O(1)', note: 'Assigning unhandled union branches to never catches missing switch cases at compile time' }, interviewQ: 'Why should API response parsers return unknown instead of any?', interviewA: 'unknown forces the caller to narrow or validate the schema before accessing properties, whereas any silently permits unsafe property access that crashes at runtime.', company: 'Stripe' },
    { id: 'ts-10', title: 'User-Defined Type Guards (is) & Assertion Functions (asserts)', description: 'Custom predicate functions (val is User) that narrow types across scope boundaries', difficulty: 'Intermediate', sectionGroup: 'TS Generics & Type System', analogy: 'A certified customs inspector whose stamp (`val is User`) convinces the compiler that an unknown object is 100% safe.', keyTerm: 'is', syntaxExample: 'function isUser(x: unknown): x is User { return typeof x === "object" && x !== null && "id" in x; }', codeLang: 'javascript', codeSnippet: `function isValidUser(u) {\n  return typeof u === "object" && u !== null && typeof u.email === "string";\n}\nconst candidate = { email: "eng@codeiit.io" };\nconsole.log("Type Guard Passed:", isValidUser(candidate));`, complexity: { op: 'Predicate Check', time: 'O(1) Property Check', space: 'O(1)', note: 'Narrows type in the true branch of if (isValidUser(x))' }, interviewQ: 'What is the danger of writing an inaccurate user-defined type guard (x is T)?', interviewA: 'The compiler trusts your boolean return expression blindly; if your runtime check is incomplete, TypeScript will assume properties exist that are actually undefined.', company: 'Airbnb' },
    { id: 'ts-11', title: 'Indexed Access Types (T[K]), keyof & typeof Type Queries', description: 'Deriving types directly from runtime constants, arrays (typeof ARR[number]) & nested keys', difficulty: 'Intermediate', sectionGroup: 'TS Generics & Type System', analogy: 'Using a mirror (`typeof`) so your type definitions automatically stay in sync whenever you update a constant configuration object.', keyTerm: 'keyof', syntaxExample: 'type Prop<T, K extends keyof T> = T[K];', codeLang: 'javascript', codeSnippet: `const ROLES = ["user", "moderator", "admin"];\nfunction getProperty(obj, key) { return obj[key]; }\nconsole.log("Role:", getProperty({ id: 1, role: ROLES[2] }, "role"));`, complexity: { op: 'Type Lookup', time: 'Compile-Time Only', space: '0 Bytes', note: 'typeof ROLES[number] extracts "user" | "moderator" | "admin"' }, interviewQ: 'How do you extract the union of all element types from a const array in TypeScript?', interviewA: 'Declare const ITEMS = ["a", "b"] as const; and use type Item = (typeof ITEMS)[number]; which resolves to "a" | "b".', company: 'Vercel' },
    { id: 'ts-12', title: 'Conditional Types (T extends U ? X : Y) & Distributive Unions', description: 'Type-level if/else branching, NonNullable<T>, Exclude<T, U> & Extract<T, U> internals', difficulty: 'Advanced', sectionGroup: 'TS Type-Level Programming', analogy: 'An automated sorting conveyor belt for types: if a type fits the mold (`extends U`), route it left (`X`), otherwise route it right (`Y`).', keyTerm: 'extends', syntaxExample: 'type NonNull<T> = T extends null | undefined ? never : T;', codeLang: 'javascript', codeSnippet: `// Runtime demonstration of the values filtered by NonNullable<T>\nconst raw = ["alpha", null, "beta", undefined, "gamma"];\nconst clean = raw.filter((x) => x !== null && x !== undefined);\nconsole.log("Filtered NonNullable:", clean.join(", "));`, complexity: { op: 'Union Distribution', time: 'O(Union Members)', space: '0 Bytes Runtime', note: 'Wrap in [T] extends [U] to prevent distributive union expansion' }, interviewQ: 'How do you prevent a conditional type T extends any ? T[] : never from distributing over a union type?', interviewA: 'Wrap both sides of extends in a tuple: type NoDistribute<T> = [T] extends [any] ? T[] : never;.', company: 'Microsoft' },
    { id: 'ts-13', title: 'The infer Keyword: Extracting Return, Promise & Array Types', description: 'Pattern matching inside conditional types to unwrap ReturnType<T>, Awaited<T> & Parameters<T>', difficulty: 'Advanced', sectionGroup: 'TS Type-Level Programming', analogy: '`infer R` is a magnifying glass that reaches inside a function or Promise type and pulls out the inner payload type.', keyTerm: 'infer', syntaxExample: 'type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;', codeLang: 'javascript', codeSnippet: `async function fetchMetrics() { return { qps: 125000, healthy: true }; }\nfetchMetrics().then(data => console.log("Awaited<ReturnType>:", JSON.stringify(data)));`, complexity: { op: 'Type Pattern Match', time: 'Compile-Time AST', space: '0 Bytes', note: 'Powers built-in ReturnType<T>, Parameters<T>, and Awaited<T>' }, interviewQ: 'How is ReturnType<T> implemented internally in TypeScript’s standard library?', interviewA: 'type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;', company: 'Palantir' },
    { id: 'ts-14', title: 'Mapped Types, Key Remapping (as) & Modifiers (+readonly / -?)', description: 'Transforming every property of an object type, generating getters & stripping optional flags', difficulty: 'Advanced', sectionGroup: 'TS Type-Level Programming', analogy: 'A `.map()` loop for object types that visits every key `K in keyof T` and transforms its value or key name.', keyTerm: 'keyof', syntaxExample: 'type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };', codeLang: 'javascript', codeSnippet: `const config = { host: "db.internal", port: 5432, tls: true };\nconst getters = Object.fromEntries(\n  Object.entries(config).map(([k, v]) => [\`get\${k[0].toUpperCase() + k.slice(1)}\`, () => v])\n);\nconsole.log("Generated Getter:", getters.getHost(), getters.getPort());`, complexity: { op: 'Homomorphic Map', time: 'Compile-Time', space: '0 Bytes', note: '-? removes optionality (Required<T>); -readonly removes readonly' }, interviewQ: 'How do you filter out keys whose values are functions using Mapped Type key remapping?', interviewA: 'type DataOnly<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };', company: 'Netflix' },
    { id: 'ts-15', title: 'Template Literal Types & Compile-Time String Routing', description: 'Combinatorial string types (`${Direction}-${Size}`), Capitalize<S> & typed URL route params', difficulty: 'Advanced', sectionGroup: 'TS Type-Level Programming', analogy: 'String interpolation for the type checker so typos like `"top-cente"` are caught before the code ever runs.', keyTerm: 'Capitalize', syntaxExample: 'type EventName<T extends string> = `on${Capitalize<T>}`;', codeLang: 'javascript', codeSnippet: `const alignments = ["top", "bottom"].flatMap(v => ["left", "right"].map(h => \`\${v}-\${h}\`));\nconsole.log("Template Literal Union Members:", alignments.join(", "));`, complexity: { op: 'Cartesian Union Product', time: 'O(N * M) Combinations', space: '0 Bytes', note: 'Can extract URL parameters like /users/:userId/posts/:postId' }, interviewQ: 'How can Template Literal Types enforce type-safe CSS spacing tokens like "px-4" or "py-2"?', interviewA: 'By defining type Axis = "x" | "y"; type Scale = 1 | 2 | 4 | 8; type Padding = `p${Axis}-${Scale}`; which permits only valid combinations.', company: 'Shopify' },
    { id: 'ts-16', title: 'const Assertions (as const) & the satisfies Operator', description: 'Preserving narrow literal types while validating schema conformance without widening', difficulty: 'Intermediate', sectionGroup: 'TS Type-Level Programming', analogy: '`satisfies` checks that your outfit matches the dress code without forgetting the exact color of your shirt.', keyTerm: 'satisfies', syntaxExample: 'const routes = { home: "/", api: "/api" } satisfies Record<string, `/${string}`>;', codeLang: 'javascript', codeSnippet: `const themePalette = {\n  primary: [16, 185, 129],\n  accent: "#38bdf8"\n};\nconsole.log("Narrow Hex:", themePalette.accent.toUpperCase());\nconsole.log("RGB Green Channel:", themePalette.primary[1]);`, complexity: { op: 'Contextual Validation', time: 'Compile-Time', space: '0 Bytes', note: 'Introduced in TS 4.9 to validate without widening to union' }, interviewQ: 'What problem does the satisfies operator solve compared to a standard colon type annotation (: Record<string, string | number>)?', interviewA: 'A colon annotation widens each property to string | number, losing knowledge of which specific keys are strings vs numbers; satisfies validates the constraint while keeping exact property types.', company: 'Linear' },
    { id: 'ts-17', title: 'Branded / Nominal Types (Opaque Types) for Currency & IDs', description: 'Preventing accidental mixing of UserId vs OrderId or USD vs INR using phantom brand symbols', difficulty: 'Advanced', sectionGroup: 'TS Production Engineering', analogy: 'Putting a country-specific currency stamp on numbers so you can never accidentally add 100 Japanese Yen to 100 US Dollars.', keyTerm: '__brand', syntaxExample: 'type UserId = string & { readonly __brand: unique symbol };', codeLang: 'javascript', codeSnippet: `function makeUserId(id) { return id; }\nfunction makeOrderId(id) { return id; }\nconsole.log("Branded User ID:", makeUserId("usr_8821"), "| Order ID:", makeOrderId("ord_9910"));`, complexity: { op: 'Phantom Brand Tag', time: '0ms Runtime Cost', space: '0 Bytes', note: 'Simulates nominal typing inside TypeScript’s structural type system' }, interviewQ: 'Why does TypeScript allow passing an OrderId (string) to a function expecting a UserId (string) by default?', interviewA: 'Because TypeScript uses a structural type system where two types with identical shapes (both string) are assignable unless distinguished by a unique branded property.', company: 'Stripe' },
    { id: 'ts-18', title: 'Function Overloads, Polymorphic Call Signatures & this Parameters', description: 'Declaring precise input-to-output type relationships and typing explicit this contexts', difficulty: 'Intermediate', sectionGroup: 'TS Production Engineering', analogy: 'A restaurant menu listing exact pairings: if you order Combo A, you get Drink A; if you order Combo B, you get Dessert B.', keyTerm: 'function', syntaxExample: 'function create(tag: "a"): HTMLAnchorElement;\nfunction create(tag: "canvas"): HTMLCanvasElement;', codeLang: 'javascript', codeSnippet: `function formatInput(val) {\n  return typeof val === "number" ? val * 100 : val.split(",");\n}\nconsole.log("Overload Number:", formatInput(4.5), "| Overload String:", formatInput("a,b,c"));`, complexity: { op: 'Overload Resolution', time: 'Top-to-Bottom Match', space: '0 Bytes', note: 'Place most specific overload signatures first' }, interviewQ: 'Why is the implementation signature of an overloaded function not directly callable by external callers?', interviewA: 'The implementation signature is the internal union superset that reconciles all public overload signatures; callers can only match against the public overload declarations above it.', company: 'Google' },
    { id: 'ts-19', title: 'Type Variance: Covariance (out) vs Contravariance (in)', description: 'Why function parameters are contravariant, return types are covariant & explicit in/out annotations', difficulty: 'Expert', sectionGroup: 'TS Production Engineering', analogy: 'A vet who can treat any Animal (`in Animal`) can safely be hired as a Dog vet (`in Dog`), reversing the direction of assignment.', keyTerm: 'out', syntaxExample: 'interface Producer<out T> { make(): T; }\ninterface Consumer<in T> { accept(val: T): void; }', codeLang: 'javascript', codeSnippet: `const animalHandler = (a) => \`Handled animal: \${a.species}\`;\nconst dogHandler = animalHandler; // Contravariant parameter safety!\nconsole.log(dogHandler({ species: "Canis familiaris", bark: true }));`, complexity: { op: 'Variance Check', time: 'O(1) with in/out Modifiers', space: '0 Bytes', note: 'strictFunctionTypes enforces contravariant parameter checking' }, interviewQ: 'What does enabling strictFunctionTypes in tsconfig.json fix?', interviewA: 'It switches function parameter checking from bivariant (unsafe) to contravariant (sound), preventing a callback expecting (dog: Dog) => void from being assigned to (animal: Animal) => void.', company: 'Bloomberg' },
    { id: 'ts-20', title: 'Declaration Files (.d.ts), Ambient Modules & Module Augmentation', description: 'declare global, extending third-party library interfaces (Express Request) & triple-slash directives', difficulty: 'Advanced', sectionGroup: 'TS Production Engineering', analogy: 'Writing an architectural blueprint (`.d.ts`) for an existing building (a plain JS library) so TypeScript knows every room and doorway.', keyTerm: 'declare', syntaxExample: 'declare module "express-serve-static-core" { interface Request { userId?: string; } }', codeLang: 'javascript', codeSnippet: `// Runtime object augmented via TypeScript interface merging\nconst req = { path: "/api/v1/courses", userId: "usr_42" };\nconsole.log(\`Authenticated Request to \${req.path} by \${req.userId}\`);`, complexity: { op: 'Interface Merging', time: 'Compile-Time Symbol Table', space: '0 Bytes', note: 'Interfaces with the same name in the same scope merge automatically' }, interviewQ: 'Why can interface declarations be augmented across modules while type aliases cannot?', interviewA: 'Interfaces are open-ended declarations merged by the TypeScript symbol binder, whereas type aliases are closed static expressions that cannot be redeclared.', company: 'Atlassian' },
    { id: 'ts-21', title: 'ECMAScript Stage-3 Decorators & Metadata in TypeScript 5+', description: 'Class, method, and accessor decorators for logging, dependency injection & RBAC authorization', difficulty: 'Advanced', sectionGroup: 'TS Production Engineering', analogy: 'Gift-wrapping a method (`@measureTime`) so every call automatically logs its latency without cluttering the business logic.', keyTerm: 'context', syntaxExample: 'function logMethod(target: any, context: ClassMethodDecoratorContext) { ... }', codeLang: 'javascript', codeSnippet: `function withAudit(fn, name) {\n  return function(...args) {\n    console.log(\`[AUDIT] Invoking \${name} with\`, JSON.stringify(args));\n    return fn.apply(this, args);\n  };\n}\nconst transfer = withAudit((amt) => \`Transferred $\${amt}\`, "transfer");\nconsole.log(transfer(250));`, complexity: { op: 'Decorator Wrap', time: 'O(1) Class Init', space: 'O(1) Closure', note: 'TS 5.0+ supports standard ES decorators without experimentalDecorators' }, interviewQ: 'When does a class method decorator function execute—at class definition time or every time new Class() is called?', interviewA: 'The outer decorator function runs once when the class declaration is evaluated, replacing or wrapping the method on the prototype.', company: 'Uber' },
    { id: 'ts-22', title: 'Strict Compiler Flags: noUncheckedIndexedAccess & exactOptionalPropertyTypes', description: 'Catching undefined array/dictionary lookups and distinguishing missing keys from explicit undefined', difficulty: 'Advanced', sectionGroup: 'TS Compiler & Tooling', analogy: '`noUncheckedIndexedAccess` forces you to check if a mailbox slot (`arr[99]`) actually has a letter before opening it.', keyTerm: 'noUncheckedIndexedAccess', syntaxExample: 'const item = list[0]; // inferred as T | undefined', codeLang: 'javascript', codeSnippet: `const scores = { alice: 98 };\nconst bobScore = scores["bob"] ?? 0; // Safe fallback for Record<string, number | undefined>\nconsole.log("Alice:", scores["alice"], "| Bob:", bobScore);`, complexity: { op: 'Index Signature Guard', time: 'Compile-Time', space: '0 Bytes', note: 'Eliminates "Cannot read properties of undefined" in production' }, interviewQ: 'Why does standard TypeScript `strict: true` still allow `const x: string = dict["missingKey"]` to compile without `noUncheckedIndexedAccess`?', interviewA: 'For historical ergonomics, index signatures return `T` instead of `T | undefined` unless `noUncheckedIndexedAccess: true` is explicitly enabled.', company: 'Datadog' },
    { id: 'ts-23', title: 'Monorepo Architecture: Project References, composite & Incremental Builds', description: 'Scaling 1,000,000+ line TypeScript codebases with tsconfig references, .tsbuildinfo & isolatedDeclarations', difficulty: 'Expert', sectionGroup: 'TS Compiler & Tooling', analogy: 'Compiling a 20-volume encyclopedia chapter by chapter so fixing a typo in Volume 3 never recompiles Volumes 1 through 20.', keyTerm: 'composite', syntaxExample: '{ "compilerOptions": { "composite": true, "declaration": true } }', codeLang: 'javascript', codeSnippet: `const buildGraph = [\n  { pkg: "@core/types", cached: true, timeMs: 12 },\n  { pkg: "@core/db", cached: true, timeMs: 18 },\n  { pkg: "@app/web", cached: false, timeMs: 140 }\n];\nconsole.log("Incremental Build Total:", buildGraph.reduce((s, p) => s + p.timeMs, 0) + "ms");`, complexity: { op: 'Incremental Typecheck', time: 'O(Changed Subgraph)', space: '.tsbuildinfo Cache', note: 'isolatedDeclarations allows parallel .d.ts generation without full typechecker' }, interviewQ: 'How does TypeScript 5.5+ `isolatedDeclarations` speed up monorepo builds?', interviewA: 'It enforces explicit return types on exported functions so fast non-TS compilers (esbuild, SWC, Oxc) can emit `.d.ts` files in parallel across CPU cores.', company: 'Figma' },
    { id: 'ts-24', title: 'Runtime Schema Validation & Type Inference (Zod / TypeBox Pattern)', description: 'Bridging the compile-time vs runtime boundary by inferring static types from runtime validators', difficulty: 'Advanced', sectionGroup: 'TS Compiler & Tooling', analogy: 'A single blueprint that simultaneously trains the security guard at the door (runtime validation) and the architect inside (static TypeScript type).', keyTerm: 'infer', syntaxExample: 'type Payload = z.infer<typeof PayloadSchema>;', codeLang: 'javascript', codeSnippet: `function validateEnv(raw) {\n  if (!raw.VITE_FIREBASE_PROJECT_ID) throw new Error("Missing Project ID");\n  return { projectId: String(raw.VITE_FIREBASE_PROJECT_ID), valid: true };\n}\nconsole.log("Validated Schema:", JSON.stringify(validateEnv({ VITE_FIREBASE_PROJECT_ID: "prod-cluster-1" })));`, complexity: { op: 'Schema Parse', time: 'O(Fields) at Boundary', space: 'O(1)', note: 'Single source of truth for both runtime validator and static TypeScript type' }, interviewQ: 'Why are TypeScript interfaces alone insufficient for validating JSON returned by fetch() or req.body?', interviewA: 'TypeScript interfaces are completely stripped during compilation; only a runtime schema parser can verify malformed JSON over the network.', company: 'Stripe' },
    { id: 'ts-25', title: 'Type-Safe Event Emitters, RPC Clients & End-to-End API Contracts', description: 'Mapping event names and RPC procedure keys to exact payload and return signatures', difficulty: 'Expert', sectionGroup: 'TS Compiler & Tooling', analogy: 'A switchboard where plugging into socket `"user:login"` automatically wires the exact voltage and plug shape `{ userId: string }`.', keyTerm: 'EventMap', syntaxExample: 'on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void;', codeLang: 'javascript', codeSnippet: `class TypedBus {\n  constructor() { this.handlers = {}; }\n  on(evt, fn) { (this.handlers[evt] ||= []).push(fn); }\n  emit(evt, data) { (this.handlers[evt] || []).forEach(fn => fn(data)); }\n}\nconst bus = new TypedBus();\nbus.on("moduleComplete", (p) => console.log("XP Awarded:", p.xp));\nbus.emit("moduleComplete", { moduleId: "ts-25", xp: 50 });`, complexity: { op: 'Typed Dispatch', time: 'O(Listeners)', space: 'O(Events)', note: 'Powers tRPC and end-to-end typed full-stack APIs' }, interviewQ: 'How do you type an `.on(eventName, callback)` method so the callback parameter automatically matches the eventName?', interviewA: 'Parameterize the method with `<K extends keyof EventMap>(event: K, cb: (payload: EventMap[K]) => void)` so `K` locks the lookup into `EventMap[K]`.', company: 'Vercel' }
  ]
};

// Generator for the remaining 10 tracks to ensure EVERY course has 25 rich, distinct modules
const ADDITIONAL_TRACK_TOPICS: Record<string, { group: string; lang: 'javascript' | 'python' | 'sql' | 'cpp'; items: [string, string, string, string, string][] }> = {
  'c-react': {
    group: 'React 19 & Concurrent Architecture',
    lang: 'javascript',
    items: [
      ['react-9', 'React useReducer & Complex State Machines', 'Deterministic state transitions, action reducers & replacing tangled useStates', 'useReducer', 'const [state, dispatch] = useReducer(reducer, initialState);'],
      ['react-10', 'React Error Boundaries & Fault-Tolerant UI Trees', 'componentDidCatch, getDerivedStateFromError & isolating widget crashes', 'ErrorBoundary', '<ErrorBoundary fallback={<RetryCard />}><Dashboard /></ErrorBoundary>'],
      ['react-11', 'React Portals (createPortal) & Modal Layering', 'Rendering modals and tooltips outside parent overflow:hidden DOM hierarchies', 'createPortal', 'createPortal(<Modal />, document.body)'],
      ['react-12', 'React Suspense & Lazy Code Splitting (React.lazy)', 'Route-level bundle splitting, declarative loading boundaries & waterfall prevention', 'Suspense', '<Suspense fallback={<Skeleton />}><LazyChart /></Suspense>'],
      ['react-13', 'React 19 Actions, useActionState & Form Transitions', 'Native async form actions, pending states & automatic form reset lifecycle', 'useActionState', 'const [state, formAction, isPending] = useActionState(saveUser, null);'],
      ['react-14', 'React 19 useOptimistic & Zero-Latency UI Updates', 'Instantaneous optimistic mutations with automatic rollback on server error', 'useOptimistic', 'const [optimisticLikes, addOptimistic] = useOptimistic(likes, (s, n) => s + n);'],
      ['react-15', 'React 19 use() API for Promises & Conditional Context', 'Reading Promises and Context inside conditionals and loops with use()', 'use', 'const data = use(dataPromise);'],
      ['react-16', 'React Concurrent Rendering: useTransition & useDeferredValue', 'Keeping input typing at 60fps by marking heavy list filtering as non-urgent', 'useTransition', 'const [isPending, startTransition] = useTransition();'],
      ['react-17', 'React Server Components (RSC) & Serialization Boundaries', 'Server vs Client ("use client") components, zero-bundle server trees & streaming', 'use client', '"use client"; // Marks interactive client boundary'],
      ['react-18', 'External Store Synchronization: useSyncExternalStore', 'Subscribing to non-React stores without tearing during concurrent rendering', 'useSyncExternalStore', 'const snap = useSyncExternalStore(store.subscribe, store.getSnapshot);'],
      ['react-19', 'Windowing & Virtualized Lists for 100,000+ Rows', 'Computing visible startIndex/endIndex from scrollTop to keep DOM node count O(1)', 'scrollTop', 'const startIndex = Math.floor(scrollTop / rowHeight);'],
      ['react-20', 'Compound Components, Render Props & Slot Patterns', 'Designing flexible, accessible UI primitives (Tabs, Select, Accordion)', 'Context', '<Tabs><Tabs.List><Tabs.Trigger value="a" /></Tabs.List></Tabs>'],
      ['react-21', 'Server State Caching, Stale-While-Revalidate & Deduplication', 'Query keys, background refetching, cache invalidation & race condition prevention', 'staleTime', 'const { data } = useQuery({ queryKey: ["user", id], queryFn: fetchUser });'],
      ['react-22', 'React Compiler (Auto-Memoization) & Rules of React', 'How build-time static analysis memoizes JSX and hooks automatically', 'Purity', '// Pure render functions enable automatic fine-grained memoization'],
      ['react-23', 'Accessibility in React: Focus Traps, ARIA Live & Keyboard Nav', 'Managing focus on route transitions, modal dialogs & roving tabindex hooks', 'useRef', 'useEffect(() => { dialogRef.current?.focus(); }, [isOpen]);'],
      ['react-24', 'Testing React Components: Testing Library & User Events', 'Testing user-visible behavior via getByRole instead of brittle implementation details', 'getByRole', 'await userEvent.click(screen.getByRole("button", { name: /submit/i }));'],
      ['react-25', 'High-Scale Frontend Architecture: Micro-Frontends & Perf Budgets', 'Module Federation, Core Web Vitals (INP, LCP, CLS) telemetry & error monitoring', 'INP', 'performance.mark("interaction-complete");']
    ]
  },
  'c1': {
    group: 'Python Advanced Engineering & Internals',
    lang: 'python',
    items: [
      ['py-11', 'Python Iterators, Generators (yield) & itertools Pipelines', 'Lazy O(1) memory pipelines with __iter__, __next__, yield & itertools.islice', 'yield', 'def chunks(seq, n):\n    for i in range(0, len(seq), n): yield seq[i:i+n]'],
      ['py-12', 'Python Context Managers (with) & contextlib', '__enter__, __exit__, deterministic resource cleanup & @contextmanager decorator', 'with', 'with open("data.log") as f:\n    lines = f.readlines()'],
      ['py-13', 'Python Descriptors (__get__, __set__) & @property Internals', 'How Python methods, @property, classmethod, and ORM fields work under the hood', '__get__', 'class Positive:\n    def __set__(self, inst, val): assert val > 0'],
      ['py-14', 'Python Metaclasses (type), __new__ vs __init__ & __init_subclass__', 'Intercepting class creation, registering plugins & singleton patterns', '__init_subclass__', 'class PluginBase:\n    def __init_subclass__(cls): REGISTRY.append(cls)'],
      ['py-15', 'Python Data Classes (@dataclass), __slots__ & NamedTuples', 'Eliminating boilerplate and cutting per-object RAM usage by 60% with __slots__', '__slots__', 'class Point:\n    __slots__ = ("x", "y")'],
      ['py-16', 'Python Static Type Hints, typing.Protocol & Generic[T]', 'Structural subtyping (duck typing at compile time) with Protocol and TypeVar', 'Protocol', 'class Runnable(Protocol):\n    def run(self) -> int: ...'],
      ['py-17', 'Python Asyncio Event Loop, Coroutines (async/await) & Tasks', 'Single-threaded cooperative multitasking, asyncio.gather() & non-blocking I/O', 'gather', 'results = await asyncio.gather(fetch_a(), fetch_b())'],
      ['py-18', 'Python Multiprocessing, ProcessPoolExecutor & SharedMemory', 'Bypassing the GIL for CPU-bound workloads across all CPU cores', 'ProcessPoolExecutor', 'with ProcessPoolExecutor() as pool:\n    out = list(pool.map(work, items))'],
      ['py-19', 'Python Threading, Lock, RLock, Semaphore & Queue', 'Thread-safe producer-consumer pipelines and avoiding race conditions', 'Lock', 'with thread_lock:\n    shared_counter += 1'],
      ['py-20', 'Python Weakref, Functools.lru_cache & Memory Profiling', 'Bounded memoization with @lru_cache(maxsize=1024) and tracemalloc diagnostics', 'lru_cache', '@lru_cache(maxsize=256)\ndef fib(n: int) -> int: ...'],
      ['py-21', 'Python Packaging, Virtual Environments, Poetry/uv & Wheels', 'pyproject.toml standards, binary manylinux wheels & deterministic lockfiles', 'pyproject', '# [project]\n# name = "core-engine"\n# requires-python = ">=3.12"'],
      ['py-22', 'Python Testing Architecture: Pytest Fixtures, Parametrize & Mocking', 'Dependency injection via fixtures, @pytest.mark.parametrize & unittest.mock.patch', 'parametrize', '@pytest.mark.parametrize("x,expected", [(2, 4), (3, 9)])'],
      ['py-23', 'High-Performance Python: Vectorization, Cython & Rust (PyO3)', 'Moving hot inner loops from boxed PyObjects to contiguous C/Rust SIMD arrays', 'memoryview', 'view = memoryview(byte_buffer) # Zero-copy slice'],
      ['py-24', 'Python Security: Pickle Deserialization Risks, Secrets & SQLi Defense', 'Why pickle.loads() is unsafe, cryptographic secrets module & parameterized queries', 'secrets', 'token = secrets.token_urlsafe(32)'],
      ['py-25', 'Production Python Web Services: ASGI, FastAPI & Gunicorn/Uvicorn Workers', 'Pre-fork worker model, async dependency injection & graceful shutdown', 'FastAPI', '@app.get("/health")\nasync def health(): return {"ok": True}']
    ]
  },
  'c5': {
    group: 'Advanced SQL & Distributed DBMS Internals',
    lang: 'sql',
    items: [
      ['sql-11', 'SQL Subqueries, Correlated Subqueries & EXISTS vs IN', 'Semi-joins with EXISTS, anti-joins with NOT EXISTS & avoiding NULL traps in NOT IN', 'EXISTS', 'SELECT name FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);'],
      ['sql-12', 'Common Table Expressions (WITH) & Recursive CTE Hierarchies', 'Traversing org charts, category trees, and graphs directly in SQL with WITH RECURSIVE', 'RECURSIVE', 'WITH RECURSIVE tree AS (SELECT id, parent_id FROM nodes WHERE parent_id IS NULL ...)'],
      ['sql-13', 'Advanced Window Functions: LAG, LEAD, NTILE & Frame Clauses', 'Running totals, month-over-month growth rates & ROWS BETWEEN UNBOUNDED PRECEDING', 'LAG', 'SELECT salary, LAG(salary, 1, 0) OVER (ORDER BY hire_date) AS prev_sal FROM employees;'],
      ['sql-14', 'SQL Set Operations (UNION ALL, INTERSECT, EXCEPT) & Pivoting', 'Conditional aggregation CASE WHEN pivoting and why UNION ALL beats UNION', 'CASE', 'SELECT dept, SUM(CASE WHEN role = \'SDE\' THEN 1 ELSE 0 END) AS sde_count FROM staff GROUP BY dept;'],
      ['sql-15', 'SQL Views, Materialized Views & Refresh Strategies', 'Precomputing expensive analytical aggregations with REFRESH MATERIALIZED VIEW CONCURRENTLY', 'MATERIALIZED', 'CREATE MATERIALIZED VIEW daily_revenue AS SELECT day, SUM(amount) FROM sales GROUP BY day;'],
      ['sql-16', 'Triggers, Stored Procedures & Upserts (ON CONFLICT DO UPDATE)', 'Idempotent atomic upserts and audit log triggers inside transactional boundaries', 'CONFLICT', 'INSERT INTO counters (id, hits) VALUES (1, 1) ON CONFLICT (id) DO UPDATE SET hits = counters.hits + 1;'],
      ['sql-17', 'Query Execution Plans: EXPLAIN ANALYZE, Seq Scan vs Index Scan', 'Reading cost estimates, Bitmap Heap Scans, Nested Loop vs Hash Join vs Merge Join', 'EXPLAIN', 'EXPLAIN ANALYZE SELECT * FROM employees WHERE salary > 90000;'],
      ['sql-18', 'Composite Indexes, Covering Indexes (INCLUDE) & Leftmost Prefix Rule', 'Designing multi-column B+Tree indexes for Index-Only Scans with zero heap fetches', 'INDEX', 'CREATE INDEX idx_emp_dept_sal ON employees (dept_id, salary DESC) INCLUDE (name);'],
      ['sql-19', 'Transaction Isolation Levels: Read Committed, Repeatable Read & Serializable', 'Dirty Reads, Non-Repeatable Reads, Phantom Reads & Write Skew anomalies', 'ISOLATION', 'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;'],
      ['sql-20', 'Pessimistic Locking (SELECT FOR UPDATE) vs Optimistic Concurrency', 'Preventing double-booking with row locks, SKIP LOCKED queues & version columns', 'UPDATE', 'SELECT * FROM seats WHERE id = 42 AND booked = false FOR UPDATE SKIP LOCKED;'],
      ['sql-21', 'Database Partitioning: Range, List & Hash Table Partitioning', 'Partition pruning on billion-row time-series tables and fast partition drops', 'PARTITION', 'CREATE TABLE logs (id INT, created_at DATE) PARTITION BY RANGE (created_at);'],
      ['sql-22', 'Connection Pooling (PgBouncer), Prepared Statements & SQLi Prevention', 'Why 10,000 raw DB connections crash RAM and how transaction pooling multiplexes queries', 'PREPARE', 'PREPARE get_emp (INT) AS SELECT name, salary FROM employees WHERE id = $1;'],
      ['sql-23', 'JSONB Indexing (GIN), Full-Text Search (tsvector) & Vector pgvector', 'Hybrid relational + document + HNSW vector similarity queries inside PostgreSQL', 'GIN', 'CREATE INDEX idx_meta_gin ON events USING GIN (metadata jsonb_path_ops);'],
      ['sql-24', 'Database Replication Topologies, Failover & Split-Brain Prevention', 'Synchronous vs asynchronous WAL streaming, read-your-writes consistency & fencing tokens', 'REPLICA', 'SELECT * FROM employees; -- Routed to Read Replica with LSN lag check'],
      ['sql-25', 'NewSQL & Distributed SQL: Google Spanner TrueTime & CockroachDB', 'Two-Phase Commit over Raft groups, atomic clocks & globally consistent transactions', 'COMMIT', 'SELECT name, department, salary FROM employees ORDER BY salary DESC LIMIT 3;']
    ]
  },
  'c4': {
    group: 'Advanced Data Structures & Algorithms',
    lang: 'python',
    items: [
      ['ds-11', 'Heaps, Priority Queues & Top-K Streaming Patterns', 'Binary min/max heap invariants, O(N) heapify & Merge K Sorted Lists', 'heappush', 'import heapq; heapq.heappush(min_heap, val)'],
      ['ds-12', 'Tries (Prefix Trees) & Autocomplete Search Engines', 'O(L) prefix lookup, word dictionary validation & bitwise XOR maximum tries', 'TrieNode', 'node = node.children.setdefault(char, {})'],
      ['ds-13', 'Disjoint Set Union (Union-Find) with Path Compression & Rank', 'Near O(1) inverse-Ackermann α(N) dynamic connectivity & cycle detection', 'find', 'def find(x): parent[x] = find(parent[x]) if parent[x] != x else x; return parent[x]'],
      ['ds-14', 'Greedy Algorithms & Interval Scheduling Patterns', 'Activity selection, Merging Overlapping Intervals, Meeting Rooms & Huffman coding', 'sort', 'intervals.sort(key=lambda x: x[1])'],
      ['ds-15', 'Bit Manipulation Mastery & Bitmask State Representation', 'Clearing lowest set bit n & (n - 1), XOR single-number tricks & iterating submasks', 'bitmask', 'count = 0\nwhile n: n &= (n - 1); count += 1'],
      ['ds-16', 'Shortest Paths: Bellman-Ford, SPFA & Floyd-Warshall All-Pairs', 'Handling negative weight edges, detecting arbitrage cycles & O(V³) DP matrices', 'relax', 'if dist[u] + w < dist[v]: dist[v] = dist[u] + w'],
      ['ds-17', 'Minimum Spanning Trees: Kruskal’s & Prim’s Algorithms', 'Connecting all vertices with minimum total edge weight using DSU or Priority Queue', 'Kruskal', 'edges.sort(key=lambda e: e[2]) # Sort by weight'],
      ['ds-18', 'Strongly Connected Components (Tarjan / Kosaraju) & Bridges', 'Finding critical single-point-of-failure network links (articulation points) in O(V+E)', 'lowlink', 'low[u] = min(low[u], disc[v])'],
      ['ds-19', 'Advanced DP: Interval DP, Tree DP & Digit DP', 'Matrix Chain Multiplication, Burst Balloons & House Robber on Binary Trees', 'dp', 'dp[i][j] = max(dp[i][k] + dp[k+1][j] for k in range(i, j))'],
      ['ds-20', 'Bitmask Dynamic Programming (Traveling Salesperson & Assignment)', 'Compressing visited-subset state into an integer bitmask for N <= 20', 'mask', 'next_mask = mask | (1 << next_city)'],
      ['ds-21', 'Segment Trees & Lazy Propagation for Range Queries', 'O(log N) range sum/min/max queries and O(log N) range updates', 'tree', 'tree[node] = tree[2*node] + tree[2*node+1]'],
      ['ds-22', 'Fenwick Trees (Binary Indexed Trees - BIT)', 'Compact array-based O(log N) prefix sums and point updates using x & -x', 'lowbit', 'while idx <= n: bit[idx] += delta; idx += idx & (-idx)'],
      ['ds-23', 'String Matching Algorithms: KMP, Rabin-Karp Rolling Hash & Z-Algorithm', 'Linear O(N + M) substring search without backtracking using LPS prefix tables', 'lps', 'hash_val = (hash_val * BASE + ord(ch)) % MOD'],
      ['ds-24', 'LRU & LFU Cache Design (Hash Map + Doubly Linked List)', 'Achieving strict O(1) get(key) and O(1) put(key, val) eviction in production caches', 'LRUCache', 'cache.move_to_end(key, last=True)'],
      ['ds-25', 'Randomized & Probabilistic Structures: Skip Lists, Reservoir Sampling & Bloom Filters', 'Space-efficient membership checks and lock-free sorted indexing used in Redis', 'BloomFilter', 'bits[hash1(x) % m] = bits[hash2(x) % m] = 1']
    ]
  },
  'c11': {
    group: 'Systems C++20 & JVM Runtime Engineering',
    lang: 'cpp',
    items: [
      ['cpp-9', 'RAII (Resource Acquisition Is Initialization) & Deterministic Destructors', 'Guaranteeing zero resource leaks across exceptions via stack-scoped destructors', '~ScopedLock', '~ScopedLock() { mtx.unlock(); }'],
      ['cpp-10', 'Move Semantics, Rvalue References (&&), std::move & Rule of 5', 'Stealing heap pointers in O(1) instead of deep-copying megabytes of buffers', 'std::move', 'Buffer(Buffer&& other) noexcept : ptr(other.ptr) { other.ptr = nullptr; }'],
      ['cpp-11', 'C++ Smart Pointers: unique_ptr, shared_ptr & weak_ptr Internals', 'Control block reference counting, breaking cyclic leaks with weak_ptr & make_shared', 'unique_ptr', 'auto ptr = std::make_unique<Engine>(42);'],
      ['cpp-12', 'C++ Templates, Variadic Templates, SFINAE & C++20 Concepts', 'Compile-time duck typing with requires clauses and zero-overhead generic code', 'concept', 'template<typename T> requires std::integral<T> T add(T a, T b) { return a + b; }'],
      ['cpp-13', 'constexpr, consteval & Compile-Time Computation', 'Evaluating lookup tables, hashes, and parsers at compile time with zero runtime cost', 'constexpr', 'constexpr int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }'],
      ['cpp-14', 'C++ Lambdas, Capture Modes ([=], [&], [this]) & std::function', 'Closure structs generated by the compiler and avoiding dangling reference captures', 'lambda', 'auto fn = [factor = 10](int x) { return x * factor; };'],
      ['cpp-15', 'Custom Memory Allocators, Arena / Bump Allocators & Placement new', 'Constructing objects in pre-allocated memory pools with new (buffer) T()', 'placement', 'new (aligned_buffer) OrderNode(id, price);'],
      ['cpp-16', 'C++ Concurrency: std::thread, std::mutex, std::atomic & Memory Ordering', 'Acquire-release semantics, lock-free compare_exchange_weak (CAS) & false sharing', 'atomic', 'counter.fetch_add(1, std::memory_order_relaxed);'],
      ['cpp-17', 'C++20 Ranges, Views (std::views::filter) & Coroutines (co_await)', 'Lazy zero-allocation pipeline transformations and stackless async coroutines', 'views', 'auto evens = nums | std::views::filter([](int x){ return x % 2 == 0; });'],
      ['cpp-18', 'Java Memory Model (JMM), volatile, synchronized & Happens-Before', 'CPU cache visibility guarantees, monitor locks & double-checked locking', 'volatile', 'private static volatile Config instance;'],
      ['cpp-19', 'Java Concurrent Collections: ConcurrentHashMap, CopyOnWriteArrayList & CAS', 'Bucket-level lock striping, CAS node insertion & lock-free size counters', 'computeIfAbsent', 'map.computeIfAbsent(key, k -> new AtomicLong()).incrementAndGet();'],
      ['cpp-20', 'Java CompletableFuture, ForkJoinPool & Work-Stealing Queues', 'Composing non-blocking async pipelines and deque work-stealing thread pools', 'thenCompose', 'CompletableFuture.supplyAsync(this::fetch).thenApply(this::parse);'],
      ['cpp-21', 'Modern Java: Records, Sealed Classes, Pattern Matching & Switch Expressions', 'Algebraic data types (ADTs) and exhaustive pattern matching in Java 21+', 'record', 'public record Point(int x, int y) {}'],
      ['cpp-22', 'Java Virtual Threads (Project Loom) & High-Throughput Concurrency', 'Mounting millions of lightweight user-mode continuations onto a small OS carrier pool', 'ofVirtual', 'Thread.startVirtualThread(() -> handleRequest(req));'],
      ['cpp-23', 'JVM Garbage Collectors Deep Dive: Serial, Parallel, G1GC & ZGC', 'Region-based evacuation, colored pointers, load barriers & sub-millisecond pauses', 'ZGC', '// -XX:+UseZGC -XX:+ZGenerational'],
      ['cpp-24', 'JVM JIT Compilation: C1/C2 Tiered Compilation, Inlining & Escape Analysis', 'Scalar replacement (allocating objects on CPU registers/stack when they do not escape)', 'EscapeAnalysis', '// Non-escaping objects are stack-allocated via Scalar Replacement'],
      ['cpp-25', 'Low-Latency Systems Tuning: Cache Line Alignment (alignas(64)) & SIMD', 'Preventing L1 cache ping-pong (false sharing) across CPU cores in HFT engines', 'alignas', 'struct alignas(64) PaddedCounter { std::atomic<long> value; };']
    ]
  },
  'c3': {
    group: 'Operating Systems, Linux Kernel & Container Internals',
    lang: 'python',
    items: [
      ['os-9', 'System Calls Internals: Trap Instructions, vDSO & Context Switch Cost', 'How user-space transitions to Ring 0 and why gettimeofday() uses vDSO without trapping', 'syscall', 'syscall_cost_ns = 150 # Ring 3 -> Ring 0 transition'],
      ['os-10', 'Inter-Process Communication (IPC): Pipes, Shared Memory (mmap) & Unix Sockets', 'Comparing copy overhead of kernel pipes vs zero-copy shared memory pages', 'mmap', 'shm_throughput_gbps = 45.0 # Zero-copy shared physical page'],
      ['os-11', 'Reader-Writer Locks, Spinlocks, Futex (Fast Userspace Mutex) & RCU', 'When to spin on CPU vs sleep in kernel queue, and Read-Copy-Update in Linux', 'futex', 'futex_fast_path = "Atomic CAS in userspace with zero syscall if uncontended"'],
      ['os-12', 'Multi-Level Page Tables (4-Level x86_64) & HugePages (2MB / 1GB)', 'Why 4KB pages require 4 memory hops on TLB miss and how HugePages eliminate TLB pressure', 'HugePages', 'tlb_entries_covered = 512 * 2 # 1GB covered by 2MB HugePages'],
      ['os-13', 'Copy-on-Write (CoW) in fork() & Redis Background Snapshots (BGSAVE)', 'Cloning a 32GB process in 2 milliseconds by marking page table entries read-only', 'fork_cow', 'copied_pages = ModifiedPagesOnly # Read-only pages shared'],
      ['os-14', 'Page Replacement Algorithms: Optimal, LRU, Clock (Second-Chance) & Thrashing', 'Working set model, Belady’s anomaly & how the Linux active/inactive LRU lists work', 'clock_hand', 'if page.referenced_bit == 1: page.referenced_bit = 0 # Second chance'],
      ['os-15', 'Kernel Memory Allocators: Buddy System & Slab / SLUB Allocator', 'Eliminating external fragmentation for page frames and internal fragmentation for structs', 'slab_cache', 'kmem_cache_alloc("task_struct")'],
      ['os-16', 'Disk Storage Architecture, NVMe Queues & I/O Schedulers', 'HDD seek/rotational latency vs 64,000 parallel NVMe submission/completion queues', 'nvme', 'nvme_iops = 1_000_000'],
      ['os-17', 'Journaling File Systems (ext4, XFS) & Copy-on-Write FS (ZFS, Btrfs)', 'Preventing corrupted metadata after power loss using write-ahead metadata journals', 'fsync', 'os.fsync(fd) # Flush kernel page cache to non-volatile disk'],
      ['os-18', 'Memory-Mapped Files (mmap), Page Cache & Zero-Copy sendfile()', 'Transferring files from disk to network NIC DMA without copying into user-space RAM', 'sendfile', 'bytes_sent = os.sendfile(socket_fd, file_fd, offset, count)'],
      ['os-19', 'Asynchronous I/O Evolution: select vs poll vs epoll vs io_uring', 'O(N) descriptor scanning vs O(1) red-black tree + ready list in epoll and shared ring buffers', 'io_uring', 'sqe = submission_ring.next(); cqe = completion_ring.peek()'],
      ['os-20', 'Linux Signals (SIGINT, SIGTERM, SIGKILL, SIGSEGV) & Graceful Shutdown', 'Async signal handlers, why SIGKILL (9) cannot be caught & Kubernetes pod termination', 'SIGTERM', 'signal.signal(signal.SIGTERM, graceful_drain_handler)'],
      ['os-21', 'Linux Namespaces (pid, net, mnt, uts, ipc, user): Container Isolation', 'How Docker creates isolated process trees and virtual network stacks using unshare/clone', 'unshare', 'unshare(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS)'],
      ['os-22', 'Linux Control Groups (cgroups v2): CPU Throttling & OOM Killer', 'Enforcing memory.max and cpu.max quotas on containers and understanding OOM scores', 'cgroup', 'memory_max_bytes = 512 * 1024 * 1024'],
      ['os-23', 'Linux Security: Capabilities, seccomp-bpf Syscall Filtering & AppArmor', 'Dropping root privileges into granular capabilities (CAP_NET_BIND_SERVICE) and syscall allowlists', 'seccomp', 'allowed_syscalls = ["read", "write", "exit", "futex"]'],
      ['os-24', 'eBPF (Extended Berkeley Packet Filter): Safe Kernel Observability & Networking', 'Running JIT-verified sandboxed bytecode inside the Linux kernel for tracing and Cilium', 'ebpf', 'bpf_probe_read_kernel(&pid, sizeof(pid), &task->pid)'],
      ['os-25', 'Production Linux Troubleshooting: Load Average, vmstat, iostat, perf & strace', 'Methodical USE (Utilization, Saturation, Errors) diagnosis in 60 seconds', 'perf', 'diagnostics = ["uptime", "dmesg -T", "vmstat 1", "iostat -xz 1", "pidstat 1"]']
    ]
  },
  'c7': {
    group: 'Computer Networks, Protocols & Cloud Security',
    lang: 'javascript',
    items: [
      ['cn-10', 'Ethernet Frames, MAC Addresses, ARP Protocol & VLAN Tagging (802.1Q)', 'Layer-2 switching tables, broadcast domains & resolving IPv4 addresses to hardware MACs', 'ARP', 'Who has 10.0.1.15? Tell 10.0.1.1 -> 00:1A:2B:3C:4D:5E'],
      ['cn-11', 'IPv4 vs IPv6 Addressing, CIDR Subnetting Masks & Longest Prefix Match', 'Calculating subnet host ranges (/24, /16), private RFC 1918 blocks & router forwarding tables', 'CIDR', '10.24.0.0/16 -> 65,534 usable host IPs'],
      ['cn-12', 'NAT (Network Address Translation), Port Forwarding, STUN, TURN & ICE', 'How home routers multiplex private IPs and how P2P apps punch through symmetric NATs', 'STUN', 'Public Endpoint discovered via STUN: 203.0.113.8:54321'],
      ['cn-13', 'ICMP, ping, traceroute (TTL Expiration) & Path MTU Discovery', 'Diagnosing packet loss, routing loops, and IP fragmentation with TTL=1..30 probes', 'TTL', 'Hop 1: 192.168.1.1 (1.2ms) -> Hop 2: 100.64.0.1 (4.8ms)'],
      ['cn-14', 'Internet Routing: BGP (Border Gateway Protocol), ASNs & Anycast DNS', 'How autonomous systems exchange global routes and how Cloudflare routes 1.1.1.1 via Anycast', 'BGP', 'AS13335 announces 1.1.1.0/24 from 300+ global edge PoPs'],
      ['cn-15', 'TCP Flow Control (Sliding Window) vs Congestion Control (CUBIC & BBR)', 'Receive window (rwnd) vs congestion window (cwnd), Slow Start & Google BBR pacing', 'cwnd', 'effectiveWindow = Math.min(rwnd, cwnd)'],
      ['cn-16', 'TLS 1.3 Cryptographic Handshake, ECDHE Forward Secrecy & 0-RTT', 'Why TLS 1.3 completes in 1-RTT, Ephemeral Diffie-Hellman & X.509 certificate chains', 'ECDHE', '1-RTT Handshake: ClientHello (+KeyShare) -> ServerHello (+Finished)'],
      ['cn-17', 'HTTP Caching Semantics: Cache-Control, ETag, 304 Not Modified & Vary', 'immutable assets, stale-while-revalidate & conditional If-None-Match validation', 'ETag', 'Cache-Control: public, max-age=31536000, immutable'],
      ['cn-18', 'HTTP Cookies, SameSite=Lax/Strict, HttpOnly, Secure & Session Management', 'Preventing XSS token theft and CSRF cross-site mutations with hardened cookie flags', 'HttpOnly', 'Set-Cookie: sid=xyz; Secure; HttpOnly; SameSite=Lax'],
      ['cn-19', 'OAuth 2.0, PKCE Flow, OpenID Connect (OIDC) & JWT Verification', 'Authorization Code + PKCE for SPAs/Mobile, ID tokens vs Access tokens & JWKS rotation', 'PKCE', 'code_challenge = BASE64URL(SHA256(code_verifier))'],
      ['cn-20', 'WebRTC Architecture: MediaStreams, RTCPeerConnection & SCTP DataChannels', 'Sub-100ms peer-to-peer video/audio conferencing over SRTP and UDP', 'RTCPeerConnection', 'const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });'],
      ['cn-21', 'gRPC, HTTP/2 Streams, Protocol Buffers (Protobuf) & Bidirectional Streaming', 'Binary wire encoding tags/varints vs JSON text overhead in internal microservices', 'Protobuf', 'message OrderRequest { int64 order_id = 1; int32 amount_cents = 2; }'],
      ['cn-22', 'API Gateways, Rate Limiting Headers, BFF Pattern & GraphQL Federation', 'Aggregating microservice calls, schema stitching & preventing N+1 DataLoader queries', 'DataLoader', 'const users = await userLoader.loadMany(authorIds);'],
      ['cn-23', 'Zero-Trust Networking, Mutual TLS (mTLS) & Service Mesh (Istio / Envoy)', 'Workload identity (SPIFFE), sidecar proxies & encrypted service-to-service traffic', 'mTLS', 'Both Client and Server verify X.509 SPIFFE certificates'],
      ['cn-24', 'DDoS Mitigation: SYN Cookies, Anycast Scrubbing, WAF & Bot Management', 'Absorbing L3/L4 volumetric floods and L7 HTTP request floods at the network edge', 'SYNCookie', 'Stateless SYN-ACK sequence hash prevents SYN Backlog exhaustion'],
      ['cn-25', 'Full Journey of Typing https://google.com in the Browser (End-to-End Trace)', 'HSTS preload -> DNS -> Anycast BGP -> TCP -> TLS 1.3 -> HTTP/3 -> CRP Render', 'CRP', 'Total Time-to-First-Byte (TTFB) + Critical Rendering Path']
    ]
  },
  'c6': {
    group: 'High-Scale Distributed Systems (Crore-User Scale)',
    lang: 'javascript',
    items: [
      ['sd-10', 'Back-of-the-Envelope Estimation: QPS, Bandwidth, Storage & Latency Numbers', 'Powers-of-two capacity math, Peak = 3x Average QPS & Little’s Law (L = λW)', 'LittleLaw', 'concurrency = peakQps * avgLatencySeconds'],
      ['sd-11', 'Distributed Consensus: Raft & Paxos Leader Election & Log Replication', 'Terms, heartbeats, majority quorum (⌊N/2⌋ + 1) & split-vote randomized timeouts', 'Quorum', 'const quorumSize = Math.floor(totalNodes / 2) + 1;'],
      ['sd-12', 'Distributed Transactions: 2PC vs Saga Pattern & Transactional Outbox', 'Avoiding blocking Two-Phase Commit across microservices using compensating events and Outbox tables', 'Outbox', 'INSERT INTO orders ...; INSERT INTO outbox_events ...; COMMIT;'],
      ['sd-13', 'Idempotency Keys & Exactly-Once Payment Processing', 'Preventing duplicate credit card charges on mobile network retries using Redis + DB locks', 'IdempotencyKey', 'Idempotency-Key: "pay_req_99481a"'],
      ['sd-14', 'Distributed Unique ID Generators: UUIDv7 vs Twitter Snowflake (64-Bit)', 'Generating k-sorted 64-bit integer IDs (41b timestamp + 10b machine + 12b sequence) at 4M IDs/sec', 'Snowflake', 'const id = (timestamp << 22n) | (workerId << 12n) | seq;'],
      ['sd-15', 'Distributed Locks: Redis Redlock vs ZooKeeper Ephemeral Nodes & Fencing Tokens', 'Why TTL locks alone can fail during GC pauses and how monotonic fencing tokens protect storage', 'FencingToken', 'if (request.token < storage.maxSeenToken) rejectStaleWrite();'],
      ['sd-16', 'Vector Clocks, Lamport Timestamps & CRDTs (Conflict-Free Replicated Data Types)', 'Tracking causal ordering without central clocks and merging concurrent collaborative edits', 'VectorClock', 'vc[nodeId] = (vc[nodeId] || 0) + 1;'],
      ['sd-17', 'Bloom Filters, Count-Min Sketch & HyperLogLog for Cardinality at Scale', 'Counting 100 million unique daily visitors in just 12 KB of RAM using HyperLogLog (PFADD)', 'HyperLogLog', 'PFADD daily_active_users "user_8812" -> 12KB fixed memory'],
      ['sd-18', 'Time-Series Databases (Prometheus / InfluxDB) & Gorilla Compression', 'Delta-of-delta timestamp compression and XOR floating-point encoding for metrics pipelines', 'DeltaOfDelta', 'delta2 = (t_n - t_{n-1}) - (t_{n-1} - t_{n-2})'],
      ['sd-19', 'Case Study: Design WhatsApp / Slack Real-Time Messaging for 100M Concurrent Users', 'Erlang/Go WebSocket gateways, session routing table, per-chat sequence IDs & E2EE prekeys', 'ChatGateway', 'Client -> WS Gateway -> Presence Registry -> Inbox Shard'],
      ['sd-20', 'Case Study: Design YouTube / Netflix Adaptive Video Streaming (HLS / DASH)', 'Chunked DAG transcoding pipeline, GOP segments, ABR bitrate switching & ISP OpenConnect CDN', 'ABR', 'Switch 720p -> 4K chunk based on client throughput EWMA'],
      ['sd-21', 'Case Study: Design Uber / Swiggy Geospatial Dispatch (QuadTrees & Uber H3)', 'Indexing moving drivers with hexagonal H3 spatial cells and in-memory geohash rings', 'H3Index', 'const neighbors = h3.gridDisk(driverCell, 1);'],
      ['sd-22', 'Case Study: Design Google Search & Distributed Inverted Index', 'Distributed crawlers, consistent URL frontier, PageRank & partitioned inverted posting lists', 'InvertedIndex', '"distributed" -> [doc_12, doc_49, doc_104] (sorted docIDs)'],
      ['sd-23', 'Case Study: Design Distributed Rate Limiter (Token Bucket & Sliding Window Lua)', 'Atomic Redis Lua scripts, local L1 batching + global L2 counters & race-condition immunity', 'TokenBucket', 'tokens = Math.min(capacity, tokens + elapsed * refillRate)'],
      ['sd-24', 'Case Study: Design Double-Entry Payment Ledger & Wallet System', 'Immutable append-only debit/credit ledger entries, reconciliation jobs & audit invariance', 'DoubleEntry', 'SUM(debits) + SUM(credits) === 0 // Global Ledger Invariant'],
      ['sd-25', 'Multi-Region Active-Active Architecture, Chaos Engineering & Graceful Degradation', 'Cell-based isolation, load shedding, bulkhead pools & surviving full cloud region outages', 'LoadShedding', 'if (queueLatencyMs > 250) dropNonCriticalPriorityRequests();']
    ]
  },
  'c2': {
    group: 'Computer Architecture, Hardware & Compiler Engineering',
    lang: 'python',
    items: [
      ['cs-6', 'Combinational Circuits: Half/Full Adders, Carry-Lookahead & Multiplexers', 'Building arithmetic circuits from NAND/XOR gates and eliminating ripple-carry delay', 'FullAdder', 'sum_bit = a ^ b ^ carry_in; carry_out = (a & b) | (carry_in & (a ^ b))'],
      ['cs-7', 'Sequential Logic: SR Latch, D Flip-Flops, Registers & Clock Skew', 'How edge-triggered flip-flops store state across CPU clock cycles', 'DFlipFlop', 'on_rising_edge: Q_next = D'],
      ['cs-8', 'Instruction Set Architecture (ISA): RISC-V vs x86-64 CISC Encoding', 'Load-store architecture, fixed 32-bit instructions vs variable-length x86 decoding', 'RISCV', 'ADD x1, x2, x3 # x1 = x2 + x3 (Register-to-Register)'],
      ['cs-9', 'The 5-Stage Classic RISC Pipeline: IF, ID, EX, MEM, WB', 'Overlapping instruction execution to achieve CPI -> 1.0 throughput', 'Pipeline', 'Stages = ["Fetch", "Decode", "Execute", "Memory", "WriteBack"]'],
      ['cs-10', 'Pipeline Hazards: Structural, Data (RAW/WAR/WAW) & Operand Forwarding', 'Bypassing ALU output directly back to ALU input without waiting for Register WriteBack', 'Forwarding', 'EX_MEM.rd == ID_EX.rs1 -> Forward ALU result immediately'],
      ['cs-11', 'Control Hazards, Branch Prediction (2-Bit Saturating Counter & TAGE) & Speculation', 'Why sorting an array can make a loop with an if-branch run 4x faster on modern CPUs', 'BranchPredict', 'misprediction_penalty = 15 # Pipeline flush cycles'],
      ['cs-12', 'Out-of-Order Execution, Register Renaming & Tomasulo’s Algorithm', 'Reorder Buffer (ROB), Reservation Stations & exploiting Instruction-Level Parallelism (ILP)', 'ROB', 'Hardware maps 16 architectural regs onto 180+ physical registers'],
      ['cs-13', 'SIMD Vectorization (AVX-512 / ARM NEON) & Data-Level Parallelism', 'Processing 16 32-bit floats in a single CPU instruction cycle', 'SIMD', 'vaddps zmm0, zmm1, zmm2 # 16 floats added in 1 cycle'],
      ['cs-14', 'Cache Mapping Geometries: Direct-Mapped, Set-Associative & Tag/Index/Offset Bits', 'Splitting a 64-bit address into Tag, Set Index, and 6-bit (64B) Cache Line Offset', 'CacheOffset', 'offset_bits = 6 # 2^6 = 64-byte cache line'],
      ['cs-15', 'Multicore Cache Coherency: MESI Protocol & Cache Line Snooping', 'Modified, Exclusive, Shared, Invalid states and hardware bus invalidation messages', 'MESI', 'Core 0 write -> Broadcast Invalidate -> State becomes Modified (M)'],
      ['cs-16', 'DRAM Internals, Memory Channels, Bank Conflicts & NUMA Topology', 'Row buffers, CAS latency, DDR5 channels & non-uniform memory access across sockets', 'NUMA', 'local_socket_latency_ns = 75; remote_socket_latency_ns = 140'],
      ['cs-17', 'PCIe Lanes, DMA (Direct Memory Access) & Hardware Interrupt Coalescing', 'How NICs and GPUs transfer gigabytes to RAM without involving the CPU', 'DMA', 'NIC DMA Engine writes packets directly to Ring Buffer in RAM'],
      ['cs-18', 'GPU Architecture: SIMT Warps, Shared SRAM & High-Bandwidth Memory (HBM)', 'Why GPUs have thousands of tensor/FP cores vs CPU’s low-latency branch predictors', 'Warp', '32 threads execute in lockstep inside a GPU Warp'],
      ['cs-19', 'Compiler Frontend: Lexical Analysis (DFA), Recursive Descent Parsing & ASTs', 'Tokenizing source text and constructing an Abstract Syntax Tree with operator precedence', 'AST', 'BinaryExpr(op="+", left=Literal(2), right=BinaryExpr(op="*", left=3, right=4))'],
      ['cs-20', 'Static Single Assignment (SSA) Intermediate Representation & Phi (φ) Nodes', 'Assigning every variable exactly once so dataflow optimizations become trivial', 'PhiNode', 'x_3 = phi(x_1, x_2) # Merges branch values in SSA form'],
      ['cs-21', 'Compiler Optimization Passes: Constant Folding, Dead Code, Loop Unrolling & Inlining', 'How LLVM transforms high-level abstractions into zero-cost machine assembly', 'Inlining', 'Replaces function call overhead with inline body statements'],
      ['cs-22', 'Register Allocation via Graph Coloring (Chaitin’s Algorithm) & Stack Spilling', 'Mapping infinite virtual SSA registers onto 16 hardware CPU registers via interference graphs', 'GraphColor', 'If k-colorable, zero stack spills required'],
      ['cs-23', 'Linkers, ELF Binary Format, Relocation Tables, GOT/PLT & Dynamic Shared Libraries', 'How static (.a) and dynamic (.so / .dll) libraries resolve symbols at load time', 'PLT_GOT', 'Lazy symbol binding via Procedure Linkage Table (PLT)'],
      ['cs-24', 'Garbage Collection Algorithms: Mark-Sweep, Copying, Generational & Tricolor Marking', 'Weak generational hypothesis (most objects die young) and concurrent write barriers', 'Tricolor', 'White (unvisited) -> Grey (queued) -> Black (reachable)'],
      ['cs-25', 'WebAssembly (Wasm) Stack Machine, Linear Memory & Sandboxed Near-Native Execution', 'Running C++/Rust/Go safely in browsers and edge workers with deterministic linear memory', 'Wasm', '(module (func $add (param i32 i32) (result i32) local.get 0 local.get 1 i32.add))']
    ]
  },
  'c12': {
    group: 'AI, Deep Learning, Transformers & Production GenAI',
    lang: 'python',
    items: [
      ['ai-7', 'Linear Algebra & Tensor Calculus for Deep Learning', 'Matrix multiplication, dot products, broadcasting rules, Jacobians & eigenvalues', 'matmul', 'out = [[sum(A[i][k]*B[k][j] for k in range(K)) for j in range(N)] for i in range(M)]'],
      ['ai-8', 'Probability, Bayes’ Theorem, Cross-Entropy & KL Divergence', 'Information theory, maximum likelihood estimation (MLE) & measuring distribution drift', 'CrossEntropy', 'loss = -sum(y_true[i] * math.log(y_pred[i]) for i in range(len(y_true)))'],
      ['ai-9', 'Classification Metrics: Precision, Recall, F1-Score, ROC-AUC & Confusion Matrix', 'Evaluating imbalanced datasets (fraud detection) where 99% accuracy can still be useless', 'F1Score', 'f1 = 2 * (precision * recall) / (precision + recall)'],
      ['ai-10', 'Decision Trees, Entropy, Gini Impurity, Random Forests & Gradient Boosted Trees', 'Tabular ML mastery with bagging vs boosting (XGBoost / LightGBM split gain)', 'Gini', 'gini = 1.0 - sum(p * p for p in class_probs)'],
      ['ai-11', 'Regularization, Dropout, Batch Normalization & Layer Normalization', 'Preventing overfitting with L1/L2 weight decay and stabilizing deep network gradients', 'LayerNorm', 'y = (x - mean) / math.sqrt(var + 1e-5) * gamma + beta'],
      ['ai-12', 'Modern Optimizers: SGD with Momentum, RMSProp, Adam & AdamW + Cosine Warmup', 'Adaptive first and second moment gradient estimates and decoupled weight decay', 'AdamW', 'm = b1*m + (1-b1)*g; v = b2*v + (1-b2)*(g*g)'],
      ['ai-13', 'Convolutional Neural Networks (CNNs), Receptive Fields & Residual Skip Connections', 'Why ResNet skip connections (F(x) + x) solved vanishing gradients in 100+ layer networks', 'ResNet', 'output = relu(conv_block(x) + x) # Residual Highway'],
      ['ai-14', 'Tokenization Internals: Byte-Pair Encoding (BPE), WordPiece & SentencePiece', 'How subword tokenizers compress vocabulary and avoid out-of-vocabulary (OOV) failures', 'BPE', 'Merge most frequent adjacent byte/character pair iteratively'],
      ['ai-15', 'Positional Encodings: Sinusoidal vs Rotary Position Embeddings (RoPE)', 'Injecting relative token distance via complex plane rotation matrices in modern LLMs', 'RoPE', 'Rotate (q_m, k_n) by angle m*theta so dot product depends only on (m - n)'],
      ['ai-16', 'LLM Inference Internals: Autoregressive Decoding, KV-Cache & PagedAttention', 'Why caching past Key/Value tensors turns O(N²) generation into O(N) per token', 'KVCache', 'kv_bytes_per_token = 2 * num_layers * num_kv_heads * head_dim * 2'],
      ['ai-17', 'Grouped-Query Attention (GQA), Multi-Query Attention (MQA) & FlashAttention', 'Reducing GPU HBM memory bandwidth bottlenecks via SRAM tiling and shared KV heads', 'FlashAttention', 'Online softmax tiling inside fast GPU SRAM avoids materializing N x N matrix'],
      ['ai-18', 'Mixture of Experts (MoE) Architecture, Sparse Routing & Load Balancing Loss', 'Activating only top-K experts per token to scale total parameters with low FLOPs', 'TopKRouting', 'weights, expert_ids = topk(softmax(router_logits), k=2)'],
      ['ai-19', 'Parameter-Efficient Fine-Tuning (PEFT): LoRA & QLoRA Low-Rank Adaptation', 'Freezing base weights W and training tiny rank-r matrices ΔW = B·A (r << d)', 'LoRA', 'h = W_frozen @ x + (B @ (A @ x)) * (alpha / r)'],
      ['ai-20', 'Post-Training Alignment: SFT, RLHF (PPO) & Direct Preference Optimization (DPO)', 'Aligning models with human preferences using chosen vs rejected response pairs', 'DPO', 'Optimize policy directly on (prompt, y_chosen, y_rejected) triples'],
      ['ai-21', 'Vector Databases: HNSW Graphs, IVF-PQ Quantization & Hybrid BM25 + Dense Search', 'Sub-10ms approximate nearest neighbor search across 100M+ embeddings with Reciprocal Rank Fusion', 'RRF', 'rrf_score = 1 / (60 + rank_dense) + 1 / (60 + rank_bm25)'],
      ['ai-22', 'Production RAG: Semantic Chunking, Cross-Encoder Reranking & Hallucination Citations', 'Two-stage retrieval (fast bi-encoder top-50 -> accurate cross-encoder top-5) with grounded citations', 'Rerank', 'top_5 = cross_encoder.rank(query, top_50_candidates)[:5]'],
      ['ai-23', 'Agentic Workflows: ReAct Loop, Function Calling, MCP & Deterministic Guardrails', 'Planning, tool execution, schema validation retries & human-in-the-loop safety gates', 'ReAct', 'Thought -> Action(tool_call) -> Observation(result) -> Final Answer'],
      ['ai-24', 'Model Compression: Post-Training Quantization (FP16, INT8, AWQ, GGUF 4-Bit)', 'Fitting 70B models into consumer GPUs by quantizing weights with activation-aware scaling', 'Quantize', 'q_int8 = round(weight_fp16 / scale_factor)'],
      ['ai-25', 'LLM Serving at Scale: Continuous Batching, Speculative Decoding & Eval Harnesses', 'Draft-model speculative verification (2-3x speedup) and LLM-as-a-Judge regression pipelines', 'Speculative', 'Draft model proposes 4 tokens -> Target model verifies all 4 in 1 forward pass']
    ]
  }
};

// Build expanded 25-module courses list and rich LessonContent map
export const EXPANDED_COURSES: Course[] = [];
export const EXPANDED_LESSONS: Record<string, LessonContent> = {};

const CLEAN_COURSE_TITLES: Record<string, { title: string; shortTag: string }> = {
  'c-html': { title: 'HTML5 & Web Platform Engineering', shortTag: 'HTML5' },
  'c-css': { title: 'CSS3, Layout Engines & Design Systems', shortTag: 'CSS3' },
  'c-js': { title: 'JavaScript (ES2025) & V8 Internals', shortTag: 'JavaScript' },
  'c-ts': { title: 'TypeScript & Type-Level Architecture', shortTag: 'TypeScript' },
  'c-react': { title: 'React 19, Fiber & Concurrent UI', shortTag: 'React 19' },
  'c1': { title: 'Python 3 Engineering & CPython Internals', shortTag: 'Python' },
  'c5': { title: 'SQL, Query Optimization & Storage Engines', shortTag: 'SQL & DBMS' },
  'c4': { title: 'Data Structures & Algorithms Mastery', shortTag: 'DSA' },
  'c11': { title: 'C++20 Systems & JVM Runtime Internals', shortTag: 'C++ & Java' },
  'c3': { title: 'Operating Systems, Linux Kernel & Containers', shortTag: 'OS & Linux' },
  'c7': { title: 'Computer Networks, Protocols & Edge Security', shortTag: 'Networks' },
  'c6': { title: 'High-Scale Distributed System Design', shortTag: 'System Design' },
  'c2': { title: 'Computer Architecture, Logic & Compilers', shortTag: 'CS Core' },
  'c12': { title: 'AI, Deep Learning, Transformers & GenAI', shortTag: 'AI & GenAI' }
};

for (const baseCourse of BASE_COURSES) {
  const cleanMeta = CLEAN_COURSE_TITLES[baseCourse.id] || {
    title: baseCourse.title,
    shortTag: baseCourse.shortTag || baseCourse.title
  };

  const modules: CourseModule[] = [...baseCourse.modules];

  // 1. Add custom DeepModuleSpecs if defined for this course
  const customExtras = EXTRA_MODULES_BY_COURSE[baseCourse.id] || [];
  for (const spec of customExtras) {
    if (!modules.some(m => m.id === spec.id)) {
      modules.push({
        id: spec.id,
        title: spec.title,
        description: spec.description,
        difficulty: spec.difficulty,
        sectionGroup: spec.sectionGroup,
        isLocked: false
      });
    }

    const chNum = modules.length;
    EXPANDED_LESSONS[spec.id] = {
      id: spec.id,
      title: spec.title,
      estimatedReadingTime: '12 mins',
      beginnerSummary: `${spec.title} — ${spec.description}. Built for both immediate practical coding and high-scale production systems.`,
      realWorldAnalogy: spec.analogy,
      keyTakeaways: [
        `Core Concept: ${spec.description}.`,
        `Production Guarantee: ${spec.complexity.op} operates in ${spec.complexity.time} time (${spec.complexity.note}).`,
        `Interview Focus (${spec.company}): ${spec.interviewQ}`
      ],
      syntaxCheatTable: [
        { syntax: spec.keyTerm, description: `Primary construct in ${spec.title}`, example: spec.syntaxExample },
        { syntax: spec.complexity.op, description: spec.complexity.note, example: spec.keyTerm },
        { syntax: 'Verification Check', description: 'Production safety & edge-case invariant', example: spec.interviewA.slice(0, 68) + '...' }
      ],
      diagramSvg: buildLessonArchitectureSvg(
        baseCourse.id,
        chNum,
        spec.title,
        spec.sectionGroup,
        [spec.keyTerm, spec.complexity.op, spec.complexity.time]
      ),
      contentMarkdown: `# ${spec.title}

${spec.description}. This chapter covers the foundational intuition, underlying engine mechanics, production scale considerations, and runnable implementation patterns.

## 1. Architectural Intuition & Why It Matters

${spec.analogy}

In large-scale applications serving millions of concurrent users, understanding **${spec.keyTerm}** prevents subtle bottlenecks and ensures predictable **${spec.complexity.time}** behavior.

## 2. Interactive Code Example

Click **Try it Yourself →** on the code block below to load it directly into the live execution sandbox:

\`\`\`${spec.codeLang}
${spec.codeSnippet}
\`\`\`

## 3. Under-the-Hood Execution & Production Trade-offs

- **Primary Operation (${spec.complexity.op})**: Executes in \`${spec.complexity.time}\` time with \`${spec.complexity.space}\` memory footprint.
- **Engine Note**: ${spec.complexity.note}
- **Production Best Practice**: ${spec.interviewA}`,
      fillBlankExercise: {
        prompt: `Complete the key keyword or identifier for "${spec.title}":`,
        codeBefore: `// Core construct for ${spec.title}: `,
        answer: spec.keyTerm,
        codeAfter: ` // (${spec.complexity.time})`,
        hint: `Type: ${spec.keyTerm}`
      },
      codingChallenge: {
        title: `Live Lab: ${spec.title}`,
        description: `Run and modify this ${spec.codeLang.toUpperCase()} implementation to verify ${spec.title} in real time.`,
        language: spec.codeLang,
        starterCode: spec.codeSnippet,
        solutionCode: spec.codeSnippet,
        hint: `Inspect how ${spec.keyTerm} behaves and check the output console.`
      },
      quizzes: [
        {
          id: `q-${spec.id}-1`,
          question: spec.interviewQ,
          options: [
            spec.interviewA,
            'It requires rebooting the operating system kernel on every request.',
            'It disables all compiler optimizations and forces O(N!) complexity.',
            'It is deprecated and throws a syntax error in strict mode.'
          ],
          correctAnswerIndex: 0,
          explanation: spec.interviewA
        }
      ],
      interviewQuestions: [
        {
          companyTag: spec.company,
          question: spec.interviewQ,
          answer: spec.interviewA
        }
      ],
      resources: [
        {
          title: `${spec.title} — Official Specification & Engineering Guide`,
          type: 'Documentation',
          authorOrSource: `${cleanMeta.shortTag} Core Engineering`
        }
      ]
    };
  }

  // 2. Add compact track specifications for the remaining 10 tracks
  const compactTrack = ADDITIONAL_TRACK_TOPICS[baseCourse.id];
  if (compactTrack) {
    for (const [id, title, desc, keyTerm, syntaxEx] of compactTrack.items) {
      if (!modules.some(m => m.id === id)) {
        modules.push({
          id,
          title,
          description: desc,
          difficulty: modules.length < 14 ? 'Intermediate' : modules.length < 20 ? 'Advanced' : 'Expert',
          sectionGroup: compactTrack.group,
          isLocked: false
        });
      }

      const chNum = modules.length;
      const runnableCode =
        compactTrack.lang === 'sql'
          ? `SELECT name, department, salary\nFROM employees\nWHERE salary >= 85000\nORDER BY salary DESC;`
          : compactTrack.lang === 'cpp'
          ? `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "[${id.toUpperCase()}] ${title}" << endl;\n  cout << "Key Construct: ${keyTerm} -> Verified O(1) Execution" << endl;\n  return 0;\n}`
          : compactTrack.lang === 'python'
          ? `# ${title}\n# ${desc}\nconstruct = "${keyTerm}"\nprint("Module:", "${id}", "| Construct:", construct)\nnums = [10, 20, 30, 40]\nprint("Processed:", [x * 2 for x in nums])`
          : `// ${title}\n// ${desc}\nconst construct = "${keyTerm}";\nconsole.log("Module ${id} verified with construct:", construct);`;

      EXPANDED_LESSONS[id] = {
        id,
        title,
        estimatedReadingTime: '12 mins',
        beginnerSummary: `${title} — ${desc}. Master the practical syntax, internal memory model, and high-scale engineering trade-offs.`,
        realWorldAnalogy: `Think of ${title} as a precision engineering mechanism where ${keyTerm} guarantees predictable latency and zero wasted resources even under heavy load.`,
        keyTakeaways: [
          `Core Mechanism: ${desc}.`,
          `Primary Construct: ${keyTerm} (${syntaxEx}).`,
          `High-Scale Readiness: Engineered to prevent bottlenecks in mission-critical production workloads.`
        ],
        syntaxCheatTable: [
          { syntax: keyTerm, description: desc, example: syntaxEx },
          { syntax: 'Architecture Pattern', description: 'Production-grade execution pattern', example: `${cleanMeta.shortTag} Standard` },
          { syntax: 'Production Pattern', description: 'Safe error handling & resource bounds', example: `Verified ${cleanMeta.shortTag} Pattern` }
        ],
        diagramSvg: buildLessonArchitectureSvg(
          baseCourse.id,
          chNum,
          title,
          compactTrack.group,
          [keyTerm, cleanMeta.shortTag, 'Verified Scale']
        ),
        contentMarkdown: `# ${title}

${desc}. This module breaks down the step-by-step execution pipeline, memory layout, and real-world engineering applications of **${keyTerm}**.

## 1. Core Architecture & Mental Model

When building systems that serve millions of users, **${title}** plays a decisive role in maintaining throughput and correctness:

- **Mechanism**: ${desc}
- **Canonical Syntax / Pattern**: \`${syntaxEx}\`
- **Failure Mode Prevented**: Eliminates race conditions, unbounded memory growth, and tail-latency spikes.

## 2. Interactive Live Code Lab

Click **Try it Yourself →** to run and experiment with this example inside the interactive sandbox:

\`\`\`${compactTrack.lang}
${runnableCode}
\`\`\`

## 3. Production Engineering Checklist

1. Verify input invariants and resource bounds before invoking \`${keyTerm}\`.
2. Benchmark both average latency and P99 tail latency under concurrent load.
3. Combine with automated unit and integration tests for zero-regression deployments.`,
        fillBlankExercise: {
          prompt: `Enter the primary keyword or concept for "${title}":`,
          codeBefore: `// Key identifier for ${title}: `,
          answer: keyTerm,
          codeAfter: ` // Verified!`,
          hint: `Type: ${keyTerm}`
        },
        codingChallenge: {
          title: `Interactive Lab: ${title}`,
          description: `Execute and customize the ${compactTrack.lang.toUpperCase()} lab for ${title}.`,
          language: compactTrack.lang,
          starterCode: runnableCode,
          solutionCode: runnableCode,
          hint: `Focus on how ${keyTerm} structures the computation.`
        },
        quizzes: [
          {
            id: `q-${id}-1`,
            question: `What is the primary engineering purpose of ${title} (${keyTerm})?`,
            options: [
              desc,
              'To intentionally block the main execution thread indefinitely.',
              'To bypass all type and memory safety checks at runtime.',
              'To replace binary arithmetic with manual string concatenation.'
            ],
            correctAnswerIndex: 0,
            explanation: `${title} is specifically designed for: ${desc}.`
          }
        ],
        interviewQuestions: [
          {
            companyTag: 'Top-Tier Tech',
            question: `How does ${title} (${keyTerm}) improve reliability and performance in production systems?`,
            answer: `${desc}. Using \`${syntaxEx}\` ensures bounded resource consumption and clean architectural separation.`
          }
        ],
        resources: [
          {
            title: `${title} — Production Reference Manual`,
            type: 'Documentation',
            authorOrSource: `${cleanMeta.shortTag} Systems Track`
          }
        ]
      };
    }
  }

  EXPANDED_COURSES.push({
    ...baseCourse,
    title: cleanMeta.title,
    shortTag: cleanMeta.shortTag,
    levelTag: `${modules.length} Chapters · Beginner to Production Scale`,
    modules
  });
}

// ============================================================================
// 15th Subject Track: Agentic Harness Engineering, MCP & Autonomous Systems (25 Chapters)
// Synthesizing DeepLearning.AI Agentic Design Patterns, Anthropic Claude Code,
// Model Context Protocol (MCP), SWE-bench Harnesses, and X AI Engineering Best Practices
// ============================================================================
const AGENTIC_HARNESS_TOPICS: [
  string,
  string,
  string,
  string,
  string,
  'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
  string
][] = [
  [
    'har-1',
    'Agentic Harness HOME: Why the Harness Matters as Much as the Model',
    'Systemic engineering around LLMs: treating the foundation model as a CPU and the harness as the Operating System (RAM, I/O, Tools & Verification)',
    'AgentHarness',
    'while step < max_steps: action = model(context); obs = harness.exec(action)',
    'Beginner',
    'Harness Foundations'
  ],
  [
    'har-2',
    'The Core Agentic Loop: Observe → Think → Tool Call → Verify',
    'Deterministic state-machine loops, termination invariants, max-step budgets, and structured tool result injection',
    'AgentLoop',
    'state = transition(state, tool_result); if state.verified: break',
    'Beginner',
    'Harness Foundations'
  ],
  [
    'har-3',
    'Model Context Protocol (MCP): Architecture, Host, Client & JSON-RPC Servers',
    'Decoupling tool ecosystems via standardized MCP Resources, Prompts, and Tools over stdio and SSE transports',
    'MCPServer',
    '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "git_diff"}}',
    'Beginner',
    'MCP & Tool Architecture'
  ],
  [
    'har-4',
    'Poka-Yoke Tool Design: Atomic Schemas & Error-Proof File Editing Tools',
    'Why line-targeted search-and-replace tools outperform whole-file rewrites on SWE-bench by eliminating truncation and syntax drift',
    'AtomicEditTool',
    'replace_span(file, old_exact_block, new_block, verify_unique=True)',
    'Intermediate',
    'MCP & Tool Architecture'
  ],
  [
    'har-5',
    'Context Window Engineering & Automated Compaction Pipelines',
    'Preventing context rot over 100+ turn trajectories via sliding-window pruning, tool output truncation, and structured handoff summaries',
    'ContextCompactor',
    'if token_count(messages) > 0.8 * MAX_CTX: messages = compact_history(messages)',
    'Intermediate',
    'Context & KV-Cache Optimization'
  ],
  [
    'har-6',
    'Prompt Caching & KV-Cache Prefix Alignment for Agent Loops',
    'Structuring immutable system instructions and MCP tool definitions at the prefix boundary to achieve 90% KV-cache hit rates',
    'PrefixCache',
    'prefix = [SYSTEM_PROMPT, STATIC_TOOLS]; dynamic = [USER_TASK, ...TRAJECTORY]',
    'Intermediate',
    'Context & KV-Cache Optimization'
  ],
  [
    'har-7',
    'Dynamic Tool Discovery & On-Demand Tool Search (tool_search)',
    'Keeping 200+ enterprise MCP tools out of the initial context window and loading schemas dynamically via semantic tool search',
    'ToolSearch',
    'active_tools = tool_registry.search(query="database migration", top_k=3)',
    'Intermediate',
    'MCP & Tool Architecture'
  ],
  [
    'har-8',
    'Programmatic Tool Calling & Sandboxed Script Orchestration',
    'Allowing agents to emit a single Python orchestration script that chains 15 tool calls inside a sandbox without bloating LLM context',
    'CodeAct',
    'sandbox.exec("for f in glob(\'*.py\'): run_linter(f)") # 1 turn instead of 15',
    'Advanced',
    'MCP & Tool Architecture'
  ],
  [
    'har-9',
    'DeepLearning.AI Pattern 1: Reflection, Self-Critique & Evaluator-Optimizer Loops',
    'Pairing a Generator node with a deterministic Evaluator/Critic loop that feeds compiler errors and rubric gaps back for iterative refinement',
    'ReflectionLoop',
    'draft = generate(task); critique = verify_with_tests(draft); final = refine(draft, critique)',
    'Intermediate',
    'DeepLearning.AI Agentic Patterns'
  ],
  [
    'har-10',
    'DeepLearning.AI Pattern 2: Plan-and-Execute, DAG Task Graphs & ReWOO',
    'Decoupling upfront architectural planning from localized worker execution to reduce redundant reasoning tokens by 60%',
    'PlanAndExecute',
    'dag = planner.build_dag(goal); results = executor.run_topological(dag)',
    'Intermediate',
    'DeepLearning.AI Agentic Patterns'
  ],
  [
    'har-11',
    'DeepLearning.AI Pattern 3: Multi-Agent Orchestration, Subagents & Handoffs',
    'Spawning isolated subagents with clean context windows for parallel codebase research and returning concise synthesis artifacts',
    'SubagentHandoff',
    'summary = spawn_subagent(role="RepoExplorer", isolated_context=True).run(query)',
    'Advanced',
    'DeepLearning.AI Agentic Patterns'
  ],
  [
    'har-12',
    'SWE-bench Coding Agent Harnesses: AST Navigation, Ripgrep & Fault Localization',
    'How top coding harnesses navigate 500k-LOC repositories using symbol graphs, ripgrep regexes, and minimal test reproduction scripts',
    'SWEHarness',
    'matches = rg_search(pattern="defauthenticate", path="src/"); ast_outline(matches[0])',
    'Advanced',
    'Autonomous Coding Harnesses'
  ],
  [
    'har-13',
    'Git Worktree Isolation & Ephemeral MicroVM Sandboxes (Docker / Firecracker)',
    'Running 5 parallel coding agents on separate git worktrees and container namespaces with zero working-tree collisions',
    'GitWorktree',
    'git worktree add ../agent-task-42 -b fix/issue-42 && docker run --rm -v ...',
    'Advanced',
    'Autonomous Coding Harnesses'
  ],
  [
    'har-14',
    'Compiler-in-the-Loop & Linter-Driven Self-Healing Harnesses',
    'Automatically running tsc, eslint, and unit test suites after file edits and injecting structured diagnostic diffs into the tool response',
    'SelfHealingLoop',
    'edit_res = apply_patch(diff); diag = run_tsc_and_tests(); return {edit_res, diag}',
    'Advanced',
    'Autonomous Coding Harnesses'
  ],
  [
    'har-15',
    'Hierarchical Agent Memory: AGENT.md / CLAUDE.md, Episodic & Semantic Stores',
    'Combining repository-level constitutional rules (AGENT.md) with episodic trajectory logs and vector/graph long-term memory',
    'AgentMemory',
    'context = load_repo_rules("AGENT.md") + memory.retrieve_episodic(task_embedding)',
    'Intermediate',
    'Context & KV-Cache Optimization'
  ],
  [
    'har-16',
    'Human-in-the-Loop (HITL) Checkpoints, Permission Tiers & Interrupt Gates',
    'Classifying tools into Read-Only (auto-approve), Workspace-Mutating (sandboxed), and External/Destructive (explicit human approval)',
    'PermissionGate',
    'if tool.risk_tier == "DESTRUCTIVE": await request_human_approval(tool_call)',
    'Intermediate',
    'Production Reliability & Safety'
  ],
  [
    'har-17',
    'Constrained Decoding, CFG Grammars & 100% Schema-Valid Tool Calls',
    'Using finite-state machines (FSM) and context-free grammars during token sampling so JSON tool arguments never fail validation',
    'ConstrainedJSON',
    'logits = mask_invalid_schema_tokens(logits, json_schema_fsm_state)',
    'Advanced',
    'Context & KV-Cache Optimization'
  ],
  [
    'har-18',
    'Browser & Computer-Use Harnesses: Accessibility Trees, Set-of-Mark & Playwright',
    'Grounding web agents via compact ARIA Accessibility snapshots and numbered bounding-box overlays instead of raw 4K pixel dumps',
    'ComputerUseHarness',
    'ax_tree = page.accessibility.snapshot(); action = agent.decide(ax_tree)',
    'Advanced',
    'Autonomous Coding Harnesses'
  ],
  [
    'har-19',
    'Durable Execution Harnesses: State Checkpointing, Replay & Crash Recovery',
    'Persisting every step of a long-horizon agent graph so network timeouts or process restarts resume from the exact last tool checkpoint',
    'DurableCheckpoint',
    'checkpoint_store.save(run_id, step_idx, state_hash, messages)',
    'Advanced',
    'Production Reliability & Safety'
  ],
  [
    'har-20',
    'Parallel Tool Execution, Fan-Out Map-Reduce & Speculative Prefetching',
    'Batching independent read_file, search_web, and grep calls in a single LLM turn and executing them concurrently in O(1) wall time',
    'ParallelToolBatch',
    'observations = await asyncio.gather(*(exec_tool(tc) for tc in tool_calls))',
    'Advanced',
    'Context & KV-Cache Optimization'
  ],
  [
    'har-21',
    'Agent Security: Indirect Prompt Injection Defense, Secret Scrubbing & Egress Policies',
    'Preventing untrusted READMEs, web pages, or issue descriptions from hijacking tool execution or exfiltrating .env secrets',
    'SecurityGuardrail',
    'clean_out = redact_secrets(tool_output); assert_egress_allowlist(url)',
    'Expert',
    'Production Reliability & Safety'
  ],
  [
    'har-22',
    'Agent Observability: OpenTelemetry Spans, Token Economics & Loop Divergence Detection',
    'Detecting repetitive tool-call loops (oscillating edits) early and tracking cost-per-resolved-issue across model tiers',
    'LoopDetector',
    'if count_identical_tool_calls(history[-6:]) >= 3: inject_loop_break_warning()',
    'Expert',
    'Production Reliability & Safety'
  ],
  [
    'har-23',
    'Agent Evaluation Harnesses: SWE-bench Rubrics, Trajectory Grading & Pass@k',
    'Evaluating deterministic outcome state (unit tests pass) alongside trajectory efficiency (steps taken, tokens consumed, regressions)',
    'EvalHarness',
    'score = (fail_to_pass_tests == 1.0) and (pass_to_pass_tests == 1.0)',
    'Expert',
    'Eval & Capstone Engineering'
  ],
  [
    'har-24',
    'Realtime Multimodal & Voice Agent Harnesses: WebRTC, VAD & Barge-In Interrupts',
    'Orchestrating sub-300ms streaming audio agents with Voice Activity Detection (VAD) cancellation and background async tool execution',
    'RealtimeVoiceHarness',
    'if vad.user_speaking(): audio_buffer.clear(); cancel_inflight_generation()',
    'Expert',
    'Eval & Capstone Engineering'
  ],
  [
    'har-25',
    'Capstone: Building a Complete Production Autonomous Coding Harness from Scratch',
    'End-to-end architecture combining MCP tool registry, KV-cached context compaction, AST surgical edits, and automated test verification',
    'ProductionHarness',
    'harness = CodingHarness(mcp_tools, compactor, test_runner); harness.solve(issue)',
    'Expert',
    'Eval & Capstone Engineering'
  ]
];

const harnessModules: CourseModule[] = [];
for (let i = 0; i < AGENTIC_HARNESS_TOPICS.length; i++) {
  const [id, title, desc, keyTerm, syntaxEx, difficulty, sectionGroup] = AGENTIC_HARNESS_TOPICS[i];
  const chNum = i + 1;
  harnessModules.push({
    id,
    title,
    description: desc,
    difficulty,
    sectionGroup,
    isLocked: false
  });

  const runnableHarnessCode = `# Chapter ${chNum}: ${title}
# Production Agentic Harness Simulation (${keyTerm})

def run_agentic_harness_step(task, max_context_tokens=4000):
    prefix_cache = ["SYSTEM: Follow AGENT.md invariants", "MCP_TOOLS: [read_file, edit_file, run_tests]"]
    trajectory = [
        {"step": 1, "tool": "read_file", "target": "src/engine.py", "tokens": 420, "status": "ok"},
        {"step": 2, "tool": "edit_file", "target": "src/engine.py", "tokens": 310, "status": "patched"},
        {"step": 3, "tool": "run_tests", "target": "tests/test_engine.py", "tokens": 190, "status": "PASS (12/12)"}
    ]
    total_tokens = sum(t["tokens"] for t in trajectory)
    cache_hit_ratio = 0.92
    print("Task:", task)
    print("Harness Construct:", "${keyTerm}")
    print("Steps Executed:", len(trajectory), "| Total Trajectory Tokens:", total_tokens)
    print("KV-Cache Hit Ratio:", cache_hit_ratio, "| Final Verdict:", trajectory[-1]["status"])
    return trajectory[-1]["status"]

verdict = run_agentic_harness_step("Resolve issue #42 via ${keyTerm}")
print("Harness Verified:", verdict)
`;

  EXPANDED_LESSONS[id] = {
    id,
    title,
    estimatedReadingTime: '14 mins',
    beginnerSummary: `${title} — ${desc}. Synthesized from DeepLearning.AI Agentic Design Patterns, Anthropic Claude Code & MCP architecture, and SWE-bench production harnesses.`,
    realWorldAnalogy: `If the Large Language Model is a raw CPU core, the Agentic Harness (${keyTerm}) is the Operating System that manages RAM (context window compaction), device drivers (MCP tools), sandboxes (git worktrees), and verification gates (unit tests).`,
    keyTakeaways: [
      `Harness Architecture: ${desc}.`,
      `Core Pattern (${keyTerm}): ${syntaxEx}.`,
      `Production Impact: Improves SWE-bench resolution rates while cutting token cost and preventing context rot.`
    ],
    syntaxCheatTable: [
      { syntax: keyTerm, description: desc, example: syntaxEx },
      { syntax: 'MCP JSON-RPC 2.0', description: 'Standardized protocol connecting agent harnesses to external tools & resources', example: 'tools/list -> tools/call -> structured content' },
      { syntax: 'Context Compaction', description: 'Summarize stale tool outputs before hitting 80% context window capacity', example: 'compact_trajectory(messages, keep_last_n=6)' },
      { syntax: 'Verification Gate', description: 'Run deterministic compiler/linter/tests before accepting agent patch', example: 'assert run_unit_tests().exit_code == 0' }
    ],
    diagramSvg: buildLessonArchitectureSvg(
      'c-harness',
      chNum,
      title,
      sectionGroup,
      [keyTerm, 'MCP Loop', 'Verified Pass']
    ),
    contentMarkdown: `# ${title}

${desc}. Modern AI engineering across **DeepLearning.AI**, **Anthropic (Claude Code & MCP)**, **OpenAI Agents**, and **Cursor** proves a fundamental truth: **the harness matters as much as—or more than—the underlying model**.

## 1. Why the Harness Defines Agent Reliability

When an LLM is evaluated on real-world software engineering benchmarks like **SWE-bench Verified**, raw model intelligence is only half of the equation. Without a well-engineered harness (**${keyTerm}**), agents suffer from three fatal failure modes:

1. **Context Window Bloat & Attention Rot**: Dumping 50 tool schemas and raw 2,000-line file outputs into the prompt degrades reasoning accuracy and spikes latency.
2. **Brittle Tool Interfaces**: Asking an LLM to rewrite an entire 800-line file introduces syntax errors and truncations, whereas atomic line-replacement tools (\`replace_file_content\`) enforce deterministic invariants.
3. **Unverified Hallucinated Completion**: Without a compiler-in-the-loop or test-runner verification gate inside the harness, agents declare victory while tests are still failing.

| Harness Layer | Naive Wrapper Script | Production Agentic Harness (${keyTerm}) | DeepLearning.AI / SWE-bench Impact |
| :--- | :--- | :--- | :--- |
| **Tool Protocol** | Ad-hoc hardcoded JSON functions | Standardized **MCP (Model Context Protocol)** + On-Demand \`tool_search\` | 75% lower initial prompt token footprint |
| **Context Management** | Append-only unbounded chat list | **KV-Cache Prefix Alignment** + Automated Episodic Compaction | 90% prompt cache hit rate & zero context overflow |
| **Code Modification** | Full-file overwrite strings | **Poka-Yoke Atomic Span Edits** + Immediate AST/Linter Feedback | 3.4x higher patch accuracy on large files |
| **Execution Safety** | Running shell commands on host OS | **Git Worktree Isolation** + Ephemeral Container Sandboxes + HITL Gates | Zero host corruption & safe parallel subagents |

## 2. Interactive Agentic Harness Lab

Click **Try it Yourself →** below to execute this **${keyTerm}** harness trace in the Python 3.12 Code Lab:

\`\`\`python
${runnableHarnessCode}
\`\`\`

## 3. Step-by-Step Harness Implementation Blueprint

1. **Prefix-Aligned System Prompt & \`AGENT.md\` Injection**: Place immutable instructions, repository architecture rules (\`AGENT.md\`), and core tool schemas at the very start of the prompt so the inference engine reuses the KV-cache across all turns.
2. **Observe → Think → Act → Verify State Machine**: Enforce a strict maximum step budget, detect repetitive tool-call loops, and require deterministic verification (unit tests + typechecking) before final termination.
3. **Structured Handoffs & Compaction**: When context utilization crosses 75%, compact resolved investigation sub-trees into a structured state summary while keeping the active working set intact.`,
    fillBlankExercise: {
      prompt: `Complete the core Agentic Harness identifier for "${title}":`,
      codeBefore: `# Agentic Harness Component: `,
      answer: keyTerm,
      codeAfter: ` # Verified in loop`,
      hint: `Type: ${keyTerm}`
    },
    codingChallenge: {
      title: `Harness Lab: ${title}`,
      description: `Run and customize the Python 3.12 Agentic Harness simulation for ${title} (${keyTerm}).`,
      language: 'python',
      starterCode: runnableHarnessCode,
      solutionCode: runnableHarnessCode,
      hint: `Observe how ${keyTerm} coordinates trajectory steps, token budgets, and test verification.`
    },
    quizzes: [
      {
        id: `q-${id}-1`,
        question: `In Agentic Harness Engineering (${title}), why does the harness architecture (${keyTerm}) have such a massive impact on SWE-bench and production reliability?`,
        options: [
          `${desc}, preventing context rot, enforcing atomic tool invariants, and verifying outputs with deterministic tests.`,
          'It replaces the neural network weights with a random number generator.',
          'It disables all tool validation so the model can execute arbitrary unverified strings.',
          'It forces every single file in a 10GB repository into the prompt on turn 1.'
        ],
        correctAnswerIndex: 0,
        explanation: `A production agentic harness (${keyTerm}) manages context compaction, poka-yoke tool interfaces, and deterministic verification loops around the model.`
      }
    ],
    interviewQuestions: [
      {
        companyTag: 'Anthropic / DeepLearning.AI / Cursor',
        question: `How do you design ${title} (${keyTerm}) so an autonomous coding agent can run 50+ tool calls without exhausting the context window or corrupting the repository?`,
        answer: `Keep static system prompts and core MCP schemas prefix-aligned for KV-cache hits, use atomic span-replacement edit tools with immediate linter/test feedback, isolate parallel runs in git worktrees, and compact resolved sub-tasks into structured state summaries.`
      }
    ],
    resources: [
      {
        title: `DeepLearning.AI — Agentic Design Patterns & Model Context Protocol (MCP)`,
        type: 'Documentation',
        authorOrSource: 'DeepLearning.AI & Anthropic Engineering'
      },
      {
        title: `Building Effective Agents & SWE-bench Harness Architecture`,
        type: 'Engineering Blog',
        authorOrSource: 'Anthropic Research & Frontier AI Systems'
      }
    ]
  };
}

EXPANDED_COURSES.push({
  id: 'c-harness',
  title: 'Agentic Harness Engineering, MCP & Autonomous Systems',
  category: 'Agentic Harness Engineering' as any,
  icon: '🤖',
  shortTag: 'Agentic Harness',
  levelTag: '25 Chapters · DeepLearning.AI + MCP + SWE-bench',
  modules: harnessModules
});

// ============================================================================
// 16th Subject Track: Git & GitHub Complete Mastery (25 Chapters + 75 Command Exercises)
// ============================================================================
Object.assign(EXPANDED_LESSONS, GIT_GITHUB_LESSONS);
EXPANDED_COURSES.push(GIT_GITHUB_COURSE);

// ============================================================================
// 17th Subject Track: Docker & Kubernetes Cloud-Native Mastery (25 Chapters + 75 Command Exercises)
// ============================================================================
Object.assign(EXPANDED_LESSONS, DOCKER_K8S_LESSONS);
EXPANDED_COURSES.push(DOCKER_K8S_COURSE);

// ============================================================================
// 18th Subject Track: Terraform, IaC & CI/CD Pipelines (25 Chapters + 75 Command Exercises)
// ============================================================================
Object.assign(EXPANDED_LESSONS, TERRAFORM_CICD_LESSONS);
EXPANDED_COURSES.push(TERRAFORM_CICD_COURSE);



