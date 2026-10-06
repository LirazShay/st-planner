<!-- st-planner:rules:v1 -->
# S&T Framework Rules

## One-command planning trigger

When the user asks to plan using **S&T Planner** (including natural variants such as "ST Planner", "S T Planner", or "תתכנן לי בשיטת S&T Planner לפי הריפו"), treat that request as the complete planning command.

The requested planning scope may be a whole project/initiative or a meaningful scope inside an existing system, such as a release, feature, migration, refactor, architectural change, or other substantial change. Use the same S&T logic at every scale; do not require the user to classify the scope.

The user does **not** need to explain the framework workflow, name planning files, choose a number of stages, or paste a special starter prompt.

On that trigger, automatically:

1. Read the repository's existing `AGENTS.md` / routing / source-of-truth rules.
2. Read `.planning/README.md`, `.planning/FRAMEWORK.md`, and `.planning/STATUS.yaml`.
3. Inspect `.planning/STATUS.yaml -> cycle_state` before changing current-cycle planning state:
   - `active`: resume/replan the current cycle when the request belongs to the same intended scope; never erase it merely because a new request arrived;
   - `completed` or `abandoned`: a later independent scope may start a new cycle after the terminal review/snapshot is durably preserved;
   - V1 has one active S&T cycle per repository. If a genuinely independent new scope is requested while another cycle is still active, do not silently reset or create parallel cycle state. The current cycle must first be completed or explicitly abandoned, unless the new request is incorporated into/reframes that same cycle.
