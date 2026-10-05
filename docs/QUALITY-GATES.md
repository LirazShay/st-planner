# S&T Planner Quality Gates

## Gate 1 — Goal and planning boundary

- the current planning scope is clear; it may be a project/initiative or a meaningful release, feature, migration, refactor, architectural change, or other substantial change;
- desired outcome is clear;
- current reality is separated from assumptions;
- constraints are explicit;
- non-goals prevent scope drift;
- a proposed feature/tool/technology/architecture has not been disguised as the desired outcome unless it is explicitly fixed by the user or a durable project contract;
- when the request started from a solution, the planner climbed upward far enough to identify the outcome that makes the solution worth considering;
- the scope was not silently widened to the whole product when only one change is being planned.

## Gate 2 — Node and relationship validity

For each active node:
- Strategy states a required outcome at that level, not merely a tool/feature/implementation in disguise;
- Tactic states the selected way to achieve that Strategy;
- Parallel assumptions genuinely justify this node's selected Tactic → Strategy relationship;
- for a material Tactic, the planner can explain why the choice is justified under the actual constraints and evidence;
- a materially plausible alternative that could change the choice was challenged rather than ignored;
- every non-root child's Necessary assumptions justify that child → parent relationship;
- every parent with children has Sufficiency assumptions that justify the children-as-a-group → parent relationship;
- root has no Necessary assumptions;
- leaves normally have no Sufficiency assumptions;
- success evidence tests the Strategy, not merely whether the Tactic was performed.

## Gate 3 — Necessity

For each child:

> If this child vanished and nothing replaced it, could the parent still succeed?

If yes, challenge the child.

Also check that:
- optional/supporting work was not promoted into the required tree;
- an alternative tactic was not represented as a simultaneous necessary sibling;
- a child that merely implements another sibling is nested beneath that sibling rather than placed beside it.

## Gate 4 — Sufficiency

For each parent:

> If all children succeed, can the parent still fail because required work is missing?

If yes, the decomposition is incomplete.

Also check that already-satisfied required conditions were recorded as current reality/assumptions rather than invented as work.

## Gate 5 — Assumption and decision honesty

- facts are not assumptions;
- unknowns are not guessed;
- material open questions exist in DECISIONS;
- ordinary local reasoning is not inflated into a Decision entry;
- material choices have rationale;
- materially plausible alternatives are recorded only when they actually matter to the decision;
- `parallel_assumptions` contain real claims that defend the selected Tactic rather than decorative restatements;
- when material, the planner can state what fact/assumption would invalidate or reopen the selected choice;
- an `open` Decision blocks a TREE node only when continuing would require guessing or could produce a materially different subtree;
- resolved/superseded choices are classified accurately before freeze.

## Gate 6 — KISS

- no speculative infrastructure;
- no duplicate nodes;
- no tool chosen before its requirement;
- no decomposition below useful execution granularity;
- no framework machinery added without evidence it is needed;
- no feature/release schema, registry, or taxonomy exists merely to label ordinary S&T nodes;
- no default `Frontend / Backend / Database / Tests` branch exists merely because those disciplines are familiar;
- no alternatives graph, materiality scoring system, or second task hierarchy was added without demonstrated need;
- no release is represented as a causal parent merely because unrelated changes share a version label.

## Gate 7 — Tree consistency

- root exists;
- all child references resolve;
- every non-root V1 node has one logical parent;
- no cycles;
- statuses are only draft / blocked / approved;
- draft is used for normal unfinished planning;
- every blocked node is referenced by an open D-entry that explains the material unresolved question;
- no separate blocked-by state is duplicated in TREE;
- approval/blocking is local, not recursive;
- siblings are at a coherent logical abstraction level;
- logical hierarchy is not being used as a schedule;
- alternatives are not represented as simultaneous required children;
- feature/release boundaries do not distort the underlying necessity/sufficiency logic;
- cross-feature execution prerequisites use `depends_on` rather than fake parent/child relationships.

## Gate 8 — Implementation readiness

