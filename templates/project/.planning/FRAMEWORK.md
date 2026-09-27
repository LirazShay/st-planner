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

## 2. Go down by asking "How?"

For the parent tactic ask:

> How exactly must this be performed?

Each child should represent an independently necessary part of performing the parent tactic.

A one-child decomposition is usually just rewording.

## 3. Necessity

For every child:

> Remove it without replacing it. Can the parent still be achieved?

If yes, challenge its place in the required tree.

## 4. Sufficiency

For every parent:

> Assume all children succeed. What required condition could still be missing?

If something is missing, the group is incomplete.

## 5. Alternatives and unknowns

Do not represent alternatives as simultaneous necessary children.

Material unresolved questions belong in `DECISIONS.md`.

Do not guess important unknowns.

## 6. Stop at implementation-ready leaves

There is no QUICK/DEEP mode. Small problems naturally produce small trees; difficult problems naturally produce deeper trees.

Stop when an executor would not need another material design/product decision.

Do not decompose into trivial coding/clicking instructions.

## 7. Node planning status

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

## 7. Review as you build

Check:
- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumptions;
- KISS;
- tree consistency.

Local approval means planning logic is sound locally. It does not authorize implementation.

## 8. Finish the entire plan before execution

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

## 9. Keep state simple

- `GOAL.md` — stable boundary.
- `TREE.yaml` — S&T plan.
- `DECISIONS.md` — material questions/decisions.
- `REVIEWS.md` — review history.
- `STATUS.yaml` — where planning currently stands.

Prefer one planning conversation. Repository state exists so continuation is possible when needed.

## 10. Execution handoff

After freeze, convert implementation-ready leaves into ordinary GitHub Issues/tasks.

Then map those Issues into numbered executor chats in `CHAT-ASSIGNMENTS.yaml`.

The map is intentionally tiny:
- Issue numbers;
- referenced S&T node IDs;
- prerequisite chat numbers.

The task details remain in GitHub.

A chat that says "I am chat N" / "אני צ'אט מספר N" reads that assignment, checks prerequisites, pulls only its Issues, and executes only that scope.

Do not create a new execution state machine.
