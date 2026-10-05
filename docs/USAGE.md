# Using S&T Planner from Another Repository

The normal workflow starts from the **target repository**. S&T Planner does not need to be installed there beforehand.

Automatic bootstrap assumes the agent can read the public S&T Planner repository and write to the target repository. Target branch/PR/verification rules still apply to bootstrap changes.

## Start

Open a chat that is working on the target repository and say:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו: <מה אני רוצה להשיג/לבנות/לשנות>

That single request is the intended user interface.

The request may describe:
- a whole project or initiative;
- one feature;
- a release containing several features/capabilities;
- a migration or refactor;
- an architectural or other substantial technical change.

The user does not need to classify the scope or explain the S&T workflow.

Examples:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו את הפיצ'ר Saved Searches.

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו את Release 3 עם Alerts, Watchlists ו-Import improvements.

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו מעבר מ-polling ל-WebSocket.

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו הוספת Redis כדי להוריד עומס מה-DB.

A feature/tool/technology/architecture mentioned by the user is normally a **candidate tactic**, not automatically the desired outcome. The planner first identifies what outcome the request is meant to create and challenges the proposed solution unless it is explicitly fixed by the user or a durable project contract.

## What the agent does automatically

The agent:

1. reads the target repository's existing AGENTS/routing/source-of-truth rules;
2. fetches `LirazShay/st-planner/BOOTSTRAP.md`;
3. follows the bootstrap contract;
4. classifies any existing `.planning/` before writing so unrelated target data is never mistaken for an installed S&T Planner;
5. copies the eleven S&T planning/framework files only for a permitted fresh install, using one source commit for the whole bundle;
6. merges the S&T rules into target `AGENTS.md` once while preserving existing rules;
7. on an existing installation, reads `.planning/STATUS.yaml -> cycle_state` before changing current-cycle state;
8. verifies installation/state setup and continues immediately in the same chat;
9. determines the current planning boundary and desired outcome from the user's request plus repository reality;
10. separates outcome/current reality/constraints from any proposed feature/tool/architecture;
11. challenges material candidate tactics at the depth justified by the decision;
12. builds, reviews, and persists the complete S&T plan;
13. records the reviewed baseline and proves no material GOAL/TREE/DECISIONS drift before freeze;
14. freezes only that verified baseline, with `cycle_state: active` and implementation still unauthorized;
15. populates `.planning/EXECUTION.yaml` with numbered executor-chat assignments;
16. runs `node .planning/validate-allocation.mjs --initial` and fixes every failure;
17. uses `.planning/EXECUTOR_HANDOFF.md` to simulate the mandatory repository-only fresh executor cases;
18. records the verification in `.planning/REVIEWS.md`, fixes/rechecks failures, and explicitly authorizes implementation only after all gates pass;
19. after required execution is done, runs Cycle Closure Review and marks the cycle completed only when the integrated root/current-scope outcome is verified.

The user does not manually copy files, choose tree depth, decide the number of chats, or explain the S&T procedure.

## How feature/release planning behaves

S&T Planner uses the same tree model for every scope.

A feature can be a full subtree. A release can contain several feature subtrees when those feature outcomes are genuinely required by one shared release outcome or by an explicit committed release scope.

The planner does **not** create a release hierarchy merely because several changes share a version label.

Likewise, it does not default a feature subtree to `Frontend / Backend / Database / Tests`. Children emerge from necessity/sufficiency reasoning.

At material levels the planner checks both:
- why the selected Tactic is justified for the Strategy, including materially plausible alternatives;
- why each child is necessary and why the children are sufficient together.

This challenge repeats from business/product reasoning through architecture/component/technical reasoning.

## When the agent should ask the user

The default is informed planner autonomy, not a questionnaire.

The agent investigates the repository and available evidence first. When the goal, constraints, evidence, and tradeoffs support a responsible product/technical choice, it makes that choice, records the rationale, and continues. It should not ask for approval merely because several valid implementations exist, and it should prefer a reasonable reversible default for low-risk uncertainty.

It asks the user only when the missing input is genuinely user-owned, such as a material product/business preference or acceptance boundary, or when a material fact cannot be established reliably and different answers would materially change the plan.

If a question is unavoidable, it should ask the smallest useful question, batch tightly related unknowns, and include its recommendation when useful.

If the user explicitly states that a product/technical choice is fixed, the planner treats it as a constraint instead of repeatedly challenging it.

## Reusing the same installation later

S&T Planner is installed once. V1 allows **one active planning+execution cycle per repository**.

`STATUS.yaml` distinguishes:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

If `cycle_state: active`:
- a request belonging to the same intended scope resumes/replans that cycle;
- active planning state is never erased merely because another request arrived;
- a genuinely independent new scope does not silently create parallel planning state.

If an independent new request arrives while another cycle is active, the planner should not silently abandon the current cycle or force the new request into it. If the requests cannot responsibly be combined, choosing whether to finish or explicitly abandon the existing cycle is a genuine user-owned prioritization decision; ask one focused question with a recommendation rather than starting a second active cycle.

