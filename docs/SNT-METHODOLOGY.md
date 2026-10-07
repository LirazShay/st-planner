# ST Planner — S&T Methodology

## Purpose

This document defines the planning/reasoning method used by ST Planner for AI-assisted software and product work.

The goal is not to create a large process. The goal is to produce plans that are logically defensible, implementation-ready, and simple enough to use routinely.

The method applies to a project, feature, release, migration, refactor, architecture change, defect investigation, or another meaningful scope.

Core philosophy:

> **Strict thinking. Lightweight process. Clear instructions. Minimal state.**

## Source basis

The core Strategy & Tactics concepts are based on the public study material by Eli Goldratt, Rami Goldratt, and Eli Abramov. This guide is independently written for practical AI-assisted planning and does not reproduce the source text.

Primary public study source:

`https://public.archive.wsu.edu/engrmgmt/public_html/holt/em534/Goldratt/Strategic-Tactic.html`

---

# 1. The central model

Every meaningful S&T step pairs:

- **Strategy — What outcome is required?**
- **Tactic — How will that outcome be achieved?**

A useful reading is:

> We need **[Strategy]**, therefore we will **[Tactic]**, because the relevant assumptions make that tactic a valid way to achieve the Strategy.

Every level can contain a Strategy/Tactic pair. A Strategy is not automatically high-level and a Tactic is not automatically low-level.

## 1.1 One selected tactic per active step

For one Strategy in one active step, represent one selected Tactic.

If two actions are independently necessary, they normally belong as separate children.

If two actions are alternative ways to satisfy the same Strategy, they are alternatives, not simultaneous children.

This avoids hiding several requirements inside one vague tactic or pretending competing solutions are all mandatory.

## 1.2 Planning scope

The root Strategy is the outcome of **what is being planned now**, not necessarily the purpose of the entire product.

Choose the smallest scope that contains the material decisions and dependencies needed to reason correctly. Do not reopen the whole product plan merely because one local task changed.

---

# 2. Start with the outcome, not the proposed solution

Users often start with a solution:

- add a cache;
- introduce WebSocket;
- move to another database;
- add a queue;
- build a new screen.

Do not automatically make the proposed solution the Strategy.

First separate:

- required outcome;
- relevant current reality;
- hard constraints / already-fixed durable decisions;
- proposed solution;
- unknowns and risks that can materially change the plan.

A proposed feature/tool/architecture is normally a candidate Tactic unless the user or a durable target contract makes it fixed.

Ask:

> Why is this needed? What outcome must exist if this succeeds?

Do not challenge a genuinely fixed constraint merely to manufacture alternatives.

---

# 3. The three proofs

## 3.1 Tactic validity — Tactic → Strategy

The planner must be able to explain why the selected Tactic can achieve the Strategy under current reality and constraints.

For a material choice ask:

- Why can this tactic work here?
- What assumptions make it valid?
- What materially plausible alternative could compete?
- Why is the selected tactic preferable under the actual constraints?
- What evidence or changed assumption would invalidate the choice?

Do not generate alternatives mechanically for trivial or easily reversible choices.

## 3.2 Necessity — Child → Parent

Each required child claims to be necessary for the parent.

Use the removal test:

> If this child disappeared and nothing replaced it, could the parent tactic still be performed and the parent strategy achieved?

If yes, challenge the child. It may be optional, duplicated, supportive rather than necessary, or at the wrong logical level.

## 3.3 Sufficiency — Children together → Parent

A sibling group claims to be enough, together, for the parent.

Ask:

> Assume every child succeeds. What required condition could still be missing?

Do not create new child work for conditions already satisfied by current reality.

---

# 4. Materiality and reasoning depth

ST Planner does not use QUICK/DEEP modes.

Reasoning depth follows the materiality and uncertainty of the decision.

A choice deserves more scrutiny when it is:

- high impact;
- expensive to reverse;
- cross-cutting;
- product/business affecting;
- architecturally constraining;
- dependent on uncertain facts;
- likely to reshape a large portion of the plan.

A small code change may deserve deep reasoning if it exposes a systemic design flaw. A large implementation may need little planning if all material decisions are already fixed and validated.

Do not add a numeric materiality score. Use engineering judgment.

## 4.1 Materiality Gate

