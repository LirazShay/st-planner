# Compiling a Frozen S&T Plan into GitHub Issues

This step happens only after Final Planning Review passes and the complete intended S&T plan is frozen.

The goal is mechanical translation, not another planning phase.

## Core rule

An implementation-ready S&T leaf is the smallest planned unit of responsibility.

Default:

```
one implementation-ready leaf
→ one GitHub Issue
```

This preserves traceability and prevents execution chats from having to reconstruct which part of a large Issue came from which S&T objective.

## When leaves may be grouped

Several leaves may be compiled into one Issue only when **all** are true:

- they form one coherent implementation responsibility;
- the same executor/context is appropriate;
- their prerequisites are compatible;
- their acceptance evidence can be verified together;
- grouping does not hide independent failure or completion;
- every source S&T node ID remains listed explicitly.

Do not group merely to reduce the number of Issues.

## When a leaf may be split

Do **not** normally split one S&T leaf into multiple implementation Issues.

If a leaf must be split because it contains materially different responsibilities, design choices, independent prerequisites, or separately verifiable outcomes, that is evidence that the leaf was not implementation-ready.

Reopen planning and decompose that leaf before compiling Issues.

Mechanical subtasks/checklists inside one Issue are fine; they do not require new S&T nodes when they introduce no material planning decision.

## Deterministic Issue body

Every generated Issue must contain:

1. **S&T source** — exact node ID(s).
2. **Outcome / responsibility** — derived from the leaf Strategy.
3. **Planned approach** — derived from the leaf Tactic.
4. **Scope** — what this Issue owns.
5. **Relevant constraints / decisions** — only the context required to implement correctly; reference D-IDs rather than copying decision history.
6. **Prerequisites** — GitHub Issue references derived from leaf `depends_on`.
7. **Acceptance evidence** — derived from `success_evidence`.
8. **Out of scope** — only when ambiguity is likely.
9. **Planning-gap rule** — executor stops and reports if a material missing decision/contradiction is discovered.

Do not paste the whole TREE, all assumptions, or all planning history into every Issue.

## Suggested title

```
[S&T <node-id>] <short outcome>
```

Example:

```
[S&T 2.3.1] Persist accepted customer import records atomically
```

For a grouped Issue:

```
[S&T 2.3.1 + 2.3.2] <shared responsibility>
```

## Two-pass creation for dependencies

GitHub Issue numbers do not exist before Issues are created.

Therefore compile in two passes:

### Pass 1 — create

- create every Issue from its source leaf/leaves;
- include S&T node IDs;
- omit unresolved Issue-number dependency links temporarily;
- build an in-memory node-ID → Issue-number mapping during the compilation operation.

### Pass 2 — link

- translate every leaf `depends_on` node ID to the generated prerequisite Issue number;
- update the dependent Issue with the corresponding GitHub dependency/reference;
- if native Issue dependency support is unavailable, use an explicit body line such as `Blocked by #123`.

Do not persist another node→Issue mapping file solely for compilation. The Issue bodies and `CHAT-ASSIGNMENTS.yaml` already preserve the durable traceability needed after creation.

## Compilation validation

Before assigning Issues to chats, verify:

- every frozen implementation-ready leaf appears in exactly one generated Issue;
- no generated Issue references a non-frozen/non-leaf S&T node as executable work;
- grouped Issues obey the grouping rules;
- no leaf was silently split into unrelated Issues;
- every S&T `depends_on` relation became the correct Issue prerequisite;
- no dependency was lost or invented;
- every Issue has objective acceptance evidence;
- every Issue can be executed without a new material planning decision.

If compilation reveals that an Issue cannot be written without inventing missing design details, stop: the plan was not actually ready and must be reopened.

## What GitHub owns after compilation

GitHub owns:

- Issue status;
- implementation discussion;
- PR linkage;
- execution history;
- Issue dependency completion.

S&T files remain the rationale and frozen planning baseline.

The compiler should not create a second execution database.
