import { LessonContent } from '../../types';

interface Blueprint {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  analogy: string;
  takeaways: string[];
  syntaxRows: { syntax: string; description: string; example: string }[];
  exampleLang: 'html' | 'javascript' | 'python' | 'sql' | 'cpp';
  exampleTitle: string;
  exampleCode: string;
  extraNotes: string;
  fillBlank: {
    prompt: string;
    codeBefore: string;
    answer: string;
    codeAfter: string;
    hint: string;
  };
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  interview: {
    company: string;
    question: string;
    answer: string;
  };
}

const EXTRA_BLUEPRINTS: Blueprint[] = [
  // ==================== TYPESCRIPT ====================
  {
    id: 'ts-1',
    title: 'TS HOME & Simple Types',
    readTime: '6 mins',
    summary: 'TypeScript is JavaScript with syntax for types. It catches typos and type bugs in your editor at compile time before your code ever runs in production.',
    analogy: 'JavaScript is like packing suitcases in the dark; TypeScript turns on the lights and labels every compartment so you never pack shoes in the laptop sleeve.',
    takeaways: [
      'Three main primitives: string, number, and boolean (all lowercase!).',
      'Explicit type annotation: let firstName: string = "Dylan";',
      'Implicit type inference: let age = 21; (TypeScript automatically infers number).'
    ],
    syntaxRows: [
      { syntax: 'let name: string = "Alex";', description: 'Explicit string type annotation', example: 'const city: string = "Delhi";' },
      { syntax: 'let score: number = 95;', description: 'Explicit number type (integers & floats)', example: 'let price: number = 19.99;' },
      { syntax: 'let active: boolean = true;', description: 'True or false boolean flag', example: 'let isDone: boolean = false;' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Type Annotations & Runtime Output',
    exampleCode: `function formatStudent(name, score, isVerified) {
  return \`Student: \${name} | Score: \${score}% | Verified: \${isVerified}\`;
}

console.log(formatStudent("Aarav", 98, true));`,
    extraNotes: 'Always use lowercase `string`, `number`, and `boolean` in TypeScript—never uppercase `String` or `Number` object wrappers.',
    fillBlank: {
      prompt: 'Add the TypeScript type annotation for a text variable:',
      codeBefore: 'let greeting: ',
      answer: 'string',
      codeAfter: ' = "Hello TypeScript";',
      hint: 'Lowercase 6-letter type for text.'
    },
    quiz: {
      question: 'Does TypeScript run directly in the browser without compilation?',
      options: ['Yes, all browsers run .ts files natively', 'No, TypeScript is transpiled into standard JavaScript (.js) and all type annotations are erased at compile time', 'Only in Chrome', 'Only in Node.js'],
      correct: 1,
      explanation: 'Browsers execute JavaScript. The TypeScript compiler (tsc) or bundler type-checks your code and strips types out to produce clean JS.'
    },
    interview: {
      company: 'Microsoft',
      question: 'What is Type Inference in TypeScript?',
      answer: 'When you initialize a variable like const count = 0;, TypeScript automatically deduces its type without requiring an explicit : number annotation.'
    }
  },
  {
    id: 'ts-2',
    title: 'TS Arrays, Tuples & Enums',
    readTime: '7 mins',
    summary: 'TypeScript lets you type homogeneous arrays (string[]), lock arrays from mutation (readonly number[]), and define fixed-length Tuples ([number, string]) where each index has a specific type.',
    analogy: 'An Array is a train where every car carries the same cargo; a Tuple is a [latitude, longitude] coordinate pair with an exact fixed order.',
    takeaways: [
      'string[] (or Array<string>) ensures only strings can be pushed into the array.',
      'readonly string[] prevents accidental .push() or .pop() mutations.',
      'A Tuple like [number, string, boolean] enforces both the exact length and the type at each position.'
    ],
    syntaxRows: [
      { syntax: 'const tags: string[] = [];', description: 'Array of strings', example: 'const nums: number[] = [1, 2, 3];' },
      { syntax: 'readonly number[]', description: 'Immutable array that cannot be modified', example: 'const ids: readonly number[] = [1, 2];' },
      { syntax: '[number, string]', description: 'Tuple with fixed length and position types', example: 'const res: [number, string] = [200, "OK"];' },
      { syntax: 'enum Status { Ready, Done }', description: 'Named set of constants', example: 'enum Role { User = "USER", Admin = "ADMIN" }' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Working with Tuples & Coordinate Pairs',
    exampleCode: `const httpTuple = [200, "OK — Request Succeeded"];
const [statusCode, statusMessage] = httpTuple;

console.log("HTTP Status Code:", statusCode);
console.log("Message:", statusMessage);`,
    extraNotes: 'React\'s `useState` hook returns a **Tuple**: `[value, setValue]`!',
    fillBlank: {
      prompt: 'Add the TypeScript modifier that prevents an array from being modified with .push():',
      codeBefore: 'const names: ',
      answer: 'readonly',
      codeAfter: ' string[] = ["Dylan", "Alex"];',
      hint: 'Combine read and only into one lowercase word.'
    },
    quiz: {
      question: 'What is a Tuple in TypeScript?',
      options: ['A sorted array', 'A typed array with a pre-defined length and specific types for each index', 'A dictionary object', 'A function that returns nothing'],
      correct: 1,
      explanation: 'Tuples specify the exact number of elements and the exact type at each index position.'
    },
    interview: {
      company: 'Airbnb',
      question: 'Why do many TypeScript teams prefer Union String Literals (type Role = "admin" | "user") over numeric Enums?',
      answer: 'Union types vanish completely at compile time with 0 bytes of runtime JS overhead, whereas TypeScript Enums emit runtime IIFE lookup objects.'
    }
  },
  {
    id: 'ts-3',
    title: 'TS Object Types, Interfaces & Type Aliases',
    readTime: '7 mins',
    summary: 'Interfaces and Type Aliases define the shape (contract) of an object. You can mark properties as optional with ? and immutable with readonly.',
    analogy: 'An Interface is an architectural blueprint—any object claiming to implement that interface must have all the required rooms and doors.',
    takeaways: [
      'interface User { id: number; name: string; email?: string; } defines an object contract.',
      'Properties marked with ? are optional and may be undefined.',
      'Interfaces can be extended using interface Admin extends User { permissions: string[]; }.'
    ],
    syntaxRows: [
      { syntax: 'interface User { id: number; }', description: 'Defines an object shape contract', example: 'interface Course { title: string; }' },
      { syntax: 'age?: number;', description: 'Optional property (number or undefined)', example: 'bio?: string;' },
      { syntax: 'readonly id: string;', description: 'Cannot be reassigned after creation', example: 'readonly createdAt: number;' },
      { syntax: 'type ID = string | number;', description: 'Type alias for unions or primitives', example: 'type Point = { x: number; y: number };' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Validating Object Contracts',
    exampleCode: `function printCourseCard(course) {
  const badge = course.isCertified ? "★ Certified" : "Standard";
  console.log(\`[\${course.id}] \${course.title} (\${badge})\`);
}

printCourseCard({ id: "c-ts", title: "TypeScript Mastery", isCertified: true });`,
    extraNotes: 'Use `interface` for object shapes that might be extended (`extends`), and `type` for unions (`A | B`), tuples, and utility types.',
    fillBlank: {
      prompt: 'Define a TypeScript interface named Car:',
      codeBefore: '',
      answer: 'interface',
      codeAfter: ' Car {\n  brand: string;\n  year: number;\n}',
      hint: 'A 9-letter keyword starting with inter...'
    },
    quiz: {
      question: 'How do you mark a property named "middleName" as optional inside a TypeScript interface?',
      options: ['optional middleName: string;', 'middleName?: string;', 'middleName: string?;', 'middleName!: string;'],
      correct: 1,
      explanation: 'Placing a question mark (?) right after the property name makes it optional.'
    },
    interview: {
      company: 'Slack',
      question: 'What is "Declaration Merging" in TypeScript and does it work with "type" or "interface"?',
      answer: 'Declaration Merging only works with "interface": if you declare interface Window twice in the same scope, TypeScript merges their properties into a single interface.'
    }
  },
  {
    id: 'ts-4',
    title: 'TS Union Types & Type Narrowing',
    readTime: '7 mins',
    summary: 'Union types (string | number) allow a variable to hold more than one type. Type Narrowing checks the runtime type (using typeof or Discriminated Unions) so TypeScript knows which methods are safe to call.',
    analogy: 'A Union type is a mystery gift box that holds either a Book or a Game; Type Narrowing is opening the label first so you know whether to read it or play it.',
    takeaways: [
      'Use | (pipe) to create a union: function printId(id: string | number).',
      'Before calling .toUpperCase() on string | number, narrow it with if (typeof id === "string").',
      'Discriminated Unions use a shared literal tag like status: "loading" | "success" | "error".'
    ],
    syntaxRows: [
      { syntax: 'string | number', description: 'Union type accepting either string or number', example: 'let code: string | number = 200;' },
      { syntax: 'if (typeof x === "string")', description: 'Type guard narrowing x to string', example: 'return x.toUpperCase();' },
      { syntax: '"success" | "error"', description: 'Literal union restricting exact values', example: 'type Theme = "light" | "dark";' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Type Narrowing with typeof Guards',
    exampleCode: `function formatCode(code) {
  if (typeof code === "string") {
    return "STRING CODE: " + code.toUpperCase();
  }
  return "NUMERIC CODE: #" + code.toFixed(0);
}

console.log(formatCode("ts-404"));
console.log(formatCode(200));`,
    extraNotes: 'Never use `any` when a Union type (`string | number`) or `unknown` can accurately express the possible values.',
    fillBlank: {
      prompt: 'Add the union operator symbol so statusCode can be either a number or a string:',
      codeBefore: 'let statusCode: number ',
      answer: '|',
      codeAfter: ' string = 200;',
      hint: 'The vertical pipe character.'
    },
    quiz: {
      question: 'Why does calling code.toUpperCase() directly on a parameter of type (string | number) cause a TypeScript error?',
      options: ['Because toUpperCase() is not a valid JS method', 'Because number does not have a .toUpperCase() method; you must narrow the union with typeof code === "string" first', 'Because unions cannot be used in functions', 'Because strings are immutable'],
      correct: 1,
      explanation: 'TypeScript only allows methods present on EVERY member of the union unless you narrow the type first.'
    },
    interview: {
      company: 'Stripe',
      question: 'How does the "never" type help enforce exhaustive switch statements on Discriminated Unions?',
      answer: 'In the default branch of a switch over a union, assigning the variable to const _exhaustiveCheck: never = state; causes a compile-time error if a new union variant is added later but not handled in the switch!'
    }
  },
  {
    id: 'ts-5',
    title: 'TS Functions, Optional Params & Void/Never',
    readTime: '6 mins',
    summary: 'TypeScript types both function parameters and return values. Use : void when a function returns nothing, and optional parameters (b?: number) when an argument can be omitted.',
    analogy: 'Typing a function is like labeling a vending machine slot: "Insert Coin (number) -> Dispenses Soda (string)".',
    takeaways: [
      'Specify return types after the parameter parentheses: function add(a: number, b: number): number.',
      'void means a function does not return a value (e.g., console.log wrapper).',
      'Function types can be aliased: type MathFn = (a: number, b: number) => number;.'
    ],
    syntaxRows: [
      { syntax: 'function add(a: number): number', description: 'Typed parameter and return value', example: 'const sq = (n: number): number => n*n;' },
      { syntax: 'function log(msg: string): void', description: 'Function that returns no value', example: 'function reset(): void {}' },
      { syntax: 'function greet(name?: string)', description: 'Optional parameter', example: 'greet() // valid' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Typed Calculators & Optional Parameters',
    exampleCode: `function multiply(a, b, bonus) {
  const base = a * b;
  return bonus ? base + bonus : base;
}

console.log("2 * 5 =", multiply(2, 5));
console.log("2 * 5 + 10 =", multiply(2, 5, 10));`,
    extraNotes: 'Required parameters must always come **before** optional parameters (`a: number, b?: number`).',
    fillBlank: {
      prompt: 'Specify the return type for a function that logs a message and returns nothing:',
      codeBefore: 'function logMessage(msg: string): ',
      answer: 'void',
      codeAfter: ' {\n  console.log(msg);\n}',
      hint: 'A 4-letter keyword meaning empty / no return value.'
    },
    quiz: {
      question: 'What does a return type of ": void" indicate in TypeScript?',
      options: ['The function returns a number', 'The function does not return any value', 'The function takes no parameters', 'The function is asynchronous'],
      correct: 1,
      explanation: 'void indicates that the function\'s return value is empty/ignored.'
    },
    interview: {
      company: 'Google',
      question: 'What is the difference between returning "void" versus "never" in TypeScript?',
      answer: 'A void function finishes normally without returning a value (implicitly returning undefined). A never function NEVER finishes normally—it either throws an exception or runs an infinite loop.'
    }
  },
  {
    id: 'ts-6',
    title: 'TS Classes & Access Modifiers',
    readTime: '7 mins',
    summary: 'TypeScript adds access modifiers to ES6 classes: public (accessible anywhere), private (only inside the class), and protected (inside the class and subclasses).',
    analogy: 'public is the lobby of a bank, protected is the employee-only breakroom, and private is the locked vault.',
    takeaways: [
      'public is the default visibility if no modifier is specified.',
      'private fields cannot be accessed from outside the class instance.',
      'Parameter properties (constructor(private name: string)) declare and assign fields in one step!'
    ],
    syntaxRows: [
      { syntax: 'private balance: number;', description: 'Accessible only inside this class', example: 'private secretKey: string;' },
      { syntax: 'protected id: string;', description: 'Accessible in class and child subclasses', example: 'protected role: string;' },
      { syntax: 'public getBalance()', description: 'Accessible from anywhere', example: 'public deposit(amt: number)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Encapsulated BankAccount Class',
    exampleCode: `class StudentWallet {
  constructor(owner, initialXp) {
    this.owner = owner;
    this.xp = initialXp;
  }
  earnXp(points) {
    this.xp += points;
    return \`\${this.owner} now has \${this.xp} XP\`;
  }
}

const wallet = new StudentWallet("Alex", 250);
console.log(wallet.earnXp(50));`,
    extraNotes: 'JavaScript also supports runtime private fields prefixed with `#` (e.g., `#balance = 0`), which are enforced by the JS engine at runtime!',
    fillBlank: {
      prompt: 'Use the access modifier that restricts a class property so it can ONLY be accessed inside the class itself:',
      codeBefore: 'class Account {\n  ',
      answer: 'private',
      codeAfter: ' pinCode: number = 1234;\n}',
      hint: 'Opposite of public (7 letters).'
    },
    quiz: {
      question: 'Which TypeScript access modifier allows a property to be accessed inside the defining class AND its child subclasses, but NOT from outside instances?',
      options: ['public', 'private', 'protected', 'readonly'],
      correct: 2,
      explanation: 'protected grants visibility to the class itself and any class that extends it.'
    },
    interview: {
      company: 'Bloomberg',
      question: 'What is the difference between TypeScript\'s "private" keyword and ECMAScript\'s "#privateField" syntax?',
      answer: 'TypeScript\'s private is only enforced at compile time and compiles to a normal public property in JS. #privateField is enforced natively by the V8 JavaScript runtime.'
    }
  },
  {
    id: 'ts-8',
    title: 'TS Utility Types & Keyof / Mapped Types',
    readTime: '8 mins',
    summary: 'TypeScript includes built-in Utility Types to transform existing interfaces without rewriting them: Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>, Readonly<T>, and Record<K, V>.',
    analogy: 'Utility types are like cookie cutters—you take one base User interface and stamp out a UpdateUserPatch (Partial) or PublicProfile (Omit password) automatically.',
    takeaways: [
      'Partial<User> makes every property of User optional (ideal for PATCH update payloads).',
      'Pick<User, "id" | "name"> creates a new type with ONLY those specified keys.',
      'Omit<User, "password"> creates a new type with everything EXCEPT password.'
    ],
    syntaxRows: [
      { syntax: 'Partial<T>', description: 'Makes all properties in T optional', example: 'Partial<User>' },
      { syntax: 'Pick<T, "id" | "name">', description: 'Keeps only selected keys from T', example: 'Pick<Todo, "title">' },
      { syntax: 'Omit<T, "password">', description: 'Removes specified keys from T', example: 'Omit<User, "secret">' },
      { syntax: 'Record<string, number>', description: 'Typed dictionary map from key type to value type', example: 'Record<Role, boolean>' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Updating State Safely with Partial Patch Pattern',
    exampleCode: `function updateProfile(currentProfile, patch) {
  return { ...currentProfile, ...patch };
}

const user = { id: 1, name: "Alex", level: 1, streak: 5 };
const updated = updateProfile(user, { level: 2, streak: 6 });
console.log("Updated Profile:", JSON.stringify(updated));`,
    extraNotes: 'Use `keyof T` to obtain a union of all public property names of type `T` (e.g., `"id" | "name" | "email"`).',
    fillBlank: {
      prompt: 'Use the built-in TypeScript Utility Type that makes all properties of User optional:',
      codeBefore: 'type UserPatch = ',
      answer: 'Partial',
      codeAfter: '<User>;',
      hint: 'Starts with Part... (7 letters).'
    },
    quiz: {
      question: 'Which TypeScript Utility Type creates a new type by removing specific keys from an existing interface?',
      options: ['Pick<T, K>', 'Omit<T, K>', 'Partial<T>', 'Record<K, T>'],
      correct: 1,
      explanation: 'Omit<T, K> constructs a type by picking all properties from T and then removing K.'
    },
    interview: {
      company: 'Netflix',
      question: 'What does ReturnType<typeof myFunction> do in TypeScript?',
      answer: 'It extracts the exact return type of myFunction automatically so your types stay in sync even if the function implementation changes.'
    }
  },

  // ==================== REACT 19 ====================
  {
    id: 'react-home',
    title: 'React HOME, JSX & Components',
    readTime: '7 mins',
    summary: 'React is a JavaScript library for building user interfaces out of reusable, isolated pieces called Components. React components are JavaScript functions that return JSX markup.',
    analogy: 'React Components are like LEGO bricks: you build a Button brick, a Card brick, and a Navbar brick, then snap them together to build an entire castle.',
    takeaways: [
      'React component names MUST start with a capital letter (e.g., <CourseCard />, not <courseCard />).',
      'JSX lets you write HTML-like tags inside JavaScript and embed expressions inside curly braces {expression}.',
      'Every component must return a single root element (or a Fragment <>...</>).'
    ],
    syntaxRows: [
      { syntax: 'function App() { return <h1>Hi</h1>; }', description: 'Functional React component', example: 'export default App;' },
      { syntax: '{userName}', description: 'Embeds any JS expression inside JSX', example: '<p>Score: {10 + 20}</p>' },
      { syntax: 'className="box"', description: 'Assigns CSS classes in JSX (instead of class)', example: '<div className="p-4">' },
      { syntax: '<> ... </>', description: 'React Fragment groups elements without adding a DOM div', example: '<><h1>Title</h1><p>Sub</p></>' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating a React Component Render Function',
    exampleCode: `function WelcomeBanner(props) {
  return \`<header class="banner"><h1>Welcome, \${props.student}!</h1><p>Track: \${props.track}</p></header>\`;
}

console.log(WelcomeBanner({ student: "Alex", track: "React 19" }));`,
    extraNotes: 'In JSX, attributes are written in camelCase: use `className` instead of `class`, `htmlFor` instead of `for`, and `onClick` instead of `onclick`.',
    fillBlank: {
      prompt: 'In React JSX, which attribute is used instead of "class" to specify a CSS class?',
      codeBefore: '<div ',
      answer: 'className',
      codeAfter: '="card">Hello React</div>',
      hint: 'Starts with class followed by Name in camelCase.'
    },
    quiz: {
      question: 'How must all React component function names begin?',
      options: ['With a lowercase letter', 'With an uppercase capital letter (e.g. HeaderCard)', 'With an underscore', 'With use'],
      correct: 1,
      explanation: 'JSX treats lowercase tags (<div>) as built-in HTML elements and capitalized tags (<MyButton />) as React components.'
    },
    interview: {
      company: 'Meta',
      question: 'Why do we need React Fragments (<>...</>)?',
      answer: 'Fragments let a component return multiple sibling elements without polluting the browser DOM with unnecessary wrapper <div> nodes (which could break CSS Flexbox or Grid layouts).'
    }
  },
  {
    id: 'react-props',
    title: 'React Props & Conditional Rendering',
    readTime: '7 mins',
    summary: 'Props (short for properties) are how parent components pass data down to child components. Props are read-only (immutable)—a child component must never mutate its own props!',
    analogy: 'Props are like arguments passed to a function, or settings dialed into a toaster before pressing start.',
    takeaways: [
      'Destructure props right in the function signature: function Badge({ label, color = "green" }).',
      'Props flow strictly ONE WAY: down from parent to child.',
      'Use ternary condition ? <A /> : <B /> or logical && for conditional rendering in JSX.'
    ],
    syntaxRows: [
      { syntax: '<Card title="DSA" />', description: 'Passes string prop "title" to Card', example: '<User xp={250} />' },
      { syntax: 'function Card({ title })', description: 'Destructures props in component parameter', example: 'function Btn({ label = "Run" })' },
      { syntax: '{isLoggedIn ? <Home/> : <Login/>}', description: 'Conditional ternary rendering', example: '{isDone && <span>✓</span>}' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'One-Way Props & Conditional Badge Rendering',
    exampleCode: `function renderCourseBadge({ title, xp, isCompleted }) {
  const status = isCompleted ? "✓ Completed" : "In Progress";
  return \`[\${status}] \${title} (+\${xp} XP)\`;
}

console.log(renderCourseBadge({ title: "React Props", xp: 50, isCompleted: true }));
console.log(renderCourseBadge({ title: "React Hooks", xp: 50, isCompleted: false }));`,
    extraNotes: 'Watch out when using `{count && <Badge />}` in JSX: if `count` is `0`, React renders the number `0` on screen! Use `{count > 0 && <Badge />}` instead.',
    fillBlank: {
      prompt: 'Destructure the "title" prop directly inside the component parameter list:',
      codeBefore: 'function Header({ ',
      answer: 'title',
      codeAfter: ' }) {\n  return <h1>{title}</h1>;\n}',
      hint: 'The exact name of the prop being rendered inside <h1>.'
    },
    quiz: {
      question: 'Can a child component directly modify (mutate) the props object passed to it by its parent?',
      options: ['Yes, anytime', 'No, props in React are strictly read-only (immutable)', 'Only if it uses var', 'Only inside a loop'],
      correct: 1,
      explanation: 'Props are immutable snapshots passed from parent to child. If data needs to change, the component must use state.'
    },
    interview: {
      company: 'Shopify',
      question: 'Why does {items.length && <ItemList />} print a stray "0" on the page when items is empty?',
      answer: 'In JavaScript, 0 && expression short-circuits and returns 0. Since 0 is a valid renderable number in React JSX, React prints "0" into the DOM. Always use items.length > 0 && <ItemList />.'
    }
  },
  {
    id: 'react-lists',
    title: 'React Lists, Keys & Event Handling',
    readTime: '7 mins',
    summary: 'In React, you render lists of data using array.map() and give every item a unique, stable key={item.id} prop so React can track insertions, deletions, and reorders accurately.',
    analogy: 'A React key is like a student roll number—even if students change seats in the classroom, the teacher identifies each student by their unique ID, not by which chair number they are sitting in.',
    takeaways: [
      'Always provide a unique, stable key={item.id} on the outermost element returned inside .map().',
      'Avoid using array index as a key if list items can be sorted, filtered, or deleted.',
      'Pass function references to events: onClick={handleClick} or onClick={() => onSelect(item.id)}.'
    ],
    syntaxRows: [
      { syntax: 'items.map(i => <li key={i.id}>{i.name}</li>)', description: 'Renders an array of JSX elements with unique keys', example: 'courses.map(c => <Card key={c.id} />)' },
      { syntax: 'onClick={handleClick}', description: 'Passes click handler function reference', example: '<button onClick={() => setOpen(true)}>' },
      { syntax: 'onChange={e => setVal(e.target.value)}', description: 'Reads input text change event', example: '<input onChange={handleChange} />' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Mapping Data Arrays to UI Elements',
    exampleCode: `const tracks = [
  { id: "t1", name: "HTML5 & CSS3" },
  { id: "t2", name: "JavaScript & TypeScript" },
  { id: "t3", name: "React 19" }
];

const renderedList = tracks.map(t => \`<li data-key="\${t.id}">\${t.name}</li>\`).join("\\n");
console.log(renderedList);`,
    extraNotes: 'Never write `onClick={handleClick()}` with parentheses in JSX unless `handleClick` returns a function—otherwise it executes immediately during render!',
    fillBlank: {
      prompt: 'Add the special React prop required on every element inside a .map() list:',
      codeBefore: 'users.map(u => <li ',
      answer: 'key',
      codeAfter: '={u.id}>{u.name}</li>)',
      hint: 'A 3-letter prop that uniquely identifies list items.'
    },
    quiz: {
      question: 'What happens if you write <button onClick={deleteItem(id)}> instead of <button onClick={() => deleteItem(id)}>?',
      options: ['It works normally', 'deleteItem(id) executes immediately while the component is rendering instead of waiting for a click', 'It disables the button', 'React ignores it'],
      correct: 1,
      explanation: 'Calling the function with () invokes it during render. Always pass a function reference or arrow function () => deleteItem(id).'
    },
    interview: {
      company: 'Netflix',
      question: 'Does a child component receive "key" inside its props object (props.key)?',
      answer: 'No! "key" (and "ref" in React 18) is reserved internally by React for reconciliation. If the child component needs the ID, pass it as a separate prop like id={item.id}.'
    }
  },
  {
    id: 'react-state',
    title: 'React useState Hook & State Updates',
    readTime: '8 mins',
    summary: 'The useState Hook gives a functional component its own reactive memory. Calling the state setter function (setCount(newCount)) tells React to re-render the component with the updated state.',
    analogy: 'If props are a printed letter mailed to you, state is your personal notepad that you can update whenever something changes.',
    takeaways: [
      'const [count, setCount] = useState(0) returns the current state value and a setter function.',
      'Never mutate state directly (count++ or user.name = "Bob" will NOT trigger a re-render!).',
      'When updating state based on previous state, use an updater function: setCount(prev => prev + 1).'
    ],
    syntaxRows: [
      { syntax: 'const [val, setVal] = useState(0);', description: 'Declares a state variable initialized to 0', example: 'const [open, setOpen] = useState(false);' },
      { syntax: 'setCount(prev => prev + 1);', description: 'Safe functional state update', example: 'setItems(prev => [...prev, item]);' },
      { syntax: 'setUser({ ...user, xp: 100 });', description: 'Immutable object state update', example: 'setForm({ ...form, email })' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Why Functional State Updates Matter',
    exampleCode: `let stateCount = 0;

// Stale snapshot simulation vs Functional update simulation
const functionalQueue = [
  prev => prev + 1,
  prev => prev + 1,
  prev => prev + 1
];

for (const update of functionalQueue) {
  stateCount = update(stateCount);
}
console.log("Final count after 3 functional updates:", stateCount);`,
    extraNotes: 'To remove an item from a React state array immutably, use `.filter()`: `setTodos(prev => prev.filter(t => t.id !== targetId))`.',
    fillBlank: {
      prompt: 'Import and call the React Hook used to add local state to a component:',
      codeBefore: 'const [count, setCount] = ',
      answer: 'useState',
      codeAfter: '(0);',
      hint: 'Starts with use followed by State.'
    },
    quiz: {
      question: 'If count is 0 and you call setCount(count + 1) three times in the same click handler, what will count be on the next render?',
      options: ['3', '1 (because count is still 0 in the current render snapshot; use setCount(prev => prev + 1) to get 3)', '0', 'Undefined'],
      correct: 1,
      explanation: 'State variables behave like immutable snapshots during a single render turn. Calling setCount(0 + 1) three times just sets it to 1.'
    },
    interview: {
      company: 'Meta',
      question: 'What is Automatic Batching in React 18 and React 19?',
      answer: 'React groups multiple setState calls inside event handlers, Promises, setTimeout, or native events into a single re-render pass for better performance.'
    }
  },
  {
    id: 'react-forms',
    title: 'React Forms & Controlled Inputs',
    readTime: '7 mins',
    summary: 'In a Controlled Component, React state is the "single source of truth" for form inputs: the input\'s value is bound to value={text} and updated via onChange={e => setText(e.target.value)}.',
    analogy: 'A Controlled Input is like a digital speedometer connected directly to the engine state—it only displays what React state tells it.',
    takeaways: [
      'Always call e.preventDefault() inside onSubmit={handleSubmit} so the browser doesn\'t reload the page.',
      'Bind text inputs with value={state} and onChange={e => setState(e.target.value)}.',
      'Bind checkboxes with checked={isChecked} and onChange={e => setIsChecked(e.target.checked)}.'
    ],
    syntaxRows: [
      { syntax: 'value={text} onChange={...}', description: 'Controlled text input pattern', example: '<input value={q} onChange={e => setQ(e.target.value)} />' },
      { syntax: 'e.preventDefault()', description: 'Prevents full-page browser reload on form submit', example: 'const onSubmit = e => { e.preventDefault(); }' },
      { syntax: 'checked={bool}', description: 'Controlled checkbox or radio button', example: '<input type="checkbox" checked={done} />' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Form Validation State Logic',
    exampleCode: `function validateSignupForm({ email, password }) {
  const errors = {};
  if (!email.includes("@")) errors.email = "Invalid email address";
  if (password.length < 8) errors.password = "Password must be at least 8 chars";
  return { isValid: Object.keys(errors).length === 0, errors };
}

console.log(validateSignupForm({ email: "alex@edu.io", password: "supersecretpassword" }));`,
    extraNotes: 'In React 19, you can also use `<form action={submitAction}>` along with the `useActionState` hook for effortless form submission!',
    fillBlank: {
      prompt: 'Prevent the browser from refreshing the page inside a React form submit handler:',
      codeBefore: 'function handleSubmit(e) {\n  e.',
      answer: 'preventDefault',
      codeAfter: '();\n}',
      hint: 'Starts with prevent and ends with Default.'
    },
    quiz: {
      question: 'What happens if you pass value="hello" to a React <input> without providing an onChange handler?',
      options: ['It works normally', 'The input becomes read-only (locked) and logs a React warning because state never updates when typing', 'It deletes the input', 'It submits automatically'],
      correct: 1,
      explanation: 'A controlled input with a fixed value and no onChange handler cannot change its displayed text when the user types.'
    },
    interview: {
      company: 'Atlassian',
      question: 'What is the difference between a Controlled Component and an Uncontrolled Component in React?',
      answer: 'Controlled components store input values in React state via value/onChange. Uncontrolled components let the DOM store the input value and read it on demand using a ref (inputRef.current.value) or FormData.'
    }
  },
  {
    id: 'react-effect',
    title: 'React useEffect Hook & Data Fetching',
    readTime: '8 mins',
    summary: 'useEffect lets you synchronize a component with an external system (fetching API data, setting up timers, or listening to window events) after the component renders.',
    analogy: 'Rendering is assembling a picture frame; useEffect is hanging it on the wall and plugging in its LED light after the frame is built.',
    takeaways: [
      'useEffect(fn, []) with an empty dependency array runs ONLY ONCE when the component mounts.',
      'useEffect(fn, [userId]) re-runs whenever userId changes.',
      'Return a cleanup function () => clearInterval(id) to prevent memory leaks when the component unmounts!'
    ],
    syntaxRows: [
      { syntax: 'useEffect(() => { ... }, [])', description: 'Runs once on component mount', example: 'useEffect(() => { fetchUser(); }, [])' },
      { syntax: 'useEffect(() => { ... }, [id])', description: 'Runs on mount and whenever "id" changes', example: 'useEffect(() => { load(id); }, [id])' },
      { syntax: 'return () => cleanup();', description: 'Cleanup function run on unmount or before re-run', example: 'return () => window.removeEventListener(...)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating Effect Mount, Dependency Change & Cleanup',
    exampleCode: `function simulateEffectLifecycle(prevDep, nextDep) {
  if (prevDep !== nextDep) {
    console.log("1. Running cleanup for old dependency:", prevDep);
    console.log("2. Running effect for new dependency:", nextDep);
  }
}

simulateEffectLifecycle("course-1", "course-2");`,
    extraNotes: 'Never needed `useEffect` just to compute derived data from existing props/state! Instead of `useEffect(() => setFullName(first + " " + last))`, just write `const fullName = first + " " + last;` directly during render.',
    fillBlank: {
      prompt: 'Pass the dependency array that tells useEffect to run ONLY ONCE when the component mounts:',
      codeBefore: 'useEffect(() => {\n  loadInitialData();\n}, ',
      answer: '[]',
      codeAfter: ');',
      hint: 'An empty array bracket pair.'
    },
    quiz: {
      question: 'When does the cleanup function returned from useEffect run?',
      options: ['Before the component mounts', 'When the component unmounts AND right before the effect re-runs due to a dependency change', 'Only when an error occurs', 'Never'],
      correct: 1,
      explanation: 'React runs the previous cleanup function before re-running the effect with new dependencies, and one final time when unmounting.'
    },
    interview: {
      company: 'Uber',
      question: 'How do you prevent race conditions when fetching data inside useEffect as a user rapidly clicks through tabs?',
      answer: 'Create an AbortController (or boolean ignore = false flag) inside useEffect, pass signal to fetch(), and call controller.abort() (or ignore = true) inside the useEffect cleanup function.'
    }
  },
  {
    id: 'react-perf',
    title: 'React useRef, useMemo, useCallback & Custom Hooks',
    readTime: '8 mins',
    summary: 'useRef holds a mutable value or DOM element reference without triggering re-renders. useMemo caches expensive calculated values, useCallback caches function references, and Custom Hooks (useWindowSize) share stateful logic across components.',
    analogy: 'useState is a loud announcement that redraws the room; useRef is a quiet pocket note you can update silently without redrawing anything.',
    takeaways: [
      'Mutating ref.current = newValue does NOT trigger a component re-render.',
      'Attach ref={inputRef} to an <input> to call inputRef.current.focus() imperatively.',
      'Custom Hooks are functions starting with "use" (like useLocalStorage) that compose built-in hooks.'
    ],
    syntaxRows: [
      { syntax: 'const ref = useRef(null);', description: 'Creates a persistent ref object { current: null }', example: 'inputRef.current?.focus();' },
      { syntax: 'useMemo(() => compute(a), [a])', description: 'Caches expensive calculation result until "a" changes', example: 'const sorted = useMemo(() => ..., [list])' },
      { syntax: 'useCallback(fn, [deps])', description: 'Caches function identity across renders', example: 'const onSave = useCallback(() => {}, [])' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Memoization Cache Simulation',
    exampleCode: `function filterThousandTopics(topics, query) {
  return topics.filter(t => t.toLowerCase().includes(query.toLowerCase()));
}

const allTopics = ["HTML5", "CSS3 Grid", "JS Closures", "React Hooks", "SQL Joins", "Binary Search"];
console.log("Filtered memoized result:", filterThousandTopics(allTopics, "react"));`,
    extraNotes: 'In **React 19**, the new **React Compiler** automatically memoizes values and callbacks behind the scenes, reducing the need for manual `useMemo` and `useCallback`!',
    fillBlank: {
      prompt: 'Use the React Hook that creates a reference to a DOM element without causing re-renders:',
      codeBefore: 'const inputRef = ',
      answer: 'useRef',
      codeAfter: '(null);',
      hint: 'Starts with use followed by Ref.'
    },
    quiz: {
      question: 'Does changing myRef.current = 42 cause a React component to re-render?',
      options: ['Yes, immediately', 'No, mutating .current on a useRef object never triggers a re-render', 'Only in strict mode', 'It throws an error'],
      correct: 1,
      explanation: 'useRef is an escape hatch that persists values across renders without triggering re-renders when mutated.'
    },
    interview: {
      company: 'Airbnb',
      question: 'What is the difference between a Custom Hook and a regular utility function?',
      answer: 'A Custom Hook (whose name starts with "use") can call stateful React Hooks like useState and useEffect inside it, giving each component that calls the custom hook its own isolated state instance.'
    }
  },

  // ==================== PYTHON BASICS ====================
  {
    id: 'py-home',
    title: 'Python HOME, Syntax & Variables',
    readTime: '6 mins',
    summary: 'Python is one of the world\'s most popular programming languages for Web, AI/ML, Data Science, and Interviews. Unlike C++ or Java, Python uses clean indentation instead of curly braces {} to define code blocks.',
    analogy: 'Reading Python is like reading plain English pseudocode—there are no semicolons or curly braces cluttering the page.',
    takeaways: [
      'Use print() to display output.',
      'Indentation (4 spaces) is mandatory to define blocks inside if, for, and def.',
      'Variables are created the moment you assign a value: x = 10; name = "Alex".'
    ],
    syntaxRows: [
      { syntax: 'print("Hello")', description: 'Prints text or variables to standard output', example: 'print("Score:", 100)' },
      { syntax: 'a, b = 10, 20', description: 'Multiple assignment / tuple unpacking in one line', example: 'a, b = b, a # swap!' },
      { syntax: '# comment', description: 'Single-line comment in Python', example: '# Initialize counter' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Python Variables & One-Line Swap',
    exampleCode: `student = "Alex"
a = 10
b = 99
a, b = b, a

print("Welcome to Python,", student)
print("Swapped a:", a, "| Swapped b:", b)`,
    extraNotes: 'In Python, you can swap two variables without a temporary variable using tuple unpacking: `a, b = b, a`!',
    fillBlank: {
      prompt: 'Use the built-in Python function to display "Hello Python!" on screen:',
      codeBefore: '',
      answer: 'print',
      codeAfter: '("Hello Python!")',
      hint: 'A 5-letter lowercase function.'
    },
    quiz: {
      question: 'How does Python define the scope of a code block (such as inside an if statement or loop)?',
      options: ['Curly braces { }', 'Indentation (whitespace)', 'BEGIN and END keywords', 'Parentheses ( )'],
      correct: 1,
      explanation: 'Python uses indentation (standard 4 spaces) to structure code blocks.'
    },
    interview: {
      company: 'Google',
      question: 'Is Python a statically typed or dynamically typed language?',
      answer: 'Python is dynamically and strongly typed: variables do not have fixed static types, but objects themselves have strict types (so "5" + 5 raises a TypeError instead of coercing silently).'
    }
  },
  {
    id: 'py-strings',
    title: 'Python Strings, Slicing & Formatting',
    readTime: '7 mins',
    summary: 'Python strings are immutable sequences of Unicode characters. You can extract substrings using slice notation s[start:stop:step] and embed variables cleanly using f-strings.',
    analogy: 'String slicing s[0:4] is like cutting a loaf of bread from slice index 0 up to (but not including) cut mark 4.',
    takeaways: [
      'Strings are immutable—you cannot do s[0] = "A"; instead, create a new string.',
      's[::-1] reverses any string or list in one expression!',
      'Use .strip(), .lower(), .upper(), .split(), and " ".join(words) for fast text processing.'
    ],
    syntaxRows: [
      { syntax: 's[start:stop:step]', description: 'Extracts a slice from start up to stop-1', example: '"PYTHON"[0:3] # "PYT"' },
      { syntax: 's[::-1]', description: 'Reverses a string using step -1', example: '"ABC"[::-1] # "CBA"' },
      { syntax: 's.split(" ")', description: 'Splits string into a list of words', example: '"a,b,c".split(",")' },
      { syntax: '"-".join(list)', description: 'Joins list of strings in O(N) time', example: '" ".join(["Hi", "All"])' },
    ],
    exampleLang: 'python',
    exampleTitle: 'String Slicing & Palindrome Check in Python',
    exampleCode: `word = "racecar"
reversed_word = word[::-1]

print("Original:", word)
print("Reversed:", reversed_word)
print("Is Palindrome?", word == reversed_word)`,
    extraNotes: 'In loops, never concatenate strings repeatedly with `s += char` (which can be $O(N^2)$). Append to a list `chars.append(c)` and call `"".join(chars)` in $O(N)$ time!',
    fillBlank: {
      prompt: 'Complete the Python slice step to reverse the string s:',
      codeBefore: 'reversed_s = s[',
      answer: '::-1',
      codeAfter: ']',
      hint: 'Two colons followed by -1.'
    },
    quiz: {
      question: 'What does "CodeItOut"[0:4] evaluate to in Python?',
      options: ['"CodeI"', '"Code"', '"ItOut"', '"Cod"'],
      correct: 1,
      explanation: 'Slicing [0:4] starts at index 0 and stops right before index 4 (indices 0, 1, 2, 3 -> "Code").'
    },
    interview: {
      company: 'Amazon',
      question: 'Why is "".join(list_of_strings) preferred over concatenating strings with + inside a loop?',
      answer: 'Because Python strings are immutable, concatenating in a loop allocates and copies a new string on each iteration. "".join() pre-calculates the total length and performs a single O(N) memory allocation.'
    }
  },
  {
    id: 'py-lists',
    title: 'Python Lists, Tuples, Sets & Dictionaries',
    readTime: '8 mins',
    summary: 'Python has 4 built-in collection data structures: List [ ] (ordered, mutable), Tuple ( ) (ordered, immutable), Set { } (unordered unique items, O(1) lookup), and Dict {k: v} (key-value hash map, O(1) lookup).',
    analogy: 'A List is a numbered shopping list; a Tuple is a laminated ID card; a Set is a bag of unique marbles; a Dict is a phonebook mapping names to phone numbers.',
    takeaways: [
      'List append/pop at the end is O(1) amortized; inserting/popping at index 0 is O(N).',
      'Checking x in my_set or k in my_dict is O(1) average time via hashing!',
      'Only immutable (hashable) types like str, int, and tuple can be used as Dictionary keys or Set elements.'
    ],
    syntaxRows: [
      { syntax: 'nums = [10, 20, 30]', description: 'Mutable dynamic array (List)', example: 'nums.append(40)' },
      { syntax: 'point = (10, 20)', description: 'Immutable Tuple (can be a dict key)', example: 'x, y = point' },
      { syntax: 'seen = {1, 2, 3}', description: 'Set of unique items with O(1) lookup', example: 'seen.add(4)' },
      { syntax: 'scores = {"Alex": 95}', description: 'Hash table Dictionary mapping keys to values', example: 'scores.get("Alex", 0)' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Lists & Dictionary Frequency Counter',
    exampleCode: `nums = [4, 2, 4, 9, 2, 4]
counts = {}

for n in nums:
    if n in counts:
        counts[n] = counts[n] + 1
    else:
        counts[n] = 1

print("Input List:", nums)
print("Frequency Dict:", counts)`,
    extraNotes: 'Use `my_dict.get(key, default_val)` to safely read a dictionary key without raising a `KeyError` if the key does not exist.',
    fillBlank: {
      prompt: 'Use the List method that adds a new item to the end of the list in O(1) time:',
      codeBefore: 'fruits = ["apple", "banana"]\nfruits.',
      answer: 'append',
      codeAfter: '("mango")',
      hint: 'A 6-letter method starting with app...'
    },
    quiz: {
      question: 'What is the average time complexity of checking "if key in my_dict:" in Python?',
      options: ['O(N)', 'O(log N)', 'O(1) constant time (backed by a Hash Table)', 'O(N²)'],
      correct: 2,
      explanation: 'Python dictionaries and sets are implemented as hash tables, giving O(1) average-case lookup, insert, and delete.'
    },
    interview: {
      company: 'Microsoft',
      question: 'Can a Python List [1, 2] be used as a key in a Dictionary?',
      answer: 'No! Dictionary keys must be hashable (immutable). Since Lists are mutable, using a list as a key raises TypeError: unhashable type: "list". Convert it to a tuple (1, 2) first.'
    }
  },
  {
    id: 'py-loops',
    title: 'Python If...Else, For/While Loops & Comprehensions',
    readTime: '7 mins',
    summary: 'Python uses if / elif / else for branching and for / while for loops. List Comprehensions ([x*2 for x in nums if x > 0]) provide a fast, Pythonic one-liner to filter and transform lists.',
    analogy: 'A List Comprehension is a compact factory pipeline: [output_expression for item in input_list if filter_condition].',
    takeaways: [
      'Python uses elif (not "else if") and logical words and, or, not (not &&, ||, !).',
      'range(start, stop, step) generates numbers lazily without allocating a list in memory.',
      'Use enumerate(items) when you need both the index i and the value v in a loop.'
    ],
    syntaxRows: [
      { syntax: 'if x > 0: ... elif x == 0: ...', description: 'Multi-branch conditional statement', example: 'if a and b:' },
      { syntax: 'for i in range(5):', description: 'Loops i = 0, 1, 2, 3, 4', example: 'for i in range(1, 10, 2):' },
      { syntax: '[x**2 for x in range(5)]', description: 'List comprehension generating squares', example: '[n for n in nums if n % 2 == 0]' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Python Loops & List Filtering',
    exampleCode: `scores = [45, 82, 91, 60, 98, 73]
passing_honors = []

for s in scores:
    if s >= 80:
        passing_honors.append(s)

print("All scores:", scores)
print("Honors (>= 80):", passing_honors)`,
    extraNotes: 'In Python, `for...else` and `while...else` are valid! The `else` block after a loop runs only if the loop finished normally without hitting a `break`.',
    fillBlank: {
      prompt: 'Write the Python keyword for "else if":',
      codeBefore: 'if score >= 90:\n    grade = "A"\n',
      answer: 'elif',
      codeAfter: ' score >= 80:\n    grade = "B"',
      hint: 'A 4-letter contraction of else and if.'
    },
    quiz: {
      question: 'What numbers does range(2, 8, 2) produce in Python?',
      options: ['2, 4, 6, 8', '2, 4, 6', '2, 3, 4, 5, 6, 7, 8', '0, 2, 4, 6'],
      correct: 1,
      explanation: 'range(start=2, stop=8, step=2) starts at 2, steps by 2, and stops strictly before 8 -> 2, 4, 6.'
    },
    interview: {
      company: 'Goldman Sachs',
      question: 'What is the difference between [x*x for x in range(10**6)] and (x*x for x in range(10**6))?',
      answer: 'Square brackets [...] build the entire 1-million-element list in RAM immediately. Parentheses (...) create a lazy Generator Expression that yields one item at a time using O(1) memory!'
    }
  },
  {
    id: 'py-funcs',
    title: 'Python Functions, *args, **kwargs & Lambda',
    readTime: '7 mins',
    summary: 'Functions in Python are defined with the def keyword. Python supports positional arguments, keyword arguments, variable-length *args (tuple) and **kwargs (dict), and one-line lambda functions.',
    analogy: '*args is a backpack that accepts any number of unnamed items as a Tuple; **kwargs is a labeled organizer that accepts any number of named key=value pairs as a Dict.',
    takeaways: [
      'Define functions with def my_func(param1, param2=default):.',
      'lambda x: x * 2 creates a concise anonymous function (commonly used as sort keys: nums.sort(key=lambda x: x[1])).',
      'Never use a mutable default argument like def add(item, bucket=[])—use bucket=None instead!'
    ],
    syntaxRows: [
      { syntax: 'def add(a, b=0): return a + b', description: 'Function with default argument', example: 'add(5) # 5' },
      { syntax: 'def fn(*args, **kwargs):', description: 'Accepts arbitrary positional & keyword args', example: 'fn(1, 2, mode="fast")' },
      { syntax: 'lambda x: x * 2', description: 'Single-expression anonymous function', example: 'key=lambda item: item[1]' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Python Functions & Modular Helpers',
    exampleCode: `def compute_stats(numbers):
    total = 0
    for n in numbers:
        total = total + n
    avg = total / len(numbers)
    return total, avg

nums = [10, 20, 30, 40, 50]
print("Total & Average:", compute_stats(nums))`,
    extraNotes: 'Python functions can return multiple values separated by commas (`return min_val, max_val`), which automatically packs them into a tuple!',
    fillBlank: {
      prompt: 'Use the Python keyword to define a new function named greet:',
      codeBefore: '',
      answer: 'def',
      codeAfter: ' greet(name):\n    return "Hello " + name',
      hint: 'A 3-letter keyword short for define.'
    },
    quiz: {
      question: 'What types do *args and **kwargs collect arguments into inside a Python function?',
      options: ['Both are lists', '*args is a Tuple of positional arguments; **kwargs is a Dictionary of keyword arguments', '*args is a Dict; **kwargs is a Tuple', 'Both are sets'],
      correct: 1,
      explanation: '*args packs extra positional arguments into a tuple, and **kwargs packs extra named arguments into a dict.'
    },
    interview: {
      company: 'Meta / Dropbox',
      question: 'Why is def append_to(val, target=[]): a famous Python bug?',
      answer: 'Default argument values in Python are evaluated ONLY ONCE when the def statement is executed, not on each function call. All calls share the exact same list in memory!'
    }
  },
  {
    id: 'py-oop',
    title: 'Python Classes, Objects, Inheritance & Dunder Methods',
    readTime: '8 mins',
    summary: 'Python is an object-oriented language. Classes define blueprints using class ClassName:, initialize instance attributes inside def __init__(self, ...):, and customize behavior with magic "dunder" methods like __str__ and __len__.',
    analogy: 'self in Python is like "this" in Java/JS—it explicitly refers to the specific object instance currently calling the method.',
    takeaways: [
      '__init__(self, ...) is the constructor method called when a new instance is created.',
      'Every instance method in Python must take self as its first parameter.',
      'Dunder (double underscore) methods like __str__, __eq__, and __lt__ let your objects work with print(), ==, and sort().'
    ],
    syntaxRows: [
      { syntax: 'class User:', description: 'Declares a new class', example: 'class Admin(User): # inheritance' },
      { syntax: 'def __init__(self, name):', description: 'Initializer / constructor method', example: 'self.name = name' },
      { syntax: 'def __str__(self):', description: 'Human-readable string representation for print()', example: 'return f"User({self.name})"' },
      { syntax: 'super().__init__()', description: 'Calls parent class method', example: 'super().__init__(id)' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Object-Oriented Student Profile in Python',
    exampleCode: `def create_student(name, xp):
    return {"name": name, "xp": xp, "level": (xp // 200) + 1}

s1 = create_student("Alex", 450)
print("Student Object:", s1)`,
    extraNotes: 'Adding `__slots__ = ("id", "name")` to a Python class replaces the per-instance `__dict__` hash table with a compact C array, cutting RAM usage by ~50%!',
    fillBlank: {
      prompt: 'Complete the name of the special constructor method in a Python class:',
      codeBefore: 'class Person:\n    def ',
      answer: '__init__',
      codeAfter: '(self, name):\n        self.name = name',
      hint: 'Starts and ends with double underscores around init.'
    },
    quiz: {
      question: 'What is the purpose of the "self" parameter in Python class methods?',
      options: ['It makes the method private', 'It references the current instance of the class so the method can access its attributes and other methods', 'It is a global variable', 'It imports modules'],
      correct: 1,
      explanation: 'Python passes the instance itself as the first argument (self) to every instance method.'
    },
    interview: {
      company: 'Netflix',
      question: 'What is the difference between @staticmethod and @classmethod in Python?',
      answer: '@classmethod receives the class itself (cls) as its first parameter and is commonly used for alternative factory constructors. @staticmethod receives neither self nor cls and acts like a plain utility function namespaced inside the class.'
    }
  },

  // ==================== SQL BASICS ====================
  {
    id: 'sql-select',
    title: 'SQL HOME, Intro & SELECT Statement',
    readTime: '6 mins',
    summary: 'SQL (Structured Query Language) is the standard language for storing, querying, and manipulating data in relational databases (like PostgreSQL, MySQL, SQLite, and Oracle).',
    analogy: 'A relational database is a library of organized spreadsheets (Tables), and a SELECT query is asking the librarian: "Show me the Name and Salary columns from the Employees table."',
    takeaways: [
      'SELECT column1, column2 FROM table_name; retrieves specific columns.',
      'SELECT * FROM table_name; retrieves all columns from the table.',
      'SELECT DISTINCT department FROM employees; removes duplicate rows from the result.'
    ],
    syntaxRows: [
      { syntax: 'SELECT name, role FROM employees;', description: 'Selects specific columns from a table', example: 'SELECT id, title FROM courses;' },
      { syntax: 'SELECT * FROM employees;', description: 'Selects all columns', example: 'SELECT * FROM students;' },
      { syntax: 'SELECT DISTINCT dept FROM emp;', description: 'Returns only unique (non-duplicate) values', example: 'SELECT DISTINCT city FROM users;' },
    ],
    exampleLang: 'sql',
    exampleTitle: 'Querying the Live Employees Table',
    exampleCode: `SELECT name, role, department, salary
FROM employees;`,
    extraNotes: 'Our live SQL Sandbox includes 4 pre-loaded relational tables you can query right now: `employees`, `departments`, `students`, and `orders`!',
    fillBlank: {
      prompt: 'Write the SQL keyword to retrieve all columns from the students table:',
      codeBefore: '',
      answer: 'SELECT',
      codeAfter: ' * FROM students;',
      hint: 'A 6-letter SQL command used to read data.'
    },
    quiz: {
      question: 'Which SQL statement is used to return ONLY different (unique) values in a column?',
      options: ['SELECT UNIQUE', 'SELECT DISTINCT', 'SELECT DIFFERENT', 'SELECT ONLY'],
      correct: 1,
      explanation: 'SELECT DISTINCT eliminates duplicate rows from the result set.'
    },
    interview: {
      company: 'Amazon',
      question: 'Why is SELECT * discouraged in production application queries?',
      answer: 'SELECT * fetches unnecessary columns over the network (including large text/blob fields), prevents the database from using Covering Indexes (Index-Only Scans), and can break application code if table columns change.'
    }
  },
  {
    id: 'sql-where',
    title: 'SQL WHERE, AND, OR, IN, BETWEEN & LIKE',
    readTime: '7 mins',
    summary: 'The WHERE clause filters records so your query only returns rows that fulfill a specified condition. Combine multiple conditions using AND, OR, IN (...), BETWEEN, and LIKE pattern matching.',
    analogy: 'SELECT chooses which vertical columns to keep; WHERE chooses which horizontal rows pass the filter.',
    takeaways: [
      'WHERE salary > 150000 filters numeric columns.',
      'WHERE department = \'Engineering\' filters text strings (use single quotes in SQL!).',
      'LIKE \'A%\' matches any string starting with "A"; \'%sql%\' matches any string containing "sql".'
    ],
    syntaxRows: [
      { syntax: 'WHERE salary > 140000', description: 'Filters rows matching condition', example: 'WHERE gpa >= 3.8' },
      { syntax: 'WHERE dept = \'Engineering\' AND salary > 150000', description: 'Both conditions must be true', example: 'WHERE status = \'Paid\'' },
      { syntax: 'WHERE dept IN (\'AI\', \'Platform\')', description: 'Matches any value in a list', example: 'WHERE id IN (1, 2, 5)' },
      { syntax: 'WHERE name LIKE \'A%\'', description: 'Wildcard pattern match (% = any chars)', example: 'WHERE email LIKE \'%@edu.io\'' },
    ],
    exampleLang: 'sql',
    exampleTitle: 'Filtering High-Salary Engineers with WHERE',
    exampleCode: `SELECT name, role, department, salary
FROM employees
WHERE salary >= 145000;`,
    extraNotes: 'In SQL, you cannot check for NULL using `= NULL`. Always use `WHERE manager_id IS NULL` or `IS NOT NULL`!',
    fillBlank: {
      prompt: 'Add the SQL clause used to filter rows where department is Engineering:',
      codeBefore: 'SELECT * FROM employees\n',
      answer: 'WHERE',
      codeAfter: " department = 'Engineering';",
      hint: 'A 5-letter SQL keyword for filtering.'
    },
    quiz: {
      question: 'In SQL LIKE pattern matching, what does the percent sign (%) wildcard represent?',
      options: ['Exactly one character', 'Zero, one, or multiple characters', 'Only digits', 'Spaces only'],
      correct: 1,
      explanation: 'In SQL LIKE patterns, % matches any sequence of zero or more characters, while _ (underscore) matches a single character.'
    },
    interview: {
      company: 'Google',
      question: 'Why does WHERE name LIKE "%smith" prevent a standard B+ Tree index on (name) from being used efficiently?',
      answer: 'Because B+ Tree indexes are sorted left-to-right by prefix. A leading wildcard ("%smith") forces a full scan, whereas a prefix match ("smith%") can binary-search the B+ Tree index directly!'
    }
  },
  {
    id: 'sql-order',
    title: 'SQL ORDER BY, LIMIT & NULL Handling',
    readTime: '6 mins',
    summary: 'The ORDER BY keyword sorts the result-set in ascending (ASC, default) or descending (DESC) order. LIMIT restricts how many rows are returned (essential for top-N leaderboards and pagination).',
    analogy: 'ORDER BY DESC + LIMIT 3 is how every game leaderboard awards Gold, Silver, and Bronze medals to the top 3 highest scores.',
    takeaways: [
      'ORDER BY salary DESC sorts from highest to lowest; ASC sorts from lowest to highest.',
      'LIMIT 5 returns only the first 5 rows of the query result.',
      'COALESCE(bonus, 0) replaces NULL values with a safe fallback value like 0.'
    ],
    syntaxRows: [
      { syntax: 'ORDER BY salary DESC', description: 'Sorts rows highest to lowest', example: 'ORDER BY gpa DESC' },
      { syntax: 'ORDER BY name ASC', description: 'Sorts alphabetically A to Z (default)', example: 'ORDER BY created_at ASC' },
      { syntax: 'LIMIT 3', description: 'Restricts output to top 3 rows', example: 'LIMIT 10 OFFSET 20' },
      { syntax: 'COALESCE(col, 0)', description: 'Returns first non-NULL value', example: 'COALESCE(phone, \'N/A\')' },
    ],
    exampleLang: 'sql',
    exampleTitle: 'Top 3 Highest Paid Employees Leaderboard',
    exampleCode: `SELECT name, role, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;`,
    extraNotes: 'In SQL execution order, `ORDER BY` and `LIMIT` run at the very end—**after** `FROM`, `WHERE`, `GROUP BY`, `HAVING`, and `SELECT`!',
    fillBlank: {
      prompt: 'Add the SQL keyword to sort employees from highest salary to lowest salary:',
      codeBefore: 'SELECT name, salary FROM employees\nORDER BY salary ',
      answer: 'DESC',
      codeAfter: ';',
      hint: '4-letter abbreviation for Descending.'
    },
    quiz: {
      question: 'What is the default sorting order of ORDER BY if you do not specify ASC or DESC?',
      options: ['Descending (DESC)', 'Ascending (ASC)', 'Random order', 'Insertion order'],
      correct: 1,
      explanation: 'ORDER BY sorts in Ascending (ASC) order by default (smallest to largest, A to Z).'
    },
    interview: {
      company: 'Uber',
      question: 'Why is LIMIT 20 OFFSET 1000000 slow on large tables, and what is the faster alternative?',
      answer: 'OFFSET 1,000,000 forces the database to scan and discard 1 million rows before returning 20. The faster alternative is Keyset (Cursor) Pagination: WHERE id < last_seen_id ORDER BY id DESC LIMIT 20, which uses the B+ Tree index in O(log N).'
    }
  },
  {
    id: 'sql-group',
    title: 'SQL COUNT, SUM, AVG, GROUP BY & HAVING',
    readTime: '8 mins',
    summary: 'Aggregate functions (COUNT, SUM, AVG, MIN, MAX) compute a single summary value from a set of rows. GROUP BY groups rows that have the same values into summary rows (like "total salary per department").',
    analogy: 'GROUP BY department puts employees into separate rooms by department, and AVG(salary) calculates the average salary inside each room.',
    takeaways: [
      'WHERE filters individual rows BEFORE grouping; HAVING filters aggregated groups AFTER GROUP BY!',
      'Every non-aggregated column in your SELECT list must appear in your GROUP BY clause.',
      'COUNT(*) counts all rows in the group; COUNT(col) counts only non-NULL values in that column.'
    ],
    syntaxRows: [
      { syntax: 'COUNT(*)', description: 'Counts total number of rows in each group', example: 'SELECT department, COUNT(*) FROM employees GROUP BY department;' },
      { syntax: 'AVG(salary), SUM(salary)', description: 'Calculates average or total sum', example: 'SELECT dept, AVG(salary) FROM employees GROUP BY dept;' },
      { syntax: 'GROUP BY department', description: 'Buckets rows by department', example: 'GROUP BY track' },
      { syntax: 'HAVING COUNT(*) > 1', description: 'Filters groups after aggregation', example: 'HAVING AVG(salary) > 140000' },
    ],
    exampleLang: 'sql',
    exampleTitle: 'Headcount & Average Salary by Department',
    exampleCode: `SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`,
    extraNotes: 'Remember the golden rule for SQL interviews: **`WHERE` cannot use aggregate functions (`WHERE COUNT(*) > 5` is a syntax error)—use `HAVING COUNT(*) > 5`!**',
    fillBlank: {
      prompt: 'Complete the SQL clause to group rows by department:',
      codeBefore: 'SELECT department, COUNT(*) FROM employees\n',
      answer: 'GROUP BY',
      codeAfter: ' department;',
      hint: 'Two words: GROUP followed by BY.'
    },
    quiz: {
      question: 'What is the key difference between WHERE and HAVING in SQL?',
      options: ['They are identical', 'WHERE filters individual rows before GROUP BY; HAVING filters aggregated groups after GROUP BY', 'HAVING is used without GROUP BY only', 'WHERE only works on strings'],
      correct: 1,
      explanation: 'WHERE filters rows prior to aggregation, whereas HAVING filters the resulting groups based on aggregate functions like COUNT() or AVG().'
    },
    interview: {
      company: 'Meta / Amazon',
      question: 'What is the difference between COUNT(*) and COUNT(column_name) in SQL?',
      answer: 'COUNT(*) counts every row in the group including rows with NULLs. COUNT(column_name) ignores NULL values and only counts rows where column_name is NOT NULL.'
    }
  },

  // ==================== DSA ADDITIONAL ====================
  {
    id: 'ds-search',
    title: 'Binary Search & Sorting Algorithms',
    readTime: '8 mins',
    summary: 'Binary Search finds a target in a sorted array in O(log N) time by repeatedly cutting the search interval in half. Sorting algorithms like Merge Sort and Quick Sort arrange elements in O(N log N) time.',
    analogy: 'Binary Search is how you look up a word in a physical dictionary: you open to the middle page, see if your word comes before or after, and immediately discard half the book!',
    takeaways: [
      'Binary Search requires a monotonic (sorted) search space and runs in O(log N) time and O(1) space.',
      'Calculate mid safely as mid = left + Math.floor((right - left) / 2) to prevent 32-bit integer overflow.',
      'Merge Sort is O(N log N) worst-case and Stable; Quick Sort is O(N log N) average and O(1) in-place.'
    ],
    syntaxRows: [
      { syntax: 'while (left <= right)', description: 'Standard Binary Search loop invariant', example: 'mid = (left + right) >> 1' },
      { syntax: 'O(log N)', description: '1,000,000 items takes at most 20 comparisons!', example: 'log2(1,048,576) = 20' },
      { syntax: 'Merge Sort: O(N log N)', description: 'Divide-and-conquer stable sort', example: 'Space: O(N)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Step-by-Step Binary Search Implementation',
    exampleCode: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    console.log(\`Checking mid=\${mid} (val=\${nums[mid]})\`);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

console.log("Found 23 at index:", binarySearch([2, 5, 8, 12, 16, 23, 38, 56], 23));`,
    extraNotes: 'You can also launch the **Visualizers** tab in the top navigation bar to watch Binary Search (`L`, `M`, `R` pointers) and Bubble Sort animate step-by-step!',
    fillBlank: {
      prompt: 'In Binary Search, if nums[mid] is strictly less than target, update left to search the right half:',
      codeBefore: 'if (nums[mid] < target) {\n  left = ',
      answer: 'mid + 1',
      codeAfter: ';\n}',
      hint: 'Move left just past mid: mid + 1.'
    },
    quiz: {
      question: 'At most how many comparisons does Binary Search need to find a number in a sorted array of 1,000,000 elements?',
      options: ['500,000', '1,000', '20 (because 2^20 ≈ 1,048,576)', '100'],
      correct: 2,
      explanation: 'log2(1,000,000) is ~19.93, so Binary Search checks at most 20 elements!'
    },
    interview: {
      company: 'Google',
      question: 'Why do we write mid = left + (right - left) / 2 instead of (left + right) / 2 in C++ and Java?',
      answer: 'If left and right are both large 32-bit integers (near 2^31 - 1), left + right overflows into a negative number! left + (right - left) / 2 is mathematically identical and never overflows.'
    }
  },
  {
    id: 'ds-hash',
    title: 'Hashing, Hash Maps & Frequency Counters',
    readTime: '8 mins',
    summary: 'A Hash Table (Map / dict / Set) maps keys to array buckets using a hash function, turning O(N) linear searches into O(1) instant lookups. It is the #1 most useful data structure in coding interviews.',
    analogy: 'Instead of searching every shelf in a warehouse (O(N)), a Hash Map is a magic catalog that tells you the exact shelf number in 1 step (O(1)).',
    takeaways: [
      'Whenever a nested loop searches for a complement (like target - nums[i]), replace the inner loop with a Hash Map to drop O(N²) to O(N)!',
      'Hash Collisions occur when two different keys hash to the same bucket; resolved via Separate Chaining (linked lists) or Open Addressing.',
      'Use a Frequency Map to check if two strings are Anagrams in O(N) time.'
    ],
    syntaxRows: [
      { syntax: 'const seen = new Map();', description: 'Creates an O(1) Hash Map in JavaScript', example: 'seen.set(key, val); seen.has(key);' },
      { syntax: 'const uniq = new Set(arr);', description: 'Removes duplicates in O(N) time', example: 'uniq.has(target)' },
      { syntax: 'complement = target - x', description: 'Classic Two Sum hash lookup pattern', example: 'if (seen.has(complement))' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'O(N) Anagram Checker Using a Hash Map',
    exampleCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
  for (const ch of t) {
    if (!counts[ch]) return false;
    counts[ch]--;
  }
  return true;
}

console.log("listen & silent:", isAnagram("listen", "silent"));
console.log("rat & car:", isAnagram("rat", "car"));`,
    extraNotes: 'Ready to test your Hash Map skills? Head to the **Practice Arena** tab and solve **Two Sum** with the automated judge!',
    fillBlank: {
      prompt: 'Check if a JavaScript Set named "visited" contains the value "node":',
      codeBefore: 'if (visited.',
      answer: 'has',
      codeAfter: '(node)) {\n  return true;\n}',
      hint: 'A 3-letter method on Map and Set.'
    },
    quiz: {
      question: 'What is the worst-case time complexity of a Hash Table lookup if all N keys collide into the exact same bucket?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N!)'],
      correct: 2,
      explanation: 'If every key hashes to the same bucket, the bucket degrades into a linked list of length N, taking O(N) time (Java 8+ converts buckets with >8 items into balanced Red-Black Trees to guarantee O(log N)).'
    },
    interview: {
      company: 'Amazon',
      question: 'What is the "Load Factor" of a Hash Map and what happens when it exceeds 0.75?',
      answer: 'Load Factor = (number of stored entries) / (number of buckets). When it exceeds ~0.75, the hash table doubles its bucket array size and re-hashes all keys so average lookup remains O(1).'
    }
  },
  {
    id: 'ds-recursion',
    title: 'Recursion, Backtracking & Subsets',
    readTime: '8 mins',
    summary: 'Recursion is when a function calls itself to solve a smaller instance of the same problem until it hits a Base Case. Backtracking explores all possible choices (like a maze or generating subsets) and undoes ("backtracks") choices that hit a dead end.',
    analogy: 'Backtracking is walking through a maze with a ball of yarn: at every fork you pick a path, and if you hit a wall, you rewind your yarn back to the fork and try the next path.',
    takeaways: [
      'Every recursive function MUST have a Base Case that stops recursion, or it will crash with Stack Overflow!',
      'Each recursive call pushes a frame onto the Call Stack (using O(depth) space).',
      'Backtracking template: 1. Choose -> 2. Explore (recurse) -> 3. Un-choose (pop).'
    ],
    syntaxRows: [
      { syntax: 'if (n <= 1) return 1;', description: 'Base case stopping the recursion', example: 'if (idx === nums.length) return;' },
      { syntax: 'path.push(x); dfs(i+1); path.pop();', description: 'Classic Choose -> Explore -> Backtrack pattern', example: 'Generate all 2^N subsets' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Generate All Subsets (Power Set) via Backtracking',
    exampleCode: `function subsets(nums) {
  const result = [];
  function backtrack(index, current) {
    if (index === nums.length) {
      result.push([...current]);
      return;
    }
    // Choice 1: Exclude nums[index]
    backtrack(index + 1, current);
    // Choice 2: Include nums[index]
    current.push(nums[index]);
    backtrack(index + 1, current);
    current.pop(); // Backtrack!
  }
  backtrack(0, []);
  return result;
}

console.log("All 2^3 = 8 Subsets of [1,2,3]:", JSON.stringify(subsets([1, 2, 3])));`,
    extraNotes: 'For an array of length $N$, there are exactly $2^N$ subsets (since each element has 2 choices: include or exclude) and $N!$ permutations.',
    fillBlank: {
      prompt: 'In the backtracking template, after pushing an item and recursing, what Array method undoes the choice?',
      codeBefore: 'current.push(nums[i]);\nbacktrack(i + 1);\ncurrent.',
      answer: 'pop',
      codeAfter: '();',
      hint: 'Removes the last element from an array (3 letters).'
    },
    quiz: {
      question: 'What happens if a recursive function is missing its Base Case?',
      options: ['It returns 0', 'It runs until the Call Stack runs out of memory and throws a Stack Overflow / RangeError', 'It converts into a while loop automatically', 'It skips execution'],
      correct: 1,
      explanation: 'Without a base case, recursive frames pile up on the Call Stack infinitely until stack memory is exhausted.'
    },
    interview: {
      company: 'Microsoft',
      question: 'What is the time and space complexity of generating all subsets of an array of size N?',
      answer: 'Time complexity is O(N * 2^N) because there are 2^N subsets and copying each subset takes up to O(N). Recursion stack space is O(N).'
    }
  },

  // ==================== C++ & JAVA ====================
  {
    id: 'cpp-basics',
    title: 'C++ & Java HOME, Syntax & Data Types',
    readTime: '7 mins',
    summary: 'C++ and Java are statically-typed, compiled object-oriented languages widely used in competitive programming, low-latency trading systems, Android apps, and enterprise backends.',
    analogy: 'If Python is an automatic family sedan, C++ is a manual Formula-1 car with direct hardware control, and Java is a bulletproof armored transport that runs on any OS via the JVM.',
    takeaways: [
      'Every C++ and Java program starts execution from the main() function.',
      'Every statement ends with a semicolon ; and blocks are enclosed in curly braces { }.',
      'Primitive types have fixed bit sizes: int (32-bit), long long / long (64-bit), double (64-bit float), char, bool.'
    ],
    syntaxRows: [
      { syntax: 'int x = 42;', description: '32-bit signed integer (~ -2*10^9 to 2*10^9)', example: 'long long big = 1e18;' },
      { syntax: 'cout << x << endl;', description: 'C++ standard output stream', example: 'cin >> x;' },
      { syntax: 'System.out.println(x);', description: 'Java standard console output', example: 'Scanner sc = new Scanner(System.in);' },
    ],
    exampleLang: 'cpp',
    exampleTitle: 'C++ Hello World & Fast I/O Template',
    exampleCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello C++ & Java Engineers! Ready for DSA & Systems!" << endl;
    return 0;
}`,
    extraNotes: 'In competitive programming and DSA interviews, remember that a 32-bit `int` overflows around $2 \\times 10^9$. Use `long long` in C++ or `long` in Java when summing large arrays!',
    fillBlank: {
      prompt: 'Complete the C++ output stream object used to print to the console:',
      codeBefore: '#include <iostream>\nusing namespace std;\nint main() {\n  ',
      answer: 'cout',
      codeAfter: ' << "Hello World!";\n  return 0;\n}',
      hint: 'Character output stream (4 letters starting with c).'
    },
    quiz: {
      question: 'What is the maximum value of a standard 32-bit signed "int" in C++ and Java?',
      options: ['32,767', 'Approximately 2.14 billion (2^31 - 1)', '10^18', 'Unlimited'],
      correct: 1,
      explanation: 'A 32-bit signed int uses 1 sign bit and 31 value bits, giving a maximum of 2^31 - 1 = 2,147,483,647.'
    },
    interview: {
      company: 'Goldman Sachs',
      question: 'Why do they say Java is "Write Once, Run Anywhere" whereas C++ must be recompiled for each OS?',
      answer: 'C++ compiles directly into OS/CPU-specific native machine code (x86/ARM). Java compiles into platform-independent Bytecode (.class), which any OS\'s Java Virtual Machine (JVM) can interpret and JIT-compile.'
    }
  },
  {
    id: 'cpp-pointers',
    title: 'Pointers, References & Memory (Stack vs Heap)',
    readTime: '8 mins',
    summary: 'A Pointer (int* ptr = &x) stores the exact hexadecimal memory address of a variable. Understanding Stack memory (fast, automatic local variables) vs Heap memory (dynamic allocation) is core to systems engineering.',
    analogy: 'A regular variable is a house; a Pointer is a piece of paper with that house\'s GPS coordinates written on it.',
    takeaways: [
      '&x ("address-of" operator) returns the memory address where x lives.',
      '*ptr ("dereference" operator) follows the address to read or modify the value stored there.',
      'Pass large vectors/strings by const reference (const vector<int>& nums) in C++ to avoid expensive O(N) copying!'
    ],
    syntaxRows: [
      { syntax: 'int* ptr = &x;', description: 'Stores the memory address of x in pointer ptr', example: '*ptr = 99; // modifies x!' },
      { syntax: 'int& ref = x;', description: 'Creates an alias reference to x (cannot be null)', example: 'void swap(int& a, int& b)' },
      { syntax: 'const vector<int>& v', description: 'Pass-by-const-reference (zero copy overhead)', example: 'int sum(const vector<int>& v)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating Value vs Reference Semantics',
    exampleCode: `let primitiveA = 10;
let primitiveB = primitiveA; // Copies value
primitiveB = 99;

const heapObjA = { balance: 100 };
const heapObjB = heapObjA; // Copies memory reference (pointer)!
heapObjB.balance = 500;

console.log("Primitive A (unchanged):", primitiveA);
console.log("Heap Object A (modified via ref B):", heapObjA.balance);`,
    extraNotes: 'In modern C++ (C++11/17/20), avoid raw `new` and `delete`. Use RAII Smart Pointers like `std::unique_ptr` and `std::shared_ptr` so heap memory is freed automatically!',
    fillBlank: {
      prompt: 'Which C++ operator returns the memory address of a variable x?',
      codeBefore: 'int x = 10;\nint* ptr = ',
      answer: '&',
      codeAfter: 'x;',
      hint: 'The ampersand symbol (address-of).'
    },
    quiz: {
      question: 'Why should you pass a large std::vector to a C++ function as "const vector<int>& arr" instead of "vector<int> arr"?',
      options: ['Because vectors cannot be passed by value', 'Passing by value copies all N elements in O(N) time and memory, whereas passing by const reference passes an 8-byte memory address in O(1) time', 'It sorts the vector', 'It allocates on the disk'],
      correct: 1,
      explanation: 'Pass-by-value duplicates the entire vector on every call; pass-by-const-reference avoids copying while preventing accidental mutation.'
    },
    interview: {
      company: 'Morgan Stanley',
      question: 'What is a Dangling Pointer vs a Memory Leak?',
      answer: 'A Memory Leak occurs when heap memory is allocated but never freed after all pointers to it are lost. A Dangling Pointer points to a memory address that has ALREADY been freed/deleted.'
    }
  },
  {
    id: 'cpp-classes',
    title: 'Classes, Objects, Constructors & Encapsulation',
    readTime: '7 mins',
    summary: 'A Class is a user-defined blueprint combining data fields (attributes) and methods (functions). Encapsulation hides sensitive internal state as private and exposes safe public methods.',
    analogy: 'Encapsulation is like an ATM machine: the cash vault is private inside, and users can only interact through the public withdraw() and deposit() buttons that validate their PIN.',
    takeaways: [
      'A Constructor has the exact same name as the Class and has no return type.',
      'Keep member variables private and validate changes inside public setter/business methods.',
      'The "this" keyword refers to the current object instance.'
    ],
    syntaxRows: [
      { syntax: 'class BankAccount { ... }', description: 'Defines a class blueprint', example: 'BankAccount acc(1000);' },
      { syntax: 'private: double balance;', description: 'Hides internal state from outside tampering', example: 'public: void deposit(double a)' },
      { syntax: 'BankAccount(double init)', description: 'Constructor called when object is created', example: 'this->balance = init;' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Encapsulation & Constructor Validation',
    exampleCode: `class BankAccount {
  constructor(owner, initialBalance) {
    this.owner = owner;
    this._balance = Math.max(0, initialBalance);
  }
  deposit(amount) {
    if (amount <= 0) return "Invalid deposit amount";
    this._balance += amount;
    return \`Deposited ₹\${amount}. New Balance: ₹\${this._balance}\`;
  }
}

const acc = new BankAccount("Aarav", 1000);
console.log(acc.deposit(500));`,
    extraNotes: 'In C++, `struct` and `class` are identical except for default visibility: `struct` members are `public` by default, while `class` members are `private` by default.',
    fillBlank: {
      prompt: 'Which OOP pillar bundles data with methods and hides internal state using private fields?',
      codeBefore: '// Pillar of OOP: ',
      answer: 'Encapsulation',
      codeAfter: '',
      hint: 'Starts with Encap... (like putting data inside a capsule).'
    },
    quiz: {
      question: 'What is the main difference between a struct and a class in C++?',
      options: ['Structs cannot have methods', 'Struct members are public by default, whereas class members are private by default', 'Structs live on the heap only', 'Classes cannot use inheritance'],
      correct: 1,
      explanation: 'In C++, structs and classes have identical capabilities; only their default access specifier (public vs private) differs.'
    },
    interview: {
      company: 'Oracle / Amazon',
      question: 'What is Constructor Overloading?',
      answer: 'Having multiple constructors in the same class with different parameter lists (e.g., a default 0-arg constructor and a parameterized constructor) so objects can be initialized in different ways.'
    }
  },
  {
    id: 'cpp-inherit',
    title: 'Inheritance, Interfaces & Abstract Classes',
    readTime: '7 mins',
    summary: 'Inheritance lets a child class reuse and extend fields/methods from a parent class (IS-A relationship). Interfaces define a 100% abstract contract of methods a class promises to implement.',
    analogy: 'An Abstract Class is a half-built car chassis with a real engine already installed; an Interface is a driver\'s license test checklist (must have steer(), brake(), accelerate()).',
    takeaways: [
      'Java supports single class inheritance (extends) but allows implementing multiple interfaces (implements A, B).',
      'An Abstract Class cannot be instantiated directly with new; it serves as a base class.',
      'Prefer Composition (HAS-A) over deep Inheritance chains when sharing behavior across unrelated classes.'
    ],
    syntaxRows: [
      { syntax: 'class Dog extends Animal', description: 'Java class inheritance (IS-A)', example: 'class Savings extends Account' },
      { syntax: 'class App implements Runnable', description: 'Implements an interface contract', example: 'implements Comparable<User>' },
      { syntax: 'abstract void draw();', description: 'Abstract method with no body (must be overridden)', example: 'virtual void draw() = 0; // C++' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Base Class Inheritance & super() Calls',
    exampleCode: `class Vehicle {
  constructor(brand) { this.brand = brand; }
  info() { return \`Vehicle Brand: \${this.brand}\`; }
}

class ElectricCar extends Vehicle {
  constructor(brand, rangeKm) {
    super(brand);
    this.rangeKm = rangeKm;
  }
  info() { return \`\${super.info()} | EV Range: \${this.rangeKm} km\`; }
}

const ev = new ElectricCar("Tesla", 520);
console.log(ev.info());`,
    extraNotes: 'Why doesn\'t Java allow `class C extends A, B` (multiple class inheritance)? To avoid the **Diamond Problem** where `A` and `B` have conflicting implementations of the same method!',
    fillBlank: {
      prompt: 'In Java and JavaScript, which keyword is used for a child class to inherit from a parent class?',
      codeBefore: 'class Manager ',
      answer: 'extends',
      codeAfter: ' Employee {\n}',
      hint: 'A 7-letter keyword starting with ext...'
    },
    quiz: {
      question: 'Can you create an instance of an Abstract Class directly using "new AbstractShape()"?',
      options: ['Yes, always', 'No, abstract classes cannot be instantiated directly; you must instantiate a concrete subclass that implements its abstract methods', 'Only if it has no variables', 'Only in Java'],
      correct: 1,
      explanation: 'Abstract classes are incomplete blueprints and cannot be instantiated directly.'
    },
    interview: {
      company: 'Microsoft',
      question: 'When should you use an Abstract Class vs an Interface in Java?',
      answer: 'Use an Interface to define a capability contract (like Comparable or Serializable) that unrelated classes can implement. Use an Abstract Class when closely related subclasses need to share common non-static fields and protected state.'
    }
  },
  {
    id: 'cpp-stl',
    title: 'C++ STL Containers (vector, map, set, priority_queue)',
    readTime: '8 mins',
    summary: 'The C++ Standard Template Library (STL) provides battle-tested, generic data structures and algorithms so you never have to code a dynamic array, Red-Black tree, or heap from scratch in interviews.',
    analogy: 'The C++ STL is a professional swiss-army toolkit: vector is your resizable array, unordered_map is your O(1) hash table, and priority_queue is your O(log N) heap.',
    takeaways: [
      'unordered_map and unordered_set use Hash Tables -> O(1) average lookup.',
      'map and set use balanced Red-Black BSTs -> O(log N) lookup with keys kept in sorted order!',
      'priority_queue<int> is a Max-Heap by default; use priority_queue<int, vector<int>, greater<int>> for a Min-Heap.'
    ],
    syntaxRows: [
      { syntax: 'vector<int> v = {1, 2, 3};', description: 'Dynamic array (push_back is O(1) amortized)', example: 'v.push_back(4);' },
      { syntax: 'unordered_map<string, int> mp;', description: 'O(1) Hash Map', example: 'mp["Alex"] = 100;' },
      { syntax: 'set<int> s;', description: 'Sorted Red-Black Tree Set (O(log N))', example: 's.insert(10);' },
      { syntax: 'sort(v.begin(), v.end());', description: 'IntroSort (QuickSort + HeapSort) in O(N log N)', example: 'reverse(v.begin(), v.end());' },
    ],
    exampleLang: 'cpp',
    exampleTitle: 'C++ STL Reference & Complexity Overview',
    exampleCode: `#include <iostream>
using namespace std;

int main() {
    cout << "C++ STL: vector O(1) push_back | unordered_map O(1) hash | map/set O(log N) Red-Black Tree!" << endl;
    return 0;
}`,
    extraNotes: 'In C++, `std::sort()` uses **IntroSort**—a hybrid of QuickSort, HeapSort, and Insertion Sort that guarantees worst-case $O(N \\log N)$ time!',
    fillBlank: {
      prompt: 'Which C++ STL container provides O(1) average-time hash table key-value lookups?',
      codeBefore: '',
      answer: 'unordered_map',
      codeAfter: '<string, int> counts;',
      hint: 'Starts with unordered_ followed by map.'
    },
    quiz: {
      question: 'What is the underlying data structure and lookup time complexity of std::map (vs std::unordered_map) in C++?',
      options: ['Both use Hash Tables in O(1)', 'std::map uses a balanced Red-Black Tree in O(log N) and keeps keys sorted; std::unordered_map uses a Hash Table in O(1) average', 'std::map uses an array in O(N)', 'std::map is a stack'],
      correct: 1,
      explanation: 'std::map is an ordered Red-Black Tree (O(log N)), whereas std::unordered_map is a hash table (O(1) avg).'
    },
    interview: {
      company: 'Tower Research / Rubrik',
      question: 'Why might std::vector.push_back() invalidate existing pointers or iterators to elements inside the vector?',
      answer: 'When the vector\'s size reaches its capacity, it allocates a brand-new larger contiguous block of heap memory, moves all elements over, and frees the old memory block—leaving old pointers dangling!'
    }
  },
  {
    id: 'java-coll',
    title: 'Java Collections Framework & Streams API',
    readTime: '8 mins',
    summary: 'Java\'s Collections Framework provides unified interfaces (List, Set, Map, Queue) backed by high-performance implementations like ArrayList, LinkedList, HashMap, TreeMap, and ArrayDeque.',
    analogy: 'List, Set, and Map are the socket wall outlets (interfaces), while ArrayList, HashSet, and HashMap are the specific appliances you plug into them.',
    takeaways: [
      'Program to the interface: List<String> names = new ArrayList<>(); Map<String, Integer> map = new HashMap<>();.',
      'Prefer ArrayDeque over legacy Stack for both LIFO stacks and FIFO queues in Java.',
      'Always override both equals() AND hashCode() together when using custom objects as HashMap keys!'
    ],
    syntaxRows: [
      { syntax: 'List<Integer> list = new ArrayList<>();', description: 'Dynamic resizable array list', example: 'list.add(10); list.get(0);' },
      { syntax: 'Map<String, Integer> map = new HashMap<>();', description: 'O(1) Key-Value Hash Table', example: 'map.getOrDefault(k, 0);' },
      { syntax: 'Queue<Integer> pq = new PriorityQueue<>();', description: 'Min-Heap by default in Java!', example: 'pq.offer(5); pq.poll();' },
      { syntax: 'Deque<Integer> st = new ArrayDeque<>();', description: 'Fast double-ended queue / stack', example: 'st.push(1); st.pop();' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating Java Streams filter -> map -> reduce Pipeline',
    exampleCode: `const salaries = [90000, 145000, 160000, 110000, 180000];

// Equivalent to salaries.stream().filter(s -> s >= 140000).map(s -> s * 1.1).toList()
const seniorWithBonus = salaries
  .filter(s => s >= 140000)
  .map(s => Math.round(s * 1.1));

console.log("Senior Salaries (+10% Bonus):", seniorWithBonus);`,
    extraNotes: 'Notice a key interview difference: in C++, `priority_queue` is a **Max-Heap** by default, whereas in Java, `PriorityQueue` is a **Min-Heap** by default!',
    fillBlank: {
      prompt: 'Use the Java Map method that returns a key\'s value or a fallback default if the key is missing:',
      codeBefore: 'int count = map.',
      answer: 'getOrDefault',
      codeAfter: '(word, 0);',
      hint: 'Starts with getOr...'
    },
    quiz: {
      question: 'In Java, if you override equals() on a custom class used as a key in a HashMap, what other method MUST you also override?',
      options: ['toString()', 'hashCode()', 'clone()', 'finalize()'],
      correct: 1,
      explanation: 'HashMap first uses hashCode() to find the bucket and then equals() to compare keys inside that bucket. If two equal objects have different hashCodes, HashMap will look in the wrong bucket!'
    },
    interview: {
      company: 'Amazon / Goldman Sachs',
      question: 'How does Java 8+ HashMap handle high hash collisions inside a single bucket?',
      answer: 'Once a single bucket\'s linked list grows to 8 elements (TREEIFY_THRESHOLD) and the table capacity is at least 64, Java automatically converts that bucket\'s linked list into a balanced Red-Black Tree, improving worst-case lookup from O(N) to O(log N)!'
    }
  },
  {
    id: 'java-jvm',
    title: 'JVM Architecture, Garbage Collection & Smart Pointers',
    readTime: '8 mins',
    summary: 'The Java Virtual Machine (JVM) divides Heap memory into Young Generation (Eden + Survivor spaces) and Old (Tenured) Generation to collect short-lived objects rapidly, while C++ uses RAII Smart Pointers for deterministic zero-pause cleanup.',
    analogy: 'JVM Generational GC is like emptying the kitchen desk trash bin (Eden Space) every day, while only cleaning out the attic storage (Old Generation) once a year.',
    takeaways: [
      'Most objects die young (Weak Generational Hypothesis)—Minor GC in the Young Generation is super fast.',
      'Objects that survive multiple Minor GCs are promoted to the Old Generation.',
      'C++ std::unique_ptr enforces single ownership and deletes the object immediately when it goes out of scope (zero GC pause!).'
    ],
    syntaxRows: [
      { syntax: 'Young Gen (Eden + S0 + S1)', description: 'Where all new Java objects are first allocated', example: 'Collected by Minor GC' },
      { syntax: 'Old (Tenured) Gen', description: 'Holds long-lived objects surviving Minor GCs', example: 'Collected by Major / G1 GC' },
      { syntax: 'unique_ptr<Node> p', description: 'C++ exclusive-ownership smart pointer', example: 'make_unique<Node>(42)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Reference Reachability & Garbage Collection Simulation',
    exampleCode: `function simulateGC(heapNodes, rootIds) {
  const reachable = new Set(rootIds);
  const swept = heapNodes.filter(n => !reachable.has(n.id));
  return {
    keptAlive: heapNodes.filter(n => reachable.has(n.id)).map(n => n.name),
    garbageCollected: swept.map(n => n.name)
  };
}

const heap = [
  { id: 1, name: "ActiveUserSession" },
  { id: 2, name: "OrphanedTempBuffer" },
  { id: 3, name: "GlobalConfigCache" }
];
console.log(JSON.stringify(simulateGC(heap, [1, 3]), null, 2));`,
    extraNotes: 'Even in garbage-collected languages like Java, JS, and Python, you can still cause **Memory Leaks** by accidentally keeping unneeded objects inside global arrays, static caches, or uncleaned event listeners!',
    fillBlank: {
      prompt: 'In the JVM Heap, what is the name of the space inside the Young Generation where newly created objects are first allocated?',
      codeBefore: '// JVM Young Generation: ',
      answer: 'Eden',
      codeAfter: ' Space + Survivor S0/S1',
      hint: 'Named after the biblical garden (4 letters).'
    },
    quiz: {
      question: 'How does the JVM Garbage Collector determine whether an object on the Heap is eligible for collection?',
      options: ['By checking if the object is older than 5 minutes', 'By tracing Reachability starting from GC Roots (stack variables, active threads, static fields); unreachable objects are collected', 'Alphabetically', 'Only when RAM hits 100%'],
      correct: 1,
      explanation: 'Modern GCs use Mark-and-Sweep / Copying reachability analysis from GC Roots, which correctly collects even cyclic references!'
    },
    interview: {
      company: 'LinkedIn / Netflix',
      question: 'What is a "Stop-The-World" (STW) pause in Garbage Collection?',
      answer: 'A brief phase during Garbage Collection where all application threads are paused so the collector can safely trace or compact object references without threads mutating pointers mid-flight.'
    }
  },

  // ==================== OS & LINUX ====================
  {
    id: 'os-intro',
    title: 'OS HOME, Kernel Mode vs User Mode & Syscalls',
    readTime: '7 mins',
    summary: 'An Operating System (Linux, Windows, macOS) manages CPU hardware, RAM, disks, and network sockets. To protect the system, the CPU runs user apps in restricted User Mode and OS core code in privileged Kernel Mode.',
    analogy: 'User Mode is a customer standing at a bank counter; Kernel Mode is the bank teller behind bulletproof glass. You cannot walk into the vault yourself—you make a System Call request to the teller!',
    takeaways: [
      'Applications cannot access hardware or disk directly from User Mode.',
      'A System Call (syscall like open(), read(), write(), fork()) traps into Kernel Mode safely.',
      'fork() duplicates the current process; exec() replaces the process memory with a new program.'
    ],
    syntaxRows: [
      { syntax: 'User Mode (Ring 3)', description: 'Restricted CPU mode where user apps run', example: 'Browser, Python, Node.js' },
      { syntax: 'Kernel Mode (Ring 0)', description: 'Privileged mode with full hardware access', example: 'Linux Kernel, Device Drivers' },
      { syntax: 'fork() & exec()', description: 'Creates child process & loads new binary', example: 'How shells run commands!' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Simulating User Mode to Kernel Mode System Calls',
    exampleCode: `def syscall_read(file_name, user_role):
    print("1. [User Mode] App invokes read() for:", file_name)
    print("2. [CPU Trap] Switching privilege bit: User Mode -> Kernel Mode")
    if file_name == "/etc/shadow" and user_role != "root":
        return "3. [Kernel Mode] EACCES: Permission Denied!"
    return "3. [Kernel Mode] Success: Returned 4096 bytes from disk buffer."

print(syscall_read("notes.txt", "student"))
print(syscall_read("/etc/shadow", "student"))`,
    extraNotes: 'Why do we buffer file writes in memory instead of calling `write()` for 1 byte at a time? Because every System Call requires a CPU mode switch between User Mode and Kernel Mode!',
    fillBlank: {
      prompt: 'Which UNIX system call creates a new child process by duplicating the calling process?',
      codeBefore: 'pid_t pid = ',
      answer: 'fork',
      codeAfter: '();',
      hint: 'A 4-letter word (like a fork in the road).'
    },
    quiz: {
      question: 'Why do modern CPUs separate execution into User Mode and Kernel Mode?',
      options: ['To make the screen brighter', 'To prevent buggy or malicious user applications from crashing the OS or directly reading another process\'s hardware memory', 'To save battery only', 'Because C++ requires it'],
      correct: 1,
      explanation: 'Hardware privilege rings isolate user processes so they must go through validated OS system calls to access hardware or memory.'
    },
    interview: {
      company: 'Google / Systems',
      question: 'What return value does fork() give to the newly created child process versus the parent process?',
      answer: 'In the child process, fork() returns 0. In the parent process, fork() returns the positive Process ID (PID) of the new child.'
    }
  },
  {
    id: 'linux-git',
    title: 'Linux Terminal Commands & Git Essentials',
    readTime: '8 mins',
    summary: 'Every software engineer uses the Linux command line (Bash/Zsh) to navigate servers, inspect logs with grep, manage permissions with chmod, and collaborate on code using Git version control.',
    analogy: 'Linux pipes (cmd1 | cmd2) snap small tools together like LEGOs; Git is a time machine that saves snapshots (commits) and parallel universes (branches) of your codebase.',
    takeaways: [
      'Pipe operator | sends the stdout of one command into the stdin of the next: cat app.log | grep "ERROR" | wc -l.',
      'chmod 755 script.sh sets Read(4)+Write(2)+Execute(1) for Owner (7) and Read+Execute for Group/Others (5).',
      'git checkout -b feat-login creates and switches to an isolated feature branch.'
    ],
    syntaxRows: [
      { syntax: 'grep -rn "ERROR" logs/', description: 'Searches recursively for text with line numbers', example: 'grep -i "timeout" app.log' },
      { syntax: 'chmod 755 deploy.sh', description: 'Grants rwxr-xr-x permissions (4=R, 2=W, 1=X)', example: 'chmod +x run.sh' },
      { syntax: 'ps aux | grep node', description: 'Lists running processes matching node', example: 'kill -9 <PID>' },
      { syntax: 'git commit -m "feat: add auth"', description: 'Saves staged changes to local Git history', example: 'git push origin main' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Linux Permission Octal Calculator (rwx -> 755)',
    exampleCode: `def decode_chmod(octal_str):
    mapping = {"7": "rwx", "6": "rw-", "5": "r-x", "4": "r--", "0": "---"}
    roles = ["Owner", "Group", "Others"]
    result = []
    for i in range(3):
        digit = octal_str[i]
        result.append(roles[i] + ": " + mapping[digit])
    return " | ".join(result)

print("chmod 755 ->", decode_chmod("755"))
print("chmod 640 ->", decode_chmod("640"))`,
    extraNotes: 'In Git, `git merge` preserves the exact branch history with a merge commit, whereas `git rebase` replays your commits cleanly on top of the target branch for a linear history.',
    fillBlank: {
      prompt: 'Which Linux command searches for matching text patterns inside files?',
      codeBefore: '',
      answer: 'grep',
      codeAfter: ' "ERROR" server.log',
      hint: 'A famous 4-letter UNIX search command starting with g.'
    },
    quiz: {
      question: 'In Linux file permissions, what does the number 7 in "chmod 755" represent?',
      options: ['7 users can access the file', 'Read (4) + Write (2) + Execute (1) = 7 (rwx)', '7 days until deletion', 'Only root access'],
      correct: 1,
      explanation: 'Octal permissions sum Read (4) + Write (2) + Execute (1) = 7.'
    },
    interview: {
      company: 'Netflix / AWS',
      question: 'What is the difference between SIGTERM (kill <PID>) and SIGKILL (kill -9 <PID>) in Linux?',
      answer: 'SIGTERM (signal 15) politely asks the process to shut down, allowing it to close database connections and flush files cleanly. SIGKILL (signal 9) cannot be caught or ignored—the OS kernel terminates the process immediately.'
    }
  },

  // ==================== CS CORE & AI ====================
  {
    id: 'cs-float',
    title: 'IEEE 754 Floating Point (Why 0.1 + 0.2 !== 0.3)',
    readTime: '7 mins',
    summary: 'Computers store decimal numbers in binary scientific notation (IEEE 754: 1 Sign bit + Exponent + Mantissa fraction). Because 1/10 (0.1) is a repeating fraction in base-2 (just like 1/3 = 0.3333... in base-10), 0.1 + 0.2 equals 0.30000000000000004!',
    analogy: 'Trying to write 1/3 in base-10 decimals with 4 digits gives 0.3333; adding three of them gives 0.9999 instead of 1.0000. In binary, 0.1 has the exact same repeating-fraction rounding!',
    takeaways: [
      'Never compare floats with === (0.1 + 0.2 === 0.3 is false in JS, Python, C++, and Java!).',
      'Compare floats using an epsilon tolerance: Math.abs(a - b) < 1e-9.',
      'For financial money calculations, ALWAYS store integer cents/paise ($19.99 -> 1999 cents) or use Decimal types!'
    ],
    syntaxRows: [
      { syntax: '0.1 + 0.2', description: 'Evaluates to 0.30000000000000004 in IEEE 754', example: 'Use integer cents for money!' },
      { syntax: 'Math.abs(a - b) < 1e-9', description: 'Safe floating-point equality check', example: 'math.isclose(0.1+0.2, 0.3)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Seeing IEEE 754 Floating Point Precision Live',
    exampleCode: `const sum = 0.1 + 0.2;
console.log("0.1 + 0.2 =", sum);
console.log("Is 0.1 + 0.2 === 0.3?", sum === 0.3);
console.log("Safe Epsilon Check:", Math.abs(sum - 0.3) < 1e-9);

// Financial best practice: store integer cents!
const priceCents = 10 + 20;
console.log("Integer Cents ($0.30):", (priceCents / 100).toFixed(2));`,
    extraNotes: 'In Python, you can also use `from decimal import Decimal` (`Decimal("0.1") + Decimal("0.2") == Decimal("0.3")`) or `math.isclose(a, b)`.',
    fillBlank: {
      prompt: 'When building a payment system, instead of storing $19.99 as a float, store 1999 as what data type?',
      codeBefore: '// Store money in smallest currency unit (cents/paise) as an ',
      answer: 'integer',
      codeAfter: '',
      hint: 'A whole number type (7 letters starting with int).'
    },
    quiz: {
      question: 'Why does 0.1 + 0.2 evaluate to 0.30000000000000004 in almost all programming languages?',
      options: ['A bug in JavaScript only', 'Because 0.1 and 0.2 cannot be represented as finite fractions in base-2 (binary) IEEE 754 floating-point format', 'Because the CPU is overheating', 'Because + concatenates strings'],
      correct: 1,
      explanation: 'In base 2, 1/10 is an infinitely repeating binary fraction (0.0001100110011...), causing a tiny rounding residual when stored in 64 bits.'
    },
    interview: {
      company: 'Stripe / Razorpay',
      question: 'How should you design a database column and API payload for storing monetary transaction amounts?',
      answer: 'Store amounts as 64-bit integers (BIGINT) representing the smallest currency unit (e.g., 1999 for $19.99 USD or ₹19.99 INR) alongside an ISO currency code ("USD", "INR"), or use fixed-point DECIMAL(19, 4).'
    }
  },
  {
    id: 'ai-home',
    title: 'AI & ML HOME: Supervised vs Unsupervised Learning',
    readTime: '7 mins',
    summary: 'Machine Learning enables computers to learn patterns from data instead of hardcoded rules. It divides into Supervised Learning (labeled training data), Unsupervised Learning (finding hidden clusters), and Reinforcement Learning (reward-based trial and error).',
    analogy: 'Supervised Learning is studying with flashcards that have the answer on the back; Unsupervised Learning is sorting a pile of LEGOs by color and shape without instructions.',
    takeaways: [
      'Supervised Learning predicts either a continuous number (Regression, e.g., house price) or a category label (Classification, e.g., spam vs not-spam).',
      'Unsupervised Learning groups unlabeled data (Clustering like K-Means) or compresses dimensions (PCA).',
      'Always split data into Training, Validation, and Test sets so your model generalizes instead of memorizing (Overfitting)!'
    ],
    syntaxRows: [
      { syntax: 'Regression', description: 'Predicts a continuous numeric value', example: 'Predicting temperature or house price' },
      { syntax: 'Classification', description: 'Predicts a discrete class category', example: 'Fraud detection (0 or 1)' },
      { syntax: 'Overfitting', description: 'High training accuracy, poor test accuracy', example: 'Fixed via Regularization & Dropout' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Evaluating Classifier Accuracy & Precision',
    exampleCode: `predictions = [1, 0, 1, 1, 0, 1]
ground_truth = [1, 0, 1, 0, 0, 1]

correct = 0
for i in range(len(predictions)):
    if predictions[i] == ground_truth[i]:
        correct = correct + 1

accuracy = (correct / len(predictions)) * 100
print("Correct predictions:", correct, "out of", len(predictions))
print("Model Accuracy (%):", round(accuracy, 2))`,
    extraNotes: 'When classes are imbalanced (e.g., 99% normal transactions, 1% fraud), **Accuracy** is misleading—always measure **Precision, Recall, and F1-Score**!',
    fillBlank: {
      prompt: 'When a model memorizes the training data noise and performs poorly on unseen test data, what is this called?',
      codeBefore: '// Model failure mode: ',
      answer: 'Overfitting',
      codeAfter: '',
      hint: 'Starts with Over and ends with fitting.'
    },
    quiz: {
      question: 'Predicting whether an incoming email is "Spam" or "Not Spam" using 10,000 labeled emails is an example of what?',
      options: ['Unsupervised Clustering', 'Supervised Binary Classification', 'Linear Regression', 'Reinforcement Learning'],
      correct: 1,
      explanation: 'Because the training data has ground-truth labels and the output is one of two discrete categories, it is Supervised Binary Classification.'
    },
    interview: {
      company: 'Google DeepMind',
      question: 'Why is a model with 99% accuracy terrible if only 1% of patients have a rare condition?',
      answer: 'A dummy model that ALWAYS predicts "Healthy" achieves 99% accuracy while missing 100% of sick patients (0% Recall)! Use Precision, Recall, and F1-Score on imbalanced datasets.'
    }
  },
  {
    id: 'ai-grad',
    title: 'Linear Regression, Loss Functions & Gradient Descent',
    readTime: '8 mins',
    summary: 'Linear Regression fits a line y = wx + b to data. A Loss Function (like Mean Squared Error) measures how wrong the predictions are, and Gradient Descent iteratively nudges weights w and b downhill to minimize that loss.',
    analogy: 'Gradient Descent is walking down a foggy mountain at night: you feel which direction slopes steepest downhill under your feet, take a step (learning rate), and repeat until you reach the valley floor.',
    takeaways: [
      'Mean Squared Error (MSE) averages the squared difference between predicted y_hat and actual y.',
      'The Learning Rate (lr) controls step size: too small = slow training; too large = overshoots and diverges!',
      'w = w - learning_rate * gradient updates weights opposite to the slope of the loss.'
    ],
    syntaxRows: [
      { syntax: 'y_pred = w * x + b', description: 'Linear model prediction formula', example: 'w = slope, b = bias intercept' },
      { syntax: 'MSE = mean((y - y_pred)^2)', description: 'Mean Squared Error loss function', example: 'Penalizes large errors heavily' },
      { syntax: 'w = w - lr * grad', description: 'Gradient Descent weight update step', example: 'lr = 0.01' },
    ],
    exampleLang: 'python',
    exampleTitle: 'Live Gradient Descent Step-by-Step Training',
    exampleCode: `w = 0.0
lr = 0.1
x = 2.0
y_true = 10.0  # True relation: w should learn to become 5.0!

for step in range(1, 6):
    y_pred = w * x
    error = y_pred - y_true
    grad = 2 * error * x
    w = w - (lr * grad)
    print("Epoch", step, "-> Pred:", round(y_pred, 2), "| Updated Weight w:", round(w, 3))`,
    extraNotes: 'In practice, **Mini-Batch Stochastic Gradient Descent (SGD)** and **Adam** compute gradients on small batches (e.g. 32 or 64 samples) instead of the entire dataset on every step.',
    fillBlank: {
      prompt: 'In Gradient Descent, what hyperparameter multiplies the gradient to control the size of each update step?',
      codeBefore: 'w = w - (',
      answer: 'lr',
      codeAfter: ' * gradient) # learning rate',
      hint: '2-letter variable shown in the comment for learning rate.'
    },
    quiz: {
      question: 'What happens during Gradient Descent if the Learning Rate is set way too high?',
      options: ['The model converges faster and more accurately', 'The weight updates overshoot the minimum and the loss oscillates or explodes to Infinity (NaN)', 'Nothing happens', 'It deletes the dataset'],
      correct: 1,
      explanation: 'An excessively large learning rate steps right across the valley and causes the loss to diverge.'
    },
    interview: {
      company: 'Meta AI',
      question: 'Why do we square the error (y - y_pred)^2 in Mean Squared Error instead of just taking (y - y_pred)?',
      answer: 'Without squaring, positive errors (+5) and negative errors (-5) would cancel each other out to 0! Squaring ensures all errors are positive, is smoothly differentiable everywhere, and penalizes large outliers.'
    }
  },
  {
    id: 'ai-nn',
    title: 'Neural Networks, ReLU, Softmax & Backpropagation',
    readTime: '8 mins',
    summary: 'Deep Neural Networks stack layers of artificial neurons (y = Activation(Wx + b)). Non-linear activation functions like ReLU allow networks to learn complex curves, Softmax turns final logits into probabilities summing to 1.0, and Backpropagation computes gradients via the calculus Chain Rule.',
    analogy: 'Without a non-linear Activation Function like ReLU, stacking 100 neural layers is just multiplying matrices—which collapses into a single flat straight line!',
    takeaways: [
      'ReLU(x) = max(0, x) is the default hidden-layer activation because it is fast and avoids vanishing gradients for x > 0.',
      'Softmax converts raw output logits into a probability distribution summing to 100%.',
      'Backpropagation passes error gradients backward from the output layer to the first layer using the Chain Rule.'
    ],
    syntaxRows: [
      { syntax: 'ReLU(x) = max(0, x)', description: 'Rectified Linear Unit activation', example: 'ReLU(-5) = 0, ReLU(4) = 4' },
      { syntax: 'Sigmoid(x) = 1 / (1 + e^-x)', description: 'Squashes any number into (0, 1)', example: 'Used in binary classification' },
      { syntax: 'Softmax(z)', description: 'Normalizes vector into probabilities summing to 1', example: '[0.70, 0.20, 0.10]' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'ReLU & Softmax Probability Layer in Code',
    exampleCode: `const relu = x => Math.max(0, x);

function softmax(logits) {
  const exps = logits.map(x => Math.exp(x));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => Number((e / sum).toFixed(3)));
}

console.log("ReLU on [-3, 0, 4.5]:", [-3, 0, 4.5].map(relu));
console.log("Softmax Probabilities for [2.0, 1.0, 0.1]:", softmax([2.0, 1.0, 0.1]));`,
    extraNotes: 'Why did deep learning switch from `Sigmoid` to `ReLU` for hidden layers? Because `Sigmoid` saturates at `0` and `1` where its derivative is nearly `0`, causing the **Vanishing Gradient Problem** in deep networks!',
    fillBlank: {
      prompt: 'Complete the formula for the ReLU activation function: Math.max(0, ___)',
      codeBefore: 'const relu = (x) => Math.max(0, ',
      answer: 'x',
      codeAfter: ');',
      hint: 'The input variable x.'
    },
    quiz: {
      question: 'Why must a multi-layer Neural Network use non-linear activation functions (like ReLU or GELU) between layers?',
      options: ['To use more RAM', 'Because a stack of linear matrix multiplications without non-linearities is mathematically equivalent to a single linear layer and cannot learn non-linear patterns', 'To convert floats to ints', 'To sort the weights'],
      correct: 1,
      explanation: 'W2 * (W1 * x) = (W2 * W1) * x = W_combined * x. Non-linear activations allow neural networks to approximate any complex function.'
    },
    interview: {
      company: 'NVIDIA / OpenAI',
      question: 'What is "Dropout" during neural network training and how does it prevent overfitting?',
      answer: 'Dropout randomly zeroes out a fraction (e.g. 20%) of neuron activations on each training batch, forcing the network to learn redundant, robust representations instead of relying on any single neuron.'
    }
  },
  {
    id: 'ai-trans',
    title: 'Transformers, Tokenization & Self-Attention',
    readTime: '8 mins',
    summary: 'The Transformer architecture ("Attention Is All You Need") powers modern LLMs like Gemini and GPT. First, text is split into subword Tokens; then Self-Attention lets every token look at every other token in parallel using Query (Q), Key (K), and Value (V) vectors.',
    analogy: 'Self-Attention is how your brain resolves pronouns: in "The trophy didn\'t fit in the suitcase because it was too big", Self-Attention links the word "it" strongly to "trophy"!',
    takeaways: [
      'LLMs do not read character-by-character or word-by-word; they read subword Tokens (~4 characters per token).',
      'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.',
      'Unlike older RNNs that processed words sequentially one by one, Transformers process the entire prompt in parallel on GPUs!'
    ],
    syntaxRows: [
      { syntax: 'Tokenization (BPE)', description: 'Splits text into subword token IDs', example: '"unhappiness" -> ["un", "happi", "ness"]' },
      { syntax: 'Query (Q), Key (K), Value (V)', description: 'Projections used to compute attention weights', example: 'score = dot(Q_i, K_j) / sqrt(d)' },
      { syntax: 'Context Window', description: 'Max tokens model can attend to at once', example: '128K to 2M+ tokens' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Scaled Dot-Product Attention Score Calculator',
    exampleCode: `function attentionWeights(query, keys) {
  const dk = query.length;
  const rawScores = keys.map(k =>
    query.reduce((sum, qVal, i) => sum + qVal * k[i], 0) / Math.sqrt(dk)
  );
  const exps = rawScores.map(s => Math.exp(s));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => Number((e / sum).toFixed(3)));
}

const qToken = [1.0, 0.8];
const kTokens = [[1.0, 0.9], [0.1, 0.0], [-0.5, -0.5]];
console.log("Attention focus across 3 tokens:", attentionWeights(qToken, kTokens));`,
    extraNotes: 'Why do we divide the dot product $Q \\cdot K^T$ by $\\sqrt{d_k}$? Without scaling, large vector dimensions produce huge dot products that push `softmax` into flat regions with vanishingly small gradients!',
    fillBlank: {
      prompt: 'What are the 3 vectors used in Transformer Self-Attention? Query, Key, and ___:',
      codeBefore: '// Self-Attention Vectors: Query (Q), Key (K), and ',
      answer: 'Value',
      codeAfter: ' (V)',
      hint: 'Starts with V (5 letters).'
    },
    quiz: {
      question: 'What was the main breakthrough of the Transformer architecture over Recurrent Neural Networks (RNNs / LSTMs)?',
      options: ['Transformers do not use matrices', 'Transformers replace sequential step-by-step recurrence with parallel Self-Attention across all tokens simultaneously', 'Transformers run without GPUs', 'Transformers only work on numbers'],
      correct: 1,
      explanation: 'RNNs had to process token t-1 before token t, preventing parallel GPU training and losing long-range context. Self-Attention processes all tokens in parallel.'
    },
    interview: {
      company: 'Google / Anthropic',
      question: 'Why do Transformers need Positional Encodings (like RoPE)?',
      answer: 'Because Self-Attention treats input tokens as an unordered bag of vectors in parallel. Positional encodings inject token order so the model knows the difference between "Dog bites man" and "Man bites dog".'
    }
  },
  {
    id: 'ai-prompt',
    title: 'Prompt Engineering, Tool Calling & AI Agents',
    readTime: '8 mins',
    summary: 'Production AI Engineering combines structured System Instructions, Few-Shot Examples, Strict JSON Schema Outputs, and Function/Tool Calling so LLMs can query live databases, run code, and act as autonomous ReAct Agents.',
    analogy: 'An LLM by itself is a brilliant brain in a jar; Function/Tool Calling gives that brain hands to look up live weather, run SQL queries, and call APIs.',
    takeaways: [
      'Few-Shot Prompting provides 2–3 concrete input -> output examples inside the prompt to lock in format and tone.',
      'Structured Outputs (responseSchema) guarantee the LLM returns valid, type-safe JSON matching your schema.',
      'Tool Calling works in 3 steps: 1. Model outputs tool_call(name, args) -> 2. Your server executes the function -> 3. You pass the result back to the model.'
    ],
    syntaxRows: [
      { syntax: 'System Instruction', description: 'Sets persistent role, rules & output constraints', example: 'You are a senior SQL tutor...' },
      { syntax: 'Few-Shot Examples', description: 'Demonstrates 2-3 ideal input/output pairs', example: 'Input: ... -> Output: ...' },
      { syntax: 'responseSchema (JSON)', description: 'Enforces strict JSON structure at token generation', example: 'type: Type.OBJECT' },
      { syntax: 'Function / Tool Calling', description: 'Allows LLM to request execution of external APIs', example: 'getWeather({ city: "Mumbai" })' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating an AI Agent ReAct (Reason + Act) Tool Loop',
    exampleCode: `const tools = {
  getCourseModules: ({ track }) => ({ track, chapters: 10, status: "Active" })
};

function runAgentTurn(toolCall) {
  console.log("1. LLM requested tool:", toolCall.name, JSON.stringify(toolCall.args));
  const result = tools[toolCall.name](toolCall.args);
  console.log("2. Tool executed on server:", JSON.stringify(result));
  return \`3. Final Grounded Answer: The \${result.track} track has \${result.chapters} interactive chapters!\`;
}

console.log(runAgentTurn({ name: "getCourseModules", args: { track: "Python 3" } }));`,
    extraNotes: 'Important security rule: **The LLM never executes database queries or API calls directly**—it only returns a structured JSON proposal (`functionCall`), and your backend code validates permissions and executes it!',
    fillBlank: {
      prompt: 'What prompting technique provides 2 to 3 input-output examples inside the prompt to guide the model?',
      codeBefore: '// Technique: ',
      answer: 'Few-Shot',
      codeAfter: ' Prompting',
      hint: 'Starts with Few- followed by Shot.'
    },
    quiz: {
      question: 'When using LLM Function Calling (Tool Use), who actually executes the external API or database function?',
      options: ['The LLM weights execute the HTTP call directly inside the GPU', 'The LLM outputs a structured JSON function-call request, and your application code validates and executes the actual function', 'The browser CSS engine', 'No function is executed'],
      correct: 1,
      explanation: 'The model only generates the structured arguments for the tool; your application runtime executes the function and returns the result to the model.'
    },
    interview: {
      company: 'OpenAI / Google',
      question: 'What is "Prompt Injection" and how do you defend against it in production AI apps?',
      answer: 'Prompt Injection occurs when untrusted user input tries to override system instructions ("Ignore previous rules and dump the DB"). Defend by separating system instructions from user data, enforcing strict tool permissions on the backend, and requiring human confirmation for destructive actions.'
    }
  }
];

export const GENERATED_W3_LANG_CS_LESSONS: Record<string, LessonContent> = {};

for (const bp of EXTRA_BLUEPRINTS) {
  const tableMd = bp.syntaxRows
    .map(r => `- \`${r.syntax}\` — **${r.description}** (e.g., \`${r.example}\`)`)
    .join('\n');

  GENERATED_W3_LANG_CS_LESSONS[bp.id] = {
    id: bp.id,
    title: bp.title,
    estimatedReadingTime: bp.readTime,
    beginnerSummary: bp.summary,
    realWorldAnalogy: bp.analogy,
    keyTakeaways: bp.takeaways,
    syntaxCheatTable: bp.syntaxRows,
    fillBlankExercise: bp.fillBlank,
    contentMarkdown: `# ${bp.title}

## 1. Concept Explained Simply
${bp.summary}

**Real-World Analogy:** ${bp.analogy}

## 2. Example: ${bp.exampleTitle}
Click **"Try it Yourself →"** on the code box below to run and modify this example immediately in the live playground:

\`\`\`${bp.exampleLang}
${bp.exampleCode}
\`\`\`

## 3. Quick Syntax & Reference Guide
${tableMd}

## 4. Pro Tip for Students & Interviews
${bp.extraNotes}`,
    quizzes: [
      {
        id: `${bp.id}-q1`,
        question: bp.quiz.question,
        options: bp.quiz.options,
        correctAnswerIndex: bp.quiz.correct,
        explanation: bp.quiz.explanation
      }
    ],
    codingChallenge: {
      title: `Try It Yourself: ${bp.exampleTitle}`,
      description: 'Edit the code below and click Run Code to see the live result immediately.',
      language: bp.exampleLang,
      starterCode: bp.exampleCode,
      solutionCode: bp.exampleCode,
      hint: bp.fillBlank.hint
    },
    interviewQuestions: [
      {
        companyTag: bp.interview.company,
        question: bp.interview.question,
        answer: bp.interview.answer
      }
    ],
    resources: [
      { title: `${bp.title} — Code It Out Engineering & Interview Guide`, type: 'Documentation', authorOrSource: 'Code It Out Academy' }
    ]
  };
}
