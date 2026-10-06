# Executor Handoff Bootstrap

This file is the portable entry contract for a brand-new executor chat.

It explains **how to resume execution from repository state only**. It does not duplicate task content from `TREE.yaml` or allocation/state from `EXECUTION.yaml`.

## Authorization gate

Before reading implementation details, read `.planning/STATUS.yaml`.

Execution is allowed only when all three values in **`.planning/STATUS.yaml`** are satisfied:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

If any condition is false:

- do not start or mark any node `in_progress`;
- do not improvise missing planning;
- report the repository-visible reason execution is unavailable.

A `completed` or `abandoned` cycle is terminal and cannot execute even if stale planning/execution data remains in the repository. Terminal cycles must have `implementation_authorized: false`.

## Conversation identity gate — allocation is not activation

Repository execution state and conversation identity are different authorities.

- `EXECUTION.yaml`, a target-owned `current_chat` pointer, runnable-chat calculation, or any other repository pointer says which executor is allocated/eligible.
- The current conversation's executor identity says which numbered executor this conversation actually is.
- Repository state may **confirm** an explicitly activated identity; it must never create, replace, or advance the identity of an existing conversation.

A numbered executor becomes active in a conversation only after an explicit startup message in that conversation, for example:

```text
אני צאט 17 תתחיל
```

Equivalent established forms such as `אני צ'אט מספר 17` / `I am chat 17` remain valid explicit startup forms. A generic continuation such as `תמשיך לשלב הבא` / `continue`, merely reading a repository that now points at Chat 17, or the existence of a `NEXT_CHAT_PROMPT` is never startup.

Once a conversation has activated Chat N, that identity is immutable for execution. If repository state later points to a different chat, the conversation must not adopt the new ID. It must stop before any branch/code/status/execution mutation for the other chat and direct the user to a new conversation.

If this conversation has emitted a `[[SEQUENCE_RUNNER_NEW_CHAT]] ... [[/SEQUENCE_RUNNER_NEW_CHAT]]` handoff, it is **execution-closed** for later allocated chats. This remains true even if the user stays in the same conversation and sends `תמשיך לשלב הבא`, even if the repo now says another chat is current, and even if the user pastes the next startup command into the old conversation. The old conversation may explain the required transition, but it may not bootstrap or execute the next chat.

Required decision order before executor mutation:

1. determine conversation-local executor identity from an explicit startup that occurred in this conversation;
2. determine whether this conversation already emitted a new-chat handoff / is execution-closed;
3. reject execution if identity is absent, changed, or closed;
4. only then read repository execution state to confirm authorization/allocation/dependencies for that same identity;
5. only after both conversation and repository gates pass may execution state or target code be mutated.

For a closed/mismatched old conversation, keep the response short and explicit, for example:

```text
העבודה בצ'אט הזה הסתיימה והועברה ל-Chat 17.
פתח צ'אט חדש ושלח:
אני צאט 17 תתחיל
```

`.planning/executor-authority.mjs` is the executable reference contract for these semantics and the framework regression tests. It does not persist conversation identity in the repository; conversation identity is intentionally conversation-local.

## Fresh executor read order

A numbered executor chat should read in this order:

1. target repository `AGENTS.md` and any routing/source-of-truth instructions it names;
2. this `.planning/EXECUTOR_HANDOFF.md`;
3. apply the conversation identity gate above **before treating repository pointers as executor identity**;
4. `.planning/STATUS.yaml`;
5. `.planning/EXECUTION.yaml`;
6. only the `TREE.yaml` nodes assigned to its explicitly activated chat;
7. each assigned node's `depends_on` entries and the prerequisite states in `EXECUTION.yaml`;
8. only decisions, specs, code, tests, or other target-project context materially required by the assigned nodes.

Do not preload all planning history or the whole repository.

## Determine what can run

For each assigned node:

- if every `depends_on` node is `done`, the node is available;
- if any prerequisite is not `done`, leave the node `pending`;
- an unmet dependency is not itself a blocker state;
- choose the first available assigned node using the order already represented by the assignment/dependencies; do not invent unrelated work.

If no assigned node is available, report which prerequisite states prevent progress.

## Context routing

The target repository remains authoritative for its own implementation rules and product/technical contracts.

Use this order:

1. target `AGENTS.md` / project routing rules;
2. the assigned S&T node, the ancestor reasoning needed to understand why it exists, and materially relevant decisions;
3. directly relevant target specs/code/tests;
4. history or unrelated areas only when a concrete uncertainty requires them.

An external/reference/source repository is read-only context unless the target repository explicitly says otherwise or the assigned node explicitly requires changing it.

Do not copy Strategy/Tactic text into this handoff file.

## Branch and verification behavior

Follow the target repository's existing Git, branch, PR, testing, and verification rules.

S&T Planner does not impose a branch/PR workflow when the target project does not have one.

Before marking a node `done`:

- execute within the assigned node's planned scope;
- verify its `success_evidence` using the target project's appropriate tests/inspection;
- write only a short result/evidence reference to `EXECUTION.yaml`.

## User-facing completion handoff

