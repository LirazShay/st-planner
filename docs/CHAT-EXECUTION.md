# Numbered Executor Chats

After the complete S&T plan is frozen, implementation-ready leaves are allocated directly to numbered chats in `.planning/EXECUTION.yaml`. Allocation still does not authorize execution and does not implicitly activate an executor context.

No separate task layer is required.

## Starting an executor

The preferred explicit startup is:

> אני צאט 1 תתחיל

Established explicit forms such as:

> I am chat 1.

or:

> אני צ'אט מספר 1

also identify the executor intentionally.

A generic continuation such as `תמשיך לשלב הבא` / `continue` is never enough to activate a different executor just because repository state or a target pointer now mentions it.

Before implementation mutation, apply these checks:

1. explicit Chat N startup/re-bootstrap for the executor context;
2. `.planning/STATUS.yaml` lifecycle/implementation authorization;
3. Chat N allocation in `.planning/EXECUTION.yaml`;
4. assigned TREE dependencies satisfied by EXECUTION states.

Target-owned `current_chat/current_node` pointers are projections/navigation aids. They may be useful for humans or project tooling, but they do not create executor identity and are not S&T execution authority. If they drift from TREE + EXECUTION, warn/repair the projection rather than stopping otherwise-safe work solely because of that mismatch.

Use `.planning/execution-guidance.mjs` to derive canonical runnable work when useful.

## Handoff without unnecessary locking

A new-chat handoff recommends a fresh conversation for cleaner context.

It does **not** mean the user is forever prohibited from continuing in the same conversation.

After handoff:

- `תמשיך לשלב הבא` / `continue` must not silently roll the old executor into the next Chat N;
- if the user explicitly sends `אני צאט N תתחיל`, the same conversation may intentionally re-bootstrap Chat N after fresh repository authorization/allocation/dependency checks.

Therefore, if Chat 16 has handed off to Chat 17 and the user sends only:

```text
תמשיך לשלב הבא
```

then do not execute Chat 17 implicitly. Recommend:

```text
אני צאט 17 תתחיל
```

A fresh conversation is preferred but optional.

For explicit startup/re-bootstrap, the executor then:

1. reads repository `AGENTS.md` and routing/source-of-truth rules;
2. reads `.planning/EXECUTOR_HANDOFF.md`;
3. confirms `.planning/STATUS.yaml -> cycle_state: active`;
4. confirms `.planning/STATUS.yaml -> plan_state: frozen`;
5. confirms `.planning/STATUS.yaml -> implementation_authorized: true`;
6. reads `.planning/EXECUTION.yaml`;
7. finds the requested Chat N allocation;
8. reads only its assigned S&T nodes from `TREE.yaml`;
9. checks each node's `depends_on` prerequisites against EXECUTION states;
10. derives runnable assigned work;
11. loads only materially required decisions/specs/code/tests;
12. executes only safe assigned nodes.

A `completed` or `abandoned` cycle remains a hard terminal lifecycle state.

If Chat N does not exist in allocation, do not invent work.

## Node execution

Before starting one assigned node:

```yaml
state: in_progress
```

After its `success_evidence` is verified:

```yaml
state: done
result: "short verification / commit / test reference"
```

If a real blocker prevents correct execution:

```yaml
state: blocked
result: "short blocker reason"
```

Do not use `blocked` merely because another node dependency is not done; that node simply remains pending until its prerequisite completes.

## Execution authority and project status projections

`.planning/EXECUTION.yaml` is the authoritative executor allocation/state file. `TREE.yaml -> depends_on` is the authoritative prerequisite graph.

A target project may choose to maintain summaries such as:

```yaml
current:
  chat: 18
  node: "8.2"
```

Those summaries should be treated as projections derived from authoritative execution state.

If a projection says Chat 18 / 8.2 while EXECUTION still truthfully says Chat 17 / 8.1 is active, classify that as projection drift. Do not silently mutate EXECUTION to satisfy the projection and do not make the mismatch itself a generic framework CI blocker. Diagnose, repair/regenerate the projection when useful, and continue unrelated safe development.

Hard failure remains appropriate when authoritative execution itself is unsafe: invalid/duplicate allocation, missing assignment, disabled implementation authorization, broken dependency state, or a real planning defect.

## Parallel work

Parallelism comes directly from `TREE.yaml -> depends_on`.

If two assigned nodes have no unmet prerequisites between them, their chats may work in parallel.

No scheduler or single global current-chat authority is required.

## Chat sizing

The planner decides the number of executor chats after seeing the complete frozen tree.

Group work using these priorities:

1. keep closely related nodes/context together;
2. preserve dependency compatibility;
3. keep each chat to a manageable amount of work/context;
4. balance independent work across chats where practical.

Use leaf count only as a rough workload signal; consider the actual tactic/scope as well.

There is no fixed number of nodes per chat. Prefer the fewest executor chats that remain practical and coherent.

If a single leaf is too large for one chat, the planning granularity is wrong; reopen that leaf and decompose it.

## Completion

A chat scope is complete when it has no remaining runnable assigned work that should continue in that executor context.

If the same chat still owns another runnable assigned node, continue it.

If another chat should continue, recommend/emit handoff and provide its explicit startup command. Generic continuation does not activate it; explicit startup may re-bootstrap it in the same or a fresh conversation.

Completion of every chat/node does **not** by itself change `.planning/STATUS.yaml -> cycle_state`. The planning side closes the whole cycle only after Cycle Closure Review verifies the root outcome and durable-contract handoff.

## Planning defect discovered by an executor

If the executor finds a material missing/contradictory planning decision:

1. stop only the affected work;
2. set the affected node to `blocked`;
3. write a short factual blocker in `result`;
4. keep `.planning/STATUS.yaml -> cycle_state: active`;
5. set `.planning/STATUS.yaml -> plan_state: active`;
6. set `.planning/STATUS.yaml -> implementation_authorized: false`;
7. do not start new execution until planning is re-frozen, authoritative allocation/handoff verification passes again, and authorization is explicitly restored.

A planner then reopens the smallest affected S&T area.

After re-freeze and explicit re-authorization, the same or another numbered chat resumes from updated EXECUTION state. Unaffected valid completed nodes remain done.
