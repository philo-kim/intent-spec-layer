# Spec Review Checklist

## Authority

- [ ] Upstream authority sources are named.
- [ ] Generated artifacts are not treated as the source of intent.
- [ ] Accepted future behavior remains in `spec/` even if implementation is
      pending.
- [ ] Implementation readiness words (`missing`, `partial`, `ready`,
      `implemented`) are not written into normative L1/L2/L3 behavior.
- [ ] Target release or scope is identified before any finding is called a
      release blocker.
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
- [ ] The relevant feature archetype packs were selected and answered.
- [ ] Duplicate submit, stale state, permission, timeout, rollback, cancellation,
      expiry, and retry cases have been considered.
- [ ] Async customer-visible work has a latency / processing contract:
      synchronous, endpoint-specific long request, polling, background job, or
      streaming.
- [ ] Valid input failure is explicit: if the user provides valid input and
      automation fails, the input is preserved and the recovery is a draft,
      still-processing state, retry path, or actionable error.
- [ ] No valid-input automation failure collapses into an empty manual-only
      fallback.
- [ ] Common-sense edge cases are marked with an authority basis before they are
      promoted into binding requirements.
- [ ] Each behavior statement is one EARS statement.
- [ ] If every requirement has exactly one behavior statement, the spec was
      checked for under-decomposition. Important customer-facing features
      usually need multiple Event/State/Unwanted statements under the same user
      capability.
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
- [ ] Real `@Spec(...)` traces are treated as trace evidence, not final
      verification unless the associated command or manual record is present.
- [ ] Generated skipped tests are replaced or complemented by real tests where practical.
- [ ] Existing tests or guardrails are linked.
- [ ] Manual checks are named with reviewer, date, scope, and artifact when
      automation is not yet practical.

## Reverse Review

- [ ] Existing code behavior maps to a requirement or contract.
- [ ] Behavior not justified by spec is removed or specified.
- [ ] Missing UX found during review has a spec action and code action.
- [ ] Each finding is classified as spec gap, code gap, both gap, or decision
      gap.
- [ ] Edge-case findings stay candidate findings until accepted by L0/L1,
      product authority, platform rules, or explicit decision.
- [ ] Spec-only findings start as `implementation_status=unverified`.
- [ ] No finding is marked `missing`, `partial`, or `implemented` without code,
      test, design, runtime, or manual evidence.
- [ ] No finding is marked `blocker` unless authority, target release,
      implementation evidence, and core-journey impact have all been checked.
- [ ] Accepted findings are moved into authoritative L1/L2/L3 specs before or
      with code changes.
