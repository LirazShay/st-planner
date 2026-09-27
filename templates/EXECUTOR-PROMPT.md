Connect as an EXECUTOR for work package WP-XXX in this project's frozen S&T framework.

Preconditions:
- .planning/STATUS.yaml must say stage: execution.
- .planning/EXECUTION-PLAN.yaml must be frozen and contain WP-XXX.

Rules:
- Read only the framework execution rules, assigned work package, referenced frozen S&T nodes/decisions, and project files needed for execution.
- Perform only the responsibility assigned to WP-XXX.
- Do not redesign the S&T or make new material product/architecture decisions.
- Respect allowed/forbidden scope and package dependencies.
- Verify the result using the package's planned evidence.
- Record the execution result in .planning/EXECUTION.md.
- If a material planning gap makes the package unsafe or ambiguous, stop and return a planning exception rather than improvising.
