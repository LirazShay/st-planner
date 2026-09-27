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
8. freezes only after Final Planning Review passes;
9. populates `.planning/EXECUTION.yaml` with numbered executor-chat assignments.

The user does not manually copy files or explain the S&T workflow.

## Existing installation

If the target repository already contains S&T Planner project state, do not overwrite the live planning state from templates.

Use the existing installation unless the user explicitly requests an upgrade/reinstall.

## Planning continuation

One planning chat is preferred.

If continuation in another chat becomes necessary, the repository state is sufficient. The new planner reads the target project's AGENTS and `.planning/` state and continues from STATUS.

## Execution

After planning is frozen, open an executor chat in the target repository and say:

> אני צ'אט מספר 1

The executor reads its assigned nodes from `EXECUTION.yaml`, loads those nodes from `TREE.yaml`, checks `depends_on`, and executes only available assigned work.

## If execution exposes a planning defect

Keep it simple:

1. block the affected node with a short factual reason;
2. set planning active again;
3. reopen only the smallest affected S&T area;
4. correct/review/freeze it;
5. repair only affected EXECUTION entries;
6. preserve valid completed work.

## Authoritative external entry point

`BOOTSTRAP.md` in `LirazShay/st-planner` is the authoritative bootstrap contract.
