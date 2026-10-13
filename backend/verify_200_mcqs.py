# Helper to assemble 200 MCQs and distribute into 5 mock tests
import json
import random

RAW_QUESTIONS = [
    # Topic 1: AI Foundations & Generative AI (1 - 25)
    {
        "source": 1,
        "stem": "A support team compares a traditional classifier with a foundation model. The latter can be adapted to summarization, coding and classification with task-specific prompting. Which property best explains this flexibility?",
        "options": [
            "It learns broad representations that can support many downstream tasks.",
            "It stores every possible answer as a database row.",
            "It is trained only on one fixed label set.",
            "It executes only manually written business rules."
        ],
        "answer_text": "It learns broad representations that can support many downstream tasks.",
        "explanation": "A foundation model learns broad representations that can support multiple downstream tasks, unlike a model restricted to one fixed label set."
    },
    {
        "source": 2,
        "stem": "A language model receives the same context but produces different plausible continuations under different sampling settings. What is changing at generation time?",
        "options": [
            "The probability distribution used for token selection is being sampled differently.",
            "The tokenizer is permanently learning new words.",
            "The model is converting from supervised to unsupervised learning.",
            "The model's training dataset is being rewritten."
        ],
        "answer_text": "The probability distribution used for token selection is being sampled differently.",
        "explanation": "Different sampling settings change how the model selects among candidate next tokens at generation time; they do not rewrite the training dataset."
    },
    {
        "source": 3,
        "stem": "An engineer asks a model for a newly issued company policy, but the model has no retrieval source and predates the policy. What is the primary risk?",
        "options": [
            "The model may produce an answer unsupported by the newer information.",
            "The model cannot generate any text about policies.",
            "The model will automatically query the company's database.",
            "The model must return an empty string for every unknown fact."
        ],
        "answer_text": "The model may produce an answer unsupported by the newer information.",
        "explanation": "Without retrieval augmentation or updated weights, a model cannot reliably know facts that postdate its training cutoff."
    },
    {
        "source": 4,
        "stem": "A team needs to turn a paragraph into a concise set of bullet points while preserving the important facts. Which task is most directly involved?",
        "options": [
            "Summarization",
            "Classification",
            "Tokenization",
            "Embedding generation"
        ],
        "answer_text": "Summarization",
        "explanation": "Condensing longer text into concise key points while preserving core facts is the definition of text summarization."
    },
    {
        "source": 5,
        "stem": "A model converts the phrase 'payment failed' into a numerical vector used to find semantically similar phrases. What is that representation commonly called?",
        "options": [
            "Embedding",
            "Checksum",
            "Parse tree",
            "Session token"
        ],
        "answer_text": "Embedding",
        "explanation": "An embedding maps text into a continuous dense numerical vector space where semantic similarity corresponds to geometric proximity."
    },
    {
        "source": 6,
        "stem": "A developer notices that two semantically similar sentences receive nearby vectors from an embedding model. What capability does this enable?",
        "options": [
            "Semantic similarity search",
            "Guaranteed factual verification",
            "Lossless compression",
            "Source-code compilation"
        ],
        "answer_text": "Semantic similarity search",
        "explanation": "Vectors located near each other in embedding space allow cosine similarity or Euclidean distance lookups for semantic search."
    },
    {
        "source": 7,
        "stem": "A text-generation system predicts one token at a time conditioned on previous context. Which statement is most accurate?",
        "options": [
            "It generates a sequence by estimating likely next tokens.",
            "It retrieves a complete answer for every sentence.",
            "It follows a fixed grammar that guarantees truth.",
            "It searches the web before producing every token."
        ],
        "answer_text": "It generates a sequence by estimating likely next tokens.",
        "explanation": "Autoregressive language models predict sequences autoregressively by estimating the probability distribution of the next token given preceding context."
    },
    {
        "source": 8,
        "stem": "A team increases the temperature of a generative model and observes more varied responses. What trade-off are they exploring?",
        "options": [
            "Diversity versus predictability",
            "Storage versus network bandwidth",
            "Encryption versus authentication",
            "Indexing versus normalization"
        ],
        "answer_text": "Diversity versus predictability",
        "explanation": "Higher temperature flattens the probability distribution, introducing greater diversity and randomness at the cost of determinism."
    },
    {
        "source": 9,
        "stem": "A model produces a fluent explanation containing a nonexistent API. Which conclusion is safest?",
        "options": [
            "Generated content should be verified before being trusted as factual.",
            "Fluency proves the API exists.",
            "Increasing the vocabulary guarantees correctness.",
            "The model has necessarily accessed a hidden API registry."
        ],
        "answer_text": "Generated content should be verified before being trusted as factual.",
        "explanation": "Language models generate text based on statistical fluency rather than guaranteed factual truth; external verification is essential."
    },
    {
        "source": 10,
        "stem": "A text model has a maximum context window. A developer keeps appending previous conversation turns until earlier instructions disappear from effective context. What constraint is being observed?",
        "options": [
            "Context-window limitation",
            "Database normalization",
            "CPU cache invalidation",
            "Network packet fragmentation"
        ],
        "answer_text": "Context-window limitation",
        "explanation": "Models have an upper bound on input token capacity (context window); tokens pushed outside this boundary cannot guide generation."
    },
    {
        "source": 11,
        "stem": "A tokenizer splits an unfamiliar word into several smaller units instead of treating it as one vocabulary item. Why can this happen?",
        "options": [
            "Tokenizers can represent text using subword units.",
            "Every word must correspond to exactly one token.",
            "Tokenization requires an internet connection.",
            "Tokens are always equal to characters."
        ],
        "answer_text": "Tokenizers can represent text using subword units.",
        "explanation": "Subword tokenizers (e.g., BPE, WordPiece) break out-of-vocabulary words into familiar constituent subwords."
    },
    {
        "source": 12,
        "stem": "A model is pretrained on a broad corpus and later adapted to a narrower business task using additional training. What does the second stage represent?",
        "options": [
            "Fine-tuning",
            "DNS resolution",
            "Static linking",
            "Data deduplication"
        ],
        "answer_text": "Fine-tuning",
        "explanation": "Fine-tuning continues training a pretrained base model on domain-specific or task-specific datasets."
    },
    {
        "source": 13,
        "stem": "A team evaluates a classifier using precision and recall because the positive class is rare. Why might accuracy alone be misleading?",
        "options": [
            "Accuracy can hide poor performance on an important minority class.",
            "Accuracy cannot be calculated for classification.",
            "Precision and recall are only network metrics.",
            "Accuracy automatically ignores false positives."
        ],
        "answer_text": "Accuracy can hide poor performance on an important minority class.",
        "explanation": "In imbalanced datasets (e.g. 99% negative), a naive model predicting all negatives achieves 99% accuracy while detecting 0% of the minority class."
    },
    {
        "source": 14,
        "stem": "A fraud model flags 95% of transactions correctly overall, but misses many actual fraud cases. Which metric should the team inspect closely?",
        "options": [
            "Recall",
            "Token count",
            "Latency only",
            "Database cardinality"
        ],
        "answer_text": "Recall",
        "explanation": "Recall measures the proportion of actual positive cases detected. A low recall signifies high false negatives (missed fraud)."
    },
    {
        "source": 15,
        "stem": "A model assigns probabilities to several possible classes, and the probabilities sum to one. What is the model expressing?",
        "options": [
            "A normalized distribution over candidate classes",
            "A guaranteed ranking of real-world truth",
            "A database transaction",
            "A deterministic rule table"
        ],
        "answer_text": "A normalized distribution over candidate classes",
        "explanation": "When outputs sum to 1.0 (typically via Softmax), they represent a normalized probability distribution over candidate categories."
    },
    {
        "source": 16,
        "stem": "A generative model is asked to continue a sentence and chooses among several plausible tokens. Why can two runs differ even with identical input?",
        "options": [
            "Sampling can introduce stochasticity.",
            "The tokenizer changes the input every run.",
            "The training corpus is modified during inference.",
            "The CPU changes the model's learned weights."
        ],
        "answer_text": "Sampling can introduce stochasticity.",
        "explanation": "Non-zero temperature and probabilistic sampling algorithms (top-k, top-p) introduce stochastic randomness during generation."
    },
    {
        "source": 17,
        "stem": "A team compares a small specialized model with a much larger general model for a fixed classification task. Which consideration is most engineering-relevant?",
        "options": [
            "Accuracy, latency, cost and task fit should be evaluated together.",
            "The largest model is always optimal.",
            "The smallest model is always more accurate.",
            "Model size alone determines production suitability."
        ],
        "answer_text": "Accuracy, latency, cost and task fit should be evaluated together.",
        "explanation": "Production architectures balance inference latency, cloud compute cost, memory footprint, and quality rather than prioritizing size alone."
    },
    {
        "source": 18,
        "stem": "An LLM receives a long document and is asked a question whose answer appears near the end. Which resource most directly limits how much surrounding text can be processed at once?",
        "options": [
            "Context window",
            "TCP receive window",
            "Disk partition table",
            "CPU instruction set"
        ],
        "answer_text": "Context window",
        "explanation": "The context window dictates the maximum number of tokens an LLM can consume in a single forward pass."
    },
    {
        "source": 19,
        "stem": "A model can produce code but sometimes uses a library function that does not exist. Which capability is missing if the system relies only on generation?",
        "options": [
            "Reliable external verification of generated claims",
            "Tokenization",
            "Text generation",
            "Language modeling"
        ],
        "answer_text": "Reliable external verification of generated claims",
        "explanation": "Without linters, compilers, or test execution harnesses to verify generated code, hallucinated APIs cannot be caught."
    },
    {
        "source": 20,
        "stem": "A team wants to compare two model versions using the same fixed test set and metric definitions. What practice are they implementing?",
        "options": [
            "Controlled evaluation",
            "Random deployment",
            "Data encryption",
            "Schema migration"
        ],
        "answer_text": "Controlled evaluation",
        "explanation": "Holding evaluation benchmarks, metrics, and test datasets constant ensures scientific, reproducible comparisons between model versions."
    },
    {
        "source": 21,
        "stem": "A classifier's decision threshold is raised so fewer examples are labeled positive. What typically happens to the trade-off?",
        "options": [
            "Precision may increase while recall may decrease.",
            "Recall must always increase.",
            "Both metrics become exactly one.",
            "The model stops producing probabilities."
        ],
        "answer_text": "Precision may increase while recall may decrease.",
        "explanation": "A higher decision threshold requires higher confidence for positive classification, decreasing false positives (raising precision) but increasing false negatives (lowering recall)."
    },
    {
        "source": 22,
        "stem": "A model is trained to predict masked words from surrounding text rather than directly generate a response. Which learning setup does this resemble?",
        "options": [
            "Self-supervised language modeling",
            "Manual rule authoring",
            "Database indexing",
            "Packet routing"
        ],
        "answer_text": "Self-supervised language modeling",
        "explanation": "Masked language modeling (such as in BERT) creates supervisory labels automatically from raw unlabeled text by hiding selected tokens."
    },
    {
        "source": 23,
        "stem": "A developer asks a model to output a 300-word answer but receives a much shorter answer because a generation limit was configured. What parameter family is relevant?",
        "options": [
            "Output-token limit",
            "DNS TTL",
            "SQL isolation level",
            "CPU clock multiplier"
        ],
        "answer_text": "Output-token limit",
        "explanation": "The max_tokens / max_new_tokens configuration sets the hard ceiling on output generation length."
    },
    {
        "source": 24,
        "stem": "A team observes that increasing model size improves benchmark performance but also increases inference cost. What engineering lesson follows?",
        "options": [
            "Capability improvements can introduce latency and cost trade-offs.",
            "Larger models have zero operational trade-offs.",
            "Model size determines database consistency.",
            "Cost is independent of inference workload."
        ],
        "answer_text": "Capability improvements can introduce latency and cost trade-offs.",
        "explanation": "Larger parameters demand more GPU RAM, higher latency per token, and increased operational compute expenditures."
    },
    {
        "source": 25,
        "stem": "A system needs reliable answers about a private document collection that was updated yesterday. Which architecture is more appropriate than relying only on pretrained memory?",
        "options": [
            "Retrieval-augmented generation using current documents",
            "Increasing temperature",
            "Removing the document collection",
            "Replacing the model with a tokenizer."
        ],
        "answer_text": "Retrieval-augmented generation using current documents",
        "explanation": "RAG dynamically queries external fresh documents and injects relevant passages into the prompt context at inference time."
    },

    # Topic 2: Prompt Engineering & AI Productivity (26 - 50)
    {
        "source": 26,
        "stem": "A developer gives an AI assistant the goal, relevant repository context, constraints, examples and required output format. Why is this stronger than 'fix this code'?",
        "options": [
            "It reduces ambiguity and defines an actionable task.",
            "It permanently retrains the model.",
            "It guarantees the code will compile.",
            "It removes the need for testing."
        ],
        "answer_text": "It reduces ambiguity and defines an actionable task.",
        "explanation": "Explicit context, constraints, and structured output expectations reduce prompt ambiguity and align generation with the task."
    },
    {
        "source": 27,
        "stem": "A prompt contains three input-output examples before asking the model to classify a fourth input. Which technique is this?",
        "options": [
            "Few-shot prompting",
            "Zero-shot prompting",
            "Fine-tuning",
            "Retrieval indexing"
        ],
        "answer_text": "Few-shot prompting",
        "explanation": "Few-shot prompting conditions the model on a few in-context demonstration examples prior to asking for new inference."
    },
    {
        "source": 28,
        "stem": "A model receives an instruction without examples and must perform the task from the instruction alone. What is this commonly called?",
        "options": [
            "Zero-shot prompting",
            "Few-shot prompting",
            "Parameter training",
            "Distillation"
        ],
        "answer_text": "Zero-shot prompting",
        "explanation": "Zero-shot prompting asks the model to execute a task guided purely by the instruction without demonstration pairs."
    },
    {
        "source": 29,
        "stem": "An application parses model output programmatically. Which instruction is most useful?",
        "options": [
            "Return only valid JSON with the specified fields and no surrounding prose.",
            "Answer creatively in any format.",
            "Use as many explanations as possible.",
            "Return whichever structure seems convenient."
        ],
        "answer_text": "Return only valid JSON with the specified fields and no surrounding prose.",
        "explanation": "Constraining the model to emit clean, schema-adherent JSON without markdown markdown wrappers simplifies programmatic parsing."
    },
    {
        "source": 30,
        "stem": "An AI coding assistant proposes a refactor. The developer requires unchanged public behavior and tests for edge cases. What role do those constraints play?",
        "options": [
            "They define acceptance criteria.",
            "They guarantee semantic equivalence automatically.",
            "They replace the test suite.",
            "They prevent all implementation changes."
        ],
        "answer_text": "They define acceptance criteria.",
        "explanation": "Acceptance criteria establish boundary conditions and requirements that the generated refactoring must satisfy to be merged."
    },
    {
        "source": 31,
        "stem": "A prompt asks an AI to optimize a database query but omits schema, indexes and workload. What should be added first?",
        "options": [
            "Relevant schema, indexes, workload and correctness constraints",
            "A higher temperature",
            "A request to guess missing details",
            "More decorative wording"
        ],
        "answer_text": "Relevant schema, indexes, workload and correctness constraints",
        "explanation": "Query optimization decisions hinge directly on table schema definitions, index availability, data scale, and read/write access patterns."
    },
    {
        "source": 32,
        "stem": "A developer asks an AI assistant to review code for security vulnerabilities and return severity, evidence and remediation in a fixed schema. What benefit does the schema provide?",
        "options": [
            "More predictable downstream processing",
            "Permanent model retraining",
            "Guaranteed vulnerability detection",
            "Elimination of false positives"
        ],
        "answer_text": "More predictable downstream processing",
        "explanation": "Structured formats allow automated ingestion pipelines, CI/CD gates, and ticketing tools to parse findings reliably."
    },
    {
        "source": 33,
        "stem": "A prompt says 'be accurate' but does not define what counts as correct. Which improvement is strongest?",
        "options": [
            "Provide measurable criteria or examples of acceptable output.",
            "Remove all constraints.",
            "Ask the model to invent the evaluation criteria.",
            "Increase temperature."
        ],
        "answer_text": "Provide measurable criteria or examples of acceptable output.",
        "explanation": "Vague quality adverbs ('be good', 'be accurate') are ineffective compared to concrete rubrics, benchmarks, and target output examples."
    },
    {
        "source": 34,
        "stem": "An analyst asks an AI system to compare two designs using cost, latency and reliability, then rank them with justification. What makes the prompt stronger?",
        "options": [
            "It specifies evaluation dimensions and the expected decision.",
            "It leaves the decision criteria implicit.",
            "It forbids comparison.",
            "It asks only for a one-word answer."
        ],
        "answer_text": "It specifies evaluation dimensions and the expected decision.",
        "explanation": "Defining concrete comparison criteria (cost, latency, reliability) steers the LLM toward rigorous, multidimensional analysis."
    },
    {
        "source": 35,
        "stem": "A team uses the same prompt template for hundreds of tickets and changes only the ticket-specific fields. What advantage does templating provide?",
        "options": [
            "Consistency and easier maintenance",
            "Guaranteed correctness",
            "Automatic fine-tuning",
            "Elimination of input validation"
        ],
        "answer_text": "Consistency and easier maintenance",
        "explanation": "Parameterized prompt templates ensure standardized outputs and allow prompt versioning across large volumes of tasks."
    },
    {
        "source": 36,
        "stem": "A prompt contains conflicting instructions: one says 'return JSON only' and another says 'explain your reasoning in prose.' What is the main engineering problem?",
        "options": [
            "Ambiguous or conflicting requirements",
            "Excessive database normalization",
            "Insufficient CPU cores",
            "Lack of DNS caching"
        ],
        "answer_text": "Ambiguous or conflicting requirements",
        "explanation": "Conflicting instructions force the model into non-deterministic behavior, breaking downstream JSON parsers when prose is output."
    },
    {
        "source": 37,
        "stem": "An AI assistant is asked to modify production configuration directly after generating a proposed change. What is the safer workflow?",
        "options": [
            "Review, validate and test the proposed change before execution.",
            "Execute immediately because generated configuration is self-validating.",
            "Increase temperature before deployment.",
            "Disable logging to reduce noise."
        ],
        "answer_text": "Review, validate and test the proposed change before execution.",
        "explanation": "Production changes require human oversight, schema validation, and staging test verification prior to live rollout."
    },
    {
        "source": 38,
        "stem": "A developer wants the model to preserve an API contract while changing internal implementation. Which prompt detail is most important?",
        "options": [
            "Explicitly state the public contract and prohibited behavior changes.",
            "Ask for any implementation that looks cleaner.",
            "Remove all examples.",
            "Request maximum creativity."
        ],
        "answer_text": "Explicitly state the public contract and prohibited behavior changes.",
        "explanation": "Explicit boundary specifications prevent models from modifying signatures, return schemas, or outward side effects."
    },
    {
        "source": 39,
        "stem": "An AI assistant repeatedly invents values when information is missing. Which instruction can reduce this behavior?",
        "options": [
            "State that unknown information must be marked unknown rather than guessed.",
            "Require a confident answer regardless of evidence.",
            "Increase temperature.",
            "Remove source context."
        ],
        "answer_text": "State that unknown information must be marked unknown rather than guessed.",
        "explanation": "Explicit negative constraints instructing the model to reply 'Not found' or 'Unknown' curb confabulation / hallucinations."
    },
    {
        "source": 40,
        "stem": "A team wants to improve a prompt systematically rather than by intuition. What should they do first?",
        "options": [
            "Define representative test cases and evaluation criteria.",
            "Change several prompt variables simultaneously without measuring.",
            "Judge only the most impressive output.",
            "Remove difficult examples."
        ],
        "answer_text": "Define representative test cases and evaluation criteria.",
        "explanation": "Systematic prompt engineering requires establishing a golden evaluation dataset with objective grading rubrics."
    },
    {
        "source": 41,
        "stem": "A prompt includes a long irrelevant policy document even though only two clauses matter. What is the likely issue?",
        "options": [
            "Unnecessary context can increase distraction and token usage.",
            "More context always improves accuracy.",
            "The model will automatically ignore all irrelevant content.",
            "Context length has no operational effect."
        ],
        "answer_text": "Unnecessary context can increase distraction and token usage.",
        "explanation": "Irrelevant context introduces 'lost in the middle' retrieval degradation and needlessly consumes token budget."
    },
    {
        "source": 42,
        "stem": "A developer asks an AI to generate unit tests but provides no expected behavior. What is the main limitation?",
        "options": [
            "The model lacks a reliable oracle for deciding what behavior should pass.",
            "Unit tests cannot be generated from code.",
            "Test cases require a database.",
            "The model cannot read source code."
        ],
        "answer_text": "The model lacks a reliable oracle for deciding what behavior should pass.",
        "explanation": "Without specifications or an oracle defining correct functional behavior, the test generator might merely assert existing bugs."
    },
    {
        "source": 43,
        "stem": "A prompt asks an AI to produce SQL and explicitly forbids destructive statements. Why is this useful?",
        "options": [
            "It states a safety constraint that can be checked before execution.",
            "It guarantees the SQL is syntactically valid.",
            "It eliminates the need for permissions.",
            "It changes the database engine."
        ],
        "answer_text": "It states a safety constraint that can be checked before execution.",
        "explanation": "Negative constraints safeguard data integrity and provide an unambiguous baseline for validation filters."
    },
    {
        "source": 44,
        "stem": "An AI-generated summary omits a critical exception from the source document. What should the team improve?",
        "options": [
            "Evaluation should include cases that test preservation of critical details.",
            "Increase temperature so summaries become longer.",
            "Remove the source document.",
            "Accept fluency as the quality metric."
        ],
        "answer_text": "Evaluation should include cases that test preservation of critical details.",
        "explanation": "Evaluation suites must specifically verify that edge cases, exemptions, and caveats are preserved in compressed texts."
    },
    {
        "source": 45,
        "stem": "A coding assistant is used to migrate an API from version 1 to version 2. Which context is most valuable?",
        "options": [
            "The old contract, new contract, affected callers and compatibility requirements",
            "Only the function name",
            "A request to make arbitrary changes",
            "The developer's preferred font"
        ],
        "answer_text": "The old contract, new contract, affected callers and compatibility requirements",
        "explanation": "Accurate API refactoring demands full visibility of the before/after method signatures, downstream dependents, and compatibility rules."
    },
    {
        "source": 46,
        "stem": "A prompt requests 'the best algorithm' without defining constraints. Why is that weak?",
        "options": [
            "Algorithm choice depends on input size, operations, memory and correctness requirements.",
            "There is always one universally best algorithm.",
            "Algorithms are independent of constraints.",
            "Complexity never affects engineering decisions."
        ],
        "answer_text": "Algorithm choice depends on input size, operations, memory and correctness requirements.",
        "explanation": "Algorithmic optimality is context-dependent: choice hinges on space vs time trade-offs, input size, and mutability requirements."
    },
    {
        "source": 47,
        "stem": "A team wants an AI assistant to review pull requests consistently. Which approach is strongest?",
        "options": [
            "Use a stable review checklist, repository context and explicit severity criteria.",
            "Ask the model to judge each PR using unrelated criteria.",
            "Change the task wording randomly each time.",
            "Ignore false positives."
        ],
        "answer_text": "Use a stable review checklist, repository context and explicit severity criteria.",
        "explanation": "A structured checklist paired with clear severity thresholds yields standardized, reproducible automated code reviews."
    },
    {
        "source": 48,
        "stem": "A model returns valid JSON but places an incorrect customer ID in it. What does this demonstrate?",
        "options": [
            "Format correctness does not imply semantic correctness.",
            "Valid JSON guarantees factual accuracy.",
            "Schema validation replaces business validation.",
            "Structured output cannot contain errors."
        ],
        "answer_text": "Format correctness does not imply semantic correctness.",
        "explanation": "A document can perfectly satisfy syntactic and structural grammar while containing incorrect business data."
    },
    {
        "source": 49,
        "stem": "A developer asks an AI to explain a complex function to a junior engineer and specifies the function's purpose and audience. Why does audience context matter?",
        "options": [
            "It helps calibrate terminology, depth and examples.",
            "It changes the source code automatically.",
            "It guarantees the explanation is correct.",
            "It eliminates the need to inspect the function."
        ],
        "answer_text": "It helps calibrate terminology, depth and examples.",
        "explanation": "Audience framing helps the model choose the right technical abstraction level, avoiding jargon for junior engineers."
    },
    {
        "source": 50,
        "stem": "A team compares two prompt versions on the same held-out examples. What are they effectively performing?",
        "options": [
            "Prompt evaluation through a controlled comparison",
            "Database replication",
            "Model pretraining",
            "Network load balancing"
        ],
        "answer_text": "Prompt evaluation through a controlled comparison",
        "explanation": "Evaluating two prompts on an identical baseline dataset isolates prompt variance and allows direct A/B performance measurement."
    },

    # Topic 3: Advanced AI Systems (51 - 75)
    {
        "source": 51,
        "stem": "A chatbot must answer questions from a frequently changing internal knowledge base. Which component most directly provides current information?",
        "options": [
            "A retrieval layer over indexed documents",
            "A higher sampling temperature",
            "A larger tokenizer vocabulary",
            "A static system prompt alone"
        ],
        "answer_text": "A retrieval layer over indexed documents",
        "explanation": "A retrieval engine dynamically retrieves newly indexed records to provide up-to-date context to the generation model."
    },
    {
        "source": 52,
        "stem": "A document-search system converts documents and queries into vectors before retrieving nearby items. What does the vector index primarily support?",
        "options": [
            "Similarity-based retrieval",
            "Password hashing",
            "CPU scheduling",
            "Source compilation"
        ],
        "answer_text": "Similarity-based retrieval",
        "explanation": "Vector indices (e.g. HNSW, FAISS) accelerate approximate nearest neighbor lookups based on geometric distance."
    },
    {
        "source": 53,
        "stem": "A retrieval system returns highly similar but outdated documents. Which additional signal is most useful?",
        "options": [
            "Metadata such as document version or effective date",
            "Higher generation temperature",
            "More random sampling",
            "Removing timestamps"
        ],
        "answer_text": "Metadata such as document version or effective date",
        "explanation": "Filtering or reranking using temporal metadata ensures the retrieval system favors recent versions over stale matches."
    },
    {
        "source": 54,
        "stem": "An agent can call a payment API. Which control is most important before allowing an irreversible refund action?",
        "options": [
            "Authorization and policy checks before tool execution",
            "Increasing model temperature",
            "Removing audit logs",
            "Letting the model choose any account"
        ],
        "answer_text": "Authorization and policy checks before tool execution",
        "explanation": "Irreversible financial side effects must be gated by deterministic authorization checks and business validation logic."
    },
    {
        "source": 55,
        "stem": "A tool-using agent receives a tool result that conflicts with its initial assumption. What should a robust system do?",
        "options": [
            "Re-evaluate the plan using the new evidence.",
            "Ignore the tool result.",
            "Repeat the same action indefinitely.",
            "Treat the first assumption as authoritative."
        ],
        "answer_text": "Re-evaluate the plan using the new evidence.",
        "explanation": "Effective autonomous agents incorporate tool feedback into their reasoning loop and adjust subsequent execution steps."
    },
    {
        "source": 56,
        "stem": "A RAG system retrieves five documents and passes them to the model. Why is retrieval quality a critical part of answer quality?",
        "options": [
            "The generator can only use retrieved evidence effectively if relevant information is surfaced.",
            "Generation quality is independent of context.",
            "Retrieval affects only UI formatting.",
            "Irrelevant documents always improve grounding."
        ],
        "answer_text": "The generator can only use retrieved evidence effectively if relevant information is surfaced.",
        "explanation": "Garbage in, garbage out: if the retriever fails to surface accurate source evidence, the generator cannot provide grounded answers."
    },
    {
        "source": 57,
        "stem": "A company wants a model to answer only from approved internal documents and refuse unsupported questions. Which design is strongest?",
        "options": [
            "Retrieval with source constraints plus refusal/grounding checks",
            "High temperature generation",
            "No document retrieval",
            "Unrestricted web search"
        ],
        "answer_text": "Retrieval with source constraints plus refusal/grounding checks",
        "explanation": "Coupling strict retrieval boundary filters with validation checks forces the model to abstain when retrieved evidence is absent."
    },
    {
        "source": 58,
        "stem": "A vector database stores embeddings but not the original document text. What additional mechanism may be needed to construct an answer?",
        "options": [
            "A mapping from retrieved vector records to source content",
            "A CPU scheduler",
            "A DNS resolver",
            "A compiler linker"
        ],
        "answer_text": "A mapping from retrieved vector records to source content",
        "explanation": "To inject retrieved information into an LLM prompt, the system must resolve vector IDs back to the underlying textual passages."
    },
    {
        "source": 59,
        "stem": "A retrieval system uses very large chunks, causing each result to contain unrelated information. What can improve retrieval precision?",
        "options": [
            "More appropriate chunking based on document structure and semantic boundaries",
            "Larger chunks without limit",
            "Removing metadata",
            "Randomly deleting source text"
        ],
        "answer_text": "More appropriate chunking based on document structure and semantic boundaries",
        "explanation": "Optimized semantic chunking boundaries keep retrieved passages cohesive and focused on specific topics."
    },
    {
        "source": 60,
        "stem": "An agent repeatedly calls the same tool because it fails to detect that the goal is already satisfied. What system property is missing?",
        "options": [
            "Termination or state-based stopping logic",
            "Tokenization",
            "Database normalization",
            "Encryption"
        ],
        "answer_text": "Termination or state-based stopping logic",
        "explanation": "Agent systems need explicit completion criteria and loop detection guards to prevent infinite tool invocations."
    },
    {
        "source": 61,
        "stem": "A production RAG service becomes slow as the document collection grows. Which optimization is most directly relevant?",
        "options": [
            "Efficient indexing and retrieval rather than scanning every document",
            "Increasing prompt verbosity",
            "Increasing generation temperature",
            "Removing all metadata"
        ],
        "answer_text": "Efficient indexing and retrieval rather than scanning every document",
        "explanation": "Employing indexing algorithms (like inverted indexes or approximate nearest neighbor vector indexes) scales sub-linearly with collection size."
    },
    {
        "source": 62,
        "stem": "An agent has permission to read customer records but should not expose one customer's data to another. What boundary is essential?",
        "options": [
            "Authorization enforced independently of model instructions",
            "A larger context window",
            "A lower temperature",
            "A longer system prompt only"
        ],
        "answer_text": "Authorization enforced independently of model instructions",
        "explanation": "Data segregation must be enforced at the API/database layer via authorization tokens, not left to natural language prompt compliance."
    },
    {
        "source": 63,
        "stem": "A team wants to know whether retrieved documents actually support generated claims. What evaluation approach is appropriate?",
        "options": [
            "Measure retrieval relevance and answer faithfulness separately.",
            "Measure only response length.",
            "Measure only token probability.",
            "Skip retrieval evaluation if responses sound fluent."
        ],
        "answer_text": "Measure retrieval relevance and answer faithfulness separately.",
        "explanation": "Deconstructing RAG evaluation into retrieval relevance (context recall/precision) and answer faithfulness isolates pipeline bottlenecks."
    },
    {
        "source": 64,
        "stem": "A multimodal model receives an image and text question and produces a textual answer. What distinguishes the workload?",
        "options": [
            "Information from multiple input modalities is jointly processed.",
            "Only tabular data can be processed.",
            "The model must be a relational database.",
            "The image is necessarily converted to SQL."
        ],
        "answer_text": "Information from multiple input modalities is jointly processed.",
        "explanation": "Multimodal systems project disparate input data streams (such as visual tokens and text tokens) into a shared representational space."
    },
    {
        "source": 65,
        "stem": "A speech application converts spoken audio into text before sending it to an LLM. Which component performs the first transformation?",
        "options": [
            "Automatic speech recognition",
            "Text-to-speech",
            "Vector indexing",
            "SQL parsing"
        ],
        "answer_text": "Automatic speech recognition",
        "explanation": "ASR (speech-to-text) transcribes audio waveforms into textual transcripts for language model consumption."
    },
    {
        "source": 66,
        "stem": "A voice assistant generates text and then speaks the response aloud. Which component converts generated text to audio?",
        "options": [
            "Text-to-speech",
            "Speech-to-text",
            "DNS",
            "Embedding retrieval"
        ],
        "answer_text": "Text-to-speech",
        "explanation": "TTS synthesizes human speech audio from structured textual inputs."
    },
    {
        "source": 67,
        "stem": "A model is exposed through an API and requests are arriving faster than the model can process them. Which mechanism can protect the service?",
        "options": [
            "Rate limiting or queue-based backpressure",
            "Increasing prompt length",
            "Removing authentication",
            "Disabling monitoring"
        ],
        "answer_text": "Rate limiting or queue-based backpressure",
        "explanation": "Rate limiters, token buckets, and message queues protect GPU inference endpoints from denial-of-service degradation."
    },
    {
        "source": 68,
        "stem": "A team caches embeddings for documents that have not changed. What is the main benefit?",
        "options": [
            "Avoiding repeated computation for unchanged content",
            "Increasing factual uncertainty",
            "Removing the need for retrieval",
            "Guaranteeing semantic correctness"
        ],
        "answer_text": "Avoiding repeated computation for unchanged content",
        "explanation": "Embedding generation is computationally expensive; caching invariant vectors saves latency, CPU/GPU cycles, and API costs."
    },
    {
        "source": 69,
        "stem": "An AI application uses a model from a third party and sends customer records in prompts. What architectural concern becomes important?",
        "options": [
            "Data handling, privacy and access boundaries",
            "Only UI color selection",
            "CPU instruction ordering",
            "DNS TTL alone"
        ],
        "answer_text": "Data handling, privacy and access boundaries",
        "explanation": "Transmitting PII or corporate assets to third-party endpoints creates compliance, governance, and contractual privacy obligations."
    },
    {
        "source": 70,
        "stem": "An agent can access multiple tools with overlapping capabilities. What helps reduce unsafe tool selection?",
        "options": [
            "Explicit tool descriptions, permissions and validation",
            "Giving every tool unrestricted access",
            "Removing tool schemas",
            "Allowing arbitrary tool arguments"
        ],
        "answer_text": "Explicit tool descriptions, permissions and validation",
        "explanation": "Precise tool signatures, deterministic parameter validation schemas, and least-privilege permissions ensure robust tool routing."
    },
    {
        "source": 71,
        "stem": "A retrieval system uses cosine similarity between normalized embedding vectors. What does a higher cosine similarity generally indicate?",
        "options": [
            "Greater directional similarity between the vectors",
            "Larger disk capacity",
            "Higher network bandwidth",
            "More database rows"
        ],
        "answer_text": "Greater directional similarity between the vectors",
        "explanation": "Cosine similarity calculates the cosine of the angle between vectors; values approaching 1.0 indicate aligned directional orientation."
    },
    {
        "source": 72,
        "stem": "A production AI service needs reproducible behavior for a compliance test. Which configuration is most relevant?",
        "options": [
            "Controlled model/version, prompt and sampling configuration",
            "Randomly changing the prompt on each request",
            "Unbounded tool selection",
            "Disabling version tracking"
        ],
        "answer_text": "Controlled model/version, prompt and sampling configuration",
        "explanation": "Fixing model checkpoints, prompt templates, and random seeds (temperature = 0) provides deterministic audit compliance."
    },
    {
        "source": 73,
        "stem": "An AI agent's plan can contain many steps and tool calls. Why is a maximum step budget useful?",
        "options": [
            "It limits runaway loops and bounds resource consumption.",
            "It guarantees every plan is correct.",
            "It removes the need for authorization.",
            "It increases model knowledge."
        ],
        "answer_text": "It limits runaway loops and bounds resource consumption.",
        "explanation": "Step thresholds act as a circuit breaker, terminating runaway cycles and conserving API credits."
    },
    {
        "source": 74,
        "stem": "A system retrieves confidential documents based on a user's query. What must be checked before returning a retrieved document?",
        "options": [
            "Whether the requesting user is authorized to access it",
            "Whether the document has the longest title",
            "Whether the model temperature is low",
            "Whether the document is stored alphabetically"
        ],
        "answer_text": "Whether the requesting user is authorized to access it",
        "explanation": "Access control lists (ACLs) must verify user permissions before surfacing confidential documents into context."
    },
    {
        "source": 75,
        "stem": "A team observes that a RAG system gives excellent answers when retrieval is relevant but poor answers when retrieval misses the key document. What does this reveal?",
        "options": [
            "Retrieval recall is an important upstream dependency for grounded generation.",
            "Generation completely eliminates retrieval errors.",
            "Temperature determines document availability.",
            "Prompt formatting guarantees retrieval recall."
        ],
        "answer_text": "Retrieval recall is an important upstream dependency for grounded generation.",
        "explanation": "The overall RAG system upper bound is constrained by retrieval recall: the model cannot synthesize facts it never received."
    },

    # Topic 4: Responsible AI & Evaluation (76 - 100)
    {
        "source": 76,
        "stem": "A hiring model learns from historical decisions that systematically favored one group. What should the team investigate?",
        "options": [
            "Whether historical data encodes discriminatory patterns and whether mitigation is needed",
            "Whether to increase generation temperature",
            "Whether to remove all evaluation metrics",
            "Whether historical decisions are automatically unbiased"
        ],
        "answer_text": "Whether historical data encodes discriminatory patterns and whether mitigation is needed",
        "explanation": "Machine learning systems replicate systemic historical biases present in training sets unless explicitly identified and mitigated."
    },
    {
        "source": 77,
        "stem": "An AI assistant gives a confident medical claim with no supporting evidence. What is an appropriate production control for high-impact use?",
        "options": [
            "Require evidence/verification and appropriate human oversight before consequential decisions.",
            "Increase randomness.",
            "Present the claim as authoritative.",
            "Remove the audit trail."
        ],
        "answer_text": "Require evidence/verification and appropriate human oversight before consequential decisions.",
        "explanation": "High-stakes domains (healthcare, criminal justice, finance) require human-in-the-loop validation and evidentiary backing."
    },
    {
        "source": 78,
        "stem": "A model performs well on a test set but poorly after deployment because the live population differs from the training distribution. What issue is indicated?",
        "options": [
            "Distribution shift",
            "Tokenization failure",
            "DNS failure",
            "SQL injection"
        ],
        "answer_text": "Distribution shift",
        "explanation": "Distribution shift (or covariate shift) occurs when live operational input characteristics diverge from training/testing data distributions."
    },
    {
        "source": 79,
        "stem": "A benchmark is repeatedly tuned until a model performs exceptionally well on it, but unseen examples are weak. What risk does this illustrate?",
        "options": [
            "Overfitting to the evaluation set",
            "Strong generalization",
            "Perfect calibration",
            "Data encryption"
        ],
        "answer_text": "Overfitting to the evaluation set",
        "explanation": "Repeatedly tweaking prompts or models against a static benchmark causes the model to memorize the benchmark rather than generalize."
    },
    {
        "source": 80,
        "stem": "A team wants to evaluate whether a chatbot refuses unsafe requests consistently. Which test design is strongest?",
        "options": [
            "Include diverse adversarial and boundary cases with explicit pass/fail criteria.",
            "Test only friendly questions.",
            "Evaluate only response length.",
            "Use one example repeatedly."
        ],
        "answer_text": "Include diverse adversarial and boundary cases with explicit pass/fail criteria.",
        "explanation": "Adversarial red-teaming with explicit boundary conditions probes whether safety filters withstand varied jailbreak attempts."
    },
    {
        "source": 81,
        "stem": "A model's confidence score is high even when it is often wrong. What should the team evaluate?",
        "options": [
            "Calibration between predicted confidence and observed correctness",
            "Font size",
            "Database indexing",
            "Network topology"
        ],
        "answer_text": "Calibration between predicted confidence and observed correctness",
        "explanation": "Model calibration evaluates whether the predicted probability corresponds to the empirical likelihood of being correct."
    },
    {
        "source": 82,
        "stem": "Two groups receive different error rates from a classification system. What does this suggest?",
        "options": [
            "The team should investigate subgroup performance and potential fairness concerns.",
            "The model is automatically fair because total accuracy is high.",
            "Subgroup metrics are never relevant.",
            "The difference proves intentional discrimination without further analysis."
        ],
        "answer_text": "The team should investigate subgroup performance and potential fairness concerns.",
        "explanation": "Disparate subgroup error rates warrant disaggregated fairness auditing to diagnose potential bias in models or training data."
    },
    {
        "source": 83,
        "stem": "A model is evaluated only on average accuracy, while a small but safety-critical class is frequently missed. What is a better approach?",
        "options": [
            "Include class-specific and risk-sensitive metrics.",
            "Remove the rare class from evaluation.",
            "Report only overall accuracy.",
            "Increase model temperature."
        ],
        "answer_text": "Include class-specific and risk-sensitive metrics.",
        "explanation": "Reporting class-specific recall, precision, and cost-weighted loss matrices prevents safety-critical minority classes from being masked."
    },
    {
        "source": 84,
        "stem": "A generated answer cites a real source, but the source does not support the claim. What failure is this?",
        "options": [
            "Unsupported or misleading attribution",
            "Successful grounding",
            "Perfect retrieval",
            "Schema validation"
        ],
        "answer_text": "Unsupported or misleading attribution",
        "explanation": "Fabricating citations or attributing false statements to actual papers/sources constitutes deceptive attribution failure."
    },
    {
        "source": 85,
        "stem": "A team logs every user prompt for debugging, including sensitive customer data. What should they consider?",
        "options": [
            "Data minimization, access controls, retention and privacy requirements",
            "Increasing log verbosity without controls",
            "Publicly sharing logs",
            "Disabling authentication"
        ],
        "answer_text": "Data minimization, access controls, retention and privacy requirements",
        "explanation": "Logging sensitive information must adhere to regulatory privacy standards (such as GDPR/HIPAA), including masking and data retention limits."
    },
    {
        "source": 86,
        "stem": "An AI system makes a loan recommendation. Which design best supports accountability?",
        "options": [
            "Maintain traceable inputs, model/version information, decision criteria and appropriate review mechanisms.",
            "Hide all decision records.",
            "Allow undocumented model changes.",
            "Treat every recommendation as automatically correct."
        ],
        "answer_text": "Maintain traceable inputs, model/version information, decision criteria and appropriate review mechanisms.",
        "explanation": "Regulatory accountability requires reproducible audit logs, input provenance, model lineage, and human appeal pathways."
    },
    {
        "source": 87,
        "stem": "A fairness metric improves for one group but worsens substantially for another. What should the team do?",
        "options": [
            "Analyze the trade-off against the actual risk and policy requirements rather than optimizing one metric blindly.",
            "Declare the model fair solely because one metric improved.",
            "Delete the evaluation data.",
            "Increase temperature."
        ],
        "answer_text": "Analyze the trade-off against the actual risk and policy requirements rather than optimizing one metric blindly.",
        "explanation": "Fairness interventions inherently involve mathematical trade-offs that must be resolved through clear policy frameworks."
    },
    {
        "source": 88,
        "stem": "A test dataset contains examples that were also used during training. Why is this problematic?",
        "options": [
            "It can inflate measured performance through data leakage.",
            "It always reduces measured accuracy.",
            "It proves generalization.",
            "It is required for unbiased evaluation."
        ],
        "answer_text": "It can inflate measured performance through data leakage.",
        "explanation": "Data contamination / leakage leads to artificially inflated benchmark results because the model memorized the test questions."
    },
    {
        "source": 89,
        "stem": "A team changes the model, prompt and retrieval corpus simultaneously and then observes an accuracy increase. Why is attribution difficult?",
        "options": [
            "Multiple variables changed, so the cause of the improvement is confounded.",
            "Any improvement must come from the model.",
            "Retrieval cannot affect results.",
            "Prompt changes are never measurable."
        ],
        "answer_text": "Multiple variables changed, so the cause of the improvement is confounded.",
        "explanation": "Changing multiple variables simultaneously confounds experimental attribution, making it impossible to identify which modification drove progress."
    },
    {
        "source": 90,
        "stem": "An AI feature is released to production without monitoring for error rates or drift. What engineering weakness is present?",
        "options": [
            "Lack of post-deployment observability and evaluation",
            "Excessive unit testing",
            "Strong governance",
            "Complete rollback readiness"
        ],
        "answer_text": "Lack of post-deployment observability and evaluation",
        "explanation": "Deploying machine learning models without real-time telemetry leaves teams blind to data drift, degradation, and silent failures."
    },
    {
        "source": 91,
        "stem": "A model's performance declines gradually as customer behavior changes. What should trigger investigation?",
        "options": [
            "Monitoring signals indicating data or concept drift",
            "Only server CPU temperature",
            "Only UI response length",
            "A fixed calendar date regardless of metrics"
        ],
        "answer_text": "Monitoring signals indicating data or concept drift",
        "explanation": "Concept and data drift monitoring alarms alert teams when input distributions shift enough to impair model accuracy."
    },
    {
        "source": 92,
        "stem": "A model provides a recommendation that a human reviewer accepts without checking because the model sounds confident. What risk is illustrated?",
        "options": [
            "Automation bias",
            "Data normalization",
            "Packet loss",
            "Cache locality"
        ],
        "answer_text": "Automation bias",
        "explanation": "Automation bias is the cognitive tendency for human operators to blindly trust automated recommendations and overlook errors."
    },
    {
        "source": 93,
        "stem": "A safety-critical AI system has an uncertain prediction. Which response is generally safer?",
        "options": [
            "Escalate, abstain or request additional evidence when uncertainty crosses a defined threshold.",
            "Force a confident answer.",
            "Hide uncertainty from the operator.",
            "Randomly choose a class."
        ],
        "answer_text": "Escalate, abstain or request additional evidence when uncertainty crosses a defined threshold.",
        "explanation": "Abstention and human escalation under high uncertainty is standard fail-safe design in safety-critical systems."
    },
    {
        "source": 94,
        "stem": "A team wants to compare two model versions fairly. What should remain controlled?",
        "options": [
            "Evaluation data, metric definitions and test procedure",
            "Only the UI theme",
            "The number of engineers observing the test",
            "The order of unrelated meetings"
        ],
        "answer_text": "Evaluation data, metric definitions and test procedure",
        "explanation": "A fair comparison requires identical benchmarking datasets, scoring rubrics, and execution environments."
    },
    {
        "source": 95,
        "stem": "A red-team exercise deliberately tries prompt injection, data exfiltration and unsafe tool use. What is its purpose?",
        "options": [
            "Identify failure modes before or during controlled deployment.",
            "Increase model size.",
            "Replace all monitoring.",
            "Guarantee zero future vulnerabilities."
        ],
        "answer_text": "Identify failure modes before or during controlled deployment.",
        "explanation": "Red-teaming actively exposes adversarial attack vectors and failure modes to fortify system guardrails before malicious exploitation."
    },
    {
        "source": 96,
        "stem": "A model's output is used to make a high-impact decision. Which principle is most appropriate?",
        "options": [
            "The level of oversight and validation should reflect the potential harm of errors.",
            "All decisions should be fully automated regardless of risk.",
            "High-impact decisions require no logging.",
            "Risk is determined only by model size."
        ],
        "answer_text": "The level of oversight and validation should reflect the potential harm of errors.",
        "explanation": "Proportional risk governance mandates rigorous validation, auditability, and human intervention proportional to the severity of potential harm."
    },
    {
        "source": 97,
        "stem": "A dataset contains many duplicate records from one source. What evaluation problem can duplicates create?",
        "options": [
            "They can overweight that pattern and make the dataset less representative.",
            "They always improve fairness.",
            "They eliminate sampling bias.",
            "They guarantee independence between examples."
        ],
        "answer_text": "They can overweight that pattern and make the dataset less representative.",
        "explanation": "Duplicate data points artificially skew evaluation metrics toward duplicated patterns, degrading benchmark representativeness."
    },
    {
        "source": 98,
        "stem": "A model is accurate overall but its performance drops sharply for a specific language. What should be added to evaluation?",
        "options": [
            "Language- or subgroup-specific test coverage",
            "Only more aggregate accuracy",
            "No additional testing",
            "A higher generation temperature"
        ],
        "answer_text": "Language- or subgroup-specific test coverage",
        "explanation": "Stratified subgroup slicing ensures underperforming languages and demographic cohorts are surfaced and tested."
    },
    {
        "source": 99,
        "stem": "A team reports that a model is '90% accurate' without stating the dataset, metric definition or evaluation conditions. What is missing?",
        "options": [
            "Evaluation context needed to interpret the claim",
            "A larger context window",
            "A database index",
            "A tokenizer"
        ],
        "answer_text": "Evaluation context needed to interpret the claim",
        "explanation": "Isolated metrics are meaningless without contextual specification of dataset distribution, split methodology, and evaluation criteria."
    },
    {
        "source": 100,
        "stem": "A deployed model is updated and a previously passing safety test now fails. What should the team do?",
        "options": [
            "Treat the regression as a release-blocking signal until investigated and addressed.",
            "Ignore it because the model is newer.",
            "Delete the failing test.",
            "Increase randomness."
        ],
        "answer_text": "Treat the regression as a release-blocking signal until investigated and addressed.",
        "explanation": "Safety regressions must serve as critical release blockers to prevent hazardous behavioral drift from entering production."
    },

    # Topic 5: Programming Logic & Problem Solving (101 - 125)
    {
        "source": 101,
        "stem": "An array contains values 2, 4, 6, 8 and a loop repeatedly adds the current value to a running total. What is the final total?",
        "options": [
            "20",
            "16",
            "18",
            "24"
        ],
        "answer_text": "20",
        "explanation": "The sum of elements is 2 + 4 + 6 + 8 = 20."
    },
    {
        "source": 102,
        "stem": "A loop starts with i = 1 and doubles i each iteration until i exceeds n. What is its time complexity?",
        "options": [
            "O(log n)",
            "O(n)",
            "O(n log n)",
            "O(n²)"
        ],
        "answer_text": "O(log n)",
        "explanation": "Multiplying the loop counter by 2 each iteration means i takes values 2^k, reaching n in approximately log2(n) iterations."
    },
    {
        "source": 103,
        "stem": "A loop increments i by 3 while i < n. What is its asymptotic time complexity?",
        "options": [
            "O(n)",
            "O(1)",
            "O(log n)",
            "O(n²)"
        ],
        "answer_text": "O(n)",
        "explanation": "The loop executes n/3 iterations; constant factor 1/3 is dropped in asymptotic analysis, resulting in O(n)."
    },
    {
        "source": 104,
        "stem": "A function recursively calls itself twice on input n-1 without memoization and performs constant work otherwise. What is the dominant growth pattern?",
        "options": [
            "Exponential",
            "Logarithmic",
            "Linear",
            "Constant"
        ],
        "answer_text": "Exponential",
        "explanation": "The recurrence T(n) = 2T(n-1) + O(1) forms a binary recursion tree of depth n with 2^n leaves, yielding O(2^n) exponential growth."
    },
    {
        "source": 105,
        "stem": "A program checks whether every element in an array has appeared before using a hash set. What is the expected time complexity?",
        "options": [
            "O(n)",
            "O(log n)",
            "O(n²)",
            "O(2^n)"
        ],
        "answer_text": "O(n)",
        "explanation": "Hash set insertions and lookups take average O(1) time each; across n elements the total expected runtime is O(n)."
    },
    {
        "source": 106,
        "stem": "A developer uses integer division where floating-point division was required. Which class of bug is most directly involved?",
        "options": [
            "Incorrect arithmetic semantics",
            "Memory leak",
            "Race condition",
            "Deadlock"
        ],
        "answer_text": "Incorrect arithmetic semantics",
        "explanation": "Integer truncation discards fractional remainders, corrupting subsequent arithmetic calculations."
    },
    {
        "source": 107,
        "stem": "A loop condition is `while (i <= n)` but i is never changed inside the loop. What is the likely issue when the condition initially holds?",
        "options": [
            "Infinite loop",
            "Stack overflow from recursion",
            "Integer sorting",
            "Successful termination"
        ],
        "answer_text": "Infinite loop",
        "explanation": "If the loop condition is satisfied initially and loop variables never update toward termination, the loop runs indefinitely."
    },
    {
        "source": 108,
        "stem": "A program compares strings using reference identity when it needs content equality. What type of logical error can result?",
        "options": [
            "Equal-looking strings may be treated as different objects.",
            "The strings are always sorted automatically.",
            "The program gains thread safety.",
            "The comparison becomes O(1) in every language."
        ],
        "answer_text": "Equal-looking strings may be treated as different objects.",
        "explanation": "Reference equality compares memory pointers rather than string character sequences, yielding false negatives for distinct string instances with identical contents."
    },
    {
        "source": 109,
        "stem": "A function swaps adjacent elements repeatedly until no inversion remains. Which algorithmic idea does this resemble?",
        "options": [
            "Bubble sort",
            "Binary search",
            "Hashing",
            "Breadth-first search"
        ],
        "answer_text": "Bubble sort",
        "explanation": "Bubble sort repeatedly iterates across adjacent pairs and swaps inverted elements until the entire collection is ordered."
    },
    {
        "source": 110,
        "stem": "A sorted array is searched by repeatedly comparing the target with the middle element and discarding half the range. What is the complexity?",
        "options": [
            "O(log n)",
            "O(n)",
            "O(n²)",
            "O(2^n)"
        ],
        "answer_text": "O(log n)",
        "explanation": "Binary search halves the candidate search interval in each step, taking O(log n) time."
    },
    {
        "source": 111,
        "stem": "A program uses `x % 2` to decide whether an integer is even. Which property is being tested?",
        "options": [
            "Remainder after division by two",
            "Integer square root",
            "Bitwise complement",
            "Floating-point precision"
        ],
        "answer_text": "Remainder after division by two",
        "explanation": "The modulo operator `%` calculates the remainder after integer division; an even number yields remainder 0 upon division by 2."
    },
    {
        "source": 112,
        "stem": "A function receives an array and a target and must return whether two different elements sum to the target. Which expected-time strategy is strongest?",
        "options": [
            "Hash set of previously seen values",
            "Compare every pair only",
            "Sort repeatedly inside the loop",
            "Generate all permutations"
        ],
        "answer_text": "Hash set of previously seen values",
        "explanation": "Iterating once while checking if `target - num` exists in a hash set achieves O(n) linear time complexity."
    },
    {
        "source": 113,
        "stem": "A developer nests a loop of n iterations inside another loop of n iterations. What is the worst-case time complexity if each iteration performs constant work?",
        "options": [
            "O(n²)",
            "O(n)",
            "O(log n)",
            "O(2^n)"
        ],
        "answer_text": "O(n²)",
        "explanation": "Executing n outer iterations with n inner iterations of O(1) work each results in n * n = O(n²) quadratic complexity."
    },
    {
        "source": 114,
        "stem": "A program stores a recursive function's calls on the call stack. What resource grows with recursion depth?",
        "options": [
            "Stack space",
            "Network bandwidth",
            "Database rows",
            "Disk partitions"
        ],
        "answer_text": "Stack space",
        "explanation": "Each recursive call allocates a stack activation frame for local variables and return addresses, expanding stack memory usage."
    },
    {
        "source": 115,
        "stem": "A function returns the maximum value in an unsorted array. What lower-bound reasoning applies to a comparison-based scan?",
        "options": [
            "Every element must potentially be inspected, so O(n) time is necessary.",
            "O(log n) is always sufficient.",
            "O(1) is sufficient without assumptions.",
            "O(n²) is required."
        ],
        "answer_text": "Every element must potentially be inspected, so O(n) time is necessary.",
        "explanation": "In an unsorted array, any unexamined element could be the maximum; hence all n elements must be inspected in Ω(n) time."
    },
    {
        "source": 116,
        "stem": "A program has two independent loops, one O(n) and another O(n). What is the combined asymptotic complexity?",
        "options": [
            "O(n)",
            "O(n²)",
            "O(log n)",
            "O(2n) as a distinct asymptotic class"
        ],
        "answer_text": "O(n)",
        "explanation": "Sequential independent loops add their runtimes: O(n) + O(n) = O(2n) = O(n) by dropping constant multipliers."
    },
    {
        "source": 117,
        "stem": "A loop performs `i = i * 2` and then `i = i + 1` each iteration. Which statement is most accurate?",
        "options": [
            "The multiplicative growth still gives logarithmic iteration count.",
            "The loop is necessarily quadratic.",
            "The loop is constant time for all n.",
            "The increment makes it exponential."
        ],
        "answer_text": "The multiplicative growth still gives logarithmic iteration count.",
        "explanation": "Because the loop index more than doubles on every pass (2i + 1), it reaches n in O(log n) steps."
    },
    {
        "source": 118,
        "stem": "A program copies an array into another array before modifying the copy. What property is being protected?",
        "options": [
            "Independence of the copied data from later changes to the original",
            "Network reliability",
            "Database atomicity",
            "Thread scheduling"
        ],
        "answer_text": "Independence of the copied data from later changes to the original",
        "explanation": "Defensive copying prevents shared mutable reference side-effects between the original dataset and consumer modifications."
    },
    {
        "source": 119,
        "stem": "A developer uses a floating-point number as a loop counter for equality with a target value. Why can this be risky?",
        "options": [
            "Floating-point representation can make exact equality unreliable.",
            "Floating-point values cannot be compared.",
            "Floating-point arithmetic is always exact.",
            "Loop counters must always be strings."
        ],
        "answer_text": "Floating-point representation can make exact equality unreliable.",
        "explanation": "IEEE 754 binary floating-point representation rounding errors can prevent counters from hitting exact equality targets, leading to infinite loops."
    },
    {
        "source": 120,
        "stem": "A function's output depends on an uninitialized variable. What kind of defect is this?",
        "options": [
            "Undefined or indeterminate program behavior",
            "Correct memoization",
            "Stable deterministic computation",
            "Normalization"
        ],
        "answer_text": "Undefined or indeterminate program behavior",
        "explanation": "Reading uninitialized variables accesses whatever garbage bits exist in that memory segment, producing undefined behavior."
    },
    {
        "source": 121,
        "stem": "A program reads n values and updates a single running minimum without storing the whole array. What is the auxiliary space?",
        "options": [
            "O(1)",
            "O(n)",
            "O(n²)",
            "O(log n)"
        ],
        "answer_text": "O(1)",
        "explanation": "Maintaining a single scalar variable for the running minimum requires constant extra auxiliary memory regardless of n."
    },
    {
        "source": 122,
        "stem": "A recursive binary search is implemented incorrectly so the same search interval is passed again without shrinking. What is the likely consequence?",
        "options": [
            "Non-termination or excessive recursion",
            "Guaranteed O(log n) behavior",
            "Automatic memoization",
            "Constant-time completion"
        ],
        "answer_text": "Non-termination or excessive recursion",
        "explanation": "Without shrinking the subproblem window toward a base case, recursion continues until memory is exhausted, throwing a stack overflow."
    },
    {
        "source": 123,
        "stem": "A program uses short-circuit AND and the left operand is false. What happens to the right operand in languages supporting short-circuit evaluation?",
        "options": [
            "It may not be evaluated.",
            "It must always be evaluated first.",
            "It is executed twice.",
            "It is converted into a loop."
        ],
        "answer_text": "It may not be evaluated.",
        "explanation": "In boolean logic `A && B`, if A evaluates to false, the whole expression is guaranteed false; hence B is bypassed (short-circuited)."
    },
    {
        "source": 124,
        "stem": "A developer changes an algorithm from checking all pairs to sorting and using two pointers. What trade-off is typically being explored?",
        "options": [
            "Lower time complexity at the possible cost of sorting and additional constraints",
            "Guaranteed constant time",
            "Elimination of all memory use",
            "Removal of correctness requirements"
        ],
        "answer_text": "Lower time complexity at the possible cost of sorting and additional constraints",
        "explanation": "Transitioning from brute force O(n²) to sorting + two-pointer O(n log n) reduces time complexity while requiring an ordered structure."
    },
    {
        "source": 125,
        "stem": "A function repeatedly recomputes the same recursive subproblem. Which technique can reduce this repeated work?",
        "options": [
            "Memoization",
            "Randomization without state",
            "Removing base cases",
            "Increasing recursion depth"
        ],
        "answer_text": "Memoization",
        "explanation": "Memoization caches the output of expensive recursive function calls based on argument keys, avoiding duplicate subtree evaluations."
    },

    # Topic 6: Data Structures & Algorithms (126 - 150)
    {
        "source": 126,
        "stem": "A browser's back-navigation needs to remove the most recently visited page first. Which data structure matches the access pattern?",
        "options": [
            "Stack",
            "Queue",
            "Min-heap",
            "Graph"
        ],
        "answer_text": "Stack",
        "explanation": "A Stack operates on Last-In, First-Out (LIFO) semantics, making it ideal for browser back navigation."
    },
    {
        "source": 127,
        "stem": "A printer processes jobs in the order they arrive. Which structure naturally models this behavior?",
        "options": [
            "Queue",
            "Stack",
            "Binary search tree",
            "Hash set"
        ],
        "answer_text": "Queue",
        "explanation": "A Queue operates on First-In, First-Out (FIFO) semantics, exactly matching job buffering and print queues."
    },
    {
        "source": 128,
        "stem": "A system repeatedly needs the smallest element and then inserts new elements. Which structure is designed for efficient minimum extraction?",
        "options": [
            "Min-heap",
            "Stack",
            "Linked list",
            "Hash table"
        ],
        "answer_text": "Min-heap",
        "explanation": "A Min-Heap allows extracting the minimum element in O(log n) time and inserting new elements in O(log n) time."
    },
    {
        "source": 129,
        "stem": "A dictionary needs average constant-time key lookup. Which structure is the typical choice?",
        "options": [
            "Hash table",
            "Array with linear search",
            "Stack",
            "Queue"
        ],
        "answer_text": "Hash table",
        "explanation": "Hash tables compute array indices via a hash function, providing average O(1) key lookups, insertions, and deletions."
    },
    {
        "source": 130,
        "stem": "A singly linked list must insert a node immediately after a known node. What is the typical time complexity if the node reference is already available?",
        "options": [
            "O(1)",
            "O(log n)",
            "O(n log n)",
            "O(n²)"
        ],
        "answer_text": "O(1)",
        "explanation": "With a direct pointer to the predecessor node, adjusting two `next` pointers requires constant O(1) time without traversal."
    },
    {
        "source": 131,
        "stem": "A binary search tree becomes highly skewed because keys arrive in sorted order. What is the resulting worst-case search complexity?",
        "options": [
            "O(n)",
            "O(log n)",
            "O(1)",
            "O(n log n)"
        ],
        "answer_text": "O(n)",
        "explanation": "Inserting sorted items into a standard BST degenerates the tree into a linked list of height n, making search O(n)."
    },
    {
        "source": 132,
        "stem": "A balanced binary search tree keeps height proportional to log n. What benefit follows?",
        "options": [
            "Search, insertion and deletion can remain O(log n) in the balanced case.",
            "Every operation becomes O(1).",
            "Traversal becomes O(log log n).",
            "Sorting becomes unnecessary."
        ],
        "answer_text": "Search, insertion and deletion can remain O(log n) in the balanced case.",
        "explanation": "Self-balancing binary search trees (e.g. AVL, Red-Black) guarantee height h <= c * log(n), ensuring O(log n) worst-case operations."
    },
    {
        "source": 133,
        "stem": "A graph problem asks for the shortest number of edges between two nodes in an unweighted graph. Which traversal is appropriate?",
        "options": [
            "Breadth-first search",
            "Depth-first search only",
            "Heap sort",
            "Binary search"
        ],
        "answer_text": "Breadth-first search",
        "explanation": "BFS explores vertices level by level, ensuring that the first time a destination node is reached, the path has minimum edge length."
    },
    {
        "source": 134,
        "stem": "A graph contains weighted edges that are all non-negative, and the task is single-source shortest paths. Which classic algorithm fits?",
        "options": [
            "Dijkstra's algorithm",
            "Binary search",
            "KMP",
            "Union-find alone"
        ],
        "answer_text": "Dijkstra's algorithm",
        "explanation": "Dijkstra's greedy priority-queue algorithm solves the single-source shortest path problem efficiently when edge weights >= 0."
    },
    {
        "source": 135,
        "stem": "A graph has negative edge weights but no negative cycle. Which algorithm can handle single-source shortest paths?",
        "options": [
            "Bellman-Ford",
            "Binary search",
            "Heapify",
            "Counting sort"
        ],
        "answer_text": "Bellman-Ford",
        "explanation": "Bellman-Ford relaxes edges |V|-1 times and supports negative edge weights while detecting negative cycles."
    },
    {
        "source": 136,
        "stem": "A minimum spanning tree is required for a connected weighted undirected graph. Which algorithms are appropriate?",
        "options": [
            "Kruskal's or Prim's algorithm",
            "BFS only",
            "Binary search only",
            "KMP only"
        ],
        "answer_text": "Kruskal's or Prim's algorithm",
        "explanation": "Kruskal's (edge-based greedy with DSU) and Prim's (vertex-based greedy with priority queue) find minimum spanning trees."
    },
    {
        "source": 137,
        "stem": "Kruskal's algorithm needs to determine whether adding an edge would create a cycle. Which structure is commonly used?",
        "options": [
            "Disjoint-set union",
            "Stack only",
            "Queue only",
            "Trie"
        ],
        "answer_text": "Disjoint-set union",
        "explanation": "Disjoint Set Union (DSU / Union-Find) with path compression checks whether two vertices belong to the same component in near O(1) time."
    },
    {
        "source": 138,
        "stem": "A prefix dictionary stores words so common prefixes share nodes. Which structure is most suitable?",
        "options": [
            "Trie",
            "Heap",
            "Queue",
            "Disjoint set"
        ],
        "answer_text": "Trie",
        "explanation": "A Trie (prefix tree) stores string keys along edges, enabling fast prefix-based lookups and autocomplete."
    },
    {
        "source": 139,
        "stem": "A dynamic programming solution stores the best answer for smaller subproblems and reuses them. What property makes this useful?",
        "options": [
            "Overlapping subproblems",
            "Random hashing",
            "Packet retransmission",
            "Referential transparency only"
        ],
        "answer_text": "Overlapping subproblems",
        "explanation": "Dynamic programming avoids exponential recomputations specifically when smaller recursive subproblems overlap and repeat."
    },
    {
        "source": 140,
        "stem": "A greedy algorithm makes a locally optimal choice at each step. When is this strategy justified?",
        "options": [
            "When the problem has a valid greedy-choice property and optimal substructure.",
            "Whenever recursion is unavailable.",
            "Whenever input is sorted.",
            "For every optimization problem."
        ],
        "answer_text": "When the problem has a valid greedy-choice property and optimal substructure.",
        "explanation": "Greedy algorithms yield mathematically provable global optima only if the problem exhibits both optimal substructure and the greedy-choice property."
    },
    {
        "source": 141,
        "stem": "A two-pointer technique scans a sorted array from both ends to find a target sum. What is its typical time complexity?",
        "options": [
            "O(n)",
            "O(n²)",
            "O(log n) for the whole scan",
            "O(2^n)"
        ],
        "answer_text": "O(n)",
        "explanation": "With pointers initialized at both ends moving inwards, each element is visited at most once, taking O(n) total time."
    },
    {
        "source": 142,
        "stem": "A sliding-window algorithm maintains a contiguous range while moving its boundaries. Which problem shape commonly benefits?",
        "options": [
            "Subarray or substring constraints",
            "Arbitrary graph coloring only",
            "Tree balancing only",
            "Matrix inversion only"
        ],
        "answer_text": "Subarray or substring constraints",
        "explanation": "Sliding window algorithms efficiently compute optimum properties across contiguous subarrays or substrings without re-evaluating internal elements."
    },
    {
        "source": 143,
        "stem": "A stable sorting algorithm preserves the relative order of equal keys. Why can this matter?",
        "options": [
            "It preserves information encoded by prior ordering among equal-key records.",
            "It guarantees O(1) space.",
            "It always runs in O(n).",
            "It prevents all comparisons."
        ],
        "answer_text": "It preserves information encoded by prior ordering among equal-key records.",
        "explanation": "Stability ensures multi-criteria sorting (e.g. sort by first name, then sort by department) retains previous sorting results among ties."
    },
    {
        "source": 144,
        "stem": "Merge sort is applied to n elements. What is its typical time complexity?",
        "options": [
            "O(n log n)",
            "O(n²)",
            "O(log n)",
            "O(2^n)"
        ],
        "answer_text": "O(n log n)",
        "explanation": "Merge sort recursively divides in log2(n) levels and performs linear O(n) merging work per level, consistently achieving O(n log n)."
    },
    {
        "source": 145,
        "stem": "Quick sort chooses a poor pivot repeatedly on already ordered input. What worst-case behavior can result?",
        "options": [
            "O(n²)",
            "O(log n)",
            "O(1)",
            "O(n) for every partition strategy"
        ],
        "answer_text": "O(n²)",
        "explanation": "If pivot selection consistently yields unbalanced 0 / n-1 partitions, recursion depth hits n with O(n) comparisons per level, degenerating to O(n²)."
    },
    {
        "source": 146,
        "stem": "A dynamic programming solution uses a table indexed by position and remaining capacity. What is this an example of?",
        "options": [
            "State-based tabulation",
            "Hash collision resolution",
            "Graph traversal",
            "Stack unwinding"
        ],
        "answer_text": "State-based tabulation",
        "explanation": "Iterative bottom-up filling of multidimensional tables representing subproblem states is state-based tabulation."
    },
    {
        "source": 147,
        "stem": "A recursive tree traversal visits left subtree, node, then right subtree. What traversal is this?",
        "options": [
            "In-order",
            "Pre-order",
            "Post-order",
            "Level-order"
        ],
        "answer_text": "In-order",
        "explanation": "In-order traversal visits Left -> Root -> Right. For a Binary Search Tree, in-order traversal visits nodes in ascending sorted sequence."
    },
    {
        "source": 148,
        "stem": "A topological ordering is required for tasks with prerequisite dependencies. What graph property is required?",
        "options": [
            "The dependency graph must be a directed acyclic graph.",
            "The graph must be complete.",
            "The graph must be undirected.",
            "All edges must have equal weights."
        ],
        "answer_text": "The dependency graph must be a directed acyclic graph.",
        "explanation": "Topological sorting linearly orders directed vertices; cycles would introduce mutual circular dependencies where no node can be scheduled first."
    },
    {
        "source": 149,
        "stem": "A cache uses least-recently-used eviction. Which pair of structures can support O(1) lookup and recency updates?",
        "options": [
            "Hash map plus doubly linked list",
            "Stack plus queue only",
            "Binary search tree only",
            "Array plus recursion only"
        ],
        "answer_text": "Hash map plus doubly linked list",
        "explanation": "A hash map provides O(1) key-to-node lookup, while a doubly linked list supports O(1) node detachment and head insertion."
    },
    {
        "source": 150,
        "stem": "A problem asks for the number of connected components in an undirected graph. Which approaches are appropriate?",
        "options": [
            "DFS/BFS traversal or disjoint-set union",
            "Binary search on vertices",
            "Heap sort only",
            "Trie traversal only"
        ],
        "answer_text": "DFS/BFS traversal or disjoint-set union",
        "explanation": "Graph traversals (DFS/BFS) count connected islands by exploring unvisited nodes, while DSU counts disjoint root representatives."
    },

    # Topic 7: Software Engineering Fundamentals (151 - 175)
    {
        "source": 151,
        "stem": "A team divides a large application into components with clear interfaces so each can change internally without affecting callers. What principle is being pursued?",
        "options": [
            "Encapsulation and modularity",
            "Global coupling",
            "Shared mutable state everywhere",
            "Circular dependency"
        ],
        "answer_text": "Encapsulation and modularity",
        "explanation": "Encapsulating internal complexity behind well-defined modular interfaces isolates callers from implementation changes."
    },
    {
        "source": 152,
        "stem": "A class should expose only the operations clients need while hiding implementation details. Which OOP concept best fits?",
        "options": [
            "Encapsulation",
            "Inheritance",
            "Recursion",
            "Serialization"
        ],
        "answer_text": "Encapsulation",
        "explanation": "Encapsulation restricts direct access to an object's internal representation, exposing only necessary public operations."
    },
    {
        "source": 153,
        "stem": "A subclass provides a specialized implementation of a method defined by its parent type. What concept is demonstrated?",
        "options": [
            "Method overriding",
            "Method overloading",
            "Encapsulation",
            "Aggregation"
        ],
        "answer_text": "Method overriding",
        "explanation": "Method overriding occurs when a child class provides a specific implementation of a method already declared in its superclass."
    },
    {
        "source": 154,
        "stem": "Two methods have the same name but different parameter lists within the same class. What is this commonly called?",
        "options": [
            "Method overloading",
            "Method overriding",
            "Dependency injection",
            "Serialization"
        ],
        "answer_text": "Method overloading",
        "explanation": "Defining multiple methods with the identical identifier but different argument signatures in the same class is compile-time method overloading."
    },
    {
        "source": 155,
        "stem": "A service receives its repository dependency from outside instead of constructing it internally. What design principle is illustrated?",
        "options": [
            "Dependency injection",
            "Tight coupling",
            "Global state",
            "Inheritance-only design"
        ],
        "answer_text": "Dependency injection",
        "explanation": "Dependency Injection passes collaborators into constructors or setters rather than letting the component hardcode concrete dependencies."
    },
    {
        "source": 156,
        "stem": "A module changes internally but its public contract remains stable. What property helps minimize impact on callers?",
        "options": [
            "Abstraction through a stable interface",
            "Direct access to every internal field",
            "Global variables",
            "Circular dependencies"
        ],
        "answer_text": "Abstraction through a stable interface",
        "explanation": "Clean abstractions isolate callers from churn, permitting internal performance or architecture revisions without breaking clients."
    },
    {
        "source": 157,
        "stem": "A unit test fails after a refactor even though the implementation change was intended to preserve behavior. What should the team do first?",
        "options": [
            "Determine whether the failure indicates a real regression or an outdated test expectation.",
            "Delete the test immediately.",
            "Ignore all failing tests.",
            "Deploy before investigating."
        ],
        "answer_text": "Determine whether the failure indicates a real regression or an outdated test expectation.",
        "explanation": "Engineers must diagnose root cause first: discerning whether an actual regression was introduced or whether test fixtures made obsolete implementation assumptions."
    },
    {
        "source": 158,
        "stem": "A test verifies that a function returns the correct result for one isolated input without external services. What type of test is this?",
        "options": [
            "Unit test",
            "Load test",
            "Penetration test",
            "End-to-end deployment test"
        ],
        "answer_text": "Unit test",
        "explanation": "Unit testing validates individual functional components in complete isolation without connecting to databases or external networks."
    },
    {
        "source": 159,
        "stem": "A test exercises the entire application through its public interface and real integrated components. What level is this?",
        "options": [
            "End-to-end test",
            "Unit test",
            "Static type check",
            "Code formatting"
        ],
        "answer_text": "End-to-end test",
        "explanation": "End-to-end (E2E) testing validates full user workflows across frontends, backend APIs, databases, and third-party integrations."
    },
    {
        "source": 160,
        "stem": "A bug occurs only when two threads update the same shared counter concurrently. What class of issue is likely?",
        "options": [
            "Race condition",
            "Syntax error",
            "Memory leak only",
            "Compilation warning"
        ],
        "answer_text": "Race condition",
        "explanation": "A race condition occurs when concurrent threads execute non-atomic read-modify-write operations on shared state without synchronization."
    },
    {
        "source": 161,
        "stem": "Two threads each hold a lock needed by the other and neither can proceed. What condition is this?",
        "options": [
            "Deadlock",
            "Cache miss",
            "Serialization",
            "Polymorphism"
        ],
        "answer_text": "Deadlock",
        "explanation": "Deadlock is a concurrency stall where two or more processes are permanently blocked because each holds a lock the other requires."
    },
    {
        "source": 162,
        "stem": "A code review finds that one function performs validation, persistence, email sending and report formatting. What design concern is most apparent?",
        "options": [
            "Excessive responsibility and poor separation of concerns",
            "Excessive encapsulation",
            "Strong cohesion",
            "Correct single responsibility"
        ],
        "answer_text": "Excessive responsibility and poor separation of concerns",
        "explanation": "Violating the Single Responsibility Principle (SRP) results in bloated, tightly-coupled routines that are difficult to test and maintain."
    },
    {
        "source": 163,
        "stem": "A database schema change must be applied consistently across environments and rolled back if deployment fails. What practice helps?",
        "options": [
            "Versioned database migrations",
            "Manual undocumented edits",
            "Random schema changes",
            "Disabling backups"
        ],
        "answer_text": "Versioned database migrations",
        "explanation": "Versioned migration scripts (e.g. Flyway, Liquibase, Alembic) maintain immutable schema histories and programmatic up/down transitions."
    },
    {
        "source": 164,
        "stem": "A CI pipeline automatically builds and tests every pull request. What is the primary engineering benefit?",
        "options": [
            "Early detection of integration and regression problems",
            "Guaranteed bug-free production code",
            "Elimination of code review",
            "Removal of version control"
        ],
        "answer_text": "Early detection of integration and regression problems",
        "explanation": "Continuous Integration catches compilation errors, broken contracts, and test failures early before merging into trunk branches."
    },
    {
        "source": 165,
        "stem": "A team uses Git branches and pull requests to integrate changes. What problem does version control primarily solve?",
        "options": [
            "Tracking and coordinating changes to source code",
            "Replacing runtime monitoring",
            "Guaranteeing algorithmic optimality",
            "Encrypting all application data"
        ],
        "answer_text": "Tracking and coordinating changes to source code",
        "explanation": "Version control systems maintain chronological histories of code revisions and allow multiple engineers to collaborate safely."
    },
    {
        "source": 166,
        "stem": "A deployment introduces a severe defect and the previous version is known to work. What operational capability is most useful?",
        "options": [
            "Fast rollback to a known-good version",
            "Deleting the repository",
            "Increasing deployment batch size",
            "Removing health checks"
        ],
        "answer_text": "Fast rollback to a known-good version",
        "explanation": "Fast automated rollback instantly restores service availability by redeploying the prior stable release artifact."
    },
    {
        "source": 167,
        "stem": "A service repeatedly retries a failed external request immediately and creates even more load during an outage. What improvement is appropriate?",
        "options": [
            "Bounded retries with backoff and jitter",
            "Infinite immediate retries",
            "Removing all timeouts",
            "Increasing request frequency"
        ],
        "answer_text": "Bounded retries with backoff and jitter",
        "explanation": "Exponential backoff with randomized jitter prevents retry storms from overwhelming struggling downstream dependencies."
    },
    {
        "source": 168,
        "stem": "An API receives malformed JSON. Where should validation occur?",
        "options": [
            "At the service boundary before business logic uses the data",
            "Only after database insertion",
            "Only in the UI",
            "Never; clients are always trusted"
        ],
        "answer_text": "At the service boundary before business logic uses the data",
        "explanation": "Input validation must happen immediately at the edge boundary / controller layer before executing domain logic."
    },
    {
        "source": 169,
        "stem": "A secret API key is committed to a public repository. What is the appropriate response?",
        "options": [
            "Revoke/rotate the exposed secret and remove it from the secure configuration path.",
            "Rename the variable and keep the same secret.",
            "Hide the commit locally only.",
            "Add the secret to another source file."
        ],
        "answer_text": "Revoke/rotate the exposed secret and remove it from the secure configuration path.",
        "explanation": "Exposed credentials must be revoked immediately because commit histories are scraped by botnets within seconds."
    },
    {
        "source": 170,
        "stem": "A system uses logs to diagnose production failures. What makes logs more useful?",
        "options": [
            "Structured, contextual events with appropriate severity and correlation information",
            "Logging every secret and password",
            "Random messages without timestamps",
            "Removing request identifiers"
        ],
        "answer_text": "Structured, contextual events with appropriate severity and correlation information",
        "explanation": "Structured JSON logs containing trace IDs, request timestamps, and log levels allow automated aggregation and querying in ELK/Datadog."
    },
    {
        "source": 171,
        "stem": "A service's response time increases as traffic grows because every request performs an expensive database scan. What should be investigated?",
        "options": [
            "Query plans, indexes and access patterns",
            "UI color schemes",
            "Source-code comments only",
            "Increasing log verbosity"
        ],
        "answer_text": "Query plans, indexes and access patterns",
        "explanation": "Analyzing database execution plans (EXPLAIN ANALYZE) reveals sequential scans and missing B-tree indexes."
    },
    {
        "source": 172,
        "stem": "A team wants to release a feature to a small percentage of users before full rollout. What technique fits?",
        "options": [
            "Canary release",
            "Big-bang release",
            "Manual source deletion",
            "Static compilation"
        ],
        "answer_text": "Canary release",
        "explanation": "Canary deployments route a small fraction of real production traffic to the new revision to monitor error rates before general availability."
    },
    {
        "source": 173,
        "stem": "A developer changes an implementation while keeping behavior unchanged and improves internal structure. What is this?",
        "options": [
            "Refactoring",
            "Feature expansion",
            "Data migration",
            "Incident response"
        ],
        "answer_text": "Refactoring",
        "explanation": "Refactoring restructures internal code architecture, readability, and modularity without changing outward observable functionality."
    },
    {
        "source": 174,
        "stem": "A codebase has a dependency graph with cycles among modules. Why can this be problematic?",
        "options": [
            "It increases coupling and can complicate testing, deployment and change isolation.",
            "It guarantees modularity.",
            "It guarantees faster builds.",
            "It eliminates integration risks."
        ],
        "answer_text": "It increases coupling and can complicate testing, deployment and change isolation.",
        "explanation": "Circular dependencies tightly couple modules, inhibiting independent testing, compilation, and clean architectural boundaries."
    },
    {
        "source": 175,
        "stem": "A service should fail fast when a downstream dependency is unavailable instead of consuming all worker threads waiting indefinitely. Which mechanism helps?",
        "options": [
            "Timeout and circuit-breaker controls",
            "Infinite blocking",
            "Unlimited retries",
            "Removing dependency health checks"
        ],
        "answer_text": "Timeout and circuit-breaker controls",
        "explanation": "Circuit breakers open after repeated failures, immediately shedding requests to avoid thread exhaustion and cascading failures."
    },

    # Topic 8: Modern Engineering Awareness (176 - 200)
    {
        "source": 176,
        "stem": "A company wants virtual machines, networking and storage while retaining responsibility for the guest operating system. Which cloud model fits?",
        "options": [
            "IaaS",
            "PaaS",
            "SaaS",
            "FaaS only"
        ],
        "answer_text": "IaaS",
        "explanation": "Infrastructure as a Service (IaaS, e.g. AWS EC2) provides raw compute and storage while customers manage the OS, runtime, and applications."
    },
    {
        "source": 177,
        "stem": "A developer deploys application code while the cloud provider manages the runtime platform and underlying servers. Which model best fits?",
        "options": [
            "PaaS",
            "IaaS",
            "SaaS",
            "Colocation only"
        ],
        "answer_text": "PaaS",
        "explanation": "Platform as a Service (PaaS, e.g. Heroku, Render) handles operating system patching and runtime environments so developers focus on application code."
    },
    {
        "source": 178,
        "stem": "A user consumes a complete hosted business application through a browser without managing its servers. Which model is this?",
        "options": [
            "SaaS",
            "IaaS",
            "Bare metal",
            "Local-only deployment"
        ],
        "answer_text": "SaaS",
        "explanation": "Software as a Service (SaaS, e.g. Google Workspace, Salesforce) delivers end-user applications managed entirely by the vendor."
    },
    {
        "source": 179,
        "stem": "A service automatically adds application instances when traffic increases and removes them when traffic falls. What capability is this?",
        "options": [
            "Auto-scaling",
            "Static linking",
            "Normalization",
            "Tokenization"
        ],
        "answer_text": "Auto-scaling",
        "explanation": "Auto-scaling dynamically provisions or decommissions compute instances based on CPU utilization, request throughput, or queue backlog."
    },
    {
        "source": 180,
        "stem": "A team deploys an application in containers so it runs consistently across environments. What is the main benefit?",
        "options": [
            "Packaging the application with its dependencies in a portable unit",
            "Eliminating all operating-system concerns",
            "Guaranteeing zero vulnerabilities",
            "Replacing source control"
        ],
        "answer_text": "Packaging the application with its dependencies in a portable unit",
        "explanation": "Containers bundle the application binaries, runtime, libraries, and configurations, ensuring identical behavior across development and cloud environments."
    },
    {
        "source": 181,
        "stem": "Containers on the same host generally share which underlying resource?",
        "options": [
            "The host operating-system kernel",
            "The host's user passwords",
            "The same process namespace without isolation",
            "The same application memory"
        ],
        "answer_text": "The host operating-system kernel",
        "explanation": "Unlike full virtual machines with separate hypervisors and guest OSs, containers share the host's Linux kernel while isolating namespaces."
    },
    {
        "source": 182,
        "stem": "A load balancer distributes requests across several healthy application instances. What primary goal does this support?",
        "options": [
            "Traffic distribution and availability",
            "Source-code compilation",
            "Database normalization",
            "Password hashing"
        ],
        "answer_text": "Traffic distribution and availability",
        "explanation": "Load balancers spread incoming network load and route around unhealthy nodes to maximize system uptime and throughput."
    },
    {
        "source": 183,
        "stem": "A system replicates data across multiple nodes so one node can fail without losing the service's only copy. What property is being improved?",
        "options": [
            "Fault tolerance",
            "Tokenization",
            "Serialization",
            "Static typing"
        ],
        "answer_text": "Fault tolerance",
        "explanation": "Data replication prevents single points of failure, ensuring that the cluster remains operational and durable when individual nodes fail."
    },
    {
        "source": 184,
        "stem": "A cache stores frequently requested results close to the application. What is the primary performance benefit?",
        "options": [
            "Reduced latency and fewer repeated expensive operations",
            "Guaranteed data freshness",
            "Elimination of authorization",
            "Removal of persistence requirements"
        ],
        "answer_text": "Reduced latency and fewer repeated expensive operations",
        "explanation": "In-memory caching (e.g. Redis) serves repetitive read queries in sub-millisecond times, taking pressure off the primary database."
    },
    {
        "source": 185,
        "stem": "A cache serves stale customer data after the underlying database changes. What issue is involved?",
        "options": [
            "Cache invalidation or freshness",
            "DNS resolution",
            "Compilation",
            "Deadlock"
        ],
        "answer_text": "Cache invalidation or freshness",
        "explanation": "Cache invalidation ensures cached entries are purged or updated when mutating changes occur in the authoritative datastore."
    },
    {
        "source": 186,
        "stem": "A browser resolves `api.example.com` to an IP address before connecting. Which service performs this lookup?",
        "options": [
            "DNS",
            "SMTP",
            "FTP",
            "DHCP only"
        ],
        "answer_text": "DNS",
        "explanation": "The Domain Name System (DNS) maps human-friendly hostnames to machine-routable IP addresses."
    },
    {
        "source": 187,
        "stem": "An HTTP client receives status code 404. What does the response generally indicate?",
        "options": [
            "The requested resource was not found",
            "The request succeeded and created a resource",
            "The server has permanently moved every resource",
            "Authentication definitely succeeded"
        ],
        "answer_text": "The requested resource was not found",
        "explanation": "HTTP 404 Not Found signals that the requested URI could not be located on the origin server."
    },
    {
        "source": 188,
        "stem": "An HTTP client receives status code 401. What does it generally indicate?",
        "options": [
            "Authentication is required or has failed",
            "The resource was permanently deleted",
            "The server successfully created the resource",
            "The request is a valid cache hit"
        ],
        "answer_text": "Authentication is required or has failed",
        "explanation": "HTTP 401 Unauthorized denotes that the request lacks valid authentication credentials for the target resource."
    },
    {
        "source": 189,
        "stem": "A client sends a request to create a resource and the operation can safely be retried without creating duplicates when repeated. What HTTP property is relevant?",
        "options": [
            "Idempotency",
            "Compression",
            "Fragmentation",
            "Encryption"
        ],
        "answer_text": "Idempotency",
        "explanation": "An operation is idempotent if executing it multiple identical times produces the same server state as a single invocation."
    },
    {
        "source": 190,
        "stem": "An API uses HTTPS. What security property is primarily added compared with plain HTTP?",
        "options": [
            "Encrypted and authenticated transport via TLS",
            "Automatic database transactions",
            "Guaranteed application-level authorization",
            "Automatic input validation"
        ],
        "answer_text": "Encrypted and authenticated transport via TLS",
        "explanation": "HTTPS adds Transport Layer Security (TLS), preventing eavesdropping, man-in-the-middle tampering, and spoofing."
    },
    {
        "source": 191,
        "stem": "A web application uses a cookie containing an authentication session identifier. What must be considered?",
        "options": [
            "Secure handling such as appropriate cookie flags, expiration and session protection",
            "Cookies are automatically immune to theft",
            "Authentication no longer requires server-side controls",
            "HTTPS is unnecessary"
        ],
        "answer_text": "Secure handling such as appropriate cookie flags, expiration and session protection",
        "explanation": "Session cookies require HttpOnly, Secure, and SameSite attributes to mitigate cross-site scripting (XSS) and cross-site request forgery (CSRF)."
    },
    {
        "source": 192,
        "stem": "A user enters SQL syntax into a form and the application concatenates it directly into a query. What vulnerability is likely?",
        "options": [
            "SQL injection",
            "DNS poisoning",
            "Race condition",
            "Buffer compression"
        ],
        "answer_text": "SQL injection",
        "explanation": "String concatenation with unsanitized user inputs enables SQL Injection, allowing attackers to manipulate queries."
    },
    {
        "source": 193,
        "stem": "A web page inserts untrusted user input into HTML without proper output encoding. What vulnerability may result?",
        "options": [
            "Cross-site scripting",
            "Deadlock",
            "Cache stampede only",
            "Packet fragmentation"
        ],
        "answer_text": "Cross-site scripting",
        "explanation": "Rendering untrusted input directly into HTML without escaping allows attackers to inject malicious JavaScript (Cross-Site Scripting / XSS)."
    },
    {
        "source": 194,
        "stem": "A server stores user passwords as plaintext. What is the appropriate improvement?",
        "options": [
            "Store salted password hashes using a password-hashing algorithm designed for credentials.",
            "Encrypt passwords with a reversible key and log the key.",
            "Store passwords in browser cookies.",
            "Base64-encode the passwords."
        ],
        "answer_text": "Store salted password hashes using a password-hashing algorithm designed for credentials.",
        "explanation": "Passwords must be cryptographically hashed using computationally slow, salted algorithms like bcrypt or argon2 to resist rainbow table and brute-force attacks."
    },
    {
        "source": 195,
        "stem": "A distributed service needs to process a burst of events asynchronously instead of forcing producers to wait for consumers. What component fits?",
        "options": [
            "Message queue or event broker",
            "DNS resolver",
            "CSS stylesheet",
            "Static linker"
        ],
        "answer_text": "Message queue or event broker",
        "explanation": "Message queues (e.g. RabbitMQ, Kafka, SQS) decouple event producers from consumers, smoothing peak traffic spikes."
    },
    {
        "source": 196,
        "stem": "A message queue consumer crashes after receiving a message but before completing processing. What design concern becomes important?",
        "options": [
            "Delivery semantics and idempotent processing",
            "UI responsiveness only",
            "DNS caching",
            "Source formatting"
        ],
        "answer_text": "Delivery semantics and idempotent processing",
        "explanation": "At-least-once message delivery implies re-deliveries upon consumer crashes; message handling must be idempotent to avoid duplicate actions."
    },
    {
        "source": 197,
        "stem": "A database transaction must ensure that all changes happen or none do. Which ACID property is this?",
        "options": [
            "Atomicity",
            "Consistency only",
            "Isolation only",
            "Durability only"
        ],
        "answer_text": "Atomicity",
        "explanation": "Atomicity guarantees that all statements within a transaction succeed together or the entire transaction is rolled back."
    },
    {
        "source": 198,
        "stem": "Two concurrent transactions should not expose intermediate changes to each other. Which ACID property addresses this?",
        "options": [
            "Isolation",
            "Atomicity",
            "Durability",
            "Availability"
        ],
        "answer_text": "Isolation",
        "explanation": "Isolation defines how transaction integrity is visible to other concurrent operations, preventing dirty reads and write skew."
    },
    {
        "source": 199,
        "stem": "A database must preserve committed data even after a crash. Which property is relevant?",
        "options": [
            "Durability",
            "Isolation",
            "Tokenization",
            "Idempotency"
        ],
        "answer_text": "Durability",
        "explanation": "Durability guarantees that once a transaction commits, its modifications are permanently recorded on non-volatile storage even across crashes."
    },
    {
        "source": 200,
        "stem": "A service exposes metrics for request rate, error rate and latency. What engineering capability does this primarily support?",
        "options": [
            "Observability and operational monitoring",
            "Source-code formatting",
            "Data normalization",
            "Model pretraining"
        ],
        "answer_text": "Observability and operational monitoring",
        "explanation": "Telemetry tracking the 'golden signals' (traffic, error rate, latency, saturation) enables proactive observability and incident alerting."
    }
]

