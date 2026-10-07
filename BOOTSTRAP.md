# External Bootstrap — S&T Planner

This is the authoritative entry point for an AI agent using `LirazShay/st-planner` from another repository.

A user request such as:

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

is enough. The user does not need to restate framework mechanics.

## Non-negotiable setup rule

Treat the repository you are currently working on as the **target repository**. Before writing anything, read its existing `AGENTS.md`, routing/source-of-truth rules, and branch/PR/verification workflow. Framework bootstrap/upgrade must obey those target-native rules.

Resolve `LirazShay/st-planner` default-branch HEAD to **one exact source commit SHA** and read the release manifest, changelog, update contract, and copied files from that same commit. Never mix files from moving refs.

## Detect existing installation

Classify the target before writing:

- no recognizable S&T `.planning/` installation → fresh install;
- recognizable S&T installation + `.planning/ST_PLANNER_INSTALL.json` → installed/versioned;
- recognizable S&T installation without install metadata → legacy/unversioned; explicit upgrade required before relying on freshness;
- conflicting `.planning` files for another purpose → do not overwrite; report the exact conflict.

For an installed/versioned target, run before new planning or numbered execution:

```text
node .planning/check-framework-update.mjs
```

Exit contract:

- `0` + current — continue;
- `0` + recommended update — surface it; upgrade is optional;
- `2` — required framework update/reconciliation; do not start new S&T work;
- `3` — the installed freshness path is damaged/drifted; repair/upgrade before S&T work;
- network/source unavailable with exit `0` — freshness is **unverified**; continue only from the installed framework and never claim it is current.

## Fresh install

Current `.planning` bundle:

- `README.md`
- `FRAMEWORK.md`
- `GOAL.md`
- `TREE.yaml`
- `DECISIONS.md`
- `REVIEWS.md`
- `STATUS.yaml`
- `EXECUTION.yaml`
- `EXECUTOR_HANDOFF.md`
- `CI-RCA-POLICY.md`
- `executor-authority.mjs`
- `execution-guidance.mjs`
- `validate-allocation.mjs`
- `verify-freeze-baseline.mjs`
- `check-framework-update.mjs`
- `ST_PLANNER_INSTALL.json`

For a permitted fresh install:

1. Copy all sixteen files from `templates/project/.planning/` at the resolved source commit.
2. Merge `templates/project/AGENTS.rules.md` exactly once into root `AGENTS.md` while preserving all target-native text.
3. Populate `.planning/ST_PLANNER_INSTALL.json` from the same release: version, source repo, exact source commit, install timestamp when available, and `critical_integrity` copied from `FRAMEWORK_RELEASE.json`.
4. Do not change target product/runtime files merely to install the planner.

### Fresh install verification

Require all of the following before planning:

- all sixteen `.planning` files exist;
- the bounded S&T rules block appears exactly once in root `AGENTS.md`;
- the block uses the manifest's exact begin/end markers;
- installed framework/tooling came from one resolved source commit;
- install metadata version/integrity matches that release manifest;
- `node .planning/check-framework-update.mjs` exits `0` and reports current when source access is available;
- no pre-existing target file was overwritten except the intentional bounded merge into root `AGENTS.md`.

## Explicit framework upgrade

A framework upgrade is separate from project planning, execution, and cycle reset.

Before upgrading:

1. Read target repository workflow rules.
2. Read installed `.planning/ST_PLANNER_INSTALL.json`.
3. Resolve one target source commit and read `FRAMEWORK_RELEASE.json`, `CHANGELOG.md`, and `docs/FRAMEWORK-UPDATES.md` from that commit.
4. Tell the user installed → target framework versions and summarize material changes.
5. Snapshot/hash the six protected cycle-state files so preservation can be proved after the upgrade.

Upgrade only paths listed in `FRAMEWORK_RELEASE.json -> framework_managed_paths`, from that same resolved source commit.

**Never overwrite current-cycle state:**

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

### Root AGENTS.md replacement

Root `AGENTS.md` is not framework-owned wholesale.

For v3+ installations, replace only the exact text between the manifest's S&T begin/end markers, including the markers, with `templates/project/AGENTS.rules.md` from the target release. Preserve target-native text before and after the block byte-for-byte.

For a v2 installation that has only `<!-- st-planner:rules:v2 -->` and no end marker:

1. use installed `source_commit` to fetch the exact historical `templates/project/AGENTS.snippet.md` that was installed;
2. replace that **exact prior snippet substring** inside target `AGENTS.md` with the new bounded rules block;
3. if the exact historical snippet is not present, do not guess where the old framework block ends—report the conflict and require explicit repair.

This makes the v2 → v3 migration deterministic even when target-native rules exist after the old block.

### Upgrade completion

Write `.planning/ST_PLANNER_INSTALL.json` **last**, with the new version, exact source commit, install timestamp, and current release integrity metadata.

Then require:

1. `node .planning/check-framework-update.mjs` exits `0` and reports current;
2. framework/tooling validations affected by the release pass;
3. the bounded S&T rules block occurs exactly once;
4. the six protected state files match the pre-upgrade snapshots byte-for-byte;
5. target-native `AGENTS.md` text outside the bounded block is unchanged.

If upgrade/CI emits any warning or error, the mandatory `.planning/CI-RCA-POLICY.md` gate applies before further progress.

## Reuse and cycle lifecycle

Ordinary reuse never recopies framework templates. Run the freshness check, then follow the installed `.planning/README.md` and `.planning/FRAMEWORK.md`.

One active S&T cycle is supported per repository. A new independent cycle is not an upgrade: only after the previous cycle is `completed` or `abandoned`, reset the six current-cycle state files while preserving installed framework/tooling and root S&T rules.

Planning implementation authorization and numbered executor behavior are defined by the installed framework. In particular:

- planning must complete/review/freeze before implementation;
- `.planning/EXECUTION.yaml` + TREE dependencies are execution authority;
- target-owned current chat/node fields are projections only;
- a numbered executor starts only from an explicit request such as `אני צאט N תתחיל` / `I am chat N`;
- generic `continue` never activates another executor implicitly;
- every CI warning/error requires full RCA closure, not merely a local fix/green rerun.

After bootstrap/reuse/upgrade, continue the user's requested S&T work in the same conversation unless the target workflow or user explicitly requires a handoff.
