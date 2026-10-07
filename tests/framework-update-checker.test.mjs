import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = path.join(repoRoot, "templates", "project");
const rulesSource = path.join(repoRoot, "templates", "project", "AGENTS.rules.md");
const release = JSON.parse(fs.readFileSync(path.join(repoRoot, "FRAMEWORK_RELEASE.json"), "utf8"));

function gitBlobSha(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes, "utf8");
  const header = Buffer.from(`blob ${buffer.length}\0`, "utf8");
  return crypto.createHash("sha1").update(header).update(buffer).digest("hex");
}

function toCrlf(text) {
  return text.replace(/\r?\n/g, "\r\n");
}

function createTarget() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "st-planner-checker-"));

  for (const relative of release.framework_managed_paths) {
    const source = path.join(templateRoot, relative);
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }

  const rules = fs.readFileSync(rulesSource, "utf8");
  fs.writeFileSync(path.join(root, "AGENTS.md"), `# Target rules\n\n${rules}\nTarget-native tail\n`);

  const install = {
    schema_version: 2,
    framework_version: release.version,
    source_repo: "LirazShay/st-planner",
    source_commit: "test-source-commit",
    installed_at: "2026-10-07",
    managed_integrity: { ...release.managed_integrity },
    critical_integrity: {
      checker_git_blob_sha: release.critical_integrity.checker_git_blob_sha,
      agents_rules_git_blob_sha: gitBlobSha(rules),
      agents_rules_begin_marker: release.agents_rules.begin_marker,
      agents_rules_end_marker: release.agents_rules.end_marker,
    },
  };
  const installPath = path.join(root, release.install_metadata_path);
  fs.mkdirSync(path.dirname(installPath), { recursive: true });
  fs.writeFileSync(installPath, `${JSON.stringify(install, null, 2)}\n`);
  return { root, planning: path.join(root, ".planning"), install, rules };
}

