# S&T of the S&T Planner

This document dogfoods the method: the planner itself is designed using S&T logic.

## Root — 0

**Strategy**  
A user can start a meaningful project with GPT and obtain a logically justified, persistent, executable plan that another fresh GPT session can continue.

**Tactic**  
Provide a small repository-based planning framework that teaches GPT S&T logic, stores project planning state, reviews the plan, and releases only approved work into execution.

**Parallel assumptions**
- GPT already has enough general reasoning capability; the main gap is a durable method and state model.
- Plain text in Git is sufficient for V1.
- A small protocol is more likely to be followed consistently than a large application.
- Planning quality can be improved by explicitly testing necessity, sufficiency, assumptions, and executability.

**Success evidence**
- A new project can copy the template and begin planning immediately.
- A fresh GPT session can recover the project's goal, status, and next action from repository files.
- A reviewed S&T branch can be converted into executable tasks.
- The framework does not require a service, database, or custom UI.

## Level 1

The root tactic requires four conditions.

### 0.1 — GPT has a precise planning method

**Strategy**  
GPT knows how to transform a goal into a valid S&T plan.

**Tactic**  
Provide an explicit S&T methodology and deterministic planning protocol.

**Necessary assumption**  
Without a defined method, planning behavior varies by session and can collapse into arbitrary checklists.

**Evidence**
- A fresh GPT can explain Strategy/Tactic, necessity, sufficiency, and stopping rules from repository docs.

### 0.2 — Planning state survives chat boundaries

**Strategy**  
The plan can be resumed without depending on previous chat history.

**Tactic**  
Store the minimal planning state in a project-local `.planning/` directory.

**Necessary assumption**  
A method alone is insufficient when the next session cannot reconstruct prior decisions and progress.

**Evidence**
- STATUS + GOAL + active TREE state identify the correct next planning action.

### 0.3 — Bad plans are challenged before execution

**Strategy**  
Logical gaps and unnecessary complexity are detected before implementation.

**Tactic**  
Run explicit review gates for necessity, sufficiency, assumptions, KISS, and executability.

**Necessary assumption**  
Authoring alone tends to confirm its own plan; an adversarial review pass is needed to expose defects.

**Evidence**
- The quality-gate document can produce a clear pass or changes-required outcome for a branch.

### 0.4 — The framework is easy to adopt

**Strategy**  
A user can use S&T Planner in another repository without building infrastructure.

**Tactic**  
Provide a copyable template, a starter instruction, and a minimal read order.

**Necessary assumption**  
A powerful method that requires installation or bespoke integration would not satisfy the V1 KISS objective.

**Evidence**
- Adoption requires only copying files/instructions into the target repository and giving GPT the project goal.

## Sufficiency assumption for 0

If:
1. GPT has a precise S&T planning method,
2. planning state is durable,
3. plans are reviewed before execution, and
4. another project can adopt the framework with minimal setup,

then the V1 root tactic is sufficient to let GPT plan and resume work in other repositories.

No application, service, database, or plugin API is necessary to prove the concept.

## V1 boundary

The following are intentionally outside the first usable version:

- custom GPT/plugin packaging;
- web UI;
- database;
- automated graph editor;
- automatic GitHub Issue generation;
- rich handling of multiple parents;
- rich modeling of supporting steps;
- rich scheduling/time-dependency semantics.

These may be considered only after real projects expose a concrete need.
