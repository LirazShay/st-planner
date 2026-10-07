# S&T Planner Changelog

## 1.1.0 — 2026-10-07

Update-path hardening release.

### Added

- Source release-discipline CI: distributed framework changes cannot merge without a forward framework version and matching changelog entry.
- Offline integrity metadata for the two pieces that make future updates discoverable: the installed freshness checker and the bounded root `AGENTS.md` S&T rules block.
- Deterministic `st-planner:rules:v3:begin/end` markers so upgrades can replace only the framework-owned block while preserving target-native rules before and after it.
- Explicit checker exit codes: `2` for a required framework update/reconciliation and `3` for damaged or drifted freshness-path integrity.

### Changed

- Required framework updates now return non-zero outside GitHub Actions too; an interactive/local executor cannot mistake a required update for success merely because it is not running in CI.
- The checker verifies local freshness-path integrity before contacting the source. If the source/network is unavailable, it reports freshness as unverified rather than claiming current, while still proving the local update detector/rules block have not drifted.
- Root S&T rules are intentionally compact and route detailed behavior to the installed `.planning` contracts, reducing duplicated instructions while keeping the update gate at the repository entry point.

### Upgrade note from 1.0.0

Upgrade is **required**. Preserve all six current-cycle state files byte-for-byte. Replace framework-managed `.planning` files from one resolved source commit, migrate the old `st-planner:rules:v2` block to the bounded v3 block using the exact prior source snippet when possible, write `ST_PLANNER_INSTALL.json` last, then require `node .planning/check-framework-update.mjs` to exit `0` and report current.

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
