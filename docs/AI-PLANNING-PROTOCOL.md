# AI Planning Protocol

This is the operational flow an AI follows when using S&T Planner.

The protocol is intentionally small. Do not add process unless real use proves it necessary.

## 0. Select planning depth

Use **QUICK** when the task is localized, low-risk, reversible, and already well understood.

Use **DEEP** when the task is ambiguous, architectural, cross-cutting, expensive, long-lived, or difficult to reverse.

If uncertain, start QUICK and deepen only where uncertainty appears.

## 1. Establish the planning boundary

Before creating tasks, write or update `.planning/GOAL.md`.

Capture only information that can change the plan:

- desired outcome;
- current reality;
- constraints;
- non-goals;
- success evidence;
- material unknowns.

Do not solve the problem yet.

### Gate

Do not build the tree while the desired outcome is materially ambiguous.

## 2. Create the root S&T step

Create one root node in `.planning/TREE.yaml`:

- Strategy: the outcome that must exist.
- Tactic: the chosen high-level way to achieve it.
- Parallel assumptions: why this tactic can achieve the strategy.
- Evidence: how the strategy will be recognized as achieved.

If no tactic can yet be chosen responsibly, record the decision as open instead of guessing.

## 3. Decompose one parent at a time

For the selected parent tactic ask:

> How exactly must this action be performed?

Propose the smallest set of independent lower actions.

For every proposed child:

1. write the child tactic;
2. state the objective created by that action as the child strategy;
3. explain why the child is necessary for the parent;
4. verify the child tactic can achieve the child strategy.

Then test the sibling group:

> If all children succeed, is anything else still required for the parent?

If yes, the group is not sufficient.

Do not choose a number of children in advance.

## 4. Stop at executable leaves

Stop decomposing a branch when the intended actor can perform the leaf without another material planning decision.

An executable leaf has:

- a clear action;
- clear scope;
- required inputs known;
- objective completion evidence;
- no blocking unknown.

Do not decompose into trivial clicks, commands, or code lines unless that detail is genuinely needed for handoff.

## 5. Review separately from authoring

After a coherent branch exists, switch from author to critic.

Run the review gates in `QUALITY-GATES.md`.

A review must try to break the plan, not merely approve what was just written.

If a defect is found, correct the smallest affected part of the tree and review upward until the logic is sound again.

## 6. Run KISS review

Ask:

- What can be removed without making the parent insufficient?
- Did we introduce a tool before proving the objective that needs it?
- Are we solving a hypothetical future problem?
- Is documentation larger than the decisions it protects?
- Is a "required" step actually only helpful?

Prefer the smallest logically complete plan.

## 7. Freeze the next execution horizon

Do not require the entire future to be decomposed to microscopic detail.

Planning is deep enough when the next meaningful execution horizon is composed of executable leaves and unresolved future detail cannot change that work.

Mark approved nodes accordingly.

## 8. Persist session state

Before ending a planning session, update `.planning/STATUS.yaml`.

A fresh session must be able to determine:

- current mode;
- current phase;
- current node;
- approved scope;
- open blockers;
- next action;
- whether implementation is allowed.

Chat history is supplementary, never the source of truth.

## 9. Compile approved leaves into execution work

Only after planning gates pass.

For every implementation task retain:

- S&T node ID;
- action;
- completion evidence;
- relevant constraints.

GitHub Issues may be used, but they are output of the plan, not the planning model itself.

## 10. Learn from execution

If implementation disproves an assumption:

1. record the new fact;
2. identify the affected S&T node;
3. reopen the smallest affected branch;
4. revise it;
5. re-run review upward;
6. continue execution when the affected horizon is valid again.

Do not preserve a plan merely because it was previously approved.

---

# Fresh-session bootstrap

When entering an existing project:

1. Read the repository's root `AGENTS.md` if present.
2. Read `.planning/README.md`.
3. Read `.planning/STATUS.yaml`.
4. Read `.planning/GOAL.md`.
5. Read only the active portion of `.planning/TREE.yaml` needed by STATUS.
6. Read referenced decisions/reviews only when needed.
7. Continue the exact next planning action.

This ordering keeps context small while preserving correctness.
