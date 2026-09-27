# Connecting GPT Chats to the S&T Framework

A chat connects to the framework in one of two explicit roles:

- **PLANNER**
- **EXECUTOR**

The role determines what the chat is allowed to do.

# 1. Planner connection

Use during the Planning Program.

A planner chat should receive repository access when possible and start with:

> Connect as a PLANNER to this project's S&T framework. Resume the durable planning state. Do not implement the target project. Continue only the recorded planning/review work and persist the handoff for the next planner chat.

Read order:

1. project `AGENTS.md`;
2. `.planning/README.md`;
3. `.planning/FRAMEWORK.md`;
4. `.planning/STATUS.yaml`;
5. `.planning/GOAL.md`;
6. relevant portions of `TREE.yaml`;
7. referenced D/R entries;
8. relevant project source/context only as needed.

A planner chat may:
- research/inspect current reality;
- design;
- decompose S&T;
- critique;
- resolve planning decisions;
- update planning artifacts.

A planner chat must not:
- implement target project work;
- create an execution shortcut from a partially planned branch;
- hand an unreviewed leaf directly to implementation.

# 2. Executor connection

Use only after:

```yaml
stage: execution
```

and after `EXECUTION-PLAN.yaml` is frozen.

An executor chat is started with a specific package ID:

> Connect as an EXECUTOR for work package WP-XXX. Read the frozen S&T planning context and this package. Perform only this responsibility, verify it using the package evidence, and record the execution result. Do not redesign the plan. If a material planning gap appears, stop and return it as a planning exception.

An executor reads:

1. project `AGENTS.md`;
2. framework execution rules;
3. the assigned work package;
4. only the relevant frozen S&T nodes/decisions;
5. required project files for execution.

It should not need to read the whole planning history.

# 3. Why the roles are separate

Planner chats optimize for:
- logical completeness;
- necessity/sufficiency;
- architecture/decisions;
- global consistency.

Executor chats optimize for:
- faithful implementation;
- bounded responsibility;
- verification;
- clean handoff.

Mixing the roles encourages premature coding and forces executor chats to improvise missing design decisions.

# 4. Product adapters

The framework should not depend on a specific ChatGPT feature.

Possible adapters:
- repository-aware ChatGPT;
- a future ChatGPT plugin/connector;
- CLI;
- GitHub App;
- IDE agent;
- another AI system.

An adapter may automate:
- role connection;
- minimal context loading;
- state validation;
- creating executor chats/work packages;
- writing handoff results.

The adapter does not own the plan. The repository artifacts remain authoritative.

# 5. Plain chat fallback

Without repository/file access:

Planner:
- provide FRAMEWORK, STATUS, GOAL, relevant TREE/DECISIONS/REVIEWS.

Executor:
- provide framework execution rules + assigned frozen work package + its referenced planning context.

The transcript itself is never the authoritative project state.
