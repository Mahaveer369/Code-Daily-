import { Category, Course, CourseModule, LessonContent } from '../../types';
import { buildLessonArchitectureSvg } from './visualAssets';

interface JavaChapterSpec {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sectionGroup: string;
  analogy: string;
  keyTerm: string;
  secondaryTerm: string;
  syntaxExample: string;
  codeSnippet: string;
  realTimeWhereUsed: string;
  exercise1: {
    title: string;
    scenario: string;
    codeBefore: string;
    answer: string;
    acceptedAnswers: string[];
    codeAfter: string;
    hint: string;
    explanation: string;
  };
  exercise2: {
    title: string;
    scenario: string;
    codeBefore: string;
    answer: string;
    acceptedAnswers: string[];
    codeAfter: string;
    hint: string;
    explanation: string;
  };
  exercise3: {
    title: string;
    scenario: string;
    codeBefore: string;
    answer: string;
    acceptedAnswers: string[];
    codeAfter: string;
    hint: string;
    explanation: string;
  };
  interviewQ: string;
  interviewA: string;
  company: string;
}

const JAVA_25_SPECS: JavaChapterSpec[] = [
  {
    id: 'jv-1',
    title: 'Java HOME: JDK 21 Architecture, Bytecode (javac), ClassLoaders & JIT',
    description: 'How Java source (.java) compiles to platform-neutral Bytecode (.class) and executes via the HotSpot JVM Interpreter & C1/C2 Tiered JIT',
    difficulty: 'Beginner',
    sectionGroup: 'Java Foundations & Syntax',
    analogy: 'Java Bytecode is like universal sheet music: any piano player (JVM on Linux, macOS, or Windows) can read the exact same sheet music and play it natively on their instrument.',
    keyTerm: 'public static void main',
    secondaryTerm: 'javac',
    syntaxExample: 'public static void main(String[] args) { System.out.println("Java 21 LTS"); }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String runtime = "Java 21 LTS (HotSpot C2 JIT)";
        int cores = 16;
        System.out.println("Runtime Engine: " + runtime);
        System.out.println("Available Hardware Threads: " + cores);
    }
}`,
    realTimeWhereUsed: 'Used across Netflix API Gateways, Amazon Order Fulfillment services, and Android Runtime (ART) where code is compiled once in CI and deployed across heterogeneous x86_64 and ARM64 Graviton cloud instances.',
    exercise1: {
      title: 'Entry-Point Signature',
      scenario: 'Write the modifier keyword that allows the JVM to invoke main() without instantiating the Main class:',
      codeBefore: 'public class Main {\n  public ',
      answer: 'static',
      acceptedAnswers: ['static'],
      codeAfter: ' void main(String[] args) {\n    System.out.println("Ready");\n  }\n}',
      hint: '6-letter keyword for class-level methods.',
      explanation: 'The JVM invokes Main.main() before any object is constructed, so main() must be declared static.'
    },
    exercise2: {
      title: 'Console Standard Output',
      scenario: 'Complete the standard output call to print a line to stdout in Java:',
      codeBefore: 'System.out.',
      answer: 'println',
      acceptedAnswers: ['println', 'print'],
      codeAfter: '("Service started on port 8080");',
      hint: 'print followed by ln.',
      explanation: 'System.out.println() writes formatted text followed by a newline to the standard output stream.'
    },
    exercise3: {
      title: 'Java Bytecode Compiler Command',
      scenario: 'Which JDK command-line tool compiles OrderService.java into OrderService.class bytecode?',
      codeBefore: '// Terminal command: ',
      answer: 'javac',
      acceptedAnswers: ['javac', 'javac OrderService.java'],
      codeAfter: ' OrderService.java',
      hint: 'java followed by c (compiler).',
      explanation: 'javac compiles .java source files into .class JVM bytecode files.'
    },
    interviewQ: 'Why does Java use both an Interpreter and a Just-In-Time (JIT) compiler inside HotSpot JVM?',
    interviewA: 'The Interpreter starts executing bytecode immediately with zero startup delay, while the profiler counts method invocations; once a loop crosses the hotness threshold, the C1/C2 Tiered JIT compiles it into optimized native machine code.',
    company: 'Amazon / Netflix'
  },
  {
    id: 'jv-2',
    title: 'Primitives vs Wrapper Types, Autoboxing, String Pool & Compact Strings',
    description: '8 primitive types (int, long, double, boolean), Integer cache (-128 to 127), String immutability, and Latin-1 Compact Strings',
    difficulty: 'Beginner',
    sectionGroup: 'Java Foundations & Syntax',
    analogy: 'A primitive `int` is raw cash in your pocket (4 bytes, no wrapper); an `Integer` object is cash locked inside a labeled gift box on the Heap (16+ bytes with object header).',
    keyTerm: 'StringBuilder',
    secondaryTerm: 'Integer.valueOf',
    syntaxExample: 'StringBuilder sb = new StringBuilder(256); sb.append("tx_").append(101);',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String s1 = "payment_ok";
        String s2 = "payment_ok"; // Reuses String Pool literal
        System.out.println("String Pool Reference Match: " + (s1 == s2));
        System.out.println("Value Equality (.equals): " + s1.equals(s2));
    }
}`,
    realTimeWhereUsed: 'High-throughput Kafka log serializers and financial FIX protocol parsers avoid `Integer` autoboxing and use `StringBuilder` or primitive `long` fields to prevent gigabytes of short-lived heap garbage.',
    exercise1: {
      title: 'Safe String Value Comparison',
      scenario: 'Use the String method that compares character contents rather than memory references:',
      codeBefore: 'if (inputToken.',
      answer: 'equals',
      acceptedAnswers: ['equals', 'contentEquals'],
      codeAfter: '(expectedToken)) {\n  grantAccess();\n}',
      hint: '6-letter method checking value equality.',
      explanation: '== compares object memory addresses; .equals() compares the actual characters inside the String.'
    },
    exercise2: {
      title: 'Zero-Copy Loop String Concatenation',
      scenario: 'Instantiate the mutable buffer class used to concatenate strings inside a loop in O(N) time:',
      codeBefore: '',
      answer: 'StringBuilder',
      acceptedAnswers: ['StringBuilder', 'var'],
      codeAfter: ' sb = new StringBuilder();\nsb.append("user_").append(id);',
      hint: 'Starts with String followed by Builder.',
      explanation: 'Concatenating immutable Strings with + inside a loop allocates a new array each iteration; StringBuilder mutates a singleresizable char/byte buffer in O(N).'
    },
    exercise3: {
      title: '64-Bit Integer Literal Suffix',
      scenario: 'Parse a 64-bit string timestamp into a primitive long using the Long wrapper class:',
      codeBefore: 'long ts = Long.',
      answer: 'parseLong',
      acceptedAnswers: ['parseLong', 'valueOf'],
      codeAfter: '("1730800000000");',
      hint: 'parse followed by Long.',
      explanation: 'Long.parseLong() returns a primitive 64-bit long without autoboxing overhead.'
    },
    interviewQ: 'Why does `Integer a = 127; Integer b = 127; (a == b)` evaluate to `true`, whereas `Integer x = 128; Integer y = 128; (x == y)` evaluates to `false`?',
    interviewA: 'Java caches Integer wrapper instances in the range -128 to 127 inside IntegerCache. Autoboxing 127 returns the same cached reference, whereas 128 allocates two distinct Integer objects on the Heap.',
    company: 'Goldman Sachs / Uber'
  },
  {
    id: 'jv-3',
    title: 'Control Flow, Enhanced Switch Expressions & Pattern Matching',
    description: 'Java 14+ arrow switch expressions (case ->), yield keyword, and Java 21 pattern matching for instanceof and switch',
    difficulty: 'Beginner',
    sectionGroup: 'Java Foundations & Syntax',
    analogy: 'Legacy `switch` was a hallway of open trapdoors where forgetting `break;` caused accidental fall-through; modern `case ->` switch expressions seal every room and require exhaustive coverage.',
    keyTerm: 'switch',
    secondaryTerm: 'instanceof',
    syntaxExample: 'int fee = switch (tier) { case "PRO" -> 0; case "BASIC" -> 25; default -> 50; };',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String status = "SETTLED";
        String action = switch (status) {
            case "PENDING", "AUTHORIZED" -> "Hold funds in escrow";
            case "SETTLED" -> "Release ledger payout";
            default -> "Flag for manual audit";
        };
        System.out.println("Payment Status: " + status + " -> " + action);
    }
}`,
    realTimeWhereUsed: 'Stripe and Adyen Java payment state machines use exhaustive `switch` expressions over sealed payment states so adding a new state fails compilation until every handler updates.',
    exercise1: {
      title: 'Pattern Matching for instanceof',
      scenario: 'Use the Java operator that checks if obj is a String and binds it to pattern variable s in one step:',
      codeBefore: 'if (obj ',
      answer: 'instanceof',
      acceptedAnswers: ['instanceof'],
      codeAfter: ' String s && !s.isEmpty()) {\n  System.out.println(s.toLowerCase());\n}',
      hint: '10-letter keyword checking runtime type.',
      explanation: 'Java 16+ pattern matching for instanceof eliminates redundant explicit casts ((String) obj).'
    },
    exercise2: {
      title: 'Multi-Line Switch Expression Value Return',
      scenario: 'Which keyword returns a value from inside a multi-statement block in a Java switch expression?',
      codeBefore: 'case "RETRY" -> {\n  metrics.increment();\n  ',
      answer: 'yield',
      acceptedAnswers: ['yield'],
      codeAfter: ' 429;\n}',
      hint: '5-letter keyword introduced for switch expression blocks.',
      explanation: 'yield produces the resulting value of a block branch inside a switch expression.'
    },
    exercise3: {
      title: 'Enhanced For-Each Loop',
      scenario: 'Iterate over every element tx in the transactions array using Java enhanced for-each syntax:',
      codeBefore: 'for (Transaction tx ',
      answer: ':',
      acceptedAnswers: [':'],
      codeAfter: ' transactions) {\n  tx.verify();\n}',
      hint: 'Single colon character separating variable and iterable.',
      explanation: 'Java uses a colon (:) in enhanced for-each loops over arrays and Iterable collections.'
    },
    interviewQ: 'How do Java 21 Switch Expressions improve reliability over classic C-style switch statements?',
    interviewA: 'Arrow switch expressions (->) eliminate accidental fall-through bugs, can be assigned directly to final variables, and enforce compile-time exhaustiveness across enums and sealed types.',
    company: 'Stripe / Apple'
  },
  {
    id: 'jv-4',
    title: 'Object-Oriented Design: Classes, Constructors, Encapsulation & Immutability',
    description: 'Access modifiers (private, package-private, protected, public), constructor chaining (this()), final fields & defensive copying',
    difficulty: 'Beginner',
    sectionGroup: 'Java Foundations & Syntax',
    analogy: 'An immutable Java object with `private final` fields is like a notarized bank cashier’s check: once printed, no thread in the system can alter the amount.',
    keyTerm: 'private final',
    secondaryTerm: 'this',
    syntaxExample: 'private final BigDecimal amount; public Order(BigDecimal amount) { this.amount = Objects.requireNonNull(amount); }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Immutable Account Initialized: ID=ACC-901 | Balance=250000");
        System.out.println("Defensive Invariant: All fields marked private final (Thread-Safe)");
    }
}`,
    realTimeWhereUsed: 'Banking ledger DTOs, authentication Principal tokens, and Spring configuration beans rely on `private final` constructor injection so state can be shared safely across thousands of threads without locks.',
    exercise1: {
      title: 'Immutable Field Declaration',
      scenario: 'Add the modifier that guarantees an instance field can only be assigned once inside the constructor:',
      codeBefore: 'private ',
      answer: 'final',
      acceptedAnswers: ['final'],
      codeAfter: ' String accountId;',
      hint: '5-letter keyword enforcing single assignment.',
      explanation: 'Marking fields private final guarantees immutability and safe publication across threads in the Java Memory Model.'
    },
    exercise2: {
      title: 'Constructor Null Guard',
      scenario: 'Use java.util.Objects to fail-fast with a NullPointerException if a constructor parameter is null:',
      codeBefore: 'this.userId = Objects.',
      answer: 'requireNonNull',
      acceptedAnswers: ['requireNonNull'],
      codeAfter: '(userId, "userId must not be null");',
      hint: 'require followed by NonNull.',
      explanation: 'Objects.requireNonNull() validates invariants at object construction time rather than failing later.'
    },
    exercise3: {
      title: 'Constructor Chaining',
      scenario: 'Invoke the primary 2-argument constructor from inside a 1-argument overloaded constructor:',
      codeBefore: 'public Wallet(String id) {\n  ',
      answer: 'this',
      acceptedAnswers: ['this'],
      codeAfter: '(id, 0L);\n}',
      hint: '4-letter keyword referring to the current class constructor.',
      explanation: 'this(...) delegates initialization to another constructor in the same class and must be the first statement.'
    },
    interviewQ: 'What steps are required to make a Java class containing a `List<String>` field 100% immutable?',
    interviewA: 'Declare the class and all fields `final`, make fields `private`, never provide setters, and perform defensive copying in both the constructor and getter using `List.copyOf(items)` so callers cannot mutate the original list.',
    company: 'JPMorgan Chase / Oracle'
  },
  {
    id: 'jv-5',
    title: 'Inheritance, Abstract Classes, Interfaces, Default Methods & Composition',
    description: 'Single class inheritance (extends) vs multiple interface implementation (implements), default/static interface methods & Composition over Inheritance',
    difficulty: 'Beginner',
    sectionGroup: 'Java Foundations & Syntax',
    analogy: 'Interfaces are plug-and-play USB-C ports (`PaymentGateway`): your `CheckoutService` does not care if `StripeGateway` or `RazorpayGateway` is plugged in as long as it implements `charge()`.',
    keyTerm: 'implements',
    secondaryTerm: 'interface',
    syntaxExample: 'public class StripeGateway implements PaymentGateway { @Override public Receipt charge(Money m) { ... } }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Interface Contract: PaymentGateway.charge() -> Routed via StripeAdapter");
        System.out.println(" Polymorphic Dispatch Verified: Receipt #TX-88412 [APPROVED]");
    }
}`,
    realTimeWhereUsed: 'Spring Boot dependency injection, JDBC `DataSource` drivers, and SLF4J logging facades program strictly against Java `interface` contracts so implementations can be swapped or mocked in unit tests.',
    exercise1: {
      title: 'Implementing an Interface Contract',
      scenario: 'Use the Java keyword for a class to fulfill the RateLimiter interface contract:',
      codeBefore: 'public class TokenBucketLimiter ',
      answer: 'implements',
      acceptedAnswers: ['implements'],
      codeAfter: ' RateLimiter {\n}',
      hint: '10-letter keyword starting with imp...',
      explanation: 'Classes use implements for interfaces and extends for a superclass.'
    },
    exercise2: {
      title: 'Compile-Time Override Verification',
      scenario: 'Add the standard annotation that forces the compiler to verify a method accurately overrides a parent or interface signature:',
      codeBefore: '',
      answer: '@Override',
      acceptedAnswers: ['@Override', 'Override'],
      codeAfter: '\npublic boolean allowRequest(String key) {\n  return true;\n}',
      hint: 'Starts with @ followed by Override.',
      explanation: '@Override catches signature typos at compile time instead of silently creating an overloaded method.'
    },
    exercise3: {
      title: 'Backward-Compatible Interface Evolution',
      scenario: 'Which keyword allows adding a concrete method body inside a Java interface without breaking existing implementing classes?',
      codeBefore: 'public interface Cache {\n  ',
      answer: 'default',
      acceptedAnswers: ['default'],
      codeAfter: ' void warmUp() { /* optional hook */ }\n}',
      hint: '7-letter keyword introduced in Java 8 for interfaces.',
      explanation: 'Java 8+ default methods allow interfaces like Collection and List to add new methods (e.g. .stream(), .forEach()) safely.'
    },
    interviewQ: 'What happens if a Java class implements two interfaces that both define a `default` method with the exact same signature?',
    interviewA: 'The code fails to compile with a diamond ambiguity error unless the implementing class explicitly overrides that method and resolves the conflict (optionally calling `InterfaceA.super.method()`).',
    company: 'Microsoft / Amazon'
  },
  {
    id: 'jv-6',
    title: 'Java Records, Sealed Classes/Interfaces & Algebraic Data Modeling',
    description: 'Zero-boilerplate immutable data carriers (record), compact constructors, and closed type hierarchies (sealed ... permits)',
    difficulty: 'Intermediate',
    sectionGroup: 'OOP, Records & Type System',
    analogy: 'A `record` is an auto-generated blueprint that writes `private final` fields, `equals()`, `hashCode()`, `toString()`, and accessors for you in a single line; `sealed` locks the family tree so no unknown subclasses can sneak in.',
    keyTerm: 'record',
    secondaryTerm: 'sealed',
    syntaxExample: 'public sealed interface AuthResult permits AuthSuccess, AuthMfaRequired, AuthDenied {}',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Record Instantiated: TradeOrder[symbol=NVDA, qty=150, limitPrice=138.50]");
        System.out.println("Auto-generated hashCode & equals verified in O(1)");
    }
}`,
    realTimeWhereUsed: 'REST/gRPC API request/response DTOs, Kafka event payloads, and compiler AST nodes in modern Java 21 microservices use `record` + `sealed interface` hierarchies.',
    exercise1: {
      title: 'Declaring an Immutable Java Record',
      scenario: 'Declare a Java 16+ immutable data carrier named Point with int x and int y components:',
      codeBefore: 'public ',
      answer: 'record',
      acceptedAnswers: ['record'],
      codeAfter: ' Point(int x, int y) {}',
      hint: '6-letter keyword for immutable data carriers.',
      explanation: 'record automatically generates canonical constructors, accessors (x(), y()), equals(), hashCode(), and toString().'
    },
    exercise2: {
      title: 'Restricting Subtypes with Sealed Interfaces',
      scenario: 'Complete the clause that specifies the exact allowed implementations of a sealed interface:',
      codeBefore: 'public sealed interface PaymentEvent ',
      answer: 'permits',
      acceptedAnswers: ['permits'],
      codeAfter: ' Authorized, Captured, Refunded {}',
      hint: '7-letter keyword listing allowed subclasses.',
      explanation: 'sealed ... permits restricts which classes may extend or implement the type, enabling exhaustive switch pattern matching.'
    },
    exercise3: {
      title: 'Compact Record Constructor Validation',
      scenario: 'Throw an IllegalArgumentException inside a record compact constructor if price is negative:',
      codeBefore: 'public record Item(String sku, double price) {\n  public Item {\n    if (price < 0) throw new ',
      answer: 'IllegalArgumentException',
      acceptedAnswers: ['IllegalArgumentException'],
      codeAfter: '("Negative price");\n  }\n}',
      hint: 'Standard JDK runtime exception for invalid arguments.',
      explanation: 'Compact record constructors validate parameters before the compiler automatically assigns this.sku = sku and this.price = price.'
    },
    interviewQ: 'Why can a Java `record` not extend another class, and can it implement interfaces?',
    interviewA: 'Every Java `record` implicitly extends `java.lang.Record` (and Java does not support multiple class inheritance), and records are implicitly `final`. However, a `record` can implement any number of interfaces!',
    company: 'Netflix / Stripe'
  },
  {
    id: 'jv-7',
    title: 'Generics, Type Erasure & Bounded Wildcards (? extends T, ? super T — PECS)',
    description: 'Compile-time type safety, Bridge methods, Producer Extends Consumer Super (PECS), and Heap Pollution guards',
    difficulty: 'Intermediate',
    sectionGroup: 'OOP, Records & Type System',
    analogy: 'PECS ("Producer Extends, Consumer Super"): if a basket only GIVES you fruit (Producer), accept `List<? extends Fruit>`; if you PUT apples into a basket (Consumer), accept `List<? super Apple>`.',
    keyTerm: '? extends',
    secondaryTerm: '? super',
    syntaxExample: 'public static <T> void copy(List<? super T> dest, List<? extends T> src)',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Generics PECS Pipeline: Copied 4 settled transactions from List<? extends Tx> to List<? super Tx>");
        System.out.println("Compile-Time Type Safety Verified (Zero ClassCastException)");
    }
}`,
    realTimeWhereUsed: 'Java Collections (`Collections.copy`, `Stream.collect`, `Comparator.comparing`) and reactive stream operators use PECS wildcards so APIs accept flexible subtype/supertype collections safely.',
    exercise1: {
      title: 'Upper-Bounded Producer Wildcard',
      scenario: 'Accept any List of Number or its subclasses (Integer, Double, Long) for a read-only sum method:',
      codeBefore: 'public double sumAll(List<',
      answer: '? extends Number',
      acceptedAnswers: ['? extends Number', '? extends'],
      codeAfter: '> numbers) { return 0.0; }',
      hint: 'Wildcard ? followed by extends Number.',
      explanation: 'Producer Extends (? extends Number) allows reading elements as Number from List<Integer> or List<Double>.'
    },
    exercise2: {
      title: 'Lower-Bounded Consumer Wildcard',
      scenario: 'Accept any List capable of receiving Integer elements (List<Integer>, List<Number>, List<Object>):',
      codeBefore: 'public void addIds(List<',
      answer: '? super Integer',
      acceptedAnswers: ['? super Integer', '? super'],
      codeAfter: '> sink) { sink.add(101); }',
      hint: 'Wildcard ? followed by super Integer.',
      explanation: 'Consumer Super (? super Integer) safely permits inserting Integer instances into the destination collection.'
    },
    exercise3: {
      title: 'Generic Method Type Parameter',
      scenario: 'Declare the type parameter <T> on a static generic factory method:',
      codeBefore: 'public static ',
      answer: '<T>',
      acceptedAnswers: ['<T>'],
      codeAfter: ' Response<T> ok(T payload) { return new Response<>(payload); }',
      hint: 'Angle brackets containing T before the return type.',
      explanation: 'Static methods do not inherit class type parameters and must declare <T> before the return type.'
    },
    interviewQ: 'What is Type Erasure in Java Generics, and why can you not write `new T()` or `new T[10]` at runtime?',
    interviewA: 'During compilation, javac erases generic type parameters (`<T>` becomes `Object` or its upper bound like `Comparable`) and inserts casts so bytecode stays backward-compatible. Because `T` does not exist at runtime, `new T()` has no class metadata unless you pass `Class<T> clazz`.',
    company: 'Google / Goldman Sachs'
  },
  {
    id: 'jv-8',
    title: 'Exceptions Hierarchy, Try-With-Resources (AutoCloseable) & Resilience',
    description: 'Checked vs Unchecked (RuntimeException) vs Error, Suppressed Exceptions in try-with-resources, and zero-cost stackless exceptions',
    difficulty: 'Intermediate',
    sectionGroup: 'OOP, Records & Type System',
    analogy: '`try-with-resources` is an automatic hotel door closer: even if a guest storms out in an emergency (throws an exception), the database connection and file socket are guaranteed to close cleanly in reverse order.',
    keyTerm: 'AutoCloseable',
    secondaryTerm: 'try',
    syntaxExample: 'try (Connection conn = pool.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) { ... }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Opening JDBC Connection & PreparedStatement inside try-with-resources...");
        System.out.println("Query Executed -> AutoCloseable.close() invoked deterministically in reverse order!");
    }
}`,
    realTimeWhereUsed: 'Database connection pools (HikariCP), S3 input streams, and Kafka consumers rely on `try (var resource = ...)` to prevent socket and file-descriptor exhaustion under error spikes.',
    exercise1: {
      title: 'Deterministic Resource Cleanup Interface',
      scenario: 'Which Java interface must a custom lock or connection class implement to work inside a try(...) header?',
      codeBefore: 'public class ScopedSpan implements ',
      answer: 'AutoCloseable',
      acceptedAnswers: ['AutoCloseable', 'Closeable'],
      codeAfter: ' {\n  @Override public void close() { /* end span */ }\n}',
      hint: 'Starts with Auto followed by Closeable.',
      explanation: 'Any class implementing AutoCloseable (or Closeable) is automatically closed at the end of a try-with-resources block.'
    },
    exercise2: {
      title: 'Multi-Catch Exception Block',
      scenario: 'Combine IOException and SQLException in a single catch clause using Java 7+ multi-catch syntax:',
      codeBefore: 'catch (IOException ',
      answer: '|',
      acceptedAnswers: ['|'],
      codeAfter: ' SQLException ex) {\n  logger.error("I/O failure", ex);\n}',
      hint: 'Single vertical pipe character.',
      explanation: 'Multi-catch (|) eliminates duplicated error-handling blocks for unrelated exception types.'
    },
    exercise3: {
      title: 'Inspecting Suppressed Exceptions',
      scenario: 'Call the Throwable method that retrieves exceptions suppressed when both the try block and close() throw:',
      codeBefore: 'Throwable[] suppressed = ex.',
      answer: 'getSuppressed',
      acceptedAnswers: ['getSuppressed', 'getSuppressed()'],
      codeAfter: '();',
      hint: 'get followed by Suppressed.',
      explanation: 'try-with-resources propagates the primary try-block exception and attaches any close() exception via addSuppressed().'
    },
    interviewQ: 'In a traditional `try-finally` block, what happens if both the `try` block and the `finally` block throw an exception—and how does `try-with-resources` fix this?',
    interviewA: 'In a manual `try-finally`, the exception from `finally` completely overwrites and swallows the original root-cause exception from `try`. `try-with-resources` preserves the primary `try` exception and attaches the `close()` exception to `ex.getSuppressed()`.',
    company: 'Amazon / Atlassian'
  },
  {
    id: 'jv-9',
    title: 'Java Collections Framework: ArrayList, LinkedList, ArrayDeque & Iterators',
    description: 'Contiguous Object[] resizing in ArrayList (1.5x growth), why ArrayDeque beats LinkedList in CPU cache locality, and Fail-Fast ConcurrentModificationException',
    difficulty: 'Intermediate',
    sectionGroup: 'Collections, Streams & Functional',
    analogy: '`ArrayList` and `ArrayDeque` pack passengers into contiguous train cars that fit inside CPU L1/L2 cache lines; `LinkedList` scatters each passenger in a separate taxi across the city (pointer chasing).',
    keyTerm: 'ArrayDeque',
    secondaryTerm: 'ArrayList',
    syntaxExample: 'Deque<String> stack = new ArrayDeque<>(64); stack.push("frame_1");',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("ArrayDeque Circular Ring Buffer: push/pop/offer/poll in strict O(1) amortized time");
        System.out.println("Zero Node wrapper allocations -> 3.8x faster than LinkedList & legacy synchronized Stack");
    }
}`,
    realTimeWhereUsed: 'BFS graph traversals, undo/redo command stacks, and request batching buffers in Netty and Spring use `ArrayDeque` and pre-sized `new ArrayList<>(expectedSize)`.',
    exercise1: {
      title: 'Modern Stack & Queue Implementation',
      scenario: 'Instantiate the circular-buffer Deque implementation recommended over legacy java.util.Stack and LinkedList:',
      codeBefore: 'Deque<Integer> queue = new ',
      answer: 'ArrayDeque',
      acceptedAnswers: ['ArrayDeque', 'ArrayDeque<>'],
      codeAfter: '<>();',
      hint: 'Array followed by Deque.',
      explanation: 'ArrayDeque is backed by a resizable circular array with zero node allocation overhead and no synchronized lock penalty.'
    },
    exercise2: {
      title: 'Safe Removal During Collection Iteration',
      scenario: 'Remove all expired sessions from a list in-place without triggering ConcurrentModificationException:',
      codeBefore: 'sessions.',
      answer: 'removeIf',
      acceptedAnswers: ['removeIf'],
      codeAfter: '(s -> s.isExpired());',
      hint: 'remove followed by If.',
      explanation: 'Collection.removeIf(Predicate) safely removes matching elements in O(N) single-pass without fail-fast iterator errors.'
    },
    exercise3: {
      title: 'Pre-Sizing ArrayList to Prevent Reallocations',
      scenario: 'Pass the initial capacity 10000 to ArrayList so adding 10,000 rows triggers zero internal array copies:',
      codeBefore: 'List<Row> rows = new ArrayList<>(',
      answer: '10000',
      acceptedAnswers: ['10000', '10_000'],
      codeAfter: ');',
      hint: 'Pass 10000 to the constructor.',
      explanation: 'Default new ArrayList<>() starts at capacity 10 and resizes by 1.5x repeatedly; pre-sizing allocates the exact Object[] once.'
    },
    interviewQ: 'Why is `ArrayDeque` almost always faster than `LinkedList` for implementing a FIFO Queue in Java?',
    interviewA: '`LinkedList` allocates a new 24-byte `Node` object on the Heap for every single `offer()` and causes CPU cache misses when traversing pointers. `ArrayDeque` uses a contiguous circular `Object[]` buffer that stays hot in L1/L2 cache with zero per-element heap allocations.',
    company: 'Google / LinkedIn'
  },
  {
    id: 'jv-10',
    title: 'HashMap, TreeMap & LinkedHashMap Internals: Red-Black Tree Binning & Hashing',
    description: 'Power-of-two bucket mask ((n - 1) & hash), Perturbation hash spreading (h ^ (h >>> 16)), TREEIFY_THRESHOLD = 8, and LRU Cache via LinkedHashMap',
    difficulty: 'Advanced',
    sectionGroup: 'Collections, Streams & Functional',
    analogy: 'A Java 8+ `HashMap` is an apartment building of buckets: if a single bucket gets crowded with 8+ tenants (hash collision attack), Java upgrades that bucket from a slow hallway line (LinkedList) into a balanced elevator (Red-Black Tree).',
    keyTerm: 'HashMap',
    secondaryTerm: 'computeIfAbsent',
    syntaxExample: 'map.computeIfAbsent(dept, k -> new ArrayList<>()).add(employee);',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("HashMap Bucket Index: (n - 1) & (h ^ (h >>> 16)) -> O(1) Lookup");
        System.out.println("Collision Guard: Bucket length >= 8 && table >= 64 -> TreeNode Red-Black Tree O(log N)");
    }
}`,
    realTimeWhereUsed: 'In-memory caches, Graph adjacency lists (`map.computeIfAbsent`), and Spring bean registries use `HashMap` and `LinkedHashMap` (with `accessOrder = true` for LRU eviction).',
    exercise1: {
      title: 'Atomic Multi-Map Bucket Initialization',
      scenario: 'Use the Java 8+ Map method that initializes a new ArrayList for a key only if the key is not yet present:',
      codeBefore: 'graph.',
      answer: 'computeIfAbsent',
      acceptedAnswers: ['computeIfAbsent'],
      codeAfter: '(u, k -> new ArrayList<>()).add(v);',
      hint: 'compute followed by IfAbsent.',
      explanation: 'computeIfAbsent() eliminates verbose if (!map.containsKey(u)) boilerplate when building adjacency lists or grouped maps.'
    },
    exercise2: {
      title: 'HashCode & Equals Contract',
      scenario: 'Use java.util.Objects to generate a composite hash code from id and email fields:',
      codeBefore: '@Override public int hashCode() {\n  return Objects.',
      answer: 'hash',
      acceptedAnswers: ['hash'],
      codeAfter: '(id, email);\n}',
      hint: '4-letter static helper on Objects.',
      explanation: 'Objects.hash(...) computes a standard polynomial hash across multiple fields to pair with equals().'
    },
    exercise3: {
      title: 'Sorted Range Queries with TreeMap',
      scenario: 'Call the NavigableMap/TreeMap method that returns the greatest key less than or equal to targetKey in O(log N):',
      codeBefore: 'Integer shardKey = ring.',
      answer: 'floorKey',
      acceptedAnswers: ['floorKey', 'floorEntry'],
      codeAfter: '(requestHash);',
      hint: 'floor followed by Key.',
      explanation: 'TreeMap (Red-Black Tree) supports floorKey(), ceilingKey(), and subMap() in O(log N), powering consistent hashing rings.'
    },
    interviewQ: 'Why does Java’s `HashMap` always keep its table capacity as a power of 2 ($2^k$), and why does it XOR the upper 16 bits (`h ^ (h >>> 16)`)?',
    interviewA: 'When capacity $n$ is a power of 2, modulo `hash % n` can be computed in 1 CPU cycle via bitwise AND `(n - 1) & hash`. Because `(n - 1)` masks only the lower bits, XORing `h >>> 16` mixes the high bits into the low bits to prevent collisions when hashes only differ in upper bits.',
    company: 'Amazon / Citadel'
  },
  {
    id: 'jv-11',
    title: 'Functional Programming: Lambda Expressions, invokedynamic & Method References',
    description: '@FunctionalInterface (Function, Predicate, Consumer, Supplier, BiFunction), variable capture (effectively final), and invokedynamic LambdaMetafactory',
    difficulty: 'Intermediate',
    sectionGroup: 'Collections, Streams & Functional',
    analogy: 'Unlike anonymous inner classes that compile into separate `.class` files on disk, Java Lambdas use `invokedynamic`—a runtime recipe card that the JVM links lazily on first call.',
    keyTerm: 'Predicate',
    secondaryTerm: 'Function',
    syntaxExample: 'Predicate<Order> isHighValue = o -> o.amount() >= 10_000;',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Composed Predicate: isVerified.and(isHighValue) -> Evaluated True");
        System.out.println("Bytecode Instruction: invokedynamic LambdaMetafactory (Zero extra .class files)");
    }
}`,
    realTimeWhereUsed: 'Spring Security filter chains, strategy pattern callbacks, and retry policies (`Supplier<CompletableFuture<T>>`) pass functional interfaces instead of heavyweight class hierarchies.',
    exercise1: {
      title: 'Composing Boolean Predicates',
      scenario: 'Chain two Predicate<User> conditions (isActive and isVerified) so both must be true:',
      codeBefore: 'Predicate<User> canTrade = isActive.',
      answer: 'and',
      acceptedAnswers: ['and'],
      codeAfter: '(isVerified);',
      hint: '3-letter logical combinator method on Predicate.',
      explanation: 'Predicate provides .and(), .or(), and .negate() default methods for composable business rules.'
    },
    exercise2: {
      title: 'Method Reference Shorthand',
      scenario: 'Convert the lambda (String s) -> s.toUpperCase() into a concise Java Method Reference:',
      codeBefore: 'list.stream().map(',
      answer: 'String::toUpperCase',
      acceptedAnswers: ['String::toUpperCase'],
      codeAfter: ').toList();',
      hint: 'ClassName::methodName using double colon.',
      explanation: 'String::toUpperCase is an unbound instance method reference equivalent to s -> s.toUpperCase().'
    },
    exercise3: {
      title: 'Lazy Value Supplier',
      scenario: 'Which @FunctionalInterface in java.util.function takes 0 arguments and returns a value T via .get()?',
      codeBefore: 'public void logDebug(',
      answer: 'Supplier',
      acceptedAnswers: ['Supplier', 'Supplier<String>'],
      codeAfter: '<String> lazyMessage) { if (isDebug) log(lazyMessage.get()); }',
      hint: '8-letter interface that supplies a value.',
      explanation: 'Passing Supplier<String> defers expensive string formatting until isDebug is confirmed true.'
    },
    interviewQ: 'Why must local variables captured by a Java Lambda expression be "effectively final"?',
    interviewA: 'Local primitives and references live on the thread’s Stack frame. A lambda may outlive the method or run on another thread, so Java copies the variable’s value into the lambda instance; requiring it to be effectively final prevents data races and out-of-sync copies.',
    company: 'Oracle / Morgan Stanley'
  },
  {
    id: 'jv-12',
    title: 'Java Streams API, Spliterator, Collectors & Parallel Stream Hazards',
    description: 'Lazy intermediate operations (filter, map, flatMap, mapToLong) vs terminal operations (collect, toList, reduce), groupingBy, and why parallelStream() can starve ForkJoinPool',
    difficulty: 'Intermediate',
    sectionGroup: 'Collections, Streams & Functional',
    analogy: 'Java Streams are lazy assembly lines: nothing moves through `filter()` or `map()` until the terminal switch (`toList()` or `reduce()`) is pulled, allowing the JVM to fuse operations into a single loop.',
    keyTerm: 'Collectors.groupingBy',
    secondaryTerm: 'flatMap',
    syntaxExample: 'Map<String, Long> byDept = emps.stream().collect(Collectors.groupingBy(Emp::dept, Collectors.counting()));',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Stream Pipeline Fused: filter -> mapToLong -> sum (Zero boxing via LongStream)");
        System.out.println("Aggregated Revenue by Region: {APAC=420000, US=890000, EU=610000}");
    }
}`,
    realTimeWhereUsed: 'In-memory analytics aggregators, report generators, and microservice DTO mappers use `Stream`, `flatMap`, and `Collectors.groupingBy` to transform nested collections declaratively.',
    exercise1: {
      title: 'Flattening Nested Lists with flatMap',
      scenario: 'Use the Stream operation that flattens a Stream<List<OrderItem>> into a single Stream<OrderItem>:',
      codeBefore: 'List<OrderItem> allItems = orders.stream().',
      answer: 'flatMap',
      acceptedAnswers: ['flatMap'],
      codeAfter: '(order -> order.items().stream()).toList();',
      hint: 'flat followed by Map.',
      explanation: 'map() produces a nested Stream<Stream<T>>, whereas flatMap() flattens inner streams into a single continuous Stream<T>.'
    },
    exercise2: {
      title: 'Avoiding Autoboxing in Numeric Streams',
      scenario: 'Convert a Stream<Order> into a primitive LongStream to sum amounts without allocating Long wrapper objects:',
      codeBefore: 'long totalCents = orders.stream().',
      answer: 'mapToLong',
      acceptedAnswers: ['mapToLong'],
      codeAfter: '(Order::amountCents).sum();',
      hint: 'mapTo followed by Long.',
      explanation: 'mapToLong(), mapToInt(), and mapToDouble() operate on raw primitive pipelines with zero heap boxing.'
    },
    exercise3: {
      title: 'Grouping Elements by Key',
      scenario: 'Use java.util.stream.Collectors to partition records into a Map keyed by status:',
      codeBefore: 'var byStatus = txs.stream().collect(Collectors.',
      answer: 'groupingBy',
      acceptedAnswers: ['groupingBy'],
      codeAfter: '(Tx::status));',
      hint: 'grouping followed by By.',
      explanation: 'Collectors.groupingBy() is the Java Stream equivalent of SQL GROUP BY.'
    },
    interviewQ: 'Why is calling `.parallelStream()` inside a web server request handler (like Tomcat or Netty) a dangerous anti-pattern when performing blocking I/O?',
    interviewA: 'All `.parallelStream()` calls across the entire JVM share the single global `ForkJoinPool.commonPool()` (sized to `CPU cores - 1`). Blocking inside one parallel stream starves every other request using the common pool across the whole application!',
    company: 'Netflix / Uber'
  },
  {
    id: 'jv-13',
    title: 'Optional<T>, Null-Safety Architecture & Defensive Domain APIs',
    description: 'Eliminating NullPointerException at API boundaries, map/flatMap/filter on Optional, and why orElseGet(Supplier) beats orElse(val)',
    difficulty: 'Intermediate',
    sectionGroup: 'Collections, Streams & Functional',
    analogy: '`Optional<User>` is a sealed FedEx box that explicitly tells the caller: "There might be a User inside, or it might be empty—you must check or provide a fallback before opening."',
    keyTerm: 'orElseGet',
    secondaryTerm: 'Optional.ofNullable',
    syntaxExample: 'User user = repo.findById(id).orElseGet(() -> createGuestUser(id));',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Optional Chain: findUser(42).flatMap(User::getWallet).map(Wallet::balance).orElse(0L)");
        System.out.println("Lazy Fallback Verified: orElseGet(Supplier) skipped DB call on cache hit!");
    }
}`,
    realTimeWhereUsed: 'Spring Data repositories (`Optional<User> findById(ID)`), configuration lookups, and functional service pipelines return `Optional<T>` to make absence explicit in the type signature.',
    exercise1: {
      title: 'Wrapping a Potentially Null Value',
      scenario: 'Construct an Optional from a legacy variable rawHeader that might be null without throwing NPE:',
      codeBefore: 'Optional<String> hdr = Optional.',
      answer: 'ofNullable',
      acceptedAnswers: ['ofNullable'],
      codeAfter: '(rawHeader);',
      hint: 'of followed by Nullable.',
      explanation: 'Optional.of(null) throws NullPointerException immediately; Optional.ofNullable(null) safely returns Optional.empty().'
    },
    exercise2: {
      title: 'Lazy Fallback Evaluation',
      scenario: 'Use the Optional method that accepts a Supplier lambda so the fallback is ONLY executed when the Optional is empty:',
      codeBefore: 'Config cfg = cache.get(key).',
      answer: 'orElseGet',
      acceptedAnswers: ['orElseGet'],
      codeAfter: '(() -> loadFromDatabase(key));',
      hint: 'orElse followed by Get.',
      explanation: 'orElse(loadFromDatabase(key)) eagerly calls the database even when the value is present in cache! orElseGet(() -> ...) evaluates lazily.'
    },
    exercise3: {
      title: 'Throwing a Custom Exception When Empty',
      scenario: 'Unwrap the Optional or throw a NotFoundException if empty:',
      codeBefore: 'User u = repo.findById(id).',
      answer: 'orElseThrow',
      acceptedAnswers: ['orElseThrow'],
      codeAfter: '(() -> new NotFoundException(id));',
      hint: 'orElse followed by Throw.',
      explanation: 'orElseThrow(Supplier) cleanly unwraps the value or throws a domain-specific exception.'
    },
    interviewQ: 'What is the critical runtime difference between `opt.orElse(computeDefault())` and `opt.orElseGet(() -> computeDefault())`?',
    interviewA: '`orElse(computeDefault())` evaluates `computeDefault()` EAGERLY on every call even when `opt` is non-empty! `orElseGet(Supplier)` only invokes the `Supplier` lambda when `opt` is actually empty.',
    company: 'Stripe / Amazon'
  },
  {
    id: 'jv-14',
    title: 'JVM Memory Architecture: Heap (Eden, Survivor, Tenured), Metaspace & Off-Heap',
    description: 'Thread-private Stacks, Thread-Local Allocation Buffers (TLAB), Young/Old Heap Generations, Native Metaspace, and DirectByteBuffer',
    difficulty: 'Advanced',
    sectionGroup: 'JVM Internals, GC & Memory Model',
    analogy: 'A TLAB (Thread-Local Allocation Buffer) gives each chef in a busy kitchen their own private cutting board inside Eden Space so they can slice ingredients in `O(1)` bump-the-pointer speed without waiting for a shared lock.',
    keyTerm: 'TLAB',
    secondaryTerm: 'DirectByteBuffer',
    syntaxExample: 'ByteBuffer offHeap = ByteBuffer.allocateDirect(64 * 1024); // Zero-copy native memory',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("JVM Heap Layout: Young Gen (Eden + S0/S1 via TLAB bump-pointer) -> Old Tenured Gen");
        System.out.println("Off-Heap DirectByteBuffer: 64KB allocated outside GC Heap for zero-copy socket I/O");
    }
}`,
    realTimeWhereUsed: 'Apache Kafka brokers, Netty network buffers, and Cassandra storage engines allocate `DirectByteBuffer` off-heap memory and tune `-XX:MaxMetaspaceSize` and `-Xms/-Xmx` to avoid GC pauses.',
    exercise1: {
      title: 'Allocating Off-Heap Native Memory',
      scenario: 'Use java.nio.ByteBuffer to allocate 1MB of off-heap native OS memory for zero-copy network I/O:',
      codeBefore: 'ByteBuffer buf = ByteBuffer.',
      answer: 'allocateDirect',
      acceptedAnswers: ['allocateDirect'],
      codeAfter: '(1024 * 1024);',
      hint: 'allocate followed by Direct.',
      explanation: 'ByteBuffer.allocateDirect() allocates memory in native OS space outside the JVM GC heap, avoiding extra kernel-to-heap copies.'
    },
    exercise2: {
      title: 'Locking Initial and Max JVM Heap Size',
      scenario: 'Which JVM startup flag sets the maximum Heap size (e.g., -___8g) to match -Xms8g in production?',
      codeBefore: 'java -Xms8g ',
      answer: '-Xmx8g',
      acceptedAnswers: ['-Xmx8g', '-Xmx'],
      codeAfter: ' -jar payment-service.jar',
      hint: '-Xmx followed by 8g.',
      explanation: 'Setting -Xms equal to -Xmx prevents the JVM from pausing at runtime to request or shrink OS memory pages.'
    },
    exercise3: {
      title: 'Class Metadata Memory Region',
      scenario: 'In Java 8+, what native memory region replaced the legacy PermGen space for storing loaded Class metadata?',
      codeBefore: '// JVM Flag: -XX:Max',
      answer: 'Metaspace',
      acceptedAnswers: ['Metaspace', 'MetaspaceSize'],
      codeAfter: 'Size=256m',
      hint: 'Starts with Meta followed by space.',
      explanation: 'Metaspace stores class definitions and method metadata in native memory rather than inside the fixed-size PermGen heap.'
    },
    interviewQ: 'How can `new MyObject()` in Java be as fast as—or faster than—`malloc()` in C?',
    interviewA: 'Because each Java thread is assigned its own Thread-Local Allocation Buffer (TLAB) inside Eden Space. Allocating a new object simply bumps a thread-local pointer forward (`top += size`) in ~10 CPU instructions with zero global lock contention!',
    company: 'LinkedIn / Citadel'
  },
  {
    id: 'jv-15',
    title: 'Garbage Collection Deep Dive: G1GC, Generational ZGC (< 1ms Pauses) & Escape Analysis',
    description: 'Region-based G1GC, Remembered Sets & Card Tables, ZGC Colored Pointers & Load Barriers, and JIT Scalar Replacement',
    difficulty: 'Advanced',
    sectionGroup: 'JVM Internals, GC & Memory Model',
    analogy: 'Classic GC paused all traffic in the city to clean the streets; Generational ZGC uses smart street sweepers (Load Barriers + Colored Pointers) that clean and relocate objects while traffic keeps moving at 100 mph (< 0.5ms pauses).',
    keyTerm: 'ZGC',
    secondaryTerm: 'EscapeAnalysis',
    syntaxExample: 'java -XX:+UseZGC -XX:+ZGenerational -Xms16g -Xmx16g -jar order-engine.jar',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Collector: Generational ZGC (-XX:+UseZGC -XX:+ZGenerational)");
        System.out.println("Max STW Pause: 0.18ms across 64GB Heap | JIT Escape Analysis: Scalar Replacement Active");
    }
}`,
    realTimeWhereUsed: 'Low-latency trading gateways, Elasticsearch clusters, and real-time bidding (RTB) engines run on Java 21 Generational ZGC to keep P99.9 latency under 2 milliseconds.',
    exercise1: {
      title: 'Enabling Sub-Millisecond ZGC',
      scenario: 'Pass the JVM flag that activates the Z Garbage Collector for sub-millisecond pause times:',
      codeBefore: 'java ',
      answer: '-XX:+UseZGC',
      acceptedAnswers: ['-XX:+UseZGC', 'UseZGC'],
      codeAfter: ' -XX:+ZGenerational -jar app.jar',
      hint: '-XX:+Use followed by ZGC.',
      explanation: '-XX:+UseZGC enables the scalable low-latency Z Garbage Collector with sub-millisecond Stop-The-World pauses.'
    },
    exercise2: {
      title: 'JIT Optimization Eliminating Heap Allocation',
      scenario: 'What C2 JIT optimization explodes a non-escaping local object into individual primitive CPU registers/stack variables?',
      codeBefore: '// JIT Optimization after Escape Analysis: ',
      answer: 'Scalar Replacement',
      acceptedAnswers: ['Scalar Replacement', 'ScalarReplacement'],
      codeAfter: ' (Zero Heap Allocation)',
      hint: 'Two words: Scalar followed by Replacement.',
      explanation: 'When Escape Analysis proves an object never leaves the method, Scalar Replacement keeps its fields in CPU registers/stack with 0 GC pressure.'
    },
    exercise3: {
      title: 'Default Region-Based Collector',
      scenario: 'Which Garbage Collector has been the default in OpenJDK since Java 9 (dividing the heap into equal-sized regions)?',
      codeBefore: '// Default Collector Flag: -XX:+Use',
      answer: 'G1GC',
      acceptedAnswers: ['G1GC', 'G1'],
      codeAfter: '',
      hint: 'Garbage-First collector (4 characters).',
      explanation: 'G1GC (Garbage-First) divides the heap into regions and prioritizes collecting regions with the most garbage first to meet pause-time goals.'
    },
    interviewQ: 'How does ZGC compact and relocate objects in memory concurrently while application threads are actively reading those objects?',
    interviewA: 'ZGC uses **Colored Pointers** (metadata bits stored in the 64-bit object reference) and **Load Barriers**. If an application thread dereferences an object that is mid-relocation, the JIT-injected Load Barrier intercepts the read, remaps the pointer to the new address immediately, and returns the valid object.',
    company: 'Netflix / Jane Street'
  },
  {
    id: 'jv-16',
    title: 'Java Memory Model (JMM), volatile, synchronized, Monitors & Happening-Before',
    description: 'CPU L1/L2 cache visibility, instruction reordering barriers, Object header Mark Word (biased/thin/inflated locks), and Safe Double-Checked Locking',
    difficulty: 'Advanced',
    sectionGroup: 'JVM Internals, GC & Memory Model',
    analogy: 'Without `volatile`, Thread A writes notes on its private scratchpad (CPU L1 cache) while Thread B reads an outdated bulletin board; `volatile` forces every write straight to the shared bulletin board and blocks instruction reordering.',
    keyTerm: 'volatile',
    secondaryTerm: 'synchronized',
    syntaxExample: 'private static volatile Registry instance; // Prevents partially-constructed reordering',
    codeSnippet: `public class Main {
    private static volatile boolean running = true;
    public static void main(String[] args) {
        System.out.println("JMM Happens-Before Barrier: volatile write flushes CPU store buffer -> visible to all cores");
        System.out.println("Active Flag State: running=" + running);
    }
}`,
    realTimeWhereUsed: 'Graceful shutdown flags, lock-free state machines, and thread-safe lazy singletons (`private static volatile`) rely on JMM happens-before memory barriers.',
    exercise1: {
      title: 'Cross-Thread Memory Visibility Keyword',
      scenario: 'Add the Java modifier that guarantees reads/writes to shutdownRequested are immediately visible across all CPU cores and prevents instruction reordering:',
      codeBefore: 'private ',
      answer: 'volatile',
      acceptedAnswers: ['volatile'],
      codeAfter: ' boolean shutdownRequested = false;',
      hint: '8-letter keyword enforcing JMM visibility and memory barriers.',
      explanation: 'volatile inserts LoadLoad/LoadStore/StoreStore/StoreLoad memory barriers and establishes a happens-before relationship.'
    },
    exercise2: {
      title: 'Intrinsic Monitor Lock Block',
      scenario: 'Acquire an intrinsic monitor lock on the dedicated private lockObject before mutating shared state:',
      codeBefore: '',
      answer: 'synchronized',
      acceptedAnswers: ['synchronized'],
      codeAfter: ' (lockObject) {\n  balance += delta;\n}',
      hint: '12-letter keyword for intrinsic monitor locking.',
      explanation: 'synchronized acquires the object monitor on entry and flushes all modified variables to main memory on exit.'
    },
    exercise3: {
      title: 'Atomic Increment vs volatile++',
      scenario: 'Since volatile count++ is NOT atomic (read-modify-write race), which class in java.util.concurrent.atomic provides lock-free atomic 64-bit increments?',
      codeBefore: 'private final ',
      answer: 'AtomicLong',
      acceptedAnswers: ['AtomicLong', 'LongAdder'],
      codeAfter: ' requestCounter = new AtomicLong(0);',
      hint: 'Atomic followed by Long.',
      explanation: 'AtomicLong uses hardware Compare-And-Swap (CAS) instructions (LOCK CMPXCHG) for atomic read-modify-write updates.'
    },
    interviewQ: 'Why does the Double-Checked Locking Singleton pattern require the `instance` field to be declared `volatile` in Java?',
    interviewA: '`instance = new Singleton()` is 3 steps: (1) allocate memory, (2) run constructor, (3) assign pointer to `instance`. Without `volatile`, the JIT/CPU can reorder steps (2) and (3), causing another thread to see a non-null `instance` whose constructor has not finished running!',
    company: 'Google / Goldman Sachs'
  },
  {
    id: 'jv-17',
    title: 'java.util.concurrent Locks: ReentrantLock, ReadWriteLock, StampedLock & AQS',
    description: 'AbstractQueuedSynchronizer (AQS) CLH queue, tryLock(timeout), fair vs non-fair locks, and StampedLock optimistic reads',
    difficulty: 'Advanced',
    sectionGroup: 'Concurrency, Virtual Threads & NIO',
    analogy: '`StampedLock` optimistic reading is like reading a menu through a restaurant window without locking the door: afterwards you check `validate(stamp)` to verify nobody changed the menu while you were looking.',
    keyTerm: 'StampedLock',
    secondaryTerm: 'ReentrantLock',
    syntaxExample: 'long stamp = lock.tryOptimisticRead(); double x = curX; if (!lock.validate(stamp)) { ... }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("StampedLock.tryOptimisticRead(): Zero CAS contention on read-heavy market price cache");
        System.out.println("lock.validate(stamp) == true -> Completed in 4ns");
    }
}`,
    realTimeWhereUsed: 'Order-book quote caches, rate-limiter buckets, and connection pools use `ReentrantLock` (with timed `tryLock`) and `StampedLock` optimistic reads.',
    exercise1: {
      title: 'Guaranteed Lock Release Idiom',
      scenario: 'In which block MUST ReentrantLock.unlock() always be placed so an exception never leaves the lock permanently held?',
      codeBefore: 'lock.lock();\ntry {\n  process();\n} ',
      answer: 'finally',
      acceptedAnswers: ['finally'],
      codeAfter: ' {\n  lock.unlock();\n}',
      hint: '7-letter block that always executes after try.',
      explanation: 'Unlike synchronized, ReentrantLock does not unlock automatically on exception; unlock() must always be inside finally.'
    },
    exercise2: {
      title: 'Optimistic Read Validation on StampedLock',
      scenario: 'Verify that no writer acquired the StampedLock while reading optimistic state:',
      codeBefore: 'long stamp = sl.tryOptimisticRead();\nint val = sharedState;\nif (!sl.',
      answer: 'validate',
      acceptedAnswers: ['validate'],
      codeAfter: '(stamp)) {\n  stamp = sl.readLock();\n  try { val = sharedState; } finally { sl.unlockRead(stamp); }\n}',
      hint: '8-letter method checking if the stamp is still valid.',
      explanation: 'sl.validate(stamp) returns true if no write lock was acquired since tryOptimisticRead() issued the stamp.'
    },
    exercise3: {
      title: 'Coordinating N Worker Threads',
      scenario: 'Which synchronizer in java.util.concurrent lets a main thread wait until N worker tasks call .countDown()?',
      codeBefore: '',
      answer: 'CountDownLatch',
      acceptedAnswers: ['CountDownLatch'],
      codeAfter: ' latch = new CountDownLatch(3);',
      hint: 'CountDown followed by Latch.',
      explanation: 'CountDownLatch blocks calling threads at .await() until the counter reaches zero via .countDown().'
    },
    interviewQ: 'When should you prefer `StampedLock` over `ReentrantReadWriteLock` in a 99% read / 1% write workload?',
    interviewA: '`ReentrantReadWriteLock` still performs an atomic CAS write to the AQS state counter on every `readLock()`, causing CPU cache-line bouncing across cores. `StampedLock.tryOptimisticRead()` performs a pure volatile read with zero CAS mutations!',
    company: 'Citadel / Uber'
  },
  {
    id: 'jv-18',
    title: 'Concurrent Collections: ConcurrentHashMap CAS, LongAdder & BlockingQueues',
    description: 'Per-bucket CAS + synchronized head locking in ConcurrentHashMap, Striped64 LongAdder vs AtomicLong, and ArrayBlockingQueue',
    difficulty: 'Advanced',
    sectionGroup: 'Concurrency, Virtual Threads & NIO',
    analogy: '`AtomicLong` is a single ticket booth where 64 threads fight over 1 counter; `LongAdder` opens a separate ticket booth (`Cell[]`) per CPU core and sums them up only when you ask for `.sum()`.',
    keyTerm: 'ConcurrentHashMap',
    secondaryTerm: 'LongAdder',
    syntaxExample: 'ConcurrentHashMap<String, LongAdder> metrics = new ConcurrentHashMap<>();',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("ConcurrentHashMap + LongAdder: 64-core lock-free telemetry counter");
        System.out.println("Throughput: 48,000,000 increments/sec (Zero global lock contention)");
    }
}`,
    realTimeWhereUsed: 'Prometheus/Micrometer JVM metrics registries, API rate limiters, and producer-consumer worker queues (`ArrayBlockingQueue`) in high-scale Java backends.',
    exercise1: {
      title: 'High-Contention Striped Counter',
      scenario: 'Use the java.util.concurrent.atomic class that outperforms AtomicLong under high multi-core write contention by striping updates across Cell[]:',
      codeBefore: '',
      answer: 'LongAdder',
      acceptedAnswers: ['LongAdder'],
      codeAfter: ' counter = new LongAdder();\ncounter.increment();',
      hint: 'Long followed by Adder.',
      explanation: 'LongAdder distributes increments across an array of padded Cell counters to eliminate CAS retry storms.'
    },
    exercise2: {
      title: 'Bounded Producer-Consumer Queue',
      scenario: 'Create a bounded FIFO BlockingQueue backed by a fixed-size array of 1024 slots to enforce backpressure:',
      codeBefore: 'BlockingQueue<Task> queue = new ',
      answer: 'ArrayBlockingQueue',
      acceptedAnswers: ['ArrayBlockingQueue', 'ArrayBlockingQueue<>'],
      codeAfter: '<>(1024);',
      hint: 'Array followed by BlockingQueue.',
      explanation: 'ArrayBlockingQueue(capacity) bounds memory usage and blocks or rejects producers when consumers fall behind.'
    },
    exercise3: {
      title: 'Why ConcurrentHashMap Forbids Nulls',
      scenario: 'Does ConcurrentHashMap allow null keys or null values? Type false or true:',
      codeBefore: 'boolean allowsNulls = ',
      answer: 'false',
      acceptedAnswers: ['false'],
      codeAfter: '; // Throws NullPointerException on null key/value',
      hint: 'Boolean literal for no.',
      explanation: 'In a concurrent map, if map.get(k) returned null, you could not tell if the key was absent or mapped to null without a race condition on map.containsKey(k).'
    },
    interviewQ: 'How did `ConcurrentHashMap` evolve from Java 7 to Java 8+ to reduce memory footprint and improve concurrency?',
    interviewA: 'Java 7 used a fixed array of 16 `Segment` locks. Java 8+ removed `Segment` entirely: inserting into an empty bucket uses a lock-free `CAS` operation, and collisions lock only the first node (`synchronized (f)`) of that specific hash bucket (with Red-Black Tree conversion at 8 nodes).',
    company: 'Amazon / Netflix'
  },
  {
    id: 'jv-19',
    title: 'ExecutorService, ThreadPoolExecutor Sizing & CompletableFuture Pipelines',
    description: 'CorePoolSize vs MaxPoolSize vs Bounded Queue, RejectedExecutionHandler, and non-blocking CompletableFuture (supplyAsync, thenCompose, allOf)',
    difficulty: 'Advanced',
    sectionGroup: 'Concurrency, Virtual Threads & NIO',
    analogy: '`CompletableFuture` is a reactive DAG pipeline: fetch User Profile and Fraud Score in parallel (`allOf`), then compose Payment Authorization (`thenCompose`) without blocking a single thread.',
    keyTerm: 'CompletableFuture',
    secondaryTerm: 'thenCompose',
    syntaxExample: 'CompletableFuture.supplyAsync(() -> fetchUser(id), ioPool).thenCompose(this::loadOrders);',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("CompletableFuture.allOf(userFuture, creditFuture, inventoryFuture) -> Completed in 14ms");
        System.out.println("Parallel fan-out reduced sequential 42ms latency by 66%!");
    }
}`,
    realTimeWhereUsed: 'BFF (Backend-for-Frontend) aggregators at Netflix and Flipkart fan out 5–10 microservice calls concurrently via `CompletableFuture.allOf` with strict `.orTimeout(250, TimeUnit.MILLISECONDS)`.',
    exercise1: {
      title: 'Flattening Dependent Async Futures',
      scenario: 'Chain a function that returns another CompletableFuture<Order> without creating a nested CompletableFuture<CompletableFuture<Order>>:',
      codeBefore: 'CompletableFuture<Order> pipeline = fetchUserAsync(id).',
      answer: 'thenCompose',
      acceptedAnswers: ['thenCompose', 'thenComposeAsync'],
      codeAfter: '(user -> fetchLatestOrderAsync(user.id()));',
      hint: 'then followed by Compose (like flatMap for Futures).',
      explanation: 'thenApply() is like Stream.map(); thenCompose() is like Stream.flatMap() for chaining dependent asynchronous futures.'
    },
    exercise2: {
      title: 'Waiting for Parallel Futures to Complete',
      scenario: 'Use the static CompletableFuture combinator that completes when all provided futures finish:',
      codeBefore: 'CompletableFuture<Void> all = CompletableFuture.',
      answer: 'allOf',
      acceptedAnswers: ['allOf'],
      codeAfter: '(f1, f2, f3);',
      hint: 'all followed by Of.',
      explanation: 'CompletableFuture.allOf(f1, f2, f3) runs independent tasks in parallel and settles when all complete.'
    },
    exercise3: {
      title: 'Enforcing Async Timeout Guard',
      scenario: 'Attach a Java 9+ timeout to a CompletableFuture so it fails with TimeoutException after 200ms:',
      codeBefore: 'future.',
      answer: 'orTimeout',
      acceptedAnswers: ['orTimeout', 'completeOnTimeout'],
      codeAfter: '(200, TimeUnit.MILLISECONDS);',
      hint: 'or followed by Timeout.',
      explanation: 'orTimeout() prevents hung downstream RPCs from stalling async pipelines indefinitely.'
    },
    interviewQ: 'Why does `Executors.newFixedThreadPool(n)` or `Executors.newCachedThreadPool()` cause OutOfMemoryError in production under traffic spikes?',
    interviewA: '`newFixedThreadPool` uses an unbounded `LinkedBlockingQueue` (`Integer.MAX_VALUE` capacity) that fills up RAM when downstream slows down; `newCachedThreadPool` spawns an unbounded number of OS threads (`Integer.MAX_VALUE`). Always construct `new ThreadPoolExecutor(...)` explicitly with a bounded queue and a `RejectedExecutionHandler`.',
    company: 'Uber / Flipkart'
  },
  {
    id: 'jv-20',
    title: 'Java 21 Virtual Threads (Project Loom), Carrier Threads & Structured Concurrency',
    description: 'Mounting millions of 1KB Virtual Threads onto ForkJoinPool OS Carrier Threads, continuations unmount on blocking I/O, and pinning hazards',
    difficulty: 'Expert',
    sectionGroup: 'Concurrency, Virtual Threads & NIO',
    analogy: 'Platform OS threads are expensive delivery trucks (1MB stack each) that sit idle in parking lots waiting for warehouse doors (I/O); Java 21 Virtual Threads are lightweight couriers who hop off the truck the instant a door is closed so the truck immediately serves another courier.',
    keyTerm: 'newVirtualThreadPerTaskExecutor',
    secondaryTerm: 'Thread.ofVirtual',
    syntaxExample: 'try (var executor = Executors.newVirtualThreadPerTaskExecutor()) { executor.submit(() -> handle(req)); }',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java 21 Project Loom: Spawned 100,000 concurrent Virtual Threads on 8 OS Carrier Threads");
        System.out.println("Blocking Socket/JDBC I/O unmounts continuation in < 200ns -> Throughput: 95,000 req/sec");
    }
}`,
    realTimeWhereUsed: 'Spring Boot 3.2+ (`spring.threads.virtual.enabled=true`), Quarkus, and Helidon Níma handle 100,000+ concurrent blocking HTTP/JDBC requests with simple synchronous code and reactive-level throughput.',
    exercise1: {
      title: 'Creating a Virtual-Thread-Per-Task Executor',
      scenario: 'Use java.util.concurrent.Executors in Java 21 to create an ExecutorService that spawns a new Virtual Thread for each task:',
      codeBefore: 'try (var exec = Executors.',
      answer: 'newVirtualThreadPerTaskExecutor',
      acceptedAnswers: ['newVirtualThreadPerTaskExecutor'],
      codeAfter: '()) {\n  exec.submit(() -> processOrder());\n}',
      hint: 'newVirtualThreadPerTask followed by Executor.',
      explanation: 'Virtual threads are cheap enough (~1KB heap stack chunk) to create a fresh virtual thread per incoming request without pooling.'
    },
    exercise2: {
      title: 'Starting a Named Virtual Thread',
      scenario: 'Use the Java 21 Thread builder factory to create and start a virtual thread:',
      codeBefore: 'Thread vt = Thread.',
      answer: 'ofVirtual',
      acceptedAnswers: ['ofVirtual', 'startVirtualThread'],
      codeAfter: '().name("worker-", 0).start(runnable);',
      hint: 'of followed by Virtual.',
      explanation: 'Thread.ofVirtual() configures virtual thread builders that mount on the ForkJoinPool carrier pool.'
    },
    exercise3: {
      title: 'Preventing Carrier Thread Pinning',
      scenario: 'When performing blocking I/O inside a lock on Java 21, replace synchronized blocks with which lock class so the Virtual Thread can unmount cleanly?',
      codeBefore: 'private final ',
      answer: 'ReentrantLock',
      acceptedAnswers: ['ReentrantLock'],
      codeAfter: ' ioLock = new ReentrantLock();',
      hint: 'Reentrant followed by Lock.',
      explanation: 'In Java 21, blocking inside a synchronized block pins the Virtual Thread to its OS carrier thread; ReentrantLock allows clean unmounting.'
    },
    interviewQ: 'Why should you NEVER pool Java 21 Virtual Threads in a fixed thread pool of size 200?',
    interviewA: 'Thread pools exist only because OS platform threads cost ~1MB of stack RAM and thousands of CPU cycles to create. Virtual threads are tiny heap objects designed for short, single-task lifetimes—pooling them limits concurrency to 200 instead of 100,000+. Use Semaphores to rate-limit downstream DB concurrency instead.',
    company: 'Oracle / Netflix'
  },
  {
    id: 'jv-21',
    title: 'Java NIO.2, Non-Blocking Channels, Selectors, Zero-Copy sendfile & Netty',
    description: 'SocketChannel, Selector epoll event loop, FileChannel.transferTo (DMA sendfile), and Netty EventLoopGroup & ByteBuf',
    difficulty: 'Advanced',
    sectionGroup: 'Concurrency, Virtual Threads & NIO',
    analogy: 'Standard copy reads a file from Disk -> Kernel Page Cache -> JVM Heap -> Socket Buffer -> NIC (4 copies, 4 context switches); `FileChannel.transferTo()` tells the OS kernel to DMA-stream directly from Page Cache to the NIC in 0 CPU copies.',
    keyTerm: 'transferTo',
    secondaryTerm: 'Selector',
    syntaxExample: 'fileChannel.transferTo(0, fileChannel.size(), socketChannel); // Zero-Copy OS sendfile()',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("FileChannel.transferTo(): Zero-Copy DMA transfer from Linux Page Cache -> NIC Ring Buffer");
        System.out.println("Eliminated 2 user-space memory copies & 2 context switches (10Gbps line rate)");
    }
}`,
    realTimeWhereUsed: 'Apache Kafka uses `FileChannel.transferTo` to stream multi-gigabyte partition segments to consumers at wire speed without touching the JVM Heap; gRPC-Java and Cassandra run on Netty NIO event loops.',
    exercise1: {
      title: 'Zero-Copy File-to-Socket Transfer',
      scenario: 'Call the FileChannel method that delegates to the OS sendfile() syscall for zero-copy streaming:',
      codeBefore: 'long sent = fileChannel.',
      answer: 'transferTo',
      acceptedAnswers: ['transferTo'],
      codeAfter: '(position, count, socketChannel);',
      hint: 'transfer followed by To.',
      explanation: 'FileChannel.transferTo() transfers bytes directly from the filesystem page cache to the target channel via DMA.'
    },
    exercise2: {
      title: 'Multiplexing Non-Blocking Sockets',
      scenario: 'Open a Java NIO multiplexer capable of monitoring thousands of non-blocking SocketChannels on a single thread:',
      codeBefore: 'Selector selector = Selector.',
      answer: 'open',
      acceptedAnswers: ['open'],
      codeAfter: '();',
      hint: '4-letter static factory method.',
      explanation: 'Selector.open() creates an OS-backed I/O multiplexer (epoll on Linux, kqueue on macOS).'
    },
    exercise3: {
      title: 'Enabling Non-Blocking Channel Mode',
      scenario: 'Configure a SocketChannel to be non-blocking before registering it with a Selector:',
      codeBefore: 'channel.',
      answer: 'configureBlocking',
      acceptedAnswers: ['configureBlocking'],
      codeAfter: '(false);',
      hint: 'configure followed by Blocking.',
      explanation: 'A SelectableChannel must be in non-blocking mode (configureBlocking(false)) before registering with a Selector.'
    },
    interviewQ: 'Why is Apache Kafka able to serve gigabytes of message logs per second without suffering from JVM Garbage Collection pauses?',
    interviewA: 'Kafka stores messages in the Linux OS Page Cache and uses `FileChannel.transferTo()` (`sendfile` syscall) to stream bytes directly from the kernel Page Cache to the network card via DMA—the payload bytes never enter the JVM Heap at all!',
    company: 'Confluent / LinkedIn'
  },
  {
    id: 'jv-22',
    title: 'Reflection, Dynamic Proxies, Annotations, MethodHandles & Bytecode Weaving',
    description: '@Retention(RUNTIME), java.lang.reflect.Proxy, MethodHandles.Lookup, and how Spring AOP & Mockito generate runtime proxies',
    difficulty: 'Advanced',
    sectionGroup: 'Enterprise Java, Spring & Capstone',
    analogy: 'A `Dynamic Proxy` is an executive assistant who intercepts every phone call to a service (`@Transactional`, `@Cacheable`), starts a database transaction, forwards the call to the real target object, and commits on return.',
    keyTerm: 'Proxy.newProxyInstance',
    secondaryTerm: 'RetentionPolicy.RUNTIME',
    syntaxExample: 'Proxy.newProxyInstance(loader, new Class<?>[]{Service.class}, invocationHandler);',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("[AOP Proxy Intercept] Starting @Transactional boundary for OrderService.placeOrder()");
        System.out.println("[Target Method] Order #9910 persisted -> [AOP Proxy] Transaction COMMITTED in 2.1ms");
    }
}`,
    realTimeWhereUsed: 'Spring `@Transactional`, `@Async`, `@Retryable`, Hibernate lazy-loading entity proxies, and Feign/Retrofit declarative HTTP clients are built on JDK Dynamic Proxies and ByteBuddy bytecode generation.',
    exercise1: {
      title: 'Preserving Annotations for Runtime Inspection',
      scenario: 'Specify the RetentionPolicy so a custom @RateLimited annotation remains visible via reflection at runtime:',
      codeBefore: '@Retention(RetentionPolicy.',
      answer: 'RUNTIME',
      acceptedAnswers: ['RUNTIME'],
      codeAfter: ')\npublic @interface RateLimited { int qps() default 100; }',
      hint: '7-letter uppercase constant for runtime retention.',
      explanation: 'Without @Retention(RetentionPolicy.RUNTIME), annotations default to CLASS retention and are invisible to runtime reflection.'
    },
    exercise2: {
      title: 'Creating a JDK Dynamic Proxy',
      scenario: 'Use java.lang.reflect.Proxy to synthesize a runtime proxy implementing the PaymentApi interface:',
      codeBefore: 'PaymentApi proxy = (PaymentApi) Proxy.',
      answer: 'newProxyInstance',
      acceptedAnswers: ['newProxyInstance'],
      codeAfter: '(cl, new Class<?>[]{PaymentApi.class}, handler);',
      hint: 'newProxy followed by Instance.',
      explanation: 'Proxy.newProxyInstance() generates a runtime proxy class that dispatches all interface calls through InvocationHandler.invoke().'
    },
    exercise3: {
      title: 'High-Performance Reflection Alternative',
      scenario: 'Which Java 7+ API in java.lang.invoke provides JVM-inlinable method invocation faster than legacy Method.invoke()?',
      codeBefore: 'MethodHandles.Lookup lookup = ',
      answer: 'MethodHandles',
      acceptedAnswers: ['MethodHandles', 'MethodHandle'],
      codeAfter: '.lookup();',
      hint: 'Method followed by Handles.',
      explanation: 'MethodHandle checks access permissions once at lookup creation time rather than on every invocation, allowing JIT inlining.'
    },
    interviewQ: 'Why does calling a `@Transactional` method from another method inside the EXACT SAME Spring bean (`this.saveOrder()`) bypass the transaction completely?',
    interviewA: 'Spring `@Transactional` works by wrapping the bean in an external Dynamic Proxy. External callers hit the Proxy first, which starts the transaction. Internal calls via `this.saveOrder()` invoke the raw target object directly, bypassing the Proxy wrapper entirely!',
    company: 'VMware / Amazon'
  },
  {
    id: 'jv-23',
    title: 'JDBC Connection Pooling (HikariCP), JPA/Hibernate N+1 Mitigation & Transactions',
    description: 'Why HikariCP ConcurrentBag achieves sub-microsecond connection borrow, PreparedStatement SQLi immunity, Batch Inserts, and JOIN FETCH for N+1 queries',
    difficulty: 'Advanced',
    sectionGroup: 'Enterprise Java, Spring & Capstone',
    analogy: 'The `N+1 Query Problem` is walking to the grocery store 1 time to read a shopping list of 50 items, and then making 50 separate round-trip drives to buy 1 item at a time instead of loading all 50 in one `JOIN FETCH` trip.',
    keyTerm: 'JOIN FETCH',
    secondaryTerm: 'PreparedStatement',
    syntaxExample: '@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.CustomerId = :cid")',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("HikariCP Pool: Connection borrowed via ThreadLocal ConcurrentBag in 0.4 microseconds");
        System.out.println("JPA Query Optimization: JOIN FETCH collapsed 101 N+1 queries into 1 indexed SQL JOIN!");
    }
}`,
    realTimeWhereUsed: 'Every production Java microservice backed by PostgreSQL/MySQL uses HikariCP (sized via `connections = (core_count * 2) + spindle_count`) and `@EntityGraph` / `JOIN FETCH` to prevent database meltdown.',
    exercise1: {
      title: 'Preventing SQL Injection with Parameterized Queries',
      scenario: 'Use the JDBC Connection method that compiles a parameterized SQL statement with ? placeholders:',
      codeBefore: 'PreparedStatement ps = conn.',
      answer: 'prepareStatement',
      acceptedAnswers: ['prepareStatement'],
      codeAfter: '("SELECT * FROM users WHERE email = ?");',
      hint: 'prepare followed by Statement.',
      explanation: 'PreparedStatement sends SQL structure and bind parameters separately over the wire protocol, making SQL injection impossible.'
    },
    exercise2: {
      title: 'Eliminating Hibernate N+1 Queries',
      scenario: 'Add the JPQL clause that eagerly loads child items in the same single SQL query:',
      codeBefore: 'SELECT a FROM Author a ',
      answer: 'JOIN FETCH',
      acceptedAnswers: ['JOIN FETCH', 'LEFT JOIN FETCH'],
      codeAfter: ' a.books WHERE a.active = true',
      hint: 'Two words: JOIN followed by FETCH.',
      explanation: 'JOIN FETCH instructs JPA/Hibernate to populate the associated collection in one SQL JOIN instead of firing N lazy queries.'
    },
    exercise3: {
      title: 'High-Throughput JDBC Batch Execution',
      scenario: 'After calling ps.addBatch() in a loop, invoke the method that sends all batched statements to the DB in one network round-trip:',
      codeBefore: 'int[] affectedRows = ps.',
      answer: 'executeBatch',
      acceptedAnswers: ['executeBatch'],
      codeAfter: '();',
      hint: 'execute followed by Batch.',
      explanation: 'executeBatch() combined with reWriteBatchedInserts=true collapses thousands of inserts into a single multi-row packet.'
    },
    interviewQ: 'Why does HikariCP recommend keeping database connection pools small (e.g., 10–20 connections per instance) rather than 200+ connections?',
    interviewA: 'A PostgreSQL CPU core can only execute 1 active query thread at a time; having 200 active connections causes massive OS kernel context-switching, spinlock contention, and buffer-pool cache thrashing. A smaller pool queues requests in fast JVM memory (`ConcurrentBag`) and keeps DB CPU efficiency at peak.',
    company: 'Stripe / Uber'
  },
  {
    id: 'jv-24',
    title: 'Spring Boot 3 Internals: IoC Container, Bean Lifecycle, AutoConfiguration & GraalVM',
    description: 'ApplicationContext startup, BeanPostProcessor proxy weaving, @ConditionalOnClass auto-configuration, and GraalVM Native Image AOT compilation',
    difficulty: 'Expert',
    sectionGroup: 'Enterprise Java, Spring & Capstone',
    analogy: 'The Spring IoC Container is an automated semiconductor fab: you declare `@Service` and `@Repository` blueprints, and at startup the container wires the dependency graph in topological order and wraps beans in security/transaction proxies.',
    keyTerm: 'BeanPostProcessor',
    secondaryTerm: '@Transactional',
    syntaxExample: '@SpringBootApplication // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Spring Boot 3.3 ApplicationContext: Wired 48 constructor-injected Singleton Beans");
        System.out.println("BeanPostProcessor wove @Transactional & Micrometer Observation proxies in 38ms");
    }
}`,
    realTimeWhereUsed: 'Enterprise microservices at Netflix, Uber, JPMorgan, and Walmart run on Spring Boot 3 with Constructor Injection, Actuator readiness probes, and GraalVM AOT native images for serverless scale-to-zero.',
    exercise1: {
      title: 'Constructor Dependency Injection Best Practice',
      scenario: 'Mark the service fields as immutable so Spring injects them through the canonical constructor without @Autowired:',
      codeBefore: '@Service\npublic class BillingService {\n  private ',
      answer: 'final',
      acceptedAnswers: ['final'],
      codeAfter: ' LedgerRepository ledgerRepo;\n  public BillingService(LedgerRepository ledgerRepo) { this.ledgerRepo = ledgerRepo; }\n}',
      hint: '5-letter keyword making injected dependencies immutable and non-null.',
      explanation: 'Constructor injection with private final fields guarantees the bean cannot be instantiated in an incomplete state and makes unit testing trivial without reflection.'
    },
    exercise2: {
      title: 'Spring Proxy Weaving Lifecycle Hook',
      scenario: 'Which Spring container extension interface intercepts beans before and after initialization to wrap them in AOP proxies?',
      codeBefore: 'public class TracingWeaver implements ',
      answer: 'BeanPostProcessor',
      acceptedAnswers: ['BeanPostProcessor'],
      codeAfter: ' {}',
      hint: 'BeanPost followed by Processor.',
      explanation: 'BeanPostProcessor.postProcessAfterInitialization() is where Spring wraps beans in @Transactional, @Async, and @Secured proxies.'
    },
    exercise3: {
      title: 'Conditional Auto-Configuration Guard',
      scenario: 'Use the Spring Boot annotation that activates a configuration bean only when DataSource.class is present on the classpath:',
      codeBefore: '@Configuration\n@',
      answer: 'ConditionalOnClass',
      acceptedAnswers: ['ConditionalOnClass', '@ConditionalOnClass'],
      codeAfter: '(DataSource.class)\npublic class JdbcAutoConfig {}',
      hint: 'ConditionalOn followed by Class.',
      explanation: 'Spring Boot AutoConfiguration uses @ConditionalOnClass and @ConditionalOnMissingBean to configure infrastructure automatically.'
    },
    interviewQ: 'Why does the Spring team strongly recommend **Constructor Injection** over **Field Injection** (`@Autowired private Foo foo;`)?',
    interviewA: 'Constructor injection allows fields to be `private final` (immutable & thread-safe), fails fast at compile/startup time on circular dependencies, and lets you instantiate the class with `new MyService(mockFoo)` in JUnit tests in 1ms without booting the Spring reflection context.',
    company: 'VMware / JPMorgan Chase'
  },
  {
    id: 'jv-25',
    title: 'Production Java 21 Capstone: High-Throughput Payment Ledger on Virtual Threads & ZGC',
    description: 'End-to-end architecture combining Immutable Records, Sealed Domain Events, Idempotent ConcurrentHashMap, Virtual Threads & Generational ZGC',
    difficulty: 'Expert',
    sectionGroup: 'Enterprise Java, Spring & Capstone',
    analogy: 'Combining every Java 21 superpower into a single financial engine: `record` + `sealed` for zero-bug domain modeling, `Virtual Threads` for 100k concurrent I/O calls, and `Generational ZGC` for sub-millisecond tail latency.',
    keyTerm: 'IdempotentLedger',
    secondaryTerm: 'VirtualThreads+ZGC',
    syntaxExample: 'ledger.processIdempotent(new TransferCommand(txId, fromAcc, toAcc, amountCents));',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("=== JAVA 21 PRODUCTION PAYMENT LEDGER CAPSTONE ===");
        System.out.println("1. Domain Model: record TransferCmd + sealed LedgerEvent (Compile-Time Exhaustive)");
        System.out.println("2. Concurrency: VirtualThreadPerTaskExecutor + Striped ReentrantLock (Deadlock-Free)");
        System.out.println("3. SLA Verified: 125,000 TPS | P99.9 Latency: 1.4ms | Double-Entry Invariant: 0 Drift");
    }
}`,
    realTimeWhereUsed: 'Core banking and real-time payment rails (UPI switches, Stripe Treasury, Adyen Core) combine ordered lock acquisition, idempotency keys, Java 21 Virtual Threads, and Generational ZGC.',
    exercise1: {
      title: 'Deadlock-Free Account Lock Ordering',
      scenario: 'To prevent AB-BA deadlocks when transferring between accountA and accountB, always acquire locks ordered by account ID. Complete the comparison:',
      codeBefore: 'Account first = a.id().',
      answer: 'compareTo',
      acceptedAnswers: ['compareTo'],
      codeAfter: '(b.id()) < 0 ? a : b;',
      hint: 'compare followed by To.',
      explanation: 'Acquiring locks in a global deterministic order (e.g., lexicographical compareTo on account ID) breaks Circular Wait and makes deadlocks mathematically impossible.'
    },
    exercise2: {
      title: 'Idempotent Deduplication Guard',
      scenario: 'Use ConcurrentHashMap to atomically insert an idempotencyKey and return null only if this is the first time seeing the request:',
      codeBefore: 'Receipt existing = processedKeys.',
      answer: 'putIfAbsent',
      acceptedAnswers: ['putIfAbsent', 'computeIfAbsent'],
      codeAfter: '(cmd.idempotencyKey(), pendingReceipt);',
      hint: 'putIf followed by Absent.',
      explanation: 'putIfAbsent() is atomic in ConcurrentHashMap, preventing duplicate charges when mobile clients retry timed-out requests.'
    },
    exercise3: {
      title: 'Exact Financial Decimal Arithmetic',
      scenario: 'When representing currency calculations that require exact decimal rounding in Java, which class in java.math must be used instead of double?',
      codeBefore: '',
      answer: 'BigDecimal',
      acceptedAnswers: ['BigDecimal'],
      codeAfter: ' amount = new BigDecimal("149.99");',
      hint: 'Big followed by Decimal.',
      explanation: 'IEEE-754 double cannot represent 0.10 exactly in binary; BigDecimal (or long minor-unit cents) guarantees zero rounding drift.'
    },
    interviewQ: 'Walk through how you prevent both **Double-Charging** on network retries and **AB-BA Deadlocks** when User A pays User B at the same millisecond User B pays User A.',
    interviewA: 'First, enforce idempotency using an atomic `putIfAbsent` / `ON CONFLICT (idempotency_key) DO NOTHING` check before touching balances. Second, sort the two account IDs (`first = min(A, B)`, `second = max(A, B)`) and acquire locks in that strict ascending order so both threads lock Account A before Account B, eliminating circular wait.',
    company: 'Stripe / Goldman Sachs / Razorpay'
  }
];

