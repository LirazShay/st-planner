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

Automatic bootstrap requires an agent that can read this public source repository and write to the target repository. If target write access is unavailable, do not pretend installation succeeded.

## Bootstrap contract

When invoked from another repository:

1. Treat the repository you are currently working on as the **target repository**.
2. Before changing anything, read the target repository's existing `AGENTS.md`, routing/source-of-truth instructions, and repository workflow rules. Follow target branch/PR/merge/verification rules for the bootstrap changes themselves.
3. Resolve this source repository's default-branch HEAD to **one commit SHA** for the bootstrap attempt. Fetch all bundle files below from that same source commit; do not mix files from moving refs:
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
   - `templates/project/.planning/verify-freeze-baseline.mjs`
   - `templates/project/AGENTS.snippet.md`
4. Inspect the target before writing:
   - if `.planning/` is absent, this is a fresh install;
   - if `.planning/FRAMEWORK.md` identifies the Portable S&T Planning Kernel and `.planning/STATUS.yaml` exists, treat S&T Planner as already installed and do not overwrite its installed files during ordinary reuse;
   - if `.planning/` exists for another purpose and **none** of the eleven S&T destination filenames conflict, preserve the unrelated files and install the eleven S&T files alongside them;
   - if any S&T destination filename already exists but the directory is not a recognizable complete S&T Planner installation, do not overwrite it. Report the exact conflicting/partial paths and require an explicit repair/upgrade decision.
5. For a permitted fresh install, copy the **eleven files under `templates/project/.planning/`** into target `.planning/` using the same filenames.
6. Merge `templates/project/AGENTS.snippet.md` into the target repository's root `AGENTS.md` **once**:
   - if `<!-- st-planner:rules:v1 -->` or the existing `# S&T Framework Rules` block is already present, do not append a duplicate;
   - otherwise preserve all existing target instructions and append/merge the snippet;
   - if no `AGENTS.md` exists, create one containing the snippet.
7. Verify the bootstrap before planning:
   - all eleven S&T `.planning/` files expected for a fresh install exist;
   - the S&T rules block appears exactly once in root `AGENTS.md`;
   - no pre-existing target file was overwritten unless the user explicitly requested repair/upgrade;
   - for a fresh install, installed framework/tooling files match the single source commit selected in step 3.
8. Treat `.planning/STATUS.yaml` as the only S&T Planner-owned lifecycle/status file. If the target repository also has `STATUS.yaml`, phase/state files, or workstream status, preserve them unless the target's own instructions explicitly require a coordinated integration update.
9. After bootstrap/reuse, continue **in the same conversation** as the planning agent. Do not stop merely because installation completed.
10. Determine the requested goal from the user's command and target repository context.
11. Follow the installed S&T Framework Rules automatically:
   - use target-repository context progressively;
   - build/update `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, and `.planning/STATUS.yaml`;
   - do not implement target-project work while planning;
   - continue until the complete intended plan passes Final Planning Review;
   - record the reviewed baseline evidence in REVIEWS;
   - verify no material GOAL/TREE/DECISIONS drift from that reviewed baseline;
   - freeze only that reviewed baseline with implementation still unauthorized;
   - if merge/rebase/integration changes the frozen ref afterward, repeat no-drift verification before handoff;
   - populate EXECUTION with numbered executor-chat assignments;
   - run `node .planning/validate-allocation.mjs --initial` and fix any allocation failure;
   - use `.planning/EXECUTOR_HANDOFF.md` to run the mandatory repository-only fresh-chat verification;
   - record the verification in REVIEWS;
   - explicitly authorize implementation only after that gate passes.
12. Do not ask the user to repeat framework instructions. Ask only for a missing project goal if neither the request nor the target repository makes it unambiguous.

## Safety against accidental overwrite

Ordinary reuse of an existing S&T Planner installation overwrites **nothing** under `.planning/` and does not append another S&T rules block to `AGENTS.md`.

An existing S&T planning state is project data. Never replace `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, `.planning/EXECUTION.yaml`, or `.planning/EXECUTOR_HANDOFF.md` from source templates during ordinary reuse.

`FRAMEWORK.md`, `.planning/README.md`, `validate-allocation.mjs`, and `verify-freeze-baseline.mjs` are installed framework material/tooling, but they also remain untouched during ordinary reuse. Updating installed framework files is an explicit upgrade operation, not a side effect of starting another planning chat.

## Normal execution after planning

Once planning is frozen, execution allocation/handoff is complete, and `.planning/STATUS.yaml -> implementation_authorized: true`, a new executor chat in the target repository can simply say:

> אני צ'אט מספר 1

The installed target-project rules define how that chat resumes its assigned S&T nodes.
