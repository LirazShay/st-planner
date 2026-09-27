# Numbered Executor Chats

This is a small generic handoff layer for projects implemented across multiple GPT chats.

It exists only after planning is complete.

## Goal

After the S&T plan is frozen and GitHub Issues are created, the planner groups those Issues into numbered executor chats.

Then a new chat can begin with only:

> I am chat 1.

or:

> אני צ'אט מספר 2

and discover its work without the user re-explaining the project.

## Source of truth

Keep responsibilities separate:

- `TREE.yaml` — planning rationale and leaf `depends_on` prerequisites.
- GitHub Issues — detailed execution tasks, copied dependency relationships/status, discussion, PRs, and completion.
- `CHAT-ASSIGNMENTS.yaml` — only chat number → Issue numbers + source S&T node IDs.

Do not copy full Issue descriptions or a second dependency graph into `CHAT-ASSIGNMENTS.yaml`.

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

  "2":
    issues:
      - 103
    snt_nodes:
      - "1.3.1"
```

That is the whole V1 schema.

## What "I am chat N" means

1. Read repository `AGENTS.md`.
2. Confirm `.planning/STATUS.yaml -> plan_state: frozen`.
3. Read `.planning/CHAT-ASSIGNMENTS.yaml`.
4. Find assignment N. If missing, do not invent work.
5. Pull only the assigned GitHub Issues.
6. Inspect the dependency/prerequisite information on those Issues.
7. If an assigned Issue is blocked by an incomplete prerequisite, report the blocker and do not steal unrelated work.
8. Read only the referenced S&T nodes/decisions/project files needed for those Issues.
9. Execute only the assigned work.
10. Use the normal GitHub Issue/PR workflow for completion.

## Parallel work

Parallelism is derived from Issue dependencies.

If chat 2's Issues have no unresolved prerequisites from chat 1's Issues, both chats may run.

No scheduler and no chat-level dependency graph are needed.

## Planning responsibility

After Final Planning Review:
1. freeze the plan;
2. create Issues from implementation-ready leaves;
3. copy each leaf's `depends_on` relation into the corresponding Issue dependency/prerequisite information;
4. group coherent Issues into numbered chats;
5. write only the mapping to `CHAT-ASSIGNMENTS.yaml`.

Do not create one chat per Issue automatically. Group related work when doing so preserves clear responsibility and valid dependency ordering.