For each final leaf:
- responsibility is clear;
- scope is clear;
- relevant decisions are resolved;
- required inputs are known;
- the selected implementation direction is sufficiently determined that an executor need not make another material product/design/architecture decision;
- the leaf is a coherent, manageable amount of work for one executor chat;
- every real execution prerequisite is recorded in `depends_on`;
- every `depends_on` reference resolves to an existing implementation-ready leaf;
- no leaf depends on itself;
- the execution-dependency graph is acyclic;
- no dependency is invented merely to express preference or priority;
- success evidence is objective;
- routine implementation details may remain for the executor, but material design choices may not.

If a leaf is decision-complete but still too large for practical execution, planning stopped too early and the leaf must be decomposed further.

## Gate 9 — Whole-plan coverage

Pass only when an outside-in audit from GOAL finds no material omission:

- every meaningful desired-outcome clause is protected somewhere in the plan;
- every hard constraint is respected by the relevant nodes/assumptions/decisions;
- assuming every leaf succeeds does not reveal an uncovered reason the root goal can still fail;
- materially relevant actors, boundaries, external dependencies, and failure paths were challenged;
- representative end-to-end scenarios do not expose a missing necessary branch;
- stated non-goals have not leaked into required work;
- each feature/change in scope is justified by a real outcome or an explicit committed scope;
- for a release, membership alone is not used as S&T causality; feature subtrees are justified by a shared outcome or explicit release commitment;
- no user-proposed product/technical solution escaped challenge merely because it was stated in the request;
- the path from current system reality to the requested outcome contains no missing required capability.

Do not require a permanent coverage matrix. Record only defects and the final pass in the normal review history.

## Gate 10 — Final whole-plan review

**The whole intended plan must be complete before execution begins.**

Before freezing:
- inspect the complete intended tree, not only individual branches;
- confirm the planning boundary is still correct;
- confirm outcome and proposed solution were not conflated;
- confirm no necessary branch is missing;
- confirm all groups remain sufficient when considered together;
- confirm every material Tactic has defensible Tactic → Strategy logic;
- confirm material alternatives/invalidators were handled at the depth justified by the decision;
- confirm the same reasoning quality persists from business/product levels through architecture/component/technical levels;
- confirm sibling groups are logically coherent and not folder/checklist decompositions;
- confirm execution dependencies are explicit, acyclic, and sufficient to derive required ordering;
- confirm implementation-ready leaves can be grouped into coherent executor-chat responsibilities without hidden design decisions;
- confirm all material decisions that affect implementation are resolved;
- confirm Feature/Release modeling did not introduce fake causality or unnecessary schema/machinery;
- run one final KISS pass.

A useful final challenge for every material choice is:

> Why this outcome? Why this Tactic? Why not a materially stronger alternative? What assumptions support the choice? What would invalidate it? Why these children, and why are they enough?

After this review passes, record the reviewed baseline in `REVIEWS.md` and prove no material drift before freeze. In Git workflows prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`; any material drift makes the review stale and requires review of the changed baseline.

Only a currently `active` cycle may proceed to execution preparation. The verified reviewed baseline may become `.planning/STATUS.yaml -> plan_state: frozen`; freeze does not authorize implementation and `.planning/STATUS.yaml -> implementation_authorized` remains false through post-freeze handoff.

## Fresh planning-chat continuity check

For planning continuation, a fresh GPT should be able to read repository state and identify:
- the current cycle state;
- the current planning scope and desired outcome;
- current planning location;
- blockers;
- next planning action;
- whether the plan is active or frozen;
- any material Decision it must understand before continuing.

It should not require prior chat history or a user explanation of whether the scope is a project, release, feature, migration, or other change.

This is separate from the mandatory **executor** handoff gate below.

## Gate 11 — Execution allocation

After freeze, with `.planning/STATUS.yaml -> cycle_state: active` and `implementation_authorized: false`, pass only when:

- every implementation-ready frozen leaf appears exactly once in `EXECUTION.yaml`;
- no non-leaf or non-approved planning node is assigned as executable work;
- every executor chat owns a coherent and manageable set of leaves;
- allocation respects the `depends_on` graph;
- allocation is based on implementation context/dependencies/workload, not blindly on feature subtree boundaries;
- one feature may span multiple chats and one chat may own leaves from multiple feature subtrees when that is the coherent implementation unit;
- no chat-level dependency graph duplicates TREE dependencies;
- no single leaf is so large that the executor must materially re-plan it;
- every node begins as `pending`;
- execution state uses only pending / in_progress / done / blocked;
- `done` requires verified success evidence;
- an executor can begin from its chat number without needing the previous planning conversation.

Execution allocation is a thin projection of the frozen tree, not a second planning model.

Passing allocation is necessary but does not itself authorize execution.

### Mechanical proof for Gate 11

Before first authorization run:

```text
node .planning/validate-allocation.mjs --initial
```

The validator must pass. It checks exact leaf coverage, rejects non-leaf/non-approved assignments, validates execution states and dependency targets, and requires initial nodes to remain `pending` with `result: null`.

If numbered chats are explicitly serial, add `--serial-chats`; that mode additionally requires contiguous chat IDs and dependency placement in an earlier chat or earlier in the same chat. Do not enable it for ordinary parallel-capable allocation.

For re-authorization after execution/replanning, run `--resume` instead so valid completed nodes can remain completed while state/result consistency is still checked.

Any validator failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`.

