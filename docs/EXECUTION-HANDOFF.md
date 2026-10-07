# Execution Handoff

S&T Planner executes an explicitly authorized frozen plan directly from S&T node IDs; no separate task layer is needed.

The S&T leaves are already the planned work units.

## Framework freshness before new execution

An installed target repository should run:

```text
node .planning/check-framework-update.mjs
```

before starting new S&T planning/execution work. A newer `required` framework release must be explicitly upgraded before continuing; a `recommended` release is surfaced without becoming a hard gate. If freshness cannot be checked, report that fact and continue from the installed framework rather than claiming it is current.

Framework upgrades refresh framework-managed instruction/tooling only. They must never overwrite active cycle state (`GOAL.md`, `TREE.yaml`, `DECISIONS.md`, `REVIEWS.md`, `STATUS.yaml`, `EXECUTION.yaml`). See `docs/FRAMEWORK-UPDATES.md`.

After Final Planning Review passes:

1. keep `.planning/STATUS.yaml -> cycle_state: active`;
2. freeze the plan;
3. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
4. collect every implementation-ready leaf;
5. group leaf node IDs into numbered executor chats;
6. write the allocation to `.planning/EXECUTION.yaml`;
7. initialize every assigned node as `pending`;
8. run `node .planning/validate-allocation.mjs --initial` and fix every authoritative failure;
9. add `--serial-chats` only when numbered chats are explicitly serial;
10. run the repository-only execution/handoff simulations defined by `.planning/EXECUTOR_HANDOFF.md`, including projection drift, accidental old-conversation rollover, and explicit post-handoff re-bootstrap;
11. record the result in `.planning/REVIEWS.md`;
12. fix/rerun hard failures; record advisory warnings without blocking implementation merely because a target projection is stale;
13. set `.planning/STATUS.yaml -> implementation_authorized: true` only after hard gates pass.

Execution is allowed only when `.planning/STATUS.yaml` has all three:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

A `completed` or `abandoned` cycle is terminal and cannot authorize execution.

## One execution authority

After freeze:

- `.planning/EXECUTION.yaml` is authoritative for executor allocation and node state;
- `TREE.yaml -> depends_on` is authoritative for execution prerequisites;
- `.planning/STATUS.yaml` is authoritative for lifecycle/planning/implementation authorization;
- target-owned `STATUS.yaml`, `current_chat`, `current_node`, phase pointers, dashboards, or similar fields are projections/navigation aids only.

Use `.planning/execution-guidance.mjs` to derive runnable chats/nodes from TREE + EXECUTION.

If a target pointer differs from canonical runnable execution state, treat that as **projection drift**:

- warn and diagnose it;
- repair/regenerate the projection when useful;
- do not rewrite authoritative EXECUTION merely to satisfy the projection;
- do not block otherwise-safe implementation solely because the projection lags or moved early.

Hard failure is reserved for genuinely unsafe authority state: invalid/duplicate allocation, disabled implementation authorization, unallocated executor, broken dependency state, or a real planning defect.

This avoids making correctness depend on updating several peer current-pointer files in a particular file-by-file order.

## Mandatory CI warning/error RCA

Every CI warning or error is a mandatory investigation gate before further implementation progress.

Do not treat a local symptom fix or a green rerun as sufficient closure. Follow the installed `.planning/CI-RCA-POLICY.md` and establish:

1. what happened;
2. the causal root — not merely the first broken line;
3. why prevention/detection allowed the problem to reach CI;
4. the reusable prevention/detection improvement;
5. materially analogous areas that may share the same underlying weakness;
6. evidence that closes both the original CI signal and every analogous instance found.

When reporting a CI incident, explicitly tell the user that progression is paused for RCA and that a local fix alone is not closure. Continue only after the RCA is closed.

## Allocation is not conversation activation

A numbered executor context becomes active only after an explicit startup such as:

```text
אני צאט 17 תתחיל
```

A target `current_chat`, newly runnable executor, `NEXT_CHAT_PROMPT`, `תמשיך לשלב הבא`, or `continue` never activates the next executor implicitly.

While an executor is active before handoff, do not switch it to another Chat N mid-work.

### After handoff

A `SEQUENCE_RUNNER_NEW_CHAT` handoff recommends a fresh conversation, but is not a permanent lock.

If the user sends only:

```text
תמשיך לשלב הבא
```

after Chat 16 handed off to Chat 17, do **not** bootstrap Chat 17 implicitly.

If the user explicitly sends:

```text
אני צאט 17 תתחיל
```

after handoff, the same conversation may intentionally re-bootstrap Chat 17 after fresh repository authorization/allocation/dependency checks. A fresh conversation remains the preferred clean-context path.

`.planning/executor-authority.mjs` is the executable reference for these semantics.

## Why direct node execution

The S&T tree already contains:

- responsibility/outcome in Strategy;
- planned approach in Tactic;
- relevant assumptions;
- dependencies in `depends_on`;
- acceptance evidence in `success_evidence`.

Creating another task object would duplicate that information.

## Execution file

`EXECUTION.yaml` contains execution allocation/state:

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

Allocate chats using:

1. the `depends_on` graph;
2. shared implementation context/responsibility;
3. manageable workload/context;
4. practical balance across independent work.

There is no fixed node count per chat and no target number of chats. Independent chats may be runnable in parallel; there is no framework-wide single current-chat authority unless a target project explicitly chooses a serial projection for its own UX/tooling.

## Execution states

Use only:

- `pending`
- `in_progress`
- `done`
- `blocked`

A chat-level status is unnecessary; derive it from its nodes.

## Completion transition

A node becomes `done` only when its S&T `success_evidence` has been verified.

Before writing completion:

1. re-read authoritative EXECUTION state;
2. confirm the executor still owns the node and prerequisites remain valid;
3. persist `done` + short result in `.planning/EXECUTION.yaml`;
4. re-derive runnable work from TREE + EXECUTION;
5. update target-owned status/current projections only as secondary summaries if the target requires them.

A projection update that temporarily lags should be repaired, but it should not cause unrelated safe development to stop.

If the same chat still has runnable assigned work, continue it. Otherwise recommend/emit handoff to the next runnable chat(s). Generic continue never activates another chat implicitly; explicit startup may re-bootstrap after handoff.

Even when every leaf is `done`, the whole planning cycle is not closed automatically. Cycle Closure Review must still verify the root outcome and durable-contract promotion before `cycle_state: completed`.

## When execution proves the plan wrong

A material planning defect is different from an ordinary implementation difficulty or stale projection.

When one appears:

- stop the affected node;
- mark it `blocked` with a short factual reason;
- keep `.planning/STATUS.yaml -> cycle_state: active`;
- switch `.planning/STATUS.yaml -> plan_state: active`;
- set `.planning/STATUS.yaml -> implementation_authorized: false`;
- return to focused planning.

Already completed work is preserved when its Strategy, success evidence, and produced outcome are still valid under the corrected plan.

After focused review passes, repair only affected EXECUTION allocation/state, freeze again while unauthorized, run `node .planning/validate-allocation.mjs --resume` (plus serial mode only when applicable), rerun the execution/handoff verification, then explicitly restore authorization.

Git history is sufficient version history for V1.
