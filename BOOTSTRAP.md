# External Bootstrap — S&T Planner

This file is the entry point for an AI agent working in a **different target repository**.

Use this bootstrap when the user asks to use S&T Planner from:

`LirazShay/st-planner`

The target repository does not need S&T Planner installed beforehand.

## User-facing command

A request such as:

> תעבוד עם S&T Planner מ-LirazShay/st-planner ותתכנן לי לפי הריפו: <מה אני רוצה להשיג/לבנות/לשנות>

or:

> Use S&T Planner from LirazShay/st-planner and plan this from the current repository: <desired outcome/change>

is enough.

The requested planning scope may be a whole project/initiative or a meaningful scope inside an existing system, such as a release, feature, migration, refactor, architectural change, or other substantial change. The user does not need to classify the scope.

Examples include:
- planning one feature inside an existing system;
- planning a release containing several feature subtrees;
- planning a migration/refactor;
- planning a technical change proposed in solution form, such as adding Redis or moving to WebSocket.

A user-proposed feature/tool/technology/architecture is normally a **candidate tactic**, not automatically the desired outcome. Treat it as fixed only when the user explicitly makes it a constraint/decision or an existing durable target-project contract already does so.

The planner defaults to informed autonomy: investigate the repository, evaluate material alternatives, and make responsible planner-owned product/technical choices without asking the user to approve every valid option. Ask only when the missing input is genuinely user-owned or cannot be responsibly derived and different answers would materially change the plan. Prefer a reasonable reversible default for low-risk uncertainty. If a question is unavoidable, minimize and batch it and include the planner's recommendation when useful.

The user does not need to copy files, explain the framework, choose tree depth, or paste another prompt.

Automatic bootstrap requires an agent that can read this public source repository and write to the target repository. If source read access or target write access is unavailable, do not pretend installation or persisted planning succeeded. Tell the user exactly which capability is missing, what could not be completed, and the single next action required to resume. Do not turn an access failure into framework questions or ask the user to manually reconstruct the bundle.

If a partial/conflicting installation prevents safe bootstrap, report the exact conflicting paths, preserve all existing data, recommend the least-destructive repair/upgrade path, and ask for approval only when that repair would modify or replace pre-existing target content.

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
   - if `.planning/FRAMEWORK.md` identifies the Portable S&T Planning Kernel and `.planning/STATUS.yaml` exists, treat S&T Planner as already installed and do not overwrite installed framework/project state merely because the command was invoked again;
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
   - no pre-existing target file was overwritten unless the user explicitly requested repair/upgrade or a valid new-cycle transition applies;
   - for a fresh install, installed framework/tooling files match the single source commit selected in step 3.
8. Treat `.planning/STATUS.yaml` as the only S&T Planner-owned lifecycle/status file. If the target repository also has `STATUS.yaml`, phase/state files, or workstream status, preserve them unless the target's own instructions explicitly require a coordinated integration update.
9. If S&T Planner is already installed, inspect `.planning/STATUS.yaml -> cycle_state` before changing current-cycle state:
   - `active`: continue/replan that cycle when the request belongs to the same intended scope. Never erase active cycle files merely because a new request arrived;
   - `completed` or `abandoned`: a later independent planning scope may start a new cycle after the terminal review/snapshot is durably preserved;
   - V1 supports one active S&T cycle per repository. A genuinely independent new scope must not silently create parallel cycle state while another cycle remains active.
10. A **new-cycle transition is not bootstrap/reinstall**. When the previous cycle is terminal, preserve installed framework/tooling and the S&T rules block, but reset only current-cycle state:
   - `.planning/GOAL.md`;
   - `.planning/TREE.yaml`;
   - `.planning/DECISIONS.md`;
   - `.planning/REVIEWS.md`;
   - `.planning/STATUS.yaml`;
   - `.planning/EXECUTION.yaml`.
   Start the new STATUS with `cycle_state: active`, `plan_state: active`, `implementation_authorized: false`. Use repository history for prior-cycle audit; do not create an archive hierarchy by default.
11. After bootstrap/reuse/new-cycle transition, continue **in the same conversation** as the planning agent. Do not stop merely because installation/state setup completed.
12. Determine the current planning boundary and required outcome from the user's command plus target-repository context. Do not silently widen a feature/change request into a whole-product plan.
13. Separate:
   - required outcome;
   - established current reality;
   - hard constraints / already-fixed decisions;
   - proposed feature/tool/technology/architecture.
