# AI Planning Protocol

Planning depth is adaptive; there is no QUICK/DEEP mode. Use the same S&T rules for every meaningful planning scope and stop decomposing when further detail would not materially improve implementation readiness or logical confidence.

A planning scope may be a whole project/initiative or a meaningful change inside an existing system, including a release, feature, migration, refactor, architectural change, or other substantial change. The user does not need to classify the scope.

## 0. Organize deep reasoning before spending it

S&T depth is not an optimization target. Every material decision still requires the full reasoning justified by its importance, and the whole plan must still pass necessity, sufficiency, implementation-readiness, outside-in coverage, KISS, and Final Planning Review.

The optimization target is duplicated reasoning and planning ceremony.

Before deep decomposition, make a short **structural map** of the current scope:
- outcome and planning boundary;
- material questions/decisions that must be resolved;
- dependency/order between those questions;
- material repository evidence still needed;
- likely major tree areas.

The map is orientation, not approval. It must not select tactics prematurely, skip a material decision, weaken necessity/sufficiency, or replace S&T justification.

Then work in **coherent planning slices**. A slice groups related questions/nodes that should be reasoned about together. Within the slice:
1. gather only evidence that can change the reasoning;
2. perform the full S&T reasoning for every material choice;
3. persist the resulting rationale in GOAL/TREE/DECISIONS as appropriate;
4. use mechanical validation for deterministic checks when practical;
5. review the coherent slice rather than restarting a full review cycle after every small edit.

Once a material decision is justified and durably recorded, treat it as closed inside the current planning effort unless new evidence, a contradiction, a changed assumption, or a concrete review finding could materially change it. Do not reopen it merely for reassurance.

Existing project patterns, previous implementations, or reusable mechanisms are evidence and candidate alternatives only. They never justify a current material tactic by themselves.

## 1. Determine the planning boundary before accepting a solution

Start by identifying what outcome must be true when the requested scope succeeds.

Separate four things that are often mixed together in a user request:
- required outcome;
- established current reality;
- hard constraint / already-fixed decision;
- proposed solution.

A user-proposed feature, tool, technology, architecture, or implementation is normally a **candidate tactic**, not the desired outcome. Treat it as fixed only when the user explicitly makes it a constraint/decision or a durable project contract already does so.

If the request starts from a proposed solution, climb upward by asking internally:

> Why is this needed? What outcome is it intended to create?

Do not challenge a genuinely fixed constraint merely to generate alternatives.

Update `.planning/GOAL.md` with:
- desired outcome;
- established current reality;
- constraints;
- non-goals.

Material unresolved questions go to `DECISIONS.md`.

## 2. Establish only current reality that can change the plan

Use the target repository's normal context-loading/source-of-truth rules.

Inspect only context that could materially change GOAL, TREE, DECISIONS, or a review, such as:
- relevant current behavior/code/contracts;
- actors and boundaries;
- existing capabilities/infrastructure;
- binding decisions;
- material failure modes;
- constraints.

Do not recursively preload the repository.

Investigate before asking the user. Ask only when a material fact or choice cannot be established from repository context/evidence and the answer can change the plan.

## 3. Build and challenge the root

Create the root Strategy, candidate Tactic, parallel assumptions, and success evidence.

For every **material** tactic, including the root, challenge:

1. **Need** — why is this Strategy required inside the current planning boundary?
2. **Tactic validity** — why can this Tactic achieve the Strategy?
3. **Alternatives** — is there another materially plausible tactic that would be preferable under the actual constraints?
4. **Invalidation** — what fact/assumption, if false or changed, would make the choice wrong?

Do not brainstorm alternatives mechanically for trivial/reversible decisions. Challenge depth is proportional to materiality: impact, reversibility, cross-cutting effect, uncertainty, and ability to reshape the tree.

If a material choice cannot yet be resolved, expose it in `DECISIONS.md` rather than guessing. An open decision blocks a TREE node only when continuing would require guessing or could create a materially different subtree.

## 4. Decompose the selected tactic recursively

Only after a tactic is sufficiently justified, ask:

> How exactly must this tactic be performed?

Each child should represent an **independently necessary outcome** required to perform the parent tactic, not merely a project folder, discipline, implementation file, or phase.

