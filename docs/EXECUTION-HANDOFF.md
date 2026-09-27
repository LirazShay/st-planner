# Execution Handoff

S&T Planner executes an explicitly authorized frozen plan directly from S&T node IDs; no separate task layer is needed.

The S&T leaves are already the planned work units.

After Final Planning Review passes:

1. freeze the plan;
2. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
3. collect every implementation-ready leaf;
4. group the leaf node IDs into numbered executor chats;
5. write the allocation to `.planning/EXECUTION.yaml`;
6. initialize every assigned node as `pending`;
7. run `node .planning/validate-allocation.mjs --initial` and fix every failure;
8. if numbered chats are explicitly serial, rerun/add `--serial-chats`;
9. run the mandatory repository-only fresh-chat simulations defined by `.planning/EXECUTOR_HANDOFF.md`;
10. record the verification result in `.planning/REVIEWS.md`;
11. fix and rerun any failed case;
12. explicitly set `implementation_authorized: true` only after both gates pass.

A frozen plan is a stable baseline, not permission to implement. `.planning/EXECUTOR_HANDOFF.md` is the portable entry contract for every new executor chat.

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


## When execution proves the plan wrong

A material planning defect is different from an ordinary implementation difficulty.

When one appears:

- stop the affected node;
- mark it `blocked` with a short factual reason;
- switch `STATUS.yaml -> plan_state: active`;
- set `STATUS.yaml -> implementation_authorized: false`;
- return to planning.

The planner changes only the smallest affected S&T area.

Already completed work is preserved when its Strategy, success evidence, and produced outcome are still valid under the corrected plan.

If previously completed work is invalidated, reset only that work to `pending` (or remove an obsolete node) rather than restarting all execution.

After focused review passes, repair the affected EXECUTION allocation and freeze again while still unauthorized; run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when applicable), then rerun and record the mandatory fresh-chat handoff gate before explicitly restoring authorization.

Git history is sufficient version history for V1.
