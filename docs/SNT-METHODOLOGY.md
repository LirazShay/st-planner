# Expanded S&T Methodology for AI-Assisted Planning

## Purpose

This document turns Strategy & Tactics (S&T) logic into an operational planning method for GPT and other AI agents.

It is intentionally more explicit than the original introductory paper: it preserves the core logical structure and adds practical rules for uncertainty, evidence, review, persistence, execution handoff, KISS, and AI failure modes.

Complex extensions mentioned by the source — such as multiple parents, supporting steps, and time dependency — are **not fully designed in V1**. They are recorded as special cases so the planner does not distort the core S&T logic. Their richer treatment is deferred until the basic method has been proven useful.

## Source basis

The core concepts are based on *Strategy and Tactics* by Eli Goldratt, Rami Goldratt and Eli Abramov, released for public study by Washington State University.

Primary public source:
https://public.archive.wsu.edu/engrmgmt/public_html/holt/em534/Goldratt/Strategic-Tactic.html

Additional TOC reference context:
https://www.tocico.org/resources-references

This guide is independently written and does not reproduce the source text.

---

# 1. The central model

An S&T tree answers two complementary questions repeatedly:

- **Strategy — What for?** What objective must exist?
- **Tactic — How?** What action will create that objective?

A step is the pair:

```
Strategy
   ⇅
Tactic
```

The strategy is not "more strategic" merely because it is high-level. Every level contains a strategy and a tactic.

A useful reading is:

> We need **[Strategy]**, therefore we will **[Tactic]**, because **[Parallel Assumptions]** make this a valid way to achieve it.

## 1.1 One strategy, one tactic

For one strategy in one step, represent one chosen tactic.

If two actions are both independently required, they usually belong as separate child steps, each with its own strategy.

If two actions are alternative ways to achieve the same strategy, they are alternatives, not simultaneous required tactics.

This prevents a common planning mistake: hiding several independent requirements inside one vague tactic.

---

# 2. The three logical explanations

## 2.1 Parallel assumptions

Parallel assumptions justify the horizontal claim:

```
Tactic  ──achieves──>  Strategy
```

They answer challenges such as:
- Why is any action required?
- Is this action feasible?
- Why this tactic rather than an alternative?
- Is the tactic sufficient, or is another action missing?

A strong parallel assumption may establish feasibility, reject a weaker alternative, identify what is currently missing, or explain why no additional action is needed at this level.

### AI rule

Do not write decorative assumptions.

A parallel assumption should defend a real point that a skeptical reviewer could challenge.

Weak:
> This tactic will help achieve the strategy.

Strong:
> The target projects already use Git, so durable planning state can be stored without introducing another persistence service.

---

## 2.2 Necessary assumptions

A child step claims to be necessary for its parent.

The necessary assumption explains **why the remaining sibling steps would be insufficient if this child were absent**.

Use the removal test:

> If this child disappeared and nothing replaced it, could the parent tactic still be performed and the parent strategy achieved?

If yes, the child is not logically necessary as currently stated.

It may be:
- optional;
- supportive;
- one of several alternatives;
- too low-level;
- duplicated by another child.

---

## 2.3 Sufficiency assumptions

A group of children claims that, together, they are enough to achieve the parent.

The sufficiency assumption explains why no additional active step is needed.

A powerful sufficiency review checks two special cases:

1. **Missing condition** — someone may argue that another condition is necessary.
2. **Already-satisfied condition** — the condition really is necessary, but it already exists and requires no action.

S&T trees should contain strategic objectives that require action. Existing necessary conditions can be recorded as facts/assumptions instead of inventing work.

---

# 3. Necessary individually, sufficient together

For a parent P with children A, B and C:

```
A ─┐
B ─┼── sufficient together ──> P
C ─┘
```

The intended logical claim is:

- A is necessary within the chosen decomposition;
- B is necessary;
- C is necessary;
- A+B+C are sufficient together.

This is the heart of S&T decomposition.

It differs from brainstorming, where a list may simply contain useful activities.

---

# 4. Going down

To decompose a parent, focus on its **tactic**:

> How exactly must this action be performed?

Candidate answers become lower-level tactics.

For every candidate lower tactic, ask:

> What specific objective exists when this action succeeds?

That objective becomes the child strategy.

Then verify:
- the child tactic is sufficient for its child strategy;
- the child strategy is necessary for the parent;
- all children together are sufficient for the parent.

## 4.1 The one-child warning

A decomposition containing only one child is usually just the parent rewritten with more words.

