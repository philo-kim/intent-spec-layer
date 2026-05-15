# Spec As Product Standard

ILS specs are product and system standards, not implementation inventories.

This distinction is the most important guardrail for AI coding agents:

```text
spec/ says what the product must satisfy.
evidence says whether the current implementation satisfies it.
ledger says what review found and what remains unresolved.
```

If an accepted spec and current code disagree, do not downgrade accepted specs
to match incomplete code. Keep the standard visible and classify the mismatch as
an implementation or evidence gap.

## Core Rule

A feature spec answers:

- what behavior has been accepted as the product or system standard;
- what authority makes it binding;
- what evidence would prove it.

A feature spec does not answer:

- whether the current backend endpoint is already built;
- whether a screen currently has the field;
- whether a test has already run;
- whether this week release audit calls it ready.

Those belong in Verification Maps, review ledgers, release trackers, CI output,
manual evidence records, or issue trackers.

## The Do-Not-Downgrade Rule

When implementation is missing:

```text
wrong: "The code does not do this, so remove or weaken the requirement."
right: "The requirement is still the accepted standard; record a gap and fix code/evidence."
```

Only change the spec when the product standard itself is wrong, unauthoritative,
out of scope, stale, or contradicted by a stronger L0/L1/platform authority.

## Standard Vs Evidence

| Question | Belongs in | Example |
|---|---|---|
| What should happen when a valid document extraction fails? | L2/L3 spec | Preserve input and return draft, retry, still-processing, or actionable error. |
| Does the current app preserve input today? | evidence / ledger | `implementation_status=missing` after code review. |
| Should this behavior ship in the current release? | release tracker / ledger | `release_impact=blocker` only after authority, scope, evidence, and core journey are checked. |
| Is the behavior no longer desired? | spec change proposal | Remove or modify the REQ after authority review. |

## Gap Taxonomy

Use these labels when spec and implementation differ. They make the agent decide
whether to update the standard, implementation, evidence, or product decision.

| Gap | Meaning | Spec action | Evidence / code action |
|---|---|---|---|
| `missing_implementation` | Accepted spec exists; reviewed code has no implementation. | Keep the spec. | Implement behavior and add evidence. |
| `partial_implementation` | Accepted spec exists; code covers only part of the required behavior. | Keep or clarify the spec. | Complete missing branches and evidence. |
| `missing_edge_case` | A common-sense state, failure, duplicate, permission, timeout, recovery, or rollback case is absent. | Add L2/L3 after authority basis is confirmed. | Implement and verify after acceptance. |
| `missing_test` | Code appears to implement behavior but no executed evidence proves it. | Keep the spec. | Add or run mapped evidence. |
| `wrong_spec` | Spec lacks authority, imports a sample blindly, or conflicts with stronger authority. | Modify, demote, or remove the spec. | Do not force code to follow it until resolved. |
| `wrong_code` | Authoritative spec is in scope and reviewed code contradicts it. | Keep the spec. | Fix code and tests. |
| `decision_gap` | Correct behavior is not knowable from current authority. | Record the decision needed. | Wait or implement only reversible scaffolding. |

## Agent Algorithm

When applying ILS to a real repository:

1. Read the relevant L0/L1/L2/L3 specs before code.
2. Treat accepted specs as the product standard.
3. Review implementation and evidence separately.
4. If code lacks accepted behavior, classify `missing_implementation`,
   `partial_implementation`, `missing_test`, or `wrong_code`.
5. If the spec lacks authority or contradicts stronger authority, classify
   `wrong_spec` or `decision_gap`.
6. Do not downgrade accepted specs during implementation review.
7. If the task includes implementation, fix code and add real evidence.

## Common-Sense Edge Cases

Common-sense edge cases are a strength of the method, but they still need
authority before they become binding requirements.

Start with candidate discovery:

```text
this approval flow has duplicate-submit and stale-state risk
  -> candidate edge-case gap
  -> authority check against L0/L1/product/platform rules
  -> accepted L2/L3 requirement or rejected/non-goal
  -> implementation and verification
```

Once the edge case is accepted into L2/L3, implementation absence becomes an
implementation gap. Do not delete the edge case merely because code has not
caught up.

## Where To Record Status

| Status | Correct place |
|---|---|
| accepted behavior | `spec/` L1/L2/L3 |
| candidate finding | `spec/reviews/` or review ledger |
| implementation missing / partial / implemented | review ledger or evidence matrix |
| generated stub / mapped / traced / verified | Verification Map or generated report |
| blocker / non-blocker / proposal-only | release tracker or review ledger |

The spec remains readable as the desired customer, operator, and system
experience. The ledger carries the messy truth about current implementation
readiness.
