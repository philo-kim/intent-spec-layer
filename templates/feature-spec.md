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

## Feature Archetype Packs

Choose every pack that applies. These prompts are a spec-authoring guardrail:
they help AI agents and reviewers find common-sense failures before the code
turns them into user experience defects.

| Pack | Applies? | Required review prompts | Resulting requirement / contract |
|---|---|---|---|
| Async customer operation | yes / no | Can it outlive the generic API timeout? What pending, retry, refresh, and still-processing states exist? | REQ-XXX-### / L3 |
| Source or file ingestion | yes / no | Are upload completion and analysis readiness separate? Is source input preserved after parse/OCR/extraction failure? | REQ-XXX-### / L3 |
| External AI or automation | yes / no | What happens on schema failure, partial output, low confidence, timeout, or usable draft fallback? | REQ-XXX-### / L3 |
| Approval or decision | yes / no | What happens on duplicate submit, stale state, wrong actor, or already-decided object? | REQ-XXX-### / L3 |
| Payment, entitlement, or billing | yes / no | How are idempotency, double charge, provider success with local failure, and reconciliation handled? | REQ-XXX-### / L3 |
| Auth or account | yes / no | How are replay, state mismatch, backend sync failure, and partial session prevented? | REQ-XXX-### / L3 |
| Deletion or privacy | yes / no | How are authorization, retention, partial cleanup, audit, and idempotency handled? | REQ-XXX-### / L3 |
| External integration | yes / no | What provider timeout, retry policy, local persistence failure, and reconciliation path exist? | REQ-XXX-### / L3 |

### Latency / Processing Contract

Customer-visible work must choose one processing shape before implementation.
Do not let a generic API timeout define the user experience.

| Operation | Shape | Expected window | User-visible pending state | Retry / re-entry path | Requirement |
|---|---|---:|---|---|---|
|  | synchronous / long request / polling / background job / streaming |  |  |  | REQ-XXX-### |

### Valid Input Failure Rule

If the user provides valid input and automation fails, the system must preserve
the input and return one of: recoverable draft, still-processing state, retry
path, or actionable error. It must not collapse into an empty manual-only
fallback.

| Valid input | Automation that can fail | Preserved data | Recovery result | Requirement |
|---|---|---|---|---|
|  | extract / analyze / generate / classify / quote / upload / parse |  | draft / still-processing / retry / actionable error | REQ-XXX-### |

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
| duplicate submit / stale state / permission / timeout / valid input failure / empty manual fallback / rollback / cancellation / expiry / retry | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | accept / reject / decide later | REQ-XXX-### |

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

For AI agents implementing this feature: treat every touched row as work to
close. Add or update the mapped test, guardrail, smoke check, or manual evidence
record in the same change as the implementation. A generated stub or unmapped
row means implementation is not complete.

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-XXX-001 or REQ-XXX-001:S1 | generated stub / unit / integration / guardrail / smoke / manual UX | test path, guardrail name, smoke command, or manual review artifact | command/result, reviewer/date, or block reason | generated_stub / mapped / traced / verified / manual_only / blocked |

Generated stubs are placeholders. Do not mark a requirement verified until a
real test, guardrail, smoke check, or manual UX review records evidence.

Use `mapped` when the evidence target is named but not yet executed. Use
`traced` when a non-generated `@Spec(...)` reference exists but the command or
review result is not recorded. Use `verified` only when execution or manual
evidence satisfies the statement.

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
