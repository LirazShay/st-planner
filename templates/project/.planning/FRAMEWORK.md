# Portable S&T Planning Kernel

This is the minimum planning method a fresh GPT needs.

## 0. Connect to an existing project without context dumping

Before building S&T, understand only the current reality needed for this goal.

If the repository already has `AGENTS.md`, workstream routing, status files, context-loading rules, specs, or other source-of-truth conventions, **use them**. The S&T framework does not replace project-native context management.

Progressive disclosure rule:

1. read the project's normal AI entry point;
2. identify the relevant workstream/component for the requested goal;
3. read its current status/context;
4. read directly relevant code/docs/tests/specs as planning questions require them;
5. load history or unrelated areas only when a concrete uncertainty requires it.

Do not recursively scan the repository by default.

The test for loading more context is:

> Could this information materially change GOAL, TREE, DECISIONS, or a review?

If not, do not preload it.

## 0.1 Long-running work progress orientation

When planning/implementation becomes long, tool-heavy, or spans many checks, keep the user oriented with concise progress updates at meaningful boundaries.

Useful updates say:
- what is being checked now;
- what is already complete;
- what remains before this stage can close;
- any meaningful discovery or blocker.

Do not narrate every tool call, repeat the same status, or turn updates into a second task log.

If the user requested one stage per message, progress updates stay within that stage and do not advance to a new stage by themselves.

## 0.2 Helper scripts over complex CI heredocs

When repository validation logic becomes non-trivial, keep the logic in a small versioned helper script and let CI/workflow files call that script.

Prefer:
- normal source files with focused tests;
- short CI steps such as `node scripts/check-x.mjs`;
- reusable logic that can run locally and in CI.

Avoid embedding large parsers, multi-line programs, or complex data transformations directly inside GitHub Actions YAML, shell heredocs, or workflow strings. Inline workflow logic is appropriate only while it remains genuinely trivial.

This is a repository-engineering guideline, not a requirement to add scripts where plain commands are already clear.

## 1. Strategy + Tactic

Every node contains:

- **Strategy** — what objective must exist?
- **Tactic** — how will it be achieved?
- **Parallel assumptions** — why can this tactic achieve this strategy?
- **Necessary assumptions** — why is this child necessary for its parent?
- **Sufficiency assumptions** — why are the children enough together?
- **Success evidence** — how will achievement be recognized?

## 2. Where each assumption belongs

Keep the three logical relationships distinct:

- `parallel_assumptions` belong to the **node itself**: why this node's Tactic can achieve this node's Strategy.
- `necessary_assumptions` belong to the **child → parent relationship**: why this child Strategy is necessary for its parent. Store them on the child.
- `sufficiency_assumptions` belong to the **children-as-a-group → parent relationship**: why this parent's children are sufficient together. Store them on the parent.

V1 deliberately does **not** add a separate edge object or duplicate `parent` field:
- the parent is derived from the parent's `children` list;
- every non-root node has exactly one logical parent;
- the root has no necessary assumptions;
- a leaf normally has no sufficiency assumptions because it has no children.

This placement keeps the tree compact while preserving the S&T logic.

## 3. Go down by asking "How?"

For the parent tactic ask:

> How exactly must this be performed?

Each child should represent an independently necessary part of performing the parent tactic.

A one-child decomposition is usually just rewording.

## 4. Necessity

For every child:

> Remove it without replacing it. Can the parent still be achieved?

If yes, challenge its place in the required tree.

## 5. Sufficiency

For every parent:

> Assume all children succeed. What required condition could still be missing?

If something is missing, the group is incomplete.

## 6. Alternatives and unknowns

Do not represent alternatives as simultaneous necessary children.

Material unresolved questions belong in `DECISIONS.md`.

Do not guess important unknowns.

## 7. Stop at implementation-ready leaves

There is no QUICK/DEEP mode. Small problems naturally produce small trees; difficult problems naturally produce deeper trees.

Stop when an executor would not need another material design/product decision.

For an implementation-ready leaf, also record any real execution prerequisites in `depends_on` using S&T node IDs.

`depends_on` means only:

> This node's execution cannot correctly begin until those node outcomes exist.

It is **not**:
- the S&T parent/child relationship;
- priority;
- a preferred sequence;
- a general schedule.

