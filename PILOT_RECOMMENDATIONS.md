# S&T Planner — MarketScope Pilot Recommendations

Status: active backlog / implementation recommendations  
Implemented: P0-1, P0-2, P0-3, P0-4  
Source pilot: `LirazShay/market-scope`  
Pilot date: 2026-09-27

This document captures reusable framework improvements discovered while MarketScope used S&T Planner as a full end-to-end pilot.

It is intentionally a **recommendation backlog**, not an automatic framework expansion. Apply KISS: promote only improvements that generalize beyond this pilot.

## P0 — Recommended before wider reuse

### P0-1 — Separate “plan frozen” from “implementation authorized”

**Pilot finding**

MarketScope needed a safe intermediate state:

```text
plan_state: frozen
+
execution allocation/handoff still being prepared
+
implementation still forbidden
```

Treating `frozen` as immediate permission to code creates a race between freeze, allocation and fresh-chat verification.

**Recommendation**

Add an explicit execution-authorization concept to the portable framework.

Possible minimal forms:

- a separate execution phase/gate in planning state; or
- a target-project root phase when the target already owns one.

Do not force every repository to create a second STATUS file.

**Acceptance**

An executor cannot start merely because `plan_state: frozen`; it must also see explicit implementation authorization.

---

### P0-2 — Make fresh-chat handoff verification mandatory

**Pilot finding**

The framework currently treats fresh-chat continuity as optional. MarketScope found real handoff defects only when simulating a brand-new executor.

Examples found:

- old read-order text bypassed the newly created handoff guide;
- freeze alone was still described as sufficient to start execution;
- context routing was too vague.

**Recommendation**

Promote fresh-chat continuity from optional advice to a required post-allocation gate before implementation starts.

At minimum simulate:

- first available chat;
- one blocked early chat;
- one mid-plan chat with multiple dependencies;
- final closure chat.

**Acceptance**

A new chat can determine from repository state only:

- whether it is authorized;
- its assigned nodes;
- prerequisite states;
- first available node;
- exact contract context to load;
- what blocks it when unavailable.

---

### P0-3 — Add a portable executor handoff bootstrap

**Pilot finding**

`EXECUTION.yaml` + TREE alone were not enough to tell a fresh chat what context to read without overloading the entire repository.

MarketScope added `.planning/EXECUTOR_HANDOFF.md`.

**Recommendation**

Add a small portable handoff template or required handoff section covering:

- authorization gate;
- fresh executor read order;
- dependency check;
- context-routing rules;
- source/reference-repository policy;
- branch/verification rule;
- planning-defect reopening rule.

Keep task content in TREE; do not duplicate Strategy/Tactic into the handoff file.

---

### P0-4 — Add allocation validation

**Pilot finding**

Manual allocation across 28 leaves / 13 chats needed mechanical proof.

Useful checks:

- every implementation-ready leaf exactly once;
- no non-leaf assignment;
- contiguous chat numbering when serial-chat mode is used;
- valid execution states;
- dependency must be in an earlier chat or earlier in the same chat;
- initial allocation remains `pending/null`.

**Recommendation**

Provide a small reusable validator script/template instead of embedding complex parsers in shell/YAML.

**Acceptance**

Bad allocation fails before implementation authorization.

---

### P0-5 — Clarify execution-time planning defect ownership

**Pilot finding**

Framework wording such as `STATUS.yaml -> plan_state: active` becomes ambiguous when the target repository also has a root STATUS file.

**Recommendation**

Always name the planner-owned file explicitly as:

```text
.planning/STATUS.yaml -> plan_state
```

If the target repository has its own operational STATUS/phase, treat that as target-owned integration rather than framework-owned state.

---

## P1 — Strong improvements

### P1-1 — Add freeze no-drift verification

MarketScope proved that the tree reviewed in Final Planning Review and the tree actually frozen after merge were identical by comparing Git tree SHAs.

Recommendation:

- freeze only the reviewed baseline;
- when branch/PR workflows are used, verify no material drift between Final Review state and frozen state.

Do not mandate Git-tree SHA when the target workflow cannot provide it; require equivalent evidence.

---

### P1-2 — Add “durable contract vs live status” hygiene check

**Pilot finding**

Durable specs accumulated text such as:

- “Stage 6 readiness result”;
- extraction status;
- planning progress snapshots.

This duplicated STATUS/REVIEWS ownership.

**Recommendation**

Final Planning Review should explicitly check:

- durable product/data/technical/test specs contain contracts, not current progress;
- live progress belongs only to the target's status/review owners;
- README should be phase-neutral unless explicitly intended as live status.

---

### P1-3 — Require stale-decision / stale-investigation cleanup before freeze

MarketScope still had old `INVESTIGATE` entries in migration provenance even after later stages had resolved the underlying questions.

Recommendation:

Before freeze, fail review when a supposedly resolved plan still contains stale open classifications/questions outside their definition/legend.

---

### P1-4 — Promote failure learning to a reusable process rule

**Pilot finding**

