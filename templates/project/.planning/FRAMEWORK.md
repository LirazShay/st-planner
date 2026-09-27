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

## 13. Implementation gate

Do not implement while:

```yaml
implementation_allowed: false
```

When the next execution horizon passes the logical, KISS, and executability reviews, set it to true **and explicitly list the approved node IDs in `implementation_scope`**.

A fresh session must interpret permission as:

- `implementation_allowed: false` → no implementation.
- `implementation_allowed: true` → implementation is allowed **only** for nodes listed in `implementation_scope`.
- Everything outside that scope remains blocked.

Never treat the boolean alone as global permission.

GitHub Issues or other task trackers are execution output. They are not the source of the S&T rationale.
