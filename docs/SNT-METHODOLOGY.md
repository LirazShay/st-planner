# Expanded S&T Methodology for AI-Assisted Planning

## Purpose

This document turns Strategy & Tactics (S&T) logic into an operational planning method for GPT and other AI agents.

It preserves the core logical structure and adds practical rules for uncertainty, evidence, review, reusable planning scopes, execution handoff, KISS, and AI failure modes.

The same method applies whether the current planning scope is a whole project or a meaningful change inside an existing system: a release, feature, migration, refactor, architectural change, or another substantial change.

Complex extensions mentioned by the source — such as multiple parents, supporting steps, and time dependency — are **not fully designed in V1**. They remain special cases so the planner does not distort the core tree model before real usage proves richer machinery necessary.

## Source basis

The core concepts are based on *Strategy and Tactics* by Eli Goldratt, Rami Goldratt and Eli Abramov, released for public study by Washington State University.

Primary public source:
https://public.archive.wsu.edu/engrmgmt/public_html/holt/em534/Goldratt/Strategic-Tactic.html

Additional TOC reference context:
https://www.tocico.org/resources-references

This guide is independently written and does not reproduce the source text.

---

# 1. The central model

An S&T tree repeatedly answers two complementary questions:

- **Strategy — What for?** What objective/outcome must exist?
- **Tactic — How?** What selected action will create that objective?

A step is the pair:

```text
Strategy
   ⇅
Tactic
```

The strategy is not "more strategic" merely because it is high-level. Every level contains a Strategy and a Tactic.

A useful reading is:

> We need **[Strategy]**, therefore we will **[Tactic]**, because **[Parallel Assumptions]** make this a valid way to achieve it.

## 1.1 One Strategy, one selected Tactic

For one Strategy in one active step, represent one chosen Tactic.

If two actions are independently required, they usually belong as separate child steps, each with its own Strategy.

If two actions are alternative ways to achieve the same Strategy, they are alternatives, not simultaneous required tactics.

This prevents two common planning errors:
- hiding several independent requirements inside one vague tactic;
- representing competing solutions as if all were required.

## 1.2 The method is scope-agnostic

The root of the current tree is the desired outcome of **what is being planned now**, not necessarily the purpose of the entire product.

Valid planning scopes include:
- a new system or initiative;
- a release;
- one feature;
- a migration;
- a refactor;
- an architectural change;
- another substantial change.

A feature or release is not a special S&T object. It is an ordinary node/subtree whose meaning comes from its Strategy/Tactic logic.

---

# 2. Separate outcome from proposed solution

Users often begin planning from a solution:
- "add Redis";
- "use WebSocket";
- "build saved searches";
- "move to PostgreSQL".

Do not automatically treat the requested solution as the desired outcome.

Classify the request into:
- required outcome;
- current reality;
- hard constraint / already-fixed decision;
- proposed solution.

A proposed feature/tool/architecture is normally a **candidate tactic**. It becomes fixed only when the user explicitly makes it a constraint/decision or an existing durable project contract already does so.

When starting from a proposed solution, go upward:

> Why is this needed? What outcome is it intended to create?

Examples:

Bad root Strategy:
> Redis cache exists.

Better root Strategy:
> Read load stays within the required latency/capacity envelope.

Bad root Strategy:
> WebSocket connection exists.

Better root Strategy:
> Clients receive updates within the required latency and reliability boundary.

Do not challenge a truly fixed constraint merely to create artificial options.

---

# 3. The three logical explanations

## 3.1 Parallel assumptions — selected Tactic → Strategy

Parallel assumptions justify the horizontal claim:

```text
Tactic ──achieves──> Strategy
```

They answer challenges such as:
- Why is action required?
- Is this tactic feasible?
- Why can this tactic create the outcome?
- Why this tactic rather than a materially plausible alternative?
- What constraint or fact makes the choice valid?

A strong parallel assumption defends a claim a skeptical reviewer could challenge.

Weak:
> This tactic will help achieve the strategy.

Strong:
> The target projects already use Git, so durable planning state can be stored without introducing another persistence service.

## 3.2 Necessary assumptions — child → parent

