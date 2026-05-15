# Spec Review Finding

## Summary

-

## Classification

Choose one:

- [ ] Spec gap: code or design has reasonable behavior that the spec does not
      explain.
- [ ] Code gap: the spec promise is clear but implementation does not satisfy
      it.
- [ ] Both gap: neither spec nor implementation handles a real user journey,
      state, or failure.
- [ ] Edge-case gap: review found a likely duplicate, stale-state, permission,
      timeout, rollback, recovery, or failure case that needs authority before
      it becomes binding.
- [ ] Decision gap: product authority is missing; implementation should wait.

## Status

Use `unverified` until code, tests, design evidence, or runtime behavior has
been checked.

| Field | Value | Notes |
|---|---|---|
| Spec status | needs_spec / needs_refinement / accepted / rejected / closed |  |
| Authority status | proposal / adopted / active / stale / unknown |  |
| Authority basis | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import |  |
| Target release | current / next / later / unscheduled |  |
| Release impact | blocker / non_blocker / proposal_only / not_applicable / unknown | Do not mark blocker until code evidence and release scope are known. |
| Implementation status | unverified / missing / partial / implemented / not_applicable |  |
| Verification status | not_mapped / mapped / traced / verified / manual_only / blocked |  |

## Evidence

| Source | Evidence |
|---|---|
| Spec |  |
| Code / test / design |  |
| User-visible journey |  |

## Requirement Impact

| Requirement or statement | Action |
|---|---|
| REQ-XXX-001 / REQ-XXX-001:S1 | add / modify / keep / remove |

## Resolution Plan

- Spec action:
- Code action:
- Verification action:
- Release action:
- Owner:
- Target lifecycle state:

## Verification

- [ ] `npm run req:test:generate`
- [ ] Generated stubs are not counted as completed verification.
- [ ] Real test, guardrail, smoke check, or manual UX evidence references the
      relevant `@Spec(...)` ID.
- [ ] Verification is marked `verified` only after the command ran or the manual
      review was recorded with reviewer, date, scope, and artifact.
