# ST Planner — Lightweight Execution Management

## Purpose

ST Planner does not stop at reasoning. It also turns implementation-ready S&T leaves into manageable work and helps coordinate that work across chats, agents, developers, or teams.

The execution layer must remain deliberately small.

> **Manage the work. Do not build machinery to manage the management of the work.**

---

# 1. The S&T leaves are the tasks

Do not create a second task-description system that copies the plan.

`PLAN.md` already explains:

- why the task exists;
- which Strategy it supports;
- the selected Tactic;
- relevant assumptions;
- scope/boundary;
- success evidence.

`EXECUTION.md` should therefore reference the implementation-ready leaf/task ID and store only execution facts.

Typical columns:

| Task | Owner | Status | Depends on | Result |
|---|---|---|---|---|
| 3.2.1 | Chat 8 | done | — | regression green |
| 3.2.2 | Chat 8 | in_progress | 3.2.1 | — |
| 4.1 | Agent B | pending | — | — |

Recommended work states:

```text
pending
in_progress
done
blocked
```

Do not add more states without a demonstrated recurring need.

---

# 2. What execution state is legitimate

Useful state describes the work itself:

- what task exists;
- who owns it;
- whether it has started/completed/is blocked;
- what real prerequisite prevents it from starting;
- what evidence/result was produced.

Avoid process-state fields whose main purpose is to coordinate the framework itself, such as:

```text
implementation_authorized
allocation_validated
handoff_verified
freeze_verified
projection_synced
replan_mode
cycle_state
plan_state
```

Those fields create a second system whose correctness must itself be managed.

---

# 3. Allocating work

After the selected planning scope has passed Final Planning Review, inspect its implementation-ready leaves and group them into execution units.

The owner may be:

- `Chat N`;
- another AI agent;
- a developer;
- a team;
- another project-native execution owner.

## 3.1 Grouping priorities

Use these priorities in order:

1. **Shared context** — keep strongly related code/components/contracts together when practical.
2. **Dependency compatibility** — avoid assigning an execution unit that cannot meaningfully progress until another not-yet-finished unit completes.
3. **Cohesion** — tasks in one unit should form a sensible work session, not merely be adjacent IDs.
4. **Manageable context/workload** — do not create a unit so large that execution becomes unfocused.
5. **Parallelism** — independent work may run separately when useful.
6. **Handoff cost** — prefer the fewest coherent execution units rather than maximizing the number of parallel workers.

There is no required number of tasks per chat and no target number of chats.

Do not split work just to make allocation look balanced.

## 3.2 Coverage check

Before execution begins, perform a simple reasoning check:

- every required implementation-ready leaf is represented;
- no required leaf is unintentionally duplicated;
- no task is assigned to an owner that cannot execute it coherently;
- real prerequisites are visible.

This is normally a review, not a validator script.

---

# 4. Dependencies

The S&T hierarchy explains logical decomposition. It is not a schedule.

Use `Depends on` only for a **real execution prerequisite** between implementation-ready tasks.

Good dependency:

> Task B cannot correctly proceed until Task A produces the required schema/contract/output.

Not a dependency:

- A happens to have a lower ID;
- A is higher priority;
- A is in an earlier chat;
- the manager prefers A first;
- both tasks touch related code but can execute independently.

Avoid dependency chains that exist only because of arbitrary task grouping.

---

# 5. Numbered chats

Numbered chats are a supported execution convention, not a planning validity mechanism.

An explicit startup such as:

> אני צאט 12 תתחיל

or:

> I am chat 12.

activates that executor identity.

A generic message such as:

> תמשיך לשלב הבא

must not silently activate a different Chat N just because repository state shows that chat is now next/runnable.

This prevents accidental executor rollover without requiring an authority script.

## 5.1 Starting a chat

On explicit Chat N startup:

1. read target repository rules;
2. read `.planning/PLAN.md`;
3. read `.planning/EXECUTION.md`;
4. find unfinished tasks assigned to Chat N;
5. verify real prerequisites;
6. load only the implementation context needed for those tasks;
7. mark the task `in_progress` when work meaningfully starts;
8. execute the planned Tactic without inventing new material scope;
9. verify success evidence;
10. mark `done` with a short result/evidence reference, or `blocked` with a factual reason.

