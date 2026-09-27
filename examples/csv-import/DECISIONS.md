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


### D-003 — Structural-error continuation policy

**Status:** open

**Related S&T node(s):** 0.1.2, 0.2, 0.3

**Question:**  
If a CSV file contains a structural parsing error, does V1 reject the whole import, allow structurally valid rows to continue, or apply another explicit rule?

**Why it matters:**  
The current tree can detect structural errors, but it does not yet define whether any candidate rows from the same import may continue to validation/persistence. Without this rule, every local branch could succeed while the root safety/predictability outcome remains ambiguous.

**Options considered:**
- Reject the entire import when any structural error exists.
- Continue only structurally valid rows and report rejected rows.
- Another explicit product/domain rule.

**Resolution:**  
Open.

**Resolution basis / rationale:**  
The existing project state does not define the intended atomicity/continuation behavior for structural file errors.

**What would reopen this:**  
Not applicable while open. Once resolved, reopen if import atomicity/error-handling requirements change.
