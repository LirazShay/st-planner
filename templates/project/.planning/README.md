# Project Planning State

This directory is the durable S&T planning memory for this project.

## Read order for a fresh AI session

1. `FRAMEWORK.md` — read once at the start of a fresh session; it contains the portable S&T rules.
2. `STATUS.yaml`
3. `GOAL.md`
4. the active part of `TREE.yaml`
5. `DECISIONS.md` only when referenced or needed
6. `REVIEWS.md` only when referenced or needed

This directory is self-contained for V1. The central S&T Planner repository contains deeper documentation but is not required to resume ordinary planning.

## Rules

- Do not rely on chat history as project state.
- Do not create an arbitrary number of phases or tasks.
- Do not implement while `STATUS.yaml` says implementation is not allowed.
- Update planning state after material decisions or reviews.
- Keep these files concise; store only information that changes planning or handoff.
