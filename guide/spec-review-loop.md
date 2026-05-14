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
spec review -> missing journey/state/failure found -> update spec -> update code -> verify
```

Use this direction when the product feels wrong, a flow is confusing, or a bug
suggests the implementation was technically valid but experientially incomplete.

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
| Spec gap | The implementation has a reasonable behavior, but the spec does not explain it. | Update L1/L2/L3, then add or update verification. |
| Code gap | The spec promise is clear, but implementation does not satisfy it. | Fix code and tests without weakening the spec. |
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
| Spec says behavior exists but code lacks it | Fix code and tests |
| Code has behavior that spec does not justify | Add spec or remove behavior |
| Spec is correct but unclear to reviewers | Rewrite the spec without changing code |

When a finding adds or changes a REQ-ID, regenerate the test bridge:

```bash
npm run req:test:generate
```

Do not close a finding because a generated test stub exists. A stub only proves
that the requirement has a verification slot. It does not prove that the
behavior exists.

## Review Cadence

Use the reverse loop:

- before a large implementation starts;
- after an AI-generated implementation lands;
- when a user says the flow feels wrong;
- after production incidents;
- before deleting or consolidating old docs;
- before treating a design snapshot as implementation authority.
