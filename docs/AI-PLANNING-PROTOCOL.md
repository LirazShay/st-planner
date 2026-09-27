# AI Planning Protocol

Planning depth is adaptive; there is no QUICK/DEEP mode. Use the same S&T rules for every task and stop decomposing when further detail would not materially improve implementation readiness or logical confidence.

## 1. Start with the goal boundary

Update `.planning/GOAL.md` with:
- desired outcome;
- established current reality;
- constraints;
- non-goals.

Material unresolved questions go to `DECISIONS.md`.

## 2. Build the root

Create the root Strategy/Tactic and success evidence.

Do not choose a tactic when a material decision is still unknown; expose the question instead.

## 3. Decompose

For a parent tactic ask:

> How exactly must this be performed?

For each proposed child:
1. define its Strategy;
2. define its Tactic;
3. explain why the child is independently necessary;
4. validate that its tactic can achieve its strategy.

For the whole sibling group ask:

> If every child succeeds, what required condition could still be missing?

Do not choose the number of children in advance.

## 4. Continue until implementation-ready leaves

A leaf is ready when an executor would not need another material design/product decision.

The leaf should provide enough information to derive:
- responsibility;
- scope;
- relevant constraints;
- execution prerequisites in `depends_on`, when real;
- success/acceptance evidence.

Do not decompose into trivial implementation steps.

## 5. Review repeatedly

While building:
- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumption honesty;
- KISS;
- tree consistency.

Correct defects immediately.

Branch approval means the branch logic is sound; it does **not** permit implementation. Neither local approval nor freeze alone authorizes execution.

## 6. Outside-in completeness audit

Before the final review, challenge the tree from the goal boundary rather than from its existing branches.

For every meaningful desired-outcome clause and hard constraint, identify where the plan protects it through a node, assumption, decision, or success evidence.

Then ask:

> Assume every planned leaf succeeds exactly as written. Can the project still miss the desired outcome for a reason this plan should have handled?

Also inspect only materially relevant actors, boundaries, dependencies, and failure paths, and walk a small number of representative end-to-end scenarios.

Do not create a separate coverage artifact. Persist only defects/corrections in the existing TREE, DECISIONS, and REVIEWS files.

## 7. Final whole-plan review

When the intended tree appears complete and the completeness audit finds no unresolved gap, review it as one system.

Planning is complete only if:
- intended scope is fully represented;
- every desired-outcome clause and hard constraint is accounted for;
- every required branch is sufficiently decomposed;
- material decisions are resolved;
- leaves are implementation-ready;
- cross-branch dependencies needed for execution are understood;
- no important gap appears when the entire tree is considered together;
- KISS review passes.

Record the result in `REVIEWS.md` together with reviewed-baseline evidence for the material planning files.

## 8. Freeze

If Final Planning Review passes:

1. record the reviewed baseline evidence in `.planning/REVIEWS.md`;
2. prove no material drift in `.planning/GOAL.md`, `.planning/TREE.yaml`, and `.planning/DECISIONS.md`;
3. when Git refs are available, prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`;
4. if drift exists, keep planning active, review the changed baseline again, and record new evidence;
5. only after the no-drift proof set `.planning/STATUS.yaml -> plan_state: frozen`;
6. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
- stop changing the baseline except for a documented later planning correction.

Freeze closes the **reviewed** planning baseline. It does not start implementation.

If merge/rebase/integration creates a different frozen ref after the first no-drift proof, verify the reviewed ref against that resulting ref before execution allocation. A workflow without stable Git refs must record equivalent reproducible evidence.

## 9. Handoff to execution

Do not create a second task system.

After the plan is frozen:

1. confirm the frozen baseline still matches the recorded Final Review baseline, including any post-review merge/rebase/integration;
2. keep `.planning/STATUS.yaml -> implementation_authorized: false`;
3. collect every implementation-ready leaf;
4. allocate every leaf exactly once to a numbered executor chat in `.planning/EXECUTION.yaml`;
5. initialize each node as `pending`;
6. leave Strategy/Tactic/success evidence in TREE rather than copying them into EXECUTION or EXECUTOR_HANDOFF;
7. run `node .planning/validate-allocation.mjs --initial` and fix every failure; add `--serial-chats` only for explicitly serial numbered chats;
8. follow `.planning/EXECUTOR_HANDOFF.md` and simulate the mandatory representative fresh executors from repository state only;
9. record the handoff verification in `REVIEWS.md`;
10. fix and rerun any failed simulation;
11. explicitly set `.planning/STATUS.yaml -> implementation_authorized: true`.

No executor may start before step 11.

### Chat allocation

Choose the number of chats from the actual amount and shape of work.

Priorities:

1. coherent context/responsibility;
2. valid dependency flow;
3. manageable amount of work per chat;
4. reasonable load balance.

There is no fixed number of leaves per chat.

If a single leaf is too large for a practical executor chat, reopen planning and decompose it.

### Execution dependencies

Execution prerequisites remain only in `TREE.yaml -> depends_on`.

An executor checks the prerequisite node's state in `EXECUTION.yaml`.

Do not create a separate chat dependency graph.

### Execution state

Use only:

- `pending`
- `in_progress`
- `done`
- `blocked`

A node becomes `done` only after its S&T `success_evidence` is verified.

The short `result` field may reference a commit, test, artifact, or concise verification outcome.

The framework does not become a scheduler or task-management application.


## 10. Replan only when execution proves it necessary

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
10. after the corrected plan passes focused review, record the corrected reviewed baseline and pass freeze no-drift verification again;
11. re-freeze only that verified corrected baseline, still unauthorized;
12. run `node .planning/validate-allocation.mjs --resume` (plus `--serial-chats` only when applicable) and fix every failure;
13. rerun and record the mandatory fresh-chat handoff verification from `.planning/EXECUTOR_HANDOFF.md`, then explicitly re-authorize implementation before execution resumes.

Do not restart planning from the root unless the defect actually changes the root framing.

Do not create plan versions or a separate replan ledger in V1; Git history plus REVIEWS provide the audit trail.
