import crypto from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planningDir = path.join(repoRoot, "templates", "project", ".planning");
const release = JSON.parse(fs.readFileSync(path.join(repoRoot, "FRAMEWORK_RELEASE.json"), "utf8"));
const install = JSON.parse(fs.readFileSync(path.join(planningDir, "ST_PLANNER_INSTALL.json"), "utf8"));

const protectedState = [
  ".planning/GOAL.md",
  ".planning/TREE.yaml",
  ".planning/DECISIONS.md",
  ".planning/REVIEWS.md",
  ".planning/STATUS.yaml",
  ".planning/EXECUTION.yaml",
];

function gitBlobSha(file) {
  const bytes = fs.readFileSync(file);
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return crypto.createHash("sha1").update(header).update(bytes).digest("hex");
}

function walkTextFiles(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTextFiles(full, output);
    else if (/\.(?:md|mjs|json|ya?ml)$/i.test(entry.name)) output.push(full);
  }
  return output;
}

test("template install metadata matches the current source release", () => {
  assert.equal(release.schema_version, 2);
  assert.equal(install.schema_version, 2);
  assert.equal(install.framework_version, release.version);
  assert.equal(install.source_repo, "LirazShay/st-planner");
  assert.equal(release.install_metadata_path, ".planning/ST_PLANNER_INSTALL.json");
  assert.equal(release.framework_managed_paths.includes(release.install_metadata_path), false);
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(install.managed_integrity, release.managed_integrity);
  assert.deepEqual(install.critical_integrity, {
    checker_git_blob_sha: release.critical_integrity.checker_git_blob_sha,
    agents_rules_git_blob_sha: release.critical_integrity.agents_rules_git_blob_sha,
    agents_rules_begin_marker: release.agents_rules.begin_marker,
    agents_rules_end_marker: release.agents_rules.end_marker,
  });
});

test("all framework-managed integrity metadata matches source bytes", () => {
  assert.deepEqual(Object.keys(release.managed_integrity).sort(), [...release.framework_managed_paths].sort());

  for (const managedPath of release.framework_managed_paths) {
    const source = path.join(repoRoot, "templates", "project", managedPath);
    assert.equal(release.managed_integrity[managedPath], gitBlobSha(source), `${managedPath} integrity is stale`);
  }

  const checker = path.join(planningDir, "check-framework-update.mjs");
  const agentsRules = path.join(repoRoot, release.agents_rules.source_path);
  assert.equal(release.critical_integrity.checker_git_blob_sha, gitBlobSha(checker));
  assert.equal(release.critical_integrity.checker_git_blob_sha, release.managed_integrity[".planning/check-framework-update.mjs"]);
  assert.equal(release.critical_integrity.agents_rules_git_blob_sha, gitBlobSha(agentsRules));
  assert.equal(release.agents_rules.git_blob_sha, gitBlobSha(agentsRules));

  const rules = fs.readFileSync(agentsRules, "utf8");
  assert.equal(rules.split(release.agents_rules.begin_marker).length - 1, 1);
  assert.equal(rules.split(release.agents_rules.end_marker).length - 1, 1);
  assert.ok(rules.startsWith(release.agents_rules.begin_marker));
  assert.ok(rules.trimEnd().endsWith(release.agents_rules.end_marker));
});

test("framework upgrades can never classify cycle state as framework-managed", () => {
  assert.deepEqual(release.state_paths_never_overwrite, protectedState);

  for (const statePath of protectedState) {
    assert.equal(release.framework_managed_paths.includes(statePath), false, `${statePath} must never be framework-managed`);
    assert.equal(Object.hasOwn(release.managed_integrity, statePath), false, `${statePath} must never have framework integrity ownership`);
  }
});

test("every planning template file has exactly one ownership class", () => {
  const actual = fs.readdirSync(planningDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `.planning/${entry.name}`)
    .sort();
  const classified = [
    ...release.state_paths_never_overwrite,
    ...release.framework_managed_paths,
    release.install_metadata_path,
  ].sort();

  assert.equal(classified.length, new Set(classified).size, "planning ownership classes must not overlap");
  assert.deepEqual(actual, classified, "every .planning template file must be protected state, framework-managed, or install metadata");
});

test("every framework-managed .planning path exists in the installation template", () => {
  for (const managedPath of release.framework_managed_paths) {
    assert.match(managedPath, /^\.planning\//);
    const name = managedPath.slice(".planning/".length);
    assert.equal(fs.existsSync(path.join(planningDir, name)), true, `${managedPath} is declared framework-managed but missing from templates/project/.planning`);
  }
  assert.equal(fs.existsSync(path.join(planningDir, "ST_PLANNER_INSTALL.json")), true);
});

test("freshness and mandatory CI RCA contracts are wired into entry points", () => {
  const agents = fs.readFileSync(path.join(repoRoot, release.agents_rules.source_path), "utf8");
  const handoff = fs.readFileSync(path.join(planningDir, "EXECUTOR_HANDOFF.md"), "utf8");
  const executorPrompt = fs.readFileSync(path.join(repoRoot, "templates", "EXECUTOR-PROMPT.md"), "utf8");
  const policy = fs.readFileSync(path.join(planningDir, "CI-RCA-POLICY.md"), "utf8");

  for (const text of [agents, handoff]) {
    assert.match(text, /check-framework-update\.mjs/);
    assert.match(text, /required/i);
  }

  for (const text of [agents, handoff, executorPrompt]) {
    assert.match(text, /warning or error/i);
    assert.match(text, /RCA/);
    assert.match(text, /CI-RCA-POLICY\.md/);
  }

  assert.match(policy, /Where else could the same failure mode exist\?/);
  assert.match(policy, /local symptom fix alone is not considered closure/i);
});

test("source CI enforces release discipline for distributed framework changes", () => {
  const workflow = fs.readFileSync(path.join(repoRoot, ".github", "workflows", "framework-tests.yml"), "utf8");
  const verifier = fs.readFileSync(path.join(repoRoot, "scripts", "verify-release-discipline.mjs"), "utf8");

  assert.match(workflow, /fetch-depth:\s*0/);
  assert.match(workflow, /verify-release-discipline\.mjs/);
  assert.match(verifier, /distributed framework changed without a forward version bump/);
  assert.match(verifier, /CHANGELOG\.md/);
});

test("superseded unbounded AGENTS snippet is referenced only as historical migration evidence", () => {
  const legacyName = "AGENTS" + ".snippet.md";
  assert.equal(fs.existsSync(path.join(repoRoot, "templates", "project", legacyName)), false);

  const allowed = new Set([
    "BOOTSTRAP.md",
    "CHANGELOG.md",
    "docs/FRAMEWORK-UPDATES.md",
    "scripts/verify-release-discipline.mjs",
  ]);

  const offenders = [];
  for (const file of walkTextFiles(repoRoot)) {
    const relative = path.relative(repoRoot, file).replaceAll(path.sep, "/");
    if (allowed.has(relative) || relative === "tests/framework-update.test.mjs") continue;
    if (fs.readFileSync(file, "utf8").includes(legacyName)) offenders.push(relative);
  }
  assert.deepEqual(offenders, []);
});

test("changelog contains the current release", () => {
  const changelog = fs.readFileSync(path.join(repoRoot, "CHANGELOG.md"), "utf8");
  assert.match(changelog, new RegExp(`## ${release.version.replaceAll(".", "\\.")}`));
});
