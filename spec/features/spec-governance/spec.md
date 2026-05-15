---
id: SPEC-GOVERNANCE
title: Repository Spec Governance
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.0
---

# Repository Spec Governance Spec

## Scope

How this repository dogfoods the Intent Specification Layer method.

## Authority Sources

- Layer 0: `spec/00_constitution.md`
- Agent rules: `AGENTS.md`
- Guide: `guide/intent-specification-layer.md`

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `spec/` | Authoritative project behavior and change rules | This folder |
| `docs/` | Explanatory documentation and launch material | Markdown docs |
| `generated/` | Derived reports and generated requirement stubs | Generator output |
| `evidence` | Executed automated check or named manual record | Tests, guardrails, smoke checks, manual records |

## Layer 2: Behavior Spec

- [REQ-GOV-001][Ubiquitous] The repository shall keep project-governing
  behavior in `spec/` before using that behavior as an implementation or release
  rule.
- [REQ-GOV-002][Event-driven] When a project-governing behavior changes, the
  repository shall update the relevant feature spec and mapped verification in
  the same change.
- [REQ-GOV-003][Unwanted] If a generated artifact becomes stale after a spec
  change, then the repository check shall fail until the artifact is regenerated.

## Experience Review

### Happy Path

1. A maintainer decides to change project behavior.
2. The maintainer updates the governing spec first or in the same change.
3. The maintainer updates scripts, docs, generated artifacts, and evidence.
4. `npm run check` fails on stale artifacts or broken guardrails.

### Unwanted / Recovery Paths

| Situation | Result | Next action | Requirement |
|---|---|---|---|
| Behavior changes without spec update | Review blocks the change | Add or update the relevant spec | REQ-GOV-002 |
| Generated files drift | Local or CI check fails | Run requirement generation and commit outputs | REQ-GOV-003 |

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-GOV-001:S1 | guardrail | `tests/spec-governance.test.mjs` | `npm run test:project` | verified |
| REQ-GOV-002:S1 | guardrail | `tests/spec-governance.test.mjs` | `npm run test:project` | verified |
| REQ-GOV-003:S1 | guardrail | `npm run check:reqs` | `npm run check` | verified |