A child claims to be necessary for its parent.

The necessary assumption explains why the remaining sibling steps would be insufficient if this child were absent.

Use the removal test:

> If this child disappeared and nothing replaced it, could the parent tactic still be performed and the parent strategy achieved?

If yes, challenge the child. It may be optional, supportive, an alternative, too low-level, or duplicated elsewhere.

## 3.3 Sufficiency assumptions — children together → parent

A sibling group claims that, together, the children are enough for the parent.

Ask:

> Assume every child succeeds. What required condition could still be missing?

Also distinguish:
- a missing required condition that needs action;
- a necessary condition already satisfied by current reality and therefore not a new child.

---

# 4. Two proof directions: horizontal choice and vertical decomposition

S&T planning must prove two different things.

## Horizontal proof — did we choose a justified Tactic?

For each material node:

```text
Strategy
   ↑
selected Tactic
```

Challenge:
- Why this objective?
- Why this tactic?
- What assumptions make the relationship valid?
- What materially plausible alternative could compete?
- What would invalidate the choice?

This is mainly protected by `parallel_assumptions` and material Decisions.

## Vertical proof — did we decompose the Tactic correctly?

For a parent with children A, B and C:

```text
A ─┐
B ─┼── sufficient together ──> Parent
C ─┘
```

Each child must be necessary individually, and the group sufficient together.

A plan can fail either direction:
- choosing the wrong feature/architecture correctly;
- choosing a good tactic but decomposing it incompletely.

The framework must challenge both.

---

# 5. Material tactic challenge

Do not treat every Tactic with the same ceremony.

For a **material** tactic ask:

1. **Need** — why is this Strategy required inside the current planning scope?
2. **Validity** — why can this Tactic achieve the Strategy?
3. **Alternative** — is another materially plausible tactic preferable under the actual constraints?
4. **Invalidation** — what fact/assumption, if false or changed, would make this choice wrong?

Materiality increases when a choice is:
- high impact;
- expensive to reverse;
- cross-cutting;
- product/business affecting;
- architecturally constraining;
- dependent on uncertain facts;
- able to reshape a large part of the tree.

Do not add a numeric materiality score. Use judgment.

Do not mechanically generate alternatives for trivial/reversible choices. The goal is decision quality, not brainstorming volume.

---

# 6. Going down

To decompose a selected parent Tactic, ask:

> How exactly must this action be performed?

Candidate answers become lower-level tactics. For each candidate lower tactic ask:

> What specific objective exists when this succeeds?

That objective becomes the child Strategy.

Then verify:
- the child Tactic can achieve the child Strategy;
- the child Strategy is necessary for the parent;
- all children together are sufficient for the parent.

## 6.1 Sibling-level coherence

Siblings should be at a coherent logical level.

Bad:

```text
Parent
├── User authorization
├── SQL table
├── Notification behavior
└── Button
```

Better:

```text
Parent
├── Authorization outcome
├── Persistence outcome
├── Notification outcome
└── Interaction outcome
```

Each can then decompose to its own technical mechanism.

If one proposed child is merely a way to implement another sibling, move it below that sibling.

## 6.2 The one-child warning

A decomposition with one child is usually the parent restated.

Default action:
- merge the levels; or
- identify the missing independent necessary steps.

Allow an exception only when the extra level provides genuine control value, such as a contractual boundary or required abstraction.

---

# 7. Feature trees

A feature is an ordinary S&T subtree.

Do **not** default to:

```text
Feature
├── Frontend
├── Backend
├── Database
├── Tests
└── Docs
```

That is organizational decomposition, not necessarily S&T logic.

Instead start from the feature outcome and derive independently necessary outcomes.

Example:

```text
Strategy:
A user can preserve a useful search and reuse it later.

Tactic:
Provide persisted reusable saved-search definitions.
```

Possible child outcomes might be:
- a search definition can be represented durably;
- an authorized user can manage saved definitions;
- a saved definition can be restored into a valid executable search;
- existing search semantics remain compatible.

Only deeper decomposition may reveal API, DB, UI, or other component work.

Architecture emerges from required outcomes; technical categories do not define the tree.

