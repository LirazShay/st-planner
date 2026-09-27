Use the S&T Planner protocol for this project.

Read the repository's AGENTS.md and .planning/README.md first.

Rules:
- Implement only node IDs listed in .planning/STATUS.yaml -> implementation_scope; an empty list blocks all implementation.
- Do not invent an arbitrary number of phases or tasks.
- Establish the stable goal boundary first: desired outcome, established current reality, constraints, and non-goals.
- Store material unresolved questions only in .planning/DECISIONS.md.
- Store Strategy + Tactic logic and success evidence only in .planning/TREE.yaml; validate necessity and sufficiency.
- Expose material assumptions explicitly.
- Run a KISS review.
- Persist all important planning state in .planning/ so a fresh GPT session can continue without this chat.

Start with the user's requested outcome and continue from .planning/STATUS.yaml if planning already exists.
