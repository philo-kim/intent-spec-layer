# Spec Review Ledger

Use this template when reviewing specs as a diagnostic artifact.

The ledger is not an authoritative spec. It records candidate gaps, separates
spec judgment from implementation evidence, and preserves the review trail until
accepted findings are moved into L1/L2/L3.

## Scope

- Review date:
- Review type: spec_only / spec_plus_code / incident_followup / design_migration
- Specs reviewed:
- Code reviewed: no / yes
- Runtime or screenshot evidence reviewed: no / yes

## Evidence Boundary

If this is a spec-only review, every finding starts as:

```text
implementation_status=unverified
verification_status=not_mapped
```

Do not use `missing`, `partial`, or `implemented` until code, tests, design
evidence, runtime behavior, or a named manual review has been checked.

## Findings

| Gap ID | Type | Spec evidence | User/operator/system risk | Spec action | Spec status | Implementation status | Verification status | Code-review target | Resolution |
|---|---|---|---|---|---|---|---|---|---|
| GAP-XXX-001 | intent_gap / experience_gap / contract_gap / verification_gap / method_gap |  |  |  | needs_refinement | unverified | not_mapped |  |  |

## Code Review Pass

Use this section after implementation evidence has been inspected.

| Gap ID | Evidence | Implementation status | Follow-up |
|---|---|---|---|
| GAP-XXX-001 | file:line / test / screenshot / manual note | missing / partial / implemented / not_applicable |  |

## Accepted Spec Changes

| Gap ID | Requirement impact | Verification impact |
|---|---|---|
| GAP-XXX-001 | add / modify / keep / remove `REQ-...` | generated stub / unit / integration / guardrail / smoke / manual UX |

