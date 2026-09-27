# Execution Handoff

S&T Planner does not need GitHub Issues or a separate task system to execute a frozen plan.

The S&T leaves are already the planned work units.

After Final Planning Review passes:

1. freeze the plan;
2. collect every implementation-ready leaf;
3. group the leaf node IDs into numbered executor chats;
4. write the allocation to `.planning/EXECUTION.yaml`;
5. initialize every assigned node as `pending`.

## Why direct node execution

The S&T tree already contains:

- responsibility/outcome in Strategy;
- planned approach in Tactic;
- relevant assumptions;
- dependencies in `depends_on`;
- acceptance evidence in `success_evidence`.

Creating another task object would duplicate that information.

## Execution file

`EXECUTION.yaml` contains only execution allocation/state:

```yaml
chats:
  "1":
    nodes:
      "1.2.1":
        state: pending
        result: null
      "1.2.2":
        state: pending
        result: null
```

It does not copy Strategy/Tactic details.

## Allocation rule

Every implementation-ready leaf appears exactly once.

Group nodes into chats by:

1. coherent implementation context/responsibility;
2. real execution dependencies;
3. reasonable amount of work for one chat.

There is no fixed node count per chat.

Do not mix unrelated areas only to make chat sizes numerically equal.

If one leaf is itself too large for a practical executor chat, reopen planning and decompose it further.

## Execution states

Use only:

- `pending`
- `in_progress`
- `done`
- `blocked`

A chat-level status is unnecessary; derive it from its nodes.

## Completion

A node becomes `done` only when its S&T `success_evidence` has been verified.

The `result` field stores only a short result/evidence reference, not a new execution history system.

Git remains the normal implementation/history mechanism for code changes.
