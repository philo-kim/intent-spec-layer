# Spec Review Loop

The Intent Specification Layer is not only a pre-implementation input. It is
also a review surface for discovering product, UX, and code defects.

The practical test:

> A reviewer should be able to understand the intended user journey and system
> promises from the spec before reading implementation code.

If the reviewer cannot answer what the user sees, what the system does, what can
go wrong, and how recovery works, then the spec is incomplete. If the spec is
complete but the code does not match it, the code is incomplete.

## The Two Directions

### Forward Direction: Intent To Code

```text
L0/L1/L2/L3 -> plan -> implementation -> verification
```

Use this direction when building new behavior. The spec prevents the AI or
developer from inventing authority, terms, edge cases, and rollback rules.

### Reverse Direction: Spec To Defect Discovery

```text
spec review -> candidate gap -> implementation review -> update spec/code -> verify
```

Use this direction when the product feels wrong, a flow is confusing, or a bug
suggests the implementation was technically valid but experientially incomplete.

## Spec-Only Review Is Not Code Evidence

The reverse loop has a strict evidence boundary:

```text
spec-only review can find candidate gaps
code review can classify implementation status
```

Do not write "not implemented" from a spec-only review. The correct initial
status is `implementation_status=unverified`. Only after reading code, tests,
screenshots, or runtime evidence should a finding move to `missing`, `partial`,
`implemented`, or `not_applicable`.

This matters because reverse review can discover three different things:

- the spec is too vague and needs refinement;
- the spec contains a promise that has no real product authority;
- the code is missing behavior that the spec already promises;
- the spec and code are both missing a real user journey, state, or recovery
  path.

Keeping status separate prevents a review artifact from becoming a premature
accusation against the implementation.

## Authoritative Specs Can Include Future Work

The evidence boundary does not mean that unimplemented behavior should be
removed from the spec. The opposite is usually true:

> If the product or system decision has been accepted, the intended behavior
> belongs in L1/L2/L3 even before code exists.

What must stay out of normative L1/L2/L3 text is implementation readiness:
`missing`, `partial`, `ready`, `implemented`, test status, backend readiness,
and release-audit commentary. Put those in `spec/reviews/`, an evidence matrix,
or a release tracker.

When spec and code disagree, decide in this order:

1. Is this requirement authoritative, or only a proposal, sample, or stale
   imported idea?
2. Is it in the release scope being reviewed?
3. Has implementation evidence actually been inspected?
4. Is the mismatch a spec gap, code gap, both gap, or decision gap?

Do not weaken an accepted future spec just to match current code. Do not label a
current code path wrong until the spec's authority has been checked.

## Release Blocker Decision

A finding is a release blocker only when all of these are true:

- the requirement is authoritative;
- the requirement is in the target release scope;
- the reviewed implementation evidence is `missing` or `partial`;
- the behavior is required for the release's core user, operator, or system
  journey.

If any condition is false, keep the finding in the ledger with the appropriate
status instead of calling it a blocker.

## Edge-Case Discovery Without Overclaiming

One of the best uses of the spec layer is finding obvious edge cases that nobody
wrote down yet. EARS `[Unwanted]` review should actively ask:

- What happens on duplicate submit?
- What happens after stale state or a refresh?
- What happens when the actor lacks ownership or permission?
- What happens when an external service succeeds but local persistence fails?
- What happens when an async operation stays pending too long?
- What happens when normal processing can exceed the generic API timeout?
- What happens when the user supplied valid input but extraction, analysis,
  generation, classification, or another automation step fails?
- Does any valid input failure collapse into an empty manual-only fallback?
- What does the user see next after rejection, cancellation, expiry, or retry?

These are valuable findings, but they are not automatically code gaps. Treat
them as candidate edge-case gaps until their authority is clear.

Use this sequence:

```text
common-sense edge case
  -> candidate finding in ledger
  -> authority check against L0/L1/product/platform rules
  -> accepted L2/L3 requirement or rejected/non-goal
  -> implementation review
  -> verification evidence
```

Authority basis matters:

| Basis | How to handle |
|---|---|
| Derived from L0 value, L1 invariant, security, privacy, money, deletion, ownership, or data integrity | Usually promote directly into L2/L3 as accepted behavior. |
| Expected by ordinary user experience but not stated by product authority | Record as an edge-case candidate, then accept or reject explicitly. |
| Pure implementation preference | Keep out of product spec unless it affects a user, operator, contract, or failure mode. |
| Spec imported from a sample or previous project | Re-authorize before treating it as binding. |

This keeps the strength of reverse review without letting "common sense" become
unreviewed AI invention.

## Archetype-Based Review

Spec review should not rely on memory. Use the feature archetype packs from
[Spec authoring quality](spec-authoring-quality.md) as a forcing function.

| Pack | What the reviewer must be able to answer from the spec |
|---|---|
| Async customer operation | timeout budget, pending state, retry, refresh/re-entry, still-processing result |
| Source or file ingestion | upload completion vs analysis readiness, parse/OCR failure, input preservation |
| External AI or automation | partial output, schema failure, low confidence, valid input failure, usable draft |
| Approval or decision | duplicate submit, stale state, actor authority, already-decided object |
| Payment, entitlement, or billing | idempotency, double charge, provider/local reconciliation |
| Auth or account | callback replay, state mismatch, backend sync failure, partial session prevention |
| Deletion or privacy | authorization, retention, partial cleanup, audit, idempotency |
| External integration | provider timeout, retry policy, local persistence failure, reconciliation |

When a pack applies and the answer is not visible, classify the finding as a
candidate spec gap. Promote it to authoritative L2/L3 only after the authority
basis is clear.

