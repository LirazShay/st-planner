# Execution Protocol

Execution begins **only after the complete planning program has passed Final Planning Review and been frozen**.

Executor chats do not participate in unfinished planning.

# 1. Frozen execution plan

`EXECUTION-PLAN.yaml` is compiled from the completed S&T plan.

Every work package must contain enough resolved information that an executor can act without making a material planning/design decision.

A package contains:

- package ID;
- responsibility/outcome;
- source S&T node IDs;
- scope;
- inputs;
- dependencies;
- planned approach/constraints;
- verification evidence;
- explicit out-of-scope boundaries;
- status.

# 2. Executor-chat contract

An executor chat:

- receives a specific package ID;
- implements only that package;
- follows the decisions already made in planning;
- may inspect required project context;
- verifies the package outcome;
- records results.

It may not:
- redesign the S&T;
- expand its responsibility because another improvement seems useful;
- make a missing material product/architecture decision;
- rewrite the frozen plan to fit what it happened to implement.

# 3. Verification

The executor verifies against the evidence defined by the frozen package/S&T.

Execution result:

- `verified`
- `failed`
- `blocked`

A task being attempted is not verification.

# 4. Planning exception

If execution exposes a material flaw in the frozen plan:

- stop the affected package;
- capture concrete evidence;
- mark it `blocked`;
- create a planning-exception entry in `EXECUTION.md`;
- hand the exception back to a PLANNER chat.

The executor does not solve the planning defect by improvisation.

# 5. Reopening a frozen plan

Only a planner role may reopen planning.

The planner:

1. reads the execution exception;
2. determines affected S&T scope;
3. reopens the minimum necessary planning area;
4. re-runs impacted full-plan consistency checks;
5. updates/freeze a new planning baseline;
6. recompiles affected execution packages.

Execution then resumes from the revised frozen plan.

# 6. Responsibility boundaries

Work packages should be sized for independent executor chats.

Planning should decide:

- what each chat owns;
- what it may modify;
- what it consumes;
- what it must produce;
- what must already exist;
- how its result is verified;
- which later packages depend on it.

The executor should not have to infer its role from the entire S&T tree.

# 7. Completion

Project execution is complete when:

- all required frozen work packages are verified;
- their combined verified evidence demonstrates the root Strategy;
- no blocking execution exception remains;
- final integration/acceptance evidence passes.
