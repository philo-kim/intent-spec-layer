---
id: SPEC-BRIDGE
title: Spec-To-Test Bridge
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2, L3]
target_release: v0.2.0
---

# Spec-To-Test Bridge Spec

## Scope

Requirement extraction, statement ID assignment, generated stubs,
non-generated traces, and executed project evidence.

## Authority Sources

- Guide: `guide/spec-to-test-bridge.md`
- Generator: `scripts/generate-req-tests.mjs`
- Generated report: `generated/verification-report.md`

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `REQ-ID` | Stable behavior requirement identifier | Feature spec |
| `statement ID` | Statement-level ID such as `REQ-AREA-001:S1` | Generated from EARS statements |
| `generated_stub` | Executable skipped placeholder | `generated/requirements.test.mjs` |
| `non-generated trace` | `@Spec(...)` reference outside generated artifacts | Tests, guardrails, code, manual records |
| `executed evidence` | Command or record proving the referenced behavior | `npm run check`, smoke check, or manual record |

## Layer 2: Behavior Spec

- [REQ-BRIDGE-001][Event-driven] When `spec/**/*.md` or
  `examples/**/spec.md` contains an EARS requirement, the generator shall assign
  a statement ID and create a generated skipped test slot.
- [REQ-BRIDGE-002][Ubiquitous] The generated verification report shall separate
  generated-only pending statements from non-generated `@Spec(...)` references.
- [REQ-BRIDGE-003][Unwanted] If a non-generated `@Spec(...)` reference points to
  an unknown requirement or broad multi-statement requirement, then the
  requirement check shall fail.
- [REQ-BRIDGE-004][Event-driven] When a real project test verifies project
  behavior, the test shall reference the governing statement ID with
  `@Spec(...)`.

## Layer 3: Interface Contract

### Contract: `scripts/generate-req-tests.mjs` -> generated artifacts

Request:

- Markdown specs under `spec/`
- Example specs under `examples/**/spec.md`
- Non-generated trace files under project scripts, tests, and source roots

Response:

- `generated/requirements.json`
- `generated/requirements.test.mjs`
- `generated/verification-report.md`

Ordering:

1. Extract EARS statements.
2. Assign deterministic statement IDs.
3. Validate Verification Map coverage.
4. Validate non-generated trace references.
5. Write or compare generated artifacts.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-BRIDGE-001:S1 | guardrail | `npm run check:reqs` | `npm run check` | verified |
| REQ-BRIDGE-002:S1 | test | `tests/spec-bridge.test.mjs` | `npm run test:project` | verified |
| REQ-BRIDGE-003:S1 | guardrail | `npm run check:reqs` | `npm run check` | verified |
| REQ-BRIDGE-004:S1 | test | `tests/spec-bridge.test.mjs` | `npm run test:project` | verified |
