# Goal

## Desired outcome

Users can import supported customer CSV files into the existing backend service safely and predictably.

## Current reality

- The backend service already exists.
- Customer records can already be created through existing application logic.
- There is no CSV import flow yet.
- Authentication and authorization are existing system responsibilities and are outside this change.

## Success evidence

- A supported CSV file with valid rows produces the expected customer records.
- Structurally invalid or unsafe input does not create customer records.
- The user receives a deterministic import result showing accepted and rejected rows.
- The same documented input rules produce the same interpretation across runs.

## Constraints

- Reuse existing customer creation rules where possible.
- Do not introduce a new persistence system.
- The import must not bypass existing domain validation.

## Non-goals

- Spreadsheet formats other than CSV.
- Background job infrastructure.
- Bulk-import analytics.
- UI design.

## Material unknowns

- Final maximum file size.
- Final duplicate-customer policy.
