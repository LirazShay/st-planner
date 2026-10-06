import test from "node:test";
import assert from "node:assert/strict";

import {
  assessExecutionProjection,
  deriveExecutionAvailability,
} from "../templates/project/.planning/execution-guidance.mjs";

function tree({ dependent = true } = {}) {
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
      - "8.1"
      - "8.2"

  "8.1":
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

  "8.2":
    status: approved
    strategy: "second"
    tactic: "second"
    parallel_assumptions: []
    necessary_assumptions: []
    sufficiency_assumptions: []
    success_evidence:
      - "verified"
    depends_on:${dependent ? '\n      - "8.1"' : " []"}
    children: []
`;
}

function execution(firstState, firstResult, secondState = "pending", secondResult = null) {
  const resultScalar = (value) => (value === null ? "null" : JSON.stringify(value));
  return `version: 1

chats:
  "17":
    nodes:
      "8.1":
        state: ${firstState}
        result: ${resultScalar(firstResult)}

  "18":
    nodes:
      "8.2":
        state: ${secondState}
        result: ${resultScalar(secondResult)}
`;
}

test("target pointer ahead of authoritative execution becomes a warning, not a blocker", () => {
  const result = assessExecutionProjection(
    tree(),
    execution("in_progress", null),
    { chatId: "18", nodeId: "8.2" },
  );

  assert.equal(result.ok, true);
  assert.equal(result.severity, "warning");
  assert.equal(result.code, "projection_differs_from_execution");
  assert.deepEqual(result.derived.runnableNodes, [
    { chatId: "17", nodeId: "8.1", state: "in_progress" },
  ]);
});

test("after authoritative completion the dependent next chat is derived without a mutable pointer", () => {
  const result = assessExecutionProjection(
    tree(),
    execution("done", "verified 8.1"),
    { chatId: "18", nodeId: "8.2" },
  );

  assert.equal(result.ok, true);
  assert.equal(result.severity, "ok");
  assert.equal(result.code, "projection_aligned");
  assert.deepEqual(result.derived.runnableNodes, [
    { chatId: "18", nodeId: "8.2", state: "pending" },
  ]);
});

test("independent executor chats may be runnable at the same time", () => {
  const result = deriveExecutionAvailability(
    tree({ dependent: false }),
    execution("pending", null),
  );

  assert.equal(result.safe, true);
  assert.deepEqual(result.runnableChatIds, ["17", "18"]);
  assert.equal(result.runnableNodes.length, 2);
});

test("invalid authoritative allocation remains a hard blocker", () => {
  const invalid = `version: 1

chats:
  "17":
    nodes:
      "8.1":
        state: pending
        result: null

  "18":
    nodes:
      "8.1":
        state: pending
        result: null
      "8.2":
        state: pending
        result: null
`;

  const result = assessExecutionProjection(tree(), invalid, { chatId: "17", nodeId: "8.1" });
  assert.equal(result.ok, false);
  assert.equal(result.severity, "blocker");
  assert.equal(result.code, "authoritative_execution_invalid");
});

test("in-progress node with unfinished authoritative dependency remains a hard blocker", () => {
  const result = assessExecutionProjection(
    tree(),
    execution("pending", null, "in_progress", null),
    { chatId: "18", nodeId: "8.2" },
  );

  assert.equal(result.ok, false);
  assert.equal(result.severity, "blocker");
  assert.equal(result.code, "authoritative_execution_invalid");
  assert(result.derived.blockers.some((x) => x.includes('in_progress node "8.2"')));
});

test("done node with unfinished authoritative dependency remains a hard blocker", () => {
  const result = deriveExecutionAvailability(
    tree(),
    execution("pending", null, "done", "invalid early completion"),
  );

  assert.equal(result.safe, false);
  assert(result.blockers.some((x) => x.includes('done node "8.2"')));
});

test("all done execution derives implementation completion with no runnable executor", () => {
  const result = deriveExecutionAvailability(
    tree(),
    execution("done", "verified 8.1", "done", "verified 8.2"),
  );

  assert.equal(result.safe, true);
  assert.equal(result.complete, true);
  assert.deepEqual(result.runnableNodes, []);
  assert.deepEqual(result.runnableChatIds, []);
});
