# Using S&T Planner in Another Project

## Setup

Copy:

```
templates/project/.planning/  -> target/.planning/
templates/project/AGENTS.snippet.md -> merge into target AGENTS.md
```

Then start with `templates/START-PROMPT.md`.

## Default workflow

Use **one planning chat** if practical.

The chat:
1. defines the goal;
2. builds the S&T;
3. repeatedly reviews/corrects it;
4. performs a Final Planning Review;
5. freezes the plan.

The repository state is updated during the work so nothing important depends on the transcript.

## Continuing in another chat

Only when useful, start a new chat with:

> Continue the S&T planning for this project. Read AGENTS.md and .planning/README.md, resume from STATUS.yaml, and continue the recorded planning action. Do not implement the target project.

This is optional continuation, not the default workflow.

## After planning

Once `plan_state: frozen`, create GitHub Issues/tasks from implementation-ready leaves.

Then populate `.planning/CHAT-ASSIGNMENTS.yaml` with the chat-to-Issue mapping.

Each execution task should contain:
- S&T node ID;
- responsibility/outcome;
- scope;
- dependencies;
- relevant decisions/constraints;
- acceptance evidence.

An executor chat can then start with only a number, for example:

> I am chat 2.

It reads `CHAT-ASSIGNMENTS.yaml`, pulls its assigned GitHub Issues, checks prerequisite chats, and works from those Issues plus referenced planning context.

## If implementation exposes a planning defect

Do not build a second planning bureaucracy.

Simply:
1. stop the affected implementation;
2. record the concrete problem on the task;
3. reopen the affected S&T area;
4. correct/review/freeze again;
5. update affected tasks.

## V1 principle

The framework improves **planning quality**.

Git/GitHub provides persistence and ordinary execution tracking.

Keep those responsibilities separate and simple.
