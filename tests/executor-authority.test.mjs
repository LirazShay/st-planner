import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateExecutorAuthority,
  parseExplicitExecutorStartup,
} from "../templates/project/.planning/executor-authority.mjs";

test("explicit startup parser recognizes supported executor forms", () => {
  assert.equal(parseExplicitExecutorStartup("אני צאט 17 תתחיל"), "17");
  assert.equal(parseExplicitExecutorStartup("אני צ'אט מספר 17"), "17");
  assert.equal(parseExplicitExecutorStartup("I am chat 17"), "17");
  assert.equal(parseExplicitExecutorStartup("תמשיך לשלב הבא"), null);
});

test("generic continue cannot implicitly roll an old conversation into the next chat after handoff", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: true,
    userMessage: "תמשיך לשלב הבא",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "explicit_startup_required_after_handoff");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.nextChatId, "17");
  assert.equal(result.mayMutateExecutionState, false);
});

test("explicit startup may intentionally rebootstrap the next allocated chat after handoff", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: true,
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.action, "rebootstrap");
  assert.equal(result.code, "explicit_rebootstrap_after_handoff");
  assert.equal(result.previousExecutorIdentity, "16");
  assert.equal(result.executorIdentity, "17");
  assert.equal(result.mayMutateExecutionState, true);
});

test("repo pointer cannot bootstrap next chat from an unidentified conversation", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: null,
    handoffEmitted: false,
    userMessage: "תמשיך לשלב הבא",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "explicit_startup_required");
  assert.equal(result.executorIdentity, null);
  assert.equal(result.mayMutateExecutionState, false);
});

test("repo pointer mismatch is advisory and cannot mutate an existing conversation identity", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: false,
    userMessage: "תמשיך לשלב הבא",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.action, "continue");
  assert.equal(result.code, "existing_identity_confirmed");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.nextChatId, "17");
  assert.equal(result.mayMutateExecutionState, true);
  assert.equal(result.severity, "warning");
  assert.equal(result.warnings[0].code, "repository_pointer_differs");
});

test("fresh explicit startup may proceed when target current pointer is stale but allocation confirms the chat", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: null,
    handoffEmitted: false,
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["17", "18"],
    repoCurrentChatId: "18",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.action, "activate");
  assert.equal(result.code, "explicit_startup_confirmed");
  assert.equal(result.executorIdentity, "17");
  assert.equal(result.severity, "warning");
  assert.equal(result.warnings[0].code, "repository_pointer_differs");
});

test("explicit startup in a new conversation activates an allocated chat", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: null,
    handoffEmitted: false,
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.action, "activate");
  assert.equal(result.code, "explicit_startup_confirmed");
  assert.equal(result.executorIdentity, "17");
  assert.equal(result.mayMutateExecutionState, true);
});

test("active conversation cannot switch executor identity without a handoff boundary", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: false,
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "conversation_switch_requires_handoff");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.mayMutateExecutionState, false);
});

test("unallocated chat remains a hard blocker", () => {
  const result = evaluateExecutorAuthority({
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["18"],
    repoCurrentChatId: "18",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "startup_chat_not_allocated");
  assert.equal(result.mayMutateExecutionState, false);
});

test("repository authorization remains a hard gate", () => {
  const result = evaluateExecutorAuthority({
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: false,
    repoAllocatedChatIds: ["17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "repository_execution_not_authorized");
  assert.equal(result.mayMutateExecutionState, false);
});
