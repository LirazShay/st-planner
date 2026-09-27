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
8. Record meaningful reviews in `REVIEWS.md` and keep `STATUS.yaml` current.
9. Do **not** implement target-project work while planning.
10. Continue planning until the complete intended plan passes Final Planning Review.
11. Set `plan_state: frozen`.
12. Populate `EXECUTION.yaml` by assigning every implementation-ready leaf exactly once to numbered executor chats.

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
8. Run Final Planning Review before freezing.
9. Do not implement while `plan_state: active`.
10. After freeze, execute directly from S&T leaves; do not create GitHub Issues merely to represent S&T work.
11. Allocate every implementation-ready leaf exactly once in `.planning/EXECUTION.yaml`.
12. Do not copy task descriptions into EXECUTION; node IDs point to TREE.
13. If the user says "I am chat N" / "אני צ'אט מספר N", load chat N from EXECUTION, read only its assigned S&T nodes/context, check TREE dependencies against EXECUTION states, and execute only available assigned nodes.
14. Mark a node `done` only after its `success_evidence` is verified.
15. If a material planning defect appears during execution, mark the affected node blocked with a factual reason, set `plan_state: active`, and stop starting new execution work.
16. Reopen only the smallest affected S&T area; preserve `done` work only when it remains valid under the corrected plan.
17. After focused review, repair only affected EXECUTION entries and freeze again. Git history is sufficient version history.
18. Prefer one planning chat; use repository state for durability and optional continuation.
