# Worked Example — Safe CSV Import

This example demonstrates the S&T Planner on a small but realistic software change.

## Scenario

A backend service must let users import customer records from CSV files safely and predictably.

The example intentionally shows **partial planning**:

- the root has been decomposed;
- branch `0.1` has been decomposed to executable leaves;
- that branch passed review;
- implementation is allowed only for that approved horizon;
- the next planning action is to decompose `0.2`.

This demonstrates that a project does not need every distant branch fully decomposed before useful work can begin.

## Files

- `GOAL.md` — outcome, current reality, constraints, non-goals and evidence.
- `TREE.yaml` — S&T structure and assumptions.
- `STATUS.yaml` — exact resume point for a fresh session.
- `DECISIONS.md` — one concrete alternative decision.
- `REVIEWS.md` — review evidence for the released branch.

## Fresh-session exercise

A fresh AI should be able to read only these files and correctly conclude:

1. the overall goal;
2. why the four root children exist;
3. that `0.1.1` and `0.1.2` are executable;
4. that implementation is allowed for those two leaves;
5. that the next planning task is `0.2`;
6. that implementation outside the approved horizon is still blocked.