Do not leave the user to inspect planning files to discover what happens after an executor finishes.

After finishing all currently runnable work assigned to this chat and persisting the resulting `EXECUTION.yaml` state:

1. re-read `.planning/EXECUTION.yaml` and the relevant leaf `depends_on` relationships;
2. if this same chat still has another runnable assigned node, continue with it instead of asking the user to open another chat;
3. otherwise determine which other pending executor chats now have at least one runnable assigned node;
4. if another executor conversation is required, emit the configured new-chat handoff and treat this conversation as execution-closed immediately after emitting it;
5. tell the user the exact runnable chat ID or IDs and the exact next command, for example `אני צאט 3 תתחיל` / `I am chat 3`;
6. if several independent chats are runnable, say that they may be opened in parallel when the target repository workflow permits it; do not imply serial order merely from chat numbering;
7. if no pending chat is runnable, state the exact dependency/blocker that prevents progress rather than giving a generic "continue later" message;
8. if all required execution leaves are `done`, do **not** infer `cycle_state: completed`. Tell the user that implementation work is complete and that the next action is to open or return to a planning chat in the same repository and say `בדוק וסגור את מחזור S&T לפי הריפו` (or `Review and close the S&T cycle from the repository`). The planner must run Cycle Closure Review and prove the integrated root outcome before completion.

Never require the user to read `STATUS.yaml`, `EXECUTION.yaml`, or `TREE.yaml` to choose the next chat or decide whether closure is next.

## Planning defect discovered during execution

If implementation reveals a material planning gap or contradiction:

1. stop the affected node;
2. mark it `blocked` with a short factual reason in `.planning/EXECUTION.yaml`;
3. keep `.planning/STATUS.yaml -> cycle_state: active`;
4. set `.planning/STATUS.yaml -> plan_state: active`;
5. set `.planning/STATUS.yaml -> implementation_authorized: false`;
6. stop starting new execution work;
7. return the smallest affected S&T area to planning.

Do not redesign the plan inside an executor chat.

Tell the user exactly what happened and what to do next. The user-facing next action is to open or return to a planning chat in the same repository and say `תקן והמשך את מחזור S&T לפי הריפו` (or `Repair and continue the S&T cycle from the repository`). The executor should identify the factual planning defect, but the user should not need to interpret STATUS/EXECUTION state or restate the affected design context.

After correction, re-freeze alone is not enough. The planner must record the corrected reviewed baseline, pass freeze no-drift verification again, freeze that verified baseline, run allocation validation in `--resume` mode, and rerun the required fresh-chat handoff verification before `.planning/STATUS.yaml -> implementation_authorized: true` is explicitly restored.

## Mandatory fresh-chat verification before authorization

After allocation, first require a clean mechanical allocation validation:

```text
node .planning/validate-allocation.mjs --initial
```

Use `--resume` instead when re-authorizing after execution/replanning, and add `--serial-chats` only when numbered chats are explicitly serial.

Only after allocation validation passes may the planner simulate a brand-new executor using **repository state only**, without relying on planning-chat memory.

Verify these representative situations:

1. **first available executor** — can identify its assignment and first runnable node after explicit startup;
2. **dependency-blocked early executor** — can identify that no node may start yet and exactly which prerequisite state blocks progress;
3. **mid-plan executor with multiple dependencies** — can resolve all prerequisite states and determine what is runnable;
4. **final closure executor** — can determine the remaining assigned work, the evidence needed to finish it, and the correct user-facing transition to Cycle Closure Review when all required leaves become done;
5. **planning-defect executor** — can stop safely, revoke further execution through repository state, identify the factual defect, and give the exact user-facing transition back to planning without asking the user to reconstruct context;
6. **old-conversation rollover regression** — Chat N completes, emits `SEQUENCE_RUNNER_NEW_CHAT`, repository state advances to Chat N+1, and `תמשיך לשלב הבא` is sent in the same conversation. The result must be no N+1 bootstrap, no node execution, no branch/code/status mutation for N+1, and a short instruction to open a new conversation and explicitly start N+1;
7. **new-conversation activation** — a fresh conversation receives the explicit `אני צאט N תתחיל` startup, repository state confirms that allocation/authorization, and only then execution becomes active.

Use actual chats/nodes from the allocation when they exist. If a small allocation does not contain a literal example of one situation, simulate that condition against the closest real assignment **without mutating durable execution state**, and record the adaptation.

For every simulation, the fresh executor must be able to determine:

- whether the cycle is active;
- whether implementation is authorized;
- which identity was explicitly activated in this conversation;
- which nodes belong to that same chat;
- prerequisite states;
- the first available node, or that none is available;
- the exact contract/project context it should load next;
- the factual reason it cannot proceed when unavailable;
- after its assigned work finishes, the exact next runnable chat ID(s), Cycle Closure Review, or return-to-planning action.

Record the post-allocation verification result in `.planning/REVIEWS.md`.

Any allocation-validator failure or failed simulation keeps `.planning/STATUS.yaml -> implementation_authorized: false`. Fix the smallest allocation/handoff/routing/authority defect and repeat the failed gate before authorization.
