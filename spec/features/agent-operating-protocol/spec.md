---
id: SPEC-AGENT-PROTOCOL
title: Agent Operating Protocol
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.3
---

# Agent Operating Protocol Spec

## Scope

The agent-facing rules that keep coding agents from confusing intent,
implementation status, generated artifacts, traces, and executed evidence.

## Authority Sources

- `AGENTS.md`
- `guide/agent-mode-router.md`
- `guide/agent-operating-protocol.md`
- `guide/method-update-propagation.md`
- `templates/agent-task-brief.md`
- `templates/method-update-propagation.md`
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
| `method update` | Applying a newer ILS version, upstream rule, template, or guardrail to an existing project | `guide/method-update-propagation.md` |
| `propagation audit` | Review that proves the new method rule reached in-scope authoritative feature specs | `guide/method-update-propagation.md` |
| `pending_spec_review` | Residual status for an authoritative spec not yet reviewed under the new method rule | `templates/method-update-propagation.md` |
| `task mode` | Named workflow selected before acting on an ambiguous request | `guide/agent-mode-router.md` |
| `completion rule` | Mode-specific condition that must be satisfied before claiming complete | `guide/agent-mode-router.md` |

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
- [REQ-AGENT-005][Event-driven] When applying a new ILS version, upstream rule,
  or template to an existing project, agent-facing guidance shall require both
  governance install and feature-spec propagation audit before reporting
  completion.
- [REQ-AGENT-005][Unwanted] If any in-scope authoritative spec was not reviewed
  under the new method rule, then the final status shall be `partial` and the
  unreviewed files shall be recorded as `pending_spec_review`.
- [REQ-AGENT-005][Ubiquitous] Method-update reports shall list the upstream
  rule/version, authoritative spec inventory, reviewed specs, excluded specs,
  residual gaps, generated artifact updates, and verification commands.
- [REQ-AGENT-006][Ubiquitous] Agent-facing guidance shall route broad or
  ambiguous user requests into a named task mode before acting.
- [REQ-AGENT-006][Event-driven] When a request asks to apply a latest ILS
  version, upstream rule, or new template, the agent shall select Method update
  mode and follow its propagation completion rule.
- [REQ-AGENT-006][Unwanted] If the selected mode's completion rule is not
  satisfied, then the agent shall report `partial`, `blocked`, `unverified`, or
  `manual_only` instead of claiming `complete`.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-AGENT-001:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-002:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-003:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S2 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-004:S3 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-005:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-005:S2 | test | `tests/method-update-propagation.test.mjs` | `npm run test:project` | verified |
| REQ-AGENT-005:S3 | test | `tests/method-update-propagation.test.mjs` | `npm run test:project` | verified |
| REQ-AGENT-006:S1 | test | `tests/agent-mode-router.test.mjs` | `npm run test:project` | verified |
| REQ-AGENT-006:S2 | test | `tests/agent-mode-router.test.mjs` | `npm run test:project` | verified |
| REQ-AGENT-006:S3 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
