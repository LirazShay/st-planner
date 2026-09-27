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

Then freeze the plan, compile GitHub Issues/tasks from implementation-ready leaves using the repository's Issue-compilation rules, and map those Issues to numbered executor chats in `.planning/CHAT-ASSIGNMENTS.yaml`.

## Execution handoff

Issue compilation rules:
- default one implementation-ready leaf → one Issue;
- group only coherent leaves with compatible prerequisites and jointly verifiable evidence;
- if a leaf must be materially split, reopen planning;
- preserve S&T node IDs;
- derive outcome from Strategy and planned approach from Tactic;
- copy only relevant constraints/decisions;
- translate `depends_on` into Issue prerequisites;
- include objective success/acceptance evidence.

Executor chats implement the task; they do not redesign the plan.

If the user identifies an executor as "chat N" (for example "אני צ'אט מספר 2"), the agent must:
- confirm the plan is frozen;
- read `CHAT-ASSIGNMENTS.yaml`;
- find assignment N;
- pull only N's assigned Issues and referenced S&T context;
- inspect prerequisite/dependency information on those assigned Issues;
- execute only that scope.

If N is missing or an assigned Issue has an incomplete prerequisite, do not invent or steal work.

If execution exposes a material planning defect, return it to planning rather than silently improvising.

## KISS

Do not add framework machinery unless real usage proves it necessary.

Avoid:
- databases;
- services;
- custom orchestration;
- speculative schemas;
- automatic multi-agent systems;
- rich special-case modeling before it is needed.
