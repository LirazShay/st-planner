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

Ordering is one of the advanced cases intentionally kept simple in V1.

---

# 14. Special cases deferred in V1

The original material notes additional cases such as supporting steps, multiple parents, and time dependency. They are real planning concerns, but they are **not part of the V1 core model**.

The V1 rule is deliberately simple:

- If a step is merely helpful but not necessary, do not force it into the required S&T tree. Record it in notes for later review.
- If one step appears to belong to more than one parent, do not invent a graph model yet. Record the ambiguity and keep the clearest single-parent representation until the case is reviewed.
- If execution order matters, record a plain-text dependency note. Do not redesign the S&T hierarchy to represent chronology.

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

## 16.8 Premature issues

Failure:
Opening dozens of GitHub Issues before the plan stabilizes.

Fix:
Freeze the relevant tree first; compile executable leaves afterward.

---

# 17. Review protocol

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

# 18. Planning state for GPT

The recommended target-project state is:

```
.planning/
├── README.md
├── GOAL.md
├── TREE.yaml
├── STATUS.yaml
├── DECISIONS.md
└── REVIEWS.md
```

Purpose:

- `GOAL.md`: stable problem/outcome boundary.
- `TREE.yaml`: machine-readable rationale and decomposition.
- `STATUS.yaml`: minimal resume point.
- `DECISIONS.md`: alternatives and why choices were made.
- `REVIEWS.md`: audit evidence and open defects.

This is intentionally small.

Do not create one file per node unless project scale proves it necessary.

---

# 19. Planning versus execution

The S&T model is the rationale.

Execution tools are projections of that rationale:
- GitHub Issues;
- milestones;
- pull requests;
- checklists;
- project boards.

The projection may change without losing the reason the work exists.

Every generated task should retain its S&T node ID so execution can be traced back to the strategy.

Execution can also falsify assumptions. When that happens, update the plan rather than forcing reality to match the old plan.

---

# 20. Adaptive planning depth

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

# 21. A compact node schema

```yaml
id: "1.2"
kind: required

strategy: "A fresh AI session can recover planning state"

tactic: "Persist the minimal planning state in version-controlled project files"

parallel_assumptions:
  - "The target project already has a Git repository"
  - "Plain text files are sufficient for the initial state model"

necessary_assumptions:
  - "Without persistent state, a new session cannot reliably reconstruct prior planning decisions"

sufficiency_assumptions: []

success_evidence:
  - "A fresh session reads only repository state and identifies the correct next action"

children:
  - "1.2.1"
  - "1.2.2"

status: approved
```

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

Keep facts/unknowns in GOAL, alternatives in DECISIONS, review history in REVIEWS, and resume state in STATUS rather than growing TREE into a general-purpose database.

---

# 22. Reading an S&T plan to a fresh reviewer

When presenting a completed tree to someone who did not build it, use the source method's logic:

1. Start at the top.
2. Before presenting a lower group, read the group's necessary assumptions so the listener understands why the branches are needed.
3. Pair each necessary assumption with its corresponding child strategy.
4. Read the higher step's sufficiency assumptions so the listener understands why the group is enough.
5. Then read each child's Strategy + Tactic + parallel assumptions.

This order deliberately explains **why the lower steps exist before asking the listener to absorb their implementation detail**.

---

# 23. Definition of "good enough"

A perfect tree is not the goal. A decision-quality and execution-quality tree is.

The plan is good enough when:
- the desired outcome is unambiguous;
- material constraints are modeled;
- active children survive necessity challenges;
- sibling groups survive sufficiency challenges;
- tactics are feasible under explicit assumptions;
- important alternatives are decided or intentionally left open;
- executable leaves exist for the next horizon;
- a fresh session can continue without private chat context;
- additional decomposition would not materially improve execution.

That is the point at which planning should stop and work should begin.
