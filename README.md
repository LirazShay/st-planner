# S&T Planner

A small reusable framework that helps GPT plan meaningful work with Strategy & Tactics logic instead of producing an arbitrary checklist.

The same method can plan a new system, release, feature, migration, refactor, architectural change, or other substantial scope. A feature/release is not a special framework object; it is the current planning boundary expressed with the same S&T logic.

> **License:** S&T Planner is proprietary, source-available software. Viewing the source for evaluation is permitted, but operational use requires a **paid commercial license** from the copyright holder. See [LICENSE](LICENSE).

## Quick start — from any other repository

The target repository does **not** need S&T Planner installed beforehand.

Open a chat working on the target repository and say:

> **תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג/לבנות/לשנות>**

That is the normal user interface. The agent reads `BOOTSTRAP.md`, installs/reuses the framework safely, investigates the repository, plans deeply, reviews/freezes the plan, allocates executor chats, validates the handoff, and explicitly authorizes implementation.

After S&T Planner is installed, later requests can be shorter:

> **תכנן לי עם S&T Planner לפי הריפו: <הפיצ'ר / הריליס / השינוי הבא>**

The planner defaults to informed autonomy: it investigates, evaluates alternatives, and makes responsible planner-owned product/technical choices without asking the user to approve every valid option. It asks only when a genuinely user-owned material preference/constraint is missing or no responsible choice can be derived from available evidence.

A requested feature/tool/technology/architecture is normally a **candidate tactic**, not automatically the goal. Unless explicitly fixed by the user or an existing durable target-project contract, the planner identifies the outcome it is meant to achieve and challenges the choice before decomposing it.

## Installed framework freshness and updates

S&T Planner is copied into target repositories, so installed projects can drift from the source framework. The framework therefore has a deliberately small update mechanism:

- `FRAMEWORK_RELEASE.json` — current source version, update policy, protected state, and framework-managed paths;
- `CHANGELOG.md` — what changed;
- target `.planning/ST_PLANNER_INSTALL.json` — installed version/provenance;
- target `.planning/check-framework-update.mjs` — zero-dependency freshness checker;
- `docs/FRAMEWORK-UPDATES.md` — explicit safe upgrade contract.

At the start of S&T planning or executor bootstrap, an installed project runs:

```text
node .planning/check-framework-update.mjs
```

Behavior:

- current — continue;
- newer `recommended` release — surface it to the user, upgrade optionally;
- newer `required` release — explicitly upgrade before new S&T planning/execution;
- network unavailable — report that freshness could not be verified and continue from the installed framework without pretending it is current.

Repositories installed before this versioning mechanism are legacy unversioned installations. They need one explicit upgrade; afterward later releases can be detected automatically.

### Upgrade safety

A framework upgrade may refresh only framework-owned instruction/tooling paths declared in `FRAMEWORK_RELEASE.json`.

It must **never overwrite current-cycle project state**:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

Root `AGENTS.md` is also not framework-owned wholesale. Upgrade only the S&T rules block while preserving target-native instructions.

For exact behavior, `BOOTSTRAP.md` and `docs/FRAMEWORK-UPDATES.md` are authoritative.

## Mandatory CI warning/error RCA

Every CI warning or error is a mandatory investigation gate before implementation may continue.

A local symptom fix or a green rerun alone is not closure. The executor must establish:

1. what happened;
2. the causal root;
3. why prevention/detection allowed it to reach CI;
4. the smallest reusable prevention/detection improvement;
5. materially analogous areas that may share the same weakness;
6. evidence closing the original signal and analogous findings.

The user-facing incident message must explicitly say that progression is paused for RCA and that a local fix alone is not considered closure. The installed policy is `.planning/CI-RCA-POLICY.md`.

## What the framework does

```text
Planning scope / desired outcome
→ separate outcome from proposed solution
→ establish relevant current reality
→ structural map for orientation
→ deep S&T reasoning in coherent slices
→ challenge material tactics and alternatives
→ necessity / sufficiency checks
→ implementation-ready leaves
→ final whole-plan review
→ reviewed-baseline no-drift verification
→ frozen implementation-ready plan
→ execution allocation
→ mechanical allocation validation
→ repository-only handoff verification
→ explicit implementation authorization
→ numbered execution chats directly from S&T node IDs
→ CI RCA gate on any warning/error
→ integrated root-outcome verification
→ cycle closure
```

The **planning is the product**. Freeze closes the reviewed planning baseline; it does not authorize implementation by itself and it is not cycle completion.

## One S&T model at every scale

S&T Planner deliberately does not add `Feature`, `Release`, `Epic`, or `Task` schema types.

Every material node has:

- **Strategy** — required objective/outcome;
- **Tactic** — selected way to achieve it;
- assumptions that justify tactic validity, necessity, and sufficiency;
- objective success evidence;
- implementation dependency information when the leaf requires it.

At every material level the planner challenges both:

- **horizontal choice** — why this Tactic for this Strategy, and why not a materially stronger alternative?
- **vertical decomposition** — why is each child necessary, and why are the children sufficient together?

Architecture and technical structure emerge from required outcomes rather than from default `Frontend / Backend / Database / Tests` folders.

