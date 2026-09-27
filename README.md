# S&T Planner

A reusable planning framework for GPT and other AI agents, based on Strategy & Tactics (S&T) logic from the Theory of Constraints.

The goal is broader: **any capable GPT/chat should be able to use one consistent S&T framework to build a complete logical plan first, freeze it only after full review, and only then let separate executor chats implement bounded responsibilities from that frozen plan.**

## Status

**v0.2 — lifecycle framework in validation.** The planning/handoff core is usable and has passed fresh-session checks. The framework now also covers connection, execution, verification, and feedback-driven replanning; those lifecycle additions are being acceptance-tested before the framework is treated as complete.

This repository is the framework source. A real project carries a small portable kernel and durable lifecycle state in `.planning/`. The chat/model is replaceable; the framework state is not.

## Core idea

A plan is not a numbered task list. It is a logical tree.

For every step:

- **Strategy** — the objective / “what for?”
- **Tactic** — the action / “how?”
- **Parallel assumptions** — why this tactic is appropriate and sufficient for this strategy
- **Necessary assumptions** — why a lower step is necessary for its parent
- **Sufficiency assumptions** — why the lower group is sufficient together

When going down a level, ask: **How exactly must the parent tactic be performed?**

When going up a level, ask: **Why do we need to achieve this strategy?**

## Quick start

For a new project:

1. Copy `templates/project/.planning/` into the target repository.
2. Merge `templates/project/AGENTS.snippet.md` into the target repository's `AGENTS.md`.
3. Start GPT with `templates/START-PROMPT.md`.

The copied `.planning/FRAMEWORK.md` is a self-contained S&T kernel, so ordinary planning does not depend on this repository or on previous chat history.

Then provide the goal in normal language.

The default workflow is:

1. one planner chat connects to the framework;
2. it establishes the stable goal boundary;
3. it constructs the complete intended S&T tree;
4. it repeatedly critiques and corrects the plan;
5. it runs a final whole-tree review;
6. only then it freezes the planning baseline;
7. the framework compiles the frozen plan into execution work packages;
8. separate executor chats implement those packages;
9. execution evidence is recorded and material planning exceptions are returned to a planner.

Planning may continue in another chat if necessary, but the framework does not split planning into multiple chats by default.

## Repository structure

- `AGENTS.md` — mandatory operating rules for AI agents
- `docs/SNT-METHODOLOGY.md` — expanded S&T methodology
- `docs/AI-PLANNING-PROTOCOL.md` — deterministic workflow for AI planning
- `docs/QUALITY-GATES.md` — review gates and completion criteria
- `docs/FRAMEWORK-LIFECYCLE.md` — full connect → plan → execute → verify → replan loop
- `docs/CONNECTION-MODEL.md` — how any GPT/chat attaches to the framework
- `docs/EXECUTION-PROTOCOL.md` — execution, verification, and feedback rules
- `docs/PLANNER-SNT.md` — S&T tree for the framework itself
- `templates/project/.planning/` — self-contained planning state and portable S&T kernel copied into a target project
- `templates/START-PROMPT.md` — planner bootstrap
- `templates/EXECUTOR-PROMPT.md` — executor bootstrap after planning freeze
- `docs/USAGE.md` — exact adoption and resume instructions
- `examples/` — guidance for future worked examples

## Modes

### QUICK

For small, low-risk work. Uses the same logic with fewer written assumptions.

### DEEP

For projects, architecture, migrations, ambiguous goals, or costly/reversible decisions. Persists the complete tree and runs all review gates.

The mode affects documentation depth, **not logical rigor**.

## Source and attribution

The core S&T concepts are based on *Strategy and Tactics* by Eli Goldratt, Rami Goldratt and Eli Abramov, originally released for public study at Washington State University. The original source is referenced in `docs/SNT-METHODOLOGY.md`.

This repository does **not** reproduce the original paper. It provides an independently written, extended operational guide for AI-assisted planning.

## Design principles

- Logic before tooling.
- Necessary individually, sufficient together.
- One strategy/tactic pair per step.
- Do not invent a fixed number of phases in advance.
- Separate facts, assumptions, decisions and unknowns.
- Git is the durable memory; chat history is not.
- Issues are compiled output of an approved plan, not the plan itself.
- Prefer KISS over speculative completeness.
