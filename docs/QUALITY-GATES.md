# S&T Planner Quality Gates

Use these gates as a review checklist. A node or branch does not need ceremony; it needs defensible logic.

## Gate 1 — Goal clarity

Pass when:

- desired outcome is understandable without chat history;
- established current reality is separated from assumptions;
- constraints that materially change the plan are explicit;
- non-goals prevent obvious scope drift;
- material unresolved questions are represented as open D-entries rather than buried in GOAL or reviews.

## Gate 2 — Step validity

For each active node:

- Strategy states an objective, not an activity.
- Tactic states an action, not the same sentence rewritten as a verb.
- Parallel assumptions explain why the tactic is a valid way to achieve the strategy.
- Success evidence tests the strategy rather than merely proving that work occurred.

## Gate 3 — Necessity

For each required child:

> Remove this child. Could the parent still be achieved without replacing it?

If yes, the child fails the necessity test.

Possible corrections:

- delete it;
- mark it as non-required note/supporting idea;
- merge it with another child;
- reveal that it was actually an alternative.

## Gate 4 — Sufficiency

For each parent:

> Assume every child succeeds. What required condition could still be missing?

If a missing action exists, the group fails.

If the missing condition already exists in current reality, record it as a fact/assumption rather than manufacturing a task.

## Gate 5 — Assumption honesty

Pass when:

- material facts are distinguishable from assumptions;
- unknowns are not silently guessed;
- selected alternatives are recorded as resolved D-entries;
- material unresolved questions have open D-entries;
- reviews reference those D-entries instead of creating a second source of truth;
- confidence is not overstated.

## Gate 6 — KISS

Pass when:

- no node exists only for speculative future needs;
- tooling follows requirements rather than leading them;
- no duplicate work exists;
- planning files remain small enough for a fresh AI to read efficiently;
- decomposition has stopped before implementation trivia.

## Gate 7 — Executability

A leaf passes when the intended actor can begin without another material design decision.

It must identify:

- action;
- scope;
- required inputs;
- objective completion evidence;
- blocking dependencies, if any.

## Gate 8 — Tree-state consistency

Pass when:

- every child reference resolves to a node;
- every non-root V1 node has one logical parent;
- the tree is acyclic;
- node statuses use only draft / blocked / approved;
- blocked status is applied only to the node actually blocked;
- approved status is not treated as recursive approval of descendants;
- approved nodes have concrete success evidence.

## Gate 9 — Fresh-session continuity

A project passes when a new AI session, using only repository state, can correctly state:

1. the goal;
2. the active planning node;
3. the important unresolved issue;
4. the next action;
5. the exact implementation scope;
6. which relevant nodes are draft, blocked, or approved.

## Gate 10 — Execution release

Implementation may begin for the approved horizon when:

- Gates 1–9 pass for that horizon;
- unresolved future questions cannot invalidate the next work;
- the exact approved executable leaves appear in `STATUS.yaml -> implementation_scope`.

An empty implementation scope means no implementation.

---

# Final review questions

Before calling a planning horizon ready, ask:

1. What important thing might we have forgotten?
2. Which child would we most like to delete? Test it.
3. Which assumption is carrying the most weight?
4. What did we treat as fact without evidence?
5. Did a technology choice sneak in before its requirement?
6. If all leaves succeed, can the parent still fail?
7. Could a fresh session continue correctly without this chat?
8. Is there a simpler plan with the same logical coverage?

If an answer exposes a material defect, fix the plan and re-run the affected gates.
