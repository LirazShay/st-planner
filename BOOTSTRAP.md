# External Bootstrap — S&T Planner

This file is the entry point for an AI agent working in a **different target repository**.

Use this bootstrap when the user asks to use S&T Planner from:

`LirazShay/st-planner`

The target repository does not need S&T Planner installed beforehand.

## User-facing command

A request such as:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו: <המטרה>

or:

> Use S&T Planner from LirazShay/st-planner and plan this from the current repository: <goal>

is enough.

The user does not need to copy files, explain the framework, or paste another prompt.

## Bootstrap contract

When invoked from another repository:

1. Treat the repository you are currently working on as the **target repository**.
2. Read the target repository's existing `AGENTS.md` / routing / source-of-truth instructions first if they exist.
3. Fetch this source repository's current files from the default branch:
   - `templates/project/.planning/README.md`
   - `templates/project/.planning/FRAMEWORK.md`
   - `templates/project/.planning/GOAL.md`
   - `templates/project/.planning/TREE.yaml`
   - `templates/project/.planning/DECISIONS.md`
   - `templates/project/.planning/REVIEWS.md`
   - `templates/project/.planning/STATUS.yaml`
   - `templates/project/.planning/EXECUTION.yaml`
   - `templates/project/.planning/EXECUTOR_HANDOFF.md`
   - `templates/project/.planning/validate-allocation.mjs`
   - `templates/project/AGENTS.snippet.md`
4. If the target repository does **not** already contain `.planning/`, copy the ten planning/framework files above into target `.planning/` using the same filenames.
5. Merge `templates/project/AGENTS.snippet.md` into the target repository's existing `AGENTS.md`. Preserve the target repository's existing instructions. If no `AGENTS.md` exists, create one containing the snippet.
6. If the target repository already contains an S&T Planner `.planning/`, do not overwrite live planning state. Use the installed state as-is unless the user explicitly asks to upgrade/reinstall the framework.
7. Treat `.planning/STATUS.yaml` as the only S&T Planner-owned lifecycle/status file. If the target repository also has `STATUS.yaml`, phase/state files, or workstream status, preserve them unless the target's own instructions explicitly require a coordinated integration update.
8. After bootstrap, continue **in the same conversation** as the planning agent. Do not stop merely because installation completed.
9. Determine the requested goal from the user's command and target repository context.
10. Follow the installed S&T Framework Rules automatically:
   - use target-repository context progressively;
   - build/update `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, and `.planning/STATUS.yaml`;
   - do not implement target-project work while planning;
   - continue until the complete intended plan passes Final Planning Review;
   - freeze the plan with implementation still unauthorized;
   - populate EXECUTION with numbered executor-chat assignments;
   - run `node .planning/validate-allocation.mjs --initial` and fix any allocation failure;
   - use `.planning/EXECUTOR_HANDOFF.md` to run the mandatory repository-only fresh-chat verification;
   - record the verification in REVIEWS;
   - explicitly authorize implementation only after that gate passes.
11. Do not ask the user to repeat framework instructions. Ask only for a missing project goal if neither the request nor the target repository makes it unambiguous.

## Safety against accidental overwrite

Bootstrap installs framework files only when `.planning/` is absent.

An existing S&T planning state is project data. Never replace `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, `.planning/EXECUTION.yaml`, or `.planning/EXECUTOR_HANDOFF.md` from the source templates during ordinary reuse. Treat `validate-allocation.mjs` as framework tooling; do not overwrite an installed copy unless the user explicitly requests an S&T Planner upgrade.

## Normal execution after planning

Once planning is frozen, execution allocation/handoff is complete, and `.planning/STATUS.yaml -> implementation_authorized: true`, a new executor chat in the target repository can simply say:

> אני צ'אט מספר 1

The installed target-project rules define how that chat resumes its assigned S&T nodes.
