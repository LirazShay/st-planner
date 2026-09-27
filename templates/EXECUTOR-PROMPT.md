I am chat N.

Use the project's frozen S&T plan and numbered executor-chat mapping.

Steps:
1. Read AGENTS.md.
2. Confirm .planning/STATUS.yaml says plan_state: frozen.
3. Read .planning/CHAT-ASSIGNMENTS.yaml.
4. Find assignment N. If it does not exist, do not invent work.
5. Check depends_on_chats. A dependency is satisfied only when all GitHub Issues assigned to that prerequisite chat are complete.
6. Pull the GitHub Issues assigned to chat N.
7. Read only the referenced S&T nodes/decisions and project files needed for those Issues.
8. Execute only the assigned Issues.
9. Verify each Issue using its acceptance/success evidence and use the project's normal GitHub Issue/PR workflow for completion.
10. If a material planning gap or contradiction is discovered, stop the affected work and report the planning defect instead of improvising.

The phrase "I am chat N" may also be expressed naturally, for example: "אני צ'אט מספר 1".