A large feature may contain what a product team informally calls sub-features. S&T does not need separate `Epic / Feature / Story / Task` types.

---

# 8. Release trees

A release can contain multiple feature subtrees, but release membership alone is not S&T causality.

Three common cases:

## 8.1 Shared outcome

All feature outcomes are jointly necessary for one release outcome.

This is ordinary necessity/sufficiency decomposition.

## 8.2 Explicit committed release scope

The features may not share deep product causality, but all are explicitly required by an approved release commitment.

The necessary assumptions should say that truthfully instead of inventing another relationship.

## 8.3 Packaging only

A version may merely package unrelated changes.

Do not pretend that being in the same version proves they form a causal S&T group. Use the release as the planning boundary when useful, but keep honest justification for each change.

Software/product version is not the same thing as plan-version machinery. S&T Planner still does not need `TREE-v1`, `TREE-v2`, etc.; Git history provides planning history.

---

# 9. Alternatives and Decisions

Alternatives are different tactics that could each satisfy the same Strategy.

Do not put them into TREE as simultaneous necessary siblings.

Once selected, TREE contains the active chosen path.

Use `DECISIONS.md` when a choice/unknown is material enough that getting it wrong could significantly change:
- product behavior;
- architecture;
- cross-cutting constraints;
- implementation scope;
- costly-to-reverse work;
- the tree itself.

Ordinary local reasoning remains in `parallel_assumptions`.

A useful material Decision records:
- the actual question;
- why it matters;
- only materially plausible options;
- selected resolution;
- resolution basis/rationale;
- what would reopen the decision.

An open Decision does not automatically block a node. Mark the node `blocked` only when continuing would require guessing or would create a materially different subtree.

Do not turn DECISIONS into a journal of every thought the planner had.

---

# 10. Epistemic hygiene

AI systems often produce uncertainty fluently enough to look like fact. S&T fails if this is allowed.

Keep these concepts distinct:

## Fact
Observed, measured, supplied by the user, or supported by a source.

## Assumption
Believed for planning purposes but not established.

## Decision
A deliberate choice among alternatives.

## Unknown
A question not yet answered.

## Risk
An uncertainty whose outcome could materially affect the plan.

## Evidence
An observation that proves or strongly demonstrates an objective/condition.

Say "unknown" instead of hallucinating a convenient answer.

Before deep decomposition, capture only current reality that can change the plan:
- relevant existing behavior/process;
- actors/boundaries;
- assets/capabilities already available;
- hard constraints and binding prior decisions;
- pain/problem;
- known failure modes.

Ask:

> Would this information change a node, assumption, decision, or review?

If not, it probably does not belong in the planning core.

---

# 11. Success evidence

A Strategy should be testable enough to distinguish "achieved" from "we worked on it."

Evidence validates the Strategy, not merely the Tactic.

Weak:
> A script was written.

Stronger:
> A fresh GPT session can reconstruct planning status from repository files and identify the correct next action without chat history.

For a feature/release, success evidence should ultimately prove the intended higher-level behavior/outcome, not just that each component was modified.

---

# 12. Stop conditions for AI planning

A leaf is implementation-ready only when both are true:

1. **Decision-complete** — the executor can perform it without making another material product/design/architecture choice.
2. **Practically executable** — it is a coherent, manageable unit for an executor chat.

A leaf should expose enough to derive:
- action/intended direction;
- scope/boundary;
- required inputs;
- objective completion evidence;
- real dependencies;
- no blocking unknown.

Stop before decomposition becomes mechanical implementation trivia.

Do not force every line of code, file edit, click, command, or test assertion into TREE.

If one leaf is too large for a practical executor chat, decompose it further even if no new material design decision remains.

---

# 13. Logical hierarchy is not a schedule

Lower S&T nodes explain how the parent tactic is performed. That relationship is logical decomposition, not time order.

Do not infer execution order from parent/child position or hierarchical IDs.

Use the minimal execution prerequisite relation only when needed:

```yaml
depends_on:
  - "2.1.3"
```

Rules:
- reference existing implementation-ready leaf IDs only;
- dependency means a real execution prerequisite;
- no self-dependency;
- no cycles;
- do not encode priority, dates, estimates, or preference.