Before creating a new planning decision, node, document, review artifact, or governance mechanism, ask whether the issue materially affects at least one of:

- product behavior;
- architecture;
- cross-cutting constraints;
- prior planned work;
- costly-to-reverse implementation;
- materially different reasonable alternatives.

If not, keep the handling local and simple.

---

# 5. Efficient deep planning

Efficiency must come from sequencing and scope control, not from weakening reasoning.

## 5.1 Structural map first when useful

Before deep decomposition, a short map may identify:

- major outcomes;
- material questions;
- unknowns;
- likely dependencies;
- evidence that can change decisions.

This is orientation only. It does not approve a tactic or replace S&T justification.

## 5.2 Work in coherent slices

Reason deeply about a coherent area, review it, and then continue.

Do not repeat a full planning ceremony after every small text edit.

Once a material decision is justified and recorded, reopen it only when new evidence, contradiction, changed assumptions, or review findings can materially change it.

## 5.3 Gather evidence that can change the plan

Before collecting more repository or external information, ask:

> Could this evidence change a node, tactic, assumption, decision, success criterion, or execution dependency?

If not, it is probably not part of the planning core.

---

# 6. Decomposition

To decompose a selected Tactic, ask:

> What independently necessary outcomes must exist for this tactic to succeed?

Each child should represent an outcome, not merely an organizational bucket.

Bad default decomposition:

```text
Feature
├── Frontend
├── Backend
├── Database
└── Tests
```

Better decomposition derives independently necessary outcomes first. Technical components emerge later where needed.

## 6.1 Sibling coherence

Siblings should live at a comparable logical level.

If one proposed child is merely a mechanism for another sibling, move it below that sibling.

## 6.2 One-child warning

A parent with one child is often a restatement.

Default response:

- merge the levels; or
- identify missing independent necessary outcomes.

Keep a one-child level only when it creates real reasoning/control value.

## 6.3 Stop condition

A leaf is implementation-ready when:

1. **decision-complete** — execution does not require a new material product/design/architecture decision;
2. **practically executable** — it is a coherent, manageable work unit;
3. **verifiable** — objective success evidence is known;
4. **unblocked at the planning level** — no unresolved material unknown must be guessed.

Stop before decomposition becomes line-by-line implementation trivia.

If a leaf is too large for a practical executor, split it further without inventing fake product decisions.

---

# 7. Decisions, facts, assumptions, unknowns, risks

Keep epistemic categories distinct.

## Fact

Observed, measured, supplied by the user, or supported by an authoritative source.

## Assumption

Believed for planning purposes but not established as fact.

## Decision

A deliberate selection among alternatives.

## Unknown

A material question not yet answered.

## Risk

An uncertainty whose outcome could materially damage the plan or result.

## Evidence

An observation that proves or strongly demonstrates an outcome/condition.

Do not write an assumption as though it were established fact merely because it makes the plan convenient.

## 7.1 Material decisions

Record a decision separately only when getting it wrong could materially change product behavior, architecture, cross-cutting constraints, implementation scope, costly-to-reverse work, or the S&T tree itself.

A useful material decision records:

- the question;
- why it matters;
- materially plausible options;
- selected resolution;
- rationale/evidence;
- what would reopen it.

Do not turn decisions into a diary of every thought.

---

# 8. Success evidence

Success evidence proves the Strategy/outcome, not merely that activity occurred.

Weak:

> A script was written.

Stronger:

> A fresh execution session completes the operation within the required boundary and the regression reproducing the former failure passes.

For larger scopes, higher-level evidence must prove the intended integrated outcome, not only that each component changed.

---

# 9. Logical decomposition is not execution order

The S&T parent/child relation explains **why/how**, not chronology.

Do not distort the tree merely to show schedule order.

Execution dependencies belong in the lightweight execution map when they represent a real prerequisite between implementation-ready tasks.

A dependency should mean:

> Task B cannot correctly proceed until the required outcome/output of Task A exists.

Do not use dependencies to encode preference, arbitrary priority, chat numbering, or management convenience.

---

# 10. Final Planning Review

Before implementation of the selected planning scope, review it outside-in.

Ask:

