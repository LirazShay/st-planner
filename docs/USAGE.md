# Using S&T Planner from Another Repository

The normal workflow starts from the **target repository**. S&T Planner does not need to be installed there beforehand.

## Start with one sentence

Open a chat working on the target repository and say, for example:

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

That is the intended user interface. The scope may be a project, feature, release, migration, refactor, architecture change, or another meaningful change. The user does not need to classify it or explain the framework workflow.

A proposed feature/tool/technology is normally a candidate tactic, not automatically the goal. The planner identifies the outcome it should achieve and challenges the tactic unless the user or a durable project contract fixes it as a constraint.

## What happens automatically

The agent:

1. reads target-native `AGENTS.md`, routing, source-of-truth, branch/PR, and verification rules;
2. reads `LirazShay/st-planner/BOOTSTRAP.md`;
3. classifies the target as fresh, versioned-installed, legacy-installed, or conflicting before writing;
4. on an installed target, runs `node .planning/check-framework-update.mjs` before planning/execution;
5. resolves any required update/integrity failure before new S&T work;
6. for a fresh install, copies the complete `.planning` bundle from one exact source commit and merges the bounded S&T rules block into root `AGENTS.md`;
7. preserves target-native rules and all active cycle state;
8. continues directly into the requested planning work;
9. plans deeply using Strategy/Tactic logic, necessity/sufficiency, material alternatives, objective success evidence, and implementation-ready leaves;
10. records the reviewed baseline, proves no material drift, freezes, validates allocation/handoff, and explicitly authorizes implementation only after hard gates pass;
11. routes execution through explicit numbered-chat startup;
12. requires full RCA for every CI warning/error before progress continues;
13. runs Cycle Closure Review before declaring the scope complete.

The user does not manually copy files, choose tree depth, inspect YAML to find the next chat, or approve every technically valid decision.

## Update behavior

Every current installation has:

```text
.planning/ST_PLANNER_INSTALL.json
.planning/check-framework-update.mjs
bounded S&T rules in root AGENTS.md
```

Run the checker before every new S&T planning request and numbered executor bootstrap.

Exit contract:

- `0` + current — continue;
- `0` + recommended update — tell the user and continue unless upgrade is chosen;
- `2` — required framework update/reconciliation; do not start new S&T work;
- `3` — the local freshness path itself drifted/damaged; repair/upgrade first;
- source/network unavailable — local freshness-path integrity may still pass, but framework freshness is **unverified** and must be reported that way.

The checker verifies its own installed bytes and the bounded root S&T rules before contacting the source. Source CI separately guarantees that distributed framework changes cannot merge without a forward release version and changelog entry.

Framework upgrades are explicit and may replace framework-managed tooling only. They never overwrite:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

Root `AGENTS.md` is never replaced wholesale. Current framework rules are bounded by `st-planner:rules:v3:begin/end`, so target-native instructions before/after the block survive upgrades unchanged.

For exact install/upgrade behavior, `BOOTSTRAP.md` and `docs/FRAMEWORK-UPDATES.md` are authoritative.

## Planning behavior

S&T Planner uses the same model at every scale.

Every material node has:

- Strategy — required outcome;
- Tactic — selected way to achieve it;
- parallel/necessary/sufficiency assumptions;
- success evidence;
- execution prerequisites where relevant.

Before deep decomposition the planner may make a short structural map of the scope. The map is orientation only; it never replaces full S&T justification.

At material levels the planner tests both:

- why this tactic is preferable to materially plausible alternatives under current constraints;
- why each child is necessary and why the children are sufficient together.

The planner defaults to informed autonomy. It investigates repository evidence first, makes responsible planner-owned product/technical decisions when enough information exists, and asks the user only for genuinely user-owned material preferences/constraints or facts that cannot be established reliably.

## Reusing the installation

S&T Planner is installed once and reused. V1 allows one active cycle per repository.

`.planning/STATUS.yaml` owns:

```yaml
cycle_state: active | completed | abandoned
plan_state: active | frozen
implementation_authorized: false | true
```

If `cycle_state: active`, related work resumes/replans the same cycle. A genuinely independent scope does not silently create a parallel cycle.

After a terminal `completed`/`abandoned` cycle, a new independent cycle preserves framework/tooling and resets only the six current-cycle state files. Git history preserves prior-cycle reasoning; cross-cycle truths should already have been promoted into the target project's durable contracts.

## Freeze, authorization, and completion are different

`plan_state: frozen` means the reviewed planning baseline is closed for ordinary editing. It does **not** by itself authorize implementation or prove the scope succeeded.

Execution requires:

```yaml
cycle_state: active
plan_state: frozen
implementation_authorized: true
```

After all required leaves are `done`, Cycle Closure Review still has to prove the integrated root/current-scope outcome before `cycle_state: completed`.

## Execution

Runnable executor work comes from `.planning/EXECUTION.yaml` plus `TREE.yaml -> depends_on`.

Start a runnable executor explicitly:

> אני צאט N תתחיל

or:

> I am chat N

Allocation, target `current_chat/current_node`, `NEXT_CHAT_PROMPT`, or generic `continue` never activate another executor implicitly.

The executor loads only its assigned TREE leaves, dependencies, referenced decisions/ancestor reasoning, and target-project context required for that work. Target-owned current pointers are projections/navigation aids only.

If execution exposes a material planning defect, revoke implementation authorization, block the affected node factually, reopen only the smallest affected S&T area, preserve still-valid completed work, re-review/re-freeze/revalidate, then explicitly re-authorize.

## CI warnings/errors

Every CI warning or error is a mandatory RCA gate. A local fix or green rerun alone is not closure. The executor must establish:

1. what happened;
2. causal root;
3. why prevention/detection allowed it;
4. reusable prevention/detection improvement;
5. materially analogous areas at risk;
6. evidence closing the original and analogous findings.

The installed procedure is `.planning/CI-RCA-POLICY.md`.

## Authoritative entry point

`BOOTSTRAP.md` in `LirazShay/st-planner` is the authoritative external install/reuse/upgrade contract.
