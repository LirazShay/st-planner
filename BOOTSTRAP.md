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

A later explicit framework upgrade request may be as simple as:

> עדכן S&T Planner מהמקור לפני שממשיכים

The requested planning scope may be a whole project/initiative or a meaningful scope inside an existing system, such as a release, feature, migration, refactor, architectural change, or other substantial change. The user does not need to classify the scope.

A user-proposed feature/tool/technology/architecture is normally a **candidate tactic**, not automatically the desired outcome. Treat it as fixed only when the user explicitly makes it a constraint/decision or an existing durable target-project contract already does so.

The planner defaults to informed autonomy: investigate the repository, evaluate material alternatives, and make responsible planner-owned product/technical choices without asking the user to approve every valid option. Ask only when the missing input is genuinely user-owned or cannot be responsibly derived and different answers would materially change the plan.

Automatic bootstrap/update requires an agent that can read this source repository and write to the target repository. If source read access or target write access is unavailable, do not pretend installation/update succeeded. Tell the user exactly which capability is missing and what could not be completed.

## Source release and update model

S&T Planner is copied into target repositories, so every installation must know which framework release it contains.

The source repository publishes:

- `FRAMEWORK_RELEASE.json` — current framework version, update policy, summary, protected state paths, and framework-managed paths;
- `CHANGELOG.md` — release changes and upgrade notes;
- `docs/FRAMEWORK-UPDATES.md` — the update contract.

A target installation contains:

- `.planning/ST_PLANNER_INSTALL.json` — installed framework version/provenance;
- `.planning/check-framework-update.mjs` — zero-dependency freshness checker.

At the start of S&T planning or executor bootstrap, run:

```text
node .planning/check-framework-update.mjs
```

If a newer release is marked `required`, do not start new S&T planning/execution work until the explicit framework upgrade is completed and the checker reports current. A `recommended` release is surfaced to the user but is not a hard gate. If network access is unavailable, report that freshness could not be verified and continue from the installed framework rather than claiming it is current.

Repositories installed before this mechanism are **legacy unversioned installations**. They require one explicit framework upgrade; after that, future releases can be detected automatically.

## Bootstrap / upgrade contract

When invoked from another repository:

1. Treat the repository you are currently working on as the **target repository**.
2. Before changing anything, read the target repository's existing `AGENTS.md`, routing/source-of-truth instructions, and repository workflow rules. Follow target branch/PR/merge/verification rules for bootstrap/upgrade changes themselves.
3. Resolve this source repository's default-branch HEAD to **one commit SHA** for the operation. Fetch `FRAMEWORK_RELEASE.json`, `CHANGELOG.md`, and all bundle files below from that same source commit; do not mix files from moving refs.
4. Inspect the target before writing:
   - if `.planning/` is absent, this is a fresh install;
   - if `.planning/FRAMEWORK.md` identifies the Portable S&T Planning Kernel and `.planning/STATUS.yaml` exists, treat S&T Planner as installed;
   - if installed and `.planning/ST_PLANNER_INSTALL.json` exists, run `.planning/check-framework-update.mjs` before new planning/execution;
   - if installed but `.planning/ST_PLANNER_INSTALL.json` is missing, classify it as a legacy unversioned installation and require an explicit framework upgrade before relying on source freshness;
   - if `.planning/` exists for another purpose and any S&T destination filename conflicts without a recognizable complete S&T installation, do not overwrite it. Report exact conflicts and require an explicit repair decision.
5. The current source bundle under `templates/project/.planning/` is:
   - `README.md`
   - `FRAMEWORK.md`
   - `GOAL.md`
   - `TREE.yaml`
   - `DECISIONS.md`
   - `REVIEWS.md`
   - `STATUS.yaml`
   - `EXECUTION.yaml`
   - `EXECUTOR_HANDOFF.md`
   - `CI-RCA-POLICY.md`
   - `executor-authority.mjs`
   - `execution-guidance.mjs`
   - `validate-allocation.mjs`
   - `verify-freeze-baseline.mjs`
   - `check-framework-update.mjs`
   - `ST_PLANNER_INSTALL.json`