print(f"Total raw questions loaded: {len(RAW_QUESTIONS)}")

TOPICS = [
    (1, 25, 'AI Literacy', 'AI Foundations & Generative AI'),
    (26, 50, 'AI Literacy', 'Prompt Engineering & AI Productivity'),
    (51, 75, 'AI Literacy', 'Advanced AI Systems'),
    (76, 100, 'AI Literacy', 'Responsible AI & Evaluation'),
    (101, 125, 'Technical Assessment', 'Programming Logic & Problem Solving'),
    (126, 150, 'Technical Assessment', 'Data Structures & Algorithms'),
    (151, 175, 'Technical Assessment', 'Software Engineering Fundamentals'),
    (176, 200, 'Technical Assessment', 'Modern Engineering Awareness'),
]

q_by_source = {q['source']: q for q in RAW_QUESTIONS}

mock_tests = []
all_used_sources = set()

for test_idx in range(5):
    test_num = test_idx + 1
    test_questions = []
    q_counter = 1
    
    for start_src, end_src, section, topic in TOPICS:
        topic_sources = list(range(start_src + test_idx * 5, start_src + (test_idx + 1) * 5))
        for src in topic_sources:
            all_used_sources.add(src)
            raw = q_by_source[src]
            # Deterministic shuffle options
            rng = random.Random(src * 100 + 42)
            opts = list(raw['options'])
            rng.shuffle(opts)
            ans_idx = opts.index(raw['answer_text'])
            assert opts[ans_idx] == raw['answer_text']
            
            test_questions.append({
                'id': q_counter,
                'source': src,
                'section': section,
                'topic': topic,
                'stem': raw['stem'],
                'options': opts,
                'answer': ans_idx,
                'explanation': raw['explanation']
            })
            q_counter += 1
            
    mock_tests.append({
        'id': f'mock-{test_num}',
        'testNumber': test_num,
        'title': f'Capgemini 2027 Mock Test {test_num}',
        'subtitle': 'AI Literacy + Technical Assessment',
        'description': f'Full-length practice test #{test_num} with 40 scenario-based questions covering AI Literacy and Technical core subjects.',
        'questionsCount': len(test_questions),
        'durationMinutes': 30,
        'aiCount': 20,
        'techCount': 20,
        'questions': test_questions
    })

assert len(all_used_sources) == 200, f"Expected 200 distinct sources, got {len(all_used_sources)}"
print(f"Verified: All 200 distinct questions partitioned into 5 tests of 40 questions each.")

ts_content = f"""// Capgemini 2027 Mock Tests Dataset
// 5 Full-Length Mock Tests of 40 questions each (200 total MCQs)
// Built from official scenario-based assessment curriculum

export interface MockQuestion {{
    id: number;
    source: number;
    section: 'AI Literacy' | 'Technical Assessment';
    topic: string;
    stem: string;
    options: string[];
    answer: number;
    explanation: string;
}}

export interface MockTest {{
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
}}

export const CAPGEMINI_MOCK_TESTS: MockTest[] = {json.dumps(mock_tests, indent=2)};
"""

target_path = r"d:\Coding\Notes\frontend\lib\capgemini-mock-data.ts"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {target_path}!")