For each proposed child:
1. define its Strategy;
2. define its candidate Tactic;
3. explain why the child is independently necessary for its parent;
4. challenge why its tactic can achieve its strategy;
5. challenge a materially plausible alternative when one exists;
6. record material unresolved choices in DECISIONS rather than treating alternatives as children.

For the whole sibling group ask:

> If every child succeeds, what required condition could still be missing?

Also check sibling coherence:
- siblings should live at a coherent logical level;
- a child that merely implements another sibling belongs below that sibling;
- alternatives are not simultaneous necessary children;
- do not generate default `Frontend / Backend / Database / Tests` branches unless those are genuinely independent necessary outcomes.

Do not choose the number of children in advance.

### Feature and release scopes

A feature is an ordinary S&T node/subtree, not a special schema type.

A release may contain multiple feature subtrees only when the parent logic is honest:
- the feature outcomes are jointly necessary for a shared release outcome; or
- each is explicitly required by an approved release scope/commitment.

Release membership by itself is not S&T causality. If a release is merely packaging unrelated changes, do not invent a false causal relationship; each included change still needs its own justification inside the chosen planning boundary.

## 5. Keep decision handling proportional

Ordinary local reasoning belongs in TREE assumptions.

Create/use a `DECISIONS.md` entry only for a material unknown or choice whose resolution can significantly change product behavior, architecture, cross-cutting constraints, implementation scope, costly-to-reverse work, or the tree itself.

For a material decision:
- preserve only materially plausible alternatives;
- record the selected resolution and basis;
- state what would reopen the decision when useful;
- update affected TREE logic after resolution.

Do not turn DECISIONS into a diary of every option the planner briefly considered.

## 6. Continue until implementation-ready leaves

A leaf is ready only when both conditions hold:

1. **Decision-complete** — an executor would not need another material product/design/architecture decision.
2. **Practically executable** — the work is a coherent, manageable unit for an executor chat.

The leaf should provide enough information to derive:
- responsibility;
- scope;
- relevant constraints;
- selected implementation direction and rationale at the level that matters;
- execution prerequisites in `depends_on`, when real;
- success/acceptance evidence.

Do not decompose into trivial implementation steps, exact clicks, or routine file edits unless they themselves are material design constraints.

If a single leaf is too large for a practical executor chat, planning stopped too early even if no new design decision remains; decompose it into coherent necessary outcomes.

## 7. Review deeply, but at coherent boundaries

While building, keep local quality control active:
- Strategy is an outcome, not a disguised tool/feature;
- Tactic → Strategy validity;
- materially plausible alternatives for material tactics;
- assumption honesty and invalidation conditions;
- necessity;
- sufficiency;
- sibling-level coherence;
- KISS;
- tree consistency;
- implementation readiness.

Correct an obvious defect when you find it. But do not interpret this as a requirement to rerun every review dimension after every node or edit.

Prefer:

```text
deep reasoning for a coherent slice
→ persist rationale
→ deterministic checks where available
→ multidimensional slice/subtree review
→ repair concrete findings
→ targeted recheck of affected logic
```

A full review loop should repeat only when a concrete finding or material change justifies it. The same S&T proof depth remains mandatory; repeated review without new information does not increase confidence proportionally.

The same challenge applies recursively at business, product, feature, architecture, component, and technical levels. Do not allow a well-reasoned business top half to degrade into an unchallenged technical checklist below.

Branch approval means the branch logic is sound; it does **not** permit implementation. Neither local approval nor freeze alone authorizes execution.

## 8. Outside-in completeness audit

Before the final review, challenge the tree from the GOAL boundary rather than from its existing branches.

For every meaningful desired-outcome clause and hard constraint, identify where the plan protects it through a node, assumption, decision, or success evidence.

Then ask:

> Assume every planned leaf succeeds exactly as written. Can this planning scope still miss the desired outcome for a reason the plan should have handled?

Also inspect only materially relevant actors, boundaries, dependencies, and failure paths, and walk a small number of representative end-to-end scenarios.

For feature/release work specifically, verify:
- each feature/change is justified by a real outcome or explicit committed scope;
- the release does not use membership as fake causal logic;
- no material product/architecture choice was accepted merely because the user proposed it;
- no expected capability is missing between the current system and requested outcome.

Do not create a separate coverage artifact by default. Persist only defects/corrections in TREE, DECISIONS, and REVIEWS.

