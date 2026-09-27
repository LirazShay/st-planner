# Project S&T State

This directory contains the durable planning state and the minimal post-freeze execution allocation.

## User-facing planning command

Normal usage from a planning chat can be as short as:

> תתכנן לי בשיטת S&T Planner לפי הריפו: <מה אני רוצה להשיג>

or:

> Plan this with S&T Planner using the repository: <desired outcome>

The project `AGENTS.md` owns the automatic behavior behind this command. The user should not need to name these files or repeat the framework procedure.

## Planner read order

1. `FRAMEWORK.md`
2. `STATUS.yaml`
3. `GOAL.md`
4. relevant `TREE.yaml` nodes
5. `DECISIONS.md` when needed
6. `REVIEWS.md` when needed

## Executor read order

1. project `AGENTS.md`
2. `STATUS.yaml` — require both `plan_state: frozen` and `implementation_authorized: true`
3. `EXECUTION.yaml`
4. only assigned `TREE.yaml` nodes
5. referenced decisions/context when needed

## Ownership

- GOAL — stable goal boundary.
- TREE — S&T logic, planning status, dependencies, success evidence.
- DECISIONS — material open questions and decisions.
- REVIEWS — planning review history.
- STATUS — small planning resume pointer, active/frozen planning state, and explicit implementation-authorization gate.
- EXECUTION — after freeze only: numbered chat allocation + execution state/result for leaf node IDs.

## Important

- One planning chat is preferred.
- New planning chats are optional continuation only.
- Do not implement while `plan_state: active`.
- The whole intended plan must pass Final Planning Review before `plan_state: frozen`.
- `plan_state: frozen` does **not** authorize implementation.
- Keep `implementation_authorized: false` while post-freeze allocation/handoff checks are still being completed.
- After freeze, assign every implementation-ready leaf exactly once in EXECUTION.
- Execution may begin only after the required handoff checks pass and `implementation_authorized: true` is set explicitly.
- Do not duplicate Strategy/Tactic/task descriptions in EXECUTION.
- Execution dependencies remain in TREE -> depends_on.