If the cycle is `completed` or `abandoned`, a later independent scope can start a new cycle after the terminal review/snapshot is durably preserved.

A new-cycle transition keeps installed framework/tooling and the project `AGENTS.md` S&T rules, while reinitializing only:
- `GOAL.md`;
- `TREE.yaml`;
- `DECISIONS.md`;
- `REVIEWS.md`;
- `STATUS.yaml`;
- `EXECUTION.yaml`.

The new cycle starts with:

```yaml
cycle_state: active
plan_state: active
implementation_authorized: false
```

Previous-cycle reasoning remains in Git/repository history. Cross-cycle truths belong in the target project's durable contracts, not in an accumulating archive of old TREE/DECISIONS files.

No `.planning/archive/`, plan-version registry, or parallel active cycle directories are required by default.

## Cycle completion versus freeze

Freeze and cycle completion are different:

- `plan_state: frozen` means the reviewed planning baseline is closed for ordinary editing;
- it does **not** mean execution is authorized;
- it does **not** mean the planning scope has been successfully delivered.

Execution requires all three:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

After all required leaves are `done`, the planner still runs Cycle Closure Review. Completion requires integrated root/current-scope evidence, no required execution blocker, and promotion of durable decisions/contracts needed by future cycles.

Only then:

```yaml
cycle_state: completed
implementation_authorized: false
```

If the scope is intentionally stopped without proving the root outcome, it becomes `abandoned`, not completed.

## Status ownership

S&T Planner owns only `.planning/STATUS.yaml`. If the target repository also contains a root `STATUS.yaml`, release phase, workstream status, or another operational state file, that remains target-owned. Do not use it as an alias for S&T planning state and do not mutate it unless the target repository's own instructions explicitly require an integration update.

## Existing installation

If the target repository already contains a recognizable S&T Planner installation, ordinary continuation is idempotent: do not reinstall framework files or append another S&T rules block to `AGENTS.md`.

If `.planning/` belongs to another system, preserve it. Fresh S&T installation may share the directory only when none of the eleven S&T destination filenames conflict; otherwise report the exact conflict instead of overwriting target data.

Use an existing installation as-is unless the user explicitly requests an upgrade/reinstall. Starting a valid later cycle is a lifecycle transition, not an upgrade/reinstall.

## Planning continuation

One planning chat is preferred.

If continuation in another chat becomes necessary, repository state is sufficient. The new planner reads the target project's AGENTS and `.planning/` state and continues from `.planning/STATUS.yaml`.

The new planner should be able to recover the current cycle state, planning scope, desired outcome, current node, blockers, next action, and material Decisions without requiring the user to explain whether the scope is a project, feature, release, migration, or other change.

## Execution

When STATUS contains:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

the planner determines from `EXECUTION.yaml` and TREE `depends_on` which executor chat ID or IDs are runnable now and tells the user exactly which new chat(s) can be opened. The user should not inspect planning files to discover the next chat.

For a runnable chat, say:

> אני צ'אט מספר N

or:

> I am chat N

`Chat 1` is only an example when Chat 1 is actually runnable; chat numbering does not imply execution order. If several independent chats are runnable and the target workflow permits parallel work, the planner should say so explicitly.

The executor first follows `.planning/EXECUTOR_HANDOFF.md`, then reads its assigned nodes from `EXECUTION.yaml`, loads those nodes from `TREE.yaml`, checks `depends_on`, and loads only the target-project/ancestor/Decision context required for available assigned work.

After each executor finishes its currently runnable assigned work, it computes from repository state what comes next and tells the user the exact next runnable chat ID(s), the blocking dependency when none is runnable, or that Cycle Closure Review is next when all required leaves are done. The user never needs to inspect `EXECUTION.yaml` manually to route execution.

Chat allocation follows implementation context, dependencies, and manageable workload. It does not require `one feature = one chat`: one feature may span several chats, and one chat may own leaves from several feature subtrees when that is the coherent implementation unit.

## If execution exposes a planning defect

Keep it inside the same active cycle:

1. block the affected node with a short factual reason;
2. keep `cycle_state: active`;
3. set planning active again and revoke implementation authorization;
4. stop starting new execution work;
5. tell the user to return to/open a planning chat in the same repository with the exact command `תקן והמשך את מחזור S&T לפי הריפו` (or `Repair and continue the S&T cycle from the repository`);
6. reopen only the smallest affected S&T area;
7. correct/review it, record the corrected reviewed baseline, and pass freeze no-drift verification again;
8. freeze the verified corrected baseline and repair only affected EXECUTION entries;
9. run `node .planning/validate-allocation.mjs --resume` and fix any failure;
10. rerun and record the mandatory fresh-chat handoff verification;
11. explicitly re-authorize only after all gates pass;
12. preserve valid completed work.

## Authoritative external entry point

`BOOTSTRAP.md` in `LirazShay/st-planner` is the authoritative bootstrap contract.