## 9. Final whole-plan review

When the intended tree appears complete and the completeness audit finds no unresolved gap, review it as one system.

Planning is complete only if:
- the intended planning boundary is correct;
- desired outcome and proposed solution were not conflated;
- intended scope is fully represented;
- every meaningful desired-outcome clause and hard constraint is accounted for;
- every material tactic has defensible tactic → strategy logic;
- materially plausible alternatives were handled where they could change the choice;
- every required branch is sufficiently decomposed;
- siblings remain logically coherent;
- material decisions are resolved;
- leaves are decision-complete and practically executable;
- cross-branch dependencies needed for execution are understood;
- no important gap appears when the entire tree is considered together;
- KISS review passes.

Record the result in `REVIEWS.md`.

## 10. Freeze

If Final Planning Review passes:
1. record immutable/reproducible evidence for the reviewed baseline in `REVIEWS.md`;
2. verify no material drift with `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>` when Git refs are available, or record equivalent reproducible evidence;
3. if drift exists, keep planning active and review the changed baseline again;
4. set `.planning/STATUS.yaml -> plan_state: frozen` only for the verified reviewed baseline;
5. keep `.planning/STATUS.yaml -> implementation_authorized: false`.

If merge/rebase/integration later creates a different frozen ref, verify that resulting ref too before execution handoff.

Freeze closes the planning baseline. It does not start implementation.

## 11. Handoff to execution

Do not create a second task system.

After the plan is frozen:

1. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
2. collect every implementation-ready leaf;
3. allocate every leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`;
4. initialize each node as `pending`;
5. leave Strategy/Tactic/success evidence in TREE rather than copying them into EXECUTION or EXECUTOR_HANDOFF;
6. run `node .planning/validate-allocation.mjs --initial` and fix every failure; add `--serial-chats` only for explicitly serial numbered chats;
7. follow `.planning/EXECUTOR_HANDOFF.md` and simulate the mandatory representative fresh executors from repository state only;
8. record the handoff verification in `REVIEWS.md`;
9. fix and rerun any failed simulation;
10. explicitly set `.planning/STATUS.yaml -> implementation_authorized: true`.

No executor may start before step 10.

### Chat allocation

Choose the number of chats from the actual amount and shape of work.

Priorities:

1. coherent implementation context/responsibility;
2. valid dependency flow;
3. manageable amount of work per chat;
4. reasonable load balance.

There is no fixed number of leaves per chat and no rule that one feature/subtree equals one chat. A chat may own leaves from more than one feature when shared implementation context makes that the coherent allocation; one feature may require multiple chats.

If a single leaf is too large for a practical executor chat, reopen planning and decompose it.

### Execution dependencies

Execution prerequisites remain only in `TREE.yaml -> depends_on`.

An executor checks the prerequisite node's state in `EXECUTION.yaml`.

Do not create a separate chat dependency graph and do not distort S&T parent/child logic to express execution order.

### Execution state

Use only:

- `pending`
- `in_progress`
- `done`
- `blocked`

A node becomes `done` only after its S&T `success_evidence` is verified.

The short `result` field may reference a commit, test, artifact, or concise verification outcome.

The framework does not become a scheduler or task-management application.

## 12. Replan only when execution proves it necessary

If execution exposes a material defect in the frozen plan:

1. the executor marks the affected node `blocked` with a short factual reason;
2. set `.planning/STATUS.yaml -> plan_state: active`;
3. set `.planning/STATUS.yaml -> implementation_authorized: false`;
4. identify the smallest affected S&T area;
5. correct that area and review upward until the impact is contained;
6. inspect affected dependencies and any completed work that relied on the changed outcome;
7. keep already-`done` nodes only when their Strategy/evidence/outcome remain valid under the revised plan;
8. reset invalidated completed nodes to `pending` or remove obsolete nodes;
9. update only affected EXECUTION allocation;
10. re-freeze after the corrected plan passes the required focused review, still unauthorized;
11. run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when applicable) and fix every failure;
12. rerun and record the mandatory fresh-chat handoff verification from `.planning/EXECUTOR_HANDOFF.md`, then explicitly re-authorize implementation before execution resumes.

Do not restart planning from the root unless the defect actually changes the root framing.

Do not create plan versions or a separate replan ledger in V1; Git history plus REVIEWS provide the audit trail.
