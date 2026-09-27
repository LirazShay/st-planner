# Goal

## Desired outcome

Users can import supported customer CSV files into the existing backend service safely and predictably.

## Current reality

- The backend service already exists.
- Customer records can already be created through existing application logic.
- There is no CSV import flow yet.
- Authentication and authorization are existing system responsibilities and are outside this change.

## Constraints

- Reuse existing customer creation rules where possible.
- Do not introduce a new persistence system.
- The import must not bypass existing domain validation.

## Non-goals

- Spreadsheet formats other than CSV.
- Background job infrastructure.
- Bulk-import analytics.
- UI design.
