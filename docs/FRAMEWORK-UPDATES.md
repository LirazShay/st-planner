# Framework Updates

S&T Planner is copied into target repositories, so the source framework and an installed project can drift over time. The update mechanism must make that drift visible without turning S&T Planner into a package manager.

## KISS model

The framework uses four small pieces:

1. `FRAMEWORK_RELEASE.json` in `LirazShay/st-planner` declares the current framework version, update policy, summary, and the boundary between framework-managed files and project-owned cycle state.
2. `.planning/ST_PLANNER_INSTALL.json` in each installed target records which framework version was installed and, when bootstrap/upgrade can write it, the exact source commit used.
3. `.planning/check-framework-update.mjs` compares the installed version with the current source release manifest.
4. `CHANGELOG.md` explains what changed and whether an older installation needs an explicit upgrade.

No daemon, registry, package manager, database, or background service is required.

## Fresh install

Bootstrap resolves one source commit, installs all framework files from that commit, and writes `.planning/ST_PLANNER_INSTALL.json` with:

- `framework_version` from `FRAMEWORK_RELEASE.json`;
- `source_repo: LirazShay/st-planner`;
- the resolved `source_commit` when available;
- `installed_at` when available.

The install is then self-identifying.

## Detecting updates

At the start of S&T planning or an executor bootstrap, run:

```text
node .planning/check-framework-update.mjs
```

The checker is zero-dependency and reads the latest public `FRAMEWORK_RELEASE.json` from `LirazShay/st-planner`.

Results:

- same version — report current and continue;
- newer `recommended` release — report the available version and summary, then continue unless the target/user chooses to upgrade;
- newer `required` release — report that the framework must be upgraded before further S&T planning/execution; in GitHub Actions the checker exits non-zero so CI cannot silently ignore the required upgrade;
- network unavailable — report that freshness could not be checked and continue from the installed framework rather than pretending it is current.

An update-available message is framework freshness information, not evidence that target-project implementation itself is defective. If CI is configured to enforce a required framework upgrade and therefore emits a CI warning/error, the normal CI RCA policy still applies to the CI incident, with the root cause being framework-version drift and the prevention being the installed update-detection mechanism.

## Safe explicit upgrade

Framework upgrades are explicit. Never silently replace target project data merely because a newer source version exists.

Before upgrading:

1. read the target repository's Git/branch/PR/workflow rules;
2. read target `.planning/ST_PLANNER_INSTALL.json`;
3. fetch the latest `FRAMEWORK_RELEASE.json`, `CHANGELOG.md`, and `BOOTSTRAP.md` from one resolved source commit;
4. tell the user which installed and target framework versions are involved and summarize material changes;
5. preserve the active planning/execution cycle.

### Files that may be replaced by a framework upgrade

Only paths listed in `FRAMEWORK_RELEASE.json -> framework_managed_paths` may be refreshed automatically/agentically from the matching source release.

These are framework instructions/tooling, not cycle content.

### Files that must never be overwritten by framework upgrade

The release manifest explicitly lists `state_paths_never_overwrite`. At minimum:

- `.planning/GOAL.md`
- `.planning/TREE.yaml`
- `.planning/DECISIONS.md`
- `.planning/REVIEWS.md`
- `.planning/STATUS.yaml`
- `.planning/EXECUTION.yaml`

Those are target-project planning/execution state. An upgrade must preserve them byte-for-byte unless a separate legitimate planning/execution operation changes them.

### Root `AGENTS.md`

The S&T rules embedded in root `AGENTS.md` are a merged integration point, not a file the framework owns wholesale. An upgrade may update only the S&T Planner rules block while preserving every target-native instruction before/after it. Never replace the complete target `AGENTS.md` from a template.

## Upgrade verification

After upgrading:

1. update `.planning/ST_PLANNER_INSTALL.json` to the installed release version and resolved source commit;
2. run `node .planning/check-framework-update.mjs` and require it to report current;
3. run the framework/tooling tests/validators materially affected by the release;
4. verify the six protected cycle-state files were not overwritten by the framework upgrade;
5. verify the S&T rules block exists exactly once in root `AGENTS.md`;
6. if the upgrade was triggered by a CI warning/error, complete the mandatory CI RCA before proceeding.

## Legacy installations

Repositories installed before the version/provenance mechanism have no `.planning/ST_PLANNER_INSTALL.json` and cannot discover updates by themselves.

They require one explicit upgrade from the current `LirazShay/st-planner`. That upgrade installs the provenance metadata and checker. Every later release can then be detected automatically.

This one-time legacy step is unavoidable: a repository cannot execute an update checker that did not exist when it was installed.
