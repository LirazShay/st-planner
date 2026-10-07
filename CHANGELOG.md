# S&T Planner Changelog

## 2.0.0 — Unreleased

Major simplification redesign: preserve deep S&T reasoning and lightweight execution management while removing framework-owned workflow machinery that had become costly to maintain and operate.

### Changed

- Target repositories now store project-owned planning state instead of an installed copy of ST Planner.
- Default durable planning state is `.planning/PLAN.md` + `.planning/EXECUTION.md`; `STATUS.md` and `DECISIONS.md` are optional only when they solve a real continuity/readability need.
- Implementation-ready S&T leaves are the execution tasks; execution tracking keeps only owner, status, real prerequisites, and short result/evidence.
- Numbered chats remain supported as execution owners, but chat activation is an explicit convention rather than an authority/state-machine mechanism.
- CI warnings/errors remain learning signals that require proportionate RCA; they no longer trigger planner authorization/freeze state transitions automatically.
- Replanning now follows the Planning Impact Test: ordinary implementation defects stay local, bounded planning gaps update only the affected area, and only material plan invalidation reopens affected S&T reasoning.

### Added

- `docs/EXECUTION-MANAGEMENT.md` as the lightweight execution-management contract.
- `templates/PLAN.md`, `templates/EXECUTION.md`, and optional `templates/STATUS.md` / `templates/DECISIONS.md`.
- Permanent anti-bureaucracy rules: Process ROI, burden of proof for new process mechanisms, and “model the work, not the management of the work.”
- A complete ST Planner 2.0 worked example under `examples/csv-import/` using only `PLAN.md` + `EXECUTION.md` for planning/execution state.

### Removed

- Framework installation/update package machinery: `FRAMEWORK_RELEASE.json`, installed provenance/integrity metadata, update checker, root-rules injection, release-discipline script, and framework-update CI.
- Freeze/unfreeze, global implementation authorization, no-drift verification, allocation validation, mandatory fresh-chat handoff simulations, lifecycle state machine, and related executor scripts.
- Legacy installed-project bundle under `templates/project/` and tests whose only purpose was to protect the removed V1 machinery.
- Superseded V1 planning/execution/lifecycle/update documents after their durable reasoning lessons were consolidated into the new methodology and execution-management contracts.

### Migration from 1.x

Do not overwrite legacy planning state blindly. Consolidate live planning truth into `PLAN.md`, convert live assignments/progress into `EXECUTION.md`, preserve material decisions, verified `done` work, real dependencies and blockers, then remove process-only V1 state/machinery after checking the replacement for completeness. Git history remains the audit trail for old review/process history.

## 1.1.1 — 2026-10-07

Upgrade-preservation hardening release.

### Added

- Mandatory pre-upgrade divergence/customization audit before replacing any framework-managed target file.
- Older versioned installations without `managed_integrity` use their exact installed `source_commit` as the historical baseline; current target managed files are compared with the source files they originally came from before overwrite.
- Explicit migration rule for legitimate target-owned customization found inside an old managed file: move it first into target-owned durable routing/contracts, verify equivalent behavior, then restore the framework-managed file to exact release bytes.
- `release_sensitive_source_paths` in `FRAMEWORK_RELEASE.json` so source upgrade contracts such as `BOOTSTRAP.md` and `docs/FRAMEWORK-UPDATES.md` cannot materially change without a forward framework version and changelog entry.

### Why this release exists

A real external-project pilot found that an older target had intentionally preserved a project-specific routing appendix inside `.planning/EXECUTOR_HANDOFF.md`. Blindly replacing that managed file during the 1.1.0 upgrade would have deleted valid target behavior. Version 1.1.1 makes that class of loss a pre-upgrade blocker instead of relying on the upgrader to notice it manually.

### Upgrade note

Upgrade is **required**. Before managed-file replacement, audit the current installation against its installed integrity metadata or, for 1.0.0-style metadata, against the exact historical source commit. Preserve/migrate every legitimate target customization first. The six current-cycle state files remain byte-for-byte protected, and `ST_PLANNER_INSTALL.json` is still written last.

## 1.1.0 — 2026-10-07

Update-path hardening release.

### Added

- Source release-discipline CI: distributed framework changes cannot merge without a forward framework version and matching changelog entry.
- Offline integrity metadata for every framework-managed `.planning` file plus the bounded root `AGENTS.md` S&T rules block.
- Deterministic `st-planner:rules:v3:begin/end` markers so upgrades can replace only the framework-owned block while preserving target-native rules before and after it.
- Explicit checker exit codes: `2` for a required framework update/reconciliation and `3` for damaged, missing, or drifted installed framework integrity.
- Ownership classification gate: every `.planning` template file must be exactly one of protected cycle state, framework-managed material, or install metadata.

### Changed

- Required framework updates now return non-zero outside GitHub Actions too; an interactive/local executor cannot mistake a required update for success merely because it is not running in CI.
- The checker verifies all installed framework-managed files and the bounded root rules before contacting the source. If the source/network is unavailable, it reports freshness as unverified rather than claiming current while still proving the installed framework has not drifted locally.
- Source and installed release metadata carry managed-file Git blob IDs. Even if source release discipline were accidentally bypassed and source content changed without a version bump, a same-version integrity mismatch is treated as a required reconciliation.
- `ST_PLANNER_INSTALL.json` is explicit install metadata, not a normally copied framework-managed file during upgrade; it is written last so a partial upgrade cannot claim completion.
- Root S&T rules are intentionally compact and route detailed behavior to the installed `.planning` contracts, reducing duplicated instructions while keeping the update gate at the repository entry point.

### Upgrade note from 1.0.0

Upgrade is **required**. Preserve all six current-cycle state files byte-for-byte. Before replacing framework-managed files, follow the latest upgrade contract and audit pre-existing local divergence/customization against the installed historical source. Migrate the old `st-planner:rules:v2` block to the bounded v3 block using the exact prior source snippet, then write `ST_PLANNER_INSTALL.json` last with the new managed-integrity/provenance data. Require `node .planning/check-framework-update.mjs` to exit `0` and report current before continuing S&T work.

## 1.0.0 — 2026-10-07

First versioned framework release.

### Added

- Mandatory RCA gate for every CI warning or error before implementation may continue.
- RCA requires root cause, escape/prevention cause, systemic recurrence prevention, analogous-area search, and closing evidence.
- Explicit user-facing requirement to state that a local symptom fix alone is not closure.
- Framework release manifest (`FRAMEWORK_RELEASE.json`).
- Installed-project provenance metadata (`.planning/ST_PLANNER_INSTALL.json`).
- Zero-dependency installed-project update checker (`.planning/check-framework-update.mjs`).
- Explicit framework upgrade contract that updates framework-managed files only and never overwrites active cycle state.

### Clarified

- Project-owned current chat/node pointers are projections, not S&T execution authority.
- Projection drift should be diagnosed/repaired but must not by itself be a generic hard CI failure.

### Upgrade note for older installations

Repositories installed before 1.0.0 are unversioned legacy installations. They require one explicit framework upgrade from `LirazShay/st-planner`. After that upgrade, the installed checker can detect later framework releases automatically.
