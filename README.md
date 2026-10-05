# S&T Planner

A small reusable framework that helps GPT plan meaningful work with Strategy & Tactics logic instead of producing an arbitrary checklist.

The same method can plan:
- a new system or initiative;
- a release containing multiple capabilities;
- one feature inside an existing system;
- a migration or refactor;
- an architectural or other substantial technical change.

A feature/release is not a special object in the framework. It is simply the current planning scope represented with the same S&T logic.

> **License:** S&T Planner is proprietary, source-available software. Viewing the source for evaluation is permitted, but operational use requires a **paid commercial license** from the copyright holder. See [LICENSE](LICENSE).

## Quick start — from any other repository

The target repository does **not** need S&T Planner installed beforehand.

For automatic setup, the agent needs read access to this public source repository and write access to the target repository. The bootstrap follows the target repository's own branch/PR rules.

Open a chat that is working on the target repository and say:

> **תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג/לבנות/לשנות>**

That single request is the normal user interface.

Examples:

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו את הפיצ'ר Saved Searches.

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו את Release 3 עם Alerts, Watchlists ו-Import improvements.

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו מעבר מ-polling ל-WebSocket.

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו הוספת Redis כדי להוריד עומס מה-DB.

The user does not need to classify the request as `feature`, `release`, `migration`, etc. The planner determines the planning boundary from the request and repository context.

A requested feature/tool/technology/architecture is not automatically accepted as the goal. Unless it is explicitly fixed by the user or an existing durable project contract, the planner treats it as a candidate tactic, identifies the outcome it is meant to achieve, and challenges the choice before building the tree.

The agent should:

1. fetch `LirazShay/st-planner/BOOTSTRAP.md`;
2. follow its bootstrap contract;
3. copy the required `.planning/` framework files into the current target repository when this is a permitted fresh install;
4. merge the S&T rules into the target `AGENTS.md` without deleting existing project rules;
5. continue immediately into planning in the same chat;
6. determine the current planning scope and desired outcome from the user's request plus repository reality;
7. challenge material product/technical tactics before accepting them;
8. build the complete S&T tree to implementation-ready leaves;
9. review, freeze, allocate, handoff-check, and explicitly authorize implementation.

You do not manually install files and you do not need to paste the framework workflow.

After planning is frozen, allocated, handoff-checked, and explicitly authorized, executor chats in the target repository can simply say:

> **אני צ'אט מספר 1**

### Already installed?

Bootstrap is idempotent. If the target already has a recognizable S&T Planner installation, ordinary reuse does not overwrite `.planning/` files and does not append a second S&T rules block to `AGENTS.md`.

If the target already uses `.planning/` for something else, S&T Planner preserves it. It installs alongside unrelated files only when none of the eleven S&T destination filenames conflict; otherwise bootstrap stops rather than overwriting target data.

## What it does

The framework guides GPT through:

```text
Planning scope / desired outcome
→ separate outcome from proposed solution
→ establish relevant current reality
→ challenge material candidate tactics
→ S&T tree
→ necessity / sufficiency checks
→ repeated critique at business/product/technical levels
→ final whole-plan review
→ frozen implementation-ready plan
→ execution allocation
→ mechanical allocation validation
→ fresh-chat handoff verification
→ explicit implementation authorization
→ numbered execution chats directly from S&T node IDs
```

The **planning is the product**. Passing final review and freezing closes the planning baseline; execution starts only after post-freeze handoff is complete and implementation is explicitly authorized.

## Feature and release planning

S&T Planner deliberately does not add `Feature`, `Release`, `Epic`, or `Task` schema types.

A feature may be a complete subtree. A release may contain several feature subtrees when they are genuinely necessary for a shared outcome or explicit committed release scope.

Release membership alone is not causality. The planner must not create a fake hierarchy merely because unrelated changes share a version label.

Likewise, feature decomposition does not default to:

```text
Frontend
Backend
Database
Tests
```

Children emerge from necessity and sufficiency. Technical structure follows required outcomes rather than defining the tree in advance.

At every material level the planner challenges both:
- **horizontal choice** — why this Tactic for this Strategy, and why not a materially stronger alternative?
- **vertical decomposition** — why is each child necessary, and why are the children sufficient together?