V1 dependency invariants:
- reference existing implementation-ready leaf node IDs only;
- no self-dependency;
- no dependency cycles;
- if two leaves can execute independently, do not invent a dependency.

Do not decompose into trivial coding/clicking instructions.

## 8. Node planning status

Use exactly three local planning statuses:

- `draft` — the node is still being designed/reviewed and may change.
- `blocked` — planning for this node cannot proceed because a material unresolved question exists.
- `approved` — this node's own Strategy/Tactic logic and immediate decomposition have passed local review.

KISS rules:

- Do not add more node statuses in V1.
- `blocked` is not a synonym for "unfinished"; ordinary unfinished work stays `draft`.
- Every `blocked` node must have at least one open entry in `DECISIONS.md` that references that node.
- Do not add a separate `blocked_by` field to TREE; the D-entry is the source of the reason.
- Status is local. A blocked descendant does not automatically change its parent from approved to blocked.
- Local approval never authorizes implementation. A frozen plan also remains non-executable until explicit implementation authorization is granted.

## 9. Review as you build

Check:
- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumptions;
- KISS;
- tree consistency.

Local approval means planning logic is sound locally. It does not authorize implementation.

## 10. Whole-plan completeness audit

Local Necessity/Sufficiency checks can still miss a whole concern if that concern never entered the tree.

Before Final Planning Review, perform one **outside-in coverage audit** from `GOAL.md`.

Do not create a separate coverage file. Use these challenge questions:

1. **Goal traceability** — For every meaningful clause in the desired outcome and every hard constraint, where is it protected by the TREE, a material assumption, a decision, or success evidence?
2. **Root gap test** — Assume every planned leaf succeeds exactly as written. Can the desired outcome still fail for a reason the plan should have handled?
3. **Boundary challenge** — Look only at actors, system boundaries, external dependencies, and failure paths that materially affect this goal. Did the plan silently assume one of them away?
4. **Negative-space check** — Did the tree accidentally include work that belongs to a stated non-goal?
5. **Scenario walkthrough** — Walk a small number of representative end-to-end scenarios implied by the goal. Include a failure/edge scenario only when it could materially invalidate the plan.

If the audit finds a gap:
- add/correct the smallest affected S&T branch;
- create a D-entry if the gap is an unresolved material question;
- re-run affected Necessity/Sufficiency reviews.

If it finds no gap, record the pass in the normal Final Planning Review. Do not persist a duplicate coverage matrix.

## 11. Finish the entire plan before execution

Do not hand partially planned leaves to implementation.

### Durable contract vs live status hygiene

As part of Final Planning Review, inspect only the durable target-project contracts that materially govern this plan (for example product/data/technical/test specs and any README used as a durable entry point).

Durable contracts should describe what must remain true, not today's planning/extraction/readiness progress.

Move or remove live snapshots such as:
- current planning stage/readiness result;
- extraction/migration progress;
- temporary investigation progress;
- "as of now" completion snapshots.

Live progress belongs in the target repository's designated status/review owner (or S&T Planner's own REVIEWS/STATUS when it is S&T state), not duplicated inside durable specs.

A README should be phase-neutral unless the target repository explicitly defines it as live status.

Do not erase durable history, decision rationale, version compatibility notes, or intentionally time-scoped contractual facts merely because they contain dates. The problem is duplicated **current progress**, not historical context.

Do not recursively scan unrelated documentation. Check the contracts actually used by the plan.

### Stale decision / investigation cleanup

Before freeze, verify that the planning state does not still claim an issue is unresolved after the plan has already resolved it.

Check:
- every `open` entry in `DECISIONS.md` is still materially unresolved;
- resolved choices are marked `resolved` and record their actual resolution;
- replaced questions are marked `superseded`;
- live markers such as `INVESTIGATE`, `TBD`, `OPEN`, or equivalent classifications in planning/contracts are either still genuinely unresolved or removed/reclassified.

A genuinely unresolved material question blocks freeze and must remain represented by an open D-entry (and by a blocked TREE node when it blocks a node).

Do not flag definitions, legends, examples, historical notes, or quoted source material merely because they contain words such as `TBD` or `INVESTIGATE`.

Do not scan unrelated repository content. Check `DECISIONS.md` and the durable planning/contracts actually used by this plan.

When the whole intended tree is ready, run Final Planning Review across the complete plan.

