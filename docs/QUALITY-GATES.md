# S&T Planner Quality Gates

## Gate 1 — Goal

- desired outcome is clear;
- current reality is separated from assumptions;
- constraints are explicit;
- non-goals prevent scope drift.

## Gate 2 — Node and relationship validity

For each active node:
- Strategy states an objective;
- Tactic states an action;
- Parallel assumptions genuinely justify this node's Tactic → Strategy relationship;
- every non-root child's Necessary assumptions justify that child → parent relationship;
- every parent with children has Sufficiency assumptions that justify the children-as-a-group → parent relationship;
- root has no Necessary assumptions;
- leaves normally have no Sufficiency assumptions;
- success evidence tests the Strategy.

## Gate 3 — Necessity

For each child:

> If this child vanished and nothing replaced it, could the parent still succeed?

If yes, challenge the child.

## Gate 4 — Sufficiency

For each parent:

> If all children succeed, can the parent still fail because required work is missing?

If yes, the decomposition is incomplete.

## Gate 5 — Assumption honesty

- facts are not assumptions;
- unknowns are not guessed;
- material open questions exist in DECISIONS;
- important choices have rationale.

## Gate 6 — KISS

- no speculative infrastructure;
- no duplicate nodes;
- no tool chosen before its requirement;
- no decomposition below useful execution granularity;
- no framework machinery added without evidence it is needed.

## Gate 7 — Tree consistency

- root exists;
- all child references resolve;
- every non-root V1 node has one logical parent;
- no cycles;
- statuses are only draft / blocked / approved;
- draft is used for normal unfinished planning;
- every blocked node is referenced by an open D-entry that explains the material unresolved question;
- no separate blocked-by state is duplicated in TREE;
- approval/blocking is local, not recursive.

## Gate 8 — Implementation readiness

For each final leaf:
- responsibility is clear;
- scope is clear;
- relevant decisions are resolved;
- required inputs are known;
- every real execution prerequisite is recorded in `depends_on`;
- every `depends_on` reference resolves to an existing implementation-ready leaf;
- no leaf depends on itself;
- the execution-dependency graph is acyclic;
- no dependency is invented merely to express preference or priority;
- success evidence is objective;
- no material design decision is left for the executor.

## Gate 9 — Whole-plan coverage

Pass only when an outside-in audit from GOAL finds no material omission:

- every meaningful desired-outcome clause is protected somewhere in the plan;
- every hard constraint is respected by the relevant nodes/assumptions/decisions;
- assuming every leaf succeeds does not reveal an uncovered reason the root goal can still fail;
- materially relevant actors, boundaries, external dependencies, and failure paths were challenged;
- representative end-to-end scenarios do not expose a missing necessary branch;
- stated non-goals have not leaked into required work.

Do not require a permanent coverage matrix. Record only defects and the final pass in the normal review history.

## Gate 10 — Final whole-plan review

**The whole intended plan must be complete before execution begins.**

Before freezing:
- inspect the complete intended tree, not only individual branches;
- confirm no necessary branch is missing;
- confirm all groups remain sufficient when considered together;
- confirm execution dependencies are explicit, acyclic, and sufficient to derive required ordering;
- confirm implementation-ready leaves can be grouped into coherent executor-chat responsibilities without hidden design decisions;
- confirm all material decisions that affect implementation are resolved;
- run one final KISS pass.

A pass here approves a **specific reviewed baseline**. Record baseline evidence in `.planning/REVIEWS.md`.

## Gate 10A — Freeze no-drift

Before setting `.planning/STATUS.yaml -> plan_state: frozen`, prove that the material planning baseline still matches the baseline that passed Final Planning Review.

Default material files:
- `.planning/GOAL.md`;
- `.planning/TREE.yaml`;
- `.planning/DECISIONS.md`.

When Git refs are available, prefer:

```text
node .planning/verify-freeze-baseline.mjs --reviewed-ref <reviewed-ref>
```

If merge/rebase/integration later creates a different actual frozen ref, repeat with:

```text
node .planning/verify-freeze-baseline.mjs --reviewed-ref <reviewed-ref> --frozen-ref <frozen-ref>
```

A non-Git workflow may use equivalent reproducible evidence, but must record it in REVIEWS.

Any material drift is `changes-required`: keep/return planning active, review the changed baseline again, and record new reviewed-baseline evidence. Do not waive drift based on perceived smallness.

