# Change Proposal: <short-name>

Date: YYYY-MM-DD
Status: draft
Target release: current / next / later / unscheduled

## Problem

What changed, broke, or became newly understood?

## Authority

| Source | Evidence |
|---|---|
| L0 value or invariant |  |
| L1 domain term, state, or ownership |  |
| Product decision |  |
| Platform / upstream contract |  |
| Sample or previous-project import to re-authorize |  |

## Proposed Spec Changes

### Added

-

### Modified

-

### Removed

-

## Affected Requirements

- REQ-...

## Affected Contracts

-

## Feature Archetype Packs

| Pack | Applies? | Spec impact |
|---|---|---|
| Async customer operation | yes / no |  |
| Source or file ingestion | yes / no |  |
| External AI or automation | yes / no |  |
| Approval or decision | yes / no |  |
| Payment, entitlement, or billing | yes / no |  |
| Auth or account | yes / no |  |
| Deletion or privacy | yes / no |  |
| External integration | yes / no |  |

## Latency And Valid Input Failure

| Question | Decision |
|---|---|
| Can normal processing outlive the generic API timeout? | no / long request / polling / background job / streaming |
| If valid user input is received and automation fails, what is preserved? |  |
| What recovery result is required? | draft / still-processing / retry / actionable error / not applicable |
| Is any empty manual-only fallback allowed? | no / yes, with product authority |

## Edge-Case Discovery

| Candidate edge case | Authority basis | Decision | Requirement impact |
|---|---|---|---|
| duplicate submit / stale state / permission / timeout / valid input failure / empty manual fallback / rollback / cancellation / retry / recovery | L0 / L1 invariant / product decision / platform rule / common UX expectation / sample import | accept / reject / decide later | add / modify / none |

## Verification

| Requirement / statement | Evidence type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-XXX-001:S1 | generated stub / unit / integration / guardrail / smoke / manual UX |  | command/result, reviewer/date, or block reason | generated_stub / mapped / traced / verified / manual_only / blocked |

Generated stubs create trace slots. They are not behavior verification.

## Release Impact

Do not mark `blocker` until authority, target release scope, implementation
evidence, and core-journey impact are all checked.

| Finding or requirement | Release impact | Reason |
|---|---|---|
| REQ-XXX-001 | blocker / non_blocker / proposal_only / not_applicable / unknown |  |

## Rollout

-
