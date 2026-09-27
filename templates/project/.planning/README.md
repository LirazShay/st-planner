# Project Planning State

This directory is the durable S&T planning memory for this project.

## Read order for a fresh AI session

1. `FRAMEWORK.md` — read once at the start of a fresh session; it contains the portable S&T rules.
2. `STATUS.yaml`
3. `GOAL.md`
4. the active part of `TREE.yaml`
5. `DECISIONS.md` only when referenced or needed
6. `REVIEWS.md` only when referenced or needed
7. `EXECUTION.md` only when referenced or when continuing/validating execution

This directory is self-contained for V1. The central S&T Planner repository contains deeper documentation but is not required to resume ordinary planning.

## Rules

- Do not rely on chat history as project state.
- Do not create an arbitrary number of phases or tasks.
- Implement only node IDs listed in `STATUS.yaml -> implementation_scope`; an empty list blocks all implementation.
- GOAL owns the stable boundary only.
- TREE owns S&T logic, node status, and success evidence.
- DECISIONS owns material unresolved questions and their resolutions.
- REVIEWS owns planning audit history only.
- EXECUTION owns observed execution/verification outcomes and facts learned from doing the work.
- STATUS owns only the resume pointer and implementation scope, including pointers to the latest relevant planning review and execution outcome.
- Update planning state after material decisions or reviews.
- Keep these files concise; store each fact in one authoritative place.
