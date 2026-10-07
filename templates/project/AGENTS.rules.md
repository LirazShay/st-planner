<!-- st-planner:rules:v3:begin -->
# S&T Planner Rules

## Mandatory freshness gate

Before any S&T planning request or numbered executor bootstrap, run:

```text
node .planning/check-framework-update.mjs
```

Interpret the result literally:

- exit `0` + current — continue;
- exit `0` + recommended update — surface the update and continue unless an upgrade is chosen;
- exit `2` — a required framework upgrade exists; do not start new S&T planning/execution until it is installed and the checker reports current;
- exit `3` — the installed freshness path itself drifted or is damaged; repair/upgrade it before S&T work;
- freshness unavailable because the network/source cannot be reached — say that freshness is unverified and continue only from the installed framework without claiming it is current.

Framework upgrades may refresh framework-owned instructions/tooling only. They must never overwrite `.planning/GOAL.md`, `.planning/TREE.yaml`, `.planning/DECISIONS.md`, `.planning/REVIEWS.md`, `.planning/STATUS.yaml`, or `.planning/EXECUTION.yaml`.

## Planning trigger

A request such as `תתכנן לי עם S&T Planner לפי הריפו: ...`, `ST Planner`, or an equivalent natural-language request is sufficient. The user does not need to restate the framework procedure.

After the freshness gate, follow the installed framework contract in this order:

```text
project-native AGENTS/routing rules
→ .planning/README.md
→ .planning/FRAMEWORK.md
→ .planning/STATUS.yaml
→ current-cycle S&T state/evidence as routed
```

Use the complete S&T method described there: outcome before solution, deep justified Strategy/Tactic reasoning, necessity/sufficiency, implementation-ready leaves, final review, freeze/no-drift, allocation validation, handoff verification, and explicit implementation authorization. Do not implement target-project work while planning.

## Executor trigger

A numbered executor starts only from an explicit request such as `אני צאט N תתחיל` / `I am chat N`. Allocation, target current pointers, `NEXT_CHAT_PROMPT`, or generic `continue` never activate another Chat N implicitly.

After the freshness gate, follow `.planning/EXECUTOR_HANDOFF.md`, `.planning/CI-RCA-POLICY.md`, `.planning/EXECUTION.yaml`, TREE dependencies, and only the explicitly assigned/routed project context. `.planning/EXECUTION.yaml` is execution-state authority; target-owned current chat/node pointers are projections only.

## CI warning/error gate

Every CI warning or error pauses progression until the RCA in `.planning/CI-RCA-POLICY.md` is closed. A local symptom fix or a green rerun alone is not closure. Establish root cause, why prevention/detection failed, reusable recurrence prevention, materially analogous areas that may share the weakness, and closing evidence before continuing.

## Update-safe ownership

This whole block is framework-owned and is bounded by the `st-planner:rules:v3:begin/end` markers. Target-project instructions belong outside the markers and must be preserved byte-for-byte by framework upgrades.
<!-- st-planner:rules:v3:end -->
