# Decisions and Open Questions

### D-001 — Handling unknown CSV columns

**Status:** resolved

**Related S&T node(s):** 0.1.1

**Question:**  
Should unknown columns be ignored or rejected in V1?

**Why it matters:**  
Silent ignoring can make the user believe submitted data was imported when the system discarded it, which conflicts with predictable interpretation.

**Options considered:**
- Ignore unknown columns.
- Reject files containing unknown columns.

**Resolution:**  
Reject files containing unknown columns in this example.

**Resolution basis / rationale:**  
The goal emphasizes predictable interpretation, so silent data loss is not acceptable.

**What would reopen this:**  
A product requirement for forward-compatible files or explicitly ignorable extension columns.

### D-002 — Duplicate-customer policy

**Status:** open

**Related S&T node(s):** 0.2.1, 0.3

**Question:**  
When an import candidate matches an existing customer according to the domain's identity rules, should V1 reject it, update/merge it, or apply another explicit rule?

**Why it matters:**  
The answer changes both candidate admissibility and persistence semantics.

**Options considered:**
- Reject the candidate as a duplicate.
- Update/merge the existing customer.
- Another explicit domain rule supplied by the product owner.

**Resolution:**  
Open.

**Resolution basis / rationale:**  
The persisted project state does not contain enough information to choose responsibly.

**What would reopen this:**  
Not applicable while open. Once resolved, reopen if the product/domain duplicate policy changes.
