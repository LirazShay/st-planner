import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { verifyFreezeBaseline } from "../templates/project/.planning/verify-freeze-baseline.mjs";

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function write(cwd, relativePath, content) {
  const fullPath = path.join(cwd, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
}

function createRepo() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "st-freeze-baseline-"));
  git(cwd, "init");
  git(cwd, "config", "user.email", "tests@example.com");
  git(cwd, "config", "user.name", "S&T Tests");

  write(cwd, ".planning/GOAL.md", "goal v1\n");
  write(cwd, ".planning/TREE.yaml", "nodes: {}\n");
  write(cwd, ".planning/DECISIONS.md", "decisions v1\n");
  write(cwd, ".planning/STATUS.yaml", "plan_state: active\n");
  git(cwd, "add", ".");
  git(cwd, "commit", "-m", "reviewed baseline");

  return {
    cwd,
    reviewed: git(cwd, "rev-parse", "HEAD"),
  };
}

test("passes when reviewed planning baseline is unchanged", () => {
  const { cwd, reviewed } = createRepo();

  const result = verifyFreezeBaseline({ reviewedRef: reviewed, cwd });

  assert.equal(result.ok, true);
  assert.deepEqual(result.drift, []);
});

test("fails when TREE changes after Final Planning Review", () => {
  const { cwd, reviewed } = createRepo();
  write(cwd, ".planning/TREE.yaml", "nodes:\n  \"0\": {}\n");

  const result = verifyFreezeBaseline({ reviewedRef: reviewed, cwd });

  assert.equal(result.ok, false);
  assert.deepEqual(result.drift, [".planning/TREE.yaml"]);
});

test("ignores STATUS-only freeze changes", () => {
  const { cwd, reviewed } = createRepo();
  write(
    cwd,
    ".planning/STATUS.yaml",
    "plan_state: frozen\nimplementation_authorized: false\n",
  );

  const result = verifyFreezeBaseline({ reviewedRef: reviewed, cwd });

  assert.equal(result.ok, true);
});

test("compares reviewed commit to an explicit frozen commit", () => {
  const { cwd, reviewed } = createRepo();

  write(
    cwd,
    ".planning/STATUS.yaml",
    "plan_state: frozen\nimplementation_authorized: false\n",
  );
  git(cwd, "add", ".planning/STATUS.yaml");
  git(cwd, "commit", "-m", "freeze status only");
  const frozen = git(cwd, "rev-parse", "HEAD");

  const result = verifyFreezeBaseline({
    reviewedRef: reviewed,
    frozenRef: frozen,
    cwd,
  });

  assert.equal(result.ok, true);
  assert.equal(result.frozenCommit, frozen);
});

test("explicit frozen commit fails when a baseline file drifted", () => {
  const { cwd, reviewed } = createRepo();

  write(cwd, ".planning/DECISIONS.md", "decisions changed after review\n");
  write(
    cwd,
    ".planning/STATUS.yaml",
    "plan_state: frozen\nimplementation_authorized: false\n",
  );
  git(cwd, "add", ".");
  git(cwd, "commit", "-m", "freeze with drift");
  const frozen = git(cwd, "rev-parse", "HEAD");

  const result = verifyFreezeBaseline({
    reviewedRef: reviewed,
    frozenRef: frozen,
    cwd,
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.drift, [".planning/DECISIONS.md"]);
});

test("custom baseline file can be checked without expanding default scope", () => {
  const { cwd, reviewed } = createRepo();
  write(cwd, "SPEC.md", "spec v1\n");
  git(cwd, "add", "SPEC.md");
  git(cwd, "commit", "-m", "add reviewed spec");
  const specReviewed = git(cwd, "rev-parse", "HEAD");

  write(cwd, "SPEC.md", "spec v2\n");

  const result = verifyFreezeBaseline({
    reviewedRef: specReviewed,
    files: ["SPEC.md"],
    cwd,
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.drift, ["SPEC.md"]);

  assert.notEqual(reviewed, specReviewed);
});

test("invalid reviewed ref is rejected", () => {
  const { cwd } = createRepo();

  assert.throws(
    () => verifyFreezeBaseline({ reviewedRef: "does-not-exist", cwd }),
    /does not resolve to a commit/,
  );
});
