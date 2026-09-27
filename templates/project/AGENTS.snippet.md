# S&T Planning Rules

This project uses the S&T Planner framework.

Before meaningful implementation:

1. Read `.planning/README.md` and `.planning/FRAMEWORK.md`.
2. Resume from `.planning/STATUS.yaml`.
3. Use Strategy & Tactics logic rather than arbitrary task lists.
4. Validate required children as necessary individually and sufficient together.
5. Separate facts, assumptions, decisions and unknowns.
6. Run a KISS review before approving an execution horizon.
7. Implement only node IDs explicitly listed in `.planning/STATUS.yaml -> implementation_scope`; an empty list blocks all implementation.
8. Keep `.planning/` updated so a fresh AI session can continue without chat history.

If this repository already has an `AGENTS.md`, merge these rules into it rather than replacing existing project instructions.
