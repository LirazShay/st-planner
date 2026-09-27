# Portable S&T Planning Kernel

This file is the minimum self-contained method a fresh AI session needs in order to use this project's planning state correctly.

For deeper explanation, examples, and source notes, see the central S&T Planner repository. This file is intentionally compact.

## 1. A plan is a logical tree, not a task brainstorm

Every active S&T step contains:

- **Strategy** — the objective: what for?
- **Tactic** — the chosen action: how?
- **Parallel assumptions** — why this tactic can achieve this strategy.

For a child step also capture:

- **Necessary assumptions** — why this child is independently necessary for its parent.

For a parent with children capture:

- **Sufficiency assumptions** — why the children together are sufficient for the parent.

There may be multiple assumptions of each type.

## 2. Going down

To decompose a parent, inspect its tactic and ask:

> How exactly must this action be performed?

Each independent necessary action becomes a child tactic.

Then ask:

> What specific objective exists if this child tactic succeeds?

That becomes the child strategy.

A child belongs in the group only if it is necessary **on its own merit** for the parent. If it is merely a means for another sibling, move it below that sibling.

Do not choose the number of children in advance.

A one-child decomposition is normally just rewording; merge the level unless there is a clear reason not to.

## 3. Necessity test

For every required child:

> Remove this child and do not replace it. Can the remaining group still achieve the parent?

If yes, challenge the child. It may be optional, duplicated, an alternative, or at the wrong level.

## 4. Sufficiency test

For every parent:

> Assume every child succeeds. Could the parent still fail because some required condition is missing?

If yes, the group is incomplete.

If a required condition already exists in current reality and needs no action, record it as a fact/assumption rather than inventing a task.

## 5. Choosing a tactic

A strategy should have one selected tactic in the active plan.

If several tactics could each achieve the same strategy, they are alternatives. Record the decision and keep only the selected tactic active.

An alternative may also be an entirely different lower-level group that would be sufficient for the same parent.

## 6. Going up

If planning starts too low, inspect the strategy and ask:

> Why do we need this objective? What higher objective does it enable?

Use the answer to construct the higher step, then re-check lower-level sufficiency.

## 7. Do not confuse facts and assumptions

Keep these distinct:

- **Fact** — observed/supplied/sourced.
- **Assumption** — believed for planning but not established.
- **Decision** — choice among alternatives.
- **Unknown** — unresolved information.
- **Evidence** — observation that demonstrates an outcome.

Do not silently turn an unknown into a fact.

## 8. Stop decomposition at executable leaves

A leaf is executable when the intended actor has:

- a clear action;
- clear scope;
- required inputs;
- objective completion evidence;
- no unresolved decision that materially changes the work.

Do not decompose into implementation trivia merely to make the tree larger.

## 9. Review as a critic

After authoring a coherent branch, switch roles and try to break it.

Check:

1. Is the goal clear?
2. Does each tactic actually achieve its strategy?
3. Is each required child necessary?
4. Are siblings sufficient together?
5. Are material assumptions explicit?
6. Is anything over-engineered?
7. Are leaves genuinely executable?
8. Could a fresh session continue from repository state?

Fix defects before releasing the affected horizon to implementation.

## 10. KISS

Prefer the smallest logically complete plan.

Avoid:

- tool-first planning;
- speculative future requirements;
- arbitrary phase counts;
- duplicate nodes;
- huge context dumps;
- planning documents that do not protect a decision or handoff.

## 11. Special cases in V1

Do not over-design these yet:

- multiple parents;
- supporting-but-not-necessary steps;
- rich scheduling/time dependency.

For now, record them as notes and keep the clearest simple S&T structure. Do not falsely label something necessary just to fit it into the tree.

## 12. Persistent state

Chat history is not authoritative.

The durable state is this directory:

- `GOAL.md`
- `TREE.yaml`
- `STATUS.yaml`
- `DECISIONS.md`
- `REVIEWS.md`

Before ending meaningful planning work, update STATUS so another session can identify the next action.

### Minimal state ownership

Keep one source of truth for each kind of state:

- `TREE.yaml` owns S&T structure and node planning status.
- `DECISIONS.md` owns open/decided alternatives.
- `REVIEWS.md` owns review history.
- `STATUS.yaml` is only the resume pointer: mode, current node, blockers, next action, implementation scope, and latest relevant review.

Each TREE node uses the minimal V1 schema:

- `status`
- `strategy`
- `tactic`
- `parallel_assumptions`
- `necessary_assumptions`
- `sufficiency_assumptions`
- `success_evidence`
- `children`

Do not add catch-all node metadata unless real use proves it necessary. Facts and unknowns belong in GOAL, alternatives in DECISIONS, review history in REVIEWS, and resume state in STATUS.

Node planning status uses only:

- `draft` — this node's own planning logic is not yet approved;
- `blocked` — this node itself cannot currently advance because a specific unresolved blocker prevents its planning;
- `approved` — this node's own Strategy/Tactic logic and its immediate decomposition, if present, passed the relevant planning gates.

Status is **local, never cascading**. An approved parent may have draft or blocked descendants. A blocked child does not automatically block its parent. Subtree readiness is determined by the actual descendant statuses and `implementation_scope`, not by propagating status upward.

For an approved node, `success_evidence` must be concrete enough to recognize achievement of its strategy. For a parent, approval of its immediate decomposition does not imply that all descendants are executable.

Do not duplicate approved-node lists in STATUS.

## 13. Implementation gate

`implementation_scope` is the single source of truth for execution permission:

- `implementation_scope: []` → no implementation is permitted.
- A non-empty list → implementation is permitted **only** for those node IDs.
- Everything outside that list remains blocked.

Only approved, executable leaves may enter `implementation_scope`.

Do not add a second permission boolean; it creates contradictory states without adding information.

GitHub Issues or other task trackers are execution output. They are not the source of the S&T rationale.
