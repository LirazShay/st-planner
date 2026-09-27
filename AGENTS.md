# AGENTS.md — S&T Planner Contract

This repository builds a reusable S&T planning framework for GPT.

## One-command planning trigger

If the user asks to plan something with **S&T Planner** / **ST Planner** / **S T Planner**, that request activates the full framework automatically.

The user should not have to provide the workflow. The agent must read the repository and planning instructions, determine the requested goal, progressively load relevant project context, build/review the complete S&T plan, persist it in `.planning/`, freeze only after Final Planning Review, allocate implementation-ready leaves in `EXECUTION.yaml`, run the mandatory repository-only fresh-chat verification from `EXECUTOR_HANDOFF.md`, and explicitly authorize implementation only after that gate passes.

Do not require the user to paste `START-PROMPT.md`, choose a phase count, or explain which planning files to update.

## Core rule

For meaningful work, **plan completely before implementation**.

Do not release individual executable leaves while the overall intended plan is still being designed.

## Planning method

Every S&T node has:

- Strategy — what objective must exist?
- Tactic — how will it be achieved?
- Parallel assumptions — why can this tactic achieve this strategy?
- Necessary assumptions — why is a child required for its parent?
- Sufficiency assumptions — why are the children enough together?
- Success evidence — how will we recognize the strategy as achieved?
- Children — lower-level required steps.

Do not choose a fixed number of phases in advance.

## Decomposition

To go down:
> How exactly must the parent tactic be performed?

A child belongs at that level only if it is independently necessary for the parent.

For every group:
- remove each child mentally to test necessity;
- assume all children succeed to test sufficiency.

Stop when leaves are detailed enough that execution does not require another material design decision.

## Information ownership

- `GOAL.md` — desired outcome, established current reality, constraints, non-goals.
- `TREE.yaml` — S&T logic and node planning status.
- `DECISIONS.md` — material unresolved questions and decisions.
- `REVIEWS.md` — review history.
- `.planning/STATUS.yaml` — current planning pointer plus plan freeze and implementation-authorization state.

Do not duplicate the same state in multiple files.

## Planning conversation

Prefer one continuous planner chat.

Repository state exists for:
- durability;
- auditability;
- recovery;
- optional continuation in a new chat;
- optional independent review.

Do not split planning into multiple chats merely because the framework supports continuation.

## Completion

Planning is complete only when the **whole intended plan**:

- covers the intended scope;
- is decomposed to implementation-ready leaves;
- has no unresolved material decision that execution would have to invent;
- passes necessity and sufficiency checks;
- passes KISS and structural review;
- passes a Final Planning Review.

Then freeze the plan while keeping `implementation_authorized: false`, allocate every implementation-ready leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`, run and record the mandatory fresh-chat handoff verification from `.planning/EXECUTOR_HANDOFF.md`, and only then set `implementation_authorized: true`.

## Execution handoff

After freeze:

- keep `.planning/STATUS.yaml -> implementation_authorized: false` until handoff verification passes;
- create/populate `.planning/EXECUTION.yaml`;
- assign every implementation-ready leaf to exactly one numbered chat;
- do not copy Strategy/Tactic text into EXECUTION — node IDs point back to TREE;
- keep execution prerequisites only in `TREE.yaml -> depends_on`;
- use execution states only in EXECUTION: `pending / in_progress / done / blocked`;
- after allocation is complete, run the four representative repository-only fresh-chat simulations defined in `.planning/EXECUTOR_HANDOFF.md`;
- record the result in `.planning/REVIEWS.md`;
- fix and rerun any failed simulation before authorization.

When the user says "I am chat N" / "אני צ'אט מספר N", the agent must:

- read `.planning/EXECUTOR_HANDOFF.md`;
- confirm `.planning/STATUS.yaml -> plan_state: frozen`;
- confirm `.planning/STATUS.yaml -> implementation_authorized: true`;
- read `EXECUTION.yaml`;
- find chat N;
- read only its assigned S&T nodes plus necessary decisions/context;
- for each node, check `TREE.yaml -> depends_on` and confirm prerequisite nodes are `done` in EXECUTION;
- execute only assigned unblocked nodes;
- set a node `in_progress` before working on it;
- set it `done` only after its `success_evidence` is verified;
- record a short result/reference;
- set `blocked` with a short reason if a real planning/execution blocker prevents progress.

If execution exposes a material planning defect:
- do not improvise;
- mark the affected execution node `blocked` with a short factual reason;
- set `.planning/STATUS.yaml -> plan_state: active`;
- set `.planning/STATUS.yaml -> implementation_authorized: false`;
- stop starting new execution work;
- reopen only the smallest affected S&T area;
- preserve previously `done` work only when its Strategy/evidence/outcome remains valid after the correction;
- after focused re-review, repair only affected EXECUTION assignments/states and set `plan_state: frozen` again;
- rerun and record the mandatory fresh-chat verification;
- do not resume execution until that gate passes and `implementation_authorized: true` is explicitly restored.

Do not create plan-version machinery; Git history and REVIEWS are enough.

## KISS

Do not add framework machinery unless real usage proves it necessary.

Avoid:
- databases;
- services;
- custom orchestration;
- speculative schemas;
- automatic multi-agent systems;
- rich special-case modeling before it is needed.
