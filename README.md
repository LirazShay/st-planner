# S&T Planner

A small reusable framework that helps GPT plan complex work with Strategy & Tactics logic instead of producing an arbitrary checklist.

## Quick start — from any other repository

The target repository does **not** need S&T Planner installed beforehand.

Open a chat that is working on the target repository and say:

> **תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה לבנות/לשנות>**

That's the normal entry point.

The agent should:

1. fetch `LirazShay/st-planner/BOOTSTRAP.md`;
2. follow its bootstrap contract;
3. copy the required `.planning/` framework files into the current target repository;
4. merge the S&T rules into the target `AGENTS.md` without deleting existing project rules;
5. continue immediately into planning in the same chat.

You do not manually install files and you do not need to paste the framework workflow.

After planning is frozen, allocated, handoff-checked, and explicitly authorized, executor chats in the target repository can simply say:

> **אני צ'אט מספר 1**

### Already installed?

If the target repository already has S&T Planner state, the bootstrap must not overwrite live planning files. It simply uses the existing installation unless you explicitly ask to upgrade it.

## What it does

The framework guides GPT through:

```
Goal
→ S&T tree
→ necessity / sufficiency checks
→ repeated critique
→ final whole-plan review
→ frozen implementation-ready plan
→ execution allocation + handoff checks
→ explicit implementation authorization
→ numbered execution chats directly from S&T node IDs
```

The **planning is the product**. Passing final review and freezing closes the planning baseline; execution starts only after post-freeze handoff is complete and implementation is explicitly authorized.

## KISS operating model

Default:
- use one planning chat from start to finish;
- persist the plan in the repository while working;
- move to another planning chat only if needed;
- after the plan is final, freeze it with implementation still unauthorized;
- allocate implementation-ready leaves directly to numbered execution chats in `.planning/EXECUTION.yaml`;
- run and record the mandatory repository-only fresh-chat handoff verification, then explicitly authorize implementation;
- execution chats work directly from their assigned S&T node IDs.

No server, database, plugin runtime, state machine, or execution engine is required.

## Core project files

The external bootstrap copies these from `templates/project/.planning/` into the target repository:

- `FRAMEWORK.md` — portable S&T rules
- `GOAL.md` — stable goal boundary
- `TREE.yaml` — S&T plan
- `DECISIONS.md` — material open questions and decisions
- `REVIEWS.md` — planning reviews
- `STATUS.yaml` — small resume pointer plus separate planning-freeze and implementation-authorization state
- `EXECUTION.yaml` — after freeze, maps numbered executor chats directly to S&T leaves and tracks execution state
- `EXECUTOR_HANDOFF.md` — portable fresh-executor read order, context routing, dependency behavior, and mandatory handoff-verification contract

The bootstrap also merges `templates/project/AGENTS.snippet.md` into the target project's `AGENTS.md`.

For the exact external installation behavior, `BOOTSTRAP.md` is authoritative.

## When planning is complete

The entire intended tree must be implementation-ready and pass Final Planning Review.

Only then:
1. freeze the plan while keeping `implementation_authorized: false`;
2. collect every implementation-ready leaf;
3. group those leaf node IDs into numbered chats in `.planning/EXECUTION.yaml`;
4. initialize each assigned node as `pending`;
5. simulate the required repository-only fresh executor cases from `.planning/EXECUTOR_HANDOFF.md`;
6. record the verification in `.planning/REVIEWS.md`;
7. fix/rerun any failed case;
8. explicitly set `implementation_authorized: true` only after the gate passes.

Then a new executor chat can say, for example, **"I am chat 1"** and immediately discover the S&T nodes it owns without the user re-explaining the project.

If execution later discovers a real planning defect, revoke implementation authorization, return that defect to planning, and reopen only the affected part.

## Main documentation

- `PILOT_RECOMMENDATIONS.md` — actionable backlog from the first full MarketScope pilot; start here before the next framework-improvement pass
- `docs/SNT-GOLDRATT-GUIDE.html` — מדריך HTML חזותי בעברית למאמר המקורי ולמיפוי שלו ל-S&T Planner
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
