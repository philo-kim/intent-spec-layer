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
- [ ] Decision gap: product authority is missing; implementation should wait.

## Status

Use `unverified` until code, tests, design evidence, or runtime behavior has
been checked.

| Field | Value | Notes |
|---|---|---|
| Spec status | needs_spec / needs_refinement / accepted / rejected / closed |  |
| Implementation status | unverified / missing / partial / implemented / not_applicable |  |
| Verification status | not_mapped / mapped / tested / manual_only / blocked |  |

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
- Owner:
- Target lifecycle state:

## Verification

- [ ] `npm run req:test:generate`
- [ ] Generated stubs are not counted as completed verification.
- [ ] Real test, guardrail, smoke check, or manual UX evidence references the
      relevant `@Spec(...)` ID.