If Feature B needs an outcome produced under Feature A, keep the logical tree honest and express the real leaf dependency with `depends_on`; do not make B a child of A merely to show sequence.

---

# 14. Special cases deferred in V1

The original material notes supporting steps, multiple parents, and time dependency. They are real concerns but are not part of the V1 core model.

V1 rules:
- merely helpful/non-necessary work does not belong in the required tree;
- if one step appears to belong to multiple parents, keep the clearest single-parent representation and record the ambiguity rather than inventing a graph model;
- use leaf `depends_on` for execution prerequisites instead of redesigning the hierarchy around chronology.

If repeated real usage proves these insufficient, evolve the model later with evidence.

---

# 15. Risks

Risk is not automatically an S&T child.

Create a child only when action is necessary to achieve the Strategy under accepted constraints.

Otherwise record the risk in the target project's appropriate owner with trigger/cause, consequence, confidence if useful, mitigation/contingency, and affected nodes.

If mitigation becomes mandatory, it can become a necessary step.

---

# 16. AI-specific anti-patterns

## 16.1 Arbitrary phase count

Failure: "Here is a 12-step plan."

Fix: let logical decomposition determine the count.

## 16.2 Tool-first planning

Failure: "Use Kubernetes/Postgres/Redis/WebSocket" before the requirement exists.

Fix: establish the Strategy, then justify the Tactic.

## 16.3 Feature-as-goal

Failure:
- Strategy: "Saved Searches exists."
- Tactic: "Build Saved Searches."

Fix: state the outcome the feature must create; treat the feature as candidate/selected Tactic unless explicitly fixed.

## 16.4 Strategy/Tactic echo

Failure:
- Strategy: "The system is documented."
- Tactic: "Document the system."

Fix: Tactic must describe a meaningful way to create the Strategy, not merely convert noun to verb.

## 16.5 Feature-as-folder

Failure:

```text
Feature
├── Frontend
├── Backend
├── DB
└── Tests
```

Fix: derive independently necessary outcomes, then let architecture/components emerge below them.

## 16.6 Release-as-folder

Failure: Features are children only because they share a version number.

Fix: identify the shared outcome, explicit release commitment, or admit that the release is packaging rather than inventing causality.

## 16.7 Alternative siblings

Failure: WebSocket, SSE and polling all appear as required children.

Fix: treat them as alternatives; choose one active path and preserve a material choice in DECISIONS when useful.

## 16.8 Mixed abstraction siblings

Failure: business outcome, SQL table, UI button and operational concern are siblings.

Fix: keep siblings at a coherent logical level; move implementation means below the outcome they realize.

## 16.9 Checklist masquerading as logic

Failure: a list of sensible activities has no necessity/sufficiency proof.

Fix: removal-test every child and gap-test the group.

## 16.10 Hidden assumptions

Failure: AI silently assumes budget, access, data, permissions, scale, or actor skill.

Fix: expose material assumptions/unknowns and resolve material choices.

## 16.11 Infinite decomposition

Failure: every leaf expands forever.

Fix: stop when decision-complete and practically executable.

## 16.12 Planning theatre

Failure: documents grow but decisions do not improve.

Fix: KISS review. Remove artifacts/rules that add no control, rationale, handoff, or validation value.

## 16.13 Premature execution allocation

Failure: assigning chats while the intended tree is incomplete.

Fix: complete/review/freeze first; allocate leaves afterward.

---

# 17. Whole-plan completeness beyond local sufficiency

A locally coherent tree can still be globally incomplete if a concern never entered the tree.

Before Final Planning Review run an outside-in coverage audit:

1. Return to desired outcome and hard constraints in GOAL.
2. Trace each meaningful clause to TREE, an assumption, a decision, or success evidence.
3. Assume every leaf succeeds; ask what could still make the desired outcome fail that planning should have handled.
4. Challenge materially relevant actors, interfaces/boundaries, external dependencies, and failure paths.
5. Walk representative end-to-end scenarios.
6. Check non-goals did not leak into required work.

