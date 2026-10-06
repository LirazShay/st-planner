import test from "node:test";
import assert from "node:assert/strict";

import { validateAllocation } from "../templates/project/.planning/validate-allocation.mjs";
import {
  assessExecutionProjection,
  deriveExecutionAvailability,
} from "../templates/project/.planning/execution-guidance.mjs";

const compactTree = `version: 1
root: "0"
nodes:
  "0":
    status: approved
    children: ["8.1", "8.2"]
    depends_on: []
  "8.1":
    status: approved
    children: []
    depends_on: []
  "8.2":
    status: approved
    children: []
    depends_on: ["8.1"]
`;

function compactExecution(firstState, firstResult) {
  const result = firstResult === null ? "null" : JSON.stringify(firstResult);
  return `version: 2
chats:
  "17":
    nodes:
      "8.1": { state: ${firstState}, result: ${result} }
  "18":
    nodes:
      "8.2": { state: pending, result: null }
`;
}

test("compact inline TREE/EXECUTION syntax remains valid for existing projects", () => {
  const result = validateAllocation(compactTree, compactExecution("in_progress", null), {
    phase: "resume",
  });

  assert.equal(result.ok, true, result.errors.join("\n"));
});

test("real handoff regression shape is advisory when only the target pointer advanced", () => {
  const result = assessExecutionProjection(
    compactTree,
    compactExecution("in_progress", null),
    { chatId: "18", nodeId: "8.2" },
  );

  assert.equal(result.ok, true);
  assert.equal(result.severity, "warning");
  assert.equal(result.code, "projection_differs_from_execution");
  assert.deepEqual(result.derived.runnableNodes, [
    { chatId: "17", nodeId: "8.1", state: "in_progress" },
  ]);
});

test("after authoritative compact completion the dependent next chat is derived", () => {
  const result = deriveExecutionAvailability(
    compactTree,
    compactExecution("done", "verified, green"),
  );

  assert.equal(result.safe, true);
  assert.deepEqual(result.runnableNodes, [
    { chatId: "18", nodeId: "8.2", state: "pending" },
  ]);
});
