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

test("template install metadata matches the current source release", () => {
  assert.equal(release.schema_version, 1);
  assert.equal(install.schema_version, 1);
  assert.equal(install.framework_version, release.version);
  assert.equal(install.source_repo, "LirazShay/st-planner");
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
});

test("framework upgrades can never classify cycle state as framework-managed", () => {
  assert.deepEqual(release.state_paths_never_overwrite, protectedState);

  for (const statePath of protectedState) {
    assert.equal(
      release.framework_managed_paths.includes(statePath),
      false,
      `${statePath} must never be framework-managed`,
    );
  }
});

test("every framework-managed .planning path exists in the installation template", () => {
  for (const managedPath of release.framework_managed_paths) {
    assert.match(managedPath, /^\.planning\//);
    const name = managedPath.slice(".planning/".length);
    assert.equal(
      fs.existsSync(path.join(planningDir, name)),
      true,
      `${managedPath} is declared framework-managed but missing from templates/project/.planning`,
    );
  }
});

test("freshness and mandatory CI RCA contracts are wired into executor entry points", () => {
  const agents = fs.readFileSync(path.join(repoRoot, "templates", "project", "AGENTS.snippet.md"), "utf8");
  const handoff = fs.readFileSync(path.join(planningDir, "EXECUTOR_HANDOFF.md"), "utf8");
  const executorPrompt = fs.readFileSync(path.join(repoRoot, "templates", "EXECUTOR-PROMPT.md"), "utf8");
  const policy = fs.readFileSync(path.join(planningDir, "CI-RCA-POLICY.md"), "utf8");

  for (const text of [agents, handoff]) {
    assert.match(text, /check-framework-update\.mjs/);
    assert.match(text, /required/);
  }

  for (const text of [agents, handoff, executorPrompt]) {
    assert.match(text, /CI warning or error/i);
    assert.match(text, /RCA/);
  }

  assert.match(policy, /Where else could the same failure mode exist\?/);
  assert.match(policy, /local symptom fix alone is not considered closure/i);
});

test("changelog contains the current release", () => {
  const changelog = fs.readFileSync(path.join(repoRoot, "CHANGELOG.md"), "utf8");
  assert.match(changelog, new RegExp(`## ${release.version.replaceAll(".", "\\.")}`));
});
