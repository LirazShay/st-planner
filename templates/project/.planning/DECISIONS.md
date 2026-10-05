# Decisions and Open Questions

This file is the single source of truth for material unresolved questions and their eventual resolutions within the current planning scope.

Use an entry when an unknown or choice can materially change the plan. Typical sources include:
- a user/product choice;
- research or an external fact;
- a technical or architectural decision;
- a materially plausible alternative to a proposed feature/tactic.

Do **not** create a D-entry for every tactic or ordinary local reasoning. If the selected tactic is clear under established facts/constraints and no material unresolved alternative remains, keep its justification in `TREE.yaml -> parallel_assumptions`.

A material choice belongs here when getting it wrong could significantly change the tree, product behavior, architecture, cross-cutting constraints, implementation scope, or costly-to-reverse work.

An `open` decision does not automatically block planning. Mark an affected TREE node `blocked` only when continuing would require guessing or would create a materially different subtree depending on the resolution.

Do not duplicate the unresolved question in GOAL or REVIEWS.

Before freeze, every live unresolved classification/question must still be real:
- `open` means materially unresolved now;
- resolved questions must be marked `resolved` with the resolution recorded;
- replaced questions must be `superseded`;
- stale `INVESTIGATE`, `TBD`, `OPEN`, or equivalent live markers must not remain in active planning/contracts after the underlying question is resolved.

For alternatives, record only options that were materially plausible enough to affect the choice. Do not preserve every brainstormed possibility.

Definitions, legends, examples, historical notes, and quoted source material are not live unresolved markers merely because they contain words such as `TBD` or `INVESTIGATE`.

## Template

### D-001 — Question title

**Status:** open | resolved | superseded

**Related S&T node(s):** TBD

**Question:**  
TBD

**Why it matters:**  
TBD

**Options considered (only when useful):**
- TBD

**Resolution:**  
TBD

**Resolution basis / rationale:**  
TBD

**What would reopen this:**  
TBD