export const JAVA_COURSE_MODULES: CourseModule[] = [];
export const JAVA_COURSE_LESSONS: Record<string, LessonContent> = {};

for (let i = 0; i < JAVA_25_SPECS.length; i++) {
  const spec = JAVA_25_SPECS[i];
  const chNum = i + 1;

  JAVA_COURSE_MODULES.push({
    id: spec.id,
    title: spec.title,
    description: spec.description,
    difficulty: spec.difficulty,
    sectionGroup: spec.sectionGroup,
    isLocked: false
  });

  JAVA_COURSE_LESSONS[spec.id] = {
    id: spec.id,
    title: spec.title,
    estimatedReadingTime: '14 mins',
    beginnerSummary: `${spec.title} — ${spec.description}. Includes real-time production context (${spec.realTimeWhereUsed}) and 3 hands-on Java 21 exercises.`,
    realWorldAnalogy: spec.analogy,
    keyTakeaways: [
      `Core Mechanism: ${spec.description}.`,
      `Primary Construct (${spec.keyTerm}): ${spec.syntaxExample}`,
      `Where Used in Real-Time Production: ${spec.realTimeWhereUsed}`
    ],
    syntaxCheatTable: [
      { syntax: spec.keyTerm, description: spec.description, example: spec.syntaxExample },
      { syntax: spec.secondaryTerm, description: `Companion Java 21 construct for ${spec.title}`, example: spec.exercise2.codeBefore + spec.exercise2.answer + spec.exercise2.codeAfter },
      { syntax: 'Real-Time Production Use', description: spec.realTimeWhereUsed.slice(0, 95), example: `Verified at ${spec.company}` },
      { syntax: 'JVM Runtime Invariant', description: 'Type-safe bytecode verification + C2 JIT optimization', example: spec.interviewA.slice(0, 80) }
    ],
    diagramSvg: buildLessonArchitectureSvg(
      'c-java',
      chNum,
      spec.title,
      spec.sectionGroup,
      [spec.keyTerm, spec.secondaryTerm, 'JVM JIT']
    ),
    contentMarkdown: `# ${spec.title}

${spec.description}.

## 1. Plain-English Intuition & JVM Mental Model

${spec.analogy}

- **Primary Java 21 Construct**: \`${spec.keyTerm}\` (\`${spec.syntaxExample}\`)
- **Companion Construct**: \`${spec.secondaryTerm}\`
- **Where This Is Used in Real-Time Production**: ${spec.realTimeWhereUsed}

| Engineering Dimension | Legacy / Naive Java Pattern | Modern Java 21 LTS Production Standard | Real-Time Production Impact |
| :--- | :--- | :--- | :--- |
| **Core Construct** | Verbose boilerplate & unguarded nulls | \`${spec.keyTerm}\` + \`${spec.secondaryTerm}\` | Compile-time safety & clean bytecode |
| **Memory & GC Profile** | Excessive boxing & heap churn | TLAB Escape Analysis, Compact Strings & Generational ZGC | Sub-millisecond P99.9 pause latency |
| **Concurrency Model** | Blocked OS thread pools & coarse locks | Virtual Threads (Project Loom), CAS & StampedLock | 100,000+ concurrent requests per node |
| **Industry Adoption** | Legacy monoliths | **${spec.company}** high-scale backend services | 99.999% uptime SLA |

## 2. Interactive Java 21 Live Code Lab

Click **Try it Yourself →** below to open the popup Java 21 IDE and run this chapter's implementation:

\`\`\`java
${spec.codeSnippet}
\`\`\`

## 3. Deep-Dive: How the HotSpot JVM Executes \`${spec.keyTerm}\`

1. **Bytecode Verification (\`javac\` -> ClassLoader)**: The Java compiler verifies type constraints and emits compact bytecode instructions (\`invokevirtual\`, \`invokedynamic\`, \`monitorenter\`).
2. **Tiered Compilation (Interpreter -> C1 -> C2 JIT)**: Frequently executed code paths are profiled at runtime and compiled into native x86_64/ARM64 machine instructions with method inlining and Escape Analysis.
3. **Production Interview Insight (${spec.company})**:
   - **Question**: *${spec.interviewQ}*
   - **Staff Engineer Answer**: ${spec.interviewA}`,
    fillBlankExercise: {
      prompt: spec.exercise1.scenario,
      codeBefore: spec.exercise1.codeBefore,
      answer: spec.exercise1.answer,
      codeAfter: spec.exercise1.codeAfter,
      hint: spec.exercise1.hint
    },
    mustSolveExercises: [
      {
        id: `${spec.id}-ex-1`,
        title: `Exercise 1: ${spec.exercise1.title}`,
        difficulty: 'Essential',
        scenario: spec.exercise1.scenario,
        codeBefore: spec.exercise1.codeBefore,
        answer: spec.exercise1.answer,
        acceptedAnswers: spec.exercise1.acceptedAnswers,
        codeAfter: spec.exercise1.codeAfter,
        hint: spec.exercise1.hint,
        explanation: spec.exercise1.explanation,
        xp: 50
      },
      {
        id: `${spec.id}-ex-2`,
        title: `Exercise 2: ${spec.exercise2.title}`,
        difficulty: 'Core Practice',
        scenario: spec.exercise2.scenario,
        codeBefore: spec.exercise2.codeBefore,
        answer: spec.exercise2.answer,
        acceptedAnswers: spec.exercise2.acceptedAnswers,
        codeAfter: spec.exercise2.codeAfter,
        hint: spec.exercise2.hint,
        explanation: spec.exercise2.explanation,
        xp: 65
      },
      {
        id: `${spec.id}-ex-3`,
        title: `Exercise 3 (Real-Time Production): ${spec.exercise3.title}`,
        difficulty: 'Mastery Challenge',
        scenario: spec.exercise3.scenario,
        codeBefore: spec.exercise3.codeBefore,
        answer: spec.exercise3.answer,
        acceptedAnswers: spec.exercise3.acceptedAnswers,
        codeAfter: spec.exercise3.codeAfter,
        hint: spec.exercise3.hint,
        explanation: spec.exercise3.explanation,
        xp: 85
      }
    ],
    codingChallenge: {
      title: `Java 21 Live Lab: ${spec.title}`,
      description: `Run and customize this Java 21 implementation for ${spec.title} (${spec.keyTerm}).`,
      language: 'java' as any,
      starterCode: spec.codeSnippet,
      solutionCode: spec.codeSnippet,
      hint: `Test ${spec.keyTerm} and inspect the console output.`
    },
    quizzes: [
      {
        id: `q-${spec.id}-1`,
        question: spec.interviewQ,
        options: [
          spec.interviewA,
          'It disables the JVM bytecode verifier and forces manual pointer arithmetic.',
          'It requires restarting the operating system on every garbage collection cycle.',
          'It only works on 16-bit single-core processors.'
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
        title: `OpenJDK 21 LTS Specification — ${spec.title}`,
        type: 'Documentation',
        authorOrSource: 'Oracle & OpenJDK HotSpot Engineering'
      }
    ]
  };
}

export const JAVA_COURSE: Course = {
  id: 'c-java',
  title: 'Java 21 LTS, JVM Internals & Enterprise Backend Engineering',
  shortTag: 'Java',
  levelTag: '25 Chapters · Start-to-End Java 21, JVM, Virtual Threads & Spring',
  category: Category.JAVA,
  icon: '☕',
  modules: JAVA_COURSE_MODULES
};
