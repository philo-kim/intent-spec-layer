# Agent Task Brief

Use this brief when handing work to an AI agent.

## Task

-

## Task Mode

Choose one:

- [ ] Spec authoring
- [ ] Implementation from accepted spec
- [ ] Reverse spec review
- [ ] Evidence mapping / test bridge
- [ ] Release audit
- [ ] Repository maintenance

## Authority

| Item | Source |
|---|---|
| Product decision |  |
| Platform / upstream contract |  |
| L0 value or invariant |  |
| L1 domain term or state |  |
| Proposal or sample import to re-authorize |  |

## Layer Impact

| Layer | Impact |
|---|---|
| L0 | none / update |
| L1 | none / update |
| L2 | none / update |
| L3 | none / update |

## Implementation Verification Obligation

Fill this before implementation. If a touched statement has no evidence path,
the implementation is not ready to be called complete.

| Requirement / statement | Current evidence state | Evidence to add or update | Owner / location |
|---|---|---|---|
| REQ-XXX-001:S1 | generated_stub / mapped / traced / verified / manual_only / blocked | unit / integration / API / UI / guardrail / smoke / manual UX |  |

## Edge-Case Prompt

For the target action, answer each before implementation:

| Case | Accepted spec behavior / candidate / not applicable |
|---|---|
| duplicate submit |  |
| stale state |  |
| wrong actor, ownership, or permission |  |
| external success + local failure |  |
| local success + downstream failure |  |
| pending too long |  |
| cancel / reject / retry / expire |  |
| user-visible next action |  |

## Release Impact

Do not mark `blocker` until all four are checked.

| Check | Result |
|---|---|
| Authoritative requirement | yes / no / unknown |
| In target release | yes / no / unknown |
| Implementation evidence missing or partial | yes / no / unknown |
| Required for core journey | yes / no / unknown |

Release impact: blocker / non_blocker / proposal_only / not_applicable / unknown

## Verification Plan

| Requirement / statement | Evidence type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-XXX-001:S1 | unit / integration / guardrail / smoke / manual UX |  | command/result, reviewer/date, or block reason | generated_stub / mapped / traced / verified / manual_only / blocked |

Generated stubs create work slots. A statement is not verified until the mapped
test, guardrail, smoke check, or named manual UX/runtime review has executed or
been recorded.

## Stop Conditions

Stop and ask for a decision when:

- authority is unknown;
- target release scope is unknown but release impact is requested;
- an edge case is plausible but has no authority basis;
- L3 is needed but rollback, idempotency, or partial failure behavior is not
  knowable.
