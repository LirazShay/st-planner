# AGENTS.md — ST Planner Source Contract

This repository contains ST Planner: a lightweight Strategy & Tactics planning and execution-management method for AI-assisted software/product work.

Keep the framework deeply reasoned, small, externally usable, and resistant to process bloat.

## User-facing goal

A user working in another repository should be able to say:

> תעבוד עם ST Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

The agent should read the current framework source, understand the target repository, build a rigorous S&T plan, decompose it into implementation-ready work, and manage execution through minimal durable project state.

## Source-of-truth hierarchy

- `BOOTSTRAP.md` — authoritative external entry contract.
- `docs/SNT-METHODOLOGY.md` — authoritative reasoning/planning method.
- `docs/EXECUTION-MANAGEMENT.md` — authoritative lightweight execution-management method.
- `templates/` — optional starting shapes for project-owned planning artifacts.
- `README.md` — concise user-facing overview.
- `CHANGELOG.md` — human-readable framework history; it is not an execution gate.

Do not create duplicate authorities for the same rule.

## Core planning rule

For meaningful work, resolve the material planning questions before implementation of that scope.

Every material S&T step should make clear:

- Strategy — required objective/outcome;
- Tactic — selected way to achieve it;
- assumptions that justify tactic validity;
- necessity of required children;
- sufficiency of the children together;
- materially plausible alternatives where they can change the decision;
- objective success evidence.

Do not use fixed phase counts or QUICK/DEEP modes. Reasoning depth follows material uncertainty, reversibility, impact, and risk.

## Efficient deep planning

Efficiency comes from removing bureaucracy, not from weakening reasoning.

- make a short structural map before deep decomposition when it helps orientation;
- plan and review coherent slices rather than repeating ceremony after every edit;
- reopen a justified material decision only when new evidence, contradiction, changed assumptions, or review findings can change it materially;
- use a final outside-in review for the selected planning scope;
- stop decomposition when leaves are decision-complete and practical to execute.

Existing patterns and prior designs are evidence, not automatic justification.

## Planning artifacts

Project planning state is project-owned data, not an installed copy of the framework.

Default meaningful work uses:

- `.planning/PLAN.md` — outcome, current reality, S&T reasoning, decomposition, success evidence, material decisions, and final review;
- `.planning/EXECUTION.md` — implementation-ready task IDs, owner/chat/agent, real execution dependencies, work status, and short result/evidence.

Optional only when useful:

- `.planning/STATUS.md` — current focus, next meaningful action, blocker;
- `.planning/DECISIONS.md` — material decisions separated only when PLAN would otherwise become hard to read.

Do not add files merely because information has a category.

## Lightweight execution management

ST Planner does manage execution, but it models the work rather than the management machinery.

Useful work state includes:

- task/leaf ID;
- owner (`Chat N`, developer, agent, team, etc.);
- `pending | in_progress | done | blocked`;
- real execution prerequisite when needed;
- short result/evidence reference.

Do not add framework states such as freeze/unfreeze, implementation authorization, handoff validation, allocation validation, projection synchronization, or lifecycle authorization unless repeated real usage proves a simpler rule cannot provide equivalent safety.

Numbered chats are supported as a practical execution convention. A new Chat N becomes active only through explicit activation such as `אני צאט N תתחיל` / `I am chat N`; generic continuation must not silently change executor identity.

## Planning Impact Test

When implementation reveals new information, do not automatically reopen planning.

Ask whether the new fact materially invalidates an existing Strategy, Tactic, contract, dependency, assumption, or success criterion.

- Implementation defect: RCA/fix/regression/analogous-area check as justified, then continue.
- Local planning correction: update the smallest affected planning area, review that impact, then continue.
- Material plan invalidation: stop the affected work, revise the affected S&T reasoning and downstream work, review, then continue.

Do not globally reset unrelated work.

## CI warning/error learning rule

Do not ignore CI warnings or errors and do not stop at a symptom patch.

Classify the signal and understand:

1. what happened;
2. the causal root;
3. why prevention/detection did not catch it earlier;
4. whether a reusable prevention/detection improvement is justified;
5. where materially analogous exposure may exist;
6. what evidence closes the incident.

Depth must be proportional to the signal. If the check itself is obsolete, brittle, or produces noise without protecting a real invariant, fix or remove the check rather than building ceremony around it.

## Anti-bureaucracy rules

Before adding a file, state, validator, script, gate, marker, workflow, or metadata field, answer:

1. What real failure does this prevent?
2. Can a simpler instruction or existing repository mechanism prevent it sufficiently?
3. Is the maintenance cost lower than the uncertainty/risk it removes?

Model the work, not the management of the work.

Do not persist derived state merely because it can be computed. One factual change should not normally require synchronized edits to several peer artifacts.

## Editing discipline for this repository

- use focused branches for meaningful changes;
- review the full diff after broad edits;
- keep the docs mutually consistent;
- preserve the proprietary/source-available paid-license intent in `LICENSE`;
- do not merge until the repository is internally coherent and required engineering CI is green;
- delete superseded framework machinery rather than leaving two competing contracts.

## KISS

Do not add databases, services, registries, daemons, package-management behavior, speculative schemas, or orchestration engines unless real repeated usage proves they are necessary.

ST Planner must itself pass the same KISS test it applies to planned systems.
