# External Bootstrap — ST Planner

This is the authoritative entry point for an AI agent using `LirazShay/st-planner` from another repository.

A user request such as:

> תעבוד עם ST Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

is enough. The user does not need to restate framework mechanics.

## 1. Read target rules first

Treat the repository you are currently working on as the **target repository**.

Before changing anything, read its existing:

- `AGENTS.md` or equivalent agent instructions;
- architecture/source-of-truth/routing rules;
- branch/PR policy;
- verification/testing rules;
- relevant implementation and product context.

Target-native rules continue to own the target repository.

## 2. Read the current ST Planner source

At the start of the planning/execution session, resolve the current `LirazShay/st-planner` source to **one exact commit** and read the framework documents used in that session from that same commit:

1. `docs/SNT-METHODOLOGY.md`;
2. `docs/EXECUTION-MANAGEMENT.md`;
3. this `BOOTSTRAP.md`;
4. relevant `templates/` when a starting shape is useful.

This commit pin is only for **session consistency** so one session cannot accidentally mix framework revisions. It is not an installed framework version, target-repository provenance system, or upgrade gate. A later session may read a newer current source.

Do not copy framework scripts or framework-owned runtime files into the target repository.

The target stores project planning **data**, not an installed copy of ST Planner.

## 3. Detect planning state

### Fresh target

If no ST Planner state exists, create only what the work needs.

For meaningful multi-step work, the normal default is:

```text
.planning/PLAN.md
.planning/EXECUTION.md
```

Use the source `templates/PLAN.md` and `templates/EXECUTION.md` as starting shapes when useful; adapt them to the target rather than treating template text as required schema.

Create optional `.planning/STATUS.md` only when continuity across long-running work benefits from a tiny current-focus pointer.

Create optional `.planning/DECISIONS.md` only when material decisions make `PLAN.md` materially harder to read.

For genuinely tiny work that does not need durable decomposition or handoff, do not create planning artifacts merely to satisfy a framework ritual.

### Existing ST Planner 2.x state

Read the current project-owned planning artifacts and continue from them. Do not reset completed work merely because a new chat starts.

### Legacy V1 installation

