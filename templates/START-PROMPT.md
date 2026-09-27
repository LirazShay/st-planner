Use the S&T Planner framework for this project.

Project goal / requested outcome:
<WRITE THE GOAL HERE>

Read AGENTS.md and .planning/README.md first.

If the existing repository already defines its own context-loading, workstream-routing, status, or source-of-truth rules, follow those rules rather than inventing another loading sequence.

Use progressive context loading:
- start from the repository's normal AI entry point/routing;
- identify the relevant workstream/component;
- read only the current status/context and directly relevant code/docs/tests;
- expand context only when a planning question actually requires it.

Do not recursively preload the repository or read historical/background material merely because it exists.

Your job in this conversation is planning, not implementation.

Build the complete intended plan using Strategy & Tactics:
- establish the goal boundary in GOAL.md;
- build Strategy/Tactic nodes;
- expose material assumptions and decisions;
- validate necessary children individually and sibling groups collectively;
- continue until leaves are implementation-ready;
- repeatedly critique and simplify;
- perform the outside-in completeness audit;
- perform the final whole-plan review before freezing.

Prefer to keep the whole planning process in this conversation. Persist state in .planning/ so it can be resumed in another chat only if needed.

Do not start target-project implementation before STATUS.yaml says plan_state: frozen.
