# Execution — Safe CSV Import

> Worked ST Planner 2.0 execution map. The S&T leaves in `PLAN.md` are the tasks; this file stores only assignment, real prerequisites, work state, and short result evidence.

| Task | Owner | Status | Depends on | Result |
|---|---|---|---|---|
| 0.1.1 | Chat 1 | pending | — | — |
| 0.1.2 | Chat 1 | pending | 0.1.1 | — |
| 0.2.1 | Chat 2 | pending | — | — |
| 0.2.2 | Chat 2 | pending | 0.1.2, 0.2.1 | — |
| 0.2.3 | Chat 2 | pending | 0.2.2 | — |
| 0.3.1 | Chat 3 | pending | 0.1.2, 0.2.2 | — |
| 0.3.2 | Chat 3 | pending | 0.2.3, 0.3.1 | — |
| 0.4.1 | Chat 4 | pending | — | — |
| 0.4.2 | Chat 4 | pending | 0.1.2, 0.2.2, 0.3.2, 0.4.1 | — |

## Why this grouping

### Chat 1 — Input contract and parsing

Tasks `0.1.1` and `0.1.2` share the same CSV boundary/parsing context and naturally form one coherent execution unit.

### Chat 2 — Admissibility and persistence protection

Tasks `0.2.1`–`0.2.3` share customer-domain validation and persistence-gate context. `0.2.1` can begin independently while Chat 1 works; `0.2.2` waits for the parser output contract; `0.2.3` follows candidate evaluation.

### Chat 3 — Atomic persistence

Tasks `0.3.1` and `0.3.2` share transaction/batch-persistence context. They start after the relevant validation semantics are executable.

### Chat 4 — Result contract and mapping

Task `0.4.1` can define the external result contract independently. Task `0.4.2` waits for terminal workflow outcomes to be implemented so integration evidence can prove response/database consistency.

## Execution notes

- Chat numbering is ownership, not an implicit global sequence.
- A Chat N starts only when explicitly activated.
- Unmet entries in `Depends on` keep a task `pending`; they do not require a separate blocker state.
- Mark a task `done` only after the success evidence in `PLAN.md` is verified.
- If execution discovers a normal implementation defect, fix and verify it without changing the plan merely for ceremony.
- If new evidence materially invalidates an S&T decision, update only the affected PLAN area and downstream execution rows.

## Coverage check

All nine implementation-ready leaves from `PLAN.md` appear exactly once. The table contains no task descriptions duplicated from the plan and no framework/process state such as freeze, authorization, validation, or handoff flags.
