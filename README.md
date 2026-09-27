# S&T Planner

A reusable planning framework for GPT and other AI agents, based on Strategy & Tactics (S&T) logic from the Theory of Constraints.

The goal is simple: **before an AI executes a meaningful project, it should be able to explain and validate the path from the desired outcome to executable work.**

## Status

**v0.1 bootstrap — usable planning protocol under construction.**

This repository is the framework. A real project keeps its own planning state in a small `.planning/` directory.

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

For a new project, copy `templates/project/.planning/` into the target repository and tell the AI:

> Read this project's AGENTS.md and .planning/README.md. Use the S&T Planner protocol. Do not implement until planning gates allow implementation.

Then provide the goal in normal language.

The AI should:

1. establish the goal, current reality, constraints and non-goals;
2. construct the S&T tree;
3. challenge necessity and sufficiency;
4. simplify the plan;
5. stop decomposition only at executable leaves;
6. persist the state in `.planning/`;
7. compile approved leaves into implementation work.

## Repository structure

- `AGENTS.md` — mandatory operating rules for AI agents
- `docs/SNT-METHODOLOGY.md` — expanded S&T methodology
- `docs/AI-PLANNING-PROTOCOL.md` — deterministic workflow for AI planning
- `docs/QUALITY-GATES.md` — review gates and completion criteria
- `docs/PLANNER-SNT.md` — S&T tree for this planner itself
- `templates/project/.planning/` — files copied into a target project
- `examples/` — worked examples

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