This same reasoning continues from business/product choices down through architecture, components, and technical design.

## KISS operating model

Default:
- use one planning chat from start to finish;
- persist the plan in the repository while working;
- move to another planning chat only if needed;
- use one S&T tree model at every scope/depth;
- keep ordinary reasoning in TREE assumptions and only material choices/unknowns in DECISIONS;
- after the plan is final, freeze it with implementation still unauthorized;
- allocate implementation-ready leaves directly to numbered execution chats in `.planning/EXECUTION.yaml`;
- mechanically validate allocation with `.planning/validate-allocation.mjs`;
- run and record the mandatory repository-only fresh-chat handoff verification, then explicitly authorize implementation;
- execution chats work directly from their assigned S&T node IDs.

No server, database, plugin runtime, feature registry, release registry, alternative graph, state engine, or second task system is required.

## Core project files

The external bootstrap copies these from `templates/project/.planning/` into the target repository:

- `README.md` — target-installed planning read order and ownership map
- `FRAMEWORK.md` — portable S&T rules
- `GOAL.md` — stable boundary of the current planning scope
- `TREE.yaml` — S&T plan
- `DECISIONS.md` — material open questions and decisions
- `REVIEWS.md` — planning reviews
- `.planning/STATUS.yaml` — S&T Planner-owned resume pointer plus separate planning-freeze and implementation-authorization state
- `EXECUTION.yaml` — after freeze, maps numbered executor chats directly to S&T leaves and tracks execution state
- `EXECUTOR_HANDOFF.md` — portable fresh-executor read order, context routing, dependency behavior, and mandatory handoff-verification contract
- `validate-allocation.mjs` — zero-dependency mechanical validator for TREE/EXECUTION allocation invariants
- `verify-freeze-baseline.mjs` — verifies that the baseline being frozen is the baseline that passed Final Planning Review

The bootstrap also merges `templates/project/AGENTS.snippet.md` into the target project's `AGENTS.md`.

A target repository may independently own a root `STATUS.yaml`, phase file, release state, or workstream status. S&T Planner does not treat those as aliases for `.planning/STATUS.yaml` and does not mutate them unless the target's own contract explicitly requires integration.

For the exact external installation behavior, `BOOTSTRAP.md` is authoritative.

## When planning is complete

The entire intended planning scope must be implementation-ready and pass Final Planning Review.

Only then:
1. record the reviewed baseline evidence in `.planning/REVIEWS.md`;
2. verify no material planning drift with `node .planning/verify-freeze-baseline.mjs --reviewed-ref <ref>` (or equivalent reproducible evidence when a stable ref is unavailable);
3. if material drift exists, keep planning active and review the changed baseline again;
4. freeze the verified baseline while keeping `.planning/STATUS.yaml -> implementation_authorized: false`;
5. if merge/rebase/integration later creates a different frozen ref, verify it again with `--frozen-ref <ref>`;
6. collect every implementation-ready leaf;
7. group those leaf node IDs into numbered chats in `.planning/EXECUTION.yaml` based on coherent implementation context, dependencies, and workload—not blindly by feature boundaries;
8. initialize each assigned node as `pending`;
9. run `node .planning/validate-allocation.mjs --initial` and fix any failure;
10. if numbered chats are explicitly serial, also validate with `--serial-chats`;
11. simulate the required repository-only fresh executor cases from `.planning/EXECUTOR_HANDOFF.md`, record the verification in `.planning/REVIEWS.md`, and fix/rerun any failed case;
12. explicitly set `.planning/STATUS.yaml -> implementation_authorized: true` only after all gates pass.

Then a new executor chat can say, for example, **"I am chat 1"** and immediately discover the S&T nodes it owns without the user re-explaining the project, feature, or release.

If execution later discovers a real planning defect, revoke implementation authorization, return that defect to planning, and reopen only the affected part.

## Main documentation

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
- Outcome before proposed solution.
- Material tactics are challenged, not merely stated.
- Necessary individually, sufficient together.
- The tree determines the number of steps.
- One source of truth per fact.
- One planning chat by default.
- Git is durable memory, not workflow bureaucracy.
- Execution is downstream of a completed plan.
- Prefer KISS.
