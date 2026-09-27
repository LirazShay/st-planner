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
const agentsSnippetPath = path.join(repoRoot, "templates", "project", "AGENTS.snippet.md");

function planningBundleFiles() {
  return fs
    .readdirSync(planningTemplateDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function bootstrapListedPlanningFiles() {
  const text = fs.readFileSync(bootstrapPath, "utf8");
  return [
    ...text.matchAll(/templates\/project\/\.planning\/([A-Za-z0-9._-]+)/g),
  ].map((match) => match[1]);
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
    fs.copyFileSync(
      path.join(planningTemplateDir, name),
      path.join(targetPlanning, name),
    );
  }

  assert.deepEqual(
    fs.readdirSync(targetPlanning).sort(),
    planningBundleFiles(),
  );

  for (const helper of ["validate-allocation.mjs", "verify-freeze-baseline.mjs"]) {
    const result = spawnSync(
      process.execPath,
      [path.join(targetPlanning, helper), "--help"],
      { cwd: target, encoding: "utf8" },
    );

    assert.equal(
      result.status,
      0,
      `${helper} --help failed:\n${result.stderr || result.stdout}`,
    );
  }
});

test("AGENTS snippet has a stable idempotency marker", () => {
  const snippet = fs.readFileSync(agentsSnippetPath, "utf8");
  const marker = "<!-- st-planner:rules:v1 -->";

  assert.equal(snippet.split(marker).length - 1, 1);
  assert.match(snippet, /# S&T Framework Rules/);
});
