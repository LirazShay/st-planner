# AGENTS.md — S&T Planner Contract

This repository builds a reusable S&T planning framework for GPT.

## One-command planning trigger

If the user asks to plan something with **S&T Planner** / **ST Planner** / **S T Planner**, that request activates the full framework automatically.

The user should not have to provide the workflow. The agent must read the repository and planning instructions, determine the requested goal, progressively load relevant project context, build/review the complete S&T plan, persist it in `.planning/`, record the reviewed baseline and verify no material drift before freeze, allocate implementation-ready leaves in `EXECUTION.yaml`, run the mandatory repository-only fresh-chat verification from `EXECUTOR_HANDOFF.md`, and explicitly authorize implementation only after all gates pass.

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
- `.planning/STATUS.yaml` — S&T Planner-owned planning pointer plus plan freeze and implementation-authorization state.

S&T Planner owns **only** `.planning/STATUS.yaml`. A target repository may have its own root/operational `STATUS.yaml`, phase file, release state, `current_chat`, or workstream status; that remains target-owned. Do not read S&T lifecycle meaning from it or mutate it unless the target repository's own contract explicitly requires an integration update.

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

Then record the reviewed baseline in `.planning/REVIEWS.md`, verify no material drift with `.planning/verify-freeze-baseline.mjs` (or equivalent reproducible evidence), freeze only that verified baseline while keeping `.planning/STATUS.yaml -> implementation_authorized: false`, allocate every implementation-ready leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`, mechanically validate that allocation with `.planning/validate-allocation.mjs`, run and record the mandatory fresh-chat handoff verification from `.planning/EXECUTOR_HANDOFF.md`, and only then set `.planning/STATUS.yaml -> implementation_authorized: true`.

## Execution handoff

After freeze:

- keep `.planning/STATUS.yaml -> implementation_authorized: false` until handoff verification passes;
- create/populate `.planning/EXECUTION.yaml`;
- assign every implementation-ready leaf to exactly one numbered chat;
- do not copy Strategy/Tactic text into EXECUTION — node IDs point back to TREE;
- keep execution prerequisites only in `TREE.yaml -> depends_on`;
- use execution states only in EXECUTION: `pending / in_progress / done / blocked`;
- after allocation is complete, run `node .planning/validate-allocation.mjs --initial`; any failure keeps implementation unauthorized;
- if the target explicitly uses serial numbered chats, add `--serial-chats`;
- after mechanical allocation validation passes, run the representative repository-only fresh-chat simulations defined in `.planning/EXECUTOR_HANDOFF.md`, including old-conversation rollover and fresh-conversation activation;
- record the result in `.planning/REVIEWS.md`;
- fix and rerun any failed simulation before authorization.

### Executor conversation identity is separate from repository allocation

Chat allocation is not chat activation.

A numbered executor becomes active in a conversation only after an explicit executor startup message in that conversation, for example `אני צאט 17 תתחיל` (established forms such as `אני צ'אט מספר 17` / `I am chat 17` remain valid explicit startup forms).

The conversation-local executor identity is immutable after activation. A repository allocation, a target-owned `current_chat` pointer, a newly runnable chat, `NEXT_CHAT_PROMPT`, `תמשיך לשלב הבא`, or `continue` may never create, advance, or replace that identity.

If a conversation has emitted `[[SEQUENCE_RUNNER_NEW_CHAT]] ... [[/SEQUENCE_RUNNER_NEW_CHAT]]`, that conversation is execution-closed for later allocated chats. It must not bootstrap or execute the next chat even if repository state now points to it. It may only explain that a new conversation is required and repeat the explicit startup command.

Before any executor-side branch/code/status/EXECUTION mutation, apply this order:

1. determine the conversation-local executor identity from explicit startup in this conversation;
2. reject if no identity exists, if an attempted startup would change an existing identity, or if this conversation already emitted a new-chat handoff;
3. only then read repository lifecycle/authorization/allocation/current pointers to confirm the **same** identity;
4. only then evaluate dependencies and start work.

Repository state can confirm identity; it never manufactures identity.

When the user explicitly starts Chat N in a fresh conversation, the agent must:

- read `.planning/EXECUTOR_HANDOFF.md`;
- confirm the conversation identity is N and the conversation is not execution-closed;
- confirm `.planning/STATUS.yaml -> cycle_state: active`;
- confirm `.planning/STATUS.yaml -> plan_state: frozen`;
- confirm `.planning/STATUS.yaml -> implementation_authorized: true`;
- read `EXECUTION.yaml`;
- find that same chat N;
- read only its assigned S&T nodes plus necessary decisions/context;
- for each node, check `TREE.yaml -> depends_on` and confirm prerequisite nodes are `done` in EXECUTION;
- execute only assigned unblocked nodes;
- set a node `in_progress` before working on it;
- set it `done` only after its `success_evidence` is verified;
- record a short result/reference;
- set `blocked` with a short reason if a real planning/execution blocker prevents progress.

If an old conversation's identity no longer matches a target-owned current-chat pointer, or if it already emitted handoff, do not execute the newly pointed chat. Respond with a short new-chat instruction instead.

If execution exposes a material planning defect:
- do not improvise;
- mark the affected execution node `blocked` with a short factual reason;
- set `.planning/STATUS.yaml -> plan_state: active`;
- set `.planning/STATUS.yaml -> implementation_authorized: false`;
- stop starting new execution work;
- reopen only the smallest affected S&T area;
- preserve previously `done` work only when its Strategy/evidence/outcome remains valid after the correction;
- after focused re-review, repair only affected EXECUTION assignments/states and set `.planning/STATUS.yaml -> plan_state: frozen` again;
- run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when that mode is used);
- rerun and record the mandatory fresh-chat verification;
- do not resume execution until that gate passes and `.planning/STATUS.yaml -> implementation_authorized: true` is explicitly restored.

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
