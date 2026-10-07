import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const framework = read("templates/project/.planning/FRAMEWORK.md");
const installedReadme = read("templates/project/.planning/README.md");
const agentsRules = read("templates/project/AGENTS.rules.md");
const protocol = read("docs/AI-PLANNING-PROTOCOL.md");

const deepPlanningSources = [framework, installedReadme, protocol];

test("planning efficiency preserves full S&T depth", () => {
  assert.match(framework, /S&T depth is mandatory/);
  assert.match(installedReadme, /S&T depth is non-negotiable/);
  assert.match(protocol, /S&T depth is not an optimization target/);
  assert.match(protocol, /whole plan must still pass necessity, sufficiency/);
});

test("planner maps before deep decomposition without treating the map as approval", () => {
  for (const text of deepPlanningSources) assert.match(text, /structural map/i);
  assert.match(framework, /map is orientation only/i);
  assert.match(installedReadme, /orientation only/i);
  assert.match(protocol, /map is orientation, not approval/i);
});

test("planner batches coherent reasoning and avoids reassurance loops", () => {
  assert.match(framework, /plan in coherent slices/i);
  assert.match(installedReadme, /coherent planning slices/i);
  assert.match(protocol, /coherent planning slices/i);

  for (const text of deepPlanningSources) assert.match(text, /reassurance/i);
});

test("existing patterns never substitute for current-scope justification", () => {
  assert.match(framework, /never replace justification for the current scope/i);
  assert.match(installedReadme, /evidence\/candidates only|candidate/i);
  assert.match(protocol, /never justify a current material tactic by themselves/i);
});

test("review timing is consolidated without weakening final review", () => {
  assert.match(framework, /Review deeply, but at coherent boundaries/);
  assert.match(framework, /changes review timing, not review depth/i);
  assert.match(protocol, /review deeply, but at coherent boundaries/i);

  for (const text of deepPlanningSources) assert.match(text, /Final Planning Review/i);
});

test("root AGENTS rules remain a compact gate/router instead of duplicating the planning manual", () => {
  assert.match(agentsRules, /Mandatory freshness gate/);
  assert.match(agentsRules, /\.planning\/README\.md/);
  assert.match(agentsRules, /\.planning\/FRAMEWORK\.md/);
  assert.match(agentsRules, /complete S&T method described there/i);
  assert.doesNotMatch(agentsRules, /Once a material decision has been justified and durably recorded/);
  assert.ok(agentsRules.length < installedReadme.length, "root rules should stay materially smaller than installed README");
});
