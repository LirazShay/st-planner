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
const agentsSnippet = read("templates/project/AGENTS.snippet.md");
const protocol = read("docs/AI-PLANNING-PROTOCOL.md");

test("planning efficiency preserves full S&T depth", () => {
  assert.match(framework, /S&T depth is mandatory/);
  assert.match(installedReadme, /S&T depth is non-negotiable/);
  assert.match(protocol, /S&T depth is not an optimization target/);
  assert.match(protocol, /whole plan must still pass necessity, sufficiency/);
});

test("planner maps before deep decomposition without treating the map as approval", () => {
  for (const text of [framework, installedReadme, agentsSnippet, protocol]) {
    assert.match(text, /structural map/i);
  }

  assert.match(framework, /map is orientation only/i);
  assert.match(agentsSnippet, /orientation only/i);
  assert.match(protocol, /map is orientation, not approval/i);
});

test("planner batches coherent reasoning and avoids reassurance loops", () => {
  assert.match(framework, /plan in coherent slices/i);
  assert.match(installedReadme, /coherent planning slices/i);
  assert.match(agentsSnippet, /coherent planning slices/i);
  assert.match(protocol, /coherent planning slices/i);

  for (const text of [framework, installedReadme, agentsSnippet, protocol]) {
    assert.match(text, /reassurance/i);
  }
});

test("existing patterns never substitute for current-scope justification", () => {
  assert.match(framework, /never replace justification for the current scope/i);
  assert.match(installedReadme, /never justify a choice by themselves/i);
  assert.match(agentsSnippet, /never sufficient justification by themselves/i);
  assert.match(protocol, /never justify a current material tactic by themselves/i);
});

test("review timing is consolidated without weakening final review", () => {
  assert.match(framework, /Review deeply, but at coherent boundaries/);
  assert.match(framework, /changes review timing, not review depth/i);
  assert.match(agentsSnippet, /not as a mandate to rerun every review dimension after every edit/i);
  assert.match(protocol, /review deeply, but at coherent boundaries/i);

  for (const text of [framework, installedReadme, agentsSnippet, protocol]) {
    assert.match(text, /Final Planning Review/i);
  }
});
