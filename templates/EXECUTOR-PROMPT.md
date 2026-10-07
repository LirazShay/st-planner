I am chat N.

Use the project's authorized frozen S&T plan through .planning/EXECUTOR_HANDOFF.md.

Steps:
1. Read AGENTS.md and its routing/source-of-truth rules.
2. Read .planning/EXECUTOR_HANDOFF.md and follow its context-routing contract.
3. Confirm .planning/STATUS.yaml says plan_state: frozen.
4. Confirm .planning/STATUS.yaml says implementation_authorized: true. Freeze alone is not permission to execute.
5. Read .planning/EXECUTION.yaml.
6. Find chat N. If it does not exist, do not invent work.
7. Read only the S&T nodes assigned to chat N.
8. For each assigned node, read TREE.yaml -> depends_on.
9. Find each prerequisite node in EXECUTION.yaml and confirm it is done before starting the dependent node.
10. Leave nodes pending while prerequisites are incomplete; do not steal unrelated work.
11. Load only the decisions/specs/code/tests materially required by the available assigned node, following EXECUTOR_HANDOFF and target routing.
12. Before executing an available node, set its execution state to in_progress.
13. Execute the node's Tactic within its planned scope.
14. Verify the node's success_evidence.
15. If any CI warning or error appears, stop progression before the next implementation step. Explicitly tell the user that a local symptom fix alone is not closure. Perform the mandatory RCA from `.planning/CI-RCA-POLICY.md`: establish what happened, the causal root, why prevention/detection failed, the reusable prevention, materially analogous areas that may share the same weakness, and evidence that the original signal plus analogous-area review are closed. Only then continue.
16. If verified, set state: done and write a short result/evidence reference.
17. If a real implementation blocker prevents correct execution, set state: blocked with a short reason. If implementation/offline proof is complete but required external live verification is temporarily unavailable, record what passed, what live evidence remains, and the factual availability reason; do not reopen planning unless the plan itself is wrong.
18. If the blocker is a material planning gap/contradiction, also set .planning/STATUS.yaml -> plan_state: active and implementation_authorized: false, then stop starting new execution work. Do not redesign the plan yourself.
19. A planner will correct/review the smallest affected S&T area, record the corrected reviewed baseline, pass freeze no-drift verification again, freeze that verified baseline, repair affected EXECUTION entries, run allocation validation with --resume, rerun and record the mandatory fresh-chat handoff verification, and explicitly re-authorize implementation; only then resume from the updated EXECUTION file.

The phrase "I am chat N" may also be expressed naturally, for example: "אני צ'אט מספר 1".