There is no predetermined upper limit on the number of children. The count must emerge from necessity and sufficiency.

A child belongs in this sibling group only if it is necessary **on its own merit** for the parent. If it exists merely as a means for achieving another sibling, it belongs lower in the tree under that sibling.

Default action for a one-child group:
- merge the levels; or
- add the missing independent necessary steps.

Allow an exception only when the extra level adds genuine control value, such as a contractual handoff boundary or a required abstraction layer.

---

# 5. Going up

To find a higher level, focus on a strategy and ask:

> Why do we need this objective? We need it in order to achieve what?

That answer suggests the higher strategy.

Then supply the higher tactic and re-check that the lower group is sufficient for it.

This makes S&T useful even when planning begins in the middle of a problem.

---

# 6. Choosing a starting point

Prefer a high-level objective near the purpose of the system or initiative.

Ask:
- What purpose must this project serve?
- Why does this system exist?
- What observable outcome would make the project worth doing?

If several objectives are independent and neither is merely a means to the other, represent them as distinct steps, usually within a common higher group.

Avoid starting with a tool.

Bad:
> Use GitHub.

Better:
> Planning state survives across sessions.

Only later ask how to achieve that objective.

---

# 7. Stop conditions for AI planning

The original method leaves depth partly contextual. AI needs a stronger stopping rule.

A leaf is executable when the intended actor can perform it without another planning decision that materially changes the work.

A leaf should have:
- action;
- scope/boundary;
- required inputs;
- objective completion evidence;
- known dependencies;
- no blocking unknown.

Stop before decomposition becomes mechanical implementation trivia.

Do not force every line of code, click, or command into the S&T tree.

---

# 8. Epistemic hygiene: facts are not assumptions

AI systems frequently produce fluent uncertainty as if it were established fact. S&T becomes unreliable if this is allowed.

Use explicit categories:

## Fact
Observed, measured, supplied by the user, or supported by a source.

## Assumption
Believed for planning purposes but not established.

## Decision
A deliberate choice among alternatives.

## Unknown
A question whose answer is not yet known.

## Risk
An uncertainty whose outcome could materially affect the plan.

## Evidence
An observation that proves or strongly demonstrates an objective/condition.

A plan should say "unknown" rather than hallucinate a convenient answer.

---

# 9. Current reality before solution design

Before deep decomposition, capture only the current reality that can change the plan:

- existing system/process;
- relevant constraints;
- actors;
- assets already available;
- pain/problem;
- prior decisions that still bind;
- known failure modes.

Do not create an encyclopedic context dump.

The test is:

> Would this information change a node, assumption, decision, or review?

If not, it probably does not belong in the planning core.

---

# 10. Success evidence

A strategy should be testable enough that a reviewer can distinguish "achieved" from "we worked on it."

For project goals, capture:
- outcome;
- acceptance evidence;
- guardrails;
- unacceptable regressions.

Evidence should validate the strategy, not merely the tactic.

Weak:
> A script was written.

Stronger:
> A fresh GPT session can initialize a new project, reconstruct planning status from repository files, and produce the correct next planning action without chat history.

---

# 11. Alternatives

Alternatives belong where several different tactics could each be sufficient for the same strategy.

Do not pretend all alternatives are necessary.

Recommended representation:

```yaml
decision:
  strategy: "Planning state persists across sessions"
  considered_tactics:
    - "Git repository files"
    - "Database service"
    - "External planning SaaS"
  selected: "Git repository files"
  rationale: "Already available, versioned, inspectable, no service to operate"
```

Alternatives can occur in two legitimate places:

1. **Within a step** — another tactic could also be sufficient for the same strategy.
2. **Between levels** — another complete lower-level group could also be sufficient for the same higher step.

Alternatives do not belong on a necessary connection: if A and B are alternatives, neither is individually necessary in that formulation.

Once a tactic/group is selected, the active tree follows it. Preserve rejected alternatives in decision history, not as active required branches.

---

# 12. Numbering and stable identity

Large S&T trees need stable references.

The original paper proposes location-oriented numbering so a step can be identified by its level, group, and position. S&T Planner V1 deliberately uses simpler stable hierarchical IDs such as `0`, `1`, `1.2`, `1.2.3`.

The ID is an identifier, not an argument. Do not encode schedule, priority, or status into it.

If future real-world trees require a richer location scheme, evolve the representation without changing the S&T logic.

---

# 13. Logical hierarchy is not a schedule

When diving down, the lower tactics are details of how the parent tactic is performed. That relationship is logical decomposition, not a timeline.

Do not infer execution order merely from parent/child position.

