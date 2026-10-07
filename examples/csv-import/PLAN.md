# Plan — Safe CSV Import

> Worked ST Planner 2.0 example. The domain choices below are explicit example decisions, not universal CSV-import rules.

## Outcome

Users can import supported customer CSV files into the existing backend service safely and predictably.

## Relevant current reality

- The backend service already exists.
- Customer records can already be created through existing application logic.
- There is no CSV import flow yet.
- Authentication and authorization are existing system responsibilities and are outside this change.
- Existing customer-domain validation remains authoritative.

## Constraints / non-goals

### Constraints

- Reuse existing customer creation rules where possible.
- Do not introduce a new persistence system.
- The import must not bypass existing domain validation.
- The example favors deterministic, conservative V1 behavior over permissive recovery semantics.

### Non-goals

- Spreadsheet formats other than CSV.
- Background job infrastructure.
- Bulk-import analytics.
- UI design.
- Duplicate merge/update behavior.

## Material decisions

### D-001 — Unknown CSV columns

**Decision:** reject files containing unknown columns.

**Why:** silently ignoring submitted data would conflict with predictable interpretation.

**Reopen when:** the product explicitly supports extension/ignorable columns.

### D-002 — Duplicate customers

**Decision:** reject a candidate that matches an existing customer under the domain identity rules.

**Why:** merge/update semantics are materially different behavior and are outside this V1 scope. Rejecting avoids silently mutating an existing customer while keeping the behavior deterministic.

**Reopen when:** the product defines explicit update/merge semantics.

### D-003 — Structural CSV errors

**Decision:** any structural parsing error rejects the whole file before customer persistence begins.

**Why:** continuing only some rows after a structurally invalid file would add partial-file semantics and make the safety/predictability contract harder to reason about.

**Reopen when:** partial structural recovery becomes an explicit product requirement.

### D-004 — Persistence atomicity

**Decision:** an import batch is all-or-nothing. Persistence begins only after the complete file is structurally valid and every candidate is admissible; all accepted records commit in one transaction or none commit.

**Why:** this prevents an ambiguous partially persisted import and matches the stated safety/predictability outcome.

**Reopen when:** the product explicitly requires partial-success imports.

### D-005 — Result contract

**Decision:** the response distinguishes success from rejection/failure, reports imported count on success, and reports structural or row-level validation errors on failure. A failed/rejected batch reports zero persisted records.

**Why:** the caller must be able to determine what happened without inferring state from side effects.

**Reopen when:** asynchronous processing or partial-success semantics are introduced.

---

# S&T reasoning

## 0 — Safe and predictable customer CSV import

**Strategy**  
Users can import supported customer CSV files safely and predictably.

**Tactic**  
Process each upload through one bounded import workflow that interprets input deterministically, blocks invalid data before writes, persists an accepted batch atomically, and returns a deterministic result.

**Why this tactic**  
The service already owns customer creation and validation behavior, so a bounded orchestration flow can reuse existing domain logic instead of creating a second customer-writing subsystem. The chosen tactic keeps CSV-specific concerns at the boundary and preserves existing domain authority.

**Children sufficient because**  
If input is interpreted consistently, unsafe/invalid candidates cannot reach persistence, an accepted batch cannot partially commit, and the caller can determine the outcome, the import-specific conditions required by the root outcome are covered. Existing authentication, service availability, and customer-domain rules are already-satisfied surrounding conditions rather than new import work.

**Success evidence**
- supported valid files create the expected customer records;
- structurally invalid files create none;
- domain-invalid or duplicate candidates cause the batch to create none;
- persistence failure leaves no partial imported batch;
- the caller receives a deterministic success/failure result consistent with stored state.

**Children**
- 0.1 — Deterministic input interpretation
- 0.2 — Invalid/unsafe data cannot reach persistence
- 0.3 — Accepted data persists atomically
- 0.4 — Caller receives a deterministic outcome

---

## 0.1 — Deterministic input interpretation

**Strategy**  
Supported CSV input is recognized and interpreted consistently.

**Tactic**  
Define one explicit CSV import contract and parse uploads only according to that contract.

**Why this tactic**  
A stable import contract prevents different implementations or sessions from inventing different interpretations of the same file.

**Necessary for parent**  
Without deterministic interpretation, later validation and persistence cannot reliably know what data the user submitted.

**Children sufficient because**  
An explicit supported-input contract plus a parser that applies it is enough to turn accepted CSV text into structured candidate rows or reject the file structurally.

**Success evidence**
- the same supported file yields the same candidate rows;
- malformed/unsupported files yield the same structural errors;
- unknown columns are rejected as specified by D-001.

