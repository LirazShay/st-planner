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
- durable contract vs live status hygiene
- stale decision / investigation cleanup
- planning fresh-session continuity

**Findings:**
- None / TBD

**Corrections made:**
- None / TBD

**Failure learning (only for meaningful unexpected failures):**
- technical root cause: None / summary
- reasoning/process cause: None / summary
- escape cause: None / summary
- local fix + regression proof: None / summary
- smallest reusable prevention: None / summary

**Opened/referenced decisions:**
- None / D-XXX

**Durable contract hygiene (Final Planning Review when applicable):**
- durable specs/README checked: None / paths
- live progress duplicated in durable contracts: None / findings
- moved/removed stale live-status text: None / paths
- target status/review owner used instead: None / path

**Stale decision / investigation cleanup (Final Planning Review):**
- open D-entries revalidated: None / IDs
- stale resolved/superseded entries corrected: None / IDs
- stale live `INVESTIGATE`/`TBD`/`OPEN` markers removed or reclassified: None / paths
- genuine unresolved blockers remaining: None / D-IDs + nodes

## Final Planning Review freeze-baseline evidence

When a review is the **Final Planning Review**, record enough evidence to prove that the baseline frozen afterward is the baseline that actually passed review.

**Reviewed baseline:**
- evidence: Git commit/ref/tree hash or equivalent immutable/reproducible evidence
- default material files: `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`
- additional material files, if the review explicitly covered them: None / paths

**Freeze no-drift verification:**
- method: `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>` | provider compare | equivalent
- compared reviewed baseline to: working tree | frozen ref/commit | equivalent
- result: pass | changes-required
- drift found: None / paths

If any material baseline file changes after Final Planning Review, that review no longer authorizes freeze. Review the changed baseline again and record new baseline evidence.

If a merge/rebase/integration step creates a different frozen ref after an earlier pass, repeat no-drift verification against that resulting ref before execution allocation/handoff.

## Post-allocation fresh-chat handoff review

Before `implementation_authorized: true`, first require a passing allocation validator, then record a dedicated review that simulates repository-only fresh executors according to `EXECUTOR_HANDOFF.md`.

### R-XXX — YYYY-MM-DD — Fresh-chat executor handoff

**Result:** pass | changes-required

**Allocation validation:**
- command/mode: `node .planning/validate-allocation.mjs --initial` | `--resume` | optional `--serial-chats`
- result: pass | changes-required

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
