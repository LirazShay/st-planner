# AI Planning Protocol

Planning depth is adaptive; there is no QUICK/DEEP mode. Use the same S&T rules for every task and stop decomposing when further detail would not materially improve implementation readiness or logical confidence.

## 1. Start with the goal boundary

Update `.planning/GOAL.md` with:
- desired outcome;
- established current reality;
- constraints;
- non-goals.

Material unresolved questions go to `DECISIONS.md`.

## 2. Build the root

Create the root Strategy/Tactic and success evidence.

Do not choose a tactic when a material decision is still unknown; expose the question instead.

## 3. Decompose

For a parent tactic ask:

> How exactly must this be performed?

For each proposed child:
1. define its Strategy;
2. define its Tactic;
3. explain why the child is independently necessary;
4. validate that its tactic can achieve its strategy.

For the whole sibling group ask:

> If every child succeeds, what required condition could still be missing?

Do not choose the number of children in advance.

## 4. Continue until implementation-ready leaves

A leaf is ready when an executor would not need another material design/product decision.

The leaf should provide enough information to derive:
- responsibility;
- scope;
- relevant constraints;
- dependencies;
- success/acceptance evidence.

Do not decompose into trivial implementation steps.

## 5. Review repeatedly

While building:
- Strategy/Tactic validity;
- necessity;
- sufficiency;
- assumption honesty;
- KISS;
- tree consistency.

Correct defects immediately.

Branch approval means the branch logic is sound; it does **not** permit implementation before the overall plan is frozen.

## 6. Final whole-plan review

When the intended tree appears complete, review it as one system.

Planning is complete only if:
- intended scope is fully represented;
- every required branch is sufficiently decomposed;
- material decisions are resolved;
- leaves are implementation-ready;
- cross-branch dependencies needed for execution are understood;
- no important gap appears when the entire tree is considered together;
- KISS review passes.

Record the result in `REVIEWS.md`.

## 7. Freeze

If Final Planning Review passes:
- set `STATUS.yaml -> plan_state: frozen`;
- stop changing the baseline except for a documented later planning correction.

## 8. Handoff to execution

Create GitHub Issues/tasks from executable leaves.

Every task keeps its S&T node ID and enough context for execution.

The planning framework does not become an execution engine.
