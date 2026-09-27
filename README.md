# S&T Planner

A small reusable framework that helps GPT plan complex work with Strategy & Tactics logic instead of producing an arbitrary checklist.

## Quick start

Install once in a target repository:

1. Copy `templates/project/.planning/` to `.planning/`.
2. Merge `templates/project/AGENTS.snippet.md` into the target repository's `AGENTS.md`.

After that, normal usage is one sentence:

> **תתכנן לי בשיטת S&T Planner לפי הריפו: <מה אני רוצה לבנות/לשנות>**

That's it.

The agent is responsible for reading the repository correctly, building and reviewing the full S&T plan, persisting the planning files, freezing only when the plan is ready, and preparing `EXECUTION.yaml`.

`templates/START-PROMPT.md` remains only as an optional copy/paste example; it is not required.

## What it does

The framework guides GPT through:

```
Goal
→ S&T tree
→ necessity / sufficiency checks
→ repeated critique
→ final whole-plan review
→ frozen implementation-ready plan
→ numbered execution chats directly from S&T node IDs
```

The **planning is the product**. Execution starts only after the complete intended plan has passed final review.

## KISS operating model

Default:
- use one planning chat from start to finish;
- persist the plan in the repository while working;
- move to another planning chat only if needed;
- after the plan is final, allocate implementation-ready leaves directly to numbered execution chats in `.planning/EXECUTION.yaml`;
- execution chats work directly from their assigned S&T node IDs.

No server, database, plugin runtime, state machine, or execution engine is required.

## Core project files

Copy `templates/project/.planning/` into a target repository:

- `FRAMEWORK.md` — portable S&T rules
- `GOAL.md` — stable goal boundary
- `TREE.yaml` — S&T plan
- `DECISIONS.md` — material open questions and decisions
- `REVIEWS.md` — planning reviews
- `STATUS.yaml` — small resume pointer
- `EXECUTION.yaml` — after freeze, maps numbered executor chats directly to S&T leaves and tracks execution state

Also merge `templates/project/AGENTS.snippet.md` into the project's `AGENTS.md`.

After installation, start planning with a natural S&T Planner request; no special starter prompt is required.

## When planning is complete

The entire intended tree must be implementation-ready and pass Final Planning Review.

Only then:
1. freeze the plan;
2. collect every implementation-ready leaf;
3. group those leaf node IDs into numbered chats in `.planning/EXECUTION.yaml`;
4. initialize each assigned node as `pending`.

Then a new executor chat can say, for example, **"I am chat 1"** and immediately discover the S&T nodes it owns without the user re-explaining the project.

If execution later discovers a real planning defect, return that defect to planning and reopen only the affected part.

## Main documentation

- `docs/SNT-METHODOLOGY.md` — expanded S&T method
- `docs/AI-PLANNING-PROTOCOL.md` — how GPT plans
- `docs/QUALITY-GATES.md` — how GPT critiques the plan
- `docs/FRAMEWORK-LIFECYCLE.md` — simple planning lifecycle
- `docs/EXECUTION-HANDOFF.md` — minimal frozen-plan → execution allocation
- `docs/CHAT-EXECUTION.md` — numbered executor-chat workflow
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
