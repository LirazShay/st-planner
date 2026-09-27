# S&T Planner Quality Gates

## Gate 1 — Goal

- desired outcome is clear;
- current reality is separated from assumptions;
- constraints are explicit;
- non-goals prevent scope drift.

## Gate 2 — Node validity

For each active node:
- Strategy states an objective;
- Tactic states an action;
- Parallel assumptions genuinely justify the Strategy/Tactic relationship;
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
- statuses are draft / blocked / approved;
- approval is local, not recursive.

## Gate 8 — Implementation readiness

For each final leaf:
- responsibility is clear;
- scope is clear;
- relevant decisions are resolved;
- required inputs/dependencies are known;
- success evidence is objective;
- no material design decision is left for the executor.

## Gate 9 — Final whole-plan review

**The whole intended plan must be complete before execution begins.**

Before freezing:
- inspect the complete intended tree, not only individual branches;
- confirm no necessary branch is missing;
- confirm all groups remain sufficient when considered together;
- confirm execution dependencies/order are understandable;
- confirm all material decisions that affect implementation are resolved;
- run one final KISS pass.

Only a pass here allows `plan_state: frozen`.

## Fresh-chat continuity check

Optional but recommended:
A fresh GPT should be able to read the repository state and identify:
- the goal;
- current planning location;
- blockers;
- next planning action;
- whether the plan is active or frozen.
