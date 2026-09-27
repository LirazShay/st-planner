# Connecting Any GPT/Chat to S&T Planner

The framework should not depend on a specific ChatGPT feature. Connection is an interface contract: the AI receives the portable framework rules plus the durable project state.

## Preferred V1: embedded project framework

Copy the portable framework into every target project:

```
project/
├── AGENTS.md
└── .planning/
    ├── README.md
    ├── FRAMEWORK.md
    ├── GOAL.md
    ├── TREE.yaml
    ├── DECISIONS.md
    ├── REVIEWS.md
    ├── EXECUTION.md
    └── STATUS.yaml
```

Why this is the preferred V1:

- works in a fresh chat;
- survives model/session changes;
- versioned with the project;
- no plugin runtime required;
- easy to inspect and debug;
- the project remains usable even if the central framework repository is unavailable.

The central `st-planner` repository is the framework source. Each project carries a small portable kernel.

---

## Connection mode A — GPT has repository access

Start with one short instruction:

> Connect to this project's S&T framework. Read AGENTS.md and .planning/README.md, resume from STATUS, and follow the framework lifecycle through planning, execution, verification, and replanning. Do not rely on previous chat history.

The AI should then discover the remaining read order from the project itself.

This is the best operating mode.

---

## Connection mode B — GPT can read files but not GitHub directly

Provide/export the project's `.planning/` directory plus relevant project files.

Use the same connection instruction.

When the session finishes, persist changed planning files back to the project repository.

---

## Connection mode C — plain chat with no project/file access

This is a degraded mode.

Provide:

- `FRAMEWORK.md`;
- current `STATUS.yaml`;
- `GOAL.md`;
- relevant TREE branch;
- referenced D/R/E entries.

The chat can still follow the logic, but durable handoff requires the resulting state to be written back somewhere persistent.

Do not treat the chat transcript itself as durable framework state.

---

## Future integration: one-click connector/plugin

A future integration may automate:

- framework initialization;
- reading only the needed context;
- state validation;
- writing state;
- opening/closing execution tasks;
- handoff between chats.

The plugin must be an **adapter**, not the source of planning truth.

The portable files remain the canonical model so the framework is not locked to one GPT product or integration.

---

# Connection handshake

On a fresh session, the agent should internally establish:

1. **Framework present?** If not, initialize/attach it before substantial work.
2. **Existing project state?** Resume it; do not start a second plan.
3. **Goal boundary valid?** If not, repair it.
4. **Current blocker?** Resolve/expose it before inventing work.
5. **Implementation scope?** Never execute outside it.
6. **Next action?** Perform the next lifecycle action, not a random useful-looking task.

A concise user-facing acknowledgement may be:

> S&T framework connected. I recovered the current state and will continue from the recorded next action.

Do not require the user to understand the internal file layout.

---

# Framework portability rule

The framework must be usable by:

- a new GPT chat;
- a different GPT model;
- another AI agent;
- a human reviewer.

Therefore project state must contain conclusions, rationale, assumptions, evidence, and decisions — **not hidden chain-of-thought**.