Several failures were fixed locally but would have repeated without a generalized lesson.

Useful loop:

```text
failure
→ technical root cause
→ reasoning/process cause
→ escape cause
→ local fix + regression proof
→ smallest reusable prevention
```

Recommendation:

Add this as lightweight framework guidance for meaningful unexpected failures. Do not create permanent ceremony for normal TDD red states or trivial typos.

---

### P1-5 — Add long-running progress orientation

**Pilot finding**

Long tool-heavy planning stages left the user without visibility for several minutes.

Recommendation:

Framework guidance should require concise periodic updates during long work:

- what is being checked now;
- what is already complete;
- what remains before stage closure;
- meaningful discoveries/blockers.

Avoid narrating every tool call.

---

### P1-6 — Prefer helper scripts over complex GitHub Actions heredocs

**Pilot finding**

Large inline Node parsers inside YAML/Bash introduced avoidable heredoc/indentation failures.

Recommendation:

When validation logic becomes non-trivial, put it in a small versioned script and let CI call the script.

This is a repository-engineering guideline, not a new runtime component.

---

### P1-7 — Programmatic text-edit safety

**Pilot finding**

JavaScript `String.replace(search, replacementString)` can interpret `$` replacement tokens and silently corrupt unrelated text.

Recommendation:

For programmatic repository transformations:

- use replacer functions when inserted text can contain `$`;
- or build from a known-good baseline;
- reread the complete rendered file/diff before PR.

This is optional framework-agent guidance, especially useful for AI-operated repository edits.

---

## P2 — Optional patterns; do not make default

### P2-1 — High-complexity anti-forgetting coverage ledger

MarketScope used a large `MASTER_COVERAGE` + exact `COVERAGE_MAP` because the original brief and legacy migration were unusually large.

It helped catch omissions, but it also created maintenance risk and duplicate-ID hygiene work.

**Recommendation**

Keep the current default:

> do not create a separate coverage artifact.

Allow an explicit **high-complexity coverage mode** only when evidence justifies it, such as:

- very large source brief;
- major legacy migration;
- hundreds of independent obligations;
- user explicitly requires exhaustive anti-forgetting traceability.

If enabled:

- coverage IDs are unique;
- each ID maps exactly once to durable owners/S&T;
- coverage files never become a second STATUS;
- CI checks duplicates, missing IDs and extras.

---

### P2-2 — Legacy migration completeness gate

For migration/extraction projects, add an optional pre-freeze pattern:

```text
fresh legacy inventory
→ compare with extracted contracts/S&T
→ classify every discrepancy
→ fix omissions
→ outside-in flow audit
```

This should not run for greenfield projects.

---

### P2-3 — Target-specific branch/PR workflow hook

MarketScope benefited from one feature branch/PR per meaningful stage and post-merge main verification.

Recommendation:

S&T Planner should support project branch/PR rules discovered from the target repository, but should not impose GitHub PR ceremony universally.

---

### P2-4 — External live-gate semantics

Some projects have verification that cannot always run immediately because an authenticated session, market, hardware, environment or third-party condition is unavailable.

Recommendation:

Allow a leaf to distinguish:

- harness/verification capability implemented and offline-proven;
- external live execution pending for a factual availability reason.

Do not let an unavailable external condition silently erase the requirement, but also do not block unrelated implementation work.

---

## Template/document areas likely affected when implementing this backlog

Review these together rather than patching one file in isolation:

- `AGENTS.md`
- `BOOTSTRAP.md`
- `templates/project/AGENTS.snippet.md`
- `templates/project/.planning/README.md`
- `templates/project/.planning/STATUS.yaml`
- `templates/project/.planning/EXECUTION.yaml`
- `templates/project/.planning/EXECUTOR_HANDOFF.md`
- `templates/project/.planning/validate-allocation.mjs`
- `docs/AI-PLANNING-PROTOCOL.md`
- `docs/QUALITY-GATES.md`
- `docs/EXECUTION-HANDOFF.md`
- `docs/CHAT-EXECUTION.md`
- `docs/FRAMEWORK-LIFECYCLE.md`

## Suggested implementation order

1. P0-1 execution authorization semantics.
2. P0-2/P0-3 fresh-chat handoff gate + bootstrap.
3. P0-4 reusable execution-allocation validator.
4. P0-5 ownership/path clarification.
5. P1 final-review hygiene/no-drift/failure-learning/progress rules.
6. P2 optional patterns only after P0/P1 remain KISS in a second real project.

## Success criterion for improving S&T Planner

A second unrelated project should be able to use the updated framework and reach:

```text
goal
→ complete S&T
→ Final Planning Review
→ freeze
→ allocation
→ mechanical allocation validation
→ fresh-chat verification
→ explicit implementation authorization
→ Chat 1 starts without planning-history context
```

with fewer project-specific framework patches than MarketScope required.

## Pilot principle

Do not promote a MarketScope-specific mechanism merely because it worked once.

Promote only the **general failure-prevention or handoff principle** that explains why it was needed.
