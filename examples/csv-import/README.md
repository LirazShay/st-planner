# Worked Example — Safe CSV Import

This example demonstrates S&T planning on a small software change.

## Scenario

A backend service must let users import customer records from CSV files safely and predictably.

## Current planning state

- The root is decomposed.
- Branch `0.1` has passed local review.
- Branch `0.2` has been decomposed.
- `0.2.1` is blocked by open decision `D-002` about duplicate-customer behavior.
- Branches `0.3` and `0.4` still require deeper planning.
- The overall plan is therefore still `active`.
- **Nothing from this example is released for implementation yet.**

This demonstrates an important rule:

> A locally approved/executable branch does not authorize implementation while the complete intended plan is still being built. Even after final freeze, explicit implementation authorization is still required after handoff.

## Optional fresh-chat continuation

The example also proves that, if planning ever must move to a new chat, repository state is enough to recover:

- the goal;
- the current S&T area;
- the open material decision;
- the next planning action.

That capability is a fallback, not a requirement to split planning across chats.

## Files

- `GOAL.md` — stable goal boundary.
- `TREE.yaml` — S&T structure, assumptions, local planning status, and success evidence.
- `DECISIONS.md` — material open questions and decisions.
- `REVIEWS.md` — planning review history.
- `STATUS.yaml` — current planning pointer plus explicit implementation-authorization gate.

The example should reach implementation only after the remaining branches are completed, a Final Planning Review passes for the whole tree, post-freeze handoff is complete, and implementation is explicitly authorized.
