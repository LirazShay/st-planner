# Decisions

### D-001 — Handling unknown CSV columns

**Status:** decided

**Related S&T node:** 0.1.1

**Question:**  
Should unknown columns be ignored or rejected in V1?

**Options considered:**
- Ignore unknown columns.
- Reject files containing unknown columns.

**Decision:**  
Reject unknown columns in this example.

**Why:**  
The example goal emphasizes predictable interpretation. Silent ignoring creates a plausible case where the user believes submitted data was imported when the system discarded it.

**What would reopen this decision:**  
A product requirement for forward-compatible files or explicitly ignorable extension columns.
