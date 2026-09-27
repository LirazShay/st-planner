# Numbered Executor Chats

This is a small generic handoff layer for projects that will be implemented across multiple GPT chats.

It exists only **after planning is complete**.

## Goal

After the S&T plan is frozen and GitHub Issues have been created, the planner assigns those Issues to numbered executor chats.

Then a new chat can begin with only:

> I am chat 1.

or:

> I am chat 2.

The framework lets it discover its responsibility from GitHub without the user re-explaining the work.

## Source of truth

Keep responsibilities separated:

- `TREE.yaml` — why the work exists and the planning logic.
- GitHub Issues — detailed execution tasks.
- `CHAT-ASSIGNMENTS.yaml` — only the mapping from chat number to Issues/S&T nodes/dependencies.

Do not copy full Issue descriptions into `CHAT-ASSIGNMENTS.yaml`.

## Assignment format

```yaml
assignments:
  "1":
    issues:
      - 101
      - 102
    snt_nodes:
      - "1.2.1"
      - "1.2.2"
    depends_on_chats: []

  "2":
    issues:
      - 103
    snt_nodes:
      - "1.3.1"
    depends_on_chats:
      - "1"
```

That is intentionally the whole V1 schema.

## What "I am chat N" means

When an executor chat identifies itself as chat N:

1. Read the repository `AGENTS.md`.
2. Confirm `.planning/STATUS.yaml -> plan_state: frozen`.
3. Read `.planning/CHAT-ASSIGNMENTS.yaml`.
4. Find assignment `N`.
5. Check every `depends_on_chats` prerequisite.
6. For each prerequisite chat, inspect its assigned GitHub Issues and confirm they are complete.
7. Pull only the GitHub Issues assigned to chat N.
8. Read only the referenced S&T nodes/decisions needed to understand those Issues.
9. Execute only that assigned work.
10. Use the normal GitHub Issue/PR workflow to report completion.

If no assignment exists for N, do not invent work.

If a prerequisite is incomplete, do not steal other work; report that chat N is blocked by the prerequisite.

## Parallel work

Two chats may run in parallel when neither depends on the other.

Example:

```yaml
"2":
  depends_on_chats: []

"3":
  depends_on_chats: []
```

Both may start after the plan is frozen.

No scheduler is needed.

## Why chat numbers instead of another task system?

The number is only a convenient lookup key.

GitHub still owns:
- task descriptions;
- status;
- discussion;
- PRs;
- implementation history.

The S&T framework only answers:

> Which already-planned GitHub work belongs to this executor chat?

## Planning responsibility

The planner creates `CHAT-ASSIGNMENTS.yaml` only after:
- Final Planning Review passed;
- `plan_state: frozen`;
- execution Issues were created.

The planner decides how to group Issues into chats based on coherent responsibility and dependencies.

Do not create one chat per Issue automatically. Grouping should minimize context switching while keeping responsibility clear.
