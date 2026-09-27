# Goal

## Desired outcome

Given a runtime text file containing one item per line, produce a canonical output containing the same logical items exactly once, sorted ascending.

## Current reality

- Runtime input will be supplied only when execution begins.
- Each non-empty input line represents one logical item.
- The output is a plain-text file with one item per line.

## Constraints

- Preserve the exact text of each logical item.
- Do not introduce an application, database, or external service for this test.

## Non-goals

- Locale-aware sorting.
- Case normalization.
- Whitespace normalization beyond rejecting empty lines.