## Latency Contract Review

Customer-visible processing should not inherit a generic timeout by accident.
For every async or automation-heavy flow, identify which contract the spec
declares:

- synchronous;
- endpoint-specific long request;
- polling;
- background job;
- streaming.

If none is declared, the likely implementation failure is a false timeout that
turns normal processing into a generic error or manual fallback.

## Valid Input Failure Review

When valid input has been accepted, automation failure is not the same as user
failure. The reviewer should verify that the spec preserves the input and
requires one of:

- recoverable draft;
- still-processing state;
- retry path;
- actionable error detail.

If the only visible outcome is an empty manual-only fallback, the spec is
missing a recovery requirement.

## What The Spec Must Let Reviewers See

A feature spec should make these visible without requiring a full code read:

- who the user is;
- what state the user starts in;
- what action the user takes;
- what the user sees next;
- what background systems are involved;
- what can fail;
- what the user can do after failure;
- what data, permission, payment, or entitlement state changes;
- what must not happen;
- how the system proves or verifies completion.

This is not a separate UX document. It is the UX-facing interpretation of L1,
L2, and L3.

## Review Questions

Ask these questions while reading only the spec:

1. Can I reconstruct the happy-path journey?
2. Can I reconstruct each unwanted-path journey?
3. Does every error state give the user a next action?
4. Does every async or external step explain pending, success, and failure?
5. Are authority and ownership visible?
6. Are state transitions visible?
7. Are user-visible messages or outcomes implied by requirements, not guessed?
8. Is there any step where the code could pass tests but the user would still be
   confused?
9. If the implementation already exists, can I map each requirement to code or
   tests?
10. If I cannot map it, is the missing piece a spec gap, a code gap, or both?

## Outcomes

Every spec review finding should be classified before it is fixed:

| Finding class | Meaning | Action |
|---|---|---|
| Spec gap | The implementation or product authority has reasonable behavior, but the spec does not explain it; or the spec imported a promise with no authority. | Update L1/L2/L3, then add or update verification. |
| Code gap | The spec promise is authoritative, in reviewed release scope, and implementation evidence does not satisfy it. | Fix code and tests without weakening the spec. |
| Both gap | The reviewer found a user journey, state, or failure that neither spec nor code handles. | Write the missing spec, implement it, then verify. |
| Decision gap | The correct behavior is not knowable from current product authority. | Record the question and decide before implementation. |

Use [the finding template](../templates/spec-review-finding.md) for non-trivial
reviews.

Then resolve the finding as one of:

| Finding | Action |
|---|---|
| Missing intended behavior | Add L2 requirement, then implement |
| Missing domain term or state | Add L1 definition, then align code names |
| Missing failure, retry, or rollback rule | Add L3 contract, then implement |
| Authoritative in-scope spec says behavior exists and reviewed code lacks it | Fix code and tests |
| Code has behavior that spec does not justify | Add spec or remove behavior |
| Spec is correct but unclear to reviewers | Rewrite the spec without changing code |

Use separate lifecycle fields for the finding:

| Field | Values | Meaning |
|---|---|---|
| `spec_status` | `needs_spec`, `needs_refinement`, `accepted`, `rejected`, `closed` | Whether the authoritative spec needs work |
| `implementation_status` | `unverified`, `missing`, `partial`, `implemented`, `not_applicable` | What code review found |
| `verification_status` | `not_mapped`, `mapped`, `tested`, `manual_only`, `blocked` | Whether the final behavior has evidence |

Recommended initial state for a spec-only audit:

```text
spec_status=needs_refinement
implementation_status=unverified
verification_status=not_mapped
```

When a finding adds or changes a REQ-ID, regenerate the test bridge:

```bash
npm run req:test:generate
```

Do not close a finding because a generated test stub exists. A stub only proves
that the requirement has a verification slot. It does not prove that the
behavior exists.

Likewise, do not close a finding only because a non-generated `@Spec(...)`
reference exists. A trace proves that a code path, test, guardrail, or manual
note knows about the statement. The finding closes only when the referenced
evidence has run or been recorded and the result satisfies the statement for
the reviewed scope.

For each accepted finding, the final handoff should be:

```text
accepted REQ/S ID
  -> Verification Map row
  -> generated stub slot
  -> non-generated trace where practical
  -> executed test/guardrail/smoke or named manual evidence
  -> finding closed
```

## Review Cadence

Use the reverse loop:

- before a large implementation starts;
- after an AI-generated implementation lands;
- when a user says the flow feels wrong;
- after production incidents;
- before deleting or consolidating old docs;
- before treating a design snapshot as implementation authority.

## Review Ledger

For non-trivial reviews, keep a ledger separate from authoritative specs:

```text
spec/reviews/<YYYY-MM-DD-topic>.md
```

The ledger is a triage artifact, not a source of requirements. A `REQ-ID`
mentioned there is a reference. Accepted behavior must move into L1/L2/L3 before
or with code changes.

Each ledger row should include:

- stable `GAP-ID`;
- gap type: `intent_gap`, `experience_gap`, `contract_gap`,
  `edge_case_gap`, `verification_gap`, or `method_gap`;
- spec evidence that led to the finding;
- authority basis for any inferred edge case;
- user, operator, or system risk;
- affected specs and requirement IDs where applicable;
- authority status and target release scope;
- release impact: blocker, non-blocker, proposal-only, or not applicable;
- recommended spec action;
- implementation status and code-review target;
- resolution notes after code review.

Use [the review ledger template](../templates/review-ledger.md) when a review
has multiple findings.
