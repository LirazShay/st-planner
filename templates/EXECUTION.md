# Execution

> Project-owned execution truth for the implementation-ready leaves in `PLAN.md`. Reference the plan; do not duplicate task descriptions here.

| Task | Owner | Status | Depends on | Result |
|---|---|---|---|---|
| <ID> | <Chat N / agent / developer / team> | pending | — | — |

## Status values

Use only:

- `pending` — required work exists but has not meaningfully started;
- `in_progress` — the assigned owner is actively working on it;
- `done` — relevant success evidence has been verified;
- `blocked` — a real condition prevents correct progress within the assigned scope.

Do not use `blocked` merely because a visible prerequisite is still pending.

## Allocation rules

- Every required implementation-ready leaf should be represented once unless there is an explicit reason otherwise.
- Group work into the fewest coherent execution units that remain practical.
- Prefer shared implementation context, dependency compatibility, and cohesion over arbitrary equal sizing.
- Preserve useful parallelism without multiplying handoffs unnecessarily.
- `Depends on` records only real execution prerequisites, not priority, preference, or chat order.
- Keep `Result` short: reference the useful verification, commit, PR, test, artifact, or factual blocker.

## Numbered chats

Numbered chats are optional execution owners. A new `Chat N` becomes active only when explicitly started (for example, `אני צאט N תתחיל` or `I am chat N`). Generic continuation must not silently switch executor identity.

## Replanning during execution

When new information appears, use the Planning Impact Test from `docs/SNT-METHODOLOGY.md`:

- implementation defect → fix/verify without changing the plan merely for ceremony;
- local planning correction → update the smallest affected PLAN area and affected rows here;
- material plan invalidation → revise only the affected S&T/downstream execution scope and preserve unaffected valid completed work.
