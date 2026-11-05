import { LessonContent } from '../../types';

export const STUDENT_WEB_AND_LANG_MODULES: Record<string, LessonContent> = {
  'web-1': {
    id: 'web-1',
    title: 'HTML5 Semantic DOM & Accessibility Tree',
    estimatedReadingTime: '12 mins',
    beginnerSummary: 'HTML5 is the structural skeleton of every web page. Using semantic tags like <header>, <nav>, <main>, and <article> instead of generic <div> tags helps browsers, search engines, and screen readers understand your page.',
    keyTakeaways: [
      'Always use semantic landmarks (<header>, <nav>, <main>, <section>, <footer>) for screen-reader navigation.',
      'The browser parses HTML bytes -> Characters -> Tokens -> Nodes -> DOM Tree + Accessibility Tree.',
      'Use <button> for interactive actions and <a href> for navigation—never a clickable <div>.'
    ],
    complexityTable: [
      { operation: 'getElementById', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', notes: 'Backed by browser internal hash map' },
      { operation: 'querySelectorAll', timeComplexity: 'O(N)', spaceComplexity: 'O(K)', notes: 'Traverses DOM subtree matching CSS selector' }
    ],
    contentMarkdown: `# HTML5 Semantic Architecture & The DOM Tree

Whether you are building your first webpage or architecting a high-scale web application, **HTML5** defines the structural meaning of your content.

## 1. Why Semantic HTML Matters
A non-semantic layout uses \`<div>\` for everything. A **semantic layout** uses meaningful tags that automatically wire the browser's **Accessibility Tree (AOM)** and improve SEO ranking:

\`\`\`html
<div style="font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
  <header style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px;">
    <h1 style="margin: 0; font-size: 20px; color: #38bdf8;">Code It Out Engineering Portal</h1>
    <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Semantic HTML5 Live Preview</p>
  </header>
  <main>
    <article style="background: #1e293b; padding: 16px; border-radius: 8px;">
      <h2 style="margin-top: 0; font-size: 16px;">Interactive Lesson Card</h2>
      <p style="font-size: 14px; color: #cbd5e1;">Click "Try it Yourself" to edit this HTML and see real-time changes!</p>
      <button style="background: #10b981; color: #052e16; font-weight: 700; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer;">
        Complete Step
      </button>
    </article>
  </main>
</div>
\`\`\`

## 2. Critical Rendering Path (CRP)
1. **HTML Parser**: Streams bytes into DOM nodes.
2. **CSSOM Construction**: Parses CSS rules into a style tree. \`<link rel="stylesheet">\` is **render-blocking**.
3. **Render Tree**: Combines DOM + CSSOM (excludes \`display: none\` elements).
4. **Layout (Reflow) & Paint**: Computes exact \`(x, y, width, height)\` geometry and rasterizes pixels to GPU layers.`,
    quizzes: [
      {
        id: 'web1-q1',
        question: 'Which CSS property change triggers only GPU Compositing without causing Layout (Reflow) or Paint?',
        options: [
          'width and height',
          'transform and opacity',
          'margin and padding',
          'background-color and box-shadow'
        ],
        correctAnswerIndex: 1,
        explanation: 'Animating transform and opacity runs directly on the GPU compositor thread without recalculating layout geometry or repainting pixels.'
      }
    ],
    codingChallenge: {
      title: 'Interactive HTML5 & CSS Card Builder',
      description: 'Modify the HTML5 & inline CSS below and click Run Code to preview the live rendered component.',
      language: 'html',
      starterCode: `<div style="font-family: system-ui; padding: 24px; background: #1e293b; color: white; border-radius: 14px; border: 1px solid #3b82f6;">
  <h2 style="margin: 0 0 8px 0; color: #60a5fa;">Hello Student Developer!</h2>
  <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px;">Edit this HTML and click Run Code to see your live preview update immediately.</p>
  <button style="padding: 10px 18px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold;">
    Launch Project
  </button>
</div>`,
      solutionCode: `<div style="font-family: system-ui; padding: 24px; background: #1e293b; color: white; border-radius: 14px;">
  <h2>Hello Student Developer!</h2>
</div>`,
      hint: 'Click Run Code to render the HTML inside the live visual preview pane.'
    },
    interviewQuestions: [
      {
        companyTag: 'Google',
        question: 'What is the difference between defer and async attributes on a <script> tag?',
        answer: 'async downloads the script in parallel and executes it immediately as soon as it finishes downloading (pausing HTML parsing). defer downloads in parallel but waits to execute until the HTML document has been completely parsed, preserving script order.'
      }
    ],
    resources: [
      { title: 'MDN Web Docs: HTML5 Semantics', type: 'Documentation', authorOrSource: 'Mozilla' }
    ]
  },

  'web-2': {
    id: 'web-2',
    title: 'CSS Flexbox, Grid & Responsive Design',
    estimatedReadingTime: '15 mins',
    beginnerSummary: 'Use Flexbox for 1-dimensional layouts (a row of buttons or navigation bar) and CSS Grid for 2-dimensional layouts (rows and columns together, like a dashboard or photo gallery).',
    keyTakeaways: [
      'Flexbox works along a single main axis (row or column); CSS Grid controls both rows and columns simultaneously.',
      'Use repeat(auto-fit, minmax(250px, 1fr)) for responsive grids without media query boilerplate.',
      'Box-sizing: border-box ensures padding and borders are included inside an element width.'
    ],
    contentMarkdown: `# CSS Flexbox & Grid Mastery

Mastering layout means knowing when to reach for **Flexbox** vs **CSS Grid**.

## 1. One-Line Responsive CSS Grid
Instead of writing 4 separate \`@media\` queries, modern CSS Grid creates fluid responsive columns automatically:

\`\`\`html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-family: system-ui; padding: 16px; background: #0f172a; color: white;">
  <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">Column 1</div>
  <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">Column 2</div>
  <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">Column 3</div>
</div>
\`\`\`

## 2. Flexbox Alignment Cheat Sheet
- \`justify-content\`: Aligns items along the **Main Axis** (\`flex-start\`, \`center\`, \`space-between\`).
- \`align-items\`: Aligns items along the **Cross Axis** (\`stretch\`, \`center\`, \`baseline\`).`,
    quizzes: [
      {
        id: 'web2-q1',
        question: 'In a flex container with flex-direction: column, which property centers items vertically?',
        options: [
          'align-items: center',
          'justify-content: center',
          'vertical-align: middle',
          'place-self: center'
        ],
        correctAnswerIndex: 1,
        explanation: 'When flex-direction is column, the main axis runs vertically, so justify-content controls vertical alignment.'
      }
    ],
    codingChallenge: {
      title: 'CSS Grid Dashboard Layout',
      description: 'Experiment with CSS Grid template columns and gap properties in the live HTML/CSS preview.',
      language: 'html',
      starterCode: `<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px; font-family: sans-serif; color: white; background: #0f172a; padding: 16px; border-radius: 12px;">
  <aside style="background: #1e293b; padding: 16px; border-radius: 8px;">Sidebar (1fr)</aside>
  <main style="background: #1d4ed8; padding: 16px; border-radius: 8px;">Main Workspace (2fr)</main>
</div>`,
      solutionCode: `<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px;"></div>`,
      hint: 'Try changing 1fr 2fr to repeat(3, 1fr) and re-running!'
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: 'What is a Block Formatting Context (BFC) in CSS and why is it useful?',
        answer: 'A BFC is an isolated layout mini-region where floats do not leak out and vertical margins do not collapse across boundaries. Triggered by overflow: hidden/auto or display: flow-root.'
      }
    ],
    resources: [
      { title: 'CSS Tricks Complete Guide to Grid', type: 'Documentation', authorOrSource: 'CSS-Tricks' }
    ]
  },

  'js-1': {
    id: 'js-1',
    title: 'JavaScript Execution Context, Closures & Event Loop',
    estimatedReadingTime: '16 mins',
    beginnerSummary: 'JavaScript is single-threaded, meaning it runs one command at a time on a Call Stack. It handles slow tasks like timers and network fetches without freezing the page by using the Event Loop, Microtask Queue (Promises), and Macrotask Queue (setTimeout).',
    keyTakeaways: [
      'A Closure is a function bundled together with references to its surrounding lexical environment.',
      'Microtasks (Promise.then, queueMicrotask) ALWAYS drain completely before the next Macrotask (setTimeout) runs.',
      'let and const are block-scoped and live in the Temporal Dead Zone (TDZ) until initialized.'
    ],
    contentMarkdown: `# JavaScript Internals: Closures, Hoisting & The Event Loop

Understanding how V8 executes JavaScript is essential for both frontend interviews and Node.js backend engineering.

## 1. Lexical Closures in Action
When an inner function references variables from an outer function, V8 allocates those variables on the **Heap** inside a \`Context\` object so they survive after the outer function returns:

\`\`\`javascript
function createCounter(initialValue) {
  let count = initialValue;
  return {
    increment: () => ++count,
    getValue: () => count
  };
}

const counter = createCounter(10);
console.log("After 1st increment:", counter.increment());
console.log("After 2nd increment:", counter.increment());
\`\`\`

## 2. Event Loop Priority: Call Stack vs Microtasks vs Macrotasks
1. **Call Stack**: Executes synchronous code frame by frame.
2. **Microtask Queue**: \`Promise.then/catch/finally\`, \`await\` continuations. Drained **completely** after every stack turn.
3. **Macrotask (Task) Queue**: \`setTimeout\`, \`setInterval\`, I/O callbacks.`,
    quizzes: [
      {
        id: 'js1-q1',
        question: 'What is logged to the console by: console.log("A"); setTimeout(() => console.log("B"), 0); Promise.resolve().then(() => console.log("C")); console.log("D");',
        options: [
          'A, B, C, D',
          'A, D, C, B',
          'A, D, B, C',
          'A, C, D, B'
        ],
        correctAnswerIndex: 1,
        explanation: 'Synchronous logs A and D run first. Then the Microtask queue drains (logging C from Promise.resolve) before the Macrotask queue runs setTimeout (logging B).'
      }
    ],
    codingChallenge: {
      title: 'Implement a Debounce / Memoize Function',
      description: 'Run and test a closure-backed memoization helper that caches expensive function results.',
      language: 'javascript',
      starterCode: `function memoize(fn) {
  const cache = {};
  return function(n) {
    if (cache[n] !== undefined) {
      console.log("Cache hit for:", n);
      return cache[n];
    }
    console.log("Computing for:", n);
    const result = fn(n);
    cache[n] = result;
    return result;
  };
}

const fastSquare = memoize(x => x * x);
console.log(fastSquare(12));
console.log(fastSquare(12));`,
      solutionCode: `// Already complete`,
      hint: 'Click Run Code to see the first call compute and the second call hit the closure cache.'
    },
    interviewQuestions: [
      {
        companyTag: 'Amazon',
        question: 'Why does var inside a for-loop with setTimeout print the final value repeatedly, while let prints 0, 1, 2?',
        answer: 'var is function-scoped, so all loop iterations share the same single binding. let is block-scoped and creates a fresh lexical binding for each iteration of the loop.'
      }
    ],
    resources: [
      { title: 'You Dont Know JS Yet: Scope & Closures', type: 'Book', authorOrSource: 'Kyle Simpson' }
    ]
  },

  'js-2': {
    id: 'js-2',
    title: 'TypeScript Type System, Generics & Utility Types',
    estimatedReadingTime: '14 mins',
    beginnerSummary: 'TypeScript adds compile-time static types to JavaScript so you catch bugs in your editor before running code in production. All TypeScript types are erased at compile time with zero runtime overhead.',
    keyTakeaways: [
      'TypeScript uses Structural Typing (duck typing): if two types have the same shape, they are compatible.',
      'Prefer unknown over any because unknown forces type narrowing before property access.',
      'Built-in utility types like Partial<T>, Pick<T, K>, Omit<T, K>, and Record<K, V> eliminate boilerplate.'
    ],
    contentMarkdown: `# TypeScript Generics & Structural Type Safety

TypeScript models complex API contracts using **Generics**, **Discriminated Unions**, and **Mapped Types**.

## 1. Discriminated Unions for Zero-Bug State Machines
\`\`\`javascript
function handleApiState(state) {
  if (state.status === 'loading') {
    return 'Loading spinner...';
  }
  if (state.status === 'error') {
    return 'Error: ' + state.errorMessage;
  }
  return 'Loaded ' + state.data.length + ' items';
}

console.log(handleApiState({ status: 'success', data: ['DSA', 'System Design', 'SQL'] }));
\`\`\``,
    quizzes: [
      {
        id: 'js2-q1',
        question: 'What is the key difference between "any" and "unknown" in TypeScript?',
        options: [
          'unknown is slower at runtime',
          'unknown requires type narrowing (typeof / instanceof check) before calling methods on the value, whereas any disables all type checking',
          'any only works for objects',
          'There is no difference'
        ],
        correctAnswerIndex: 1,
        explanation: 'unknown is the type-safe counterpart of any: you can assign anything to unknown, but you cannot access properties on it without narrowing its type first.'
      }
    ],
    codingChallenge: {
      title: 'Array GroupBy Helper',
      description: 'Test a generic groupBy utility that groups student records by track.',
      language: 'javascript',
      starterCode: `function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.name);
    return acc;
  }, {});
}

const students = [
  { name: 'Aarav', track: 'DSA' },
  { name: 'Priya', track: 'System Design' },
  { name: 'Rohan', track: 'DSA' }
];
console.log(JSON.stringify(groupBy(students, s => s.track), null, 2));`,
      solutionCode: `// Complete`,
      hint: 'Click Run Code to see grouped output.'
    },
    interviewQuestions: [
      {
        companyTag: 'Microsoft',
        question: 'How is Pick<T, K> implemented under the hood in TypeScript?',
        answer: 'type Pick<T, K extends keyof T> = { [P in K]: T[P]; }; — It iterates over each key P in the union K and maps it to the property type T[P].'
      }
    ],
    resources: [
      { title: 'TypeScript Handbook', type: 'Documentation', authorOrSource: 'Microsoft' }
    ]
  },

  'react-1': {
    id: 'react-1',
    title: 'React 19 Fiber Reconciliation, Hooks & State Rules',
    estimatedReadingTime: '15 mins',
    beginnerSummary: 'React updates the UI efficiently by keeping a lightweight Virtual DOM in memory, diffing changes via its Fiber engine, and updating only the exact DOM nodes that changed.',
    keyTakeaways: [
      'Never call Hooks inside loops, conditions, or nested functions—React relies on a deterministic linked-list call order on each Fiber node.',
      'State updates trigger a re-render snapshot; mutate state via setter functions, never in place.',
      'Use key props with stable unique IDs (not array indices) when rendering dynamic lists.'
    ],
    contentMarkdown: `# React Fiber Architecture & Hooks Deep Dive

## 1. Why Hooks Cannot Be Called Conditionally
Internally, each React component instance is represented by a **Fiber node** whose \`memoizedState\` points to a **singly linked list** of Hook cells:

\`\`\`
Fiber.memoizedState ──► [Hook 1: useState] ──► [Hook 2: useEffect] ──► [Hook 3: useMemo]
\`\`\`

If Hook 1 is skipped inside an \`if\` statement on re-render, Hook 2 reads Hook 1's state slot, corrupting the linked list!

## 2. Virtual DOM Key Diffing Simulation
\`\`\`javascript
function diffLists(oldKeys, newKeys) {
  const oldSet = new Set(oldKeys);
  const added = newKeys.filter(k => !oldSet.has(k));
  const reused = newKeys.filter(k => oldSet.has(k));
  return { reusedDOMNodes: reused, mountedNewNodes: added };
}

console.log(diffLists(['id-1', 'id-2', 'id-3'], ['id-3', 'id-1', 'id-4']));
\`\`\``,
    quizzes: [
      {
        id: 'react1-q1',
        question: 'Why is using the array index as a React key an anti-pattern when list items can be reordered or deleted?',
        options: [
          'React throws a syntax error',
          'Indexes shift when items are inserted/deleted, causing React to reuse the wrong component state and DOM nodes',
          'Array indices are not numbers',
          'It disables CSS styles'
        ],
        correctAnswerIndex: 1,
        explanation: 'When an item is deleted from the start of a list, every subsequent item gets a new index, tricking React into mismatching component state with the wrong item.'
      }
    ],
    codingChallenge: {
      title: 'Simulate useState State Batching',
      description: 'Run the simulation below to see how functional state updaters (prev => prev + 1) prevent stale closure bugs.',
      language: 'javascript',
      starterCode: `function simulateBatchUpdates() {
  let state = 0;
  const queue = [
    prev => prev + 1,
    prev => prev + 1,
    prev => prev * 10
  ];
  for (const updater of queue) {
    state = updater(state);
  }
  console.log("Final batched React state:", state);
}

simulateBatchUpdates();`,
      solutionCode: `simulateBatchUpdates();`,
      hint: 'Functional updates receive the latest pending state in the queue.'
    },
    interviewQuestions: [
      {
        companyTag: 'Meta',
        question: 'What problem does React Fiber solve compared to the legacy synchronous Stack Reconciler?',
        answer: 'The Stack Reconciler processed the entire component tree recursively in one uninterruptible call stack, dropping frames on large updates. Fiber turns tree traversal into an interruptible linked-list work loop that can pause, prioritize urgent user input, and resume work across frames.'
      }
    ],
    resources: [
      { title: 'React.dev Official Documentation', type: 'Documentation', authorOrSource: 'Meta Open Source' }
    ]
  },

  'cpp-1': {
    id: 'cpp-1',
    title: 'C++ & Java OOP: Pointers, RAII, JVM & Memory Management',
    estimatedReadingTime: '16 mins',
    beginnerSummary: 'C++ gives you direct control over stack vs heap memory using Pointers, References, and RAII Smart Pointers, while Java manages heap memory automatically using the JVM Garbage Collector.',
    keyTakeaways: [
      'Stack memory is ultra-fast (LIFO pointer bump) and automatically freed when a function returns.',
      'Heap memory persists until explicitly freed (C++ delete / unique_ptr) or collected by GC (Java/Python).',
      'Polymorphism uses a Virtual Method Table (vtable) to dispatch overridden methods at runtime.'
    ],
    contentMarkdown: `# Object-Oriented Programming & Memory Models (C++ & Java)

## 1. The 4 Pillars of OOP with Real Systems Examples
1. **Encapsulation**: Bundling private state with controlled public methods (e.g., \`BankAccount.withdraw()\`).
2. **Abstraction**: Hiding internal implementation complexity behind an interface (e.g., JDBC \`Connection\`).
3. **Inheritance**: Code reuse and \`IS-A\` hierarchies.
4. **Polymorphism**: Compile-time (method overloading / templates) vs Runtime (method overriding via \`vtable\`).

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Stack vs Heap & vtable Polymorphism verified!" << endl;
    return 0;
}
\`\`\``,
    quizzes: [
      {
        id: 'cpp1-q1',
        question: 'How does C++ implement runtime polymorphism when a base class pointer calls a virtual function?',
        options: [
          'By compiling every possible branch into an if-else chain',
          'Using a hidden vptr (virtual pointer) inside the object that points to the class vtable (table of function pointers)',
          'By reflection at runtime',
          'Using preprocessor macros'
        ],
        correctAnswerIndex: 1,
        explanation: 'Every class with virtual functions has a vtable; each object instance stores a hidden vptr pointing to its concrete class vtable, enabling O(1) dynamic dispatch.'
      }
    ],
    codingChallenge: {
      title: 'OOP Class Hierarchy & Polymorphism Sandbox',
      description: 'Run the object-oriented payment processor polymorphism example below.',
      language: 'javascript',
      starterCode: `class PaymentGateway {
  process(amount) {
    return "Generic payment: $" + amount;
  }
}

class UpiGateway extends PaymentGateway {
  process(amount) {
    return "Instant UPI Transfer of ₹" + amount + " [0% fee]";
  }
}

class CardGateway extends PaymentGateway {
  process(amount) {
    const fee = Math.round(amount * 0.02);
    return "Card Settlement of ₹" + (amount - fee) + " [₹" + fee + " MDR fee]";
  }
}

const gateways = [new UpiGateway(), new CardGateway()];
for (const gw of gateways) {
  console.log(gw.process(5000));
}`,
      solutionCode: `// Complete`,
      hint: 'Click Run Code to see runtime polymorphic dispatch across subclasses.'
    },
    interviewQuestions: [
      {
        companyTag: 'Goldman Sachs',
        question: 'Why should a C++ base class destructor always be declared virtual?',
        answer: 'If you delete a derived class object through a base class pointer and the base destructor is not virtual, only the base destructor runs—leaking all resources allocated by the derived class.'
      }
    ],
    resources: [
      { title: 'Effective Modern C++', type: 'Book', authorOrSource: 'Scott Meyers' }
    ]
  },

  'ai-1': {
    id: 'ai-1',
    title: 'AI, Machine Learning & LLM RAG Architecture',
    estimatedReadingTime: '15 mins',
    beginnerSummary: 'Modern AI systems combine foundational Machine Learning (supervised, unsupervised, gradient descent) with Transformer LLMs and Retrieval-Augmented Generation (RAG) using Vector Embeddings.',
    keyTakeaways: [
      'Cosine Similarity measures the angle between two high-dimensional embedding vectors to find semantic matches.',
      'RAG (Retrieval-Augmented Generation) grounds LLM answers in verified documents to prevent hallucinations.',
      'Self-Attention in Transformers computes Q (Query), K (Key), and V (Value) matrices in O(N^2) sequence length.'
    ],
    contentMarkdown: `# AI Engineering: Embeddings, Cosine Similarity & RAG Pipelines

## 1. How Vector Search & RAG Work End-to-End
1. **Chunking & Embedding**: Split knowledge base docs into chunks and convert each chunk into a dense vector (e.g. 768 floats).
2. **Vector Similarity Search**: Convert the student's question into a query vector $Q$ and compute **Cosine Similarity**:
$$\\text{similarity}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$
3. **Augmented Prompt**: Inject the top-$K$ retrieved chunks into the LLM context window.

\`\`\`python
def dot_product(a, b):
    total = 0
    for i in range(len(a)):
        total = total + (a[i] * b[i])
    return total

vec_query = [1, 2, 3]
vec_doc1 = [1, 2, 3]
vec_doc2 = [3, 0, -1]
print("High similarity score:", dot_product(vec_query, vec_doc1))
print("Low similarity score:", dot_product(vec_query, vec_doc2))
\`\`\``,
    quizzes: [
      {
        id: 'ai1-q1',
        question: 'Why do production LLM applications use RAG (Retrieval-Augmented Generation) instead of fine-tuning for rapidly changing facts?',
        options: [
          'Fine-tuning is illegal',
          'RAG injects live, up-to-date retrieved documents at inference time with citations and without expensive model retraining',
          'RAG does not require any database',
          'RAG makes the model weights smaller'
        ],
        correctAnswerIndex: 1,
        explanation: 'RAG lets you update knowledge instantaneously in a vector database and provides verifiable source citations without retraining model weights.'
      }
    ],
    codingChallenge: {
      title: 'Cosine Similarity Vector Matcher',
      description: 'Compute the cosine similarity between two semantic embedding vectors in JavaScript.',
      language: 'javascript',
      starterCode: `function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return (dot / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4);
}

console.log("Identical vectors:", cosineSimilarity([0.8, 0.6, 0.0], [0.8, 0.6, 0.0]));
console.log("Orthogonal vectors:", cosineSimilarity([1.0, 0.0, 0.0], [0.0, 1.0, 0.0]));`,
      solutionCode: `// Complete`,
      hint: 'Identical direction yields 1.0000; perpendicular vectors yield 0.0000.'
    },
    interviewQuestions: [
      {
        companyTag: 'OpenAI / Google',
        question: 'What is the time complexity of standard Transformer Self-Attention with respect to sequence length N?',
        answer: 'O(N^2) because every token attends to every other token in the sequence when computing the N x N attention matrix Q * K^T.'
      }
    ],
    resources: [
      { title: 'Attention Is All You Need (Transformer Paper)', type: 'Research Paper', authorOrSource: 'Vaswani et al.' }
    ]
  }
};
