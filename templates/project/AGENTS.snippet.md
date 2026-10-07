<!-- st-planner:rules:v2 -->
# S&T Framework Rules

## Framework freshness

At the start of any S&T planning request or numbered executor bootstrap, run:

```text
node .planning/check-framework-update.mjs
```

If the checker reports the installed framework is current, continue normally. If it reports a newer `recommended` release, tell the user the installed/latest versions and summary, then continue unless an upgrade is chosen. If it reports a newer `required` release, do not start new S&T planning/execution work until an explicit framework upgrade is completed and the checker reports current. If freshness cannot be checked because network access is unavailable, say so and continue from the installed framework without claiming it is current.

A framework upgrade may replace only framework-managed instruction/tooling files. It must never overwrite active cycle state: `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, or `.planning/EXECUTION.yaml`.

## One-command planning trigger

When the user asks to plan using **S&T Planner** (including natural variants such as "ST Planner", "S T Planner", or "תתכנן לי בשיטת S&T Planner לפי הריפו"), treat that request as the complete planning command.

The requested planning scope may be a whole project/initiative or a meaningful scope inside an existing system, such as a release, feature, migration, refactor, architectural change, or other substantial change. Use the same S&T logic at every scale; do not require the user to classify the scope.

The user does **not** need to explain the framework workflow, name planning files, choose a number of stages, or paste a special starter prompt.

On that trigger, automatically:

1. Run `.planning/check-framework-update.mjs` and resolve any required framework update before new planning work.
2. Read the repository's existing `AGENTS.md` / routing / source-of-truth rules.
3. Read `.planning/README.md`, `.planning/FRAMEWORK.md`, and `.planning/STATUS.yaml`.
4. Inspect `.planning/STATUS.yaml -> cycle_state` before changing current-cycle planning state:
   - `active`: resume/replan the current cycle when the request belongs to the same intended scope; never erase it merely because a new request arrived;
   - `completed` or `abandoned`: a later independent scope may start a new cycle after the terminal review/snapshot is durably preserved;
   - V1 has one active S&T cycle per repository. If a genuinely independent new scope is requested while another cycle is still active, do not silently reset or create parallel cycle state. The current cycle must first be completed or explicitly abandoned, unless the new request is incorporated into/reframes that same cycle.
5. When starting a permitted new cycle, preserve installed framework/tooling and the S&T `AGENTS.md` rules, but reset only current-cycle state (`GOAL.md`, `TREE.yaml`, `DECISIONS.md`, `REVIEWS.md`, `STATUS.yaml`, `EXECUTION.yaml`). Start with `cycle_state: active`, `plan_state: active`, `implementation_authorized: false`. Use repository history for prior-cycle audit; do not create an archive tree by default.
6. Determine the requested planning scope from the user's request and current repository context. Do not invent a different scope or silently expand it to the whole project.
7. Separate the required outcome from any user-proposed feature, tool, technology, architecture, or implementation. Treat a proposed solution as a candidate tactic unless the user or an existing durable project contract explicitly makes it a fixed constraint/decision.
8. Use the repository's own context-loading rules and inspect only the workstream/component and files needed to understand the current reality and materially challenge the proposed scope/solution.

Before deep decomposition, create a **short structural map** of the current planning scope: the outcome/boundary, material questions and decisions that must be resolved, dependencies between those questions, material evidence still needed, and likely major tree areas. This is orientation only. It must not approve a tactic, skip a decision, weaken necessity/sufficiency, or replace full S&T justification.

Plan the mapped work in **coherent planning slices**. Within each slice, perform the full S&T reasoning required for every material tactic/decision, persist the rationale in the normal planning artifacts, then validate/review the coherent slice. Do not force a complete read/edit/status/review cycle after every small edit. Once a material decision is justified and durably recorded, do not reopen the same reasoning merely for reassurance unless new evidence, a contradiction, a changed assumption, or a review finding could materially change it.

Existing project patterns, prior designs, or reusable mechanisms are evidence about current reality and candidate alternatives only. They are never sufficient justification by themselves; every material choice must still be justified for the current scope.

9. Update `GOAL.md` with the outcome boundary, established current reality, hard constraints, and non-goals.
10. Before accepting a material root or lower-level tactic, challenge why the objective is needed, why the tactic can achieve it, whether a materially plausible alternative would be preferable under the actual constraints, and what assumption/fact would invalidate the choice. Do this recursively at business, product, architecture, component, and technical levels as materiality requires; do not mechanically brainstorm alternatives for trivial choices.
11. Resolve ordinary local reasoning in TREE assumptions. Put only material unresolved questions/choices in `DECISIONS.md`; do not ask the user for facts/choices that can be established from repository context or reliable evidence. An open decision blocks a node only when continuing would require guessing or could create a materially different subtree.
12. **Default to informed planner autonomy.** The user is not an approval API. When the goal, constraints, repository evidence, and engineering/product tradeoffs are sufficient to choose responsibly, make the choice, record the rationale, and continue. Do not ask the user merely because several technically valid options exist. Prefer a reasonable reversible default for low-risk uncertainty. Ask only when the missing information is genuinely user-owned or when no responsible choice can be derived and different answers would materially change the plan. If a question is unavoidable, ask the smallest possible question, preferably with the planner's recommendation and the consequence of the choice; batch tightly related unknowns instead of interrogating the user one-by-one. Respect an explicit user request to "decide yourself" unless a truly user-owned decision remains.
13. Build the complete S&T tree in `TREE.yaml`. Features/releases are ordinary S&T nodes/subtrees, not special schema types. Do not create default folder/checklist branches such as Frontend / Backend / Database / Tests unless they are independently necessary outcomes. Alternatives are not simultaneous necessary children; keep only the selected active path in TREE.
14. Review/correct the plan as required by the framework, including tactic-choice validity, necessity, sufficiency, sibling-level coherence, assumption honesty, KISS, implementation readiness, whole-plan completeness, durable-contract vs live-status hygiene, and stale decision/investigation cleanup. Correct obvious defects while authoring, but interpret "review as you build" as local quality control, not as a mandate to rerun every review dimension after every edit. Run the meaningful multidimensional review on a coherent slice/subtree and rerun only affected logic after a concrete finding. Whole-plan outside-in coverage and Final Planning Review remain mandatory.
15. Record meaningful reviews in `REVIEWS.md` and keep `.planning/STATUS.yaml` current. Do not update lifecycle/status merely to mirror every technical edit; update it when planning state or the truthful resume point materially changes.
16. Do **not** implement target-project work while planning.
17. Continue planning until the complete intended plan passes Final Planning Review.
18. Record the reviewed baseline evidence in `.planning/REVIEWS.md`.
19. Verify that material planning files (`.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`) have not drifted from that reviewed baseline. In Git workflows prefer `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>`; after a merge/rebase/integration that creates a later frozen ref, verify again with `--frozen-ref <ref>`. If no stable Git ref exists, record equivalent evidence.
20. If drift exists, keep planning active, review the changed baseline again, and do not freeze.
21. Set `.planning/STATUS.yaml -> plan_state: frozen` while keeping `.planning/STATUS.yaml -> cycle_state: active` and `.planning/STATUS.yaml -> implementation_authorized: false`.
22. Populate `EXECUTION.yaml` by assigning every implementation-ready leaf exactly once to numbered executor chats.
23. Run `node .planning/validate-allocation.mjs --initial`; fix every authoritative allocation failure before continuing. Add `--serial-chats` only when the target explicitly uses serial numbered chats.
24. Run the mandatory execution/handoff verification from `.planning/EXECUTOR_HANDOFF.md`, including accidental old-conversation rollover, advisory target-pointer drift, explicit post-handoff re-bootstrap, and fresh-conversation activation; record the result in `REVIEWS.md`.
25. Fix any hard allocation/authorization/dependency/context-routing defect the verification exposes and rerun the failed case. Projection drift or other advisory warnings should be recorded/repaired when useful but do not by themselves keep implementation blocked.
26. Only after freeze no-drift, authoritative allocation validation, and execution/handoff gates pass set `.planning/STATUS.yaml -> implementation_authorized: true`. Freeze/allocation alone never authorize implementation.
27. After all required execution leaves are `done`, run the Cycle Closure Review from `REVIEWS.md`. Do not infer whole-scope success from leaf completion alone. Verify the root outcome after integration and promote any cross-cycle decision/contract into the target repository's durable source of truth.
28. On a passing closure set `cycle_state: completed` and `implementation_authorized: false`. If the scope is intentionally stopped without proving the root outcome, record abandonment instead and set `cycle_state: abandoned`, `implementation_authorized: false`. Do not label abandonment as completion.

Unless the user explicitly asks to stop earlier or work one stage per message, complete this planning workflow autonomously in the same planning conversation.

For long/tool-heavy work, provide concise periodic progress updates at meaningful boundaries: what is being checked now, what is already complete, what remains before this stage can close, and any meaningful discovery/blocker. Do not narrate every tool call or repeat status noise. If the user requested one stage per message, these updates do not advance the stage.

If the user's request does not contain enough information to identify what should be planned and the repository has no single unambiguous active target, ask only for the missing outcome/boundary—not for framework instructions.

## Execution rules

1. Run `node .planning/check-framework-update.mjs`; resolve any `required` framework update before new execution work.
2. Read the repository's existing `AGENTS.md`/routing rules first, then `.planning/README.md`, `.planning/FRAMEWORK.md`, `.planning/STATUS.yaml`, `.planning/EXECUTOR_HANDOFF.md`, and `.planning/CI-RCA-POLICY.md`.
3. Respect existing project context-loading/source-of-truth conventions; do not recursively preload the repository.
4. Treat `.planning/STATUS.yaml -> cycle_state` as the whole current-cycle lifecycle: `active | completed | abandoned`. V1 allows one active S&T cycle per repository.
5. Do not implement while `.planning/STATUS.yaml -> plan_state: active`.
6. Do not implement merely because `plan_state: frozen`; execution also requires `cycle_state: active` and `implementation_authorized: true`.
7. Execute directly from S&T leaves; do not create GitHub Issues merely to mirror S&T work.
8. `.planning/EXECUTION.yaml` is the authority for executor allocation and node execution state. `TREE.yaml -> depends_on` is the authority for execution prerequisites. `.planning/STATUS.yaml` owns lifecycle/planning/authorization, not a duplicate executor-current pointer.
9. Target-owned `STATUS.yaml`, `current_chat`, `current_node`, phase/workstream pointers, dashboards, or similar fields are **projections/navigation aids**. Derive runnable work from TREE + EXECUTION (use `.planning/execution-guidance.mjs` when useful). A target pointer mismatch is a warning/repair concern, not a framework blocker by itself and never a reason to rewrite authoritative EXECUTION merely to match the projection.
10. Hard-stop only for genuinely unsafe authority conditions: implementation not authorized, executor not allocated, invalid/duplicate allocation, broken authoritative dependency state, a real planning defect, or another contradiction that prevents determining safe assigned work.
11. Before first authorization run `node .planning/validate-allocation.mjs --initial`; before re-authorization after replanning use `--resume`. Add `--serial-chats` only when the target really uses serial chats.
12. **Chat allocation is not chat activation.** A numbered executor context starts only from an explicit message such as `אני צאט N תתחיל` (established forms `אני צ'אט מספר N` / `I am chat N` also count). A target `current_chat` pointer, `NEXT_CHAT_PROMPT`, `תמשיך לשלב הבא`, `continue`, or newly runnable allocation never changes executor identity implicitly.
13. While an executor is actively working before a handoff boundary, do not switch that conversation to another Chat N. Finish/handoff the current executor first.
14. A handoff recommends a fresh conversation but is not a permanent lock. After handoff, generic `continue` must not silently roll into the next executor. If the user explicitly sends `אני צאט N תתחיל`, the same conversation may intentionally re-bootstrap that allocated executor after fresh authorization/allocation/dependency checks pass.
15. When explicit startup requests Chat N, require the lifecycle authorization gate, confirm Chat N is allocated in EXECUTION, read only its assigned TREE leaves/context, and execute only nodes whose dependencies are done. A differing target-owned current pointer is advisory; do not adopt its ID automatically and do not block Chat N solely because of that pointer.
16. Before completing a node, re-read authoritative state, confirm this chat still owns the node, verify `success_evidence`, then persist `done` + short result in EXECUTION. Re-derive runnable work afterward. Do not depend on manually advancing several peer current-pointer files in a specific file-by-file order.
17. If target status/current projections are required, update or regenerate them as secondary summaries after authoritative EXECUTION is correct. If such a projection temporarily lags, diagnose/repair it without stopping unrelated safe development.
18. If the same chat still has another runnable assigned node, continue it. Otherwise recommend/emit handoff to other runnable chats. If several chats are independent, report them as parallel rather than manufacturing a serial order.
19. `NODE_COMPLETE`, chat-scope completion, implementation completion, and cycle completion are distinct. All execution leaves done means implementation work is complete; Cycle Closure Review is still required before `cycle_state: completed`.
20. If a material planning defect appears during execution, keep `cycle_state: active`, mark the affected node blocked with a factual reason, set `plan_state: active` and `implementation_authorized: false`, and stop starting new execution work until focused replanning/review/validation restores authorization.
21. Preserve `done` work across replanning only when its Strategy, evidence, and produced outcome remain valid under the corrected plan.
22. If implementation/offline proof is complete but required external live verification cannot factually run yet, keep that leaf `blocked` with passed/remaining evidence and the factual availability reason. Do not reopen planning unless the plan itself is wrong and do not block unrelated nodes.
23. After all required work is done, run Cycle Closure Review. `completed` requires integrated root-outcome proof; `abandoned` records an intentional stop without claiming success. Both terminal states require `implementation_authorized: false`.
24. Before terminal closure, promote any decision/contract that future cycles must obey into the target repository's durable source of truth; cycle-local DECISIONS is not a permanent architecture registry.
25. **Every CI warning or error is a mandatory RCA gate before progressing.** Do not stop at a local symptom fix or a green rerun. Follow `.planning/CI-RCA-POLICY.md`: establish what happened, the causal root, why prevention/detection failed, the reusable prevention, materially analogous areas that may share the same weakness, and closing evidence. Explicitly tell the user that progression is paused for RCA and that a local fix alone is not closure. Only continue after the RCA and analogous-area review are closed.
26. When CI/workflow validation logic becomes non-trivial, put it in a small versioned helper script and let the workflow call it; avoid large inline parsers/heredocs in YAML or shell.
27. For programmatic repository text edits, use literal-safe replacement, require expected source text before replacing, and reread the rendered file or full diff before PR/merge.
28. Follow the target repository's existing branch/PR/merge/post-merge verification rules when they exist. Do not impose GitHub Flow or PR ceremony when the target repository does not require it.
29. Prefer one planning chat; use repository state for durability and optional continuation.
