# Execution Handoff

S&T Planner does not need its own execution engine.

After Final Planning Review passes and the plan is frozen, convert implementation-ready S&T leaves into ordinary GitHub Issues/tasks.

## Each task should contain

- S&T node ID(s)
- responsibility / desired outcome
- scope
- relevant constraints and decisions
- dependencies / prerequisites
- acceptance or success evidence
- explicit out-of-scope notes when useful

## Executor chat

An executor receives one Issue/task or a small compatible group.

It implements what was already planned.

If it encounters a **material planning gap** rather than an implementation detail, it stops the affected work and returns the problem to planning.

## Why this is enough

GitHub already provides:
- task status;
- ownership;
- dependencies/links;
- discussion;
- PRs;
- history.

The S&T framework should not duplicate those features.


## Numbered executor chats

After Issues are created, optionally group them in:

`.planning/CHAT-ASSIGNMENTS.yaml`

This supports the generic workflow:

> I am chat 1.

The executor then reads the assignment for chat 1, checks dependencies, pulls the listed GitHub Issues, reads their referenced S&T context, and performs only that work.

The assignment map is intentionally thin. It does not duplicate Issue descriptions or create another execution tracker.