1. Is the outcome boundary correct?
2. Are proposed solutions separated from required outcomes?
3. Is every material Tactic justified?
4. Were materially plausible alternatives handled where they could change the choice?
5. Are assumptions honest and important unknowns visible?
6. Is each child necessary?
7. Are child groups sufficient together?
8. Are leaves decision-complete and practically executable?
9. Is success evidence objective enough?
10. Are real execution dependencies identifiable without distorting the reasoning tree?
11. Is anything duplicated or over-engineered?
12. Is there a simpler plan that achieves the same outcome with comparable confidence?

Correct the plan directly when review finds a defect.

Do not create freeze, authorization, validation, or review-history state solely to prove that review occurred.

---

# 11. Planning Impact Test during execution

Implementation often discovers defects or new facts. Most do **not** justify reopening the whole plan.

Ask:

> Does the new fact materially invalidate an existing Strategy, Tactic, assumption, contract, dependency, or success criterion?

## Class A — implementation defect

The plan remains valid.

Typical response:

```text
understand root cause
→ reproduce/regression as appropriate
→ smallest correct fix
→ analogous-area check when materially justified
→ verify affected behavior
→ continue
```

Do not edit planning state merely because implementation was imperfect.

## Class B — local planning correction

The new fact changes a bounded planning detail but does not invalidate the broader plan.

Update the smallest affected planning area, review the impact, adjust affected execution work, and continue.

## Class C — material plan invalidation

The selected tactic/contract/outcome/dependency is materially wrong or insufficient.

Stop affected work, revise the affected S&T reasoning and downstream execution mapping, review the changed scope, and continue.

Preserve unaffected valid completed work.

Never use a local defect as justification for a global planning reset unless the evidence actually supports that conclusion.

---

# 12. RCA and CI signals

A warning/error should trigger enough investigation to understand whether it exposes a real defect, a systemic weakness, or a bad check.

Do not accept a symptom-only patch or green rerun as automatic closure.

For a meaningful signal establish, proportionately:

1. what happened;
2. the causal root;
3. why prevention/detection did not catch it earlier;
4. what prevention/detection improvement is justified;
5. where materially analogous exposure may exist;
6. what evidence closes the incident.

Possible valid conclusions include:

- implementation fix + regression;
- architecture/contract correction;
- test improvement;
- tooling correction;
- documentation/ownership correction;
- removal or repair of an obsolete/brittle/noisy CI check.

Do not build a new permanent mechanism for every incident. The prevention must be cheaper and clearer than the recurrence risk it addresses.

---

# 13. Process ROI and anti-bureaucracy rules

ST Planner itself must satisfy KISS.

Use this permanent question:

> **Is the planning machinery currently costing more than the engineering uncertainty it is reducing?**

Before adding any process mechanism — file, field, state, validator, script, gate, marker, workflow, metadata, handoff protocol — require a burden of proof:

1. What real failure does it prevent?
2. How likely/costly is that failure?
3. Can a simpler instruction or existing repository mechanism handle it?
4. Does the mechanism create duplicated/derived state?
5. Will one ordinary factual change now require synchronized edits in multiple places?

If a simpler mechanism provides equivalent practical safety, use the simpler mechanism.

A strong smell is work whose main purpose is maintaining the planning system rather than improving the product or decision.

> **Model the work, not the management of the work.**

---

# 14. Durable planning artifacts

ST Planner methodology is read from the source repository. Target repositories store only their own planning state.

Normal meaningful work uses:

- `.planning/PLAN.md` — current planning truth;
- `.planning/EXECUTION.md` — current task allocation/progress truth.

Optional:

- `.planning/STATUS.md` — tiny continuity pointer for long-running work;
- `.planning/DECISIONS.md` — split-out material decisions when needed for readability.

Do not create separate artifacts for reviews, authorization, freezes, handoff validation, install provenance, framework hashes, or process history by default.

Git already preserves history.

Future durable product/architecture truths belong in the target repository's normal contracts/specifications, not permanently in ST Planner artifacts.

---

# 15. Completion

An individual execution task is complete when its relevant success evidence is verified.

The planning scope is complete only when the intended root outcome is verified after integration.

A set of `done` tasks is evidence, not proof by itself.

If the delivered work establishes a contract future work must obey, promote that contract into the target repository's durable source of truth before treating the scope as fully closed.
