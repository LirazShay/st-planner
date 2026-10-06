# Numbered Executor Chats

After the complete S&T plan is frozen, implementation-ready leaves are allocated directly to numbered chats in `.planning/EXECUTION.yaml`. Allocation still does not authorize execution and does not activate a conversation identity.

No separate task layer is required.

## Starting a chat

The preferred explicit startup is:

> אני צאט 1 תתחיל

Established explicit forms such as:

> I am chat 1.

or:

> אני צ'אט מספר 1

also identify the executor intentionally.

A generic continuation such as `תמשיך לשלב הבא` / `continue` is never executor startup.

Before any implementation mutation, the executor must apply two independent gates in this order:

1. **Conversation identity gate** — this conversation must have explicitly activated Chat N and must not already be execution-closed after a new-chat handoff.
2. **Repository authority gate** — repository state must still authorize execution and confirm Chat N's allocation/dependencies.

Repository state may confirm Chat N, but it may never create or change the conversation's identity. A target-owned `current_chat`, a newly runnable chat, or a `NEXT_CHAT_PROMPT` does not implicitly turn the existing conversation into that chat.

Once a conversation has activated Chat N, its executor identity is immutable. If repository state later points to another chat, do not adopt that ID. If the conversation has emitted `[[SEQUENCE_RUNNER_NEW_CHAT]] ... [[/SEQUENCE_RUNNER_NEW_CHAT]]`, it is terminal for execution of later allocated chats.

Therefore, if Chat 16 has handed off to Chat 17 and the user writes `תמשיך לשלב הבא` in the old conversation, the correct response is a short redirect such as:

```text
העבודה בצ'אט הזה הסתיימה והועברה ל-Chat 17.
פתח צ'אט חדש ושלח:
אני צאט 17 תתחיל
```

No Chat 17 bootstrap, node start, branch creation, code change, or execution/status mutation may occur in the old conversation.

For a valid fresh startup, the executor then:

1. reads repository `AGENTS.md` and its routing/source-of-truth rules;
2. reads `.planning/EXECUTOR_HANDOFF.md`;
3. confirms the conversation identity from the explicit startup and that the conversation is not execution-closed;
4. confirms `.planning/STATUS.yaml -> cycle_state: active`;
5. confirms `.planning/STATUS.yaml -> plan_state: frozen`;
6. confirms `.planning/STATUS.yaml -> implementation_authorized: true`;
7. reads `.planning/EXECUTION.yaml`;
8. finds the same Chat N that was explicitly activated;
9. reads only the assigned S&T nodes from `TREE.yaml`;
10. checks each node's `depends_on` prerequisites;
11. finds those prerequisite node states in `EXECUTION.yaml`;
12. follows EXECUTOR_HANDOFF context routing to load only materially required decisions/specs/code/tests;
13. executes only assigned nodes whose prerequisites are `done`;
14. updates execution state as work proceeds.

A `completed` or `abandoned` cycle is terminal. Do not execute old assignments from it even if its plan remains frozen in Git history.

If chat N does not exist, do not invent work.

## Node execution

Before starting one assigned node:

```yaml
state: in_progress
```

After its `success_evidence` is verified:

```yaml
state: done
result: "short verification / commit / test reference"
```

If a real blocker prevents correct execution:

```yaml
state: blocked
result: "short blocker reason"
```

Do not use `blocked` merely because another node dependency is not done; that node simply remains pending until its prerequisite completes.

## Parallel work

Parallelism comes directly from `TREE.yaml -> depends_on`.

If two assigned nodes have no unmet prerequisites between them, their chats may work in parallel.

No scheduler or chat-level dependency graph is needed.

## Chat sizing

The planner decides the number of executor chats after seeing the complete frozen tree.

Group work using these priorities:

1. keep closely related nodes/context together;
2. preserve dependency order;
3. keep each chat to a manageable amount of work/context;
4. then balance independent work across chats where practical.

Use leaf count only as a rough workload signal; consider the actual tactic/scope as well.

There is no fixed number of nodes per chat. Prefer the fewest executor chats that remain practical and coherent.

If a single leaf is too large for one chat, the planning granularity is wrong; reopen that leaf and decompose it.

## Completion

A chat is effectively complete when all nodes assigned to it are `done`.

The file does not need a duplicated chat-level status.

If another executor chat must continue the work, emit the new-chat handoff and treat the current conversation as execution-closed immediately. Repository advancement to the next chat never reopens or re-identifies the old conversation.

Completion of every chat/node does **not** by itself change `.planning/STATUS.yaml -> cycle_state`. The planning side closes the whole cycle only after Cycle Closure Review verifies the root outcome and durable-contract handoff.

## Planning defect discovered by an executor

If the executor finds a material missing/contradictory planning decision:

1. stop only the affected work;
2. set the affected node to `blocked`;
3. write a short factual blocker in `result`;
4. keep `.planning/STATUS.yaml -> cycle_state: active`;
5. set `.planning/STATUS.yaml -> plan_state: active`;
6. set `.planning/STATUS.yaml -> implementation_authorized: false`;
7. do not continue other execution until planning is re-frozen, the mandatory fresh-chat handoff verification passes again and is recorded, and authorization is explicitly restored.

A planner then reopens the smallest affected S&T area.

After re-freeze and explicit re-authorization, the same or another numbered chat resumes from the updated EXECUTION file. Unaffected valid completed nodes remain done.
