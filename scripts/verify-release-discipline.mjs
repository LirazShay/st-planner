import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv[2];

function fail(message) {
  console.error(`release-discipline: ${message}`);
  process.exit(1);
}

function git(args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function readJsonAt(ref, file) {
  return JSON.parse(git(["show", `${ref}:${file}`]));
}

function compareSemver(left, right) {
  const a = String(left).split(".").map(Number);
  const b = String(right).split(".").map(Number);
  if (a.length !== 3 || b.length !== 3 || [...a, ...b].some((n) => !Number.isInteger(n) || n < 0)) {
    fail(`invalid semver comparison: ${left} vs ${right}`);
  }
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  return 0;
}

if (!base || /^0+$/.test(base)) {
  console.log("release-discipline: no usable base SHA; skipping comparison.");
  process.exit(0);
}

const current = JSON.parse(fs.readFileSync(path.join(repoRoot, "FRAMEWORK_RELEASE.json"), "utf8"));
let previous;
try {
  previous = readJsonAt(base, "FRAMEWORK_RELEASE.json");
} catch (error) {
  fail(`cannot read FRAMEWORK_RELEASE.json at base ${base}: ${error.message}`);
}

const changed = new Set(
  git(["diff", "--name-only", `${base}..HEAD`])
    .split(/\r?\n/)
    .filter(Boolean),
);

function targetTemplatePath(relative, label) {
  if (!relative?.startsWith(".planning/") || relative.split("/").includes("..")) {
    fail(`unsupported ${label} path: ${relative}`);
  }
  return `templates/project/${relative}`;
}

function safeRepoPath(relative, label) {
  if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..") || relative.startsWith(".git/")) {
    fail(`unsupported ${label} path: ${relative}`);
  }
  return relative.replaceAll("\\", "/");
}

function releaseSensitivePaths(release, legacy = false) {
  const paths = new Set(
    (release.framework_managed_paths ?? []).map((managed) => targetTemplatePath(managed, "managed")),
  );
  if (release.install_metadata_path) paths.add(targetTemplatePath(release.install_metadata_path, "install metadata"));
  if (release.agents_rules?.source_path) paths.add(safeRepoPath(release.agents_rules.source_path, "agents rules"));
  for (const sourcePath of release.release_sensitive_source_paths ?? []) {
    paths.add(safeRepoPath(sourcePath, "release-sensitive source"));
  }
  if (legacy) paths.add("templates/project/AGENTS.snippet.md");
  return paths;
}

const releaseSensitive = new Set([
  ...releaseSensitivePaths(previous, previous.schema_version < 2),
  ...releaseSensitivePaths(current),
  "FRAMEWORK_RELEASE.json",
]);
const sensitiveChanges = [...changed].filter((file) => releaseSensitive.has(file));

if (sensitiveChanges.length === 0) {
  console.log("release-discipline: no release-sensitive framework changes.");
  process.exit(0);
}

if (compareSemver(current.version, previous.version) <= 0) {
  fail(`release-sensitive framework content changed without a forward version bump (${previous.version} -> ${current.version}). Changed: ${sensitiveChanges.join(", ")}`);
}

if (!changed.has("CHANGELOG.md")) {
  fail(`framework version advanced to ${current.version} but CHANGELOG.md was not changed.`);
}

const changelog = fs.readFileSync(path.join(repoRoot, "CHANGELOG.md"), "utf8");
const escaped = current.version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
if (!new RegExp(`^##\\s+${escaped}(?:\\s|—|-)`, "m").test(changelog)) {
  fail(`CHANGELOG.md does not contain a release heading for ${current.version}.`);
}

if (!["recommended", "required"].includes(current.update_policy)) {
  fail(`invalid update_policy ${current.update_policy}; expected recommended|required.`);
}

console.log(`release-discipline: ${previous.version} -> ${current.version}; release-sensitive changes are versioned and documented.`);
