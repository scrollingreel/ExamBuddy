// Capgemini 2027 Mock Tests Dataset
// 5 Full-Length Mock Tests of 40 questions each (200 total MCQs)
// Built from official scenario-based assessment curriculum

export interface MockQuestion {
    id: number;
    source: number;
    section: 'AI Literacy' | 'Technical Assessment';
    topic: string;
    stem: string;
    options: string[];
    answer: number;
    explanation: string;
}

export interface MockTest {
    id: string;
    testNumber: number;
    title: string;
    subtitle: string;
    description: string;
    questionsCount: number;
    durationMinutes: number;
    aiCount: number;
    techCount: number;
    questions: MockQuestion[];
}

export const CAPGEMINI_MOCK_TESTS: MockTest[] = [
  {
    "id": "mock-1",
    "testNumber": 1,
    "title": "Capgemini 2027 Mock Test 1",
    "subtitle": "AI Literacy + Technical Assessment",
    "description": "Full-length practice test #1 with 40 scenario-based questions covering AI Literacy and Technical core subjects.",
    "questionsCount": 40,
    "durationMinutes": 30,
    "aiCount": 20,
    "techCount": 20,
    "questions": [
      {
        "id": 1,
        "source": 1,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A support team compares a traditional classifier with a foundation model. The latter can be adapted to summarization, coding and classification with task-specific prompting. Which property best explains this flexibility?",
        "options": [
          "It is trained only on one fixed label set.",
          "It stores every possible answer as a database row.",
          "It learns broad representations that can support many downstream tasks.",
          "It executes only manually written business rules."
        ],
        "answer": 2,
        "explanation": "A foundation model learns broad representations that can support multiple downstream tasks, unlike a model restricted to one fixed label set."
      },
      {
        "id": 2,
        "source": 2,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A language model receives the same context but produces different plausible continuations under different sampling settings. What is changing at generation time?",
        "options": [
          "The model's training dataset is being rewritten.",
          "The tokenizer is permanently learning new words.",
          "The probability distribution used for token selection is being sampled differently.",
          "The model is converting from supervised to unsupervised learning."
        ],
        "answer": 2,
        "explanation": "Different sampling settings change how the model selects among candidate next tokens at generation time; they do not rewrite the training dataset."
      },
      {
        "id": 3,
        "source": 3,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "An engineer asks a model for a newly issued company policy, but the model has no retrieval source and predates the policy. What is the primary risk?",
        "options": [
          "The model cannot generate any text about policies.",
          "The model will automatically query the company's database.",
          "The model must return an empty string for every unknown fact.",
          "The model may produce an answer unsupported by the newer information."
        ],
        "answer": 3,
        "explanation": "Without retrieval augmentation or updated weights, a model cannot reliably know facts that postdate its training cutoff."
      },
      {
        "id": 4,
        "source": 4,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team needs to turn a paragraph into a concise set of bullet points while preserving the important facts. Which task is most directly involved?",
        "options": [
          "Summarization",
          "Embedding generation",
          "Classification",
          "Tokenization"
        ],
        "answer": 0,
        "explanation": "Condensing longer text into concise key points while preserving core facts is the definition of text summarization."
      },
      {
        "id": 5,
        "source": 5,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model converts the phrase 'payment failed' into a numerical vector used to find semantically similar phrases. What is that representation commonly called?",
        "options": [
          "Checksum",
          "Parse tree",
          "Embedding",
          "Session token"
        ],
        "answer": 2,
        "explanation": "An embedding maps text into a continuous dense numerical vector space where semantic similarity corresponds to geometric proximity."
      },
      {
        "id": 6,
        "source": 26,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A developer gives an AI assistant the goal, relevant repository context, constraints, examples and required output format. Why is this stronger than 'fix this code'?",
        "options": [
          "It reduces ambiguity and defines an actionable task.",
          "It guarantees the code will compile.",
          "It removes the need for testing.",
          "It permanently retrains the model."
        ],
        "answer": 0,
        "explanation": "Explicit context, constraints, and structured output expectations reduce prompt ambiguity and align generation with the task."
      },
      {
        "id": 7,
        "source": 27,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt contains three input-output examples before asking the model to classify a fourth input. Which technique is this?",
        "options": [
          "Zero-shot prompting",
          "Few-shot prompting",
          "Fine-tuning",
          "Retrieval indexing"
        ],
        "answer": 1,
        "explanation": "Few-shot prompting conditions the model on a few in-context demonstration examples prior to asking for new inference."
      },
      {
        "id": 8,
        "source": 28,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A model receives an instruction without examples and must perform the task from the instruction alone. What is this commonly called?",
        "options": [
          "Distillation",
          "Parameter training",
          "Few-shot prompting",
          "Zero-shot prompting"
        ],
        "answer": 3,
        "explanation": "Zero-shot prompting asks the model to execute a task guided purely by the instruction without demonstration pairs."
      },
      {
        "id": 9,
        "source": 29,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An application parses model output programmatically. Which instruction is most useful?",
        "options": [
          "Use as many explanations as possible.",
          "Return only valid JSON with the specified fields and no surrounding prose.",
          "Answer creatively in any format.",
          "Return whichever structure seems convenient."
        ],
        "answer": 1,
        "explanation": "Constraining the model to emit clean, schema-adherent JSON without markdown markdown wrappers simplifies programmatic parsing."
      },
      {
        "id": 10,
        "source": 30,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An AI coding assistant proposes a refactor. The developer requires unchanged public behavior and tests for edge cases. What role do those constraints play?",
        "options": [
          "They replace the test suite.",
          "They guarantee semantic equivalence automatically.",
          "They define acceptance criteria.",
          "They prevent all implementation changes."
        ],
        "answer": 2,
        "explanation": "Acceptance criteria establish boundary conditions and requirements that the generated refactoring must satisfy to be merged."
      },
      {
        "id": 11,
        "source": 51,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A chatbot must answer questions from a frequently changing internal knowledge base. Which component most directly provides current information?",
        "options": [
          "A larger tokenizer vocabulary",
          "A static system prompt alone",
          "A retrieval layer over indexed documents",
          "A higher sampling temperature"
        ],
        "answer": 2,
        "explanation": "A retrieval engine dynamically retrieves newly indexed records to provide up-to-date context to the generation model."
      },
      {
        "id": 12,
        "source": 52,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A document-search system converts documents and queries into vectors before retrieving nearby items. What does the vector index primarily support?",
        "options": [
          "Source compilation",
          "Password hashing",
          "Similarity-based retrieval",
          "CPU scheduling"
        ],
        "answer": 2,
        "explanation": "Vector indices (e.g. HNSW, FAISS) accelerate approximate nearest neighbor lookups based on geometric distance."
      },
      {
        "id": 13,
        "source": 53,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A retrieval system returns highly similar but outdated documents. Which additional signal is most useful?",
        "options": [
          "Metadata such as document version or effective date",
          "More random sampling",
          "Higher generation temperature",
          "Removing timestamps"
        ],
        "answer": 0,
        "explanation": "Filtering or reranking using temporal metadata ensures the retrieval system favors recent versions over stale matches."
      },
      {
        "id": 14,
        "source": 54,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An agent can call a payment API. Which control is most important before allowing an irreversible refund action?",
        "options": [
          "Increasing model temperature",
          "Letting the model choose any account",
          "Removing audit logs",
          "Authorization and policy checks before tool execution"
        ],
        "answer": 3,
        "explanation": "Irreversible financial side effects must be gated by deterministic authorization checks and business validation logic."
      },
      {
        "id": 15,
        "source": 55,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A tool-using agent receives a tool result that conflicts with its initial assumption. What should a robust system do?",
        "options": [
          "Re-evaluate the plan using the new evidence.",
          "Repeat the same action indefinitely.",
          "Treat the first assumption as authoritative.",
          "Ignore the tool result."
        ],
        "answer": 0,
        "explanation": "Effective autonomous agents incorporate tool feedback into their reasoning loop and adjust subsequent execution steps."
      },
      {
        "id": 16,
        "source": 76,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A hiring model learns from historical decisions that systematically favored one group. What should the team investigate?",
        "options": [
          "Whether to remove all evaluation metrics",
          "Whether historical data encodes discriminatory patterns and whether mitigation is needed",
          "Whether historical decisions are automatically unbiased",
          "Whether to increase generation temperature"
        ],
        "answer": 1,
        "explanation": "Machine learning systems replicate systemic historical biases present in training sets unless explicitly identified and mitigated."
      },
      {
        "id": 17,
        "source": 77,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "An AI assistant gives a confident medical claim with no supporting evidence. What is an appropriate production control for high-impact use?",
        "options": [
          "Present the claim as authoritative.",
          "Increase randomness.",
          "Require evidence/verification and appropriate human oversight before consequential decisions.",
          "Remove the audit trail."
        ],
        "answer": 2,
        "explanation": "High-stakes domains (healthcare, criminal justice, finance) require human-in-the-loop validation and evidentiary backing."
      },
      {
        "id": 18,
        "source": 78,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model performs well on a test set but poorly after deployment because the live population differs from the training distribution. What issue is indicated?",
        "options": [
          "DNS failure",
          "Tokenization failure",
          "SQL injection",
          "Distribution shift"
        ],
        "answer": 3,
        "explanation": "Distribution shift (or covariate shift) occurs when live operational input characteristics diverge from training/testing data distributions."
      },
      {
        "id": 19,
        "source": 79,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A benchmark is repeatedly tuned until a model performs exceptionally well on it, but unseen examples are weak. What risk does this illustrate?",
        "options": [
          "Overfitting to the evaluation set",
          "Perfect calibration",
          "Strong generalization",
          "Data encryption"
        ],
        "answer": 0,
        "explanation": "Repeatedly tweaking prompts or models against a static benchmark causes the model to memorize the benchmark rather than generalize."
      },
      {
        "id": 20,
        "source": 80,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A team wants to evaluate whether a chatbot refuses unsafe requests consistently. Which test design is strongest?",
        "options": [
          "Use one example repeatedly.",
          "Include diverse adversarial and boundary cases with explicit pass/fail criteria.",
          "Test only friendly questions.",
          "Evaluate only response length."
        ],
        "answer": 1,
        "explanation": "Adversarial red-teaming with explicit boundary conditions probes whether safety filters withstand varied jailbreak attempts."
      },
      {
        "id": 21,
        "source": 101,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "An array contains values 2, 4, 6, 8 and a loop repeatedly adds the current value to a running total. What is the final total?",
        "options": [
          "20",
          "16",
          "24",
          "18"
        ],
        "answer": 0,
        "explanation": "The sum of elements is 2 + 4 + 6 + 8 = 20."
      },
      {
        "id": 22,
        "source": 102,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A loop starts with i = 1 and doubles i each iteration until i exceeds n. What is its time complexity?",
        "options": [
          "O(n)",
          "O(log n)",
          "O(n\u00b2)",
          "O(n log n)"
        ],
        "answer": 1,
        "explanation": "Multiplying the loop counter by 2 each iteration means i takes values 2^k, reaching n in approximately log2(n) iterations."
      },
      {
        "id": 23,
        "source": 103,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A loop increments i by 3 while i < n. What is its asymptotic time complexity?",
        "options": [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n\u00b2)"
        ],
        "answer": 2,
        "explanation": "The loop executes n/3 iterations; constant factor 1/3 is dropped in asymptotic analysis, resulting in O(n)."
      },
      {
        "id": 24,
        "source": 104,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function recursively calls itself twice on input n-1 without memoization and performs constant work otherwise. What is the dominant growth pattern?",
        "options": [
          "Logarithmic",
          "Linear",
          "Constant",
          "Exponential"
        ],
        "answer": 3,
        "explanation": "The recurrence T(n) = 2T(n-1) + O(1) forms a binary recursion tree of depth n with 2^n leaves, yielding O(2^n) exponential growth."
      },
      {
        "id": 25,
        "source": 105,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program checks whether every element in an array has appeared before using a hash set. What is the expected time complexity?",
        "options": [
          "O(log n)",
          "O(n\u00b2)",
          "O(2^n)",
          "O(n)"
        ],
        "answer": 3,
        "explanation": "Hash set insertions and lookups take average O(1) time each; across n elements the total expected runtime is O(n)."
      },
      {
        "id": 26,
        "source": 126,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A browser's back-navigation needs to remove the most recently visited page first. Which data structure matches the access pattern?",
        "options": [
          "Min-heap",
          "Graph",
          "Queue",
          "Stack"
        ],
        "answer": 3,
        "explanation": "A Stack operates on Last-In, First-Out (LIFO) semantics, making it ideal for browser back navigation."
      },
      {
        "id": 27,
        "source": 127,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A printer processes jobs in the order they arrive. Which structure naturally models this behavior?",
        "options": [
          "Binary search tree",
          "Hash set",
          "Stack",
          "Queue"
        ],
        "answer": 3,
        "explanation": "A Queue operates on First-In, First-Out (FIFO) semantics, exactly matching job buffering and print queues."
      },
      {
        "id": 28,
        "source": 128,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A system repeatedly needs the smallest element and then inserts new elements. Which structure is designed for efficient minimum extraction?",
        "options": [
          "Stack",
          "Hash table",
          "Min-heap",
          "Linked list"
        ],
        "answer": 2,
        "explanation": "A Min-Heap allows extracting the minimum element in O(log n) time and inserting new elements in O(log n) time."
      },
      {
        "id": 29,
        "source": 129,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A dictionary needs average constant-time key lookup. Which structure is the typical choice?",
        "options": [
          "Stack",
          "Queue",
          "Hash table",
          "Array with linear search"
        ],
        "answer": 2,
        "explanation": "Hash tables compute array indices via a hash function, providing average O(1) key lookups, insertions, and deletions."
      },
      {
        "id": 30,
        "source": 130,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A singly linked list must insert a node immediately after a known node. What is the typical time complexity if the node reference is already available?",
        "options": [
          "O(log n)",
          "O(1)",
          "O(n\u00b2)",
          "O(n log n)"
        ],
        "answer": 1,
        "explanation": "With a direct pointer to the predecessor node, adjusting two `next` pointers requires constant O(1) time without traversal."
      },
      {
        "id": 31,
        "source": 151,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A team divides a large application into components with clear interfaces so each can change internally without affecting callers. What principle is being pursued?",
        "options": [
          "Encapsulation and modularity",
          "Shared mutable state everywhere",
          "Global coupling",
          "Circular dependency"
        ],
        "answer": 0,
        "explanation": "Encapsulating internal complexity behind well-defined modular interfaces isolates callers from implementation changes."
      },
      {
        "id": 32,
        "source": 152,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A class should expose only the operations clients need while hiding implementation details. Which OOP concept best fits?",
        "options": [
          "Inheritance",
          "Serialization",
          "Encapsulation",
          "Recursion"
        ],
        "answer": 2,
        "explanation": "Encapsulation restricts direct access to an object's internal representation, exposing only necessary public operations."
      },
      {
        "id": 33,
        "source": 153,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A subclass provides a specialized implementation of a method defined by its parent type. What concept is demonstrated?",
        "options": [
          "Encapsulation",
          "Method overloading",
          "Method overriding",
          "Aggregation"
        ],
        "answer": 2,
        "explanation": "Method overriding occurs when a child class provides a specific implementation of a method already declared in its superclass."
      },
      {
        "id": 34,
        "source": 154,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "Two methods have the same name but different parameter lists within the same class. What is this commonly called?",
        "options": [
          "Method overloading",
          "Dependency injection",
          "Serialization",
          "Method overriding"
        ],
        "answer": 0,
        "explanation": "Defining multiple methods with the identical identifier but different argument signatures in the same class is compile-time method overloading."
      },
      {
        "id": 35,
        "source": 155,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A service receives its repository dependency from outside instead of constructing it internally. What design principle is illustrated?",
        "options": [
          "Tight coupling",
          "Dependency injection",
          "Inheritance-only design",
          "Global state"
        ],
        "answer": 1,
        "explanation": "Dependency Injection passes collaborators into constructors or setters rather than letting the component hardcode concrete dependencies."
      },
      {
        "id": 36,
        "source": 176,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A company wants virtual machines, networking and storage while retaining responsibility for the guest operating system. Which cloud model fits?",
        "options": [
          "SaaS",
          "IaaS",
          "FaaS only",
          "PaaS"
        ],
        "answer": 1,
        "explanation": "Infrastructure as a Service (IaaS, e.g. AWS EC2) provides raw compute and storage while customers manage the OS, runtime, and applications."
      },
      {
        "id": 37,
        "source": 177,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A developer deploys application code while the cloud provider manages the runtime platform and underlying servers. Which model best fits?",
        "options": [
          "IaaS",
          "PaaS",
          "SaaS",
          "Colocation only"
        ],
        "answer": 1,
        "explanation": "Platform as a Service (PaaS, e.g. Heroku, Render) handles operating system patching and runtime environments so developers focus on application code."
      },
      {
        "id": 38,
        "source": 178,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A user consumes a complete hosted business application through a browser without managing its servers. Which model is this?",
        "options": [
          "Local-only deployment",
          "IaaS",
          "SaaS",
          "Bare metal"
        ],
        "answer": 2,
        "explanation": "Software as a Service (SaaS, e.g. Google Workspace, Salesforce) delivers end-user applications managed entirely by the vendor."
      },
      {
        "id": 39,
        "source": 179,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A service automatically adds application instances when traffic increases and removes them when traffic falls. What capability is this?",
        "options": [
          "Tokenization",
          "Static linking",
          "Auto-scaling",
          "Normalization"
        ],
        "answer": 2,
        "explanation": "Auto-scaling dynamically provisions or decommissions compute instances based on CPU utilization, request throughput, or queue backlog."
      },
      {
        "id": 40,
        "source": 180,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A team deploys an application in containers so it runs consistently across environments. What is the main benefit?",
        "options": [
          "Eliminating all operating-system concerns",
          "Guaranteeing zero vulnerabilities",
          "Packaging the application with its dependencies in a portable unit",
          "Replacing source control"
        ],
        "answer": 2,
        "explanation": "Containers bundle the application binaries, runtime, libraries, and configurations, ensuring identical behavior across development and cloud environments."
      }
    ]
  },
  {
    "id": "mock-2",
    "testNumber": 2,
    "title": "Capgemini 2027 Mock Test 2",
    "subtitle": "AI Literacy + Technical Assessment",
    "description": "Full-length practice test #2 with 40 scenario-based questions covering AI Literacy and Technical core subjects.",
    "questionsCount": 40,
    "durationMinutes": 30,
    "aiCount": 20,
    "techCount": 20,
    "questions": [
      {
        "id": 1,
        "source": 6,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A developer notices that two semantically similar sentences receive nearby vectors from an embedding model. What capability does this enable?",
        "options": [
          "Semantic similarity search",
          "Source-code compilation",
          "Guaranteed factual verification",
          "Lossless compression"
        ],
        "answer": 0,
        "explanation": "Vectors located near each other in embedding space allow cosine similarity or Euclidean distance lookups for semantic search."
      },
      {
        "id": 2,
        "source": 7,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A text-generation system predicts one token at a time conditioned on previous context. Which statement is most accurate?",
        "options": [
          "It follows a fixed grammar that guarantees truth.",
          "It generates a sequence by estimating likely next tokens.",
          "It retrieves a complete answer for every sentence.",
          "It searches the web before producing every token."
        ],
        "answer": 1,
        "explanation": "Autoregressive language models predict sequences autoregressively by estimating the probability distribution of the next token given preceding context."
      },
      {
        "id": 3,
        "source": 8,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team increases the temperature of a generative model and observes more varied responses. What trade-off are they exploring?",
        "options": [
          "Encryption versus authentication",
          "Indexing versus normalization",
          "Storage versus network bandwidth",
          "Diversity versus predictability"
        ],
        "answer": 3,
        "explanation": "Higher temperature flattens the probability distribution, introducing greater diversity and randomness at the cost of determinism."
      },
      {
        "id": 4,
        "source": 9,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model produces a fluent explanation containing a nonexistent API. Which conclusion is safest?",
        "options": [
          "Fluency proves the API exists.",
          "Increasing the vocabulary guarantees correctness.",
          "Generated content should be verified before being trusted as factual.",
          "The model has necessarily accessed a hidden API registry."
        ],
        "answer": 2,
        "explanation": "Language models generate text based on statistical fluency rather than guaranteed factual truth; external verification is essential."
      },
      {
        "id": 5,
        "source": 10,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A text model has a maximum context window. A developer keeps appending previous conversation turns until earlier instructions disappear from effective context. What constraint is being observed?",
        "options": [
          "CPU cache invalidation",
          "Network packet fragmentation",
          "Context-window limitation",
          "Database normalization"
        ],
        "answer": 2,
        "explanation": "Models have an upper bound on input token capacity (context window); tokens pushed outside this boundary cannot guide generation."
      },
      {
        "id": 6,
        "source": 31,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt asks an AI to optimize a database query but omits schema, indexes and workload. What should be added first?",
        "options": [
          "Relevant schema, indexes, workload and correctness constraints",
          "More decorative wording",
          "A higher temperature",
          "A request to guess missing details"
        ],
        "answer": 0,
        "explanation": "Query optimization decisions hinge directly on table schema definitions, index availability, data scale, and read/write access patterns."
      },
      {
        "id": 7,
        "source": 32,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A developer asks an AI assistant to review code for security vulnerabilities and return severity, evidence and remediation in a fixed schema. What benefit does the schema provide?",
        "options": [
          "Elimination of false positives",
          "Permanent model retraining",
          "Guaranteed vulnerability detection",
          "More predictable downstream processing"
        ],
        "answer": 3,
        "explanation": "Structured formats allow automated ingestion pipelines, CI/CD gates, and ticketing tools to parse findings reliably."
      },
      {
        "id": 8,
        "source": 33,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt says 'be accurate' but does not define what counts as correct. Which improvement is strongest?",
        "options": [
          "Increase temperature.",
          "Ask the model to invent the evaluation criteria.",
          "Remove all constraints.",
          "Provide measurable criteria or examples of acceptable output."
        ],
        "answer": 3,
        "explanation": "Vague quality adverbs ('be good', 'be accurate') are ineffective compared to concrete rubrics, benchmarks, and target output examples."
      },
      {
        "id": 9,
        "source": 34,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An analyst asks an AI system to compare two designs using cost, latency and reliability, then rank them with justification. What makes the prompt stronger?",
        "options": [
          "It asks only for a one-word answer.",
          "It specifies evaluation dimensions and the expected decision.",
          "It forbids comparison.",
          "It leaves the decision criteria implicit."
        ],
        "answer": 1,
        "explanation": "Defining concrete comparison criteria (cost, latency, reliability) steers the LLM toward rigorous, multidimensional analysis."
      },
      {
        "id": 10,
        "source": 35,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A team uses the same prompt template for hundreds of tickets and changes only the ticket-specific fields. What advantage does templating provide?",
        "options": [
          "Guaranteed correctness",
          "Automatic fine-tuning",
          "Elimination of input validation",
          "Consistency and easier maintenance"
        ],
        "answer": 3,
        "explanation": "Parameterized prompt templates ensure standardized outputs and allow prompt versioning across large volumes of tasks."
      },
      {
        "id": 11,
        "source": 56,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A RAG system retrieves five documents and passes them to the model. Why is retrieval quality a critical part of answer quality?",
        "options": [
          "Retrieval affects only UI formatting.",
          "Generation quality is independent of context.",
          "Irrelevant documents always improve grounding.",
          "The generator can only use retrieved evidence effectively if relevant information is surfaced."
        ],
        "answer": 3,
        "explanation": "Garbage in, garbage out: if the retriever fails to surface accurate source evidence, the generator cannot provide grounded answers."
      },
      {
        "id": 12,
        "source": 57,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A company wants a model to answer only from approved internal documents and refuse unsupported questions. Which design is strongest?",
        "options": [
          "Unrestricted web search",
          "High temperature generation",
          "No document retrieval",
          "Retrieval with source constraints plus refusal/grounding checks"
        ],
        "answer": 3,
        "explanation": "Coupling strict retrieval boundary filters with validation checks forces the model to abstain when retrieved evidence is absent."
      },
      {
        "id": 13,
        "source": 58,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A vector database stores embeddings but not the original document text. What additional mechanism may be needed to construct an answer?",
        "options": [
          "A mapping from retrieved vector records to source content",
          "A compiler linker",
          "A DNS resolver",
          "A CPU scheduler"
        ],
        "answer": 0,
        "explanation": "To inject retrieved information into an LLM prompt, the system must resolve vector IDs back to the underlying textual passages."
      },
      {
        "id": 14,
        "source": 59,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A retrieval system uses very large chunks, causing each result to contain unrelated information. What can improve retrieval precision?",
        "options": [
          "Randomly deleting source text",
          "Larger chunks without limit",
          "Removing metadata",
          "More appropriate chunking based on document structure and semantic boundaries"
        ],
        "answer": 3,
        "explanation": "Optimized semantic chunking boundaries keep retrieved passages cohesive and focused on specific topics."
      },
      {
        "id": 15,
        "source": 60,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An agent repeatedly calls the same tool because it fails to detect that the goal is already satisfied. What system property is missing?",
        "options": [
          "Database normalization",
          "Encryption",
          "Termination or state-based stopping logic",
          "Tokenization"
        ],
        "answer": 2,
        "explanation": "Agent systems need explicit completion criteria and loop detection guards to prevent infinite tool invocations."
      },
      {
        "id": 16,
        "source": 81,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model's confidence score is high even when it is often wrong. What should the team evaluate?",
        "options": [
          "Database indexing",
          "Network topology",
          "Font size",
          "Calibration between predicted confidence and observed correctness"
        ],
        "answer": 3,
        "explanation": "Model calibration evaluates whether the predicted probability corresponds to the empirical likelihood of being correct."
      },
      {
        "id": 17,
        "source": 82,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "Two groups receive different error rates from a classification system. What does this suggest?",
        "options": [
          "The difference proves intentional discrimination without further analysis.",
          "Subgroup metrics are never relevant.",
          "The team should investigate subgroup performance and potential fairness concerns.",
          "The model is automatically fair because total accuracy is high."
        ],
        "answer": 2,
        "explanation": "Disparate subgroup error rates warrant disaggregated fairness auditing to diagnose potential bias in models or training data."
      },
      {
        "id": 18,
        "source": 83,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model is evaluated only on average accuracy, while a small but safety-critical class is frequently missed. What is a better approach?",
        "options": [
          "Remove the rare class from evaluation.",
          "Report only overall accuracy.",
          "Increase model temperature.",
          "Include class-specific and risk-sensitive metrics."
        ],
        "answer": 3,
        "explanation": "Reporting class-specific recall, precision, and cost-weighted loss matrices prevents safety-critical minority classes from being masked."
      },
      {
        "id": 19,
        "source": 84,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A generated answer cites a real source, but the source does not support the claim. What failure is this?",
        "options": [
          "Schema validation",
          "Successful grounding",
          "Unsupported or misleading attribution",
          "Perfect retrieval"
        ],
        "answer": 2,
        "explanation": "Fabricating citations or attributing false statements to actual papers/sources constitutes deceptive attribution failure."
      },
      {
        "id": 20,
        "source": 85,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A team logs every user prompt for debugging, including sensitive customer data. What should they consider?",
        "options": [
          "Disabling authentication",
          "Publicly sharing logs",
          "Data minimization, access controls, retention and privacy requirements",
          "Increasing log verbosity without controls"
        ],
        "answer": 2,
        "explanation": "Logging sensitive information must adhere to regulatory privacy standards (such as GDPR/HIPAA), including masking and data retention limits."
      },
      {
        "id": 21,
        "source": 106,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A developer uses integer division where floating-point division was required. Which class of bug is most directly involved?",
        "options": [
          "Race condition",
          "Deadlock",
          "Incorrect arithmetic semantics",
          "Memory leak"
        ],
        "answer": 2,
        "explanation": "Integer truncation discards fractional remainders, corrupting subsequent arithmetic calculations."
      },
      {
        "id": 22,
        "source": 107,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A loop condition is `while (i <= n)` but i is never changed inside the loop. What is the likely issue when the condition initially holds?",
        "options": [
          "Stack overflow from recursion",
          "Infinite loop",
          "Successful termination",
          "Integer sorting"
        ],
        "answer": 1,
        "explanation": "If the loop condition is satisfied initially and loop variables never update toward termination, the loop runs indefinitely."
      },
      {
        "id": 23,
        "source": 108,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program compares strings using reference identity when it needs content equality. What type of logical error can result?",
        "options": [
          "The program gains thread safety.",
          "The strings are always sorted automatically.",
          "Equal-looking strings may be treated as different objects.",
          "The comparison becomes O(1) in every language."
        ],
        "answer": 2,
        "explanation": "Reference equality compares memory pointers rather than string character sequences, yielding false negatives for distinct string instances with identical contents."
      },
      {
        "id": 24,
        "source": 109,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function swaps adjacent elements repeatedly until no inversion remains. Which algorithmic idea does this resemble?",
        "options": [
          "Breadth-first search",
          "Binary search",
          "Bubble sort",
          "Hashing"
        ],
        "answer": 2,
        "explanation": "Bubble sort repeatedly iterates across adjacent pairs and swaps inverted elements until the entire collection is ordered."
      },
      {
        "id": 25,
        "source": 110,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A sorted array is searched by repeatedly comparing the target with the middle element and discarding half the range. What is the complexity?",
        "options": [
          "O(n\u00b2)",
          "O(log n)",
          "O(n)",
          "O(2^n)"
        ],
        "answer": 1,
        "explanation": "Binary search halves the candidate search interval in each step, taking O(log n) time."
      },
      {
        "id": 26,
        "source": 131,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A binary search tree becomes highly skewed because keys arrive in sorted order. What is the resulting worst-case search complexity?",
        "options": [
          "O(n)",
          "O(1)",
          "O(log n)",
          "O(n log n)"
        ],
        "answer": 0,
        "explanation": "Inserting sorted items into a standard BST degenerates the tree into a linked list of height n, making search O(n)."
      },
      {
        "id": 27,
        "source": 132,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A balanced binary search tree keeps height proportional to log n. What benefit follows?",
        "options": [
          "Search, insertion and deletion can remain O(log n) in the balanced case.",
          "Every operation becomes O(1).",
          "Sorting becomes unnecessary.",
          "Traversal becomes O(log log n)."
        ],
        "answer": 0,
        "explanation": "Self-balancing binary search trees (e.g. AVL, Red-Black) guarantee height h <= c * log(n), ensuring O(log n) worst-case operations."
      },
      {
        "id": 28,
        "source": 133,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A graph problem asks for the shortest number of edges between two nodes in an unweighted graph. Which traversal is appropriate?",
        "options": [
          "Binary search",
          "Heap sort",
          "Depth-first search only",
          "Breadth-first search"
        ],
        "answer": 3,
        "explanation": "BFS explores vertices level by level, ensuring that the first time a destination node is reached, the path has minimum edge length."
      },
      {
        "id": 29,
        "source": 134,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A graph contains weighted edges that are all non-negative, and the task is single-source shortest paths. Which classic algorithm fits?",
        "options": [
          "KMP",
          "Dijkstra's algorithm",
          "Binary search",
          "Union-find alone"
        ],
        "answer": 1,
        "explanation": "Dijkstra's greedy priority-queue algorithm solves the single-source shortest path problem efficiently when edge weights >= 0."
      },
      {
        "id": 30,
        "source": 135,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A graph has negative edge weights but no negative cycle. Which algorithm can handle single-source shortest paths?",
        "options": [
          "Counting sort",
          "Binary search",
          "Heapify",
          "Bellman-Ford"
        ],
        "answer": 3,
        "explanation": "Bellman-Ford relaxes edges |V|-1 times and supports negative edge weights while detecting negative cycles."
      },
      {
        "id": 31,
        "source": 156,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A module changes internally but its public contract remains stable. What property helps minimize impact on callers?",
        "options": [
          "Direct access to every internal field",
          "Global variables",
          "Circular dependencies",
          "Abstraction through a stable interface"
        ],
        "answer": 3,
        "explanation": "Clean abstractions isolate callers from churn, permitting internal performance or architecture revisions without breaking clients."
      },
      {
        "id": 32,
        "source": 157,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A unit test fails after a refactor even though the implementation change was intended to preserve behavior. What should the team do first?",
        "options": [
          "Ignore all failing tests.",
          "Delete the test immediately.",
          "Determine whether the failure indicates a real regression or an outdated test expectation.",
          "Deploy before investigating."
        ],
        "answer": 2,
        "explanation": "Engineers must diagnose root cause first: discerning whether an actual regression was introduced or whether test fixtures made obsolete implementation assumptions."
      },
      {
        "id": 33,
        "source": 158,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A test verifies that a function returns the correct result for one isolated input without external services. What type of test is this?",
        "options": [
          "Penetration test",
          "Unit test",
          "End-to-end deployment test",
          "Load test"
        ],
        "answer": 1,
        "explanation": "Unit testing validates individual functional components in complete isolation without connecting to databases or external networks."
      },
      {
        "id": 34,
        "source": 159,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A test exercises the entire application through its public interface and real integrated components. What level is this?",
        "options": [
          "Static type check",
          "Code formatting",
          "End-to-end test",
          "Unit test"
        ],
        "answer": 2,
        "explanation": "End-to-end (E2E) testing validates full user workflows across frontends, backend APIs, databases, and third-party integrations."
      },
      {
        "id": 35,
        "source": 160,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A bug occurs only when two threads update the same shared counter concurrently. What class of issue is likely?",
        "options": [
          "Memory leak only",
          "Race condition",
          "Syntax error",
          "Compilation warning"
        ],
        "answer": 1,
        "explanation": "A race condition occurs when concurrent threads execute non-atomic read-modify-write operations on shared state without synchronization."
      },
      {
        "id": 36,
        "source": 181,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "Containers on the same host generally share which underlying resource?",
        "options": [
          "The host's user passwords",
          "The same process namespace without isolation",
          "The host operating-system kernel",
          "The same application memory"
        ],
        "answer": 2,
        "explanation": "Unlike full virtual machines with separate hypervisors and guest OSs, containers share the host's Linux kernel while isolating namespaces."
      },
      {
        "id": 37,
        "source": 182,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A load balancer distributes requests across several healthy application instances. What primary goal does this support?",
        "options": [
          "Database normalization",
          "Password hashing",
          "Traffic distribution and availability",
          "Source-code compilation"
        ],
        "answer": 2,
        "explanation": "Load balancers spread incoming network load and route around unhealthy nodes to maximize system uptime and throughput."
      },
      {
        "id": 38,
        "source": 183,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A system replicates data across multiple nodes so one node can fail without losing the service's only copy. What property is being improved?",
        "options": [
          "Serialization",
          "Static typing",
          "Tokenization",
          "Fault tolerance"
        ],
        "answer": 3,
        "explanation": "Data replication prevents single points of failure, ensuring that the cluster remains operational and durable when individual nodes fail."
      },
      {
        "id": 39,
        "source": 184,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A cache stores frequently requested results close to the application. What is the primary performance benefit?",
        "options": [
          "Guaranteed data freshness",
          "Reduced latency and fewer repeated expensive operations",
          "Removal of persistence requirements",
          "Elimination of authorization"
        ],
        "answer": 1,
        "explanation": "In-memory caching (e.g. Redis) serves repetitive read queries in sub-millisecond times, taking pressure off the primary database."
      },
      {
        "id": 40,
        "source": 185,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A cache serves stale customer data after the underlying database changes. What issue is involved?",
        "options": [
          "DNS resolution",
          "Compilation",
          "Deadlock",
          "Cache invalidation or freshness"
        ],
        "answer": 3,
        "explanation": "Cache invalidation ensures cached entries are purged or updated when mutating changes occur in the authoritative datastore."
      }
    ]
  },
  {
    "id": "mock-3",
    "testNumber": 3,
    "title": "Capgemini 2027 Mock Test 3",
    "subtitle": "AI Literacy + Technical Assessment",
    "description": "Full-length practice test #3 with 40 scenario-based questions covering AI Literacy and Technical core subjects.",
    "questionsCount": 40,
    "durationMinutes": 30,
    "aiCount": 20,
    "techCount": 20,
    "questions": [
      {
        "id": 1,
        "source": 11,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A tokenizer splits an unfamiliar word into several smaller units instead of treating it as one vocabulary item. Why can this happen?",
        "options": [
          "Tokenization requires an internet connection.",
          "Every word must correspond to exactly one token.",
          "Tokens are always equal to characters.",
          "Tokenizers can represent text using subword units."
        ],
        "answer": 3,
        "explanation": "Subword tokenizers (e.g., BPE, WordPiece) break out-of-vocabulary words into familiar constituent subwords."
      },
      {
        "id": 2,
        "source": 12,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model is pretrained on a broad corpus and later adapted to a narrower business task using additional training. What does the second stage represent?",
        "options": [
          "Data deduplication",
          "DNS resolution",
          "Static linking",
          "Fine-tuning"
        ],
        "answer": 3,
        "explanation": "Fine-tuning continues training a pretrained base model on domain-specific or task-specific datasets."
      },
      {
        "id": 3,
        "source": 13,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team evaluates a classifier using precision and recall because the positive class is rare. Why might accuracy alone be misleading?",
        "options": [
          "Accuracy automatically ignores false positives.",
          "Precision and recall are only network metrics.",
          "Accuracy cannot be calculated for classification.",
          "Accuracy can hide poor performance on an important minority class."
        ],
        "answer": 3,
        "explanation": "In imbalanced datasets (e.g. 99% negative), a naive model predicting all negatives achieves 99% accuracy while detecting 0% of the minority class."
      },
      {
        "id": 4,
        "source": 14,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A fraud model flags 95% of transactions correctly overall, but misses many actual fraud cases. Which metric should the team inspect closely?",
        "options": [
          "Database cardinality",
          "Token count",
          "Latency only",
          "Recall"
        ],
        "answer": 3,
        "explanation": "Recall measures the proportion of actual positive cases detected. A low recall signifies high false negatives (missed fraud)."
      },
      {
        "id": 5,
        "source": 15,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model assigns probabilities to several possible classes, and the probabilities sum to one. What is the model expressing?",
        "options": [
          "A guaranteed ranking of real-world truth",
          "A normalized distribution over candidate classes",
          "A deterministic rule table",
          "A database transaction"
        ],
        "answer": 1,
        "explanation": "When outputs sum to 1.0 (typically via Softmax), they represent a normalized probability distribution over candidate categories."
      },
      {
        "id": 6,
        "source": 36,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt contains conflicting instructions: one says 'return JSON only' and another says 'explain your reasoning in prose.' What is the main engineering problem?",
        "options": [
          "Ambiguous or conflicting requirements",
          "Lack of DNS caching",
          "Excessive database normalization",
          "Insufficient CPU cores"
        ],
        "answer": 0,
        "explanation": "Conflicting instructions force the model into non-deterministic behavior, breaking downstream JSON parsers when prose is output."
      },
      {
        "id": 7,
        "source": 37,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An AI assistant is asked to modify production configuration directly after generating a proposed change. What is the safer workflow?",
        "options": [
          "Execute immediately because generated configuration is self-validating.",
          "Disable logging to reduce noise.",
          "Review, validate and test the proposed change before execution.",
          "Increase temperature before deployment."
        ],
        "answer": 2,
        "explanation": "Production changes require human oversight, schema validation, and staging test verification prior to live rollout."
      },
      {
        "id": 8,
        "source": 38,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A developer wants the model to preserve an API contract while changing internal implementation. Which prompt detail is most important?",
        "options": [
          "Request maximum creativity.",
          "Remove all examples.",
          "Explicitly state the public contract and prohibited behavior changes.",
          "Ask for any implementation that looks cleaner."
        ],
        "answer": 2,
        "explanation": "Explicit boundary specifications prevent models from modifying signatures, return schemas, or outward side effects."
      },
      {
        "id": 9,
        "source": 39,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An AI assistant repeatedly invents values when information is missing. Which instruction can reduce this behavior?",
        "options": [
          "Require a confident answer regardless of evidence.",
          "Increase temperature.",
          "State that unknown information must be marked unknown rather than guessed.",
          "Remove source context."
        ],
        "answer": 2,
        "explanation": "Explicit negative constraints instructing the model to reply 'Not found' or 'Unknown' curb confabulation / hallucinations."
      },
      {
        "id": 10,
        "source": 40,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A team wants to improve a prompt systematically rather than by intuition. What should they do first?",
        "options": [
          "Change several prompt variables simultaneously without measuring.",
          "Remove difficult examples.",
          "Judge only the most impressive output.",
          "Define representative test cases and evaluation criteria."
        ],
        "answer": 3,
        "explanation": "Systematic prompt engineering requires establishing a golden evaluation dataset with objective grading rubrics."
      },
      {
        "id": 11,
        "source": 61,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A production RAG service becomes slow as the document collection grows. Which optimization is most directly relevant?",
        "options": [
          "Efficient indexing and retrieval rather than scanning every document",
          "Increasing generation temperature",
          "Increasing prompt verbosity",
          "Removing all metadata"
        ],
        "answer": 0,
        "explanation": "Employing indexing algorithms (like inverted indexes or approximate nearest neighbor vector indexes) scales sub-linearly with collection size."
      },
      {
        "id": 12,
        "source": 62,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An agent has permission to read customer records but should not expose one customer's data to another. What boundary is essential?",
        "options": [
          "A longer system prompt only",
          "A larger context window",
          "A lower temperature",
          "Authorization enforced independently of model instructions"
        ],
        "answer": 3,
        "explanation": "Data segregation must be enforced at the API/database layer via authorization tokens, not left to natural language prompt compliance."
      },
      {
        "id": 13,
        "source": 63,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A team wants to know whether retrieved documents actually support generated claims. What evaluation approach is appropriate?",
        "options": [
          "Measure only response length.",
          "Measure retrieval relevance and answer faithfulness separately.",
          "Measure only token probability.",
          "Skip retrieval evaluation if responses sound fluent."
        ],
        "answer": 1,
        "explanation": "Deconstructing RAG evaluation into retrieval relevance (context recall/precision) and answer faithfulness isolates pipeline bottlenecks."
      },
      {
        "id": 14,
        "source": 64,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A multimodal model receives an image and text question and produces a textual answer. What distinguishes the workload?",
        "options": [
          "The image is necessarily converted to SQL.",
          "The model must be a relational database.",
          "Information from multiple input modalities is jointly processed.",
          "Only tabular data can be processed."
        ],
        "answer": 2,
        "explanation": "Multimodal systems project disparate input data streams (such as visual tokens and text tokens) into a shared representational space."
      },
      {
        "id": 15,
        "source": 65,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A speech application converts spoken audio into text before sending it to an LLM. Which component performs the first transformation?",
        "options": [
          "Automatic speech recognition",
          "Vector indexing",
          "SQL parsing",
          "Text-to-speech"
        ],
        "answer": 0,
        "explanation": "ASR (speech-to-text) transcribes audio waveforms into textual transcripts for language model consumption."
      },
      {
        "id": 16,
        "source": 86,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "An AI system makes a loan recommendation. Which design best supports accountability?",
        "options": [
          "Maintain traceable inputs, model/version information, decision criteria and appropriate review mechanisms.",
          "Hide all decision records.",
          "Treat every recommendation as automatically correct.",
          "Allow undocumented model changes."
        ],
        "answer": 0,
        "explanation": "Regulatory accountability requires reproducible audit logs, input provenance, model lineage, and human appeal pathways."
      },
      {
        "id": 17,
        "source": 87,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A fairness metric improves for one group but worsens substantially for another. What should the team do?",
        "options": [
          "Increase temperature.",
          "Analyze the trade-off against the actual risk and policy requirements rather than optimizing one metric blindly.",
          "Declare the model fair solely because one metric improved.",
          "Delete the evaluation data."
        ],
        "answer": 1,
        "explanation": "Fairness interventions inherently involve mathematical trade-offs that must be resolved through clear policy frameworks."
      },
      {
        "id": 18,
        "source": 88,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A test dataset contains examples that were also used during training. Why is this problematic?",
        "options": [
          "It proves generalization.",
          "It always reduces measured accuracy.",
          "It is required for unbiased evaluation.",
          "It can inflate measured performance through data leakage."
        ],
        "answer": 3,
        "explanation": "Data contamination / leakage leads to artificially inflated benchmark results because the model memorized the test questions."
      },
      {
        "id": 19,
        "source": 89,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A team changes the model, prompt and retrieval corpus simultaneously and then observes an accuracy increase. Why is attribution difficult?",
        "options": [
          "Any improvement must come from the model.",
          "Retrieval cannot affect results.",
          "Multiple variables changed, so the cause of the improvement is confounded.",
          "Prompt changes are never measurable."
        ],
        "answer": 2,
        "explanation": "Changing multiple variables simultaneously confounds experimental attribution, making it impossible to identify which modification drove progress."
      },
      {
        "id": 20,
        "source": 90,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "An AI feature is released to production without monitoring for error rates or drift. What engineering weakness is present?",
        "options": [
          "Lack of post-deployment observability and evaluation",
          "Complete rollback readiness",
          "Excessive unit testing",
          "Strong governance"
        ],
        "answer": 0,
        "explanation": "Deploying machine learning models without real-time telemetry leaves teams blind to data drift, degradation, and silent failures."
      },
      {
        "id": 21,
        "source": 111,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program uses `x % 2` to decide whether an integer is even. Which property is being tested?",
        "options": [
          "Remainder after division by two",
          "Bitwise complement",
          "Floating-point precision",
          "Integer square root"
        ],
        "answer": 0,
        "explanation": "The modulo operator `%` calculates the remainder after integer division; an even number yields remainder 0 upon division by 2."
      },
      {
        "id": 22,
        "source": 112,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function receives an array and a target and must return whether two different elements sum to the target. Which expected-time strategy is strongest?",
        "options": [
          "Compare every pair only",
          "Sort repeatedly inside the loop",
          "Hash set of previously seen values",
          "Generate all permutations"
        ],
        "answer": 2,
        "explanation": "Iterating once while checking if `target - num` exists in a hash set achieves O(n) linear time complexity."
      },
      {
        "id": 23,
        "source": 113,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A developer nests a loop of n iterations inside another loop of n iterations. What is the worst-case time complexity if each iteration performs constant work?",
        "options": [
          "O(2^n)",
          "O(n\u00b2)",
          "O(n)",
          "O(log n)"
        ],
        "answer": 1,
        "explanation": "Executing n outer iterations with n inner iterations of O(1) work each results in n * n = O(n\u00b2) quadratic complexity."
      },
      {
        "id": 24,
        "source": 114,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program stores a recursive function's calls on the call stack. What resource grows with recursion depth?",
        "options": [
          "Disk partitions",
          "Database rows",
          "Stack space",
          "Network bandwidth"
        ],
        "answer": 2,
        "explanation": "Each recursive call allocates a stack activation frame for local variables and return addresses, expanding stack memory usage."
      },
      {
        "id": 25,
        "source": 115,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function returns the maximum value in an unsorted array. What lower-bound reasoning applies to a comparison-based scan?",
        "options": [
          "Every element must potentially be inspected, so O(n) time is necessary.",
          "O(n\u00b2) is required.",
          "O(1) is sufficient without assumptions.",
          "O(log n) is always sufficient."
        ],
        "answer": 0,
        "explanation": "In an unsorted array, any unexamined element could be the maximum; hence all n elements must be inspected in \u03a9(n) time."
      },
      {
        "id": 26,
        "source": 136,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A minimum spanning tree is required for a connected weighted undirected graph. Which algorithms are appropriate?",
        "options": [
          "Binary search only",
          "KMP only",
          "BFS only",
          "Kruskal's or Prim's algorithm"
        ],
        "answer": 3,
        "explanation": "Kruskal's (edge-based greedy with DSU) and Prim's (vertex-based greedy with priority queue) find minimum spanning trees."
      },
      {
        "id": 27,
        "source": 137,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "Kruskal's algorithm needs to determine whether adding an edge would create a cycle. Which structure is commonly used?",
        "options": [
          "Disjoint-set union",
          "Trie",
          "Queue only",
          "Stack only"
        ],
        "answer": 0,
        "explanation": "Disjoint Set Union (DSU / Union-Find) with path compression checks whether two vertices belong to the same component in near O(1) time."
      },
      {
        "id": 28,
        "source": 138,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A prefix dictionary stores words so common prefixes share nodes. Which structure is most suitable?",
        "options": [
          "Disjoint set",
          "Queue",
          "Trie",
          "Heap"
        ],
        "answer": 2,
        "explanation": "A Trie (prefix tree) stores string keys along edges, enabling fast prefix-based lookups and autocomplete."
      },
      {
        "id": 29,
        "source": 139,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A dynamic programming solution stores the best answer for smaller subproblems and reuses them. What property makes this useful?",
        "options": [
          "Referential transparency only",
          "Overlapping subproblems",
          "Packet retransmission",
          "Random hashing"
        ],
        "answer": 1,
        "explanation": "Dynamic programming avoids exponential recomputations specifically when smaller recursive subproblems overlap and repeat."
      },
      {
        "id": 30,
        "source": 140,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A greedy algorithm makes a locally optimal choice at each step. When is this strategy justified?",
        "options": [
          "When the problem has a valid greedy-choice property and optimal substructure.",
          "For every optimization problem.",
          "Whenever recursion is unavailable.",
          "Whenever input is sorted."
        ],
        "answer": 0,
        "explanation": "Greedy algorithms yield mathematically provable global optima only if the problem exhibits both optimal substructure and the greedy-choice property."
      },
      {
        "id": 31,
        "source": 161,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "Two threads each hold a lock needed by the other and neither can proceed. What condition is this?",
        "options": [
          "Polymorphism",
          "Serialization",
          "Cache miss",
          "Deadlock"
        ],
        "answer": 3,
        "explanation": "Deadlock is a concurrency stall where two or more processes are permanently blocked because each holds a lock the other requires."
      },
      {
        "id": 32,
        "source": 162,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A code review finds that one function performs validation, persistence, email sending and report formatting. What design concern is most apparent?",
        "options": [
          "Excessive encapsulation",
          "Strong cohesion",
          "Excessive responsibility and poor separation of concerns",
          "Correct single responsibility"
        ],
        "answer": 2,
        "explanation": "Violating the Single Responsibility Principle (SRP) results in bloated, tightly-coupled routines that are difficult to test and maintain."
      },
      {
        "id": 33,
        "source": 163,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A database schema change must be applied consistently across environments and rolled back if deployment fails. What practice helps?",
        "options": [
          "Versioned database migrations",
          "Random schema changes",
          "Disabling backups",
          "Manual undocumented edits"
        ],
        "answer": 0,
        "explanation": "Versioned migration scripts (e.g. Flyway, Liquibase, Alembic) maintain immutable schema histories and programmatic up/down transitions."
      },
      {
        "id": 34,
        "source": 164,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A CI pipeline automatically builds and tests every pull request. What is the primary engineering benefit?",
        "options": [
          "Elimination of code review",
          "Guaranteed bug-free production code",
          "Removal of version control",
          "Early detection of integration and regression problems"
        ],
        "answer": 3,
        "explanation": "Continuous Integration catches compilation errors, broken contracts, and test failures early before merging into trunk branches."
      },
      {
        "id": 35,
        "source": 165,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A team uses Git branches and pull requests to integrate changes. What problem does version control primarily solve?",
        "options": [
          "Replacing runtime monitoring",
          "Encrypting all application data",
          "Tracking and coordinating changes to source code",
          "Guaranteeing algorithmic optimality"
        ],
        "answer": 2,
        "explanation": "Version control systems maintain chronological histories of code revisions and allow multiple engineers to collaborate safely."
      },
      {
        "id": 36,
        "source": 186,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A browser resolves `api.example.com` to an IP address before connecting. Which service performs this lookup?",
        "options": [
          "DHCP only",
          "FTP",
          "DNS",
          "SMTP"
        ],
        "answer": 2,
        "explanation": "The Domain Name System (DNS) maps human-friendly hostnames to machine-routable IP addresses."
      },
      {
        "id": 37,
        "source": 187,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "An HTTP client receives status code 404. What does the response generally indicate?",
        "options": [
          "The requested resource was not found",
          "The server has permanently moved every resource",
          "Authentication definitely succeeded",
          "The request succeeded and created a resource"
        ],
        "answer": 0,
        "explanation": "HTTP 404 Not Found signals that the requested URI could not be located on the origin server."
      },
      {
        "id": 38,
        "source": 188,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "An HTTP client receives status code 401. What does it generally indicate?",
        "options": [
          "The request is a valid cache hit",
          "Authentication is required or has failed",
          "The resource was permanently deleted",
          "The server successfully created the resource"
        ],
        "answer": 1,
        "explanation": "HTTP 401 Unauthorized denotes that the request lacks valid authentication credentials for the target resource."
      },
      {
        "id": 39,
        "source": 189,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A client sends a request to create a resource and the operation can safely be retried without creating duplicates when repeated. What HTTP property is relevant?",
        "options": [
          "Compression",
          "Encryption",
          "Idempotency",
          "Fragmentation"
        ],
        "answer": 2,
        "explanation": "An operation is idempotent if executing it multiple identical times produces the same server state as a single invocation."
      },
      {
        "id": 40,
        "source": 190,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "An API uses HTTPS. What security property is primarily added compared with plain HTTP?",
        "options": [
          "Automatic input validation",
          "Encrypted and authenticated transport via TLS",
          "Guaranteed application-level authorization",
          "Automatic database transactions"
        ],
        "answer": 1,
        "explanation": "HTTPS adds Transport Layer Security (TLS), preventing eavesdropping, man-in-the-middle tampering, and spoofing."
      }
    ]
  },
  {
    "id": "mock-4",
    "testNumber": 4,
    "title": "Capgemini 2027 Mock Test 4",
    "subtitle": "AI Literacy + Technical Assessment",
    "description": "Full-length practice test #4 with 40 scenario-based questions covering AI Literacy and Technical core subjects.",
    "questionsCount": 40,
    "durationMinutes": 30,
    "aiCount": 20,
    "techCount": 20,
    "questions": [
      {
        "id": 1,
        "source": 16,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A generative model is asked to continue a sentence and chooses among several plausible tokens. Why can two runs differ even with identical input?",
        "options": [
          "The tokenizer changes the input every run.",
          "The training corpus is modified during inference.",
          "Sampling can introduce stochasticity.",
          "The CPU changes the model's learned weights."
        ],
        "answer": 2,
        "explanation": "Non-zero temperature and probabilistic sampling algorithms (top-k, top-p) introduce stochastic randomness during generation."
      },
      {
        "id": 2,
        "source": 17,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team compares a small specialized model with a much larger general model for a fixed classification task. Which consideration is most engineering-relevant?",
        "options": [
          "Model size alone determines production suitability.",
          "The smallest model is always more accurate.",
          "The largest model is always optimal.",
          "Accuracy, latency, cost and task fit should be evaluated together."
        ],
        "answer": 3,
        "explanation": "Production architectures balance inference latency, cloud compute cost, memory footprint, and quality rather than prioritizing size alone."
      },
      {
        "id": 3,
        "source": 18,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "An LLM receives a long document and is asked a question whose answer appears near the end. Which resource most directly limits how much surrounding text can be processed at once?",
        "options": [
          "CPU instruction set",
          "Disk partition table",
          "Context window",
          "TCP receive window"
        ],
        "answer": 2,
        "explanation": "The context window dictates the maximum number of tokens an LLM can consume in a single forward pass."
      },
      {
        "id": 4,
        "source": 19,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model can produce code but sometimes uses a library function that does not exist. Which capability is missing if the system relies only on generation?",
        "options": [
          "Language modeling",
          "Tokenization",
          "Reliable external verification of generated claims",
          "Text generation"
        ],
        "answer": 2,
        "explanation": "Without linters, compilers, or test execution harnesses to verify generated code, hallucinated APIs cannot be caught."
      },
      {
        "id": 5,
        "source": 20,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team wants to compare two model versions using the same fixed test set and metric definitions. What practice are they implementing?",
        "options": [
          "Random deployment",
          "Controlled evaluation",
          "Schema migration",
          "Data encryption"
        ],
        "answer": 1,
        "explanation": "Holding evaluation benchmarks, metrics, and test datasets constant ensures scientific, reproducible comparisons between model versions."
      },
      {
        "id": 6,
        "source": 41,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt includes a long irrelevant policy document even though only two clauses matter. What is the likely issue?",
        "options": [
          "More context always improves accuracy.",
          "Context length has no operational effect.",
          "The model will automatically ignore all irrelevant content.",
          "Unnecessary context can increase distraction and token usage."
        ],
        "answer": 3,
        "explanation": "Irrelevant context introduces 'lost in the middle' retrieval degradation and needlessly consumes token budget."
      },
      {
        "id": 7,
        "source": 42,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A developer asks an AI to generate unit tests but provides no expected behavior. What is the main limitation?",
        "options": [
          "Unit tests cannot be generated from code.",
          "Test cases require a database.",
          "The model lacks a reliable oracle for deciding what behavior should pass.",
          "The model cannot read source code."
        ],
        "answer": 2,
        "explanation": "Without specifications or an oracle defining correct functional behavior, the test generator might merely assert existing bugs."
      },
      {
        "id": 8,
        "source": 43,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt asks an AI to produce SQL and explicitly forbids destructive statements. Why is this useful?",
        "options": [
          "It states a safety constraint that can be checked before execution.",
          "It changes the database engine.",
          "It eliminates the need for permissions.",
          "It guarantees the SQL is syntactically valid."
        ],
        "answer": 0,
        "explanation": "Negative constraints safeguard data integrity and provide an unambiguous baseline for validation filters."
      },
      {
        "id": 9,
        "source": 44,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "An AI-generated summary omits a critical exception from the source document. What should the team improve?",
        "options": [
          "Increase temperature so summaries become longer.",
          "Remove the source document.",
          "Accept fluency as the quality metric.",
          "Evaluation should include cases that test preservation of critical details."
        ],
        "answer": 3,
        "explanation": "Evaluation suites must specifically verify that edge cases, exemptions, and caveats are preserved in compressed texts."
      },
      {
        "id": 10,
        "source": 45,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A coding assistant is used to migrate an API from version 1 to version 2. Which context is most valuable?",
        "options": [
          "The old contract, new contract, affected callers and compatibility requirements",
          "Only the function name",
          "The developer's preferred font",
          "A request to make arbitrary changes"
        ],
        "answer": 0,
        "explanation": "Accurate API refactoring demands full visibility of the before/after method signatures, downstream dependents, and compatibility rules."
      },
      {
        "id": 11,
        "source": 66,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A voice assistant generates text and then speaks the response aloud. Which component converts generated text to audio?",
        "options": [
          "DNS",
          "Text-to-speech",
          "Embedding retrieval",
          "Speech-to-text"
        ],
        "answer": 1,
        "explanation": "TTS synthesizes human speech audio from structured textual inputs."
      },
      {
        "id": 12,
        "source": 67,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A model is exposed through an API and requests are arriving faster than the model can process them. Which mechanism can protect the service?",
        "options": [
          "Disabling monitoring",
          "Removing authentication",
          "Rate limiting or queue-based backpressure",
          "Increasing prompt length"
        ],
        "answer": 2,
        "explanation": "Rate limiters, token buckets, and message queues protect GPU inference endpoints from denial-of-service degradation."
      },
      {
        "id": 13,
        "source": 68,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A team caches embeddings for documents that have not changed. What is the main benefit?",
        "options": [
          "Guaranteeing semantic correctness",
          "Increasing factual uncertainty",
          "Removing the need for retrieval",
          "Avoiding repeated computation for unchanged content"
        ],
        "answer": 3,
        "explanation": "Embedding generation is computationally expensive; caching invariant vectors saves latency, CPU/GPU cycles, and API costs."
      },
      {
        "id": 14,
        "source": 69,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An AI application uses a model from a third party and sends customer records in prompts. What architectural concern becomes important?",
        "options": [
          "CPU instruction ordering",
          "DNS TTL alone",
          "Only UI color selection",
          "Data handling, privacy and access boundaries"
        ],
        "answer": 3,
        "explanation": "Transmitting PII or corporate assets to third-party endpoints creates compliance, governance, and contractual privacy obligations."
      },
      {
        "id": 15,
        "source": 70,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An agent can access multiple tools with overlapping capabilities. What helps reduce unsafe tool selection?",
        "options": [
          "Removing tool schemas",
          "Allowing arbitrary tool arguments",
          "Giving every tool unrestricted access",
          "Explicit tool descriptions, permissions and validation"
        ],
        "answer": 3,
        "explanation": "Precise tool signatures, deterministic parameter validation schemas, and least-privilege permissions ensure robust tool routing."
      },
      {
        "id": 16,
        "source": 91,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model's performance declines gradually as customer behavior changes. What should trigger investigation?",
        "options": [
          "Monitoring signals indicating data or concept drift",
          "A fixed calendar date regardless of metrics",
          "Only server CPU temperature",
          "Only UI response length"
        ],
        "answer": 0,
        "explanation": "Concept and data drift monitoring alarms alert teams when input distributions shift enough to impair model accuracy."
      },
      {
        "id": 17,
        "source": 92,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model provides a recommendation that a human reviewer accepts without checking because the model sounds confident. What risk is illustrated?",
        "options": [
          "Packet loss",
          "Cache locality",
          "Data normalization",
          "Automation bias"
        ],
        "answer": 3,
        "explanation": "Automation bias is the cognitive tendency for human operators to blindly trust automated recommendations and overlook errors."
      },
      {
        "id": 18,
        "source": 93,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A safety-critical AI system has an uncertain prediction. Which response is generally safer?",
        "options": [
          "Escalate, abstain or request additional evidence when uncertainty crosses a defined threshold.",
          "Hide uncertainty from the operator.",
          "Force a confident answer.",
          "Randomly choose a class."
        ],
        "answer": 0,
        "explanation": "Abstention and human escalation under high uncertainty is standard fail-safe design in safety-critical systems."
      },
      {
        "id": 19,
        "source": 94,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A team wants to compare two model versions fairly. What should remain controlled?",
        "options": [
          "The number of engineers observing the test",
          "Only the UI theme",
          "The order of unrelated meetings",
          "Evaluation data, metric definitions and test procedure"
        ],
        "answer": 3,
        "explanation": "A fair comparison requires identical benchmarking datasets, scoring rubrics, and execution environments."
      },
      {
        "id": 20,
        "source": 95,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A red-team exercise deliberately tries prompt injection, data exfiltration and unsafe tool use. What is its purpose?",
        "options": [
          "Guarantee zero future vulnerabilities.",
          "Increase model size.",
          "Replace all monitoring.",
          "Identify failure modes before or during controlled deployment."
        ],
        "answer": 3,
        "explanation": "Red-teaming actively exposes adversarial attack vectors and failure modes to fortify system guardrails before malicious exploitation."
      },
      {
        "id": 21,
        "source": 116,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program has two independent loops, one O(n) and another O(n). What is the combined asymptotic complexity?",
        "options": [
          "O(n)",
          "O(n\u00b2)",
          "O(log n)",
          "O(2n) as a distinct asymptotic class"
        ],
        "answer": 0,
        "explanation": "Sequential independent loops add their runtimes: O(n) + O(n) = O(2n) = O(n) by dropping constant multipliers."
      },
      {
        "id": 22,
        "source": 117,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A loop performs `i = i * 2` and then `i = i + 1` each iteration. Which statement is most accurate?",
        "options": [
          "The multiplicative growth still gives logarithmic iteration count.",
          "The loop is constant time for all n.",
          "The loop is necessarily quadratic.",
          "The increment makes it exponential."
        ],
        "answer": 0,
        "explanation": "Because the loop index more than doubles on every pass (2i + 1), it reaches n in O(log n) steps."
      },
      {
        "id": 23,
        "source": 118,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program copies an array into another array before modifying the copy. What property is being protected?",
        "options": [
          "Thread scheduling",
          "Database atomicity",
          "Independence of the copied data from later changes to the original",
          "Network reliability"
        ],
        "answer": 2,
        "explanation": "Defensive copying prevents shared mutable reference side-effects between the original dataset and consumer modifications."
      },
      {
        "id": 24,
        "source": 119,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A developer uses a floating-point number as a loop counter for equality with a target value. Why can this be risky?",
        "options": [
          "Floating-point values cannot be compared.",
          "Floating-point representation can make exact equality unreliable.",
          "Floating-point arithmetic is always exact.",
          "Loop counters must always be strings."
        ],
        "answer": 1,
        "explanation": "IEEE 754 binary floating-point representation rounding errors can prevent counters from hitting exact equality targets, leading to infinite loops."
      },
      {
        "id": 25,
        "source": 120,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function's output depends on an uninitialized variable. What kind of defect is this?",
        "options": [
          "Undefined or indeterminate program behavior",
          "Stable deterministic computation",
          "Normalization",
          "Correct memoization"
        ],
        "answer": 0,
        "explanation": "Reading uninitialized variables accesses whatever garbage bits exist in that memory segment, producing undefined behavior."
      },
      {
        "id": 26,
        "source": 141,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A two-pointer technique scans a sorted array from both ends to find a target sum. What is its typical time complexity?",
        "options": [
          "O(log n) for the whole scan",
          "O(n\u00b2)",
          "O(2^n)",
          "O(n)"
        ],
        "answer": 3,
        "explanation": "With pointers initialized at both ends moving inwards, each element is visited at most once, taking O(n) total time."
      },
      {
        "id": 27,
        "source": 142,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A sliding-window algorithm maintains a contiguous range while moving its boundaries. Which problem shape commonly benefits?",
        "options": [
          "Matrix inversion only",
          "Arbitrary graph coloring only",
          "Subarray or substring constraints",
          "Tree balancing only"
        ],
        "answer": 2,
        "explanation": "Sliding window algorithms efficiently compute optimum properties across contiguous subarrays or substrings without re-evaluating internal elements."
      },
      {
        "id": 28,
        "source": 143,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A stable sorting algorithm preserves the relative order of equal keys. Why can this matter?",
        "options": [
          "It prevents all comparisons.",
          "It guarantees O(1) space.",
          "It preserves information encoded by prior ordering among equal-key records.",
          "It always runs in O(n)."
        ],
        "answer": 2,
        "explanation": "Stability ensures multi-criteria sorting (e.g. sort by first name, then sort by department) retains previous sorting results among ties."
      },
      {
        "id": 29,
        "source": 144,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "Merge sort is applied to n elements. What is its typical time complexity?",
        "options": [
          "O(2^n)",
          "O(n\u00b2)",
          "O(n log n)",
          "O(log n)"
        ],
        "answer": 2,
        "explanation": "Merge sort recursively divides in log2(n) levels and performs linear O(n) merging work per level, consistently achieving O(n log n)."
      },
      {
        "id": 30,
        "source": 145,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "Quick sort chooses a poor pivot repeatedly on already ordered input. What worst-case behavior can result?",
        "options": [
          "O(n\u00b2)",
          "O(n) for every partition strategy",
          "O(1)",
          "O(log n)"
        ],
        "answer": 0,
        "explanation": "If pivot selection consistently yields unbalanced 0 / n-1 partitions, recursion depth hits n with O(n) comparisons per level, degenerating to O(n\u00b2)."
      },
      {
        "id": 31,
        "source": 166,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A deployment introduces a severe defect and the previous version is known to work. What operational capability is most useful?",
        "options": [
          "Increasing deployment batch size",
          "Removing health checks",
          "Deleting the repository",
          "Fast rollback to a known-good version"
        ],
        "answer": 3,
        "explanation": "Fast automated rollback instantly restores service availability by redeploying the prior stable release artifact."
      },
      {
        "id": 32,
        "source": 167,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A service repeatedly retries a failed external request immediately and creates even more load during an outage. What improvement is appropriate?",
        "options": [
          "Increasing request frequency",
          "Infinite immediate retries",
          "Bounded retries with backoff and jitter",
          "Removing all timeouts"
        ],
        "answer": 2,
        "explanation": "Exponential backoff with randomized jitter prevents retry storms from overwhelming struggling downstream dependencies."
      },
      {
        "id": 33,
        "source": 168,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "An API receives malformed JSON. Where should validation occur?",
        "options": [
          "Only after database insertion",
          "Only in the UI",
          "At the service boundary before business logic uses the data",
          "Never; clients are always trusted"
        ],
        "answer": 2,
        "explanation": "Input validation must happen immediately at the edge boundary / controller layer before executing domain logic."
      },
      {
        "id": 34,
        "source": 169,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A secret API key is committed to a public repository. What is the appropriate response?",
        "options": [
          "Revoke/rotate the exposed secret and remove it from the secure configuration path.",
          "Hide the commit locally only.",
          "Rename the variable and keep the same secret.",
          "Add the secret to another source file."
        ],
        "answer": 0,
        "explanation": "Exposed credentials must be revoked immediately because commit histories are scraped by botnets within seconds."
      },
      {
        "id": 35,
        "source": 170,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A system uses logs to diagnose production failures. What makes logs more useful?",
        "options": [
          "Random messages without timestamps",
          "Structured, contextual events with appropriate severity and correlation information",
          "Removing request identifiers",
          "Logging every secret and password"
        ],
        "answer": 1,
        "explanation": "Structured JSON logs containing trace IDs, request timestamps, and log levels allow automated aggregation and querying in ELK/Datadog."
      },
      {
        "id": 36,
        "source": 191,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A web application uses a cookie containing an authentication session identifier. What must be considered?",
        "options": [
          "HTTPS is unnecessary",
          "Authentication no longer requires server-side controls",
          "Secure handling such as appropriate cookie flags, expiration and session protection",
          "Cookies are automatically immune to theft"
        ],
        "answer": 2,
        "explanation": "Session cookies require HttpOnly, Secure, and SameSite attributes to mitigate cross-site scripting (XSS) and cross-site request forgery (CSRF)."
      },
      {
        "id": 37,
        "source": 192,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A user enters SQL syntax into a form and the application concatenates it directly into a query. What vulnerability is likely?",
        "options": [
          "Race condition",
          "DNS poisoning",
          "Buffer compression",
          "SQL injection"
        ],
        "answer": 3,
        "explanation": "String concatenation with unsanitized user inputs enables SQL Injection, allowing attackers to manipulate queries."
      },
      {
        "id": 38,
        "source": 193,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A web page inserts untrusted user input into HTML without proper output encoding. What vulnerability may result?",
        "options": [
          "Deadlock",
          "Cache stampede only",
          "Packet fragmentation",
          "Cross-site scripting"
        ],
        "answer": 3,
        "explanation": "Rendering untrusted input directly into HTML without escaping allows attackers to inject malicious JavaScript (Cross-Site Scripting / XSS)."
      },
      {
        "id": 39,
        "source": 194,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A server stores user passwords as plaintext. What is the appropriate improvement?",
        "options": [
          "Encrypt passwords with a reversible key and log the key.",
          "Store passwords in browser cookies.",
          "Store salted password hashes using a password-hashing algorithm designed for credentials.",
          "Base64-encode the passwords."
        ],
        "answer": 2,
        "explanation": "Passwords must be cryptographically hashed using computationally slow, salted algorithms like bcrypt or argon2 to resist rainbow table and brute-force attacks."
      },
      {
        "id": 40,
        "source": 195,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A distributed service needs to process a burst of events asynchronously instead of forcing producers to wait for consumers. What component fits?",
        "options": [
          "Message queue or event broker",
          "CSS stylesheet",
          "DNS resolver",
          "Static linker"
        ],
        "answer": 0,
        "explanation": "Message queues (e.g. RabbitMQ, Kafka, SQS) decouple event producers from consumers, smoothing peak traffic spikes."
      }
    ]
  },
  {
    "id": "mock-5",
    "testNumber": 5,
    "title": "Capgemini 2027 Mock Test 5",
    "subtitle": "AI Literacy + Technical Assessment",
    "description": "Full-length practice test #5 with 40 scenario-based questions covering AI Literacy and Technical core subjects.",
    "questionsCount": 40,
    "durationMinutes": 30,
    "aiCount": 20,
    "techCount": 20,
    "questions": [
      {
        "id": 1,
        "source": 21,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A classifier's decision threshold is raised so fewer examples are labeled positive. What typically happens to the trade-off?",
        "options": [
          "The model stops producing probabilities.",
          "Both metrics become exactly one.",
          "Precision may increase while recall may decrease.",
          "Recall must always increase."
        ],
        "answer": 2,
        "explanation": "A higher decision threshold requires higher confidence for positive classification, decreasing false positives (raising precision) but increasing false negatives (lowering recall)."
      },
      {
        "id": 2,
        "source": 22,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A model is trained to predict masked words from surrounding text rather than directly generate a response. Which learning setup does this resemble?",
        "options": [
          "Self-supervised language modeling",
          "Packet routing",
          "Manual rule authoring",
          "Database indexing"
        ],
        "answer": 0,
        "explanation": "Masked language modeling (such as in BERT) creates supervisory labels automatically from raw unlabeled text by hiding selected tokens."
      },
      {
        "id": 3,
        "source": 23,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A developer asks a model to output a 300-word answer but receives a much shorter answer because a generation limit was configured. What parameter family is relevant?",
        "options": [
          "CPU clock multiplier",
          "Output-token limit",
          "SQL isolation level",
          "DNS TTL"
        ],
        "answer": 1,
        "explanation": "The max_tokens / max_new_tokens configuration sets the hard ceiling on output generation length."
      },
      {
        "id": 4,
        "source": 24,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A team observes that increasing model size improves benchmark performance but also increases inference cost. What engineering lesson follows?",
        "options": [
          "Cost is independent of inference workload.",
          "Larger models have zero operational trade-offs.",
          "Capability improvements can introduce latency and cost trade-offs.",
          "Model size determines database consistency."
        ],
        "answer": 2,
        "explanation": "Larger parameters demand more GPU RAM, higher latency per token, and increased operational compute expenditures."
      },
      {
        "id": 5,
        "source": 25,
        "section": "AI Literacy",
        "topic": "AI Foundations & Generative AI",
        "stem": "A system needs reliable answers about a private document collection that was updated yesterday. Which architecture is more appropriate than relying only on pretrained memory?",
        "options": [
          "Increasing temperature",
          "Removing the document collection",
          "Replacing the model with a tokenizer.",
          "Retrieval-augmented generation using current documents"
        ],
        "answer": 3,
        "explanation": "RAG dynamically queries external fresh documents and injects relevant passages into the prompt context at inference time."
      },
      {
        "id": 6,
        "source": 46,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A prompt requests 'the best algorithm' without defining constraints. Why is that weak?",
        "options": [
          "There is always one universally best algorithm.",
          "Complexity never affects engineering decisions.",
          "Algorithms are independent of constraints.",
          "Algorithm choice depends on input size, operations, memory and correctness requirements."
        ],
        "answer": 3,
        "explanation": "Algorithmic optimality is context-dependent: choice hinges on space vs time trade-offs, input size, and mutability requirements."
      },
      {
        "id": 7,
        "source": 47,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A team wants an AI assistant to review pull requests consistently. Which approach is strongest?",
        "options": [
          "Ask the model to judge each PR using unrelated criteria.",
          "Ignore false positives.",
          "Change the task wording randomly each time.",
          "Use a stable review checklist, repository context and explicit severity criteria."
        ],
        "answer": 3,
        "explanation": "A structured checklist paired with clear severity thresholds yields standardized, reproducible automated code reviews."
      },
      {
        "id": 8,
        "source": 48,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A model returns valid JSON but places an incorrect customer ID in it. What does this demonstrate?",
        "options": [
          "Schema validation replaces business validation.",
          "Structured output cannot contain errors.",
          "Valid JSON guarantees factual accuracy.",
          "Format correctness does not imply semantic correctness."
        ],
        "answer": 3,
        "explanation": "A document can perfectly satisfy syntactic and structural grammar while containing incorrect business data."
      },
      {
        "id": 9,
        "source": 49,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A developer asks an AI to explain a complex function to a junior engineer and specifies the function's purpose and audience. Why does audience context matter?",
        "options": [
          "It guarantees the explanation is correct.",
          "It eliminates the need to inspect the function.",
          "It changes the source code automatically.",
          "It helps calibrate terminology, depth and examples."
        ],
        "answer": 3,
        "explanation": "Audience framing helps the model choose the right technical abstraction level, avoiding jargon for junior engineers."
      },
      {
        "id": 10,
        "source": 50,
        "section": "AI Literacy",
        "topic": "Prompt Engineering & AI Productivity",
        "stem": "A team compares two prompt versions on the same held-out examples. What are they effectively performing?",
        "options": [
          "Network load balancing",
          "Prompt evaluation through a controlled comparison",
          "Model pretraining",
          "Database replication"
        ],
        "answer": 1,
        "explanation": "Evaluating two prompts on an identical baseline dataset isolates prompt variance and allows direct A/B performance measurement."
      },
      {
        "id": 11,
        "source": 71,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A retrieval system uses cosine similarity between normalized embedding vectors. What does a higher cosine similarity generally indicate?",
        "options": [
          "Higher network bandwidth",
          "Greater directional similarity between the vectors",
          "More database rows",
          "Larger disk capacity"
        ],
        "answer": 1,
        "explanation": "Cosine similarity calculates the cosine of the angle between vectors; values approaching 1.0 indicate aligned directional orientation."
      },
      {
        "id": 12,
        "source": 72,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A production AI service needs reproducible behavior for a compliance test. Which configuration is most relevant?",
        "options": [
          "Randomly changing the prompt on each request",
          "Controlled model/version, prompt and sampling configuration",
          "Unbounded tool selection",
          "Disabling version tracking"
        ],
        "answer": 1,
        "explanation": "Fixing model checkpoints, prompt templates, and random seeds (temperature = 0) provides deterministic audit compliance."
      },
      {
        "id": 13,
        "source": 73,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "An AI agent's plan can contain many steps and tool calls. Why is a maximum step budget useful?",
        "options": [
          "It increases model knowledge.",
          "It limits runaway loops and bounds resource consumption.",
          "It removes the need for authorization.",
          "It guarantees every plan is correct."
        ],
        "answer": 1,
        "explanation": "Step thresholds act as a circuit breaker, terminating runaway cycles and conserving API credits."
      },
      {
        "id": 14,
        "source": 74,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A system retrieves confidential documents based on a user's query. What must be checked before returning a retrieved document?",
        "options": [
          "Whether the document has the longest title",
          "Whether the requesting user is authorized to access it",
          "Whether the model temperature is low",
          "Whether the document is stored alphabetically"
        ],
        "answer": 1,
        "explanation": "Access control lists (ACLs) must verify user permissions before surfacing confidential documents into context."
      },
      {
        "id": 15,
        "source": 75,
        "section": "AI Literacy",
        "topic": "Advanced AI Systems",
        "stem": "A team observes that a RAG system gives excellent answers when retrieval is relevant but poor answers when retrieval misses the key document. What does this reveal?",
        "options": [
          "Prompt formatting guarantees retrieval recall.",
          "Generation completely eliminates retrieval errors.",
          "Retrieval recall is an important upstream dependency for grounded generation.",
          "Temperature determines document availability."
        ],
        "answer": 2,
        "explanation": "The overall RAG system upper bound is constrained by retrieval recall: the model cannot synthesize facts it never received."
      },
      {
        "id": 16,
        "source": 96,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model's output is used to make a high-impact decision. Which principle is most appropriate?",
        "options": [
          "High-impact decisions require no logging.",
          "The level of oversight and validation should reflect the potential harm of errors.",
          "Risk is determined only by model size.",
          "All decisions should be fully automated regardless of risk."
        ],
        "answer": 1,
        "explanation": "Proportional risk governance mandates rigorous validation, auditability, and human intervention proportional to the severity of potential harm."
      },
      {
        "id": 17,
        "source": 97,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A dataset contains many duplicate records from one source. What evaluation problem can duplicates create?",
        "options": [
          "They can overweight that pattern and make the dataset less representative.",
          "They guarantee independence between examples.",
          "They always improve fairness.",
          "They eliminate sampling bias."
        ],
        "answer": 0,
        "explanation": "Duplicate data points artificially skew evaluation metrics toward duplicated patterns, degrading benchmark representativeness."
      },
      {
        "id": 18,
        "source": 98,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A model is accurate overall but its performance drops sharply for a specific language. What should be added to evaluation?",
        "options": [
          "Only more aggregate accuracy",
          "A higher generation temperature",
          "Language- or subgroup-specific test coverage",
          "No additional testing"
        ],
        "answer": 2,
        "explanation": "Stratified subgroup slicing ensures underperforming languages and demographic cohorts are surfaced and tested."
      },
      {
        "id": 19,
        "source": 99,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A team reports that a model is '90% accurate' without stating the dataset, metric definition or evaluation conditions. What is missing?",
        "options": [
          "A tokenizer",
          "Evaluation context needed to interpret the claim",
          "A database index",
          "A larger context window"
        ],
        "answer": 1,
        "explanation": "Isolated metrics are meaningless without contextual specification of dataset distribution, split methodology, and evaluation criteria."
      },
      {
        "id": 20,
        "source": 100,
        "section": "AI Literacy",
        "topic": "Responsible AI & Evaluation",
        "stem": "A deployed model is updated and a previously passing safety test now fails. What should the team do?",
        "options": [
          "Treat the regression as a release-blocking signal until investigated and addressed.",
          "Ignore it because the model is newer.",
          "Increase randomness.",
          "Delete the failing test."
        ],
        "answer": 0,
        "explanation": "Safety regressions must serve as critical release blockers to prevent hazardous behavioral drift from entering production."
      },
      {
        "id": 21,
        "source": 121,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program reads n values and updates a single running minimum without storing the whole array. What is the auxiliary space?",
        "options": [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n\u00b2)"
        ],
        "answer": 2,
        "explanation": "Maintaining a single scalar variable for the running minimum requires constant extra auxiliary memory regardless of n."
      },
      {
        "id": 22,
        "source": 122,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A recursive binary search is implemented incorrectly so the same search interval is passed again without shrinking. What is the likely consequence?",
        "options": [
          "Non-termination or excessive recursion",
          "Automatic memoization",
          "Guaranteed O(log n) behavior",
          "Constant-time completion"
        ],
        "answer": 0,
        "explanation": "Without shrinking the subproblem window toward a base case, recursion continues until memory is exhausted, throwing a stack overflow."
      },
      {
        "id": 23,
        "source": 123,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A program uses short-circuit AND and the left operand is false. What happens to the right operand in languages supporting short-circuit evaluation?",
        "options": [
          "It is executed twice.",
          "It is converted into a loop.",
          "It may not be evaluated.",
          "It must always be evaluated first."
        ],
        "answer": 2,
        "explanation": "In boolean logic `A && B`, if A evaluates to false, the whole expression is guaranteed false; hence B is bypassed (short-circuited)."
      },
      {
        "id": 24,
        "source": 124,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A developer changes an algorithm from checking all pairs to sorting and using two pointers. What trade-off is typically being explored?",
        "options": [
          "Elimination of all memory use",
          "Guaranteed constant time",
          "Removal of correctness requirements",
          "Lower time complexity at the possible cost of sorting and additional constraints"
        ],
        "answer": 3,
        "explanation": "Transitioning from brute force O(n\u00b2) to sorting + two-pointer O(n log n) reduces time complexity while requiring an ordered structure."
      },
      {
        "id": 25,
        "source": 125,
        "section": "Technical Assessment",
        "topic": "Programming Logic & Problem Solving",
        "stem": "A function repeatedly recomputes the same recursive subproblem. Which technique can reduce this repeated work?",
        "options": [
          "Increasing recursion depth",
          "Removing base cases",
          "Memoization",
          "Randomization without state"
        ],
        "answer": 2,
        "explanation": "Memoization caches the output of expensive recursive function calls based on argument keys, avoiding duplicate subtree evaluations."
      },
      {
        "id": 26,
        "source": 146,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A dynamic programming solution uses a table indexed by position and remaining capacity. What is this an example of?",
        "options": [
          "Stack unwinding",
          "Graph traversal",
          "Hash collision resolution",
          "State-based tabulation"
        ],
        "answer": 3,
        "explanation": "Iterative bottom-up filling of multidimensional tables representing subproblem states is state-based tabulation."
      },
      {
        "id": 27,
        "source": 147,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A recursive tree traversal visits left subtree, node, then right subtree. What traversal is this?",
        "options": [
          "Post-order",
          "Level-order",
          "Pre-order",
          "In-order"
        ],
        "answer": 3,
        "explanation": "In-order traversal visits Left -> Root -> Right. For a Binary Search Tree, in-order traversal visits nodes in ascending sorted sequence."
      },
      {
        "id": 28,
        "source": 148,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A topological ordering is required for tasks with prerequisite dependencies. What graph property is required?",
        "options": [
          "The graph must be undirected.",
          "The graph must be complete.",
          "The dependency graph must be a directed acyclic graph.",
          "All edges must have equal weights."
        ],
        "answer": 2,
        "explanation": "Topological sorting linearly orders directed vertices; cycles would introduce mutual circular dependencies where no node can be scheduled first."
      },
      {
        "id": 29,
        "source": 149,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A cache uses least-recently-used eviction. Which pair of structures can support O(1) lookup and recency updates?",
        "options": [
          "Binary search tree only",
          "Array plus recursion only",
          "Hash map plus doubly linked list",
          "Stack plus queue only"
        ],
        "answer": 2,
        "explanation": "A hash map provides O(1) key-to-node lookup, while a doubly linked list supports O(1) node detachment and head insertion."
      },
      {
        "id": 30,
        "source": 150,
        "section": "Technical Assessment",
        "topic": "Data Structures & Algorithms",
        "stem": "A problem asks for the number of connected components in an undirected graph. Which approaches are appropriate?",
        "options": [
          "Trie traversal only",
          "Binary search on vertices",
          "DFS/BFS traversal or disjoint-set union",
          "Heap sort only"
        ],
        "answer": 2,
        "explanation": "Graph traversals (DFS/BFS) count connected islands by exploring unvisited nodes, while DSU counts disjoint root representatives."
      },
      {
        "id": 31,
        "source": 171,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A service's response time increases as traffic grows because every request performs an expensive database scan. What should be investigated?",
        "options": [
          "Increasing log verbosity",
          "Query plans, indexes and access patterns",
          "UI color schemes",
          "Source-code comments only"
        ],
        "answer": 1,
        "explanation": "Analyzing database execution plans (EXPLAIN ANALYZE) reveals sequential scans and missing B-tree indexes."
      },
      {
        "id": 32,
        "source": 172,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A team wants to release a feature to a small percentage of users before full rollout. What technique fits?",
        "options": [
          "Manual source deletion",
          "Canary release",
          "Big-bang release",
          "Static compilation"
        ],
        "answer": 1,
        "explanation": "Canary deployments route a small fraction of real production traffic to the new revision to monitor error rates before general availability."
      },
      {
        "id": 33,
        "source": 173,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A developer changes an implementation while keeping behavior unchanged and improves internal structure. What is this?",
        "options": [
          "Refactoring",
          "Data migration",
          "Incident response",
          "Feature expansion"
        ],
        "answer": 0,
        "explanation": "Refactoring restructures internal code architecture, readability, and modularity without changing outward observable functionality."
      },
      {
        "id": 34,
        "source": 174,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A codebase has a dependency graph with cycles among modules. Why can this be problematic?",
        "options": [
          "It eliminates integration risks.",
          "It guarantees modularity.",
          "It guarantees faster builds.",
          "It increases coupling and can complicate testing, deployment and change isolation."
        ],
        "answer": 3,
        "explanation": "Circular dependencies tightly couple modules, inhibiting independent testing, compilation, and clean architectural boundaries."
      },
      {
        "id": 35,
        "source": 175,
        "section": "Technical Assessment",
        "topic": "Software Engineering Fundamentals",
        "stem": "A service should fail fast when a downstream dependency is unavailable instead of consuming all worker threads waiting indefinitely. Which mechanism helps?",
        "options": [
          "Unlimited retries",
          "Removing dependency health checks",
          "Timeout and circuit-breaker controls",
          "Infinite blocking"
        ],
        "answer": 2,
        "explanation": "Circuit breakers open after repeated failures, immediately shedding requests to avoid thread exhaustion and cascading failures."
      },
      {
        "id": 36,
        "source": 196,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A message queue consumer crashes after receiving a message but before completing processing. What design concern becomes important?",
        "options": [
          "Source formatting",
          "DNS caching",
          "Delivery semantics and idempotent processing",
          "UI responsiveness only"
        ],
        "answer": 2,
        "explanation": "At-least-once message delivery implies re-deliveries upon consumer crashes; message handling must be idempotent to avoid duplicate actions."
      },
      {
        "id": 37,
        "source": 197,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A database transaction must ensure that all changes happen or none do. Which ACID property is this?",
        "options": [
          "Consistency only",
          "Durability only",
          "Atomicity",
          "Isolation only"
        ],
        "answer": 2,
        "explanation": "Atomicity guarantees that all statements within a transaction succeed together or the entire transaction is rolled back."
      },
      {
        "id": 38,
        "source": 198,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "Two concurrent transactions should not expose intermediate changes to each other. Which ACID property addresses this?",
        "options": [
          "Isolation",
          "Availability",
          "Durability",
          "Atomicity"
        ],
        "answer": 0,
        "explanation": "Isolation defines how transaction integrity is visible to other concurrent operations, preventing dirty reads and write skew."
      },
      {
        "id": 39,
        "source": 199,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A database must preserve committed data even after a crash. Which property is relevant?",
        "options": [
          "Isolation",
          "Durability",
          "Idempotency",
          "Tokenization"
        ],
        "answer": 1,
        "explanation": "Durability guarantees that once a transaction commits, its modifications are permanently recorded on non-volatile storage even across crashes."
      },
      {
        "id": 40,
        "source": 200,
        "section": "Technical Assessment",
        "topic": "Modern Engineering Awareness",
        "stem": "A service exposes metrics for request rate, error rate and latency. What engineering capability does this primarily support?",
        "options": [
          "Model pretraining",
          "Source-code formatting",
          "Data normalization",
          "Observability and operational monitoring"
        ],
        "answer": 3,
        "explanation": "Telemetry tracking the 'golden signals' (traffic, error rate, latency, saturation) enables proactive observability and incident alerting."
      }
    ]
  }
];
