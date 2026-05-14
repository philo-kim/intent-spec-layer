---
id: SPEC-XXX
title: <Feature Name>
status: draft
owners: []
updated: YYYY-MM-DD
layers: [L1, L2]
target_release: unscheduled
---

# <Feature Name> Spec

## Scope

What user or system behavior this feature governs.

## Authority And Release Scope

- Authority lifecycle:
  - `draft` / `review`: not authoritative yet.
  - `adopted`: accepted behavior; implementation may still be pending.
  - `active` / `stable`: governs target implementation.
- Target release:
- Out of scope:

This section records product and system intent. Do not record implementation
readiness here. Use the Verification Map, evidence records, or `spec/reviews/`
for `missing`, `partial`, `implemented`, or `blocked` status.

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

### Edge-Case Discovery

Use this before implementation and during reverse review. Promote a candidate
into L2/L3 only after its authority basis is clear.

| Candidate edge case | Authority basis | Decision | Requirement |
|---|---|---|---|
| duplicate submit / stale state / permission / timeout / rollback / cancellation / expiry / retry | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | accept / reject / decide later | REQ-XXX-### |

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

| Requirement / statement | Verification type | Evidence | Status |
|---|---|---|---|
| REQ-XXX-001 or REQ-XXX-001:S1 | generated stub / unit / integration / guardrail / smoke / manual UX |  | pending |

Generated stubs are placeholders. Do not mark a requirement verified until a
real test, guardrail, smoke check, or manual UX review records evidence.

## Drift Notes

- Spec remains unchanged when:
- Known follow-up specs or change proposals:

## Review Findings

Use this section only for small unresolved findings. Use `spec/reviews/` and
the review ledger template for multi-finding audits or implementation-readiness
work. Accepted behavior must move into L1/L2/L3; implementation status must
stay in evidence or review artifacts.

| Finding | Class | Authority basis | Spec status | Implementation status | Verification status | Resolution |
|---|---|---|---|---|---|---|
| GAP-XXX-001 | spec gap / code gap / both gap / edge-case gap / decision gap | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | needs_refinement | unverified | not_mapped |  |