For Feature/Release planning also challenge:
- where each feature/change is justified;
- whether a proposed solution was accepted without adequate rationale;
- whether release membership was mistaken for causal logic;
- whether product reasoning stays rigorous through architecture/component/technical layers.

This is a review technique, not another data model.

Do not create a generic checklist for every possible software concern unless the current scope makes that concern material.

---

# 18. Review protocol

Run authoring and review as distinct mental passes.

## Pass A — Boundary/outcome
- Planning boundary is correct.
- Desired outcome is not a disguised proposed solution.
- Current reality and constraints are factual enough to plan.

## Pass B — Structural
- Every active node has Strategy + Tactic.
- IDs and parent links are valid.
- Active decompositions normally have 2+ children.
- Alternatives/special cases are not disguised as required children.

## Pass C — Necessity
For each child:
- remove it mentally;
- challenge why the parent cannot still succeed;
- remove/downgrade optional/supporting work.

## Pass D — Sufficiency
For each parent:
- assume all children succeed;
- ask what required condition is still missing;
- record already-satisfied conditions as facts rather than fake work.

## Pass E — Tactic/parallel logic
For each material step:
- Why is this Strategy needed?
- Is the Tactic feasible?
- Why this Tactic?
- What materially plausible alternative might be preferable?
- What assumption/fact would invalidate the choice?
- Is another independent action hidden inside it?

## Pass F — Epistemic
- Facts supported?
- Assumptions explicit?
- Unknowns visible?
- Material Decisions/alternatives recorded?

## Pass G — KISS
- Can nodes/documents/tools/rules be removed without weakening the proof?
- Are we solving today's actual scope rather than imagined future scale?

## Pass H — Executability
- Are leaves decision-complete?
- Are they manageable executor units?
- Is completion observable?
- Are blocking decisions resolved?

---

# 19. Project management state

Recommended target-project state:

```text
.planning/
├── README.md
├── FRAMEWORK.md
├── GOAL.md
├── TREE.yaml
├── STATUS.yaml
├── DECISIONS.md
├── REVIEWS.md
├── EXECUTION.yaml
├── EXECUTOR_HANDOFF.md
├── validate-allocation.mjs
└── verify-freeze-baseline.mjs
```

Ownership:
- `README.md` — installed read order and ownership map.
- `FRAMEWORK.md` — portable planning/execution contract.
- `GOAL.md` — stable boundary of the current planning scope.
- `TREE.yaml` — active S&T logic, rationale, dependencies and evidence.
- `STATUS.yaml` — S&T Planner resume/lifecycle/authorization state only.
- `DECISIONS.md` — material questions/resolved choices for the current planning scope.
- `REVIEWS.md` — planning/replanning review evidence.
- `EXECUTION.yaml` — post-freeze chat allocation + execution state/result for leaf IDs.
- `EXECUTOR_HANDOFF.md` — fresh-executor bootstrap/context-routing/handoff verification; no task content.
- `validate-allocation.mjs` — mechanical TREE → EXECUTION invariant validator.
- `verify-freeze-baseline.mjs` — reviewed-baseline no-drift verifier.

This is intentionally small.

Do not create one file per node, a feature/release registry, or a second task database unless repeated real usage proves a need.

---

# 20. Execution is the S&T tree itself

Frozen implementation-ready leaves are already execution work units.

There is no mandatory translation into another task system and S&T Planner does not require GitHub Issues.

Normal flow:

```text
complete reviewed TREE
→ freeze verified reviewed baseline (implementation unauthorized)
→ allocate every leaf once in EXECUTION
→ validate allocation mechanically
→ run mandatory repository-only fresh-executor simulations
→ record handoff verification
→ explicitly authorize implementation
→ executor loads its node IDs from TREE
→ execute
→ verify success_evidence
→ update execution state/result
```

## 20.1 Chat allocation is not Feature allocation

A chat is an execution context, not a logical S&T level.

Allocation prioritizes:
- shared implementation context/responsibility;
- dependency compatibility;
- manageable workload;
- reasonable balance.

Therefore:
- one Feature can require multiple chats;
- one chat can own leaves from multiple Feature subtrees when that is technically coherent;
- chat numbering does not define S&T hierarchy;
- chat dependencies are not duplicated because real dependencies remain in TREE.