Only Gate 10 plus Gate 10A allow `.planning/STATUS.yaml -> plan_state: frozen`. Freeze does not authorize implementation; `.planning/STATUS.yaml -> implementation_authorized` remains false through post-freeze handoff.

## Fresh planning-chat continuity check

For planning continuation, a fresh GPT should be able to read repository state and identify:
- the goal;
- current planning location;
- blockers;
- next planning action;
- whether the plan is active or frozen.

This is separate from the mandatory **executor** handoff gate below.

## Gate 11 — Execution allocation

Before allocation, if any merge/rebase/integration occurred after Gate 10A, re-confirm no drift against the resulting frozen ref.

After freeze, with `.planning/STATUS.yaml -> implementation_authorized: false`, pass only when:

- every implementation-ready frozen leaf appears exactly once in `EXECUTION.yaml`;
- no non-leaf or non-approved planning node is assigned as executable work;
- every executor chat owns a coherent and manageable set of leaves;
- allocation respects the `depends_on` graph;
- no chat-level dependency graph duplicates TREE dependencies;
- no single leaf is so large that the executor must materially re-plan it;
- every node begins as `pending`;
- execution state uses only pending / in_progress / done / blocked;
- `done` requires verified success evidence;
- an executor can begin from its chat number without needing the previous planning conversation.

Execution allocation is a thin projection of the frozen tree, not a second planning model.

Passing allocation is necessary but does not itself authorize execution.

### Mechanical proof for Gate 11

Before first authorization run:

```text
node .planning/validate-allocation.mjs --initial
```

The validator must pass. It checks exact leaf coverage, rejects non-leaf/non-approved assignments, validates execution states and dependency targets, and requires initial nodes to remain `pending` with `result: null`.

If numbered chats are explicitly serial, add `--serial-chats`; that mode additionally requires contiguous chat IDs and dependency placement in an earlier chat or earlier in the same chat. Do not enable it for ordinary parallel-capable allocation.

For re-authorization after execution/replanning, run `--resume` instead so valid completed nodes can remain completed while state/result consistency is still checked.

Any validator failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`.

## Gate 12 — Mandatory fresh-chat executor handoff

Before implementation authorization, follow `.planning/EXECUTOR_HANDOFF.md` and simulate fresh executors from repository state only.

Pass only when representative simulations cover:
- first available executor;
- dependency-blocked early executor;
- mid-plan executor with multiple dependencies;
- final closure executor.

For each case, the fresh executor must correctly determine:
- authorization state;
- assigned nodes;
- prerequisite states;
- first runnable node or that none is runnable;
- exact contract/project context to load next;
- factual blocker when it cannot proceed.

Use actual allocated chats/nodes when possible. If the allocation is too small to contain one literal shape, simulate the condition against the closest real assignment without changing durable EXECUTION state and record that adaptation.

Record the gate result in `REVIEWS.md`.

Any failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`. Fix the smallest handoff/allocation/context-routing defect and rerun the failed case.

Only a pass here allows `.planning/STATUS.yaml -> implementation_authorized: true`.

## Gate 13 — Re-freeze after an execution-discovered defect

When a frozen plan is reopened, first set `.planning/STATUS.yaml -> implementation_authorized: false`, then re-freeze only when:

- the material defect is represented and corrected in TREE/DECISIONS;
- affected Necessity/Sufficiency/parallel logic has been re-reviewed;
- review upward shows the impact is contained;
- affected whole-plan coverage remains valid;
- affected `depends_on` relationships are valid and acyclic;
- each previously `done` affected node was explicitly checked for continued validity;
- invalidated completed nodes were reset to `pending` or removed if obsolete;
- obsolete execution leaf IDs were removed;
- new implementation-ready leaves appear exactly once in EXECUTION;
- unaffected valid work was not unnecessarily reset;
- the corrected baseline has a new focused-review baseline evidence record;
- Gate 10A no-drift verification passes for that corrected baseline before re-freeze.

Re-freeze alone does not restore execution permission. First rerun Gate 11 mechanical validation with `--resume`, then Gate 12 must pass again and be recorded before `.planning/STATUS.yaml -> implementation_authorized: true` is restored.

Do not require a new global plan version. Git history and REVIEWS provide the audit trail.
