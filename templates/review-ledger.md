# Spec Review Ledger

Use this template when reviewing specs as a diagnostic artifact.

The ledger is not an authoritative spec. It records candidate gaps, separates
spec judgment from implementation evidence, and preserves the review trail until
accepted findings are moved into L1/L2/L3.

## Scope

- Review date:
- Review type: spec_only / spec_plus_code / incident_followup / design_migration
- Specs reviewed:
- Target release or scope:
- Code reviewed: no / yes
- Runtime or screenshot evidence reviewed: no / yes

## Evidence Boundary

If this is a spec-only review, every finding starts as:

```text
implementation_status=unverified
verification_status=not_mapped
```

Do not use `missing`, `partial`, or `implemented` until code, tests, design
evidence, runtime behavior, or a named manual review has been checked. Do not
use `verified` until the mapped test, guardrail, smoke check, or manual review
has executed or been recorded.

Accepted specs are standards, not implementation snapshots. Do not downgrade
accepted specs to match incomplete code. If evidence shows implementation is
behind the standard, keep the requirement and classify the gap here.

## Gap Taxonomy

| Label | Use when | Spec action | Evidence / code action |
|---|---|---|---|
| `missing_implementation` | Accepted spec exists; reviewed code has no implementation. | keep | implement and verify |
| `partial_implementation` | Accepted spec exists; reviewed code covers only part. | keep or clarify | complete and verify |
| `missing_edge_case` | A plausible edge case needs authority before becoming binding. | add after acceptance | implement after acceptance |
| `missing_test` | Code appears to implement behavior but no executed proof exists. | keep | add or run evidence |
| `wrong_spec` | Spec lacks authority, is stale, or conflicts with stronger authority. | modify / demote / remove | do not force code until resolved |
| `wrong_code` | Authoritative spec is in scope and reviewed code contradicts it. | keep | fix code and tests |
| `decision_gap` | Correct behavior is not knowable from current authority. | record decision needed | wait or scaffold reversibly |

## Findings

| Gap ID | Type | Authority status | Authority basis | Target release | Release impact | Spec evidence | User/operator/system risk | Spec action | Spec status | Implementation status | Verification status | Code-review target | Resolution |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GAP-XXX-001 | intent_gap / experience_gap / contract_gap / edge_case_gap / verification_gap / method_gap / missing_implementation / partial_implementation / missing_test / wrong_spec / wrong_code / decision_gap | proposal / adopted / active / stale / unknown | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | current / next / later / unscheduled | blocker / non_blocker / proposal_only / not_applicable / unknown |  |  |  | needs_refinement | unverified | not_mapped |  |  |

Release impact must not be guessed from spec text alone. Mark `blocker` only
after authority, target release, implementation evidence, and core-journey
impact are all known.

## Edge-Case Candidates

Use this section when review finds a reasonable failure, stale-state, duplicate,
permission, timeout, rollback, or recovery case that is not yet authoritative.

| Candidate | Authority basis | Decision | Requirement impact |
|---|---|---|---|
|  | L0 / L1 invariant / product decision needed / common UX expectation / sample import | accept / reject / decide later | add / modify / none |

## Code Review Pass

Use this section after implementation evidence has been inspected.

| Gap ID | Evidence | Implementation status | Follow-up |
|---|---|---|---|
| GAP-XXX-001 | file:line / test / screenshot / manual note | missing / partial / implemented / not_applicable |  |

## Release Impact Pass

Use this section after code evidence and release scope have both been checked.

| Gap ID | Blocker decision | Reason |
|---|---|---|
| GAP-XXX-001 | blocker / non_blocker / proposal_only / not_applicable / unknown |  |

## Accepted Spec Changes

| Gap ID | Requirement impact | Verification impact |
|---|---|---|
| GAP-XXX-001 | add / modify / keep / remove `REQ-...` | generated stub / mapped / traced / verified / manual_only / blocked |
