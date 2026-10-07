# S&T Planner

A small reusable Strategy & Tactics planning framework for AI-assisted software/product work.

> **License:** proprietary, source-available. Operational use requires a paid commercial license from the copyright holder. See `LICENSE`.

## Use it from another repository

The target repository does not need S&T Planner preinstalled. In a chat working on that repository, say for example:

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

The agent reads `BOOTSTRAP.md`, installs or reuses the framework safely, investigates the target repository, builds/reviews the S&T plan, freezes/allocates it, validates handoff, and authorizes execution only after the required gates pass.

Later requests can simply say:

> תכנן לי עם S&T Planner לפי הריפו: <השינוי הבא>

## Updates: simple but hard to miss

S&T Planner is copied into target repositories, so installed copies can drift from this source. Every versioned installation therefore has:

```text
.planning/ST_PLANNER_INSTALL.json
.planning/check-framework-update.mjs
bounded S&T rules inside root AGENTS.md
```

Before new S&T planning or a numbered executor starts:

```text
node .planning/check-framework-update.mjs
```

The checker first verifies locally that the **update detector itself** and the bounded root S&T rules still match the installed release. It then checks the current source release.

Exit contract:

- `0` + current — continue;
- `0` + recommended update — surface it, upgrade optionally;
- `2` — required update/reconciliation; do not start new S&T work;
- `3` — installed freshness path drifted/damaged; repair/upgrade first;
- source/network unavailable — local integrity can still pass, but freshness is reported as **unverified**, never falsely as current.

On the source side, CI enforces release discipline: any distributed framework change must advance `FRAMEWORK_RELEASE.json -> version` and update `CHANGELOG.md`. This prevents source behavior from changing while installed projects keep seeing the same version.

Framework updates remain explicit and safe. They may refresh only declared framework-managed instructions/tooling and must never overwrite current-cycle project state:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

Root `AGENTS.md` is never replaced wholesale. Current releases own only a bounded `st-planner:rules:v3:begin/end` block; target-native rules before/after it are preserved.

See `docs/FRAMEWORK-UPDATES.md` for the exact contract.

## Core planning model

Every material S&T node contains:

- **Strategy** — required objective/outcome;
- **Tactic** — selected way to achieve it;
- assumptions proving tactic validity, necessity, and sufficiency;
- objective success evidence;
- execution prerequisites when applicable.

The framework challenges both:

- **horizontal choice** — why this tactic instead of a materially stronger alternative?
- **vertical decomposition** — why is each child necessary, and why are the children sufficient together?

Planning continues until leaves are decision-complete and practical for executor chats. A short structural map may orient the work first, but it never substitutes for deep S&T justification.

## Lifecycle and execution authority

One active S&T cycle is supported per repository.

`.planning/STATUS.yaml` separates:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

Execution requires an active, frozen, explicitly authorized cycle.

After freeze:

- `.planning/EXECUTION.yaml` is authoritative for numbered-chat allocation/state;
- `TREE.yaml -> depends_on` is authoritative for prerequisites;
- `.planning/STATUS.yaml` is authoritative for cycle/planning/authorization;
- target-owned `current_chat/current_node` or similar pointers are projections only.

A numbered executor starts only from explicit activation such as:

> אני צאט N תתחיל

Generic `continue`, a target pointer, or a newly runnable allocation never changes conversation identity implicitly.

## CI failure learning gate

Every CI warning or error pauses progression until full RCA closes. A local fix or green rerun alone is not enough. The executor must establish root cause, why detection/prevention allowed it, reusable prevention, materially analogous areas, and closing evidence. The installed policy is `.planning/CI-RCA-POLICY.md`.

## Main entry documents

- `BOOTSTRAP.md` — authoritative external install/reuse/upgrade entry contract
- `FRAMEWORK_RELEASE.json` — current framework release and ownership boundaries
- `CHANGELOG.md` — release changes/upgrade notes
- `docs/FRAMEWORK-UPDATES.md` — freshness and safe-upgrade contract
- `docs/SNT-METHODOLOGY.md` — expanded S&T method
- `docs/AI-PLANNING-PROTOCOL.md` — planning behavior
- `docs/QUALITY-GATES.md` — plan critique/review gates
- `docs/FRAMEWORK-LIFECYCLE.md` — cycle lifecycle
- `docs/EXECUTION-HANDOFF.md` — plan → executor allocation/handoff
- `docs/CHAT-EXECUTION.md` — numbered executor workflow

## Design principles

- Outcome before proposed solution.
- Deep reasoning without repetitive ceremony.
- Necessary individually, sufficient together.
- One source of truth per fact.
- Git is durable memory, not a duplicate task system.
- Planning freeze is not implementation authorization.
- Any CI warning/error becomes a learning/prevention gate.
- Framework updates are versioned, detectable, integrity-checked, and state-safe.
- Prefer KISS.
