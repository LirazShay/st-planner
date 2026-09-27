# S&T of S&T Planner

## Root

**Strategy**  
GPT consistently produces complete, logically defensible, implementation-ready plans instead of ad-hoc task lists.

**Tactic**  
Provide a small portable S&T planning framework stored with the project, with explicit decomposition rules, review rules, durable state, and a simple final handoff to ordinary execution tasks.

**Parallel assumptions**
- GPT already has general reasoning ability; it mainly needs a stable planning method.
- S&T necessity/sufficiency logic improves plan structure.
- Git files are enough for durable planning state.
- Execution can use the frozen S&T leaves directly; only minimal allocation/state, a small mechanical validator, and an explicit authorization gate are needed.

**Success evidence**
- A GPT can start from a goal and build a complete reviewed S&T tree.
- A fresh GPT can resume planning from repository state when necessary.
- A fresh executor can prove, before authorization, that it can recover its assignment, dependencies, next context, and blockers from repository state only.
- Final leaves are detailed enough to become implementation tasks without new material design decisions.
- The framework remains small enough to use routinely.

## Necessary conditions

### 0.1 — GPT knows how to build S&T correctly

**Tactic:** provide the methodology and planning protocol.

### 0.2 — GPT can challenge its own plan

**Tactic:** provide necessity, sufficiency, KISS, structural, and final-plan review gates.

### 0.3 — Planning state survives if the conversation changes

**Tactic:** store only minimal authoritative planning files in the target repository.

### 0.4 — Planning reaches implementation-ready depth before execution

**Tactic:** require the whole intended tree to pass Final Planning Review before freezing.

### 0.5 — The final plan can be executed without duplicating the work model

**Tactic:** assign frozen implementation-ready leaf IDs directly to numbered executor chats in one minimal execution file, mechanically validate that projection, provide a portable EXECUTOR_HANDOFF bootstrap, keep execution unauthorized while representative fresh-chat simulations run, and authorize only after both gates pass.

## Sufficiency

If GPT can build the tree correctly, critique it, persist it when needed, finish the whole intended plan before freezing, and allocate its leaves directly to executor chats without duplicating task descriptions, the framework is sufficient for its V1 purpose.

## V1 boundary

Not required:
- database;
- service;
- plugin runtime;
- automatic multi-agent orchestration;
- execution state machine;
- custom task tracker;
- rich modeling of every S&T edge case.

Those are future options only if real usage proves a need.