async function serveRelease(payload) {
  const server = http.createServer((request, response) => {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(payload));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}/FRAMEWORK_RELEASE.json`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

function runChecker(root, releaseUrl) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, ".planning", "check-framework-update.mjs")], {
      cwd: root,
      env: { ...process.env, GITHUB_ACTIONS: "false", ST_PLANNER_RELEASE_URL: releaseUrl },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr, output: `${stdout}\n${stderr}` }));
  });
}

function remoteRelease(overrides = {}) {
  return {
    schema_version: 2,
    version: release.version,
    update_policy: "required",
    summary: "test release",
    upgrade_command: "upgrade now",
    managed_integrity: { ...release.managed_integrity },
    critical_integrity: {
      checker_git_blob_sha: release.critical_integrity.checker_git_blob_sha,
      agents_rules_git_blob_sha: release.critical_integrity.agents_rules_git_blob_sha,
    },
    ...overrides,
  };
}

test("current release passes with full local framework integrity", async () => {
  const target = createTarget();
  const server = await serveRelease(remoteRelease());
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /framework is current/i);
    assert.match(result.output, /framework integrity passed/i);
  } finally {
    await server.close();
  }
});

test("Windows-style CRLF checkout does not create false framework drift", async () => {
  const target = createTarget();
  for (const relative of release.framework_managed_paths) {
    const file = path.join(target.root, relative);
    fs.writeFileSync(file, toCrlf(fs.readFileSync(file, "utf8")));
  }
  const agentsPath = path.join(target.root, "AGENTS.md");
  fs.writeFileSync(agentsPath, toCrlf(fs.readFileSync(agentsPath, "utf8")));

  const server = await serveRelease(remoteRelease());
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /framework is current/i);
  } finally {
    await server.close();
  }
});

test("target-native AGENTS changes outside the bounded block remain allowed", async () => {
  const target = createTarget();
  const agentsPath = path.join(target.root, "AGENTS.md");
  fs.writeFileSync(agentsPath, fs.readFileSync(agentsPath, "utf8").replace("# Target rules", "# Target rules changed independently"));
  const server = await serveRelease(remoteRelease());
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /framework is current/i);
  } finally {
    await server.close();
  }
});

test("recommended newer release is visible but non-blocking", async () => {
  const target = createTarget();
  const server = await serveRelease(remoteRelease({ version: "1.2.0", update_policy: "recommended" }));
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /update available/i);
    assert.match(result.output, /recommended/i);
  } finally {
    await server.close();
  }
});

test("required newer release exits 2 outside GitHub Actions", async () => {
  const target = createTarget();
  const server = await serveRelease(remoteRelease({ version: "1.2.0", update_policy: "required" }));
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 2, result.output);
    assert.match(result.output, /REQUIRED/i);
  } finally {
    await server.close();
  }
});

test("same version with changed critical release content requires reconciliation", async () => {
  const target = createTarget();
  const server = await serveRelease(remoteRelease({
    critical_integrity: {
      ...release.critical_integrity,
      agents_rules_git_blob_sha: "0000000000000000000000000000000000000000",
    },
  }));
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 2, result.output);
    assert.match(result.output, /content changed without a version change/i);
  } finally {
    await server.close();
  }
});

test("same version with changed noncritical managed content also requires reconciliation", async () => {
  const target = createTarget();
  const managed = { ...release.managed_integrity, ".planning/FRAMEWORK.md": "0000000000000000000000000000000000000000" };
  const server = await serveRelease(remoteRelease({ managed_integrity: managed }));
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 2, result.output);
    assert.match(result.output, /content changed without a version change/i);
  } finally {
    await server.close();
  }
});

test("malformed reachable source manifest blocks with exit 3", async () => {
  const target = createTarget();
  const server = await serveRelease(remoteRelease({ managed_integrity: null }));
  try {
    const result = await runChecker(target.root, server.url);
    assert.equal(result.code, 3, result.output);
    assert.match(result.output, /source release manifest is malformed/i);
  } finally {
    await server.close();
  }
});

test("local checker drift exits 3 before source freshness can be trusted", async () => {
  const target = createTarget();
  fs.appendFileSync(path.join(target.planning, "check-framework-update.mjs"), "\n// local drift\n");
  const result = await runChecker(target.root, "http://127.0.0.1:1/unreachable");
  assert.equal(result.code, 3, result.output);
  assert.match(result.output, /framework-managed file drifted/i);
  assert.match(result.output, /check-framework-update\.mjs/);
});

test("local noncritical framework-managed drift exits 3", async () => {
  const target = createTarget();
  fs.appendFileSync(path.join(target.planning, "FRAMEWORK.md"), "\nlocal drift\n");
  const result = await runChecker(target.root, "http://127.0.0.1:1/unreachable");
  assert.equal(result.code, 3, result.output);
  assert.match(result.output, /framework-managed file drifted/i);
  assert.match(result.output, /FRAMEWORK\.md/);
});

test("bounded AGENTS rules drift exits 3", async () => {
  const target = createTarget();
  const agentsPath = path.join(target.root, "AGENTS.md");
  const agents = fs.readFileSync(agentsPath, "utf8").replace("# S&T Planner Rules", "# S&T Planner Rules changed");
  fs.writeFileSync(agentsPath, agents);
  const result = await runChecker(target.root, "http://127.0.0.1:1/unreachable");
  assert.equal(result.code, 3, result.output);
  assert.match(result.output, /rules block.*differs/i);
});

test("duplicate bounded AGENTS marker exits 3 instead of guessing ownership", async () => {
  const target = createTarget();
  fs.appendFileSync(path.join(target.root, "AGENTS.md"), `\n${release.agents_rules.end_marker}\n`);
  const result = await runChecker(target.root, "http://127.0.0.1:1/unreachable");
  assert.equal(result.code, 3, result.output);
  assert.match(result.output, /missing, duplicated, or malformed/i);
});

test("source unavailable remains non-blocking but never claims current", async () => {
  const target = createTarget();
  const result = await runChecker(target.root, "http://127.0.0.1:1/unreachable");
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /could not be verified/i);
  assert.match(result.output, /do not claim.*current/i);
  assert.doesNotMatch(result.output, /^S&T Planner framework is current/m);
});
