# S&T of the S&T Framework

This document dogfoods the method: the framework itself is designed using S&T logic.

## Root — 0

**Strategy**  
Any capable GPT/chat can take a meaningful goal from intent to a verified outcome using the same logical planning method, while preserving enough durable state for another fresh session to continue correctly.

**Tactic**  
Provide a portable S&T lifecycle framework that connects a chat to durable project state, plans and critiques work, releases only safe executable horizons, captures execution evidence, and feeds observed reality back into replanning.

**Parallel assumptions**
- General-purpose GPT models already have enough reasoning and tool-use capability; the main gap is a stable operating method and durable state.
- The planning method must survive chat/model boundaries.
- Planning without execution feedback is incomplete because reality can falsify assumptions.
- A portable file-based kernel can provide the framework before a dedicated plugin exists.
- Git/GitHub is a practical V1 host, but the logical framework must not depend on GitHub-specific semantics.

**Root success evidence**
- A fresh GPT can connect to a project with one short bootstrap instruction and recover the correct lifecycle state.
- A new goal is converted into reviewed S&T logic rather than an arbitrary checklist.
- Only approved executable leaves are released to execution.
- Execution is verified against Strategy success evidence, not merely task completion.
- Failed/partial evidence can reopen the smallest affected planning branch.
- Another chat can continue planning or execution without needing the previous transcript.
- The framework can be used without a custom application, database, or hidden chain-of-thought.

---

# Level 1 — Necessary conditions

## 0.1 — Any GPT/chat can connect consistently

**Strategy**  
A fresh capable AI session can enter the framework without needing to know its internal design in advance.

**Tactic**  
Define a small connection contract and embed a portable framework kernel in each project.

**Necessary assumption**  
A correct methodology is useless across chats if each new session has to rediscover how to load and resume it.

**Success evidence**
- A fresh session using the documented connection instruction identifies the goal, current focus, blocker, next action, implementation scope, and relevant prior evidence.

---

## 0.2 — The goal is converted into defensible S&T logic

**Strategy**  
The project has a logical path from desired outcome to executable leaves.

**Tactic**  
Apply the S&T method: Strategy/Tactic pairs, Parallel/Necessary/Sufficiency assumptions, explicit uncertainty, success evidence, and contextual stopping rules.

**Necessary assumption**  
Without a common planning logic, GPT can produce plausible but arbitrary plans whose steps are neither proven necessary nor sufficient.

**Success evidence**
- Active branches survive Strategy/Tactic, necessity, sufficiency, epistemic, and KISS review.

---

## 0.3 — Framework state survives session boundaries

**Strategy**  
The framework can resume accurately after chat/model replacement.

**Tactic**  
Persist the minimal authoritative state in project-local files with one owner for each type of information.

**Necessary assumption**  
The framework cannot control a multi-session project if conclusions and progress exist only inside the previous transcript.

**Success evidence**
- A fresh session resumes from repository state without requesting the previous conversation.

---

## 0.4 — Only decision-quality work reaches execution

**Strategy**  
Execution begins from an explicit, reviewed, bounded horizon.

**Tactic**  
Run adversarial quality gates and place only approved executable leaves into `implementation_scope`.

**Necessary assumption**  
Planning has little value if unreviewed or ambiguous nodes can still flow directly into action.

**Success evidence**
- Everything outside `implementation_scope` remains blocked.
- Each released leaf has objective success evidence and no material unresolved decision.

---

## 0.5 — Execution produces verified reality, not just completed activity

**Strategy**  
The framework knows whether execution actually achieved the intended Strategy.

**Tactic**  
Execute through any suitable tool/human/agent, verify against node `success_evidence`, and record the observed outcome in `EXECUTION.md`.

**Necessary assumption**  
"Work was performed" is not equivalent to "the intended outcome exists."

**Success evidence**
- Each completed execution can be classified verified / failed / partial with concrete observed evidence.
- External task trackers may be used without becoming the source of S&T truth.

---

## 0.6 — Reality can correct the plan

**Strategy**  
New facts discovered during execution improve the plan instead of being ignored.

**Tactic**  
Feed execution outcomes back into the smallest affected S&T branch, reopen decisions/reviews when needed, and release a corrected next horizon.

**Necessary assumption**  
Even a logically sound plan rests on assumptions that real execution can falsify.

**Success evidence**
- A failed/partial execution can identify affected nodes and cause bounded replanning without restarting the entire project.

---

# Sufficiency assumption for 0

If:

1. any GPT/chat can connect consistently;
2. goals are transformed into reviewed S&T logic;
3. authoritative state survives sessions;
4. only reviewed executable horizons are released;
5. execution is verified against intended outcomes; and
6. observed reality can update the plan,

then the framework is sufficient to guide a project continuously from intent to verified outcome while remaining resumable across GPT chats.

---

# Architecture boundary

The **framework** is the stable logical contract.

The **adapter** is how a particular GPT/product connects to it.

V1 adapter:
- project-local portable files;
- short bootstrap prompt;
- Git/GitHub as durable storage when available.

Possible future adapters:
- ChatGPT plugin/connector;
- CLI;
- GitHub App/Action;
- IDE integration;
- other AI agent integrations.

Adapters may automate transport and validation. They must not become the source of planning truth.

---

# Deferred complexity

Do not add these until real use proves the need:

- custom UI;
- database service;
- rich graph support for multiple parents;
- rich scheduling semantics;
- automatic orchestration across multiple agents;
- automatic GitHub Issue generation;
- plugin-specific state.

The framework must work correctly before convenience automation is layered on top.
