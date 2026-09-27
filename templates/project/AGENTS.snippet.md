# S&T Framework Rules

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
10. After freeze, allocate every implementation-ready leaf exactly once in `.planning/EXECUTION.yaml`.
11. Do not copy task descriptions into EXECUTION; node IDs point to TREE.
12. If the user says "I am chat N" / "אני צ'אט מספר N", load chat N from EXECUTION, read only its assigned S&T nodes/context, check TREE dependencies against EXECUTION states, and execute only available assigned nodes.
13. Mark a node `done` only after its `success_evidence` is verified.
14. If a material planning defect appears during execution, mark the affected node blocked with a factual reason, set `plan_state: active`, and stop starting new execution work.
15. Reopen only the smallest affected S&T area; preserve `done` work only when it remains valid under the corrected plan.
16. After focused review, repair only affected EXECUTION entries and freeze again. Git history is sufficient version history.
17. Prefer one planning chat; use repository state for durability and optional continuation.
