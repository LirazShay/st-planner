# Framework Lifecycle

The lifecycle is intentionally simple.

```
UNDERSTAND
  ↓
BUILD S&T
  ↓
REVIEW / CORRECT
  ↺
FINAL WHOLE-PLAN REVIEW
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
EXECUTE
```

## 1. Understand

Define:
- desired outcome;
- established current reality;
- constraints;
- non-goals.

Material unresolved questions go to `DECISIONS.md`.

## 2. Build the complete S&T

Build the tree from the top down.

For every branch:
- Strategy + Tactic;
- Parallel assumptions;
- Necessary assumptions;
- Sufficiency assumptions;
- success evidence;
- children.

Continue until leaves are implementation-ready.

## 3. Review while building

Review branches as they are created.

This improves the plan, but **does not authorize implementation**.

Keep correcting the tree until the intended project scope is fully planned.

## 4. Final whole-plan review

Review the entire tree together:

- Is every required outcome covered?
- Is every child necessary?
- Is every group sufficient?
- Are material assumptions visible?
- Are decisions resolved?
- Are leaves executable without new design decisions?
- Are dependencies/order clear enough for implementation?
- Is anything over-engineered or duplicated?

If defects exist, return to the tree and correct them.

## 5. Freeze

All lifecycle fields below belong to **`.planning/STATUS.yaml`**, never to an unrelated target-project status file.

After the final review passes:

```yaml
plan_state: frozen
implementation_authorized: false
```

Until then:

```yaml
plan_state: active
implementation_authorized: false
```

`.planning/STATUS.yaml -> plan_state` remains the small planning lifecycle state. `.planning/STATUS.yaml -> implementation_authorized` is a separate execution gate, not another planning phase.

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
plan_state: frozen
implementation_authorized: true
```

Only this combination in `.planning/STATUS.yaml` permits executor chats to start.

If the target repository has its own operational status/phase, it remains target-owned and changes only under the target repository's own rules.

## Planning chats

One planner chat is the default.

A second planner chat is optional when:
- context becomes too large;
- the user deliberately wants an independent review;
- the conversation is interrupted;
- another session must continue the work.

The framework supports continuation; it does not require it.