Only after it passes **and the reviewed baseline passes freeze no-drift verification**:

```yaml
plan_state: frozen
implementation_authorized: false
```

Before that:

```yaml
plan_state: active
implementation_authorized: false
```

### Freeze no-drift gate

Final Planning Review approves a specific baseline, not whatever files happen to exist later.

Record reviewed-baseline evidence in `REVIEWS.md`. The default material baseline is:
- `.planning/GOAL.md`;
- `.planning/TREE.yaml`;
- `.planning/DECISIONS.md`.

If the Final Review explicitly covers another durable contract whose drift would change the plan, include it as an additional checked file rather than expanding the default globally.

When Git refs are available, prefer:

```text
node .planning/verify-freeze-baseline.mjs --reviewed-ref <reviewed-ref>
```

This compares the reviewed commit to the current working tree. If a merge/rebase/integration step later produces the actual frozen commit/ref, verify that result too:

```text
node .planning/verify-freeze-baseline.mjs --reviewed-ref <reviewed-ref> --frozen-ref <frozen-ref>
```

A workflow that cannot provide a stable Git ref must record equivalent reproducible evidence in REVIEWS.

Any material drift means the prior Final Planning Review is stale. Keep/return `.planning/STATUS.yaml -> plan_state: active`, review the changed baseline again, and record new baseline evidence. Never waive drift merely because the change looks small.

Freeze means the reviewed planning baseline is closed for ordinary editing. It does **not** mean executors may start.

## 12. Keep state simple

- `GOAL.md` — stable boundary.
- `TREE.yaml` — S&T plan.
- `DECISIONS.md` — material questions/decisions.
- `REVIEWS.md` — review history.
- `.planning/STATUS.yaml` — the S&T Planner-owned planning pointer and lifecycle/authorization state.

Prefer one planning conversation. Repository state exists so continuation is possible when needed.

## 13. Execution handoff

After freeze, first confirm no intervening merge/rebase/integration changed the reviewed baseline. Then prepare execution directly from the S&T tree, but keep implementation unauthorized until handoff is complete.

**Do not create GitHub Issues merely to execute the S&T plan.**
The implementation-ready leaves in `TREE.yaml` are already the work units.

Use management files only:

- `TREE.yaml` — work definition, rationale, dependencies, success evidence.
- `EXECUTION.yaml` — chat allocation, execution state, short result.
- `EXECUTOR_HANDOFF.md` — stable fresh-executor bootstrap and mandatory post-allocation verification contract; no task descriptions.
- `validate-allocation.mjs` — mechanical allocation validator; no planning state or task content.

Create/populate `EXECUTION.yaml` while `.planning/STATUS.yaml -> implementation_authorized: false`.

Every implementation-ready leaf appears exactly once under one numbered chat:

```yaml
chats:
  "1":
    nodes:
      "1.2.1":
        state: pending
        result: null
```

The executor reads Strategy, Tactic, assumptions, `depends_on`, and `success_evidence` directly from TREE.

### Allocation

Choose the number of chats from the real amount of work.

Group nodes by:
- shared implementation context;
- dependency compatibility;
- manageable chat workload;
- reasonable balance.

Do not use a fixed leaf count.

If one leaf is too large for a practical executor chat, planning stopped too early: reopen and decompose it.

### State

Use only:
- pending
- in_progress
- done
- blocked

Set `done` only after success evidence is verified.

Dependencies remain only in TREE. A chat checks prerequisite node states in EXECUTION.

### Mandatory mechanical allocation gate

Before first implementation authorization, run:

```text
node .planning/validate-allocation.mjs --initial
```

It must prove mechanically that:
- every approved implementation-ready leaf is assigned exactly once;
- no non-leaf, missing, or non-approved node is assigned;
- execution states are valid;
- initial allocation is `pending` with `result: null`;
- every dependency references an approved implementation-ready leaf and is assigned.

If the target explicitly uses serial numbered chats, also pass `--serial-chats`. That mode additionally requires chat IDs `1..N` and every dependency to be in an earlier chat or earlier in the same chat. Do not enable serial mode merely because chats have numbers.

After execution has already begun and replanning preserves valid completed work, use `--resume` instead of `--initial`; it validates state/result consistency without requiring completed nodes to return to pending.

