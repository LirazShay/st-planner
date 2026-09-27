# AGENTS.md — S&T Planner Operating Contract

This repository defines a reusable planning protocol. When an AI agent works here, or uses this framework for another project, these rules are mandatory unless the user explicitly overrides them.

## 1. Planning before implementation

For meaningful work, do not jump from a request directly to implementation.

First establish:
- desired outcome;
- current reality;
- constraints;
- non-goals;
- success evidence;
- important unknowns.

Small and obvious work may use QUICK mode. Ambiguous, expensive, architectural, cross-cutting, or multi-step work uses DEEP mode.

## 2. Use S&T logic, not arbitrary task lists

Every S&T step contains:
- Strategy: the objective / result ("what for?");
- Tactic: the action chosen to achieve that objective ("how?");
- Parallel assumptions: why this tactic is feasible, appropriate and sufficient for this strategy.

Every child step also records:
- Necessary assumption: why this child is necessary for the parent;
- Parent relationship;
- Evidence or acceptance signal when applicable.

Every parent group records:
- Sufficiency assumption: why the children, together, are sufficient for the parent.

Do not decide in advance that a plan has 5, 12, 50, or 100 steps. The number and depth must emerge from the logic.

## 3. Decomposition rule

To go down one level, inspect the parent tactic and ask:

> How exactly must this action be performed?

Create lower steps only for actions that are independently necessary parts of performing the parent tactic.

For every proposed child:
1. state the objective produced by that action;
2. verify the action is sufficient for that objective;
3. challenge whether the child is truly necessary;
4. verify that removing it would make the remaining group insufficient.

A normal decomposition has more than one child. A single child usually indicates rewording rather than genuine decomposition; either merge the levels or explicitly justify the exception.

## 4. Completion rule

A branch may stop decomposing when its leaf is executable by the intended actor with:
- enough context to act;
- clear boundaries;
- objective completion evidence;
- no unresolved decision that materially changes the action.

"Executable" is contextual. A senior engineer may need less decomposition than a novice or a cross-team handoff.

## 5. Necessity and sufficiency audits

Before freezing a parent:
- Necessity test: remove each child mentally. If the parent can still be achieved without replacement, challenge or remove that child.
- Sufficiency test: assume all children succeed. If the parent may still fail because a missing action is required, add or resolve the gap.
- Existing-condition test: do not create work for a necessary condition that already exists; record it as an assumption/fact instead.
- Alternative test: alternatives belong under a sufficiency choice, not as multiple simultaneously required tactics for the same strategy.

## 6. Separate epistemic states

Never blur:
- Fact — observed or sourced.
- Assumption — believed but not yet established.
- Decision — chosen among alternatives.
- Unknown — unresolved information.
- Risk — uncertain event with material consequence.
- Evidence — observation demonstrating a condition or outcome.

If uncertainty matters to the plan, expose it instead of silently inventing certainty.

## 7. KISS audit

The planner exists to improve execution, not create planning bureaucracy.

Challenge:
- speculative future requirements;
- unnecessary tooling;
- premature architecture;
- duplicate nodes;
- documentation that does not change a decision;
- decomposition below useful execution granularity.

Prefer the smallest structure that preserves the logical proof.

## 8. Persistent state

Chat history is not the project memory.

The target repository's `.planning/` directory is the durable planning state. Keep at minimum:
- `GOAL.md`
- `TREE.yaml`
- `STATUS.yaml`
- `DECISIONS.md`
- `REVIEWS.md`

After meaningful planning work, update the durable state before ending the work session.

## 9. Status discipline

`STATUS.yaml` must make it possible for a fresh AI session to answer:
- What mode are we in?
- What has been approved?
- What is the current node or review?
- What blocks progress?
- What is the next planning action?
- Is implementation currently allowed?

Do not rely on prose buried in chat history.

## 10. Review roles

Authoring and criticism are separate passes.

A review should actively search for:
- missing necessary conditions;
- unsupported sufficiency claims;
- tactics that merely restate strategies;
- children that are means to another child rather than independent necessities;
- circular logic;
- hidden alternatives;
- assumptions presented as facts;
- premature implementation detail;
- over-engineering;
- leaves that are not actually executable.

## 11. Special cases: keep V1 simple

Multiple parents, supporting steps, and time dependency are acknowledged but not fully modeled in V1.

For now:
- never call a merely helpful step "necessary";
- record unusual shared-parent cases as an open planning note instead of inventing a graph model;
- record important ordering as a simple dependency note rather than distorting the S&T hierarchy.

Do not add machinery for these cases until real use demonstrates that it is needed.

## 12. Compiling into work

Do not treat GitHub Issues as the source of truth while the logic is still changing.

After the relevant plan is approved:
1. select executable leaves;
2. group only when grouping preserves traceability;
3. create implementation tasks/issues;
4. retain each task's S&T node ID;
5. include completion evidence;
6. update planning state when execution reveals a false assumption.

Issues are compiled execution output; the S&T model remains the rationale.

## 13. Change control

A frozen plan is not immutable.

When reality contradicts an assumption:
- record the new fact;
- identify affected nodes;
- reopen only the necessary portion of the tree;
- re-run necessity/sufficiency review upward until the impact is contained;
- preserve the decision history.

## 14. Definition of a planning-complete project

Planning is complete enough for execution when:
- the goal and success evidence are explicit;
- relevant constraints and non-goals are explicit;
- each active step has Strategy + Tactic;
- material assumptions are exposed;
- each decomposition passes necessity and sufficiency checks;
- unresolved unknowns do not block the next executable work;
- leaves are executable;
- KISS review passed;
- status is durable and understandable by a fresh session.

Do not claim certainty beyond the evidence.