## Reuse throughout a repository's lifetime

S&T Planner is installed once and reused sequentially for later scopes.

`.planning/STATUS.yaml` separates:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

V1 allows **one active S&T cycle per repository**.

- `active` — current scope is still being planned, executed, or verified;
- `completed` — Cycle Closure Review proved the integrated root/current-scope outcome;
- `abandoned` — scope was intentionally closed without claiming root success.

When a later independent scope begins after a terminal cycle, installed framework/tooling stays in place and only these six current-cycle state files are reset:

```text
GOAL.md
TREE.yaml
DECISIONS.md
REVIEWS.md
STATUS.yaml
EXECUTION.yaml
```

Previous-cycle reasoning remains in Git/repository history. Durable cross-cycle product/architecture/API/data/test contracts are promoted into the target project's normal source of truth before closure.

## Execution authority

After freeze:

- `.planning/EXECUTION.yaml` is authoritative for numbered-chat allocation and node execution state;
- `TREE.yaml -> depends_on` is authoritative for prerequisites;
- `.planning/STATUS.yaml` is authoritative for cycle/planning/implementation authorization.

Target-owned `STATUS.yaml`, `current_chat`, `current_node`, phase pointers, dashboards, and similar fields are projections/navigation aids only. Projection drift should be diagnosed/repaired but must not by itself become a generic hard CI blocker or silently change executor identity.

A numbered executor is activated only by explicit startup such as:

> **אני צאט N תתחיל**

A target pointer, `NEXT_CHAT_PROMPT`, generic `תמשיך לשלב הבא`, or newly runnable allocation never activates another Chat N implicitly.

## Core project files

The external bootstrap installs these files from `templates/project/.planning/`:

### Framework-managed instruction/tooling

- `README.md` — installed read order, ownership, lifecycle, update behavior
- `FRAMEWORK.md` — portable S&T planning/execution/cycle contract
- `EXECUTOR_HANDOFF.md` — executor bootstrap and handoff contract
- `CI-RCA-POLICY.md` — mandatory CI RCA procedure
- `executor-authority.mjs` — explicit activation/re-bootstrap semantics
- `execution-guidance.mjs` — canonical runnable-work derivation
- `validate-allocation.mjs` — TREE/EXECUTION allocation validation
- `verify-freeze-baseline.mjs` — reviewed-baseline no-drift verification
- `check-framework-update.mjs` — framework freshness detection
- `ST_PLANNER_INSTALL.json` — installed release provenance

### Current-cycle state — never overwritten by framework upgrade

- `GOAL.md`
- `TREE.yaml`
- `DECISIONS.md`
- `REVIEWS.md`
- `STATUS.yaml`
- `EXECUTION.yaml`

The bootstrap also merges `templates/project/AGENTS.snippet.md` into the target project's root `AGENTS.md` without replacing project-native instructions.

## When planning is ready for execution

Only after the complete intended scope passes Final Planning Review:

1. record the reviewed baseline evidence;
2. verify no material GOAL/TREE/DECISIONS drift;
3. freeze while keeping implementation unauthorized;
4. allocate every implementation-ready leaf exactly once to numbered executor chats;
5. run `node .planning/validate-allocation.mjs --initial` (plus `--serial-chats` only when explicitly serial);
6. run and record the mandatory repository-only handoff verification;
7. explicitly set `implementation_authorized: true` only after all gates pass.

Execution is allowed only when STATUS contains:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

If execution later proves the plan materially wrong, revoke authorization and reopen only the affected S&T area. After all required execution leaves are done, Cycle Closure Review must still prove the integrated root outcome before `cycle_state: completed`.

## Main documentation

- `BOOTSTRAP.md` — authoritative external install/reuse/upgrade entry contract
- `docs/FRAMEWORK-UPDATES.md` — framework release/freshness/upgrade protocol
- `docs/SNT-GOLDRATT-GUIDE.html` — Hebrew visual guide to the original S&T idea and framework mapping
- `docs/SNT-METHODOLOGY.md` — expanded S&T method
- `docs/AI-PLANNING-PROTOCOL.md` — how GPT plans
- `docs/QUALITY-GATES.md` — how GPT critiques the plan
- `docs/FRAMEWORK-LIFECYCLE.md` — planning/execution/cycle lifecycle
- `docs/EXECUTION-HANDOFF.md` — frozen-plan → execution allocation/handoff
- `docs/CHAT-EXECUTION.md` — numbered executor-chat workflow
- `docs/PLANNER-SNT.md` — S&T of this framework itself
- `docs/USAGE.md` — how to use it in another project

## Design principles

- Logic before tooling.
- Outcome before proposed solution.
- Deep reasoning without repetitive ceremony.
- Material tactics are challenged, not merely stated.
- Necessary individually, sufficient together.
- One source of truth per fact.
- One active cycle and one planning chat by default.
- Git is durable memory, not workflow bureaucracy.
- Execution is downstream of a reviewed/frozen/authorized plan.
- Any CI warning/error becomes a learning/prevention gate, not a local-fix exercise.
- Framework updates are explicit, versioned, detectable, and never overwrite project cycle state.
- Cycle closure is evidence-based, not inferred from commits alone.
- Prefer KISS.
