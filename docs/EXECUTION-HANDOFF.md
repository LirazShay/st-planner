# Execution Handoff

S&T Planner executes the frozen plan directly from S&T node IDs; no separate task layer is needed.

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

Allocate chats in this order:

1. collect all implementation-ready leaves;
2. respect the `depends_on` graph;
3. cluster leaves that share implementation context/responsibility;
4. split a cluster when its combined work/context is too large for one practical chat;
5. where several independent clusters remain, balance the amount of work across chats without mixing unrelated contexts.

Leaf count is only a rough signal of amount. A single complex leaf may be more work than several small leaves.

There is no fixed node count per chat and no target number of chats.

Prefer the **fewest chats that keep each executor's context and responsibility clear and manageable**.

Do not mix unrelated areas merely to make chat sizes numerically equal.

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