V1 uses one minimal execution-order mechanism only when needed:

```yaml
depends_on:
  - "2.1.3"
```

Normally this appears only on implementation-ready leaves.

It means the referenced node outcome is a real prerequisite for executing this node. It does not mean "do this first because it seems convenient."

Rules:
- reference existing implementation-ready leaf S&T node IDs;
- dependencies are execution prerequisites between leaves, not parent/child logic;
- no self-dependency;
- dependencies must be acyclic;
- omit the field content when no prerequisite exists;
- do not encode priority, dates, estimates, or scheduling policy.

At execution handoff, these node dependencies remain in TREE. Numbered executor chats read them directly and check prerequisite node execution state in EXECUTION.yaml.

---

# 14. Special cases deferred in V1

The original material notes additional cases such as supporting steps, multiple parents, and time dependency. They are real planning concerns, but they are **not part of the V1 core model**.

The V1 rule is deliberately simple:

- If a step is merely helpful but not necessary, do not force it into the required S&T tree. Record it in notes for later review.
- If one step appears to belong to more than one parent, do not invent a graph model yet. Record the ambiguity and keep the clearest single-parent representation until the case is reviewed.
- If execution order matters, use the minimal leaf `depends_on` relation. Do not redesign the S&T hierarchy to represent chronology and do not add richer scheduling semantics.

These cases must not be "solved" prematurely. If they become common in real projects, design their representation as a separate, evidence-driven stage.

---

# 15. Risks

Risk is not automatically an S&T child.

Create a child only when an action is necessary to achieve the strategy under the accepted constraints.

Otherwise record risk with:
- trigger/cause;
- consequence;
- probability confidence if useful;
- mitigation;
- contingency;
- affected nodes.

If mitigation becomes mandatory, it can become a necessary step.

---

# 16. AI-specific anti-patterns

## 16.1 Arbitrary phase count

Failure:
> "Here is a 12-step plan."

Fix:
Let the logical decomposition determine the count.

## 16.2 Tool-first planning

Failure:
> "We should use Kubernetes/GitHub/Postgres."

Fix:
State the objective first. Choose tooling only when justified by an objective and assumptions.

## 16.3 Strategy/tactic echo

Failure:
- Strategy: "The system is documented."
- Tactic: "Document the system."

Fix:
The tactic must describe an action sufficient to create a more specific objective, not merely convert noun to verb.

## 16.4 Checklist masquerading as logic

Failure:
A long list of good ideas with no necessity/sufficiency proof.

Fix:
Removal-test every child and gap-test the group.

## 16.5 Hidden assumptions

Failure:
AI silently assumes budget, access, data, permissions or actor skill.

Fix:
Expose material assumptions and unknowns.

## 16.6 Infinite decomposition

Failure:
Every leaf is expanded forever.

Fix:
Stop at the intended actor's executable granularity.

## 16.7 Planning theatre

Failure:
Documents grow but decisions do not improve.

Fix:
KISS review. Delete planning artifacts that provide no control, rationale, handoff, or validation value.

## 16.8 Premature execution allocation

Failure:
Allocating implementation work to executor chats while the intended S&T plan is still incomplete.

Fix:
Complete and freeze the whole intended plan first; allocate implementation-ready leaves afterward.

---

# 17. Whole-plan completeness beyond local sufficiency

Local sufficiency is necessary but not always enough for AI planning.

A planner can build a perfectly coherent subtree around an incomplete framing of the problem. If a material concern never entered the root tactic or its children, local sufficiency checks may never challenge it.

Therefore the final review adds an **outside-in coverage audit**:

1. Return to the desired outcome and hard constraints in GOAL.
2. Trace each meaningful clause to the planning logic that protects it.
3. Assume every leaf succeeds; ask what could still make the desired outcome fail that the project should have handled.
4. Challenge materially relevant actors, interfaces/boundaries, external dependencies, and failure paths.
5. Walk a few representative end-to-end scenarios.
6. Check that non-goals did not leak into required work.

This is a review technique, not another data model.

Do not create a generic checklist of every possible software concern (security, scale, UI, operations, etc.) unless the goal/current reality makes that concern material. Otherwise the framework would encourage speculative scope.

Persist only what the audit changes:
- missing required work → TREE;
- unresolved material question → DECISIONS;
- review finding/correction → REVIEWS.

---

# 18. Review protocol

Run authoring and review as separate mental passes.

## Pass A — Structural
- Every active node has Strategy + Tactic.
- IDs and parent links are valid.
- Active decompositions normally have 2+ children.
- Deferred special cases are not disguised as ordinary required children.

