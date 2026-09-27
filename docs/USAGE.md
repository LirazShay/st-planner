# Using S&T Planner from Another Repository

The normal workflow starts from the **target repository**. S&T Planner does not need to be installed there beforehand.

## Start

Open a chat that is working on the target repository and say:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו: <המטרה>

That single request is the intended user interface.

## What the agent does automatically

The agent:

1. reads the target repository's existing AGENTS/routing/source-of-truth rules;
2. fetches `LirazShay/st-planner/BOOTSTRAP.md`;
3. follows the bootstrap contract;
4. copies the S&T planning template files into target `.planning/`;
5. merges the S&T rules into the target `AGENTS.md` while preserving existing rules;
6. continues immediately in the same chat to understand the requested goal and relevant repository context;
7. builds, reviews, and persists the complete S&T plan;
8. after Final Planning Review, records the reviewed baseline evidence in `.planning/REVIEWS.md`;
9. proves no material GOAL/TREE/DECISIONS drift from that reviewed baseline; when Git refs are available it uses `.planning/verify-freeze-baseline.mjs`;
10. freezes only the reviewed no-drift baseline, with implementation still unauthorized;
11. after any merge/rebase/integration that changes the frozen ref, repeats no-drift verification before allocation;
12. populates `.planning/EXECUTION.yaml` with numbered executor-chat assignments;
13. runs `node .planning/validate-allocation.mjs --initial` and fixes every failure;
14. uses `.planning/EXECUTOR_HANDOFF.md` to simulate the mandatory repository-only fresh executor cases;
15. records the verification in `.planning/REVIEWS.md`;
16. fixes/rechecks any failed handoff case;
17. explicitly authorizes implementation only after freeze no-drift, allocation validation, and fresh-chat gates pass.

The user does not manually copy files or explain the S&T workflow.

## Status ownership

S&T Planner owns only `.planning/STATUS.yaml`. If the target repository also contains a root `STATUS.yaml`, release phase, workstream status, or another operational state file, that remains target-owned. Do not use it as an alias for S&T planning state and do not mutate it unless the target repository's own instructions explicitly require an integration update.

## Existing installation

If the target repository already contains S&T Planner project state, do not overwrite the live planning state from templates.

Use the existing installation unless the user explicitly requests an upgrade/reinstall.

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
4. correct/review it and record the corrected reviewed baseline;
5. pass freeze no-drift verification again and freeze only that corrected baseline;
6. repair only affected EXECUTION entries;
7. run `node .planning/validate-allocation.mjs --resume` and fix any failure;
8. rerun and record the mandatory fresh-chat handoff verification;
9. explicitly re-authorize only after freeze no-drift, allocation validation, and fresh-chat gates pass;
10. preserve valid completed work.

## Authoritative external entry point

`BOOTSTRAP.md` in `LirazShay/st-planner` is the authoritative bootstrap contract.
