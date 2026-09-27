# S&T Planner Quality Gates

Use these gates as a review checklist. A node or branch does not need ceremony; it needs defensible logic.

## Gate 1 — Goal clarity

Pass when:

- desired outcome is understandable without chat history;
- success evidence is observable;
- constraints that materially change the plan are explicit;
- non-goals prevent obvious scope drift;
- blocking unknowns are visible.

## Gate 2 — Step validity

For each active node:

- Strategy states an objective, not an activity.
- Tactic states an action, not the same sentence rewritten as a verb.
- Parallel assumptions explain why the tactic is a valid way to achieve the strategy.
- Evidence tests the strategy rather than merely proving that work occurred.

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
- selected alternatives are recorded as decisions;
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

## Gate 8 — Fresh-session continuity

A project passes when a new AI session, using only repository state, can correctly state:

1. the goal;
2. the current planning phase;
3. the active node or scope;
4. the important unresolved issue;
5. the next action;
6. whether implementation is currently allowed.

## Gate 9 — Execution release

Implementation may begin for the approved horizon when:

- Gates 1–8 pass for that horizon;
- unresolved future questions cannot invalidate the next work;
- STATUS explicitly says implementation is allowed.

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
