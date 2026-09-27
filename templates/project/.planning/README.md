# Project Planning State

This directory is the durable S&T planning memory for this project.

## Read order for a fresh AI session

1. `STATUS.yaml`
2. `GOAL.md`
3. the active part of `TREE.yaml`
4. `DECISIONS.md` only when referenced or needed
5. `REVIEWS.md` only when referenced or needed

The S&T method and review rules come from the S&T Planner framework.

## Rules

- Do not rely on chat history as project state.
- Do not create an arbitrary number of phases or tasks.
- Do not implement while `STATUS.yaml` says implementation is not allowed.
- Update planning state after material decisions or reviews.
- Keep these files concise; store only information that changes planning or handoff.
