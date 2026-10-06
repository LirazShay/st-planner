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

test("old conversation stays terminal after handoff even when repo advances to next chat", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: true,
    userMessage: "תמשיך לשלב הבא",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "execution_closed_after_handoff");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.nextChatId, "17");
  assert.equal(result.mayMutateExecutionState, false);
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

test("repo pointer mismatch cannot mutate an existing conversation identity", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: false,
    userMessage: "תמשיך לשלב הבא",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "repository_pointer_does_not_match_conversation");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.nextChatId, "17");
  assert.equal(result.mayMutateExecutionState, false);
});

test("explicit startup in a new conversation activates the allocated current chat", () => {
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

test("existing conversation identity cannot be replaced by another explicit startup", () => {
  const result = evaluateExecutorAuthority({
    conversationIdentity: "16",
    handoffEmitted: false,
    userMessage: "אני צאט 17 תתחיל",
    repoExecutionAuthorized: true,
    repoAllocatedChatIds: ["16", "17"],
    repoCurrentChatId: "17",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.code, "conversation_identity_is_immutable");
  assert.equal(result.executorIdentity, "16");
  assert.equal(result.mayMutateExecutionState, false);
});

test("repository authorization still gates an explicit startup", () => {
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
