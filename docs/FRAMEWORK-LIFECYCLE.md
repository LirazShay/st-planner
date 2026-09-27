# S&T Framework Lifecycle

S&T Planner is not only a planning method. It is a control loop that carries a goal from intent to verified outcome and keeps the rationale recoverable across AI sessions.

The framework should work with any capable GPT/AI agent that can read and update the project state. GitHub is the preferred durable host for V1, but the lifecycle is deliberately tool-agnostic.

## The control loop

```
CONNECT
  ↓
UNDERSTAND
  ↓
PLAN
  ↓
CRITIQUE
  ↓
RELEASE
  ↓
EXECUTE
  ↓
VERIFY
  ↓
LEARN / REPLAN
  └──────────────→ PLAN
```

At any point a new chat may replace the current chat. The repository state must be enough to resume the loop.

---

## 1. CONNECT

Goal: make a fresh AI session operate under the same planning/execution contract without relying on prior chat history.

The AI reads:

1. repository `AGENTS.md` when present;
2. `.planning/README.md`;
3. `.planning/FRAMEWORK.md`;
4. `.planning/STATUS.yaml`;
5. `.planning/GOAL.md`;
6. only the relevant part of `.planning/TREE.yaml`;
7. referenced decisions, reviews, and execution outcomes only when needed.

Connection is successful when the AI can state:

- the stable goal boundary;
- the current focus;
- the material blocker, if any;
- the exact next action;
- the exact implementation scope;
- the last relevant review/execution outcome.

Do not dump the entire repository into context.

---

## 2. UNDERSTAND

Goal: establish a stable problem boundary before selecting a solution.

Persist:

- desired outcome;
- established current reality;
- constraints;
- non-goals.

Material unresolved questions become D-entries in `DECISIONS.md`.

Do not hide uncertainty in chat.

---

## 3. PLAN

Goal: construct the S&T logic from outcome to executable leaves.

For every active step establish:

- Strategy;
- Tactic;
- Parallel assumptions;
- Necessary assumptions for child-to-parent logic;
- Sufficiency assumptions for parent groups;
- Success evidence;
- Children.

The number and depth of nodes emerge from the logic, not from a predetermined phase count.

---

## 4. CRITIQUE

Goal: try to break the plan before reality does.

Run independent passes for:

- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumption honesty;
- KISS;
- executability;
- tree consistency;
- fresh-session continuity.

A review result belongs in `REVIEWS.md`.

If a review exposes a material unresolved question, create/reference a D-entry instead of burying the issue inside review prose.

---

## 5. RELEASE

Goal: expose only a safe, useful near-term execution horizon.

Only approved executable leaves may enter:

```yaml
implementation_scope:
  - "node-id"
```

A project does **not** need every future branch fully decomposed before useful work begins.

Release is permission, not completion.

---

## 6. EXECUTE

Goal: perform the released work using whatever executor is appropriate.

Execution can be:

- GPT editing code/files;
- GitHub Issues + pull requests;
- browser/tool actions;
- a human task;
- another agent;
- a non-software real-world action.

The framework does not prescribe one executor.

Each execution effort must retain the S&T node ID so the work remains traceable to its rationale.

Do not silently broaden scope beyond the released node.

---

## 7. VERIFY

Goal: test reality against the node's `success_evidence`.

After execution, classify the result:

- **verified** — evidence demonstrates the node strategy;
- **failed** — evidence shows the strategy was not achieved;
- **partial** — useful result exists, but the success evidence is not yet satisfied.

Record the outcome in `EXECUTION.md`.

Do not mark success because the tactic was performed. Verify the Strategy outcome.

---

## 8. LEARN / REPLAN

Execution creates facts that planning could not know in advance.

If evidence contradicts an assumption or reveals a missing condition:

1. record the observed fact in the execution outcome;
2. identify affected S&T nodes;
3. reopen only the smallest affected planning branch;
4. update decisions when needed;
5. re-run review upward until the affected logic is valid;
6. release the next safe execution horizon.

The plan serves reality; reality does not serve the plan.

---

# Separation of concerns

The durable files have distinct ownership:

- `GOAL.md` — stable boundary.
- `TREE.yaml` — planning logic and node planning status.
- `DECISIONS.md` — material unresolved questions and resolutions.
- `REVIEWS.md` — planning audit history.
- `EXECUTION.md` — observed execution/verification outcomes.
- `STATUS.yaml` — resume pointer and currently released implementation scope.

External systems such as GitHub Issues, PRs, CI, project boards, or other tools may execute work, but they do not replace the S&T rationale.

---

# Core invariant

Every transition must preserve traceability:

```
Goal
→ Strategy
→ Tactic
→ Executable leaf
→ Execution
→ Evidence
→ Observed reality
→ Updated plan (when needed)
```

A fresh AI session should be able to reconstruct that chain without private chain-of-thought or prior chat history.
