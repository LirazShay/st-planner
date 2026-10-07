# Framework Updates

S&T Planner is copied into target repositories. The update design solves four problems without becoming a package manager:

1. **source drift** — a newer framework exists;
2. **installed framework drift** — framework-managed local bytes changed or disappeared;
3. **entry-path drift** — the checker or bounded root S&T rules were damaged;
4. **pre-existing target customization inside a managed file** — an upgrade must not silently erase project behavior that older installations embedded there.

## KISS model

The mechanism remains small:

- source `FRAMEWORK_RELEASE.json` — release version/policy, protected state, managed paths, integrity, bounded root-rules metadata, and release-sensitive source contracts;
- source `CHANGELOG.md` — release/upgrade notes;
- target `.planning/ST_PLANNER_INSTALL.json` — installed version, exact source commit, managed-file/root-rules integrity;
- target `.planning/check-framework-update.mjs` — zero-dependency local integrity + source freshness checker;
- bounded root `AGENTS.md` S&T rules — repository entry gate;
- source CI release-discipline gate — distributed framework bytes and update-contract source files cannot change without a forward version/changelog.

No daemon, registry, database, background service, or package manager is required.

## Source release discipline

The source must version not only copied target files but also source contracts that materially control install/upgrade behavior.

`FRAMEWORK_RELEASE.json -> release_sensitive_source_paths` names those additional source files (currently `BOOTSTRAP.md` and `docs/FRAMEWORK-UPDATES.md`). If a distributed path, install metadata template, bounded rules source, or release-sensitive source contract changes, CI requires:

- a forward framework version;
- a matching `CHANGELOG.md` release entry;
- valid ownership classification;
- truthful managed/root-rules integrity metadata.

This prevents an upgrade rule from changing silently while installed projects keep seeing the same release number.

## Installed integrity and freshness

Before contacting the source, the installed checker verifies every managed file plus the bounded root rules against installed integrity metadata. Working-tree CRLF is canonicalized to LF for comparison.

Run before new S&T planning and every numbered executor bootstrap:

```text
node .planning/check-framework-update.mjs
```

- exit `0`, current — installed integrity passed and source release matches;
- exit `0`, recommended update — surface it; upgrade optional;
- exit `2` — required source update/reconciliation;
- exit `3` — installed provenance/framework integrity invalid;
- exit `0`, source unavailable — installed integrity passed but source freshness is **unverified**, never current.

## Mandatory pre-upgrade divergence audit

**Do not overwrite managed files merely because a newer release exists.** First prove what the currently installed managed files contain relative to the release they came from.

### Installations with `managed_integrity`

Compare every current managed file with installed `managed_integrity`. Any mismatch is local divergence. Before overwrite, classify it as:

- target-owned customization that must be migrated out of the managed file;
- known framework drift/repair that may be replaced;
- unresolved conflict — blocks upgrade.

### Older versioned installations without `managed_integrity` (for example 1.0.0)

Use installed `source_commit` as the immutable baseline:

1. fetch historical `FRAMEWORK_RELEASE.json` at that exact commit;
2. fetch each historical framework-managed template file at that exact commit;
3. compare current target file vs historical source using canonical LF text comparison;
4. exclude instance-specific install metadata from byte-equality comparison;
5. classify every difference before overwrite.

If the historical source cannot be resolved or a difference cannot be safely classified, stop. Never guess that a differing managed file is disposable.

### Legitimate target-owned customization

Move it first to a **target-owned durable location** — e.g. root `AGENTS.md` outside the bounded S&T block or a target-owned routing/spec file referenced there. Verify equivalent routing/behavior, then replace the managed framework file with exact release bytes.

From integrity-enabled releases onward, target-owned customizations must remain outside managed framework files. Local edits to managed files are intentionally reported as drift.

## Safe explicit upgrade

Before upgrading:

1. read target repository workflow/routing rules;
2. read installed metadata;
3. resolve target source release to one exact commit;
4. report installed → target versions/material changes;
5. snapshot/hash the six protected cycle-state files;
6. complete the divergence/customization audit above;
7. migrate any legitimate target-owned customization out of managed files before overwrite.

Then refresh only `framework_managed_paths` from the one resolved source commit.

`.planning/ST_PLANNER_INSTALL.json` is special `install_metadata_path`, not an ordinary managed replacement file; write it **last**.

### Protected state

Never overwrite during framework upgrade:

```text
.planning/GOAL.md
.planning/TREE.yaml
.planning/DECISIONS.md
.planning/REVIEWS.md
.planning/STATUS.yaml
.planning/EXECUTION.yaml
```

## Root AGENTS.md ownership

Root `AGENTS.md` is a merge surface, never framework-owned wholesale.

Current releases own only:

```text
<!-- st-planner:rules:v3:begin -->
...
<!-- st-planner:rules:v3:end -->
```

Replace that bounded substring only; preserve target-native text outside it.

For 1.0.0/v2, use installed `source_commit` to fetch the exact historical `templates/project/AGENTS.snippet.md`; replace that exact sequence only. If it is not present exactly, stop rather than guessing where target-native text begins.

## Write provenance last

After managed files and root rules are successfully updated, write `ST_PLANNER_INSTALL.json` last with version, exact source commit, install timestamp, managed integrity, and root-rules integrity/markers.

## Upgrade verification

Before further S&T work require:

1. checker exit `0` + current;
2. materially affected validators green;
3. every managed file matches release integrity;
4. bounded root rules occur exactly once and match release integrity;
5. all six protected state files are byte-identical to pre-upgrade snapshots;
6. target-native root rules remain intact except explicitly reviewed migration of pre-existing target customization;
7. every pre-upgrade divergence has a disposition: migrated target contract, repaired framework drift, or resolved blocker;
8. any CI warning/error has completed mandatory RCA.

## Legacy/version history

Unversioned installations need one explicit upgrade because they cannot execute a checker that was never installed.

Version 1.0.0 installations can discover 1.1.x through their existing checker. The 1.1.x upgrade adds bounded root rules, full managed-file integrity, and the mandatory pre-upgrade divergence audit needed to preserve older target customizations safely.
