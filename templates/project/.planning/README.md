# Project S&T State

This directory contains the current S&T planning-cycle state, installed framework/tooling, and the minimal post-freeze execution allocation.

The same installation is reused sequentially for later project/release/feature/change scopes. V1 allows one active S&T cycle per repository.

## User-facing planning command

Normal usage from a planning chat can be as short as:

> תתכנן לי בשיטת S&T Planner לפי הריפו: <מה אני רוצה להשיג/לבנות/לשנות>

or:

> Plan this with S&T Planner using the repository: <desired outcome/change>

The scope may be a project, release, feature, migration, refactor, architecture change, or another meaningful change. The user should not need to classify it, name these files, or repeat the framework procedure.

The planner should keep the user-facing transition equally simple. Once the plan is frozen, allocation/handoff checks pass, and implementation is authorized, tell the user explicitly:
- that planning is ready for execution;
- how many executor chats were allocated;
- which executor chat(s) are runnable now based on `depends_on` and current EXECUTION states;
- the exact next action: open a **new chat** in the same target repository and say `אני צאט N תתחיל` (established explicit forms such as `אני צ'אט מספר N` / `I am chat N` remain valid) for one of those runnable chat IDs.

Do not hard-code Chat 1 unless Chat 1 is actually runnable. If several chats can start in parallel, tell the user which ones can be opened independently. Do not make the user inspect `STATUS.yaml` or `EXECUTION.yaml` to discover whether planning is ready, which chat can start, or what to do next.

Chat allocation is not chat activation. Repository pointers identify which executor is allowed/next; only an explicit startup in that conversation activates the executor identity. Once activated, a conversation's executor identity is immutable. After a `SEQUENCE_RUNNER_NEW_CHAT` handoff, the old conversation is execution-closed for later allocated chats even if the repo advances and the user writes `תמשיך לשלב הבא` there.

After Cycle Closure Review reaches `completed`, tell the user explicitly that this scope is closed and that a later scope can be requested with the normal short S&T Planner command. If the cycle becomes `abandoned`, say that it was closed without claiming the planned outcome succeeded.

## Planner read order

1. project `AGENTS.md` and its routing/source-of-truth rules
2. `FRAMEWORK.md`
3. `.planning/STATUS.yaml`
4. `GOAL.md`
5. relevant `TREE.yaml` nodes
6. `DECISIONS.md` when needed
7. `REVIEWS.md` when needed

Before replacing current-cycle state, inspect `STATUS.yaml -> cycle_state`:
- `active` — resume/replan the current cycle; do not erase it merely because another request arrived;
- `completed` / `abandoned` — a new independent cycle may start after terminal review/evidence is durably preserved.

## Executor read order

1. project `AGENTS.md` and its routing/source-of-truth rules
2. `EXECUTOR_HANDOFF.md`
3. apply the conversation identity / execution-closed gate before using repository pointers as authority
4. `.planning/STATUS.yaml` — require `cycle_state: active`, `plan_state: frozen`, and `implementation_authorized: true`
5. `EXECUTION.yaml`
6. only assigned `TREE.yaml` nodes for the same explicitly activated Chat N
7. dependency states from EXECUTION
8. only referenced/materially required decisions, ancestor reasoning, and target-project context

## Ownership

### Installed/stable framework material

- `README.md` — this installed state/read-order map.
- `FRAMEWORK.md` — portable S&T planning/execution/cycle contract.
- `EXECUTOR_HANDOFF.md` — stable fresh-executor bootstrap/read-order and handoff-verification contract; never task content.
- `executor-authority.mjs` — executable reference contract for conversation identity vs repository allocation; framework tooling, not project state.
- `validate-allocation.mjs` — portable mechanical validator for TREE/EXECUTION allocation invariants; framework tooling, not project state.
- `verify-freeze-baseline.mjs` — portable freeze no-drift verifier for the reviewed material baseline; framework tooling, not project state.
- project `AGENTS.md` S&T rules — installed behavior contract.

### Current-cycle state

- `GOAL.md` — stable boundary of the current planning scope.
- `TREE.yaml` — S&T logic, planning status, dependencies, success evidence.
- `DECISIONS.md` — material open questions and decision history for the current cycle.
- `REVIEWS.md` — planning/replanning/handoff/closure review history for the current cycle.
- `.planning/STATUS.yaml` — cycle lifecycle, active/frozen planning state, resume pointer, and explicit implementation-authorization gate.
- `EXECUTION.yaml` — after freeze: numbered chat allocation + execution state/result for leaf node IDs.

Conversation executor identity is intentionally **not** stored in repository state. It is local to the conversation and is established only by explicit startup there.

## Cycle lifecycle

`STATUS.yaml` separates:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

- `cycle_state: active` means the current scope is still being planned, executed, or verified.
- `cycle_state: completed` means Cycle Closure Review proved the integrated root outcome.
- `cycle_state: abandoned` means the scope was intentionally closed without claiming root success.
- completed/abandoned cycles must have `implementation_authorized: false`.

Freeze is not completion. All leaves being `done` is also not automatically completion; root/current-scope evidence must still pass Cycle Closure Review.

## Starting a later cycle

A later scope does not reinstall S&T Planner.

Only after the previous cycle is `completed` or `abandoned` with terminal evidence durably preserved, reset the six current-cycle files:

- `GOAL.md`
- `TREE.yaml`
- `DECISIONS.md`
- `REVIEWS.md`
- `STATUS.yaml`
- `EXECUTION.yaml`

Keep the installed framework/tooling and project `AGENTS.md` rules.

Start the new STATUS as:

```yaml
cycle_state: active
plan_state: active
implementation_authorized: false
```

Git/repository history preserves previous cycle reasoning. Any decision/contract that future cycles must obey belongs in the target project's durable source of truth before closure; do not use old cycle-local DECISIONS as a permanent architecture registry.

Do not create `.planning/archive/`, plan-version registries, or parallel active cycle directories by default.

## Important

- One planning chat is preferred; later planning chats are continuation only.
- V1 allows one active S&T cycle per repository.
- Do not implement while `cycle_state` is terminal or `plan_state: active`.
- The whole intended plan must pass Final Planning Review before `plan_state: frozen`.
- `plan_state: frozen` does **not** authorize implementation.
- Keep `implementation_authorized: false` while post-freeze allocation/handoff checks are being completed.
- Execution requires the exact combination `cycle_state: active`, `plan_state: frozen`, `implementation_authorized: true` plus a valid conversation-local executor identity.
- Allocation/current-chat pointers never activate or mutate conversation identity.
- After a new-chat handoff the old conversation cannot execute later allocated chats.
- After freeze, assign every implementation-ready leaf exactly once in EXECUTION.
- Before first authorization run `node .planning/validate-allocation.mjs --initial`. Any failure blocks authorization.
- Use `--serial-chats` only when the target explicitly treats numbered chats as a serial execution order.
- After replanning with preserved execution state, validate with `--resume`.
- After all required work is done, run Cycle Closure Review before marking the cycle completed.
- A target repository's root `STATUS.yaml`, phase, release state, `current_chat`, or workstream status is target-owned and is never an alias for `.planning/STATUS.yaml` or conversation identity.
- Do not duplicate Strategy/Tactic/task descriptions in EXECUTION.
- Execution dependencies remain in TREE -> depends_on.
