# Adoption Playbook

## For A New Project

1. Copy `AGENTS.md` or its rules into the target repository so AI agents see the
   operating contract first.
2. Copy `templates/00_constitution.md` into `spec/00_constitution.md`.
3. Decide global or feature structure.
4. Write the first feature spec before implementation.
5. Review the spec as if it were the product: can the user journey be
   reconstructed without reading code?
6. Run `npm run req:test:generate` so every EARS statement has a generated test
   slot.
7. Run plan mode only after L1/L2/L3 and verification slots are clear enough.
8. Implement and verify every requirement or statement ID.

Recommended first commit:

```text
spec/
  README.md
  00_constitution.md
  features/<first-feature>/spec.md
```

## For An Existing Project

1. Start with one painful workflow or recurring bug class.
2. Write the current domain truth as L1, even if the code is inconsistent.
3. Convert intended behavior into L2 EARS requirements. Include accepted future
   behavior even when current code has not caught up.
4. Add L3 only for boundary, rollback, external-service, deletion, billing, or
   entitlement behavior.
5. Keep implementation readiness in review ledgers or evidence records, not in
   the normative spec body.
6. Fix code and tests against the spec.
7. Generate REQ-ID statement stubs and replace placeholders with real tests
   where practical.
8. Review the spec again from the user's point of view.
9. Repeat feature by feature.

Do not try to spec the whole codebase in one pass. The highest-value entry point
is the part where the AI or the team has been guessing.

## Review Checklist

- Can the intended user journey be reconstructed from the spec alone?
- Does every failure or pending state give the user a next action?
- Have duplicate, stale-state, permission, timeout, rollback, cancellation,
  expiry, and retry cases been considered?
- Are inferred edge cases grounded in L0/L1, product authority, platform rules,
  or an explicit decision before becoming binding requirements?
- Does the spec name the authority source?
- Does the spec include accepted future behavior instead of mirroring only
  current code?
- Is implementation readiness kept out of normative L1/L2/L3 text?
- Are canonical IDs and terms explicit?
- Does every behavior change have at least one EARS line?
- Does every feature spec include an `[Unwanted]` case?
- Does every EARS statement generate a test stub?
- Does the verification report separate generated-only slots from real traces?
- Does L3 cover idempotency and partial failure when boundaries are crossed?
- Is generated output clearly marked as output, not source?
- Is there a verification map?

## Reverse Review Loop

Use this loop after implementation, during UX review, or when a user says the
flow feels wrong:

```text
Read spec only -> identify missing journey/state/failure -> classify finding ->
update spec -> update code -> verify against requirement or statement IDs
```

Do not treat "the code already does something" as proof that the behavior is
intended. If it matters to the user or system contract, it must be visible in
the spec.

Do not treat "the code does not do this yet" as proof that the spec should drop
the behavior. If the behavior has product or system authority, keep it in the
spec and track implementation status separately.

## When To Keep It Lightweight

Use only L0 + L2 for small, isolated behavior changes. Add L1 when shared
vocabulary appears. Add L3 when the operation can leave the system in a partial
state.

## When To Stop And Ask

Stop implementation planning when:

- the authority source is unknown;
- two specs use different names for the same thing;
- the failure mode is known but the recovery rule is not;
- the operation can charge money, delete data, or grant access and no L3 exists.
- a reviewer cannot tell what the user should do next from the spec.