## Pass B — Necessity
For each child:
- Remove it mentally.
- Challenge why the parent cannot still succeed.
- Downgrade optional/supporting work.

## Pass C — Sufficiency
For each parent:
- Assume all children succeed.
- Ask what could still be missing.
- Record already-satisfied conditions as facts.

## Pass D — Parallel logic
For each step:
- Is the tactic feasible?
- Why this tactic?
- Does it actually achieve the strategy?
- Is another independent action hidden inside it?

## Pass E — Epistemic
- Facts supported?
- Assumptions marked?
- Unknowns visible?
- Decisions and alternatives recorded?

## Pass F — KISS
- Can we remove nodes/documents/tools without weakening the proof?
- Are we solving today's requirement rather than imagined future scale?

## Pass G — Executability
- Are leaves actionable by the intended actor?
- Is completion observable?
- Are blocking decisions resolved?

---

# 19. Project management state

The recommended target-project state is:

```
.planning/
├── README.md
├── GOAL.md
├── TREE.yaml
├── STATUS.yaml
├── DECISIONS.md
├── REVIEWS.md
├── EXECUTION.yaml
├── EXECUTOR_HANDOFF.md
└── validate-allocation.mjs
```

Purpose:

- `GOAL.md`: stable problem/outcome boundary.
- `TREE.yaml`: the actual S&T work model — rationale, decomposition, dependencies, and success evidence.
- `STATUS.yaml`: minimal planning resume point, active/frozen planning state, and separate implementation-authorization gate.
- `DECISIONS.md`: material unresolved questions and resolved choices.
- `REVIEWS.md`: planning/replanning audit evidence.
- `EXECUTION.yaml`: post-freeze management only — numbered chat allocation plus execution state/result for S&T leaf IDs.
- `EXECUTOR_HANDOFF.md`: stable repository-only fresh-executor bootstrap, context-routing rules, and mandatory handoff-verification contract; it never duplicates task content.
- `validate-allocation.mjs`: zero-dependency helper that mechanically validates the frozen TREE → EXECUTION projection before authorization; it stores no state.

This is intentionally small.

Do not create one file per node and do not create another task database unless real usage proves a need.

---

# 20. Execution is the S&T tree itself

The frozen implementation-ready S&T leaves are already the execution work units.

There is **no mandatory translation step** from S&T leaves into another task system.

In particular, the S&T Planner workflow does **not** require GitHub Issues.

The normal V1 flow is:

```
frozen TREE.yaml + implementation_authorized: false
→ allocate leaf node IDs in EXECUTION.yaml
→ mechanically validate allocation
→ simulate mandatory fresh executors via EXECUTOR_HANDOFF.md
→ record handoff verification in REVIEWS.md
→ fix/recheck any failed case
→ explicitly set implementation_authorized: true
→ executor chat reads EXECUTOR_HANDOFF.md and its node IDs
→ executor reads the actual Strategy/Tactic directly from TREE.yaml
→ execute
→ verify success_evidence
→ update state/result in EXECUTION.yaml
```

## 20.1 Source of truth during execution

Keep ownership simple:

| Concern | Source |
|---|---|
| Why the work exists | `TREE.yaml -> strategy` |
| How the work is intended to be done | `TREE.yaml -> tactic` |
| Planning rationale | assumptions / decisions |
| Execution prerequisites | `TREE.yaml -> depends_on` |
| Definition of success | `TREE.yaml -> success_evidence` |
| Which chat owns the work | `EXECUTION.yaml` |
| pending / in_progress / done / blocked | `EXECUTION.yaml` |
| Short implementation/verification result | `EXECUTION.yaml -> result` |
| Actual code history | normal Git commits/PRs when the project uses them |

Do not copy Strategy/Tactic descriptions into EXECUTION.

Do not recreate each leaf as a second task description.

## 20.2 Practical executor workflow

A numbered executor chat should:

1. read target `AGENTS.md` and `.planning/EXECUTOR_HANDOFF.md`;
2. confirm the plan is frozen;
3. confirm `implementation_authorized: true`;
4. read its assigned leaf IDs from `EXECUTION.yaml`;
5. load those exact nodes from `TREE.yaml`;
6. check each node's `depends_on` leaves and their EXECUTION states;
7. use handoff/context-routing rules to read only decisions/project context required by runnable nodes;
8. mark an available node `in_progress`;
9. perform its Tactic;
10. verify its `success_evidence`;
11. mark it `done` and record a short result/reference.

