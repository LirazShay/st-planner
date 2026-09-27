# S&T Framework Rules

## One-command planning trigger

When the user asks to plan using **S&T Planner** (including natural variants such as "ST Planner", "S T Planner", or "תתכנן לי בשיטת S&T Planner לפי הריפו"), treat that request as the complete planning command.

The user does **not** need to explain the framework workflow, name planning files, choose a number of stages, or paste a special starter prompt.

On that trigger, automatically:

1. Read the repository's existing `AGENTS.md` / routing / source-of-truth rules.
2. Read `.planning/README.md`, `.planning/FRAMEWORK.md`, and `.planning/STATUS.yaml`.
3. Determine the requested planning goal from the user's request and current repository context. Do not invent a different goal.
4. Use the repository's own context-loading rules and inspect only the workstream/component and files needed to understand current reality.
5. Update `GOAL.md`.
6. Build the complete S&T tree in `TREE.yaml`, recording material unresolved questions/choices in `DECISIONS.md`.
7. Review/correct the plan as required by the framework, including necessity, sufficiency, KISS, implementation readiness, and whole-plan completeness.
8. Record meaningful reviews in `REVIEWS.md` and keep `.planning/STATUS.yaml` current.
9. Do **not** implement target-project work while planning.
10. Continue planning until the complete intended plan passes Final Planning Review.
11. Record the reviewed baseline evidence in `.planning/REVIEWS.md`.
12. Verify that material planning files (`.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`) have not drifted from that reviewed baseline. In Git workflows prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`; after a merge/rebase/integration that creates a later frozen ref, verify again with `--frozen-ref <ref>`. If no stable Git ref exists, record equivalent evidence.
13. If drift exists, keep planning active, review the changed baseline again, and do not freeze.
14. Set `.planning/STATUS.yaml -> plan_state: frozen` while keeping `.planning/STATUS.yaml -> implementation_authorized: false`.
15. Populate `EXECUTION.yaml` by assigning every implementation-ready leaf exactly once to numbered executor chats.
16. Run `node .planning/validate-allocation.mjs --initial`; fix every failure before continuing. Add `--serial-chats` only when the target explicitly uses serial numbered chats.
17. Run the mandatory repository-only fresh-chat verification from `.planning/EXECUTOR_HANDOFF.md` and record its result in `REVIEWS.md`.
18. Fix any handoff/allocation/context-routing defect the simulation exposes and rerun the failed case.
19. Only after freeze no-drift, allocation validation, and fresh-chat handoff gates pass set `.planning/STATUS.yaml -> implementation_authorized: true`. Freeze/allocation alone never authorize implementation.

Unless the user explicitly asks to stop earlier or work one stage per message, complete this planning workflow autonomously in the same planning conversation.

If the user's request does not contain enough information to identify what should be planned and the repository has no single unambiguous active target, ask only for the missing goal—not for framework instructions.

This project uses the S&T Planner framework.

For meaningful work:

1. Read the repository's existing `AGENTS.md`/routing rules first, then `.planning/README.md` and `.planning/FRAMEWORK.md`.
2. Respect existing project context-loading/source-of-truth conventions; do not recursively preload the repository.
3. During planning, resume from `.planning/STATUS.yaml`.
4. Plan with Strategy & Tactics rather than arbitrary task lists.
5. Validate required children as necessary individually and sufficient together.
6. Keep material open questions in `.planning/DECISIONS.md`.
7. Continue until the complete intended S&T is implementation-ready.
8. Run Final Planning Review before freezing, record the reviewed baseline evidence, and prove no material GOAL/TREE/DECISIONS drift before treating that baseline as frozen. Recheck after merge/rebase/integration when the frozen ref changes.
9. Do not implement while `.planning/STATUS.yaml -> plan_state: active`.
10. Do not implement merely because `.planning/STATUS.yaml -> plan_state: frozen`; execution also requires `.planning/STATUS.yaml -> implementation_authorized: true`.
11. After explicit implementation authorization, execute directly from S&T leaves; do not create GitHub Issues merely to represent S&T work.
12. Allocate every implementation-ready leaf exactly once in `.planning/EXECUTION.yaml`.
13. Before first authorization, run `node .planning/validate-allocation.mjs --initial`; before re-authorization after replanning, run it with `--resume`. Any validator failure keeps authorization false.
14. After allocation validation passes, run and record the mandatory fresh-chat verification defined by `.planning/EXECUTOR_HANDOFF.md`; any failure keeps authorization false.
15. Do not copy task descriptions into EXECUTION or EXECUTOR_HANDOFF; node IDs point to TREE.
16. If the user says "I am chat N" / "אני צ'אט מספר N", read `.planning/EXECUTOR_HANDOFF.md` and require both `.planning/STATUS.yaml -> plan_state: frozen` and `.planning/STATUS.yaml -> implementation_authorized: true`; then load chat N from EXECUTION, read only its assigned S&T nodes/context, check TREE dependencies against EXECUTION states, and execute only available assigned nodes.
17. Mark a node `done` only after its `success_evidence` is verified.
18. If a material planning defect appears during execution, mark the affected node blocked with a factual reason, set `.planning/STATUS.yaml -> plan_state: active` and `.planning/STATUS.yaml -> implementation_authorized: false`, and stop starting new execution work.
19. Reopen only the smallest affected S&T area; preserve `done` work only when it remains valid under the corrected plan.
20. After focused review, record the corrected reviewed baseline, pass freeze no-drift verification again, repair only affected EXECUTION entries, and freeze that verified baseline; then run allocation validation in `--resume` mode and rerun the mandatory fresh-chat verification before re-authorization. Git history is sufficient version history.
21. Prefer one planning chat; use repository state for durability and optional continuation.
