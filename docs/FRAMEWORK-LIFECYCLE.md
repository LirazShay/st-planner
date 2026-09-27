# S&T Framework Lifecycle

The framework has **two strictly separated programs**:

```
PLANNING PROGRAM
  understand
  → build the complete S&T
  → challenge every branch
  → resolve material decisions
  → full-tree review
  → freeze the plan
  → compile execution work packages

                 HARD GATE

EXECUTION PROGRAM
  executor chat gets one work package
  → performs only that responsibility
  → verifies against planned acceptance evidence
  → records result
  → stops or hands back an exception
```

There is no normal path from an unfinished planning branch directly into implementation.

## Program A — Planning

Planning is a project in its own right and may span many GPT chats.

Each planner chat:

1. connects to the same durable planning state;
2. continues the recorded planning action;
3. expands or critiques the S&T;
4. resolves or exposes material questions;
5. updates the repository planning artifacts;
6. ends with a durable handoff to the next planner chat.

Planner chats may inspect project code/files when needed to understand current reality, but they **do not implement the target project**.

### Planning artifacts

- `GOAL.md` — stable boundary.
- `TREE.yaml` — complete S&T logic.
- `DECISIONS.md` — material unresolved questions and their resolutions.
- `REVIEWS.md` — planning review history.
- `STATUS.yaml` — planning resume pointer.
- `EXECUTION-PLAN.yaml` — absent or draft until final planning; becomes authoritative only after final freeze.

## Planning completion gate

Planning is not complete because some leaves are executable.

The transition to execution is allowed only when the **whole intended plan** is ready.

Required conditions:

- the desired outcome and constraints are stable;
- every active S&T branch needed for the intended project scope has been decomposed to the required execution granularity;
- every active node has valid Strategy/Tactic logic;
- every required child passes necessity;
- every sibling group passes sufficiency;
- material assumptions are explicit;
- all material planning decisions that affect execution are resolved;
- the complete tree passes structural, KISS, consistency, and fresh-session reviews;
- execution ordering/dependencies needed for handoff are understood;
- work can be partitioned into executor responsibilities without leaving design decisions to executor chats;
- a **Final Planning Review** passes for the whole plan.

Only then:

1. freeze the planning baseline;
2. compile the approved S&T into `EXECUTION-PLAN.yaml`;
3. change `STATUS.yaml -> stage` from `planning` to `execution`.

## Program B — Execution

Execution starts only from the frozen plan.

Execution is deliberately distributed.

Each executor chat receives **one explicit work package** (or an explicitly compatible group of packages) containing:

- responsibility / outcome;
- source S&T node IDs;
- allowed scope;
- required inputs/context;
- dependencies/preconditions;
- implementation instructions or constraints already decided by planning;
- verification evidence;
- forbidden/out-of-scope work;
- handoff/reporting requirements.

The executor chat does not redesign the S&T.

Its job is to perform the responsibility that planning already defined.

## Execution exception rule

If an executor discovers that the frozen plan is impossible, contradictory, incomplete, or requires a material decision that was not planned:

1. stop the affected work;
2. record the observed fact and affected work package;
3. mark the package blocked;
4. return the issue to the planning authority.

The executor does **not** silently redesign the plan.

A planner chat then decides whether the frozen planning baseline must be reopened and reviewed.

## Handoff model

### Planner-to-planner

The next planner chat receives the framework + planning state and continues the next planning action.

### Planner-to-executor

This happens only after final freeze. The execution plan is the contract.

### Executor-to-executor

Executor chats may depend on outputs of earlier work packages, but responsibility boundaries are defined in the frozen execution plan.

### Executor-to-planner

Only for exceptions that invalidate or expose a gap in the frozen plan.

## Core invariant

```
Plan completely
→ review completely
→ freeze
→ compile responsibilities
→ execute according to the frozen plan
```

Do not mix planning and implementation in the same unfinished planning flow.