If Chat N does not exist, do not invent work.

## 5.2 Handoff

When an execution unit finishes:

- update its task state/results;
- identify remaining runnable work;
- recommend the next owner/chat only when a new execution context is useful.

The new context should be able to recover from repository state rather than relying on the previous conversation transcript.

Fresh-chat recoverability is a design property, not a mandatory simulation gate.

---

# 6. Status semantics

## `pending`

Required work exists but has not meaningfully started.

A task can remain `pending` while waiting for a prerequisite; do not automatically call that a blocker.

## `in_progress`

The assigned owner is actively working on it.

Avoid marking work in progress merely because the chat was opened.

## `done`

Relevant success evidence has been verified.

Do not mark done because code was written, a commit exists, or a local command ran unless that actually proves the required outcome.

## `blocked`

A real condition prevents correct progress and cannot be resolved as ordinary execution within the assigned scope.

Record the factual blocker briefly.

Do not use `blocked` for ordinary sequencing when an unmet prerequisite is already visible in `Depends on`.

---

# 7. Defects discovered during execution

Execution problems do not automatically mean the plan is wrong.

Use the Planning Impact Test from `SNT-METHODOLOGY.md`:

> Does the new fact materially invalidate an existing Strategy, Tactic, assumption, contract, dependency, or success criterion?

## 7.1 Implementation defect

Keep planning stable.

Perform proportionate RCA, fix the root problem, add regression/prevention where justified, check materially analogous exposure when appropriate, verify, and continue.

## 7.2 Local planning correction

Update the smallest affected PLAN area and affected execution rows, review the impact, then continue.

## 7.3 Material plan invalidation

Pause only affected work, revise the affected S&T reasoning and downstream execution map, review it, and continue.

Do not reset unrelated completed work unless the changed reasoning actually invalidates it.

---

# 8. CI warning/error handling

A CI warning/error is an engineering signal, not an automatic workflow-state transition.

Do not ignore the signal and do not stop at a symptom-only fix.

Establish proportionately:

1. what happened;
2. causal root;
3. why prevention/detection did not catch it earlier;
4. whether a reusable prevention/detection improvement is justified;
5. materially analogous exposure;
6. closing evidence.

If the CI check itself is obsolete, brittle, or produces noise without protecting a real invariant, repair or remove it.

Do not add framework authorization/freeze/replan state merely because CI failed.

---

# 9. Results and evidence

Keep execution results short.

Good:

```text
Regression added; targeted suite green; shutdown verified without dangling timer.
```

Bad:

```text
A long duplicate narrative of everything already documented in PLAN and Git history.
```

Link/reference the relevant commit, PR, test, artifact, or durable target-project document when useful.

The result field is not a second changelog.

---

# 10. Optional STATUS.md

For long-running work, a tiny `.planning/STATUS.md` may help humans and fresh agents find the current focus quickly.

Keep it derived/minimal, for example:

```text
Phase: execution
Focus: Replay shutdown reliability
Next: Finish task 3.2.2 and verify targeted regression
Blocker: none
```

`STATUS.md` must not become an authority competing with `PLAN.md` and `EXECUTION.md`.

If it drifts, correct or remove the convenience summary. Do not halt safe work solely because a convenience pointer is stale.

---

# 11. PRs and branches

ST Planner may record a branch/PR reference when it materially helps execution tracking, but it should not prescribe a universal Git workflow.

The target repository's own Git/PR policy remains authoritative.

Do not pre-create PR state in the planner simply because PRs will eventually exist.

---

# 12. Completion

A task is complete when its relevant success evidence is verified.

An execution group/chat is complete when no assigned runnable work remains for that owner.

The overall planning scope is complete when the integrated root outcome is verified and any durable contracts future work must obey have been promoted into the target repository's normal source of truth.

Do not add a separate lifecycle state machine to express these facts.

---

# 13. Anti-overengineering test

Before adding execution machinery ask:

- What concrete execution failure does it prevent?
- Has that failure occurred or is it credibly likely?
- Can a simple instruction/table column/review prevent it sufficiently?
- Does the mechanism create derived state that must be synchronized?
- Will it make ordinary engineering defects trigger planner maintenance?

If the mechanism costs more than the uncertainty or failure risk it removes, do not add it.
