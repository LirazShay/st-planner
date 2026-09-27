# S&T Framework Rules

This project uses the S&T Planner framework.

For meaningful work:

1. Read `.planning/README.md` and `.planning/FRAMEWORK.md`.
2. During planning, resume from `.planning/STATUS.yaml`.
3. Plan with Strategy & Tactics rather than arbitrary task lists.
4. Validate required children as necessary individually and sufficient together.
5. Keep material open questions in `.planning/DECISIONS.md`.
6. Continue until the complete intended S&T is implementation-ready.
7. Run Final Planning Review before freezing.
8. Do not implement while `plan_state: active`.
9. After freeze, allocate every implementation-ready leaf exactly once in `.planning/EXECUTION.yaml`.
10. Do not copy task descriptions into EXECUTION; node IDs point to TREE.
11. If the user says "I am chat N" / "אני צ'אט מספר N", load chat N from EXECUTION, read only its assigned S&T nodes/context, check TREE dependencies against EXECUTION states, and execute only available assigned nodes.
12. Mark a node `done` only after its `success_evidence` is verified.
13. If a material planning defect appears during execution, mark the affected node blocked with a factual reason, set `plan_state: active`, and stop starting new execution work.
14. Reopen only the smallest affected S&T area; preserve `done` work only when it remains valid under the corrected plan.
15. After focused review, repair only affected EXECUTION entries and freeze again. Git history is sufficient version history.
16. Prefer one planning chat; use repository state for durability and optional continuation.