**Children**
- 0.1.1 — Define supported CSV contract
- 0.1.2 — Parse and structurally validate the upload

### 0.1.1 — Define supported CSV contract

**Strategy**  
The supported CSV shape is unambiguous.

**Tactic**  
Specify required/optional columns, data types, encoding expectations, structural limits, unknown-column behavior, and structural error rules.

**Why this tactic**  
The parser needs a stable definition of supported versus unsupported input before implementation can be deterministic.

**Necessary for parent**  
Without a contract, parsing behavior has no authoritative interpretation target.

**Success evidence**
- a reviewer can classify representative files as supported or unsupported from the written contract alone.

### 0.1.2 — Parse and structurally validate the upload

**Strategy**  
A supported upload becomes structured candidate rows, while a structurally invalid upload is rejected before candidate processing.

**Tactic**  
Implement a CSV parser that applies the contract, returns structured candidates for a structurally valid file, and returns structural errors with no candidates eligible for persistence when the file is invalid.

**Why this tactic**  
Existing customer creation logic requires structured candidate data rather than raw CSV text. D-003 deliberately avoids partial structural recovery.

**Necessary for parent**  
The contract alone does not transform uploaded bytes into deterministic candidate data or structural errors.

**Success evidence**
- parser tests prove supported files yield expected candidates;
- malformed/unsupported files yield structural errors;
- a structural error prevents the file from entering candidate validation/persistence.

---

## 0.2 — Invalid or unsafe data cannot reach persistence

**Strategy**  
Invalid or unsafe candidate data cannot create customer records.

**Tactic**  
Define one admissibility policy, evaluate every candidate against it, and enforce the result at the persistence boundary.

**Why this tactic**  
Existing domain validation should remain authoritative. Import-specific rules are needed only where CSV import introduces concerns not already expressed by the customer domain, including duplicate handling from D-002.

**Necessary for parent**  
Deterministic parsing does not prove that candidate customer data is valid or safe to store.

**Children sufficient because**  
If admissibility is explicitly defined, every candidate receives a result, and writes require a passing result, invalid/unsafe candidates cannot reach persistence.

**Success evidence**
- invalid or duplicate candidate data produces no customer write;
- unevaluated/rejected candidates cannot bypass the persistence gate.

**Children**
- 0.2.1 — Define admissibility policy
- 0.2.2 — Evaluate every candidate
- 0.2.3 — Enforce admissibility at the write boundary

### 0.2.1 — Define admissibility policy

**Strategy**  
The import has an unambiguous definition of admissible customer data.

**Tactic**  
Combine existing customer-domain validation with only the import-specific rules required by the CSV flow, including duplicate rejection from D-002.

**Why this tactic**  
Reusing domain validation avoids a second divergent validation system while still making import-only rules explicit.

**Necessary for parent**  
Without a defined policy, candidate evaluation cannot consistently decide pass/fail.

**Success evidence**
- representative candidates can be classified as admissible/inadmissible from the policy and existing domain rules.

### 0.2.2 — Evaluate every candidate

**Strategy**  
Every candidate has a deterministic admissibility result before persistence.

**Tactic**  
Evaluate every structured candidate against the approved admissibility policy and retain its pass/fail result and validation errors.

**Why this tactic**  
A structurally valid row can still violate customer-domain or import-specific rules.

**Necessary for parent**  
A written policy alone does not determine whether a specific candidate passes.

**Success evidence**
- tests show every candidate receives a deterministic result and relevant validation errors.

### 0.2.3 — Enforce admissibility at the write boundary

**Strategy**  
A candidate that failed or skipped admissibility evaluation cannot be written as a customer.

**Tactic**  
Make the import persistence path accept only a batch whose candidates all carry passing admissibility results.

**Why this tactic**  
Validation that can be ignored or bypassed does not protect stored customer data.

**Necessary for parent**  
Even correctly evaluated candidates could still be persisted if the write path does not enforce the result.

**Success evidence**
- persistence-boundary tests prove rejected or unevaluated candidates cannot create customer records.

---

## 0.3 — Accepted data persists atomically

**Strategy**  
An accepted import batch is persisted without an ambiguous partial outcome.

**Tactic**  
Establish complete batch eligibility before the first write, then persist the entire eligible batch through existing customer creation logic inside one transaction.

**Why this tactic**  
D-004 makes all-or-nothing persistence part of the example contract. The existing creation logic remains authoritative, while the transaction provides batch atomicity.

**Necessary for parent**  
Interpreting and validating data is insufficient unless accepted records are actually committed under defined failure semantics.

**Children sufficient because**  
If eligibility for the whole batch is known before writing and all writes commit or roll back together, no accepted import can leave an ambiguous partial batch.

