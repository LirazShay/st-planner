# ST Planner

A lightweight Strategy & Tactics framework for AI-assisted planning **and execution management**.

> **License:** proprietary, source-available. Operational use requires a paid commercial license from the copyright holder. See `LICENSE`.

## What ST Planner is for

ST Planner helps an AI or team:

1. identify the real outcome rather than blindly accept a proposed solution;
2. reason through Strategy/Tactic choices and material assumptions;
3. test necessity and sufficiency of decomposition;
4. turn the plan into implementation-ready leaves/tasks;
5. allocate those tasks to chats, agents, developers, or teams;
6. track execution with minimal durable state;
7. replan only when new evidence actually invalidates the plan.

The design target is:

> **Strict thinking. Lightweight process. Clear instructions. Minimal state.**

## Use it from another repository

The target repository does **not** need ST Planner installed beforehand.

In a chat working on that repository, say for example:

> תעבוד עם ST Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

The agent reads the current `BOOTSTRAP.md`, follows the current methodology, investigates the target repository, and creates only the project-owned planning artifacts that the work actually needs.

No framework scripts, hashes, release manifest, validators, or copied framework runtime are required in the target repository.

## Default project artifacts

For meaningful work the normal durable state is:

```text
.planning/
├── PLAN.md
└── EXECUTION.md
```

`PLAN.md` contains the reasoning:

- outcome and relevant current reality;
- constraints/non-goals;
- Strategy/Tactic reasoning;
- assumptions and material alternatives;
- necessity/sufficiency decomposition;
- implementation-ready leaves;
- objective success evidence;
- material decisions/open questions;
- final review.

`EXECUTION.md` contains the work-management projection:

- task/leaf ID;
- owner (`Chat N`, agent, developer, team, etc.);
- execution status;
- real prerequisite when needed;
- short result/evidence.

Optional artifacts are created only when they solve a real readability/continuity problem:

```text
.planning/STATUS.md
.planning/DECISIONS.md
```

## Core planning model

Each material S&T step pairs:

- **Strategy — What outcome is required?**
- **Tactic — How will that outcome be achieved?**

The planner challenges two dimensions:

- **horizontal choice** — why this tactic instead of a materially plausible alternative?
- **vertical decomposition** — why is each child necessary, and why are the children sufficient together?

Reasoning depth follows material uncertainty, impact, reversibility, and risk. There is no QUICK/DEEP mode and no fixed phase count.

See `docs/SNT-METHODOLOGY.md`.

## Execution management without a workflow engine

Implementation-ready S&T leaves become the tasks. ST Planner does not duplicate them into another task-description system.

A simple execution map is enough, for example:

| Task | Owner | Status | Depends on | Result |
|---|---|---|---|---|
| 3.2.1 | Chat 8 | done | — | regression green |
| 3.2.2 | Chat 8 | in_progress | 3.2.1 | — |
| 4.1 | Agent B | pending | — | — |

Useful execution state is about the work itself:

```text
pending | in_progress | done | blocked
```

ST Planner does **not** require framework state such as freeze/unfreeze, implementation authorization, allocation validation, handoff validation, projection synchronization, or planning lifecycle gates.

Numbered chats remain supported. A new Chat N starts only by explicit activation such as `אני צאט N תתחיל`; a generic continuation must not silently switch executor identity.

See `docs/EXECUTION-MANAGEMENT.md`.

## When implementation finds a problem

Use the **Planning Impact Test**:

> Does the new fact materially invalidate a Strategy, Tactic, assumption, contract, dependency, or success criterion?

- **No — implementation defect:** understand root cause, fix, add appropriate regression/prevention, check analogous exposure when justified, verify, continue.
- **Local planning correction:** update the smallest affected planning area, review the impact, continue.
- **Material plan invalidation:** stop only affected work, revise the affected S&T area and downstream execution map, review, continue.

Do not globally reset unrelated work.

## CI warnings/errors

Do not ignore them and do not accept a symptom-only patch. Understand the root cause, prevention/detection gap, materially analogous exposure, and closing evidence.

The depth is proportional to the signal. If a check itself is obsolete or brittle and protects no useful invariant, fix or remove the check rather than adding bureaucracy around it.

## Anti-bureaucracy rule

Before adding any planner file, state, validator, script, gate, marker, workflow, or metadata field, ask:

1. What real failure does this prevent?
2. Can a simpler instruction or existing repository mechanism prevent it sufficiently?
3. Is its maintenance cost lower than the uncertainty/risk it removes?

> **Model the work, not the management of the work.**

## Main documents

- `BOOTSTRAP.md` — authoritative external entry contract
- `docs/SNT-METHODOLOGY.md` — planning/reasoning method
- `docs/EXECUTION-MANAGEMENT.md` — task allocation and lightweight execution method
- `templates/` — optional starting shapes for project artifacts
- `CHANGELOG.md` — human-readable history

## Design principles

- Outcome before proposed solution.
- Deep reasoning without repetitive ceremony.
- Necessary individually, sufficient together.
- Material alternatives, not artificial option lists.
- One source of truth per fact.
- S&T leaves become executable work.
- Execution tracking stays minimal.
- Local defects stay local unless they invalidate the plan.
- Fresh-chat recoverability is a design property, not a gate.
- KISS applies to the planner itself.