4. When starting a permitted new cycle, preserve installed framework/tooling and the S&T `AGENTS.md` rules, but reset only current-cycle state (`GOAL.md`, `TREE.yaml`, `DECISIONS.md`, `REVIEWS.md`, `STATUS.yaml`, `EXECUTION.yaml`). Start with `cycle_state: active`, `plan_state: active`, `implementation_authorized: false`. Use repository history for prior-cycle audit; do not create an archive tree by default.
5. Determine the requested planning scope from the user's request and current repository context. Do not invent a different scope or silently expand it to the whole project.
6. Separate the required outcome from any user-proposed feature, tool, technology, architecture, or implementation. Treat a proposed solution as a candidate tactic unless the user or an existing durable project contract explicitly makes it a fixed constraint/decision.
7. Use the repository's own context-loading rules and inspect only the workstream/component and files needed to understand the current reality and materially challenge the proposed scope/solution.
8. Update `GOAL.md` with the outcome boundary, established current reality, hard constraints, and non-goals.
9. Before accepting a material root or lower-level tactic, challenge why the objective is needed, why the tactic can achieve it, whether a materially plausible alternative would be preferable under the actual constraints, and what assumption/fact would invalidate the choice. Do this recursively at business, product, architecture, component, and technical levels as materiality requires; do not mechanically brainstorm alternatives for trivial choices.
10. Resolve ordinary local reasoning in TREE assumptions. Put only material unresolved questions/choices in `DECISIONS.md`; do not ask the user for facts/choices that can be established from repository context or reliable evidence. An open decision blocks a node only when continuing would require guessing or could create a materially different subtree.
11. **Default to informed planner autonomy.** The user is not an approval API. When the goal, constraints, repository evidence, and engineering/product tradeoffs are sufficient to choose responsibly, make the choice, record the rationale, and continue. Do not ask the user merely because several technically valid options exist. Prefer a reasonable reversible default for low-risk uncertainty. Ask only when the missing information is genuinely user-owned or when no responsible choice can be derived and different answers would materially change the plan. If a question is unavoidable, ask the smallest possible question, preferably with the planner's recommendation and the consequence of the choice; batch tightly related unknowns instead of interrogating the user one-by-one. Respect an explicit user request to "decide yourself" unless a truly user-owned decision remains.
12. Build the complete S&T tree in `TREE.yaml`. Features/releases are ordinary S&T nodes/subtrees, not special schema types. Do not create default folder/checklist branches such as Frontend / Backend / Database / Tests unless they are independently necessary outcomes. Alternatives are not simultaneous necessary children; keep only the selected active path in TREE.
13. Review/correct the plan as required by the framework, including tactic-choice validity, necessity, sufficiency, sibling-level coherence, assumption honesty, KISS, implementation readiness, whole-plan completeness, durable-contract vs live-status hygiene, and stale decision/investigation cleanup.
14. Record meaningful reviews in `REVIEWS.md` and keep `.planning/STATUS.yaml` current.
15. Do **not** implement target-project work while planning.
16. Continue planning until the complete intended plan passes Final Planning Review.
17. Record the reviewed baseline evidence in `.planning/REVIEWS.md`.
18. Verify that material planning files (`.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`) have not drifted from that reviewed baseline. In Git workflows prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`; after a merge/rebase/integration that creates a later frozen ref, verify again with `--frozen-ref <ref>`. If no stable Git ref exists, record equivalent evidence.
19. If drift exists, keep planning active, review the changed baseline again, and do not freeze.
20. Set `.planning/STATUS.yaml -> plan_state: frozen` while keeping `.planning/STATUS.yaml -> cycle_state: active` and `.planning/STATUS.yaml -> implementation_authorized: false`.
21. Populate `EXECUTION.yaml` by assigning every implementation-ready leaf exactly once to numbered executor chats.
22. Run `node .planning/validate-allocation.mjs --initial`; fix every authoritative allocation failure before continuing. Add `--serial-chats` only when the target explicitly uses serial numbered chats.
23. Run the mandatory execution/handoff verification from `.planning/EXECUTOR_HANDOFF.md`, including accidental old-conversation rollover, advisory target-pointer drift, explicit post-handoff re-bootstrap, and fresh-conversation activation; record the result in `REVIEWS.md`.
24. Fix any hard allocation/authorization/dependency/context-routing defect the verification exposes and rerun the failed case. Projection drift or other advisory warnings should be recorded/repaired when useful but do not by themselves keep implementation blocked.
25. Only after freeze no-drift, authoritative allocation validation, and execution/handoff gates pass set `.planning/STATUS.yaml -> implementation_authorized: true`. Freeze/allocation alone never authorize implementation.
26. After all required execution leaves are `done`, run the Cycle Closure Review from `REVIEWS.md`. Do not infer whole-scope success from leaf completion alone. Verify the root outcome after integration and promote any cross-cycle decision/contract into the target repository's durable source of truth.
27. On a passing closure set `cycle_state: completed` and `implementation_authorized: false`. If the scope is intentionally stopped without proving the root outcome, record abandonment instead and set `cycle_state: abandoned`, `implementation_authorized: false`. Do not label abandonment as completion.

Unless the user explicitly asks to stop earlier or work one stage per message, complete this planning workflow autonomously in the same planning conversation.

For long/tool-heavy work, provide concise periodic progress updates at meaningful boundaries: what is being checked now, what is already complete, what remains before this stage can close, and any meaningful discovery/blocker. Do not narrate every tool call or repeat status noise. If the user requested one stage per message, these updates do not advance the stage.

If the user's request does not contain enough information to identify what should be planned and the repository has no single unambiguous active target, ask only for the missing outcome/boundary—not for framework instructions.

## Execution rules

1. Read the repository's existing `AGENTS.md`/routing rules first, then `.planning/README.md`, `.planning/FRAMEWORK.md`, and `.planning/STATUS.yaml`.
2. Respect existing project context-loading/source-of-truth conventions; do not recursively preload the repository.
3. Treat `.planning/STATUS.yaml -> cycle_state` as the whole current-cycle lifecycle: `active | completed | abandoned`. V1 allows one active S&T cycle per repository.
4. Do not implement while `.planning/STATUS.yaml -> plan_state: active`.
5. Do not implement merely because `plan_state: frozen`; execution also requires `cycle_state: active` and `implementation_authorized: true`.
6. Execute directly from S&T leaves; do not create GitHub Issues merely to mirror S&T work.
7. `.planning/EXECUTION.yaml` is the authority for executor allocation and node execution state. `TREE.yaml -> depends_on` is the authority for execution prerequisites. `.planning/STATUS.yaml` owns lifecycle/planning/authorization, not a duplicate executor-current pointer.
8. Target-owned `STATUS.yaml`, `current_chat`, `current_node`, phase/workstream pointers, dashboards, or similar fields are **projections/navigation aids**. Derive runnable work from TREE + EXECUTION (use `.planning/execution-guidance.mjs` when useful). A target pointer mismatch is a warning/repair concern, not a framework blocker by itself and never a reason to rewrite authoritative EXECUTION merely to match the projection.
9. Hard-stop only for genuinely unsafe authority conditions: implementation not authorized, executor not allocated, invalid/duplicate allocation, broken authoritative dependency state, a real planning defect, or another contradiction that prevents determining safe assigned work.
10. Before first authorization run `node .planning/validate-allocation.mjs --initial`; before re-authorization after replanning use `--resume`. Add `--serial-chats` only when the target really uses serial chats.
11. **Chat allocation is not chat activation.** A numbered executor context starts only from an explicit message such as `אני צאט N תתחיל` (established forms `אני צ'אט מספר N` / `I am chat N` also count). A target `current_chat` pointer, `NEXT_CHAT_PROMPT`, `תמשיך לשלב הבא`, `continue`, or newly runnable allocation never changes executor identity implicitly.
12. While an executor is actively working before a handoff boundary, do not switch that conversation to another Chat N. Finish/handoff the current executor first.
13. A handoff recommends a fresh conversation but is not a permanent lock. After handoff, generic `continue` must not silently roll into the next executor. If the user explicitly sends `אני צאט N תתחיל`, the same conversation may intentionally re-bootstrap that allocated executor after fresh authorization/allocation/dependency checks pass.
14. When explicit startup requests Chat N, require the lifecycle authorization gate, confirm Chat N is allocated in EXECUTION, read only its assigned TREE leaves/context, and execute only nodes whose dependencies are done. A differing target-owned current pointer is advisory; do not adopt its ID automatically and do not block Chat N solely because of that pointer.
15. Before completing a node, re-read authoritative state, confirm this chat still owns the node, verify `success_evidence`, then persist `done` + short result in EXECUTION. Re-derive runnable work afterward. Do not depend on manually advancing several peer current-pointer files in a specific file-by-file order.
16. If target status/current projections are required, update or regenerate them as secondary summaries after authoritative EXECUTION is correct. If such a projection temporarily lags, diagnose/repair it without stopping unrelated safe development.
17. If the same chat still has another runnable assigned node, continue it. Otherwise recommend/emit handoff to other runnable chats. If several chats are independent, report them as parallel rather than manufacturing a serial order.
18. `NODE_COMPLETE`, chat-scope completion, implementation completion, and cycle completion are distinct. All execution leaves done means implementation work is complete; Cycle Closure Review is still required before `cycle_state: completed`.
19. If a material planning defect appears during execution, keep `cycle_state: active`, mark the affected node blocked with a factual reason, set `plan_state: active` and `implementation_authorized: false`, and stop starting new execution work until focused replanning/review/validation restores authorization.
20. Preserve `done` work across replanning only when its Strategy, evidence, and produced outcome remain valid under the corrected plan.
21. If implementation/offline proof is complete but required external live verification cannot factually run yet, keep that leaf `blocked` with passed/remaining evidence and the factual availability reason. Do not reopen planning unless the plan itself is wrong and do not block unrelated nodes.
22. After all required work is done, run Cycle Closure Review. `completed` requires integrated root-outcome proof; `abandoned` records an intentional stop without claiming success. Both terminal states require `implementation_authorized: false`.
23. Before terminal closure, promote any decision/contract that future cycles must obey into the target repository's durable source of truth; cycle-local DECISIONS is not a permanent architecture registry.
24. For a meaningful unexpected failure, capture technical root cause, reasoning/process cause, escape cause, local fix + regression proof, and the smallest reusable prevention. Skip this ceremony for normal TDD red states, trivial typos, and expected validation failures.
25. When CI/workflow validation logic becomes non-trivial, put it in a small versioned helper script and let the workflow call it; avoid large inline parsers/heredocs in YAML or shell.
26. For programmatic repository text edits, use literal-safe replacement, require expected source text before replacing, and reread the rendered file or full diff before PR/merge.
27. Follow the target repository's existing branch/PR/merge/post-merge verification rules when they exist. Do not impose GitHub Flow or PR ceremony when the target repository does not require it.
28. Prefer one planning chat; use repository state for durability and optional continuation.
