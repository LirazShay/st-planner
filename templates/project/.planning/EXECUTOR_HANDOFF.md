# Executor Handoff Bootstrap

This file is the portable entry contract for a brand-new executor chat.

It explains **how to resume execution from repository state only**. It does not duplicate task content from `TREE.yaml` or allocation/state from `EXECUTION.yaml`.

## Authorization gate

Before reading implementation details, read `.planning/STATUS.yaml`.

Execution is allowed only when all three values in **`.planning/STATUS.yaml`** are satisfied:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

If any condition is false:

- do not start or mark any node `in_progress`;
- do not improvise missing planning;
- report the repository-visible reason execution is unavailable.

A `completed` or `abandoned` cycle is terminal and cannot execute even if stale planning/execution data remains in the repository. Terminal cycles must have `implementation_authorized: false`.

## Fresh executor read order

A numbered executor chat should read in this order:

1. target repository `AGENTS.md` and any routing/source-of-truth instructions it names;
2. this `.planning/EXECUTOR_HANDOFF.md`;
3. `.planning/STATUS.yaml`;
4. `.planning/EXECUTION.yaml`;
5. only the `TREE.yaml` nodes assigned to its chat;
6. each assigned node's `depends_on` entries and the prerequisite states in `EXECUTION.yaml`;
7. only decisions, specs, code, tests, or other target-project context materially required by the assigned nodes.

Do not preload all planning history or the whole repository.

## Determine what can run

For each assigned node:

- if every `depends_on` node is `done`, the node is available;
- if any prerequisite is not `done`, leave the node `pending`;
- an unmet dependency is not itself a blocker state;
- choose the first available assigned node using the order already represented by the assignment/dependencies; do not invent unrelated work.

If no assigned node is available, report which prerequisite states prevent progress.

## Context routing

The target repository remains authoritative for its own implementation rules and product/technical contracts.

Use this order:

1. target `AGENTS.md` / project routing rules;
2. the assigned S&T node, the ancestor reasoning needed to understand why it exists, and materially relevant decisions;
3. directly relevant target specs/code/tests;
4. history or unrelated areas only when a concrete uncertainty requires them.

An external/reference/source repository is read-only context unless the target repository explicitly says otherwise or the assigned node explicitly requires changing it.

Do not copy Strategy/Tactic text into this handoff file.

## Branch and verification behavior

Follow the target repository's existing Git, branch, PR, testing, and verification rules.

S&T Planner does not impose a branch/PR workflow when the target project does not have one.

Before marking a node `done`:

- execute within the assigned node's planned scope;
- verify its `success_evidence` using the target project's appropriate tests/inspection;
- write only a short result/evidence reference to `EXECUTION.yaml`.

## Planning defect discovered during execution

If implementation reveals a material planning gap or contradiction:

1. stop the affected node;
2. mark it `blocked` with a short factual reason in `.planning/EXECUTION.yaml`;
3. keep `.planning/STATUS.yaml -> cycle_state: active`;
4. set `.planning/STATUS.yaml -> plan_state: active`;
5. set `.planning/STATUS.yaml -> implementation_authorized: false`;
6. stop starting new execution work;
7. return the smallest affected S&T area to planning.

Do not redesign the plan inside an executor chat.

After correction, re-freeze alone is not enough. The planner must record the corrected reviewed baseline, pass freeze no-drift verification again, freeze that verified baseline, run allocation validation in `--resume` mode, and rerun the required fresh-chat handoff verification before `.planning/STATUS.yaml -> implementation_authorized: true` is explicitly restored.

## Mandatory fresh-chat verification before authorization

After allocation, first require a clean mechanical allocation validation:

```text
node .planning/validate-allocation.mjs --initial
```

Use `--resume` instead when re-authorizing after execution/replanning, and add `--serial-chats` only when numbered chats are explicitly serial.

Only after allocation validation passes may the planner simulate a brand-new executor using **repository state only**, without relying on planning-chat memory.

Verify these representative situations:

1. **first available executor** — can identify its assignment and first runnable node;
2. **dependency-blocked early executor** — can identify that no node may start yet and exactly which prerequisite state blocks progress;
3. **mid-plan executor with multiple dependencies** — can resolve all prerequisite states and determine what is runnable;
4. **final closure executor** — can determine the remaining assigned work and the evidence needed to finish it.

Use actual chats/nodes from the allocation when they exist. If a small allocation does not contain a literal example of one situation, simulate that condition against the closest real assignment **without mutating durable execution state**, and record the adaptation.

For every simulation, the fresh executor must be able to determine:

- whether the cycle is active;
- whether implementation is authorized;
- which nodes belong to the chat;
- prerequisite states;
- the first available node, or that none is available;
- the exact contract/project context it should load next;
- the factual reason it cannot proceed when unavailable.

Record the post-allocation verification result in `.planning/REVIEWS.md`.

Any allocation-validator failure or failed simulation keeps `.planning/STATUS.yaml -> implementation_authorized: false`. Fix the smallest allocation/handoff/routing defect and repeat the failed gate before authorization.
