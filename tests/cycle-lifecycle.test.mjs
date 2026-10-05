import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("fresh planning cycle starts active, editable, and unauthorized", () => {
  const status = read("templates/project/.planning/STATUS.yaml");

  assert.match(status, /^cycle_state: active$/m);
  assert.match(status, /^plan_state: active$/m);
  assert.match(status, /^implementation_authorized: false$/m);
});

test("executor contracts require an active frozen authorized cycle", () => {
  const handoff = read("templates/project/.planning/EXECUTOR_HANDOFF.md");
  const execution = read("templates/project/.planning/EXECUTION.yaml");
  const agents = read("templates/project/AGENTS.snippet.md");

  for (const text of [handoff, execution, agents]) {
    assert.match(text, /cycle_state: active/);
    assert.match(text, /plan_state: frozen/);
    assert.match(text, /implementation_authorized: true/);
  }

  assert.match(handoff, /completed.*abandoned.*terminal/is);
});

test("cycle reuse remains sequential and terminal-state guarded", () => {
  const lifecycle = read("docs/FRAMEWORK-LIFECYCLE.md");
  const bootstrap = read("BOOTSTRAP.md");

  assert.match(lifecycle, /cycle_state: active \| completed \| abandoned/);
  assert.match(lifecycle, /one active S&T cycle per repository/i);
  assert.match(lifecycle, /Cycle Closure Review/);
  assert.match(lifecycle, /previous cycle is `completed` or `abandoned`/);

  assert.match(bootstrap, /new-cycle transition/i);
  assert.match(bootstrap, /`completed` or `abandoned`/);
  assert.match(bootstrap, /reset only current-cycle state/i);
});
