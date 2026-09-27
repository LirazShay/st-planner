# Portable S&T Planning Kernel

This is the minimum planning method a fresh GPT needs.

## 1. Strategy + Tactic

Every node contains:

- **Strategy** — what objective must exist?
- **Tactic** — how will it be achieved?
- **Parallel assumptions** — why can this tactic achieve this strategy?
- **Necessary assumptions** — why is this child necessary for its parent?
- **Sufficiency assumptions** — why are the children enough together?
- **Success evidence** — how will achievement be recognized?

## 2. Where each assumption belongs

Keep the three logical relationships distinct:

- `parallel_assumptions` belong to the **node itself**: why this node's Tactic can achieve this node's Strategy.
- `necessary_assumptions` belong to the **child → parent relationship**: why this child Strategy is necessary for its parent. Store them on the child.
- `sufficiency_assumptions` belong to the **children-as-a-group → parent relationship**: why this parent's children are sufficient together. Store them on the parent.

V1 deliberately does **not** add a separate edge object or duplicate `parent` field:
- the parent is derived from the parent's `children` list;
- every non-root node has exactly one logical parent;
- the root has no necessary assumptions;
- a leaf normally has no sufficiency assumptions because it has no children.

This placement keeps the tree compact while preserving the S&T logic.

## 3. Go down by asking "How?"

For the parent tactic ask:

> How exactly must this be performed?

Each child should represent an independently necessary part of performing the parent tactic.

A one-child decomposition is usually just rewording.

## 4. Necessity

For every child:

> Remove it without replacing it. Can the parent still be achieved?

If yes, challenge its place in the required tree.

## 5. Sufficiency

For every parent:

> Assume all children succeed. What required condition could still be missing?

If something is missing, the group is incomplete.

## 6. Alternatives and unknowns

Do not represent alternatives as simultaneous necessary children.

Material unresolved questions belong in `DECISIONS.md`.

Do not guess important unknowns.

## 7. Stop at implementation-ready leaves

There is no QUICK/DEEP mode. Small problems naturally produce small trees; difficult problems naturally produce deeper trees.

Stop when an executor would not need another material design/product decision.

Do not decompose into trivial coding/clicking instructions.

## 8. Node planning status

Use exactly three local planning statuses:

- `draft` — the node is still being designed/reviewed and may change.
- `blocked` — planning for this node cannot proceed because a material unresolved question exists.
- `approved` — this node's own Strategy/Tactic logic and immediate decomposition have passed local review.

KISS rules:

- Do not add more node statuses in V1.
- `blocked` is not a synonym for "unfinished"; ordinary unfinished work stays `draft`.
- Every `blocked` node must have at least one open entry in `DECISIONS.md` that references that node.
- Do not add a separate `blocked_by` field to TREE; the D-entry is the source of the reason.
- Status is local. A blocked descendant does not automatically change its parent from approved to blocked.
- Local approval never authorizes implementation before the whole plan is frozen.

## 9. Review as you build

Check:
- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumptions;
- KISS;
- tree consistency.

Local approval means planning logic is sound locally. It does not authorize implementation.

## 10. Whole-plan completeness audit

Local Necessity/Sufficiency checks can still miss a whole concern if that concern never entered the tree.

Before Final Planning Review, perform one **outside-in coverage audit** from `GOAL.md`.

Do not create a separate coverage file. Use these challenge questions:

1. **Goal traceability** — For every meaningful clause in the desired outcome and every hard constraint, where is it protected by the TREE, a material assumption, a decision, or success evidence?
2. **Root gap test** — Assume every planned leaf succeeds exactly as written. Can the desired outcome still fail for a reason the plan should have handled?
3. **Boundary challenge** — Look only at actors, system boundaries, external dependencies, and failure paths that materially affect this goal. Did the plan silently assume one of them away?
4. **Negative-space check** — Did the tree accidentally include work that belongs to a stated non-goal?
5. **Scenario walkthrough** — Walk a small number of representative end-to-end scenarios implied by the goal. Include a failure/edge scenario only when it could materially invalidate the plan.

If the audit finds a gap:
- add/correct the smallest affected S&T branch;
- create a D-entry if the gap is an unresolved material question;
- re-run affected Necessity/Sufficiency reviews.

If it finds no gap, record the pass in the normal Final Planning Review. Do not persist a duplicate coverage matrix.

## 11. Finish the entire plan before execution

Do not hand partially planned leaves to implementation.

When the whole intended tree is ready, run Final Planning Review across the complete plan.

Only after it passes:

```yaml
plan_state: frozen
```

Before that:

```yaml
plan_state: active
```

## 12. Keep state simple

- `GOAL.md` — stable boundary.
- `TREE.yaml` — S&T plan.
- `DECISIONS.md` — material questions/decisions.
- `REVIEWS.md` — review history.
- `STATUS.yaml` — where planning currently stands.

Prefer one planning conversation. Repository state exists so continuation is possible when needed.

## 13. Execution handoff

After freeze, convert implementation-ready leaves into ordinary GitHub Issues/tasks.

Then map those Issues into numbered executor chats in `CHAT-ASSIGNMENTS.yaml`.

The map is intentionally tiny:
- Issue numbers;
- referenced S&T node IDs;
- prerequisite chat numbers.

The task details remain in GitHub.

A chat that says "I am chat N" / "אני צ'אט מספר N" reads that assignment, checks prerequisites, pulls only its Issues, and executes only that scope.

Do not create a new execution state machine.
