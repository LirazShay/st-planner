import test from "node:test";
import assert from "node:assert/strict";

import { validateAllocation } from "../templates/project/.planning/validate-allocation.mjs";

function tree({ secondDependsOnFirst = false } = {}) {
  return `version: 1

root: "0"

nodes:
  "0":
    status: approved
    strategy: "root"
    tactic: "root"
    parallel_assumptions: []
    necessary_assumptions: []
    sufficiency_assumptions: []
    success_evidence: []
    depends_on: []
    children:
      - "0.1"
      - "0.2"

  "0.1":
    status: approved
    strategy: "first"
    tactic: "first"
    parallel_assumptions: []
    necessary_assumptions: []
    sufficiency_assumptions: []
    success_evidence:
      - "verified"
    depends_on: []
    children: []

  "0.2":
    status: approved
    strategy: "second"
    tactic: "second"
    parallel_assumptions: []
    necessary_assumptions: []
    sufficiency_assumptions: []
    success_evidence:
      - "verified"
    depends_on:${secondDependsOnFirst ? '\n      - "0.1"' : " []"}
    children: []
`;
}

function execution(body) {
  return `version: 1

chats:
${body}
`;
}

const valid = execution(`  "1":
    nodes:
      "0.1":
        state: pending
        result: null

  "2":
    nodes:
      "0.2":
        state: pending
        result: null
`);

test("valid initial allocation passes", () => {
  const result = validateAllocation(tree(), valid);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.implementationReadyLeaves, 2);
});

test("missing implementation-ready leaf fails", () => {
  const input = execution(`  "1":
    nodes:
      "0.1":
        state: pending
        result: null
`);

  const result = validateAllocation(tree(), input);
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes('leaf "0.2" is not assigned')));
});

test("duplicate assignment fails", () => {
  const input = execution(`  "1":
    nodes:
      "0.1":
        state: pending
        result: null
      "0.2":
        state: pending
        result: null

  "2":
    nodes:
      "0.2":
        state: pending
        result: null
`);

  const result = validateAllocation(tree(), input);
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes('leaf "0.2" is assigned 2 times')));
});

test("non-leaf assignment fails", () => {
  const input = execution(`  "1":
    nodes:
      "0":
        state: pending
        result: null
      "0.1":
        state: pending
        result: null
      "0.2":
        state: pending
        result: null
`);

  const result = validateAllocation(tree(), input);
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes('assigned node "0" is not a leaf')));
});

test("invalid execution state fails", () => {
  const input = valid.replace("state: pending", "state: ready");
  const result = validateAllocation(tree(), input);
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes('invalid execution state "ready"')));
});

test("initial allocation requires pending and null result", () => {
  const input = valid
    .replace("state: pending", "state: done")
    .replace("result: null", 'result: "already done"');

  const result = validateAllocation(tree(), input);
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes("must be pending")));
  assert(result.errors.some((x) => x.includes("must have result: null")));
});

test("resume mode accepts completed nodes with evidence", () => {
  const input = valid
    .replace("state: pending", "state: done")
    .replace("result: null", 'result: "commit abc"');

  const result = validateAllocation(tree(), input, { phase: "resume" });
  assert.equal(result.ok, true);
});

test("serial mode requires contiguous chat numbering", () => {
  const input = execution(`  "1":
    nodes:
      "0.1":
        state: pending
        result: null

  "3":
    nodes:
      "0.2":
        state: pending
        result: null
`);

  const result = validateAllocation(tree(), input, { serialChats: true });
  assert.equal(result.ok, false);
  assert(result.errors.some((x) => x.includes("serial chat numbering must be contiguous")));
});

test("serial mode rejects forward dependency in same chat", () => {
  const input = execution(`  "1":
    nodes:
      "0.2":
        state: pending
        result: null
      "0.1":
        state: pending
        result: null
`);

  const result = validateAllocation(tree({ secondDependsOnFirst: true }), input, {
    serialChats: true,
  });

  assert.equal(result.ok, false);
  assert(
    result.errors.some((x) =>
      x.includes('requires dependency "0.1" before "0.2"'),
    ),
  );
});

test("serial mode accepts dependency in an earlier chat", () => {
  const result = validateAllocation(tree({ secondDependsOnFirst: true }), valid, {
    serialChats: true,
  });

  assert.equal(result.ok, true);
});
