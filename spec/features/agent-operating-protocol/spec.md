---
id: SPEC-AGENT-PROTOCOL
title: Agent Operating Protocol
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.2
---

# Agent Operating Protocol Spec

## Scope

The agent-facing rules that keep coding agents from confusing intent,
implementation status, generated artifacts, traces, and executed evidence.

## Authority Sources

- `AGENTS.md`
- `guide/agent-operating-protocol.md`
- `templates/agent-task-brief.md`
- `scripts/check-agent-protocol.mjs`

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `authority` | Binding spec source for behavior | `spec/` |
| `evidence` | Implementation proof | tests, guardrails, smoke checks, manual records |
| `ledger` | Review and readiness trail | `spec/reviews/` |
| `generated` | Derived scaffold, not authority or proof | `generated/` |
| `product standard` | Accepted behavior the implementation must satisfy, even when code is not ready yet | `spec/` |
| `evidence gap` | Reviewed implementation or verification does not yet satisfy accepted spec | `guide/spec-as-product-standard.md` |

## Layer 2: Behavior Spec

- [REQ-AGENT-001][Ubiquitous] Agent-facing entrypoints shall state that
  generated stubs are trace slots and not validation evidence.
- [REQ-AGENT-002][Event-driven] When an agent implements accepted behavior, the
  agent protocol shall require the governing statement IDs and verification plan
  before or alongside code changes.
- [REQ-AGENT-003][Unwanted] If a review finding lacks authority, release scope,
  implementation evidence, or core-journey impact, then agent-facing guidance
  shall not classify it as a release blocker.
- [REQ-AGENT-004][Ubiquitous] Agent-facing guidance shall state that accepted
  specs are product standards, not implementation inventories.
- [REQ-AGENT-004][Unwanted] If reviewed implementation lacks accepted spec
  behavior, then agent-facing guidance shall keep the spec and classify an
  evidence gap instead of downgrading the requirement.
- [REQ-AGENT-004][Event-driven] When spec and code disagree, the agent protocol
  shall use the gap taxonomy: `missing_implementation`,
  `partial_implementation`, `missing_test`, `wrong_spec`, `wrong_code`, and
  `decision_gap`.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-AGENT-001:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-002:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-003:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S2 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S3 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