## Gate 12 — Mandatory fresh-chat executor handoff

Before implementation authorization, require `.planning/STATUS.yaml -> cycle_state: active`, then follow `.planning/EXECUTOR_HANDOFF.md` and simulate fresh executors from repository state only.

Pass only when representative simulations cover:
- first available executor;
- dependency-blocked early executor;
- mid-plan executor with multiple dependencies;
- final closure executor.

For each case, the fresh executor must correctly determine:
- that `cycle_state` is active;
- authorization state;
- assigned nodes;
- prerequisite states;
- first runnable node or that none is runnable;
- exact contract/project context to load next;
- factual blocker when it cannot proceed;
- enough ancestor/relevant Decision context to understand why the assigned leaf exists, without loading unrelated feature/release branches.

Use actual allocated chats/nodes when possible. If the allocation is too small to contain one literal shape, simulate the condition against the closest real assignment without changing durable EXECUTION state and record that adaptation.

Record the gate result in `REVIEWS.md`.

Any failure keeps `.planning/STATUS.yaml -> implementation_authorized: false`. Fix the smallest handoff/allocation/context-routing defect and rerun the failed case.

Only a pass here allows the exact executable state:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

## Gate 13 — Re-freeze after an execution-discovered defect

When a frozen plan is reopened, keep `.planning/STATUS.yaml -> cycle_state: active`, set `.planning/STATUS.yaml -> implementation_authorized: false`, then re-freeze only when:

- the material defect is represented and corrected in TREE/DECISIONS;
- affected Tactic-choice logic and Necessity/Sufficiency logic have been re-reviewed;
- review upward shows the impact is contained;
- affected whole-plan coverage remains valid;
- affected `depends_on` relationships are valid and acyclic;
- each previously `done` affected node was explicitly checked for continued validity;
- invalidated completed nodes were reset to `pending` or removed if obsolete;
- obsolete execution leaf IDs were removed;
- new implementation-ready leaves appear exactly once in EXECUTION;
- unaffected valid work was not unnecessarily reset.

Re-freeze alone does not restore execution permission. First rerun Gate 11 mechanical validation with `--resume`, then Gate 12 must pass again and be recorded before `.planning/STATUS.yaml -> implementation_authorized: true` is restored.

Do not require a new global plan version. Git history and REVIEWS provide the audit trail.

## Post-execution Cycle Closure Gate

Do not infer whole-cycle success merely because all allocated leaves are `done`.

A cycle may become `completed` only when Cycle Closure Review proves:
- every required implementation-ready leaf is `done`;
- required leaf `success_evidence` is verified;
- the integrated root/current-scope outcome is verified after the implemented pieces operate together;
- no required execution blocker remains;
- material decisions/contracts that future planning cycles must obey have been promoted from cycle-local planning history into the target repository's durable source of truth;
- repository current reality/documentation used by future planners accurately reflects what was delivered;
- terminal evidence/review is recorded in `REVIEWS.md`.

Then set:

```yaml
cycle_state: completed
implementation_authorized: false
```

If the scope is intentionally stopped without proving the root outcome, record an abandonment review instead and set:

```yaml
cycle_state: abandoned
implementation_authorized: false
```

A new independent planning cycle may replace current-cycle state only after one of these terminal states is durably recorded. V1 does not allow a second active cycle, and it does not require `.planning/archive/`, plan-version registries, or parallel scope directories.
