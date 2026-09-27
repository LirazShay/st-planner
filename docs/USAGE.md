# Using S&T Planner from Another Repository

The normal workflow starts from the **target repository**. S&T Planner does not need to be installed there beforehand.

Automatic bootstrap assumes the agent can read the public S&T Planner repository and write to the target repository. Target branch/PR/verification rules still apply to bootstrap changes.

## Start

Open a chat that is working on the target repository and say:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו: <המטרה>

That single request is the intended user interface.

## What the agent does automatically

The agent:

1. reads the target repository's existing AGENTS/routing/source-of-truth rules;
2. fetches `LirazShay/st-planner/BOOTSTRAP.md`;
3. follows the bootstrap contract;
4. classifies any existing `.planning/` before writing so unrelated target data is never mistaken for an installed S&T Planner;
5. copies the eleven S&T planning/framework files only for a permitted fresh install, using one source commit for the whole bundle;
6. merges the S&T rules into target `AGENTS.md` once while preserving existing rules;
7. verifies the installed bundle and then continues immediately in the same chat;
8. builds, reviews, and persists the complete S&T plan;
9. records the reviewed baseline and proves no material GOAL/TREE/DECISIONS drift before freeze;
10. freezes only that verified baseline, with implementation still unauthorized;
11. populates `.planning/EXECUTION.yaml` with numbered executor-chat assignments;
12. runs `node .planning/validate-allocation.mjs --initial` and fixes every failure;
13. uses `.planning/EXECUTOR_HANDOFF.md` to simulate the mandatory repository-only fresh executor cases;
14. records the verification in `.planning/REVIEWS.md`, fixes/rechecks failures, and explicitly authorizes implementation only after all gates pass.

The user does not manually copy files or explain the S&T workflow.

## Status ownership

S&T Planner owns only `.planning/STATUS.yaml`. If the target repository also contains a root `STATUS.yaml`, release phase, workstream status, or another operational state file, that remains target-owned. Do not use it as an alias for S&T planning state and do not mutate it unless the target repository's own instructions explicitly require an integration update.

## Existing installation

If the target repository already contains a recognizable S&T Planner installation, ordinary reuse is idempotent: do not overwrite installed `.planning/` files and do not append another S&T rules block to `AGENTS.md`.

If `.planning/` belongs to another system, preserve it. Fresh S&T installation may share the directory only when none of the eleven S&T destination filenames conflict; otherwise report the exact conflict instead of overwriting target data.

Use an existing S&T installation as-is unless the user explicitly requests an upgrade/reinstall.

## Planning continuation

One planning chat is preferred.

If continuation in another chat becomes necessary, the repository state is sufficient. The new planner reads the target project's AGENTS and `.planning/` state and continues from `.planning/STATUS.yaml`.

## Execution

After planning is frozen, allocation/handoff is complete, and `.planning/STATUS.yaml -> implementation_authorized: true`, open an executor chat in the target repository and say:

> אני צ'אט מספר 1

The executor first follows `.planning/EXECUTOR_HANDOFF.md`, then reads its assigned nodes from `EXECUTION.yaml`, loads those nodes from `TREE.yaml`, checks `depends_on`, and loads only the target-project context required for available assigned work.

## If execution exposes a planning defect

Keep it simple:

1. block the affected node with a short factual reason;
2. set planning active again and revoke implementation authorization;
3. reopen only the smallest affected S&T area;
4. correct/review it, record the corrected reviewed baseline, and pass freeze no-drift verification again;
5. freeze the verified corrected baseline and repair only affected EXECUTION entries;
6. run `node .planning/validate-allocation.mjs --resume` and fix any failure;
7. rerun and record the mandatory fresh-chat handoff verification;
8. explicitly re-authorize only after all gates pass;
9. preserve valid completed work.

## Authoritative external entry point

`BOOTSTRAP.md` in `LirazShay/st-planner` is the authoritative bootstrap contract.
