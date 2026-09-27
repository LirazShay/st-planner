# S&T Planner

A small reusable framework that helps GPT plan complex work with Strategy & Tactics logic instead of producing an arbitrary checklist.

## What it does

The framework guides GPT through:

```
Goal
→ S&T tree
→ necessity / sufficiency checks
→ repeated critique
→ final whole-plan review
→ frozen implementation-ready plan
→ GitHub Issues / execution tasks
```

The **planning is the product**. Execution starts only after the complete intended plan has passed final review.

## KISS operating model

Default:
- use one planning chat from start to finish;
- persist the plan in the repository while working;
- move to another planning chat only if needed;
- after the plan is final, turn executable leaves into GitHub Issues/tasks;
- execution chats work from those tasks and the referenced S&T nodes.

No server, database, plugin runtime, state machine, or execution engine is required.

## Core project files

Copy `templates/project/.planning/` into a target repository:

- `FRAMEWORK.md` — portable S&T rules
- `GOAL.md` — stable goal boundary
- `TREE.yaml` — S&T plan
- `DECISIONS.md` — material open questions and decisions
- `REVIEWS.md` — planning reviews
- `STATUS.yaml` — small resume pointer

Also merge `templates/project/AGENTS.snippet.md` into the project's `AGENTS.md`.

Start planning with `templates/START-PROMPT.md`.

## When planning is complete

The entire intended tree must be implementation-ready and pass Final Planning Review.

Only then:
1. freeze the plan;
2. create execution tasks/Issues from executable leaves;
3. give each executor chat one bounded task or a small compatible group;
4. keep the S&T node ID on the task for traceability.

If execution later discovers a real planning defect, return that defect to planning and reopen only the affected part.

## Main documentation

- `docs/SNT-METHODOLOGY.md` — expanded S&T method
- `docs/AI-PLANNING-PROTOCOL.md` — how GPT plans
- `docs/QUALITY-GATES.md` — how GPT critiques the plan
- `docs/FRAMEWORK-LIFECYCLE.md` — simple planning lifecycle
- `docs/EXECUTION-HANDOFF.md` — minimal post-planning handoff
- `docs/PLANNER-SNT.md` — S&T of this framework itself
- `docs/USAGE.md` — how to use it in another project

## Design principles

- Logic before tooling.
- Necessary individually, sufficient together.
- The tree determines the number of steps.
- One source of truth per fact.
- One planning chat by default.
- Git is durable memory, not workflow bureaucracy.
- Execution is downstream of a completed plan.
- Prefer KISS.
