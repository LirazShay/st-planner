# AGENTS.md — S&T Planner Contract

This repository builds a reusable S&T planning framework for GPT.

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
- `STATUS.yaml` — current planning pointer only.

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

Then freeze the plan and allocate every implementation-ready leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`.

## Execution handoff

After freeze:

- create/populate `.planning/EXECUTION.yaml`;
- assign every implementation-ready leaf to exactly one numbered chat;
- do not copy Strategy/Tactic text into EXECUTION — node IDs point back to TREE;
- keep execution prerequisites only in `TREE.yaml -> depends_on`;
- use execution states only in EXECUTION: `pending / in_progress / done / blocked`.

When the user says "I am chat N" / "אני צ'אט מספר N", the agent must:

- confirm the plan is frozen;
- read `EXECUTION.yaml`;
- find chat N;
- read only its assigned S&T nodes plus necessary decisions/context;
- for each node, check `TREE.yaml -> depends_on` and confirm prerequisite nodes are `done` in EXECUTION;
- execute only assigned unblocked nodes;
- set a node `in_progress` before working on it;
- set it `done` only after its `success_evidence` is verified;
- record a short result/reference;
- set `blocked` with a short reason if a real planning/execution blocker prevents progress.

If execution exposes a material planning defect, do not improvise. Mark the affected node blocked and return the defect to planning.

## KISS

Do not add framework machinery unless real usage proves it necessary.

Avoid:
- databases;
- services;
- custom orchestration;
- speculative schemas;
- automatic multi-agent systems;
- rich special-case modeling before it is needed.
