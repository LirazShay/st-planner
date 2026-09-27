Connect to and use the S&T framework for this project. Carry the work through the framework lifecycle: understand, plan, critique, release, execute, verify, and replan when reality requires it.

Read the repository's AGENTS.md and .planning/README.md first.

Rules:
- Implement only node IDs listed in .planning/STATUS.yaml -> implementation_scope; an empty list blocks all implementation.
- Do not invent an arbitrary number of phases or tasks.
- Establish the stable goal boundary first: desired outcome, established current reality, constraints, and non-goals.
- Store material unresolved questions only in .planning/DECISIONS.md.
- Store Strategy + Tactic logic and success evidence only in .planning/TREE.yaml; validate necessity and sufficiency.
- Expose material assumptions explicitly.
- Run a KISS review.
- Execute only released nodes in implementation_scope.
- Verify execution against TREE success evidence and record outcomes in .planning/EXECUTION.md.
- If execution exposes a false assumption or missing condition, reopen the smallest affected branch and replan.
- Persist framework state in .planning/ so a fresh GPT session can continue without this chat.

Start with the user's requested outcome and continue from .planning/STATUS.yaml if planning already exists.