A legacy installation may contain files such as:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
.planning/ST_PLANNER_INSTALL.json
.planning/FRAMEWORK.md
```

and framework scripts or a bounded ST Planner block in root `AGENTS.md`.

Do not blindly overwrite or delete legacy state.

For a one-time migration:

1. preserve the target repository's own rules and customizations;
2. before removing a legacy framework-owned file, inspect it for project-specific rules/content that are not merely stock ST Planner machinery; move legitimate target-owned behavior into the target's normal durable source of truth first;
3. if root `AGENTS.md` contains a clearly bounded ST Planner block, remove only that framework-owned block and preserve all text outside it; if ownership boundaries are unclear, do not guess;
4. consolidate live planning truth into `.planning/PLAN.md`;
5. convert live execution assignment/state into `.planning/EXECUTION.md`;
6. preserve material unresolved decisions and still-relevant success evidence;
7. preserve `done` work and factual blockers when their outcome/evidence remains valid;
8. discard only process-only state such as freeze/authorization/validation/simulation history when it carries no project truth;
9. remove legacy framework-owned machinery only after the replacement state and preserved target-owned behavior have been reviewed for completeness;
10. continue from the migrated state without restarting valid completed work.

Git history remains available for old review/process history; do not copy historical ceremony into the new live state.

## 4. Understand before decomposing

Before deep planning, establish only the current reality that can change the plan:

- desired outcome;
- relevant existing behavior/components/contracts;
- constraints and non-goals;
- materially relevant prior decisions;
- important unknowns/risks;
- proposed solution versus actual required outcome.

A proposed technology or feature is normally a candidate Tactic unless the user or durable target contract makes it a fixed constraint.

A brief structural map may be used to identify the material questions and dependencies before deep S&T reasoning. It is orientation only, not approval.

## 5. Build the S&T plan

Use the method in `docs/SNT-METHODOLOGY.md`.

For every material step, establish:

- Strategy;
- selected Tactic;
- tactic-validity assumptions;
- materially plausible alternatives when they could change the decision;
- invalidation conditions when useful;
- necessary children;
- sufficiency of the child set;
- objective success evidence.

Continue until leaves are decision-complete and practical execution units.

Do not force implementation trivia into the S&T decomposition.

## 6. Review the selected planning scope

Before implementation of the selected scope, perform an outside-in review:

- is the outcome boundary correct?
- are material Tactics justified?
- were materially plausible alternatives handled?
- is every required child necessary?
- are sibling groups sufficient together?
- are assumptions honest about fact/unknown/decision/risk?
- are leaves executable without new material design decisions?
- is success evidence objective enough?
- is the plan simpler than an equally effective alternative?

Correct findings directly in the plan.

Do not create freeze/unfreeze, reviewed-baseline, implementation-authorization, or no-drift state merely to mark that review happened.

## 7. Build the lightweight execution map

Implementation-ready S&T leaves become the work items.

Create/update `.planning/EXECUTION.md` with only useful execution facts:

- task/leaf ID;
- owner (`Chat N`, agent, developer, team, etc.);
- `pending | in_progress | done | blocked`;
- real execution prerequisite when one exists;
- short result/evidence reference.

Group tasks into the fewest coherent execution units that remain practical. Prefer shared context and dependency compatibility over arbitrary equal sizing. Preserve useful parallelism without multiplying handoffs unnecessarily.

Do not add an allocation validator or duplicate task descriptions unless repeated real failures prove a need.

## 8. Numbered chats and fresh execution

Numbered chats are supported but not required.

A new executor identity starts only through explicit activation such as:

> אני צאט 12 תתחיל

or:

> I am chat 12.

A generic `continue` / `תמשיך לשלב הבא`, a status pointer, or newly runnable work must not silently transform the current conversation into another Chat N.

On explicit Chat N startup:

1. read target rules;
2. read `.planning/PLAN.md` and `.planning/EXECUTION.md`;
3. locate the requested owner's assigned unfinished work;
4. check real prerequisites and identify the owner's runnable tasks;
5. if that owner has no runnable assigned task, do not take another owner's work or silently change identity; report/wait on the factual prerequisite or conclude that this owner has no current work;
6. load only materially necessary implementation context;
7. execute and verify the assigned work;
8. update work status/result.

When Chat N completes its assigned work, it may identify/recommend another runnable owner, but it does not automatically become that owner.

Fresh-chat recoverability is a design property: durable repository state should be sufficient to continue correctly without depending on chat history.

## 9. Execution incidents and replanning

When implementation exposes a problem, run the Planning Impact Test:

> Does the new fact materially invalidate an existing Strategy, Tactic, assumption, contract, dependency, or success criterion?

### Implementation defect

If not, keep planning stable:

```text
understand root cause
→ regression/prevention as justified
→ smallest correct fix
→ materially analogous-area check when justified
→ affected verification
→ continue
```

### Local planning correction

Update the smallest affected planning area, review its impact, adjust affected execution entries, then continue.

### Material plan invalidation

Stop only affected work, revise the affected S&T area and downstream execution mapping, review the changed scope, then continue.

Re-evaluate any affected task already marked `done`: keep it `done` only when its existing result/evidence still proves the revised Strategy/outcome; otherwise return it to executable work or replace/remove it as the revised plan requires. Preserve unaffected valid completed work.

Do not globally reset execution merely because one defect appeared.

## 10. CI warning/error handling

Do not ignore CI warnings/errors and do not treat a local symptom fix or a green rerun as sufficient by itself.

Understand proportionately:

1. what happened;
2. causal root;
3. why prevention/detection did not catch it earlier;
4. reusable prevention/detection improvement when justified;
5. materially analogous exposure;
6. closing evidence.

If the check itself is obsolete, brittle, or noisy without protecting a real invariant, fixing/removing the check may be the correct systemic action.

CI incidents do not automatically create planning state transitions.

## 11. Completion

A task is `done` when its relevant success evidence has been verified.

The overall scope is complete when the intended outcome is verified, not merely when every row says `done`.

Promote durable product/architecture contracts discovered during planning/execution into the target repository's normal source of truth when future work must obey them. Do not keep ST Planner artifacts as a shadow architecture documentation system.

## Anti-bureaucracy test

At every point ask:

> Is the planning/management machinery costing more than the engineering uncertainty it is reducing?

Before adding a mechanism, identify the real failure it prevents and whether a simpler instruction or existing target-repository mechanism is enough.

**Model the work, not the management of the work.**
