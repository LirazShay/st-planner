# Execution Protocol

This protocol governs what happens after S&T planning releases executable work.

Execution is part of the framework. It is not a separate uncontrolled phase.

## 1. Preconditions

A node may be executed only when all are true:

- the node exists in TREE;
- it is an executable leaf for the intended actor;
- its planning status is `approved`;
- its ID is currently listed in `STATUS.yaml -> implementation_scope`;
- no blocker invalidates the action;
- its `success_evidence` is concrete enough to verify afterward.

If any precondition fails, return to planning/review rather than improvising.

## 2. Execute the tactic, preserve the strategy

The executor performs the node's tactic within the stated project constraints.

Rules:

- retain the S&T node ID in commits/issues/PRs/tool notes when possible;
- do not silently broaden scope;
- if execution requires a material new decision, stop and create a D-entry;
- if reality contradicts a material assumption, do not patch around it invisibly — record the fact and trigger review.

## 3. Verify the outcome

After execution, evaluate the **Strategy**, not merely the activity.

Use the node's `success_evidence`.

Classify:

### verified

Observed evidence demonstrates the Strategy.

### failed

Observed evidence demonstrates that the Strategy was not achieved.

### partial

Some useful outcome exists, but the declared success evidence is not satisfied yet.

Do not use `verified` because code compiled, a file was created, a meeting occurred, or a command ran unless that is itself the Strategy's success evidence.

## 4. Record an execution outcome

Append an E-entry to `EXECUTION.md`.

Record:

- node ID;
- result;
- executor/reference;
- what was done;
- evidence observed;
- new facts or assumption changes;
- plan impact;
- affected nodes;
- follow-up.

The execution ledger is evidence history, not a replacement for an external task tracker.

## 5. Update the framework state

### If verified

- remove completed work from the active `implementation_scope`;
- update current focus / next action;
- if the verification satisfies a higher Strategy, review whether the next horizon can be released.

### If failed or partial with no planning impact

- keep/re-release the node only if another execution attempt follows from the same valid plan;
- record the next execution action.

### If failed/partial with planning impact

- remove unsafe affected work from `implementation_scope`;
- reopen the smallest affected TREE node(s);
- create/update relevant D-entry when uncertainty exists;
- run the required planning review again;
- release a corrected horizon only after gates pass.

## 6. Do not confuse planning status with execution result

TREE node status is planning status:

- draft
- blocked
- approved

EXECUTION result is observed outcome:

- verified
- failed
- partial

These are separate dimensions.

An approved node can fail in reality. That is not a contradiction; it is feedback.

Do not add `done` or `failed` to TREE node status in V1.

## 7. External execution adapters

When using GitHub:

- Issue/PR/task status may track operational progress.
- Keep the S&T node ID in the issue/PR.
- CI/test evidence may be referenced by E-entry.
- The project board does not replace TREE/DECISIONS/REVIEWS/EXECUTION.

When using another tool, preserve the same traceability contract.

## 8. Completion of the overall goal

The framework reaches overall completion only when:

- the root Strategy's `success_evidence` is observed;
- material execution outcomes are verified;
- no unresolved D-entry invalidates the claimed result;
- the final review finds no missing necessary condition;
- durable state reflects the verified reality.

Completion is evidence-based, not based on exhausting a task list.
