import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planningTemplateDir = path.join(repoRoot, "templates", "project", ".planning");
const bootstrapPath = path.join(repoRoot, "BOOTSTRAP.md");
const release = JSON.parse(fs.readFileSync(path.join(repoRoot, "FRAMEWORK_RELEASE.json"), "utf8"));
const agentsRulesPath = path.join(repoRoot, release.agents_rules.source_path);

function planningBundleFiles() {
  return fs
    .readdirSync(planningTemplateDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function bootstrapListedPlanningFiles() {
  const text = fs.readFileSync(bootstrapPath, "utf8");
  const start = text.indexOf("Current `.planning` bundle:");
  const end = text.indexOf("### Fresh install verification", start);
  assert.notEqual(start, -1, "bootstrap bundle section start not found");
  assert.notEqual(end, -1, "bootstrap bundle section end not found");

  const section = text.slice(start, end);
  return [...section.matchAll(/^\s*- `([A-Za-z0-9._-]+)`\s*$/gm)].map((match) => match[1]);
}

test("external bootstrap lists the complete planning bundle exactly once", () => {
  const listed = bootstrapListedPlanningFiles();
  assert.equal(listed.length, new Set(listed).size);
  assert.deepEqual([...listed].sort(), planningBundleFiles());
});

test("planning bundle can be copied into a fresh target and helper CLIs start", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "st-planner-external-"));
  const targetPlanning = path.join(target, ".planning");
  fs.mkdirSync(targetPlanning, { recursive: true });

  for (const name of planningBundleFiles()) {
    fs.copyFileSync(path.join(planningTemplateDir, name), path.join(targetPlanning, name));
  }

  assert.deepEqual(fs.readdirSync(targetPlanning).sort(), planningBundleFiles());

  for (const helper of [
    "executor-authority.mjs",
    "execution-guidance.mjs",
    "validate-allocation.mjs",
    "verify-freeze-baseline.mjs",
  ]) {
    const result = spawnSync(process.execPath, [path.join(targetPlanning, helper), "--help"], {
      cwd: target,
      encoding: "utf8",
    });

    assert.equal(result.status, 0, `${helper} --help failed:\n${result.stderr || result.stdout}`);
  }
});

test("AGENTS rules are bounded by stable begin/end markers", () => {
  const rules = fs.readFileSync(agentsRulesPath, "utf8");
  const { begin_marker: begin, end_marker: end } = release.agents_rules;

  assert.equal(rules.split(begin).length - 1, 1);
  assert.equal(rules.split(end).length - 1, 1);
  assert.ok(rules.startsWith(begin));
  assert.ok(rules.trimEnd().endsWith(end));
  assert.match(rules, /# S&T Planner Rules/);
});

test("bootstrap names the bounded AGENTS rules source and safe replacement contract", () => {
  const bootstrap = fs.readFileSync(bootstrapPath, "utf8");
  assert.match(bootstrap, /templates\/project\/AGENTS\.rules\.md/);
  assert.match(bootstrap, /begin\/end markers/i);
  assert.match(bootstrap, /preserve.*target-native/i);
});
