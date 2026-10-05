<!-- st-planner:rules:v1 -->
# S&T Framework Rules

## One-command planning trigger

When the user asks to plan using **S&T Planner** (including natural variants such as "ST Planner", "S T Planner", or "תתכנן לי בשיטת S&T Planner לפי הריפו"), treat that request as the complete planning command.

The requested planning scope may be a whole project/initiative or a meaningful scope inside an existing system, such as a release, feature, migration, refactor, architectural change, or other substantial change. Use the same S&T logic at every scale; do not require the user to classify the scope.

The user does **not** need to explain the framework workflow, name planning files, choose a number of stages, or paste a special starter prompt.

On that trigger, automatically:

1. Read the repository's existing `AGENTS.md` / routing / source-of-truth rules.
2. Read `.planning/README.md`, `.planning/FRAMEWORK.md`, and `.planning/STATUS.yaml`.
3. Determine the requested planning scope from the user's request and current repository context. Do not invent a different scope or silently expand it to the whole project.
4. Separate the required outcome from any user-proposed feature, tool, technology, architecture, or implementation. Treat a proposed solution as a candidate tactic unless the user or an existing durable project contract explicitly makes it a fixed constraint/decision.
5. Use the repository's own context-loading rules and inspect only the workstream/component and files needed to understand the current reality and materially challenge the proposed scope/solution.
6. Update `GOAL.md` with the outcome boundary, established current reality, hard constraints, and non-goals.
7. Before accepting a material root or lower-level tactic, challenge why the objective is needed, why the tactic can achieve it, whether a materially plausible alternative would be preferable under the actual constraints, and what assumption/fact would invalidate the choice. Do this recursively at business, product, architecture, component, and technical levels as materiality requires; do not mechanically brainstorm alternatives for trivial choices.
8. Resolve ordinary local reasoning in TREE assumptions. Put only material unresolved questions/choices in `DECISIONS.md`; do not ask the user for facts/choices that can be established from repository context or reliable evidence. An open decision blocks a node only when continuing would require guessing or could create a materially different subtree.
9. Build the complete S&T tree in `TREE.yaml`. Features/releases are ordinary S&T nodes/subtrees, not special schema types. Do not create default folder/checklist branches such as Frontend / Backend / Database / Tests unless they are independently necessary outcomes. Alternatives are not simultaneous necessary children; keep only the selected active path in TREE.
10. Review/correct the plan as required by the framework, including tactic-choice validity, necessity, sufficiency, sibling-level coherence, assumption honesty, KISS, implementation readiness, whole-plan completeness, durable-contract vs live-status hygiene, and stale decision/investigation cleanup.
11. Record meaningful reviews in `REVIEWS.md` and keep `.planning/STATUS.yaml` current.
12. Do **not** implement target-project work while planning.
13. Continue planning until the complete intended plan passes Final Planning Review.
14. Record the reviewed baseline evidence in `.planning/REVIEWS.md`.
15. Verify that material planning files (`.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`) have not drifted from that reviewed baseline. In Git workflows prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`; after a merge/rebase/integration that creates a later frozen ref, verify again with `--frozen-ref <ref>`. If no stable Git ref exists, record equivalent evidence.
16. If drift exists, keep planning active, review the changed baseline again, and do not freeze.
17. Set `.planning/STATUS.yaml -> plan_state: frozen` while keeping `.planning/STATUS.yaml -> implementation_authorized: false`.
18. Populate `EXECUTION.yaml` by assigning every implementation-ready leaf exactly once to numbered executor chats.
19. Run `node .planning/validate-allocation.mjs --initial`; fix every failure before continuing. Add `--serial-chats` only when the target explicitly uses serial numbered chats.
20. Run the mandatory repository-only fresh-chat verification from `.planning/EXECUTOR_HANDOFF.md` and record its result in `REVIEWS.md`.
21. Fix any handoff/allocation/context-routing defect the simulation exposes and rerun the failed case.
22. Only after freeze no-drift, allocation validation, and fresh-chat handoff gates pass set `.planning/STATUS.yaml -> implementation_authorized: true`. Freeze/allocation alone never authorize implementation.

Unless the user explicitly asks to stop earlier or work one stage per message, complete this planning workflow autonomously in the same planning conversation.

For long/tool-heavy work, provide concise periodic progress updates at meaningful boundaries: what is being checked now, what is already complete, what remains before the current stage closes, and any meaningful discovery/blocker. Do not narrate every tool call or repeat status noise. If the user requested one stage per message, these updates do not advance the stage.

If the user's request does not contain enough information to identify what should be planned and the repository has no single unambiguous active target, ask only for the missing outcome/boundary—not for framework instructions.

This project uses the S&T Planner framework.

For meaningful work:

1. Read the repository's existing `AGENTS.md`/routing rules first, then `.planning/README.md` and `.planning/FRAMEWORK.md`.
2. Respect existing project context-loading/source-of-truth conventions; do not recursively preload the repository.
3. During planning, resume from `.planning/STATUS.yaml`.
4. Plan any meaningful current scope with Strategy & Tactics rather than arbitrary task lists; the scope may be a project, release, feature, migration, refactor, architecture change, or other substantial change.
5. Keep Strategy as the required outcome and Tactic as the selected way to achieve it. Do not treat a user-proposed feature/tool/architecture as already justified unless it is explicitly fixed by the user or a durable contract.
6. For every material tactic, challenge the tactic-to-strategy logic and materially plausible alternatives at the depth justified by the decision's impact. Record real supporting assumptions, not decorative restatements.
7. Validate required children as necessary individually and sufficient together. Keep siblings at a coherent logical level; do not use the S&T hierarchy to represent schedule or default technical folders.
8. Keep only material open questions/choices in `.planning/DECISIONS.md`; ordinary local justification stays in TREE assumptions. Do not guess a material unknown.
9. Continue until the complete intended S&T is implementation-ready: no material product/design/architecture decision remains for executors, and every leaf is practical work for an executor chat.
10. Run Final Planning Review before freezing. As part of it, check the durable target-project specs/README actually used by the plan, remove/move duplicated live progress into the correct status/review owner, and revalidate every live open decision/investigation marker so stale resolved questions do not survive into the frozen baseline; then record the reviewed baseline evidence and prove no material GOAL/TREE/DECISIONS drift before treating that baseline as frozen. Recheck after merge/rebase/integration when the frozen ref changes.
11. Do not implement while `.planning/STATUS.yaml -> plan_state: active`.
12. Do not implement merely because `.planning/STATUS.yaml -> plan_state: frozen`; execution also requires `.planning/STATUS.yaml -> implementation_authorized: true`.
13. After explicit implementation authorization, execute directly from S&T leaves; do not create GitHub Issues merely to represent S&T work.
14. Allocate every implementation-ready leaf exactly once in `.planning/EXECUTION.yaml`. A feature/subtree may span several chats and a coherent chat may own leaves from more than one feature; allocation follows implementation context and dependencies, not labels.
15. Before first authorization, run `node .planning/validate-allocation.mjs --initial`; before re-authorization after replanning, run it with `--resume`. Any validator failure keeps authorization false.
16. After allocation validation passes, run and record the mandatory fresh-chat verification defined by `.planning/EXECUTOR_HANDOFF.md`; any failure keeps authorization false.
17. Do not copy task descriptions into EXECUTION or EXECUTOR_HANDOFF; node IDs point to TREE.
18. If the user says "I am chat N" / "אני צ'אט מספר N", read `.planning/EXECUTOR_HANDOFF.md` and require both `.planning/STATUS.yaml -> plan_state: frozen` and `.planning/STATUS.yaml -> implementation_authorized: true`; then load chat N from EXECUTION, read only its assigned S&T nodes/context, check TREE dependencies against EXECUTION states, and execute only available assigned nodes.
19. Mark a node `done` only after its `success_evidence` is verified.
20. If a material planning defect appears during execution, mark the affected node blocked with a factual reason, set `.planning/STATUS.yaml -> plan_state: active` and `.planning/STATUS.yaml -> implementation_authorized: false`, and stop starting new execution work.
21. Reopen only the smallest affected S&T area; preserve `done` work only when it remains valid under the corrected plan.
22. After focused review, record the corrected reviewed baseline, pass freeze no-drift verification again, repair only affected EXECUTION entries, and freeze that verified baseline; then run allocation validation in `--resume` mode and rerun the mandatory fresh-chat verification before re-authorization. Git history is sufficient version history.
23. For a meaningful unexpected failure, capture technical root cause, reasoning/process cause, escape cause, local fix + regression proof, and the smallest reusable prevention. Skip this ceremony for normal TDD red states, trivial typos, and expected validation failures.
24. When CI/workflow validation logic becomes non-trivial, put it in a small versioned helper script and let the workflow call it; avoid large inline parsers/heredocs in YAML or shell.
25. For programmatic repository text edits, use literal-safe replacement (for example a replacer function when inserted JavaScript text may contain `$`), require expected source text before replacing, and reread the rendered file or full diff before PR/merge.
26. Follow the target repository's existing branch/PR/merge/post-merge verification rules when they exist. Do not impose GitHub Flow or PR ceremony when the target repository does not require it.
27. If implementation/offline proof is complete but required external live verification cannot factually run yet, keep that leaf `blocked` with a result stating passed evidence, remaining live evidence, and the availability reason. Do not mark it `done`, do not reopen planning unless the plan is actually wrong, and do not block unrelated nodes that do not depend on it.
28. Prefer one planning chat; use repository state for durability and optional continuation.
