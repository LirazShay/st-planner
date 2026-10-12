# ST Planner — Default Repository Workflow

## Purpose

This document defines the default repository-working contract for a target repository using ST Planner.

The goal is that a user can say “use ST Planner on this repository” and the agent can plan and execute with a strong default engineering workflow without copying generic framework rules into every target repository.

Target-repository rules remain authoritative for target-specific constraints and explicit overrides. Do not duplicate these defaults into the target merely so they are locally present.

## 1. Authority and target overrides

Use this precedence:

1. explicit user instruction for the current task;
2. target-repository rules and durable product/architecture/security contracts;
3. this ST Planner repository-workflow default;
4. ordinary tool/environment conventions.

A target `AGENTS.md` or equivalent should normally contain only target-specific rules, exceptions and routing needed by that repository. It does not need to restate generic ST Planner workflow defaults.

Do not create duplicate authorities for the same generic rule. If a target intentionally overrides a framework default, state the delta clearly.

## 2. Repository source of truth

The target repository's canonical remote/default branch is the durable source of truth unless the target explicitly defines another authority.

Chat history, summaries, temporary workspaces, local/sandbox files and generated artifacts are working context/cache, not independent repository truth.

Before changing repository content:

1. inspect the current repository branch/head and relevant status;
2. read the target's `AGENTS.md` or equivalent when present;
3. read the target `README.md` and relevant durable contracts;
4. fetch the latest version of files that will be changed;
5. preserve the current base/SHA and do not overwrite unreviewed changes.

After writing, re-fetch or compare the affected repository state and verify the expected diff/content.

## 3. Default implementation path

Unless the target explicitly requires another workflow, use:

```text
fresh repository truth
→ focused feature branch
→ implementation + focused verification
→ review resulting diff
→ pull request
→ required CI green
→ squash merge
→ verify merged/default-branch state
```

Rules:

- do not make ordinary implementation directly on the default branch;
- keep one coherent outcome per PR when practical;
- run targeted/local checks before pushing when equivalent checks are available;
- CI is an independent verification/gating mechanism, not the primary editing/debugging loop;
- merge only after required checks are green and the final diff is coherent.

A target repository may legitimately define stricter release sequencing, merge methods, required checks or acceptance gates; those target-specific rules override these defaults.

## 4. CI is verification, not a code editor

Do not create or modify a temporary CI workflow whose purpose is to edit/patch repository files, generate an ordinary development commit, or transport implementation changes that should be made through normal repository editing.

Do not use repeated `push → CI → patch → push` cycles as the normal debugging loop when equivalent verification can run before pushing.

A repository workflow may write repository contents only when that write behavior is an intentional product/automation feature of the repository itself. Do not use that exception as a workaround for ordinary editing.

## 5. Tool and connector failures

A limitation of one temporary execution environment does not prove that the repository capability is unavailable.

If a sandbox lacks `git push`, network access, credentials or another shell capability, first use the normal configured repository connector/tool path.

Do not switch to ad-hoc Base64 transport, Git object packs, temporary CI patch workflows, remote workspaces or another alternate transport merely because the current sandbox is limited.

If one repository write is blocked — especially a large-file replacement — do not infer that repository access is broken. Keep the normal repository workflow and make the change smaller/more focused when practical. Confirm the concrete blocker before changing the workflow itself.

## 6. Recovery after interruption or context loss

After chat interruption, compaction, handoff, restart or recovery from a summary, re-establish repository truth before continuing:

1. re-read the target `AGENTS.md` or equivalent when present;
2. re-read the target `README.md` and relevant durable project state;
3. inspect current branch/head and open/in-progress repository work;
4. re-read the relevant code/contracts from the repository;
5. verify any prior local artifacts against the current repository base before reusing them.

If remembered/local state disagrees with the repository, the repository wins; reconcile before editing or pushing.

Fresh-chat recoverability should come from durable repository state rather than transcript dependence.

## 7. Failure/RCA discipline

When CI, tests or a meaningful warning report a failure, do not patch only the surfaced symptom and immediately continue.

Establish proportionately:

1. the exact failing evidence/state;
2. what happened and why;
3. the causal root;
4. why prevention/detection did not catch it earlier when relevant;
5. whether materially analogous areas share the weakness;
6. the smallest correct-layer fix;
7. a reasonable regression/prevention improvement when justified;
8. closing verification evidence.

Scale the investigation to the signal. Trivial/transient infrastructure noise does not justify disproportionate ceremony, but evidence of a systemic weakness must not be waived with a local-only symptom fix.

If the failure materially invalidates planning, use the Planning Impact Test and repair only the affected planning area before coding forward.

## 8. Engineering defaults

Prefer KISS and deterministic behavior.

Before adding a file, framework, dependency, service, validator, workflow, state field or other mechanism, ask whether an existing simpler mechanism prevents the real failure sufficiently.

Change the narrowest correct layer. Do not refactor merely for aesthetics; require concrete maintainability, testing, reliability, performance or product value.

When the user asks only for planning, do not implement. When implementation is requested and repository tools allow it, make the change in the repository rather than asking the user to copy ordinary changes manually.

## 9. Relationship to ST Planner planning/execution

This repository workflow complements, rather than duplicates, S&T planning and lightweight execution management:

- `docs/SNT-METHODOLOGY.md` owns planning/reasoning;
- `docs/EXECUTION-MANAGEMENT.md` owns task allocation/status/dependencies/results;
- this file owns default repository engineering workflow.

Target repositories store their project planning data and target-specific contracts. They do not need copied framework runtime or duplicated generic ST Planner policy.
