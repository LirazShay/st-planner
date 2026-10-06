# AGENTS.md — S&T Planner Contract

This repository builds a reusable S&T planning framework for GPT.

## One-command planning trigger

If the user asks to plan something with **S&T Planner** / **ST Planner** / **S T Planner**, that request activates the full framework automatically.

The user should not have to provide the workflow. The agent must read the repository and planning instructions, determine the requested goal, progressively load relevant project context, build/review the complete S&T plan, persist it in `.planning/`, record the reviewed baseline and verify no material drift before freeze, allocate implementation-ready leaves in `EXECUTION.yaml`, run the mandatory repository-only execution/handoff verification from `EXECUTOR_HANDOFF.md`, and explicitly authorize implementation only after all hard gates pass.

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

## Efficient deep-planning flow

Efficiency must come from ordering and batching the reasoning, never from reducing S&T depth.

Before deep node-by-node planning, make a short structural map of the current scope: outcome/boundary, material questions and decisions that must be resolved, dependencies between those questions, material current-reality evidence still needed, and the likely major tree areas. This map is orientation only. It does not approve tactics, skip decisions, weaken necessity/sufficiency, or replace full justification.

Then plan in coherent slices. Within a slice, perform the full S&T reasoning for the related decisions and nodes, persist the rationale in the normal planning artifacts, run mechanical validation where available, and review the coherent slice. Do not force a full read/edit/review/status cycle after every small edit.

Once a material decision has been justified and durably recorded in the current cycle, do not reopen the same reasoning merely for reassurance. Reopen it only when new evidence, a contradiction, a changed assumption, or a review finding can materially change the decision.

Existing project patterns, prior designs, or reusable mechanisms are evidence about current reality and candidate alternatives; they are never sufficient justification by themselves. Every material tactic must still stand on the current scope's evidence, assumptions, alternatives, and consequences.

Keep deterministic checks mechanical where practical (for example schema/structure/dependency/allocation consistency) and reserve deep reasoning for judgments that actually require it. Whole-plan coverage and Final Planning Review remain mandatory.

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
- `TREE.yaml` — S&T logic and node planning status; `depends_on` owns execution prerequisites.
- `DECISIONS.md` — material unresolved questions and decisions.
- `REVIEWS.md` — review history.
- `.planning/STATUS.yaml` — S&T Planner-owned cycle/planning/implementation-authorization state.
- `.planning/EXECUTION.yaml` — authoritative executor allocation + node execution state after freeze.

S&T Planner owns **only** `.planning/STATUS.yaml` for lifecycle/planning authorization. A target repository may have its own root/operational `STATUS.yaml`, phase file, release state, `current_chat`, `current_node`, or workstream status; that remains target-owned.

Target-owned execution pointers are projections/navigation aids, not peer S&T execution authorities. Runnable executor work is derived from `TREE.yaml -> depends_on` plus `.planning/EXECUTION.yaml`. A projection mismatch should be diagnosed/repaired when useful, but it must not by itself stop otherwise-safe implementation or redefine conversation identity.

Do not duplicate authoritative execution state in multiple framework-owned files.

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

Then record the reviewed baseline in `.planning/REVIEWS.md`, verify no material drift with `.planning/verify-freeze-baseline.mjs` (or equivalent reproducible evidence), freeze only that verified baseline while keeping `.planning/STATUS.yaml -> implementation_authorized: false`, allocate every implementation-ready leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`, mechanically validate that allocation with `.planning/validate-allocation.mjs`, run and record the mandatory execution/handoff verification from `.planning/EXECUTOR_HANDOFF.md`, and only then set `.planning/STATUS.yaml -> implementation_authorized: true`.

## Execution handoff

After freeze:

- keep `.planning/STATUS.yaml -> implementation_authorized: false` until hard handoff verification gates pass;
- create/populate `.planning/EXECUTION.yaml`;
- assign every implementation-ready leaf to exactly one numbered chat;
- do not copy Strategy/Tactic text into EXECUTION — node IDs point back to TREE;
- keep execution prerequisites only in `TREE.yaml -> depends_on`;
- use execution states only in EXECUTION: `pending / in_progress / done / blocked`;
- after allocation is complete, run `node .planning/validate-allocation.mjs --initial`; any authoritative allocation failure keeps implementation unauthorized;
- if the target explicitly uses serial numbered chats, add `--serial-chats`;
- derive runnable executor work from TREE + EXECUTION (`execution-guidance.mjs` is the executable reference); target-owned current pointers are advisory projections;
- run the representative repository-only execution/handoff simulations defined in `.planning/EXECUTOR_HANDOFF.md`, including projection drift, accidental old-conversation rollover, explicit post-handoff re-bootstrap, and fresh-conversation activation;
- record the result in `.planning/REVIEWS.md`;
- warnings such as projection drift should be repaired when useful but do not keep implementation blocked; only failed authoritative allocation/authorization/dependency/context checks do.

### Executor identity is separate from repository projections

Chat allocation is not chat activation.

A numbered executor context starts only after an explicit executor startup message, for example `אני צאט 17 תתחיל` (established forms such as `אני צ'אט מספר 17` / `I am chat 17` remain valid explicit startup forms).

A repository allocation, target-owned `current_chat`, newly runnable chat, `NEXT_CHAT_PROMPT`, `תמשיך לשלב הבא`, or `continue` may never **implicitly** create, advance, or replace executor identity.

While an executor is actively working before a handoff boundary, do not switch the conversation to another Chat N. Finish/handoff the active executor first.

A new-chat handoff recommends a fresh conversation for clean context but does not permanently lock the old conversation. After handoff:

- generic `continue` must not silently bootstrap the next chat;
- if the user explicitly sends `אני צאט N תתחיל`, the same conversation may intentionally re-bootstrap that allocated Chat N after fresh repository authorization/allocation/dependency checks pass.

This prevents accidental rollover without forcing a new chat when the user prefers continuity.

Before executor-side branch/code/status/EXECUTION mutation:

1. determine the explicit executor identity for this active/bootstrap context;
2. confirm `.planning/STATUS.yaml` still authorizes implementation;
3. confirm that same Chat N is allocated in `.planning/EXECUTION.yaml`;
4. check its TREE dependencies against EXECUTION states;
5. ignore target-owned current-pointer drift as an authority decision; warn/repair it separately;
6. only then mutate target code or authoritative execution state.

`.planning/executor-authority.mjs` is the executable reference for activation/re-bootstrap semantics. `.planning/execution-guidance.mjs` is the executable reference for canonical runnable-work derivation and advisory target-pointer comparison.

### Completion transitions

Node completion must first make authoritative EXECUTION truthful:

- re-read current authoritative state before writing;
- confirm this chat still owns the node and its prerequisites remain valid;
- verify `success_evidence`;
- write `done` + short result to `.planning/EXECUTION.yaml`;
- re-derive runnable work from TREE + EXECUTION;
- only then update optional target-owned status/current projections as secondary summaries when the target project requires them.

Do not make correctness depend on manually advancing several peer `current` representations in a particular file-by-file order. If a target projection temporarily lags, diagnose/repair it without stopping unrelated safe development.

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
- rerun and record the mandatory execution/handoff verification;
- do not resume execution until hard gates pass and `.planning/STATUS.yaml -> implementation_authorized: true` is explicitly restored.

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
