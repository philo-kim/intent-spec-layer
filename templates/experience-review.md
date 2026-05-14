# Experience Review

Use this template to review a feature spec before or after implementation.

## Feature

- Spec:
- Reviewer:
- Date:
- Review type: spec_only / spec_plus_code / runtime_review
- Target release or scope:

## Evidence Boundary

If this is a spec-only review, do not mark implementation as `missing`,
`partial`, or `implemented`. Start with:

```text
implementation_status=unverified
verification_status=not_mapped
release_impact=unknown
```

Move to implementation status only after code, tests, design evidence, runtime
behavior, or a named manual review has been checked.

## Spec-Only Journey Reconstruction

Describe the user journey using only the spec, not the code.

1.

## Journey Gaps Or Unclear Steps

| Gap | Why it matters | Authority basis | Classification | Spec action |
|---|---|---|---|---|
|  | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | spec gap / both gap / edge-case gap / decision gap |  |  |

## Failure And Recovery Review

| Failure or pending state | User-visible result | User next action | Requirement |
|---|---|---|---|
|  |  |  |  |

## Edge-Case Candidates

Use this section for common-sense cases discovered from the spec. Promote them
to L2/L3 only after their authority basis is clear.

| Candidate | Authority basis | Decision | Requirement impact |
|---|---|---|---|
| duplicate submit / stale state / permission / timeout / rollback / cancellation / retry | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | accept / reject / decide later | add / modify / none |

## Code Evidence Review

Use this section only after implementation evidence is inspected.

| Requirement | Code/test/runtime evidence | Implementation status | Verification status |
|---|---|---|---|
| REQ-... | file:line / test / screenshot / manual note | unverified / missing / partial / implemented / not_applicable | not_mapped / mapped / tested / manual_only / blocked |

## Release Impact

Do not mark `blocker` unless authority, target release, implementation evidence,
and core-journey impact are all known.

| Finding | Release impact | Reason |
|---|---|---|
| GAP-... | blocker / non_blocker / proposal_only / not_applicable / unknown |  |

## Decision

- [ ] Spec is sufficient; reviewed implementation evidence aligns.
- [ ] Spec needs updates before code review continues.
- [ ] Code needs updates to match the spec, based on inspected evidence.
- [ ] Both spec and code need updates.
- [ ] Decision authority is missing; implementation should wait.