6. For a permitted **fresh install**, copy all sixteen files into target `.planning/` using the same filenames.
7. Merge `templates/project/AGENTS.snippet.md` into root `AGENTS.md` exactly once. Preserve all target-native instructions. The current S&T block begins with `<!-- st-planner:rules:v2 -->`; do not append a duplicate S&T rules block.
8. Populate `.planning/ST_PLANNER_INSTALL.json` with the release version from the same fetched `FRAMEWORK_RELEASE.json`, `source_repo: LirazShay/st-planner`, the exact resolved source commit when available, and installation timestamp when available.
9. Verify a fresh install before planning:
   - all sixteen `.planning/` files exist;
   - the S&T rules block appears exactly once in root `AGENTS.md`;
   - installed framework/tooling files came from the same resolved source commit;
   - `.planning/ST_PLANNER_INSTALL.json -> framework_version` matches that commit's `FRAMEWORK_RELEASE.json -> version`;
   - `node .planning/check-framework-update.mjs` reports current when network access is available;
   - no pre-existing target file was overwritten except the permitted root `AGENTS.md` merge.
10. If S&T Planner is already installed and the checker reports a newer `required` release, perform an **explicit framework upgrade** before new S&T work:
   - read `docs/FRAMEWORK-UPDATES.md`, `FRAMEWORK_RELEASE.json`, and `CHANGELOG.md` from one resolved source commit;
   - tell the user the installed and target framework versions and summarize material changes;
   - replace only paths listed by the source release as `framework_managed_paths`, using the matching files from that same source commit;
   - never overwrite the protected current-cycle state files listed below;
   - update only the S&T Planner rules block inside root `AGENTS.md`; preserve every target-native instruction before/after it;
   - write the new `.planning/ST_PLANNER_INSTALL.json` last, with the new version/source commit;
   - rerun `node .planning/check-framework-update.mjs` and require it to report current;
   - run the framework/tooling validations materially affected by the release;
   - verify protected state files were not overwritten by the upgrade.
11. **Framework upgrade must never overwrite current-cycle project state:**
   - `.planning/GOAL.md`
   - `.planning/TREE.yaml`
   - `.planning/DECISIONS.md`
   - `.planning/REVIEWS.md`
   - `.planning/STATUS.yaml`
   - `.planning/EXECUTION.yaml`
12. Treat `.planning/STATUS.yaml` as the only S&T Planner-owned lifecycle/status file and `.planning/EXECUTION.yaml` plus `TREE.yaml -> depends_on` as authoritative execution state. Target-owned `STATUS.yaml`, `current_chat`, `current_node`, phase pointers, dashboards, or similar values are projections/navigation aids only. A mismatch should be diagnosed/repaired when useful but must not by itself become a generic hard CI failure or activate/change conversation identity.
13. If S&T Planner is already installed, inspect `.planning/STATUS.yaml -> cycle_state` before changing cycle state:
   - `active`: continue/replan that cycle when the request belongs to the same intended scope; never erase it merely because a new request arrived;
   - `completed` or `abandoned`: a later independent planning scope may start a new cycle after terminal evidence is durably preserved;
   - V1 supports one active S&T cycle per repository.
14. A **new-cycle transition is not bootstrap or framework upgrade**. When the previous cycle is terminal, preserve installed framework/tooling and S&T rules, but reset only current-cycle state:
   - `.planning/GOAL.md`
   - `.planning/TREE.yaml`
   - `.planning/DECISIONS.md`
   - `.planning/REVIEWS.md`
   - `.planning/STATUS.yaml`
   - `.planning/EXECUTION.yaml`
   Start the new STATUS with `cycle_state: active`, `plan_state: active`, `implementation_authorized: false`. Use repository history for prior-cycle audit; do not create an archive hierarchy by default.
