# Naming And Structure

## Naming Principle

The folder name must describe responsibility, not shape.

| Name | What it says | Decision |
|---|---|---|
| `docs/` | Explanation and history | Keep for narrative docs, research, snapshots |
| `layer/` | Structure only | Avoid; too abstract |
| `rules/` | Restrictions | Too narrow for domain and behavior |
| `contracts/` | Interface promises | Good for L3, too narrow for L0-L2 |
| `requirements/` | Requested features | Too PRD-like |
| `intent/` | Human/system intention | Good philosophy, weaker operational signal |
| `spec/` | Verifiable promise | Use as the root folder |

Final convention:

```text
folder name: spec/
concept name: Intent Specification Layer
internal model: L0 Constitution, L1 Domain, L2 Behavior, L3 Contracts
```

## Why Not `layer/`

`layer/` names the architecture shape, not the responsibility. It also conflicts
with UI, service, data, and deployment layers.

## Why Not Root `intent/`

`intent/` names the philosophy well, but it is weaker as an operational signal.
The repository needs a place that reads like an obligation: code must satisfy
this.

## Why `spec/`

`spec/` implies verifiable commitment. It naturally connects to tests, schemas,
contracts, and spec-driven tools while remaining tool-neutral.

## Choosing Global Vs Feature Structure

Choose global structure when one domain model governs most of the product.

Choose feature structure when different slices have different:

- authority sources;
- release cadence;
- failure modes;
- reviewers;
- generated artifacts;
- external contracts.
