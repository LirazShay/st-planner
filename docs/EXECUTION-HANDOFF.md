# Execution Handoff

S&T Planner executes an explicitly authorized frozen plan directly from S&T node IDs; no separate task layer is needed.

The S&T leaves are already the planned work units.

After Final Planning Review passes:

1. keep `.planning/STATUS.yaml -> cycle_state: active`;
2. freeze the plan;
3. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
4. collect every implementation-ready leaf;
5. group the leaf node IDs into numbered executor chats;
6. write the allocation to `.planning/EXECUTION.yaml`;
7. initialize every assigned node as `pending`;
8. run `node .planning/validate-allocation.mjs --initial` and fix every failure;
9. if numbered chats are explicitly serial, rerun/add `--serial-chats`;
10. run the mandatory repository-only fresh-chat simulations defined by `.planning/EXECUTOR_HANDOFF.md`, including conversation-identity rollover regression;
11. record the verification result in `.planning/REVIEWS.md`;
12. fix and rerun any failed case;
13. explicitly set `.planning/STATUS.yaml -> implementation_authorized: true` only after both gates pass.

Execution is allowed only when `.planning/STATUS.yaml` has all three:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

A `completed` or `abandoned` cycle is terminal and cannot authorize execution.

A frozen plan is a stable baseline, not permission to implement. `.planning/EXECUTOR_HANDOFF.md` is the portable entry contract for every new executor chat.

## Allocation is not conversation activation

Repository state answers **which executor is allocated/eligible**. It does not answer **which executor this conversation is**.

A numbered executor conversation becomes active only after an explicit startup message in that conversation, such as:

```text
אני צאט 17 תתחיל
```

Once activated, the conversation keeps that executor identity. A later repo/current-chat pointer must never mutate it.

After a conversation emits a `SEQUENCE_RUNNER_NEW_CHAT` handoff, that conversation is execution-closed for later allocated chats. If the repo now points to Chat 17 and the old Chat 16 conversation receives `תמשיך לשלב הבא`, it must refuse to bootstrap or execute Chat 17 and must direct the user to open a new conversation and explicitly start Chat 17.

Therefore the authority order is:

1. conversation identity/closed-state;
2. repository lifecycle authorization;
3. repository chat allocation/current pointer;
4. dependency/runnable-node checks;
5. only then execution mutation.

`.planning/executor-authority.mjs` is the executable reference contract used by framework regression tests. It deliberately stores no conversation state in the repository.

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

Even when every leaf is `done`, the whole planning cycle is not closed automatically. The planner performs Cycle Closure Review, verifies the root outcome and any required durable-contract promotion, then sets `cycle_state: completed` and keeps `implementation_authorized: false`.

## When execution proves the plan wrong

A material planning defect is different from an ordinary implementation difficulty.

When one appears:

- stop the affected node;
- mark it `blocked` with a short factual reason;
- keep `.planning/STATUS.yaml -> cycle_state: active`;
- switch `.planning/STATUS.yaml -> plan_state: active`;
- set `.planning/STATUS.yaml -> implementation_authorized: false`;
- return to planning.

The planner changes only the smallest affected S&T area.

Already completed work is preserved when its Strategy, success evidence, and produced outcome are still valid under the corrected plan.

If previously completed work is invalidated, reset only that work to `pending` (or remove an obsolete node) rather than restarting all execution.

After focused review passes, repair the affected EXECUTION allocation and freeze again while still unauthorized; run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when applicable), then rerun and record the mandatory fresh-chat handoff gate before explicitly restoring authorization.

Git history is sufficient version history for V1.
