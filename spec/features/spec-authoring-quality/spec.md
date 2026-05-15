---
id: SPEC-AUTHORING-QUALITY
title: Spec Authoring Quality
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.1
---

# Spec Authoring Quality Spec

## Scope

How this repository teaches and checks spec-writing quality so AI agents do not
write only happy-path requirements.

## Authority Sources

- Layer 0: `spec/00_constitution.md`
- Guide: `guide/spec-authoring-quality.md`
- Templates: `templates/feature-spec.md`, `templates/spec-review-checklist.md`,
  `templates/agent-task-brief.md`
- Agent rules: `AGENTS.md`

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `feature archetype pack` | A reusable prompt set for predictable failure surfaces by feature type | `guide/spec-authoring-quality.md` |
| `valid input failure` | Automation failure after the system has received user input that is valid enough to process | `guide/spec-authoring-quality.md` |
| `latency contract` | The declared processing shape for customer-visible work that may outlive a generic timeout | `guide/spec-authoring-quality.md` |
| `under-decomposition` | A spec smell where REQ and statement counts match because state and recovery behavior were not decomposed | `guide/spec-authoring-quality.md` |

## Layer 2: Behavior Spec

- [REQ-AUTHOR-001][Ubiquitous] Agent-facing guides and templates shall require
  feature archetype packs before implementation so predictable edge cases are
  considered by feature type.
- [REQ-AUTHOR-002][Unwanted] If a feature accepts valid user input and an
  automation step can fail, then the authoring guidance shall require input
  preservation and a recoverable draft, still-processing state, retry path, or
  actionable error instead of an empty manual-only fallback.
- [REQ-AUTHOR-003][Unwanted] If customer-visible processing can outlive the
  generic API timeout, then the authoring guidance shall require a latency
  contract: synchronous, endpoint-specific long request, polling, background
  job, or streaming.
- [REQ-AUTHOR-004][Unwanted] If every requirement in a meaningful
  customer-facing feature has exactly one behavior statement, then the tooling
  or checklist shall flag under-decomposition review rather than treating equal
  REQ/EARS counts as automatically healthy.
- [REQ-AUTHOR-005][Event-driven] When repository authoring rules change, the
  check suite shall verify that the README, guide, templates, and agent-facing
  entrypoints keep those rules visible.

## Experience Review

### Happy Path

1. A human or AI starts a feature spec.
2. The feature template asks which archetype packs apply.
3. The author writes happy-path, state, and unwanted behavior from the packs.
4. Async work gets a latency contract.
5. Automation failure after valid input gets explicit recovery.
6. Verification rows point to real evidence obligations.

### Unwanted / Recovery Paths

| Situation | Result | Next action | Requirement |
|---|---|---|---|
| A spec names only the happy path | Checklist and guide force archetype review | Add missing state/unwanted/L3 behavior | REQ-AUTHOR-001 |
| Automation fails after valid input | Guidance requires input preservation and recovery | Add draft/still-processing/retry/actionable error requirement | REQ-AUTHOR-002 |
| Normal processing exceeds generic timeout | Guidance requires a latency contract | Add long request, polling, background, or streaming behavior | REQ-AUTHOR-003 |
| REQ count equals EARS count everywhere | Checklist flags under-decomposition review | Split behavior into statement-level state and unwanted paths where needed | REQ-AUTHOR-004 |

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-AUTHOR-001:S1 | guardrail | `scripts/check-spec-authoring.mjs` | `npm run check:authoring` | verified |
| REQ-AUTHOR-002:S1 | guardrail | `scripts/check-spec-authoring.mjs` | `npm run check:authoring` | verified |
| REQ-AUTHOR-003:S1 | guardrail | `scripts/check-spec-authoring.mjs` | `npm run check:authoring` | verified |
| REQ-AUTHOR-004:S1 | guardrail | `scripts/check-spec-authoring.mjs` | `npm run check:authoring` | verified |
| REQ-AUTHOR-005:S1 | guardrail | `scripts/check-spec-authoring.mjs` | `npm run check:authoring` | verified |
