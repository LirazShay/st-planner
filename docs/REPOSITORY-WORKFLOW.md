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

## 10. External/user acceptance comes after executor-owned closure by default

User/target-machine/provider acceptance must not become an accidental mid-development gate.

If acceptance requires the user's machine, private credentials/session state, provider permission, hardware, or user-only judgment, continue all independent implementation and verification that the executor can honestly perform without that evidence.

Before asking the user to test, exhaust the relevant executor-owned proof as far as practical, including whichever families apply:

```text
focused/unit proof
→ service/integration proof
→ deterministic fake/synthetic proof
→ adversarial/fault/security proof
→ Browser/UI composition
→ bounded workload/performance sanity
→ regression/reclosure suites
→ final diff review
→ PR + required CI green
→ merge
→ default-branch/main CI green
→ open-PR/repository audit
```

Synthetic/fake/CI proof never masquerades as real external PASS, but missing external PASS also does not freeze independent implementation work.

### 10.1 Prepare the user's acceptance guide as part of engineering completion

When external/user acceptance will remain after merge, the executor must prepare a durable target-repository acceptance guide or runbook **before** declaring the implementation/repository work complete.

The guide should be specific enough that the user can execute it later without reconstructing prior chats. Include, where relevant:

1. **Purpose and scope** — what real-world boundary the user is proving and what the test does not prove.
2. **Exact candidate rule** — how to identify the intended merged/default-branch commit or release; never rely on an obsolete PR head.
3. **Prerequisites** — required software, services, credentials/session state, provider permissions, market state/timing, hardware, data, and safe defaults.
4. **Setup/preflight** — deterministic checks that should pass before the real external action begins.
5. **Step-by-step test journey** — explicit actions in a safe order, with dangerous or mutating actions clearly separated and requiring deliberate user initiation where applicable.
6. **Expected observations** — what the user should see at each material checkpoint.
7. **PASS criteria** — objective conditions that close the acceptance item.
8. **FAIL/stop criteria** — exact symptoms that mean stop, do not continue, and return evidence for RCA.
9. **Evidence to retain** — public-safe report/log/artifact names and the minimum information needed to bind evidence to the candidate.
10. **Privacy/security rules** — credentials, cookies, session/auth data, account identifiers, private browser state and raw authenticated dumps must never be copied into repository evidence unless the target's security contract explicitly allows a safe derived form.
11. **Cleanup/recovery** — how to stop/restore safely after success, failure or interruption.
12. **Known limitations / pending families** — what remains unproven even after PASS.
13. **Failure handoff** — what the user should provide back so the executor can perform RCA without asking them to reproduce unnecessary sensitive material.

Test the runbook itself as far as possible before handoff: commands should exist, deterministic preflights/verifiers should be exercised, fake/synthetic equivalents should be green where they are meaningful, and the guide should not depend on hidden chat context.

Do not ask the user to perform acceptance merely to discover defects that deterministic executor-owned tests could have found first.

### 10.2 Completion semantics

When implementation, executor-owned verification, diff review, merge, default-branch/main CI, repository audit, and the durable acceptance guide are complete, external/user acceptance may remain as the **only** separate post-merge item.

At that point the executor may report the implementation work as finished. The user can perform the documented acceptance later at their convenience while unrelated development continues.

If the current target plan accidentally embeds such external acceptance as an intermediate gate even though no remaining implementation/design decision truly depends on it, treat that as a local planning defect: split/defer the external acceptance into an explicit post-merge task and continue independent work. Do not silently bypass a real prerequisite; repair the plan/execution truth first.

If later user acceptance finds a defect, reopen the smallest affected area, perform RCA → fix → regression/affected verification → reclosure, and update the acceptance guide when the failure exposed a missing/unclear check.