14. If the request starts from a proposed solution, climb upward until the outcome that makes the solution worth considering is understood. Do not challenge a genuinely fixed constraint merely to create artificial alternatives.
15. Follow the installed S&T Framework Rules automatically:
   - use target-repository context progressively;
   - build/update `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, and `.planning/STATUS.yaml`;
   - challenge every material root/lower-level Tactic at the depth justified by its impact, including materially plausible alternatives and invalidating assumptions;
   - use one S&T node model for project/release/feature/migration/technical scopes; do not introduce special Feature/Release schema or default discipline-folder branches;
   - keep ordinary local reasoning in TREE assumptions and only material unresolved choices/unknowns in DECISIONS;
   - use necessity/sufficiency to determine children and continue until leaves are both decision-complete and practical for executor chats;
   - do not implement target-project work while planning;
   - continue until the complete intended planning scope passes Final Planning Review;
   - record the reviewed baseline evidence in REVIEWS;
   - verify no material GOAL/TREE/DECISIONS drift from that reviewed baseline;
   - freeze only that reviewed baseline with `cycle_state: active` and implementation still unauthorized;
   - if merge/rebase/integration changes the frozen ref afterward, repeat no-drift verification before handoff;
   - populate EXECUTION with numbered executor-chat assignments based on implementation context/dependencies/workload rather than blindly on feature subtree boundaries;
   - run `node .planning/validate-allocation.mjs --initial` and fix any allocation failure;
   - use `.planning/EXECUTOR_HANDOFF.md` to run the mandatory repository-only fresh-chat verification;
   - record the verification in REVIEWS;
   - explicitly authorize implementation only after that gate passes;
   - after required execution is done, run Cycle Closure Review before marking the cycle `completed`; integrated root-outcome proof and durable carry-forward of cross-cycle contracts are required.
16. Investigate repository context/evidence before asking the user. Make planner-owned product/technical choices yourself when the goal, constraints, evidence, and tradeoffs support a responsible choice; do not ask for approval merely because multiple valid implementations exist. Ask only for a missing outcome/boundary, genuinely user-owned material preference/constraint, or a material fact that cannot be established reliably and can change the plan. If a question is unavoidable, ask the smallest useful question, batch tightly related unknowns, and include a recommendation when useful. Do not ask the user to repeat framework instructions.

## Safety against accidental overwrite

**Ordinary reuse/continuation of the same cycle overwrites nothing from source templates** under `.planning/` and does not append another S&T rules block to `AGENTS.md`.

An existing active S&T planning state is project data. Never replace `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, `.planning/EXECUTION.yaml`, or `.planning/EXECUTOR_HANDOFF.md` from source templates during ordinary reuse.

A permitted **new-cycle transition** is different: it may intentionally reinitialize only the six current-cycle state files listed in step 10, and only after the prior cycle is `completed` or `abandoned` with terminal evidence durably preserved. It does **not** overwrite installed framework/tooling from upstream and does not reinstall/duplicate AGENTS rules.

`FRAMEWORK.md`, `.planning/README.md`, `EXECUTOR_HANDOFF.md`, `validate-allocation.mjs`, and `verify-freeze-baseline.mjs` are installed framework material/tooling and remain untouched during ordinary reuse or new-cycle reset. Updating them is an explicit framework upgrade operation.

## Normal execution after planning

Once `.planning/STATUS.yaml` has all of:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

the planning agent must determine from `EXECUTION.yaml` and TREE `depends_on` which executor chat ID or IDs are runnable now and tell the user exactly which new chat(s) can be opened. The user should not inspect planning files to discover the next chat.

For each runnable chat, the command is simply:

> אני צ'אט מספר N

or:

> I am chat N

`Chat 1` is only an example when Chat 1 is actually runnable; chat numbering does not imply execution order. If several independent chats are runnable and the target workflow permits parallel work, the planner should say so explicitly.

The installed target-project rules define how each executor resumes its assigned S&T nodes. The executor does not need the user to restate the project/feature/release context; repository state must provide the assigned nodes, relevant ancestor/Decision context, dependencies, and next runnable work.

A `completed` or `abandoned` cycle never authorizes execution, even if stale TREE/EXECUTION content still exists before a later cycle reset.