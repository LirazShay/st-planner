# Numbered Executor Chats

After the complete S&T plan is frozen, implementation-ready leaves are allocated directly to numbered chats in `.planning/EXECUTION.yaml`.

No separate task layer is required.

## Starting a chat

The user can write only:

> I am chat 1.

or:

> אני צ'אט מספר 1

The executor then:

1. reads repository `AGENTS.md`;
2. confirms `.planning/STATUS.yaml -> plan_state: frozen`;
3. reads `.planning/EXECUTION.yaml`;
4. finds chat N;
5. reads only the assigned S&T nodes from `TREE.yaml` plus referenced decisions/context;
6. checks each node's `depends_on` prerequisites;
7. finds those prerequisite node states in `EXECUTION.yaml`;
8. executes only assigned nodes whose prerequisites are `done`;
9. updates execution state as work proceeds.

If chat N does not exist, do not invent work.

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

## Parallel work

Parallelism comes directly from `TREE.yaml -> depends_on`.

If two assigned nodes have no unmet prerequisites between them, their chats may work in parallel.

No scheduler or chat-level dependency graph is needed.

## Chat sizing

The planner decides the number of executor chats after seeing the complete frozen tree.

Group work using these priorities:

1. keep closely related nodes/context together;
2. preserve dependency order;
3. keep each chat to a manageable amount of work/context;
4. then balance independent work across chats where practical.

Use leaf count only as a rough workload signal; consider the actual tactic/scope as well.

There is no fixed number of nodes per chat. Prefer the fewest executor chats that remain practical and coherent.

If a single leaf is too large for one chat, the planning granularity is wrong; reopen that leaf and decompose it.

## Completion

A chat is effectively complete when all nodes assigned to it are `done`.

The file does not need a duplicated chat-level status.


## Planning defect discovered by an executor

If the executor finds a material missing/contradictory planning decision:

1. stop only the affected work;
2. set the affected node to `blocked`;
3. write a short factual blocker in `result`;
4. set `STATUS.yaml -> plan_state: active`;
5. do not continue other execution until planning is frozen again.

A planner then reopens the smallest affected S&T area.

After re-freeze, the same or another numbered chat resumes from the updated EXECUTION file. Unaffected valid completed nodes remain done.
