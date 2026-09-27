# Planning Reviews

This file is audit history. It records what was checked, what failed, and what was corrected.

It is **not** the source of truth for open questions or current state. If a review discovers a material unresolved question, create/reference a D-ID in DECISIONS.md.

## Planning review template

### R-001 — YYYY-MM-DD — Node/Scope

**Result:** pass | changes-required

**Gates checked:**
- goal clarity
- step validity
- necessity
- sufficiency
- assumption honesty
- KISS
- executability
- tree-state consistency
- planning fresh-session continuity

**Findings:**
- None / TBD

**Corrections made:**
- None / TBD

**Opened/referenced decisions:**
- None / D-XXX

## Post-allocation fresh-chat handoff review

Before `implementation_authorized: true`, record a dedicated review that simulates repository-only fresh executors according to `EXECUTOR_HANDOFF.md`.

### R-XXX — YYYY-MM-DD — Fresh-chat executor handoff

**Result:** pass | changes-required

**Representative scenarios checked:**
- first available executor
- dependency-blocked early executor
- mid-plan executor with multiple dependencies
- final closure executor

For each scenario, record whether the executor could determine:
- authorization;
- assigned nodes;
- prerequisite states;
- first available node, or that none is available;
- exact next contract/project context to load;
- factual blocker when unavailable.

If the allocation is too small to contain a literal example of one scenario, record the closest real assignment used for the non-mutating simulation.

**Findings:**
- None / TBD

**Corrections made:**
- None / TBD

Any failure is `changes-required` and keeps implementation unauthorized until corrected and rechecked.
