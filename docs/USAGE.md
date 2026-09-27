# Using the S&T Framework in Another Project

## Minimal setup

Copy these files from `templates/project/` into the target repository:

```
AGENTS.snippet.md   -> merge into the target repository's AGENTS.md
.planning/          -> copy as-is
```

Do not replace an existing `AGENTS.md`; merge the S&T rules into it.

## Start the first planning session

Give GPT the project repository and this instruction:

> Use the S&T Planner protocol in this repository. Read AGENTS.md and .planning/README.md first. Do not implement yet. Start by establishing the stable goal boundary: desired outcome, established current reality, constraints, and non-goals. Put material unresolved questions in DECISIONS.md and success evidence on S&T nodes in TREE.yaml. Persist the planning state in .planning/.

Then describe the project normally.

Example:

> I want this service to support importing customer CSV files safely and reliably.

GPT should update `.planning/GOAL.md` before deep decomposition.

## Connect or continue in any new chat

Use:

> Connect to this project's S&T framework. Follow AGENTS.md and .planning/README.md, resume from STATUS, and continue the recorded next lifecycle action. Plan, execute, verify, or replan as the state requires. Do not rely on previous chat history.

The new session should not require a transcript of the previous chat.

## When implementation may start

Implementation begins only when the relevant execution horizon passes the quality gates and the exact approved executable leaves appear in:

```yaml
implementation_scope:
  - "node-id"
```

inside `.planning/STATUS.yaml`.

An empty list means implementation is blocked. A non-empty list permits only those node IDs. This can release a near-term horizon even while distant branches remain intentionally undecomposed.

## What the user should expect from GPT

Across the full lifecycle, GPT should:

- clarify the outcome rather than guess hidden requirements;
- avoid arbitrary numbered phase counts;
- build Strategy/Tactic pairs;
- explain why required children are necessary;
- check whether siblings are sufficient together;
- expose assumptions and unknowns;
- challenge over-engineering;
- stop at executable leaves;
- keep repository state current;
- execute only released scope;
- verify outcomes against Strategy success evidence;
- record observed execution results;
- replan when reality invalidates assumptions.

## What GPT should not do

- Begin coding just because the desired technology seems obvious.
- Convert every brainstormed idea into a required S&T node.
- Create dozens of GitHub Issues while the planning logic is still changing.
- Depend on the previous conversation to know where it stopped.
- add complexity for advanced S&T edge cases before a real project requires it.

## V1 operating model

S&T Framework V1 is intentionally a **portable Git/file-based framework**, not yet a dedicated application or plugin.

Its value is tested by one question:

> Does GPT produce and preserve better plans in real projects when it follows these files?

If yes, automation can be added later.
