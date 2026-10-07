# Worked Example — Safe CSV Import

This example demonstrates ST Planner 2.0 on a small but non-trivial software change.

## Scenario

A backend service must let users import customer records from CSV files safely and predictably.

The example deliberately makes several material V1 product choices explicit (for example duplicate rejection, whole-file structural rejection, and all-or-nothing persistence) so the plan can be completed end-to-end. Those choices are example decisions, not universal CSV-import guidance.

## What this example proves

The example uses only two live project-owned planning artifacts:

- `PLAN.md` — outcome, current reality, material decisions, complete S&T reasoning, implementation-ready leaves, and Final Planning Review.
- `EXECUTION.md` — leaf assignment to numbered chats, real execution prerequisites, work status, and short results/evidence.

It demonstrates that ST Planner can still:

- reason deeply with Strategy/Tactic, material alternatives, Necessity, Sufficiency, and success evidence;
- decompose the scope into implementation-ready work;
- assign work coherently across numbered chats;
- expose parallelism and real prerequisites;
- support a fresh executor from repository state;
- avoid a second task-description system and avoid framework lifecycle/authorization state.

## Execution shape

The nine implementation-ready leaves are grouped into four coherent execution units:

- Chat 1 — CSV contract and parsing;
- Chat 2 — admissibility and persistence protection;
- Chat 3 — atomic persistence;
- Chat 4 — result contract and terminal outcome mapping.

Chat numbering is ownership, not proof of planning validity and not an implicit global sequence.

## Fresh-chat recovery

A fresh Chat N needs only the target repository's normal rules plus `PLAN.md` and `EXECUTION.md` to determine:

- what its assigned work means and why it exists;
- which prerequisites must already be satisfied;
- what success evidence closes the task;
- what work remains afterward.

No freeze state, implementation-authorization flag, handoff validator, or chat-authority script is required.

## Historical V1 form

This example originally used separate `GOAL.md`, `TREE.yaml`, `DECISIONS.md`, `REVIEWS.md`, and `STATUS.yaml` files. Git history preserves that form. The live example intentionally consolidates the same useful planning truth into the smaller ST Planner 2.0 model instead of preserving process-only history as current state.
