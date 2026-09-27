# Worked Example — Safe CSV Import

This example demonstrates the S&T Planner on a small but realistic software change, including a fresh-session handoff.

## Scenario

A backend service must let users import customer records from CSV files safely and predictably.

## Current example state

- The root has been decomposed.
- Branch `0.1` is decomposed to executable leaves and has passed review.
- A simulated fresh session successfully recovered the state and continued into branch `0.2`.
- Branch `0.2` was decomposed into admissibility definition, candidate evaluation, and persistence enforcement.
- The fresh session correctly discovered that duplicate-customer behavior is a material unknown and created open decision `D-002` instead of inventing a rule.
- Implementation remains allowed only for the previously approved horizon: `0.1.1` and `0.1.2`.
- The next planning action is to resolve `D-002`, then review `0.2.1`.

This demonstrates two important properties:

1. a project can execute an approved near-term horizon without fully planning distant branches;
2. a fresh session can continue from repository state and stop when it reaches a real product/domain decision that is not present in the persisted context.

## Files

- `GOAL.md` — outcome, current reality, constraints, non-goals and evidence.
- `TREE.yaml` — S&T structure and assumptions.
- `STATUS.yaml` — exact resume point for a fresh session.
- `DECISIONS.md` — decided and open alternatives.
- `REVIEWS.md` — logical reviews plus the handoff test result.

## Fresh-session exercise

A new AI reading the portable S&T framework plus these persisted files should conclude:

1. the overall goal is safe and predictable customer CSV import;
2. `0.1.1` and `0.1.2` are the only currently approved implementation nodes;
3. `0.2` itself is approved because its own Strategy/Tactic and immediate decomposition passed review;
4. that approval does not cascade: `0.2.1` is still blocked by open decision `D-002`;
5. no duplicate policy should be guessed;
6. the next planning action is to resolve `D-002`;
7. implementation is permitted only for node IDs listed in `implementation_scope`; everything else remains blocked.
