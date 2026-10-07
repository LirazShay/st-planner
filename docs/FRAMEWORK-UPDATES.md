# Framework Updates

S&T Planner is copied into target repositories. The update design therefore has to solve three problems without becoming a package manager:

1. **source drift** — a newer framework exists;
2. **installed framework drift** — a framework-managed local file was accidentally changed/missing;
3. **entry-path drift** — the checker or bounded root S&T rules needed to discover future updates were damaged.

## KISS model

The mechanism remains small:

- source `FRAMEWORK_RELEASE.json` — release version/policy, protected state, managed paths, Git blob integrity, bounded root-rules metadata;
- source `CHANGELOG.md` — material changes and upgrade notes;
- target `.planning/ST_PLANNER_INSTALL.json` — installed version, exact source commit, managed-file integrity and root-rules integrity;
- target `.planning/check-framework-update.mjs` — zero-dependency local integrity + source freshness checker;
- bounded root `AGENTS.md` S&T rules — repository entry point requiring freshness before planning/execution;
- source CI release-discipline gate — distributed framework changes cannot merge without a forward version and changelog entry.

No daemon, registry, database, background service, or package manager is required.

## Source release discipline

A target checker can discover a new release only if the source identifies it as new. Source CI therefore treats every distributed framework path as release-sensitive.

If distributed framework content changes, CI requires:

- `FRAMEWORK_RELEASE.json -> version` advances;
- `CHANGELOG.md` changes and contains that version heading;
- every `.planning` template file has exactly one ownership class: protected cycle state, framework-managed, or install metadata;
- `managed_integrity` keys exactly match `framework_managed_paths`;
- every recorded Git blob ID matches the actual source bytes;
- bounded root-rules integrity matches its actual source bytes.

This prevents the normal failure mode where source behavior changes while installed projects still report the old release as current.

The installed checker also compares same-version source integrity metadata to the installed metadata. Therefore even if source release discipline were bypassed accidentally, changed source content under the same version becomes a required reconciliation rather than a false `current` result.

## Installed integrity

Before contacting the source, the installed checker validates locally:

1. every path in installed `managed_integrity` exists and matches its recorded Git blob ID;
2. the update checker itself is among those managed paths and matches its expected bytes;
3. the bounded S&T Planner rules block inside root `AGENTS.md` occurs exactly once and matches its expected bytes;
4. install provenance is internally coherent.

This verification is local/offline. It catches missing or modified framework files even when source/network access is unavailable.

Target-native `AGENTS.md` instructions are intentionally not hashed. Only the text inside the framework begin/end markers is framework-owned.

Current-cycle project state is also intentionally not hashed as framework content: it is expected to change as planning/execution progresses and is protected from framework overwrite by ownership rules instead.

## Freshness command and exit contract

Run at the start of new S&T planning and every numbered executor bootstrap:

```text
node .planning/check-framework-update.mjs
```

Results:

- exit `0`, current — installed framework integrity passed and source release matches;
- exit `0`, recommended update — installed integrity passed; surface newer release and continue unless upgrade is chosen;
- exit `2` — required source update/reconciliation; do not start new S&T planning/execution;
- exit `3` — installed provenance/framework integrity is invalid; repair/upgrade before S&T work;
- exit `0`, source unavailable — installed integrity passed but source freshness is **unverified**; continue only from the installed framework and never claim it is current.

Required updates return non-zero in local/interactive use as well as GitHub Actions. The behavioral contract does not depend on CI-specific environment variables.

## Safe explicit upgrade

Framework upgrades are explicit. Never silently replace target project data merely because a newer source exists.

Before upgrading:

1. read target repository workflow/routing rules;
2. read installed `.planning/ST_PLANNER_INSTALL.json`;
3. resolve source default-branch HEAD to one exact commit;
4. read `FRAMEWORK_RELEASE.json`, `CHANGELOG.md`, and upgrade instructions from that commit;
5. report installed → target versions and material changes;
6. snapshot/hash protected current-cycle state.

Refresh only `FRAMEWORK_RELEASE.json -> framework_managed_paths`, using matching files from that same resolved source commit.

`.planning/ST_PLANNER_INSTALL.json` is **not** an ordinary framework-managed replacement path. It is the special `install_metadata_path` and must be written last after the framework files and root rules are successfully updated.

### Protected state

A framework upgrade must preserve these byte-for-byte:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

Those files are target-project cycle state, not framework distribution files.

## Root AGENTS.md ownership

Root `AGENTS.md` is a merge surface, never a framework-owned file.

Current releases use a bounded block declared by the release manifest:

```text
<!-- st-planner:rules:v3:begin -->
...
<!-- st-planner:rules:v3:end -->
```

An upgrade replaces only that bounded substring and preserves all target-native text before and after it byte-for-byte.

### v2 → v3 migration

The 1.0.0 v2 block had only a start marker. Do **not** infer its end from headings or position.

Use installed `source_commit` to fetch the exact historical `templates/project/AGENTS.snippet.md` that produced the v2 block, locate that exact byte sequence inside target `AGENTS.md`, and replace exactly that sequence with the bounded v3 rules source. If the historical sequence is not present exactly, stop and report a repair conflict rather than risking target-native text.

After v3 is installed, future replacements are deterministic from markers alone.

## Write provenance last

`.planning/ST_PLANNER_INSTALL.json` is written last. It records:

- installed framework version;
- `source_repo`;
- exact resolved `source_commit`;
- installation timestamp when available;
- `managed_integrity` for every framework-managed `.planning` path;
- critical checker/root-rules integrity and the root-rules begin/end markers.

Writing provenance last prevents a partially applied upgrade from falsely identifying itself as complete.

## Upgrade verification

Before further S&T work:

1. run the checker and require exit `0` + current;
2. run materially affected framework/tooling validators;
3. prove all six protected state files match their pre-upgrade snapshots;
4. prove the bounded root S&T block occurs exactly once;
5. prove target-native `AGENTS.md` text outside the block is unchanged;
6. if any CI warning/error occurred, close the mandatory CI RCA including analogous-area review.

## Legacy installations

Installations from before version/provenance support cannot discover updates by themselves. They need one explicit upgrade. This is unavoidable: code that was never installed cannot execute itself.

Version 1.0.0 installations can discover 1.1.0 through their existing checker/rules. Upgrading to 1.1.0 installs bounded root rules and full managed-file integrity; subsequent releases are both discoverable and locally integrity-checked at every S&T planning/executor entry point.
