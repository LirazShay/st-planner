# Framework Lifecycle

The lifecycle is intentionally simple.

```text
START / RESUME ACTIVE CYCLE
  ↓
UNDERSTAND CURRENT SCOPE
  ↓
BUILD S&T
  ↓
REVIEW / CORRECT
  ↺
FINAL WHOLE-PLAN REVIEW
  ↓
RECORD REVIEWED BASELINE
  ↓
VERIFY FREEZE NO-DRIFT
  ↓
FREEZE
  ↓
ALLOCATE S&T LEAVES TO NUMBERED CHATS
  ↓
MECHANICAL ALLOCATION VALIDATION
  ↓
MANDATORY FRESH-CHAT HANDOFF VERIFICATION
  ↓
AUTHORIZE IMPLEMENTATION
  ↓
EXECUTE + VERIFY SUCCESS EVIDENCE
  ↓
CYCLE CLOSURE REVIEW
  ↓
COMPLETED / ABANDONED
  ↓
OPTIONAL NEW ACTIVE CYCLE
```

## 0. Cycle state

`.planning/STATUS.yaml` owns three separate concerns:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

They mean different things:

- `cycle_state` — whether the whole current planning+execution scope is still live or has reached a terminal outcome;
- `plan_state` — whether the current planning baseline is still editable or frozen;
- `implementation_authorized` — whether executors may currently start work.

V1 allows **one active S&T cycle per repository**. It does not create scope directories, a plan registry, or concurrent independent planning cycles.

A fresh/new cycle starts as:

```yaml
cycle_state: active
plan_state: active
implementation_authorized: false
```

A `completed` or `abandoned` cycle must always have `implementation_authorized: false`.

## 1. Understand

Define the current planning boundary:
- desired outcome;
- established current reality;
- constraints;
- non-goals.

The scope may be a project, release, feature, migration, refactor, architectural change, or another meaningful change.

Separate the required outcome from any proposed feature/tool/architecture. Material unresolved questions go to `DECISIONS.md`.

## 2. Build the complete S&T

Build the tree from the top down.

For every branch:
- Strategy + selected Tactic;
- Parallel assumptions;
- Necessary assumptions;
- Sufficiency assumptions;
- success evidence;
- children.

Challenge material Tactics before decomposing them. Continue until leaves are decision-complete and practical for executor chats.

## 3. Review while building

Review branches as they are created.

This improves the plan, but **does not authorize implementation**.

Keep correcting the tree until the intended current scope is fully planned.

## 4. Final whole-plan review

Review the entire current scope together:

- Is the outcome/solution boundary correct?
- Is every material Tactic justified?
- Were materially plausible alternatives handled?
- Is every child necessary?
- Is every group sufficient?
- Are assumptions/decisions honest?
- Are leaves executable without new material design decisions?
- Are dependencies clear enough for implementation?
- Is anything over-engineered or duplicated?

If defects exist, return to the tree and correct them.

## 5. Freeze

After the final review passes, first record the reviewed baseline in `REVIEWS.md` and prove no material drift. With Git refs, prefer:

```text
node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>
```

If the checked baseline drifted, keep planning active and review the changed baseline again. Only the verified reviewed baseline may become:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: false
```

If merge/rebase/integration later creates a different frozen ref, verify that result too before execution handoff.

Until then:

```yaml
cycle_state: active
plan_state: active
implementation_authorized: false
```

Freeze closes the planning baseline. It does not finish the cycle and does not authorize implementation.

## 6. Allocate execution

Create/populate `.planning/EXECUTION.yaml`.

Every implementation-ready leaf is assigned exactly once to a numbered executor chat.

The tree remains the work definition. EXECUTION stores only:
- chat allocation;
- execution state;
- short result/blocker reference.

No second task system is required.

## 7. Validate allocation, verify fresh-chat handoff, and authorize implementation

Freeze and allocation still leave implementation unauthorized.

First run `node .planning/validate-allocation.mjs --initial`. Any mechanical allocation failure must be corrected before continuing. Use `--serial-chats` only when the target explicitly defines numbered chats as serial.

Then follow `.planning/EXECUTOR_HANDOFF.md` and simulate repository-only fresh executors for the required representative cases. Record the result in `.planning/REVIEWS.md`. Any failure must be corrected and rechecked while authorization remains false.

Only after that gate passes:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

Only this combination permits executor chats to start.

If the target repository has its own operational status/phase, it remains target-owned and changes only under the target repository's own rules.

## 8. Execute

Executors work directly from assigned TREE leaves and mark `done` only after `success_evidence` is verified.

A temporary external-verification blocker keeps the affected leaf blocked; it does not complete the cycle and does not force unrelated work to stop.

A material planning defect returns the same active cycle to focused replanning. It does **not** create a new cycle.

## 9. Complete a cycle

After all required execution work appears complete, run a **Cycle Closure Review** rather than inferring whole-scope success merely from `done` leaves.

A cycle may become `completed` only when:
- every required implementation-ready leaf is `done`;
- required success evidence has been verified;
- the root/current-scope outcome is verified after integration;
- no required execution blocker remains;
- any decision/contract that must constrain future work has been promoted from cycle-local planning history into the target repository's durable source of truth;
- repository current reality/documentation used by future planners reflects what was actually delivered;
- the terminal review/evidence is recorded in `REVIEWS.md`.

Then set:

```yaml
cycle_state: completed
implementation_authorized: false
```

`plan_state` normally remains `frozen`; it still describes the final planning baseline of that completed cycle.

## 10. Abandon a cycle

If the current scope is intentionally stopped without proving its root outcome, do not call it completed.

Record an abandonment review in `REVIEWS.md` with:
- factual reason;
- remaining/incomplete work;
- any already-delivered work retained or reconciled;
- durable decisions/contracts that still need to survive;
- terminal repository evidence/ref.

Then set:

```yaml
cycle_state: abandoned
implementation_authorized: false
```

`plan_state` may remain whatever accurately describes the last planning baseline (`active` for an unfinished plan, `frozen` for a previously frozen plan). `cycle_state` is the terminal guard that prevents further execution.

## 11. Start a later cycle in the same repository

A new project/release/feature/change request does **not** require reinstalling S&T Planner.

Start a new cycle only when the previous cycle is `completed` or `abandoned` and its terminal review/snapshot is durably preserved by the repository history.

Keep installed framework/tooling files and the `AGENTS.md` S&T rules. Reset only current-cycle state:
- `.planning/GOAL.md`;
- `.planning/TREE.yaml`;
- `.planning/DECISIONS.md`;
- `.planning/REVIEWS.md`;
- `.planning/STATUS.yaml`;
- `.planning/EXECUTION.yaml`.

The new cycle begins with the current repository as its current reality and:

```yaml
cycle_state: active
plan_state: active
implementation_authorized: false
```

Do not copy all old TREEs/DECISIONS into the new cycle. Cross-cycle truths belong in durable target-project contracts. Historical reasoning remains in Git/repository history.

Do not create `.planning/archive/`, plan-version registries, or parallel active scope directories by default.

If the new request actually changes the still-active current scope, replan that same cycle instead of creating another one.

## Planning chats

One planner chat is the default.

A second planner chat is optional when:
- context becomes too large;
- the user deliberately wants an independent review;
- the conversation is interrupted;
- another session must continue the work.

The framework supports continuation; it does not require it.
