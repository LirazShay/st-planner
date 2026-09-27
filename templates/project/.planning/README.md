# Project S&T Planning State

This directory contains the durable planning state for the project.

## Read order

1. `FRAMEWORK.md`
2. `STATUS.yaml`
3. `GOAL.md`
4. relevant `TREE.yaml` nodes
5. `DECISIONS.md` when needed
6. `REVIEWS.md` when needed

## Ownership

- GOAL — stable goal boundary.
- TREE — S&T logic and node planning status.
- DECISIONS — material open questions and decisions.
- REVIEWS — review history.
- STATUS — small resume pointer.

## Important

- One planning chat is preferred.
- New planning chats are optional continuation only.
- Do not implement the target project while `plan_state: active`.
- The whole intended plan must pass Final Planning Review before `plan_state: frozen`.
- After freezing, use ordinary GitHub Issues/tasks for execution.
