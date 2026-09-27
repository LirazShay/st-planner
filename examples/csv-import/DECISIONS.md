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


### D-002 — Duplicate-customer policy

**Status:** open

**Related S&T node:** 0.2.1

**Question:**  
When an import candidate matches an existing customer according to the domain's identity rules, should V1 reject it, update/merge it, or treat the case another way?

**Options considered:**
- Reject the candidate as a duplicate.
- Update/merge the existing customer.
- Another explicit domain rule supplied by the product owner.

**Decision:**  
Open. The planning state does not contain enough information to choose responsibly.

**Why:**  
This policy materially changes which candidate rows are admissible and may also affect the persistence semantics in branch 0.3. A fresh planning session must expose the unknown rather than invent a convenient rule.

**What would close this decision:**  
An explicit product/domain decision defining duplicate-customer behavior for CSV import.
