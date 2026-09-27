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

Stop when an executor would not need another material design/product decision.

Do not decompose into trivial coding/clicking instructions.

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

The task should reference the S&T node and contain enough resolved context that execution is implementation, not a second round of planning.
