#!/usr/bin/env node

import path from "node:path";
import { pathToFileURL } from "node:url";

function normalizeChatId(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return /^[1-9]\d*$/.test(text) ? text : null;
}

function startupLineChatId(line) {
  const normalized = line.trim();
  if (!normalized) return null;

  const patterns = [
    /^אני\s+צ(?:'|׳)?אט(?:\s+מספר)?\s+([1-9]\d*)\s+תתחיל[.!]?$/u,
    /^אני\s+צ(?:'|׳)?אט(?:\s+מספר)?\s+([1-9]\d*)[.!]?$/u,
    /^I\s+am\s+chat\s+([1-9]\d*)(?:\s+start)?[.!]?$/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function parseExplicitExecutorStartup(message) {
  const text = String(message ?? "");
  const ids = new Set();

  for (const line of text.split(/\r?\n/)) {
    const id = startupLineChatId(line);
    if (id) ids.add(id);
  }

  if (ids.size !== 1) return null;
  return [...ids][0];
}

function allocatedSet(values) {
  const result = new Set();
  for (const value of values ?? []) {
    const id = normalizeChatId(value);
    if (id) result.add(id);
  }
  return result;
}

function reject(code, identity, nextChatId, detail) {
  return {
    allowed: false,
    action: "reject",
    code,
    executorIdentity: identity,
    nextChatId,
    mayMutateExecutionState: false,
    detail,
  };
}

/**
 * Framework-level executor authority gate.
 *
 * Repository state can confirm an explicitly activated executor identity, but it
 * can never create or replace conversation identity. After handoff emission the
 * conversation is terminal for execution, even if repository pointers advance.
 */
export function evaluateExecutorAuthority({
  conversationIdentity = null,
  handoffEmitted = false,
  userMessage = "",
  repoExecutionAuthorized = true,
  repoAllocatedChatIds = [],
  repoCurrentChatId = null,
} = {}) {
  const identity = normalizeChatId(conversationIdentity);
  const startupId = parseExplicitExecutorStartup(userMessage);
  const allocated = allocatedSet(repoAllocatedChatIds);
  const currentChatId = normalizeChatId(repoCurrentChatId);
  const nextChatId = currentChatId ?? (allocated.size === 1 ? [...allocated][0] : null);

  if (handoffEmitted) {
    return reject(
      "execution_closed_after_handoff",
      identity,
      nextChatId,
      "This conversation already emitted a new-chat handoff and cannot execute a later allocated chat.",
    );
  }

  if (!repoExecutionAuthorized) {
    return reject(
      "repository_execution_not_authorized",
      identity,
      nextChatId,
      "Repository execution authorization is not active.",
    );
  }

  if (identity) {
    if (startupId && startupId !== identity) {
      return reject(
        "conversation_identity_is_immutable",
        identity,
        nextChatId,
        `Conversation executor identity is Chat ${identity}; an explicit startup for Chat ${startupId} cannot replace it.`,
      );
    }

    if (currentChatId && currentChatId !== identity) {
      return reject(
        "repository_pointer_does_not_match_conversation",
        identity,
        currentChatId,
        `Repository points to Chat ${currentChatId}, but this conversation is Chat ${identity}.`,
      );
    }

    if (allocated.size > 0 && !allocated.has(identity)) {
      return reject(
        "conversation_identity_not_allocated",
        identity,
        nextChatId,
        `Chat ${identity} is not allocated in current repository execution state.`,
      );
    }

    return {
      allowed: true,
      action: "continue",
      code: "existing_identity_confirmed",
      executorIdentity: identity,
      nextChatId,
      mayMutateExecutionState: true,
      detail: `Conversation remains Chat ${identity}; repository state confirms rather than creates identity.`,
    };
  }

  if (!startupId) {
    return reject(
      "explicit_startup_required",
      null,
      nextChatId,
      "No executor identity is active in this conversation. Repository allocation and continue commands cannot activate one.",
    );
  }

  if (currentChatId && startupId !== currentChatId) {
    return reject(
      "startup_does_not_match_repository_pointer",
      null,
      currentChatId,
      `Explicit startup requested Chat ${startupId}, but repository points to Chat ${currentChatId}.`,
    );
  }

  if (allocated.size > 0 && !allocated.has(startupId)) {
    return reject(
      "startup_chat_not_allocated",
      null,
      nextChatId,
      `Explicit startup requested Chat ${startupId}, which is not allocated in current repository execution state.`,
    );
  }

  return {
    allowed: true,
    action: "activate",
    code: "explicit_startup_confirmed",
    executorIdentity: startupId,
    nextChatId,
    mayMutateExecutionState: true,
    detail: `Explicit startup activated Chat ${startupId} in this conversation after repository confirmation.`,
  };
}

function usage() {
  return [
    "S&T executor conversation authority guard",
    "",
    "This helper is primarily an executable framework contract used by tests.",
    "Repository allocation never activates or changes a conversation executor identity.",
    "",
    "Usage:",
    "  node .planning/executor-authority.mjs --help",
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  throw new Error("Unsupported arguments; use --help. The framework invokes this contract through its exported functions/tests.");
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`S&T executor authority ERROR: ${error.message}`);
    process.exitCode = 2;
  });
}
