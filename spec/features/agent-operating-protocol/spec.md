---
id: SPEC-AGENT-PROTOCOL
title: Agent Operating Protocol
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.0
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

## Layer 2: Behavior Spec

- [REQ-AGENT-001][Ubiquitous] Agent-facing entrypoints shall state that
  generated stubs are trace slots and not validation evidence.
- [REQ-AGENT-002][Event-driven] When an agent implements accepted behavior, the
  agent protocol shall require the governing statement IDs and verification plan
  before or alongside code changes.
- [REQ-AGENT-003][Unwanted] If a review finding lacks authority, release scope,
  implementation evidence, or core-journey impact, then agent-facing guidance
  shall not classify it as a release blocker.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-AGENT-001:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-002:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
| REQ-AGENT-003:S1 | guardrail | `scripts/check-agent-protocol.mjs` | `npm run check:agent` | verified |