That is the execution-management loop.

GitHub Issues may still be used by a target project for unrelated organizational reasons, but they are **not part of the S&T Planner methodology and must not be introduced merely to execute the S&T plan**.

## 20.3 Why this matters

Creating a second task object for every S&T leaf would duplicate:
- identity;
- scope;
- rationale;
- dependencies;
- acceptance criteria;
- status linkage.

Direct execution from S&T node IDs keeps planning and implementation connected and reduces synchronization errors.

Before first authorization, `node .planning/validate-allocation.mjs --initial` mechanically proves the allocation shape. Use `--resume` after execution/replanning so valid completed work may remain completed. `--serial-chats` is optional and applies only when a target explicitly treats chat numbers as execution order; ordinary parallel-capable allocation must not infer serial order from numbering alone.

Execution can still falsify assumptions. When that happens, mark the affected execution node blocked, set `implementation_authorized: false`, and return the defect to planning rather than improvising.

---

# 21. Adaptive planning depth

V1 has **no QUICK/DEEP mode**.

The S&T logic is always the same. The tree simply grows only as deep as the problem requires.

For a small, obvious, reversible change:
- the tree may stay shallow;
- few assumptions may need written explanation;
- review may be short.

For an ambiguous, costly, architectural, or long-lived project:
- the tree will naturally become deeper;
- more decisions and assumptions will be material;
- review will naturally be broader.

Do not ask the user or GPT to choose a planning mode.

Use one stopping rule:

> Continue decomposing only while additional decomposition materially improves implementation readiness or logical confidence.

This removes configuration while preserving rigor.

---

# 22. A compact node schema

Node IDs are YAML map keys; do not duplicate an `id` field inside each node. V1 also has no `kind` field.

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

### Relationship placement

The lists are intentionally stored this way:

- Parallel assumptions live on the node because they justify that node's **Tactic → Strategy** claim.
- Necessary assumptions live on the child because they justify the **child → parent** necessity claim.
- Sufficiency assumptions live on the parent because they justify the **children as a group → parent** sufficiency claim.

Do not add a separate edge structure in V1. The parent relationship is derived from `children`.

The schema may evolve, but additions must justify their cost.

### V1 tree invariants

- `root` must reference an existing node.
- Every ID in `children` must reference an existing node.
- In V1, every non-root node has exactly one logical parent.
- The child graph must be acyclic.
- Node status is local: `approved` means that node's own logic and immediate decomposition passed review; it does not approve the full subtree.
- `draft` means normal unfinished planning.
- `blocked` is reserved for a node that cannot advance because of a **material unresolved question**.
- Every blocked node must be referenced by at least one open D-entry in `DECISIONS.md`; do not duplicate the reason in a TREE `blocked_by` field.
- Blocking does not cascade automatically.
- Only `draft`, `blocked`, and `approved` are valid node statuses.
- Approved nodes have explicit Strategy, Tactic, material assumptions, and success evidence.
- A parent with children records why those children are sufficient together.
- A non-root child records why it is necessary for its parent.

Keep stable current-reality facts in GOAL, material unresolved questions/alternatives in DECISIONS, review history in REVIEWS, and resume state in STATUS rather than growing TREE into a general-purpose database.

---

# 23. Reading an S&T plan to a fresh reviewer

When presenting a completed tree to someone who did not build it, use the source method's logic:

1. Start at the top.
2. Before presenting a lower group, read the group's necessary assumptions so the listener understands why the branches are needed.
3. Pair each necessary assumption with its corresponding child strategy.
4. Read the higher step's sufficiency assumptions so the listener understands why the group is enough.
5. Then read each child's Strategy + Tactic + parallel assumptions.

This order deliberately explains **why the lower steps exist before asking the listener to absorb their implementation detail**.

---

# 24. Definition of "good enough"

A perfect tree is not the goal. A decision-quality and execution-quality tree is.

The plan is good enough when:
- the desired outcome is unambiguous;
- material constraints are modeled;
- active children survive necessity challenges;
- sibling groups survive sufficiency challenges;
- tactics are feasible under explicit assumptions;
- important alternatives are decided or intentionally left open;
- all intended execution leaves are implementation-ready;
- the complete intended tree has passed Final Planning Review;
- repository-only fresh-executor simulations have proven that authorization, assignment, dependencies, context routing, and blockers are recoverable without planning-chat memory;
- additional decomposition would not materially improve execution.

That is the point at which the plan can be frozen and execution allocation can be generated. Freeze still does not authorize implementation; authorization is a separate post-handoff gate.