## 20.2 Execution source of truth

| Concern | Source |
|---|---|
| Why work exists | `TREE.yaml -> strategy` |
| Selected way | `TREE.yaml -> tactic` |
| Planning rationale | assumptions / decisions |
| Execution prerequisites | `TREE.yaml -> depends_on` |
| Definition of success | `TREE.yaml -> success_evidence` |
| Chat ownership | `EXECUTION.yaml` |
| Runtime execution state | `EXECUTION.yaml` |
| Short result/reference | `EXECUTION.yaml -> result` |
| Actual code history | target project's normal Git workflow |

Do not duplicate Strategy/Tactic task descriptions into EXECUTION.

---

# 21. Adaptive planning depth

There is no QUICK/DEEP mode.

For a small, obvious, reversible change:
- tree may be shallow;
- few assumptions need explicit explanation;
- review may be short.

For an ambiguous, costly, architectural, or long-lived change:
- tree naturally becomes deeper;
- more alternatives/decisions are material;
- review becomes broader.

Do not ask the user to choose a mode.

Use one stopping rule:

> Continue decomposing only while additional decomposition materially improves implementation readiness or logical confidence.

---

# 22. Compact node schema

Node IDs are YAML map keys; do not duplicate an `id` field. V1 also has no `kind` field.

```yaml
nodes:
  "1.2":
    status: approved

    strategy: "A fresh AI session can recover planning state"

    tactic: "Persist the minimal planning state in version-controlled project files"

    parallel_assumptions:
      - "The target project already has a Git repository"
      - "Plain text files are sufficient for the initial state model"

    necessary_assumptions:
      - "Without persistent state, a new session cannot reliably reconstruct prior planning decisions"

    sufficiency_assumptions:
      - "If the required child capabilities all exist, the persisted state is sufficient for session recovery"

    success_evidence:
      - "A fresh session reads only repository state and identifies the correct next action"

    depends_on: []

    children:
      - "1.2.1"
      - "1.2.2"
```

Relationship placement:
- parallel assumptions justify node Tactic → Strategy;
- necessary assumptions justify child → parent necessity;
- sufficiency assumptions justify children-as-group → parent sufficiency.

V1 invariants:
- root references an existing node;
- every child reference resolves;
- every non-root node has exactly one logical parent;
- child graph is acyclic;
- status is only `draft / blocked / approved`;
- blocked node is referenced by at least one open material Decision;
- approval is local, not recursive;
- parent with children records sufficiency reasoning;
- non-root child records necessity reasoning;
- approved node has explicit Strategy, Tactic, material assumptions, and success evidence.

Do not add schema fields simply to label project/release/feature/architecture levels.

---

# 23. Fresh reviewer reading order

When presenting a completed tree to someone who did not build it:

1. start at the top outcome;
2. explain why the selected top Tactic is justified;
3. before presenting a lower group, explain why each child is necessary;
4. explain why the whole child group is sufficient;
5. then read each child Strategy + Tactic + material parallel assumptions;
6. repeat recursively.

The reader should understand **why lower steps exist before absorbing implementation detail**.

---

# 24. Definition of good enough

A perfect tree is not the goal. A decision-quality and execution-quality tree is.

The plan is good enough when:
- planning boundary and desired outcome are unambiguous;
- proposed solutions were not mistaken for outcomes;
- material constraints are modeled;
- material Tactics have defensible Tactic → Strategy logic;
- material alternatives are decided or intentionally represented as open Decisions;
- active children survive necessity challenges;
- sibling groups survive sufficiency challenges;
- sibling levels are coherent;
- facts/assumptions/unknowns are honest;
- all intended leaves are decision-complete and practically executable;
- whole-plan coverage passes;
- Final Planning Review passes;
- the baseline being frozen is proven not to have materially drifted from the reviewed baseline;
- fresh-executor simulations prove authorization, assignment, dependencies, context routing, and blockers are recoverable without planning-chat memory;
- additional decomposition would not materially improve execution.

That is the point at which the reviewed baseline can be frozen, allocation prepared, handoff verified, and implementation explicitly authorized.