Any validator failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`.

### Mandatory fresh-chat handoff gate

Before setting `.planning/STATUS.yaml -> implementation_authorized: true`, follow `EXECUTOR_HANDOFF.md` and simulate a brand-new executor from repository state only.

The verification must cover representative:
- first available executor;
- dependency-blocked early executor;
- mid-plan executor with multiple dependencies;
- final closure executor.

For every case verify that repository state alone reveals:
- authorization;
- assigned nodes;
- prerequisite states;
- first available node or that none is available;
- exact next contract/project context to load;
- factual blocking reason when unavailable.

Use actual allocation cases where possible. If a small plan lacks a literal example, simulate the condition against the closest real assignment without mutating durable execution state.

Record the result in `REVIEWS.md`. Any failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`; correct the smallest handoff/allocation/routing defect and rerun the failed verification.

Only after this gate passes, explicitly set `.planning/STATUS.yaml -> implementation_authorized: true`.

A chat that says "I am chat N" / "אני צ'אט מספר N" reads `EXECUTOR_HANDOFF.md` and may execute its assigned nodes only when both `.planning/STATUS.yaml -> plan_state: frozen` and `.planning/STATUS.yaml -> implementation_authorized: true`.

Do not build an execution engine, scheduler, or duplicated task database.


## 14. Learn from meaningful unexpected failures

Do not create ceremony for normal red-green TDD, trivial typos, expected validation failures, or one-off operator mistakes.

When a **meaningful unexpected failure** exposes a reusable process or reasoning weakness, close the loop before treating the work as complete:

1. identify the technical root cause;
2. identify the reasoning/process cause that allowed it;
3. identify the escape cause — why existing review/test/guardrails did not catch it earlier;
4. apply the local fix;
5. add regression proof appropriate to the failure;
6. add the **smallest reusable prevention** that would stop the same class of failure recurring.

Record this in the target project's existing incident/retrospective/review owner when one exists. If there is no project-native owner and the failure is relevant to S&T planning/execution quality, record it briefly in `.planning/REVIEWS.md`.

Do not turn a single failure into broad framework machinery unless the reusable prevention is clearly justified.

## 15. Replanning after execution discovers a defect

A frozen plan may still meet reality and prove wrong.

Do not patch around a material planning defect during execution.

### Executor response

When an executor discovers a material planning defect:

1. stop the affected node;
2. set that node in `EXECUTION.yaml` to `blocked`;
3. put a short concrete reason in `result`;
4. change `.planning/STATUS.yaml -> plan_state` back to `active`;
5. set `.planning/STATUS.yaml -> implementation_authorized: false`;
6. set `.planning/STATUS.yaml` to the smallest S&T area that must be reconsidered.

No other execution may start while `.planning/STATUS.yaml -> plan_state: active` or `.planning/STATUS.yaml -> implementation_authorized: false`.

### Planner response

Reopen only the smallest affected planning area.

Review:
- the defective node/branch;
- its parent logic upward until the changed logic is contained;
- affected `depends_on` relationships;
- any previously executed nodes whose validity depends on the changed outcome;
- whole-plan coverage only where the change can affect it.

Do not re-plan unrelated branches.

### Preserve valid completed work

A node already marked `done` stays `done` if:
- its Strategy still means the same thing;
- its success evidence still proves that Strategy;
- the revised plan does not invalidate the produced outcome.

If any of those are false, reset that node to `pending` (or remove it if the node no longer exists) and record the reason in the review.

Do not add a `stale` state.

### Rebuild only affected allocation

After the corrected planning area passes review:

1. ensure obsolete leaf IDs are removed from EXECUTION;
2. add any new implementation-ready leaves exactly once as `pending`;
3. keep unaffected chat allocations and valid `done` nodes unchanged where practical;
4. re-check dependencies and chat coherence only for affected work;
5. set `.planning/STATUS.yaml -> plan_state: frozen` again while keeping `.planning/STATUS.yaml -> implementation_authorized: false`;
6. run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when that mode applies) and fix any failure;
7. rerun the mandatory repository-only fresh-chat handoff verification from `EXECUTOR_HANDOFF.md`, record the pass in `REVIEWS.md`, and only then explicitly restore `.planning/STATUS.yaml -> implementation_authorized: true`.

No plan-version registry is required. Git history already records prior file versions.
