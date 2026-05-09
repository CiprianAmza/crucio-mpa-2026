import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "./dev.db" });
const prisma = new PrismaClient({ adapter });

type Rubric = {
  criteria: { name: string; weight: number; idealPoints: string[] }[];
  keyConcepts: string[];
  redFlags: string[];
};

type ProblemDef = {
  slug: string;
  title: string;
  prompt: string;
  difficulty: number;
  baseElo: number;
  topicSlugs: string[];
  rubric: Rubric;
};

const TOPICS: { slug: string; name: string }[] = [
  { slug: "oop", name: "OOP" },
  { slug: "solid", name: "SOLID" },
  { slug: "concurrency", name: "Concurrency" },
  { slug: "spring", name: "Spring" },
  { slug: "jvm", name: "JVM" },
  { slug: "patterns", name: "Design Patterns" },
  { slug: "collections", name: "Collections" },
  { slug: "streams", name: "Streams API" },
];

const PROBLEMS: ProblemDef[] = [
  {
    slug: "solid-principles",
    title: "Explain the SOLID principles",
    prompt:
      "Explain each of the 5 SOLID principles with a concrete Java example for each. Discuss the trade-offs and when applying them might be over-engineering.",
    difficulty: 2,
    baseElo: 1200,
    topicSlugs: ["solid", "oop"],
    rubric: {
      criteria: [
        { name: "Coverage of all 5 principles", weight: 0.3, idealPoints: ["SRP", "OCP", "LSP", "ISP", "DIP"] },
        { name: "Concrete Java examples", weight: 0.3, idealPoints: ["Compilable Java code", "Idiomatic example per principle"] },
        { name: "Trade-off awareness", weight: 0.2, idealPoints: ["Over-engineering", "When NOT to apply", "Real costs"] },
        { name: "Clarity and structure", weight: 0.2, idealPoints: ["Clear definitions", "Logical order", "Crisp wording"] },
      ],
      keyConcepts: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
      redFlags: ["Inverting LSP and ISP", "Confusing DIP with DI framework", "Missing examples", "Just listing names without depth"],
    },
  },
  {
    slug: "java-equals-hashcode",
    title: "Contract between equals() and hashCode()",
    prompt:
      "Explain the contract between equals() and hashCode() in Java, why violating it breaks HashMap/HashSet, and how to implement them correctly. Include an example for a Money value object.",
    difficulty: 2,
    baseElo: 1150,
    topicSlugs: ["oop", "collections"],
    rubric: {
      criteria: [
        { name: "Contract correctness", weight: 0.35, idealPoints: ["equals consistent ⇒ hashCode equal", "Reflexive/symmetric/transitive", "Stable across calls"] },
        { name: "Hash collection behavior", weight: 0.25, idealPoints: ["HashMap lookup uses hashCode then equals", "Mutable keys break invariants"] },
        { name: "Example implementation", weight: 0.25, idealPoints: ["Objects.hash usage", "Type check via instanceof or getClass", "Final fields preferred"] },
        { name: "Edge cases", weight: 0.15, idealPoints: ["Null fields", "Inheritance pitfalls", "Records auto-generate"] },
      ],
      keyConcepts: ["equals contract", "hashCode contract", "HashMap probing", "Immutability"],
      redFlags: ["Returning constant hashCode", "Asymmetric equals across subclasses", "Using mutable fields in hashCode"],
    },
  },
  {
    slug: "concurrency-volatile-synchronized",
    title: "volatile vs synchronized vs Atomic",
    prompt:
      "Compare volatile, synchronized, and the java.util.concurrent.atomic package. When do you use each? Discuss visibility vs atomicity, the happens-before relationship, and give a counter-example where volatile alone is unsafe.",
    difficulty: 4,
    baseElo: 1500,
    topicSlugs: ["concurrency"],
    rubric: {
      criteria: [
        { name: "Visibility vs atomicity", weight: 0.3, idealPoints: ["volatile gives visibility, not atomicity", "synchronized gives both", "happens-before"] },
        { name: "Atomic package", weight: 0.25, idealPoints: ["CAS-based", "AtomicInteger.incrementAndGet", "LongAdder for high contention"] },
        { name: "Counter-example", weight: 0.25, idealPoints: ["volatile counter++ race", "Read-modify-write needs lock or CAS"] },
        { name: "Trade-offs", weight: 0.2, idealPoints: ["Performance", "Contention", "Memory barriers cost"] },
      ],
      keyConcepts: ["JMM", "happens-before", "CAS", "memory barriers"],
      redFlags: ["Saying volatile is atomic", "Mixing locks and volatile incorrectly", "No counter-example"],
    },
  },
  {
    slug: "spring-bean-scopes",
    title: "Spring Bean scopes & lifecycle",
    prompt:
      "Describe Spring bean scopes (singleton, prototype, request, session). What happens when a singleton injects a prototype? How do you fix scope mismatches? Walk through the lifecycle of a bean from instantiation to destruction.",
    difficulty: 3,
    baseElo: 1300,
    topicSlugs: ["spring"],
    rubric: {
      criteria: [
        { name: "Scope coverage", weight: 0.25, idealPoints: ["singleton default", "prototype, request, session, application, websocket"] },
        { name: "Singleton-prototype trap", weight: 0.3, idealPoints: ["Prototype only created once", "Use ObjectProvider, Provider, lookup-method, or scoped proxy"] },
        { name: "Lifecycle steps", weight: 0.25, idealPoints: ["Instantiation", "Populate properties", "Aware interfaces", "BeanPostProcessors", "InitializingBean / @PostConstruct", "Destroy"] },
        { name: "Practical context", weight: 0.2, idealPoints: ["When prototype matters", "Stateful vs stateless beans"] },
      ],
      keyConcepts: ["IoC container", "scoped proxy", "@PostConstruct", "@PreDestroy", "BeanFactory"],
      redFlags: ["Saying singleton means thread-safe", "Forgetting scope mismatch fix", "No lifecycle hooks"],
    },
  },
  {
    slug: "jvm-gc-overview",
    title: "JVM Garbage Collection — generations & collectors",
    prompt:
      "Explain how the JVM heap is structured (young/old/metaspace) and the generational hypothesis. Compare G1, ZGC, Shenandoah, and Parallel GC. When would you pick each? What metrics would you tune for a low-latency service?",
    difficulty: 4,
    baseElo: 1450,
    topicSlugs: ["jvm"],
    rubric: {
      criteria: [
        { name: "Heap structure", weight: 0.2, idealPoints: ["Eden + Survivor", "Tenured/Old", "Metaspace replaces PermGen"] },
        { name: "Generational hypothesis", weight: 0.15, idealPoints: ["Most objects die young", "Minor vs major GC"] },
        { name: "Collector comparison", weight: 0.4, idealPoints: ["G1 default region-based", "ZGC sub-ms pauses", "Shenandoah concurrent compaction", "Parallel throughput"] },
        { name: "Tuning advice", weight: 0.25, idealPoints: ["MaxGCPauseMillis", "Heap sizing", "GC logs analysis"] },
      ],
      keyConcepts: ["safepoint", "card table", "remembered set", "STW pause"],
      redFlags: ["Confusing PermGen with metaspace", "Saying ZGC is faster in throughput", "No tuning advice"],
    },
  },
  {
    slug: "design-pattern-strategy",
    title: "Strategy pattern — design and Java idioms",
    prompt:
      "Implement the Strategy pattern in Java for a payment processor that supports CreditCard, PayPal, and Crypto. Show how the choice can be configured at runtime. Discuss why it's preferable to a giant switch statement and contrast it with the State pattern.",
    difficulty: 2,
    baseElo: 1200,
    topicSlugs: ["patterns", "oop"],
    rubric: {
      criteria: [
        { name: "Code correctness", weight: 0.35, idealPoints: ["Interface PaymentStrategy", "Three implementations", "Context class injects strategy"] },
        { name: "Runtime selection", weight: 0.2, idealPoints: ["Map<Type, Strategy>", "Spring bean lookup", "Factory"] },
        { name: "Comparison vs switch", weight: 0.25, idealPoints: ["Open/Closed", "Easier testing", "Polymorphism over conditionals"] },
        { name: "Strategy vs State", weight: 0.2, idealPoints: ["Strategy = behavior swap", "State = lifecycle transitions", "Same shape, different intent"] },
      ],
      keyConcepts: ["Open/Closed", "polymorphism", "DI", "behavioral pattern"],
      redFlags: ["Inheritance instead of composition", "Hardcoding strategy choice", "Confusing with Template Method"],
    },
  },
  {
    slug: "streams-collectors-deep",
    title: "Stream API — performance and pitfalls",
    prompt:
      "Discuss when Java Streams are faster, slower, or equal to imperative loops. Cover laziness, parallel streams, common pitfalls (state in lambdas, ordering, infinite streams), and explain how groupingBy with downstream collectors works.",
    difficulty: 3,
    baseElo: 1350,
    topicSlugs: ["streams"],
    rubric: {
      criteria: [
        { name: "Lazy vs eager", weight: 0.2, idealPoints: ["Intermediate vs terminal", "Short-circuiting"] },
        { name: "Parallel streams", weight: 0.25, idealPoints: ["ForkJoinPool common", "Splittable sources", "When NOT to parallelize"] },
        { name: "Pitfalls", weight: 0.3, idealPoints: ["Side effects in lambdas", "forEach ordering", "Infinite streams need limit", "Boxed primitives cost"] },
        { name: "Collectors", weight: 0.25, idealPoints: ["groupingBy + counting/summing", "toMap merge fn", "partitioningBy"] },
      ],
      keyConcepts: ["spliterator", "associativity", "ForkJoin", "downstream collector"],
      redFlags: ["Always use parallel", "Mutating shared state in lambdas", "No mention of cost of boxing"],
    },
  },
  {
    slug: "executor-thread-pool",
    title: "Thread pools — sizing and pitfalls",
    prompt:
      "How do you size a thread pool for CPU-bound vs IO-bound work? Walk through the parameters of ThreadPoolExecutor (core, max, queue, rejection policy). Why is Executors.newFixedThreadPool dangerous in production? What would you use instead?",
    difficulty: 4,
    baseElo: 1500,
    topicSlugs: ["concurrency"],
    rubric: {
      criteria: [
        { name: "Sizing formulas", weight: 0.3, idealPoints: ["CPU-bound ≈ N+1", "IO-bound = N * (1 + W/C)", "Little's law mention"] },
        { name: "Executor params", weight: 0.3, idealPoints: ["core/max/keepAlive", "Bounded queue", "Rejection policies (Abort, Caller, Discard)"] },
        { name: "newFixedThreadPool danger", weight: 0.25, idealPoints: ["Unbounded LinkedBlockingQueue", "OOM under load", "max == core defeats elasticity"] },
        { name: "Alternatives", weight: 0.15, idealPoints: ["Custom ThreadPoolExecutor", "Virtual threads (Loom)", "Reactive"] },
      ],
      keyConcepts: ["bounded queue", "back-pressure", "thread starvation", "virtual threads"],
      redFlags: ["No back-pressure mention", "Says queue is always good", "Missing rejection handling"],
    },
  },
  {
    slug: "transactions-isolation",
    title: "Transaction isolation levels & Spring @Transactional",
    prompt:
      "Compare the SQL isolation levels and the anomalies they prevent (dirty/non-repeatable/phantom/lost updates). How does Spring @Transactional propagate? What happens with a self-call? When do you pick READ_COMMITTED vs SERIALIZABLE?",
    difficulty: 4,
    baseElo: 1500,
    topicSlugs: ["spring"],
    rubric: {
      criteria: [
        { name: "Isolation levels", weight: 0.3, idealPoints: ["READ_UNCOMMITTED..SERIALIZABLE", "Anomaly map per level"] },
        { name: "Propagation", weight: 0.25, idealPoints: ["REQUIRED, REQUIRES_NEW, NESTED, MANDATORY, NEVER"] },
        { name: "Self-invocation pitfall", weight: 0.2, idealPoints: ["Proxy bypassed on this.method()", "Workarounds: AspectJ or self-injection"] },
        { name: "Trade-offs", weight: 0.25, idealPoints: ["Locking cost vs correctness", "MVCC databases", "Optimistic locking"] },
      ],
      keyConcepts: ["AOP proxy", "MVCC", "snapshot isolation", "phantom read"],
      redFlags: ["Says SERIALIZABLE always", "No self-invocation pitfall", "Confusing isolation with propagation"],
    },
  },
  {
    slug: "java-collections-overview",
    title: "Choosing the right Java Collection",
    prompt:
      "You need O(1) get-by-key with insertion-order iteration. You need a thread-safe FIFO queue with back-pressure. You need a sorted set with range queries. Pick the right collection for each and justify Big-O for the main operations.",
    difficulty: 2,
    baseElo: 1200,
    topicSlugs: ["collections"],
    rubric: {
      criteria: [
        { name: "Correct picks", weight: 0.4, idealPoints: ["LinkedHashMap", "ArrayBlockingQueue / LinkedBlockingQueue with bound", "TreeSet / NavigableSet"] },
        { name: "Big-O justification", weight: 0.3, idealPoints: ["Hashing O(1) avg", "TreeSet O(log n)", "Queue offer/poll O(1)"] },
        { name: "Concurrency notes", weight: 0.2, idealPoints: ["ConcurrentHashMap vs Collections.synchronizedMap", "Bounded queues for back-pressure"] },
        { name: "Alternatives discussed", weight: 0.1, idealPoints: ["When to choose ArrayList over LinkedList", "When EnumMap shines"] },
      ],
      keyConcepts: ["amortized analysis", "load factor", "treap/RB tree", "blocking queue"],
      redFlags: ["LinkedList for random access", "Vector or Hashtable suggestions", "No back-pressure awareness"],
    },
  },
  {
    slug: "rest-api-design",
    title: "Designing a clean REST API",
    prompt:
      "Design a REST API for a library system: books, authors, borrowing. Discuss resource modeling, HTTP verbs, status codes, idempotency, pagination, versioning, and error format. What would you do differently in GraphQL or gRPC?",
    difficulty: 3,
    baseElo: 1300,
    topicSlugs: ["spring"],
    rubric: {
      criteria: [
        { name: "Resource modeling", weight: 0.25, idealPoints: ["Nouns not verbs", "Sub-resources for relations", "Plural names"] },
        { name: "HTTP semantics", weight: 0.25, idealPoints: ["GET/POST/PUT/PATCH/DELETE", "Idempotency keys", "Correct status codes"] },
        { name: "Cross-cutting", weight: 0.3, idealPoints: ["Pagination cursor vs offset", "Versioning header vs path", "RFC7807 problem+json"] },
        { name: "Comparison", weight: 0.2, idealPoints: ["GraphQL: shape control", "gRPC: streaming, contract-first", "Trade-offs"] },
      ],
      keyConcepts: ["HATEOAS", "idempotency", "RFC 7807", "ETag"],
      redFlags: ["Verbs in URLs", "Always 200 OK", "No pagination strategy"],
    },
  },
  {
    slug: "spring-aop-explain",
    title: "How Spring AOP works under the hood",
    prompt:
      "Explain how Spring AOP creates proxies (JDK dynamic vs CGLIB), when each is used, and how aspects are weaved. What are the limitations? How does this interact with @Transactional and self-invocation?",
    difficulty: 4,
    baseElo: 1450,
    topicSlugs: ["spring"],
    rubric: {
      criteria: [
        { name: "Proxy mechanism", weight: 0.35, idealPoints: ["JDK proxy needs interface", "CGLIB subclasses", "spring.aop.proxy-target-class"] },
        { name: "Aspects & advice", weight: 0.25, idealPoints: ["@Around / @Before / @After", "Pointcut expressions", "Order"] },
        { name: "Limitations", weight: 0.2, idealPoints: ["No final classes/methods (CGLIB)", "Self-call bypass", "Static methods not advised"] },
        { name: "@Transactional interplay", weight: 0.2, idealPoints: ["Proxy required for tx start", "Self-invocation pitfall"] },
      ],
      keyConcepts: ["dynamic proxy", "bytecode subclassing", "joinpoint", "advice"],
      redFlags: ["Says AspectJ and Spring AOP are the same", "Misses self-invocation pitfall"],
    },
  },
  {
    slug: "exception-handling-philosophy",
    title: "Checked vs unchecked exceptions",
    prompt:
      "When should you use checked vs unchecked exceptions? Argue both sides of the debate. How do you design a clean exception hierarchy for a domain layer? What are the rules around exception translation in Spring DAO?",
    difficulty: 3,
    baseElo: 1300,
    topicSlugs: ["oop", "spring"],
    rubric: {
      criteria: [
        { name: "Checked vs unchecked", weight: 0.3, idealPoints: ["Recoverable vs programming error", "Goetz/Bloch arguments", "Modern preference for unchecked"] },
        { name: "Hierarchy design", weight: 0.25, idealPoints: ["Domain exceptions extend RuntimeException", "Don't expose persistence", "Stable contract"] },
        { name: "Spring DAO translation", weight: 0.25, idealPoints: ["@Repository triggers translation", "DataAccessException hierarchy"] },
        { name: "Best practices", weight: 0.2, idealPoints: ["Don't swallow", "Preserve cause", "Fail fast on invariant violations"] },
      ],
      keyConcepts: ["fail-fast", "exception translation", "domain layer purity"],
      redFlags: ["catch (Exception e) and ignore", "Wrapping every checked into RuntimeException blindly"],
    },
  },
  {
    slug: "garbage-collection-tuning",
    title: "GC tuning for a 99p latency-sensitive service",
    prompt:
      "Your Java service has p99 latency spikes correlated with GC pauses. Walk me through your investigation playbook: what logs/flags you enable, what metrics you measure, what hypotheses you test, and what knobs you turn. How would you decide between G1, ZGC, and tuning vs throwing more memory?",
    difficulty: 5,
    baseElo: 1700,
    topicSlugs: ["jvm"],
    rubric: {
      criteria: [
        { name: "Diagnostics setup", weight: 0.3, idealPoints: ["Xlog:gc*", "GC pause histogram", "Allocation rate", "JFR / Mission Control"] },
        { name: "Hypotheses", weight: 0.25, idealPoints: ["Allocation rate too high", "Premature promotion", "Humongous objects (G1)", "STW from full GC"] },
        { name: "Knob choice", weight: 0.25, idealPoints: ["MaxGCPauseMillis", "G1HeapRegionSize", "InitiatingHeapOccupancyPercent", "ZGC for ms-level"] },
        { name: "Decision framing", weight: 0.2, idealPoints: ["Latency vs throughput trade", "When to switch collectors", "Memory cost vs latency win"] },
      ],
      keyConcepts: ["GC pause distribution", "allocation profiling", "humongous regions", "concurrent marking"],
      redFlags: ["Just bumping heap", "No measurement plan", "Picking ZGC blindly"],
    },
  },
  {
    slug: "kafka-vs-rabbitmq",
    title: "Kafka vs RabbitMQ — when to choose what",
    prompt:
      "Compare Apache Kafka and RabbitMQ in terms of model (log vs queue), delivery guarantees, ordering, throughput, latency, and operational complexity. Give two scenarios where you'd pick each, and explain why.",
    difficulty: 3,
    baseElo: 1400,
    topicSlugs: ["spring"],
    rubric: {
      criteria: [
        { name: "Conceptual model", weight: 0.3, idealPoints: ["Kafka = distributed log w/ partitions", "RabbitMQ = broker w/ queues + exchanges"] },
        { name: "Guarantees & ordering", weight: 0.25, idealPoints: ["At-least-once default", "Per-partition ordering Kafka", "RabbitMQ supports exactly-once with care"] },
        { name: "Throughput / latency", weight: 0.2, idealPoints: ["Kafka high throughput, batch", "RabbitMQ lower latency single-msg"] },
        { name: "Pick scenarios", weight: 0.25, idealPoints: ["Event sourcing → Kafka", "RPC-style work queue / fanout → RabbitMQ"] },
      ],
      keyConcepts: ["partition", "consumer group", "exchange/binding", "ack/nack"],
      redFlags: ["Saying Kafka is always faster", "No ordering nuance", "Confusing topics/queues"],
    },
  },
];

async function main() {
  console.log("Seeding…");

  for (const t of TOPICS) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
  }

  for (const p of PROBLEMS) {
    const created = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        prompt: p.prompt,
        rubric: JSON.stringify(p.rubric),
        difficulty: p.difficulty,
        baseElo: p.baseElo,
      },
      create: {
        slug: p.slug,
        title: p.title,
        prompt: p.prompt,
        rubric: JSON.stringify(p.rubric),
        difficulty: p.difficulty,
        baseElo: p.baseElo,
      },
    });

    await prisma.problemTopic.deleteMany({ where: { problemId: created.id } });
    for (const ts of p.topicSlugs) {
      const topic = await prisma.topic.findUnique({ where: { slug: ts } });
      if (!topic) continue;
      await prisma.problemTopic.create({
        data: { problemId: created.id, topicId: topic.id },
      });
    }
  }

  console.log(`Seeded ${TOPICS.length} topics and ${PROBLEMS.length} problems.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
