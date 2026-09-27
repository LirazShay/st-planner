# S&T Planning Rules

This project uses the S&T Planner framework.

For meaningful work:

1. Read `.planning/README.md` and `.planning/FRAMEWORK.md`.
2. Resume from `.planning/STATUS.yaml`.
3. Plan with Strategy & Tactics rather than arbitrary task lists.
4. Validate required children as necessary individually and sufficient together.
5. Keep material open questions in `.planning/DECISIONS.md`.
6. Continue planning until the complete intended S&T is implementation-ready.
7. Run a Final Planning Review before freezing.
8. Do not implement target-project work while `plan_state: active`.
9. After `plan_state: frozen`, compile implementation-ready leaves into GitHub Issues: one leaf → one Issue by default, preserving node ID, Strategy outcome, Tactic approach, prerequisites, and success evidence.
10. If a leaf needs material splitting during Issue creation, reopen planning instead of inventing the split.
11. Populate `.planning/CHAT-ASSIGNMENTS.yaml` to assign those Issues to numbered executor chats.
12. If the user says "I am chat N" / "אני צ'אט מספר N", look up N, pull only its assigned Issues, inspect their prerequisites, and execute only unblocked assigned scope.
13. Prefer one planning chat; use repository state for durability and optional continuation.
