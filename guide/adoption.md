# Adoption Playbook

## For A New Project

1. Copy `templates/00_constitution.md` into `spec/00_constitution.md`.
2. Decide global or feature structure.
3. Write the first feature spec before implementation.
4. Run plan mode only after L1/L2/L3 are clear enough.
5. Implement and verify every requirement ID.

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
3. Convert observed behavior into L2 EARS requirements.
4. Add L3 only for boundary, rollback, external-service, deletion, billing, or
   entitlement behavior.
5. Fix code and tests against the spec.
6. Repeat feature by feature.

Do not try to spec the whole codebase in one pass. The highest-value entry point
is the part where the AI or the team has been guessing.

## Review Checklist

- Does the spec name the authority source?
- Are canonical IDs and terms explicit?
- Does every behavior change have at least one EARS line?
- Does every feature spec include an `[Unwanted]` case?
- Does L3 cover idempotency and partial failure when boundaries are crossed?
- Is generated output clearly marked as output, not source?
- Is there a verification map?

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
