# S&T Planner Changelog

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