**Success evidence**
- a fully admissible batch creates all expected records;
- any validation failure causes zero imported records;
- an injected write failure rolls back the entire imported batch.

**Children**
- 0.3.1 — Establish whole-batch eligibility before writes
- 0.3.2 — Persist the eligible batch transactionally

### 0.3.1 — Establish whole-batch eligibility before writes

**Strategy**  
The workflow knows the complete batch is eligible before any customer write begins.

**Tactic**  
Require successful structural parsing and passing admissibility results for every candidate before opening the import transaction.

**Why this tactic**  
Starting writes before the complete batch result is known would reintroduce avoidable partial-success behavior.

**Necessary for parent**  
A transaction can roll back write failures, but beginning persistence before validation completes unnecessarily mixes validation and mutation.

**Success evidence**
- tests prove no import write starts until structural parsing and all candidate evaluations have passed.

### 0.3.2 — Persist the eligible batch transactionally

**Strategy**  
All records in an eligible import batch commit together or none commit.

**Tactic**  
Invoke the existing customer-creation path for the eligible candidates inside one transaction and roll back on any write failure.

**Why this tactic**  
This preserves existing customer creation behavior while providing the batch atomicity required by D-004.

**Necessary for parent**  
Whole-batch eligibility does not by itself prevent a later persistence failure from leaving only part of the batch stored.

**Success evidence**
- success commits every expected customer;
- an injected failure during the batch leaves none of that batch committed.

---

## 0.4 — Deterministic caller outcome

**Strategy**  
The caller can determine what the import did.

**Tactic**  
Define one import result contract and map every terminal workflow outcome into it.

**Why this tactic**  
D-005 requires the API result to agree with persisted state rather than forcing the caller to infer success from side effects.

**Necessary for parent**  
An import is not predictable to its caller if accepted, rejected, or failed outcomes are opaque.

**Children sufficient because**  
A stable result contract plus complete mapping from terminal workflow outcomes makes every import outcome externally understandable.

**Success evidence**
- success reports the imported count;
- structural failure reports file-level errors and zero writes;
- validation/duplicate failure reports relevant row errors and zero writes;
- persistence failure reports failure and zero committed imported records.

**Children**
- 0.4.1 — Define result contract
- 0.4.2 — Produce the result from terminal workflow state

### 0.4.1 — Define result contract

**Strategy**  
Success and failure outcomes have an unambiguous external representation.

**Tactic**  
Specify the import response shape for success, structural rejection, candidate rejection, and persistence failure, including imported count and relevant error details.

**Why this tactic**  
Without a stable response contract, different code paths can communicate equivalent outcomes inconsistently.

**Necessary for parent**  
The workflow cannot report deterministically without an agreed representation.

**Success evidence**
- representative terminal outcomes can be mapped to exactly one documented response shape.

### 0.4.2 — Produce the result from terminal workflow state

**Strategy**  
Every completed import returns the response that corresponds to what actually happened.

**Tactic**  
Build the response from the structural/admissibility/persistence outcome after the workflow reaches a terminal state.

**Why this tactic**  
Generating the response from the terminal workflow result keeps reported state aligned with persisted state.

**Necessary for parent**  
A documented contract alone does not guarantee every execution path returns the correct result.

**Success evidence**
- integration tests prove each terminal path returns the expected response and matches the resulting database state.

---

# Final planning review

## Outcome boundary

Pass. The plan covers CSV interpretation, safety/admissibility, atomic persistence, and deterministic reporting while leaving authentication, UI, background processing, analytics, and non-CSV formats outside scope.

## Tactic validity / material alternatives

Pass for this worked example. The material policies that previously made the plan ambiguous are now explicit decisions. More permissive alternatives (unknown-column ignore, duplicate merge, partial structural recovery, partial-success persistence) were intentionally not selected because this example prioritizes conservative deterministic V1 behavior.

## Necessity

Pass. Removing any root child would leave one of interpretation, persistence safety, atomic persistence, or caller observability unproven.

## Sufficiency

Pass. Assuming all four root children succeed, the remaining relevant conditions are existing system responsibilities or stated non-goals rather than missing import work.

## Implementation readiness

Pass. The leaves below require implementation choices but no unresolved material product/architecture decision.

## KISS / process check

Pass. The plan uses existing domain/customer creation behavior and one transactional import workflow; it adds no background infrastructure, secondary persistence system, planner-specific validator, or process state machine.

## Unresolved material findings

- None for this worked example.

# Implementation-ready leaves

- 0.1.1
- 0.1.2
- 0.2.1
- 0.2.2
- 0.2.3
- 0.3.1
- 0.3.2
- 0.4.1
- 0.4.2
