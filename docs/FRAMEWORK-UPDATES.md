# Framework Updates

S&T Planner is copied into target repositories. The update design therefore has to solve two problems without becoming a package manager:

1. **source drift** — a newer framework exists;
2. **installed freshness-path drift** — the local checker or root S&T rules that trigger it were accidentally modified.

## KISS model

The mechanism remains small:

- source `FRAMEWORK_RELEASE.json` — release version, policy, protected state, managed paths, bounded root-rules metadata, and critical freshness-path integrity;
- source `CHANGELOG.md` — material changes and upgrade notes;
- target `.planning/ST_PLANNER_INSTALL.json` — installed version, exact source commit, and critical integrity expected locally;
- target `.planning/check-framework-update.mjs` — zero-dependency local integrity + source freshness checker;
- bounded root `AGENTS.md` S&T rules — the repository entry point that requires the checker before planning/execution;
- source CI release-discipline gate — distributed framework changes cannot merge without a forward version and changelog entry.

No daemon, registry, database, background service, or package manager is required.

## Why source release discipline matters

A target checker can only discover a new release if the source identifies it as new. Therefore source CI treats every path distributed to target repositories as release-sensitive.

If a distributed framework path changes, CI requires:

- `FRAMEWORK_RELEASE.json -> version` to advance;
- `CHANGELOG.md` to change and contain the new version heading;
- the release manifest to remain internally consistent with critical source bytes.

This prevents the failure mode where framework behavior changes on `main` while every installed project still reports the old version as current.

## Installed freshness-path integrity

Before contacting the source, the installed checker validates the two pieces required for future update discovery:

1. `.planning/check-framework-update.mjs` itself;
2. the bounded S&T Planner rules block inside root `AGENTS.md`.

`ST_PLANNER_INSTALL.json` records the expected Git blob IDs for those exact bytes. This check is local/offline and detects accidental edits even when source/network access is unavailable.

Target-native `AGENTS.md` instructions are not hashed and are expected to evolve. Only the text inside the framework begin/end markers is framework-owned.

## Freshness command and exit contract

Run at the start of new S&T planning and every numbered executor bootstrap:

```text
node .planning/check-framework-update.mjs
```

Results:

- exit `0`, current — installed release and local freshness path are valid;
- exit `0`, recommended update — surface it; upgrade is optional;
- exit `2` — required source update/reconciliation; do not start new S&T planning/execution;
- exit `3` — local provenance/freshness-path integrity is invalid; repair/upgrade before S&T work;
- exit `0`, source unavailable — local freshness-path integrity passed, but source freshness is **unverified**; continue only from the installed framework and never claim it is current.

Required updates return non-zero in local/interactive use as well as GitHub Actions. The behavioral contract does not depend on CI-specific environment variables.

## Safe explicit upgrade

Framework upgrades are explicit. Never silently replace target project data merely because a newer source exists.

Before upgrading:

1. read target repository workflow/routing rules;
2. read installed `ST_PLANNER_INSTALL.json`;
3. resolve source default-branch HEAD to one exact commit;
4. read `FRAMEWORK_RELEASE.json`, `CHANGELOG.md`, and upgrade instructions from that commit;
5. report installed → target versions and material changes;
6. snapshot/hash protected current-cycle state.

Refresh only `FRAMEWORK_RELEASE.json -> framework_managed_paths`, using matching files from that same resolved source commit.

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
- current release `critical_integrity` values and root-rules markers.

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

After versioned metadata + checker + bounded rules are installed, later releases are self-discoverable at every S&T planning/executor entry point.
