# Spec Review Checklist

## Authority

- [ ] Upstream authority sources are named.
- [ ] Generated artifacts are not treated as the source of intent.
- [ ] Product-local shortcuts are explicitly allowed or forbidden.

## Domain

- [ ] Canonical terms are listed.
- [ ] IDs and states have stable code names.
- [ ] Aliases are forbidden or mapped.
- [ ] Invariants are testable.

## Behavior

- [ ] The intended user journey can be reconstructed from the spec alone.
- [ ] Each important action has a user-visible result.
- [ ] Each failure or pending state has a user next action.
- [ ] Each behavior is one EARS requirement.
- [ ] At least one `[Unwanted]` requirement exists.
- [ ] Requirements use stable IDs.
- [ ] Requirements avoid vague phrasing.
- [ ] Every requirement is machine-extractable by `npm run req:test:generate`.

## Contracts

- [ ] Cross-boundary operations have L3.
- [ ] Ordering is explicit.
- [ ] Idempotency is explicit.
- [ ] Partial failure and rollback are explicit.

## Verification

- [ ] Every requirement has a verification path.
- [ ] Multi-statement requirements are traceable at statement level
      (`REQ-...:S1`, `REQ-...:S2`, ...).
- [ ] Multi-statement requirements use statement IDs in the Verification Map,
      not only the parent REQ-ID.
- [ ] Generated requirement statement stubs are current.
- [ ] Generated skipped tests are treated as pending slots, not validation.
- [ ] `generated/verification-report.md` has no unexpected code-only
      references.
- [ ] Real `@Spec(...)` traces use statement IDs for multi-statement
      requirements.
- [ ] Generated skipped tests are replaced or complemented by real tests where practical.
- [ ] Existing tests or guardrails are linked.
- [ ] Manual checks are named when automation is not yet practical.

## Reverse Review

- [ ] Existing code behavior maps to a requirement or contract.
- [ ] Behavior not justified by spec is removed or specified.
- [ ] Missing UX found during review has a spec action and code action.
- [ ] Each finding is classified as spec gap, code gap, both gap, or decision
      gap.
- [ ] Spec-only findings start as `implementation_status=unverified`.
- [ ] No finding is marked `missing`, `partial`, or `implemented` without code,
      test, design, runtime, or manual evidence.
- [ ] Accepted findings are moved into authoritative L1/L2/L3 specs before or
      with code changes.
