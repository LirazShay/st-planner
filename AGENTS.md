# AGENTS.md — S&T Planner Source Contract

This repository builds the reusable S&T Planner framework. Keep it small, explicit, deeply reasoned, externally usable, and safe to upgrade in target repositories.

## User-facing goal

A user working in another repository should be able to say:

> תעבוד עם S&T Planner מ-`LirazShay/st-planner` ותתכנן לי לפי הריפו: <מה אני רוצה להשיג>

and the agent should be able to bootstrap/reuse/update the framework, plan fully, hand off execution, and recover from later chats using repository state rather than chat history.

## Source-of-truth hierarchy

- `BOOTSTRAP.md` — external install/reuse/upgrade entry contract.
- `FRAMEWORK_RELEASE.json` — current distributed framework release, ownership boundaries, and critical update-path integrity.
- `CHANGELOG.md` — release changes/upgrade notes.
- `templates/project/.planning/` — installed framework/tooling + fresh-cycle templates.
- `templates/project/AGENTS.rules.md` — bounded root rules block merged into target `AGENTS.md`.
- `docs/FRAMEWORK-UPDATES.md` — update/freshness contract.
- planning/execution methodology docs — deeper framework behavior.
- `tests/` + `.github/workflows/framework-tests.yml` — mechanical regression/release gates.

Do not create a second authoritative copy of the same rule.

## Framework release discipline — mandatory

Anything distributed into target repositories is a release-sensitive contract.

Before changing a distributed path, expect to update the release in the **same PR**:

1. advance `FRAMEWORK_RELEASE.json -> version` using forward semver;
2. update `CHANGELOG.md` with that version and material upgrade behavior;
3. keep `FRAMEWORK_RELEASE.json -> framework_managed_paths`, protected state, root-rules metadata, and critical-integrity values truthful;
4. keep template `ST_PLANNER_INSTALL.json` version/integrity aligned with the release;
5. run the full test suite and `scripts/verify-release-discipline.mjs`.

Source CI enforces this. Do not bypass it with a local-only fix or by changing tests to accept stale release metadata.

If the checker or bounded root rules change, their Git blob IDs in release/install metadata must change too. If another framework-managed target file changes, a forward release version/changelog is still required even though that file is not part of the critical freshness-path hash.

## Update-path invariants

Installed projects must discover later releases without becoming a package-management system.

The critical chain is:

```text
bounded root AGENTS rules
→ run .planning/check-framework-update.mjs
→ verify local freshness-path integrity
→ compare installed provenance to source FRAMEWORK_RELEASE.json
→ explicit safe upgrade when required
```

Rules:

- required updates return non-zero even outside GitHub Actions;
- local corruption/drift of the checker or bounded root rules returns a distinct non-zero code;
- source/network failure must never be reported as "current";
- root target `AGENTS.md` is never replaced wholesale;
- only the bounded S&T rules block is framework-owned;
- framework upgrade never overwrites current-cycle project state:
  - `.planning/GOAL.md`
  - `.planning/TREE.yaml`
  - `.planning/DECISIONS.md`
  - `.planning/REVIEWS.md`
  - `.planning/STATUS.yaml`
  - `.planning/EXECUTION.yaml`
- write installed provenance metadata last during upgrade so a partial update cannot claim completion.

## Core planning rule

For meaningful work, plan completely before implementation.

Every material S&T node has:

- Strategy — required objective/outcome;
- Tactic — selected way to achieve it;
- parallel assumptions — why the tactic can achieve the Strategy;
- necessary assumptions — why each child is required for its parent;
- sufficiency assumptions — why the children are enough together;
- success evidence — objective proof of achievement;
- children / execution prerequisites where needed.

Do not choose a fixed phase count or QUICK/DEEP mode. Difficulty determines natural depth.

## Efficient deep planning

Efficiency comes from ordering and batching rigorous reasoning, never from reducing it.

- map the scope/questions/dependencies/evidence briefly before deep decomposition;
- treat that map as orientation only, never approval;
- plan/review coherent slices instead of repeating a full ceremony after every small edit;
- once a material decision is justified and durably recorded, reopen it only when new evidence/contradiction/changed assumptions/review findings can change it materially;
- keep deterministic invariants mechanical and reserve deep reasoning for material judgments;
- whole-plan outside-in coverage and Final Planning Review remain mandatory.

Existing patterns/prior designs are evidence and candidate alternatives, never sufficient justification by themselves.

## Planning completion

The whole intended plan must be decision-complete to implementation-ready leaves and pass tactic validity, necessity, sufficiency, assumptions, KISS, whole-plan coverage, and Final Planning Review.

Then:

1. record reviewed-baseline evidence;
2. verify no material GOAL/TREE/DECISIONS drift;
3. freeze with implementation still unauthorized;
4. allocate every implementation-ready leaf exactly once in `EXECUTION.yaml`;
5. validate allocation mechanically;
6. run repository-only handoff simulations;
7. explicitly authorize implementation only after all hard gates pass.

Freeze/allocation do not themselves authorize execution.

## Execution authority

After freeze:

- `.planning/EXECUTION.yaml` owns numbered-chat allocation and node execution state;
- `TREE.yaml -> depends_on` owns execution prerequisites;
- `.planning/STATUS.yaml` owns cycle/planning/implementation authorization;
- target-owned root status/current pointers are projections only.

Projection drift may be warned/repaired but must not alone become a hard blocker or change executor identity.

A numbered executor is activated only by explicit startup such as `אני צאט N תתחיל` / `I am chat N`. Generic `continue`, `NEXT_CHAT_PROMPT`, target pointers, or newly runnable allocation never activate another executor implicitly.

If execution proves the plan materially wrong, revoke authorization and reopen only the smallest affected S&T area. Preserve completed work only when its Strategy/evidence/outcome remains valid under the correction.

## CI warning/error RCA

Every CI warning or error is a mandatory RCA gate before progress continues.

A local symptom fix or green rerun alone is not closure. Establish:

1. what happened;
2. causal root;
3. why prevention/detection allowed it;
4. reusable prevention/detection improvement;
5. materially analogous areas at risk;
6. evidence closing original and analogous findings.

This applies to failures in the framework's own tests/release tooling too.

## Editing discipline

- use literal-safe programmatic replacements;
- require expected source text before replacing;
- reread rendered files/full diff after programmatic edits;
- use focused branches/PRs for meaningful changes;
- do not merge until required CI is green;
- after merge, verify `main` CI;
- keep repository docs clean—remove superseded temporary/pilot material once lessons are integrated.

## KISS

Do not add databases, services, registries, daemons, speculative schemas, orchestration layers, or automatic multi-agent machinery unless real use proves they are necessary.

For framework updates specifically, prefer version + provenance + small checker + CI discipline over building a package manager.
