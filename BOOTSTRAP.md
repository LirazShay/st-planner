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
   - `templates/project/AGENTS.snippet.md`
4. If the target repository does **not** already contain `.planning/`, copy the eight planning files above into target `.planning/` using the same filenames.
5. Merge `templates/project/AGENTS.snippet.md` into the target repository's existing `AGENTS.md`. Preserve the target repository's existing instructions. If no `AGENTS.md` exists, create one containing the snippet.
6. If the target repository already contains an S&T Planner `.planning/`, do not overwrite live planning state. Use the installed state as-is unless the user explicitly asks to upgrade/reinstall the framework.
7. After bootstrap, continue **in the same conversation** as the planning agent. Do not stop merely because installation completed.
8. Determine the requested goal from the user's command and target repository context.
9. Follow the installed S&T Framework Rules automatically:
   - use target-repository context progressively;
   - build/update GOAL, TREE, DECISIONS, REVIEWS, and STATUS;
   - do not implement target-project work while planning;
   - continue until the complete intended plan passes Final Planning Review;
   - freeze the plan;
   - populate EXECUTION with numbered executor-chat assignments.
10. Do not ask the user to repeat framework instructions. Ask only for a missing project goal if neither the request nor the target repository makes it unambiguous.

## Safety against accidental overwrite

Bootstrap installs framework files only when `.planning/` is absent.

An existing S&T planning state is project data. Never replace GOAL/TREE/DECISIONS/REVIEWS/STATUS/EXECUTION from the source templates during ordinary reuse.

## Normal execution after planning

Once planning is frozen, a new executor chat in the target repository can simply say:

> אני צ'אט מספר 1

The installed target-project rules define how that chat resumes its assigned S&T nodes.
