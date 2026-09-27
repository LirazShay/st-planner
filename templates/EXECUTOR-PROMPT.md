I am chat N.

Use the project's frozen S&T plan and .planning/EXECUTION.yaml.

Steps:
1. Read AGENTS.md.
2. Confirm .planning/STATUS.yaml says plan_state: frozen.
3. Confirm .planning/STATUS.yaml says implementation_authorized: true. Freeze alone is not permission to execute.
4. Read .planning/EXECUTION.yaml.
5. Find chat N. If it does not exist, do not invent work.
6. Read only the S&T nodes assigned to chat N plus referenced decisions/project context needed to execute them.
7. For each assigned node, read TREE.yaml -> depends_on.
8. Find each prerequisite node in EXECUTION.yaml and confirm it is done before starting the dependent node.
9. Leave nodes pending while prerequisites are incomplete; do not steal unrelated work.
10. Before executing an available node, set its execution state to in_progress.
11. Execute the node's Tactic within its planned scope.
12. Verify the node's success_evidence.
13. If verified, set state: done and write a short result/evidence reference.
14. If a real implementation blocker prevents correct execution, set state: blocked with a short reason.
15. If the blocker is a material planning gap/contradiction, also set .planning/STATUS.yaml -> plan_state: active and implementation_authorized: false, then stop starting new execution work. Do not redesign the plan yourself.
16. A planner will correct/review the smallest affected S&T area, freeze again, rerun required handoff checks, and explicitly re-authorize implementation; only then resume from the updated EXECUTION file.

The phrase "I am chat N" may also be expressed naturally, for example: "אני צ'אט מספר 1".
