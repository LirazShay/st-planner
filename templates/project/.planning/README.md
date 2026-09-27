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
2. `.planning/STATUS.yaml`
3. `GOAL.md`
4. relevant `TREE.yaml` nodes
5. `DECISIONS.md` when needed
6. `REVIEWS.md` when needed

## Executor read order

1. project `AGENTS.md` and its routing/source-of-truth rules
2. `EXECUTOR_HANDOFF.md`
3. `.planning/STATUS.yaml` — require both `plan_state: frozen` and `implementation_authorized: true`
4. `EXECUTION.yaml`
5. only assigned `TREE.yaml` nodes
6. dependency states from EXECUTION
7. only referenced/materially required decisions and target-project context

## Ownership

- GOAL — stable goal boundary.
- TREE — S&T logic, planning status, dependencies, success evidence.
- DECISIONS — material open questions and decisions.
- REVIEWS — planning review history.
- .planning/STATUS.yaml — S&T Planner-owned small planning resume pointer, active/frozen planning state, and explicit implementation-authorization gate.
- EXECUTION — after freeze only: numbered chat allocation + execution state/result for leaf node IDs.
- EXECUTOR_HANDOFF — stable fresh-executor bootstrap/read-order and handoff verification contract; never task content.
- validate-allocation.mjs — portable mechanical validator for TREE/EXECUTION allocation invariants; framework tooling, not project state.
- verify-freeze-baseline.mjs — portable freeze no-drift verifier for the reviewed material baseline; framework tooling, not project state.

## Important

- One planning chat is preferred.
- New planning chats are optional continuation only.
- Do not implement while `.planning/STATUS.yaml -> plan_state: active`.
- The whole intended plan must pass Final Planning Review before `.planning/STATUS.yaml -> plan_state: frozen`.
- `.planning/STATUS.yaml -> plan_state: frozen` does **not** authorize implementation.
- Keep `.planning/STATUS.yaml -> implementation_authorized: false` while post-freeze allocation/handoff checks are still being completed.
- After freeze, assign every implementation-ready leaf exactly once in EXECUTION.
- Before first authorization run `node .planning/validate-allocation.mjs --initial`. Any failure blocks authorization.
- Use `--serial-chats` only when the target explicitly treats numbered chats as a serial execution order.
- After replanning with preserved execution state, validate with `--resume`.
- Execution may begin only after allocation validation passes, the mandatory repository-only fresh-chat verification in EXECUTOR_HANDOFF passes and is recorded in REVIEWS, and `.planning/STATUS.yaml -> implementation_authorized: true` is set explicitly.
- A target repository's root `STATUS.yaml`, phase, release state, or workstream status is target-owned and is never an alias for `.planning/STATUS.yaml`.
- Do not duplicate Strategy/Tactic/task descriptions in EXECUTION.
- Execution dependencies remain in TREE -> depends_on.
