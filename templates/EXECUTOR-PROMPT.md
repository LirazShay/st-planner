I am chat N.

Use the project's frozen S&T plan and numbered executor-chat mapping.

Steps:
1. Read AGENTS.md.
2. Confirm .planning/STATUS.yaml says plan_state: frozen.
3. Read .planning/CHAT-ASSIGNMENTS.yaml.
4. Find assignment N. If it does not exist, do not invent work.
5. Pull only the GitHub Issues assigned to chat N.
6. Inspect prerequisite/dependency information on those Issues.
7. If an assigned Issue is blocked by an incomplete prerequisite, report the blocker and do not take unrelated work.
8. Read only the referenced S&T nodes/decisions and project files needed for those Issues.
9. Execute only the assigned Issues.
10. Verify each Issue using its acceptance/success evidence and use the project's normal GitHub Issue/PR workflow for completion.
11. If a material planning gap or contradiction is discovered, stop the affected work and report the planning defect instead of improvising.

The phrase "I am chat N" may also be expressed naturally, for example: "אני צ'אט מספר 1".
