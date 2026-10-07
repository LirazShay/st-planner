# Plan

> Project-owned planning truth. Keep this document focused on the current scope and the reasoning needed to execute it correctly. Do not add process state merely to show that planning happened.

## Outcome

<What must be true when this scope succeeds?>

## Relevant current reality

- <Facts, existing behavior, constraints, capabilities, or failures that can materially change the plan.>

## Constraints / non-goals

- <Hard constraint or already-fixed durable decision.>
- <Explicit non-goal, if useful.>

## Material decisions / open questions

Keep only decisions or unknowns that can materially change product behavior, architecture, cross-cutting constraints, costly-to-reverse work, or the plan itself.

- <Decision/question and current resolution, or link to DECISIONS.md if this section became too large.>

## S&T reasoning

Use as much structure as the real reasoning requires. Do not create nodes only to satisfy a template.

### <ID> — <short outcome name>

**Strategy**  
<Required outcome.>

**Tactic**  
<Selected way to achieve it.>

**Why this tactic**  
<Assumptions/evidence that make the tactic valid; include materially plausible alternatives when they could change the decision.>

**Necessary for parent**  
<Why this outcome is independently required for its parent, when applicable.>

**Children sufficient because**  
<Why the listed children are enough together, when this node is decomposed.>

**Success evidence**
- <Objective proof that the Strategy/outcome was achieved.>

**Children**
- <ID> — <child outcome>

Repeat only for material nodes. Stop when leaves are decision-complete, practically executable, and verifiable.

## Final planning review

Confirm before implementation of this scope:

- outcome boundary is correct;
- material Tactics are justified;
- materially plausible alternatives were handled where relevant;
- required children are necessary;
- sibling groups are sufficient together;
- assumptions, facts, unknowns, and decisions are not conflated;
- leaves require no new material design/product/architecture decisions;
- success evidence is objective;
- no simpler equally effective plan was missed;
- no unnecessary planning/process machinery was introduced.

### Unresolved material findings

- None / <finding that still changes the plan>

## Implementation-ready leaves

List only the final leaf IDs that should appear in `EXECUTION.md`.

- <ID>