15. After bootstrap/reuse/upgrade/new-cycle transition, continue **in the same conversation** as the planning agent. Do not stop merely because setup completed.
16. Determine the current planning boundary and required outcome from the user's command plus target-repository context. Do not silently widen a feature/change request into a whole-product plan.
17. Separate:
   - required outcome;
   - established current reality;
   - hard constraints / already-fixed decisions;
   - proposed feature/tool/technology/architecture.
18. If the request starts from a proposed solution, climb upward until the outcome that makes the solution worth considering is understood. Do not challenge a genuinely fixed constraint merely to create artificial alternatives.
19. Follow the installed S&T Framework Rules automatically:
   - use target-repository context progressively;
   - build/update `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, and `.planning/STATUS.yaml`;
   - challenge every material root/lower-level Tactic at the depth justified by its impact, including materially plausible alternatives and invalidating assumptions;
   - keep ordinary local reasoning in TREE assumptions and only material unresolved choices/unknowns in DECISIONS;
   - use necessity/sufficiency to determine children and continue until leaves are decision-complete and practical for executor chats;
   - do not implement target-project work while planning;
   - continue until the complete intended planning scope passes Final Planning Review;
   - record reviewed baseline evidence in REVIEWS and verify no material GOAL/TREE/DECISIONS drift before freeze;
   - freeze only that reviewed baseline with `cycle_state: active` and implementation still unauthorized;
   - populate EXECUTION with numbered executor-chat assignments based on implementation context/dependencies/workload;
   - run `node .planning/validate-allocation.mjs --initial` and fix authoritative failures;
   - run the repository-only execution/handoff verification from `.planning/EXECUTOR_HANDOFF.md`;
   - explicitly authorize implementation only after those gates pass;
   - during execution, treat every CI warning/error as the mandatory RCA gate defined in `.planning/CI-RCA-POLICY.md` before further progress;
   - after required execution is done, run Cycle Closure Review before marking the cycle `completed`.
20. Investigate repository context/evidence before asking the user. Make planner-owned product/technical choices yourself when the goal, constraints, evidence, and tradeoffs support a responsible choice. Ask only for a genuinely user-owned material preference/constraint or material fact that cannot be established reliably and can change the plan.

## Safety against accidental overwrite

**Ordinary reuse/continuation of the same cycle overwrites nothing from source templates** under `.planning/` and does not append another S&T rules block to `AGENTS.md`.

An active S&T planning/execution state is project data. Never replace `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, or `.planning/EXECUTION.yaml` from source templates during ordinary reuse or framework upgrade.

A permitted **new-cycle transition** may intentionally reinitialize only those six current-cycle files after the prior cycle is terminal. It does not reinstall/upgrade framework tooling.

Framework-managed files are refreshed only during an explicit framework upgrade and only according to `FRAMEWORK_RELEASE.json`. Root `AGENTS.md` is never wholesale-owned by S&T Planner; upgrade only the S&T rules block.

## Normal execution after planning

Once `.planning/STATUS.yaml` has all of:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

run the framework freshness check before starting a numbered executor, then derive runnable executor chat ID(s) from `EXECUTION.yaml` and TREE `depends_on`.

For each runnable chat, the preferred explicit startup command is:

> אני צאט N תתחיל

Established forms such as `אני צ'אט מספר N` / `I am chat N` remain valid.

Chat allocation is not chat activation. A target-owned pointer may say Chat N is current, but a conversation becomes Chat N only after explicit startup. Pointer drift never changes conversation identity automatically and, by itself, is only a warning/projection-repair concern.

If an executor conversation emits `[[SEQUENCE_RUNNER_NEW_CHAT]] ... [[/SEQUENCE_RUNNER_NEW_CHAT]]`, a subsequent generic `תמשיך לשלב הבא` / `continue` must not silently bootstrap the next executor. Explicit `אני צאט N תתחיל` is required to bootstrap/re-bootstrap it.

A `completed` or `abandoned` cycle never authorizes execution.
