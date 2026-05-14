---
id: SPEC-XXX
title: <Feature Name>
status: draft
owners: []
updated: YYYY-MM-DD
layers: [L1, L2]
---

# <Feature Name> Spec

## Scope

What user or system behavior this feature governs.

## Authority Sources

- Product authority:
- Platform authority:
- Generated or derived artifacts:
- Related `docs/` references:

## Layer 0 References

- `spec/00_constitution.md`:
- Shared registry or upstream contract:

## Layer 1: Domain Truth

### Entities

| Term | Code name | Meaning | Source of truth |
|---|---|---|---|
|  |  |  |  |

### States

| Entity | State | Meaning | Allowed transitions |
|---|---|---|---|
|  |  |  |  |

### Invariants

-

### Vocabulary Rules

- Use:
- Do not introduce aliases:

## Layer 2: Behavior Spec

- [REQ-XXX-001][Ubiquitous] The system shall ...
- [REQ-XXX-002][Event-driven] When ..., the system shall ...
- [REQ-XXX-003][State-driven] While ..., the system shall ...
- [REQ-XXX-004][Unwanted] If ..., then the system shall ...
- [REQ-XXX-005][Optional] Where ..., the system shall ...

## Experience Review

This section is not marketing copy. It is the reviewable journey implied by L1,
L2, and L3.

### Happy Path

1.

### Unwanted / Recovery Paths

| Situation | User-visible result | Next action | Requirement |
|---|---|---|---|
|  |  |  | REQ-XXX-004 |

### Open Experience Questions

-

## Layer 3: Interface Contract

Include this section only when cross-module ordering, retry, idempotency,
rollback, or partial failure behavior matters.

### Contract: `<caller>` -> `<callee>`

Purpose:

Request:

Response:

Auth:

Ordering:

Idempotency:

Partial failure:

Rollback/compensation:

## Verification Map

| Requirement | Verification |
|---|---|
| REQ-XXX-001 | generated test stub + implementation test / guardrail / smoke / manual |

## Drift Notes

- Spec remains unchanged when:
- Known follow-up specs or change proposals:
