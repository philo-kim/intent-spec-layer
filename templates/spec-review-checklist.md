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

- [ ] Each behavior is one EARS requirement.
- [ ] At least one `[Unwanted]` requirement exists.
- [ ] Requirements use stable IDs.
- [ ] Requirements avoid vague phrasing.

## Contracts

- [ ] Cross-boundary operations have L3.
- [ ] Ordering is explicit.
- [ ] Idempotency is explicit.
- [ ] Partial failure and rollback are explicit.

## Verification

- [ ] Every requirement has a verification path.
- [ ] Existing tests or guardrails are linked.
- [ ] Manual checks are named when automation is not yet practical.
