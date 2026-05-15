# Agent Operating Rules

This file is for AI coding agents that read or apply this repository.

## Load Order

Read in this order before making decisions:

1. `AGENTS.md`
2. `README.md`
3. `guide/agent-operating-protocol.md`
4. `guide/intent-specification-layer.md`
5. `guide/spec-review-loop.md`
6. `guide/spec-to-test-bridge.md`
7. The relevant template or example for the task

For a compact workflow after this file, use
`guide/agent-operating-protocol.md`.

## Non-Negotiable Rules

1. `docs/` explains. `spec/` governs.
2. A behavior change requires L2 EARS requirements.
3. Shared nouns, states, IDs, ownership, or authority require L1 Domain Truth.
4. External services, deletion, money, entitlement, retry, idempotency, rollback,
   or partial failure require L3 Interface Contracts.
5. Accepted future behavior belongs in `spec/` even when implementation is
   pending.
6. Implementation readiness belongs in tests, evidence records, review ledgers,
   or release trackers, not in normative L1/L2/L3 behavior.
7. Generated requirement stubs are trace slots, not validation evidence.
8. A spec-only review may find candidate gaps, but it must not label code
   `missing`, `partial`, or `implemented` until code, test, runtime, design, or
   manual evidence is checked.
9. A finding is a release blocker only after authority, target release scope,
   implementation evidence, and core-journey impact are all checked.
10. Common-sense edge cases are valuable, but they start as candidates until
    their authority basis is clear.
11. Implementation from accepted spec is not done until each touched statement
    has real verification evidence or an explicit `blocked` / `manual_only`
    record.
12. Feature archetype packs are required prompts, not optional inspiration.
    Async work, source ingestion, external AI, approval, payment, auth,
    deletion, and external integration each have predictable failure surfaces.
13. Valid input failure must be handled explicitly. If a user provides valid
    input and automation fails, preserve the input and provide a recoverable
    draft, still-processing state, retry path, or actionable error rather than
    an empty manual-only fallback.
14. Customer-visible work that can outlive the generic API timeout needs a
    latency contract: synchronous, endpoint-specific long request, polling,
    background job, or streaming.

## Decision Flow

Before implementing or reviewing, classify the task:

| Task type | Required action |
|---|---|
| New behavior | Create or update L2; add L1/L3 when required. |
| Existing behavior feels wrong | Run reverse spec review before code changes. |
| Code differs from spec | Check spec authority before deciding spec gap or code gap. |
| Edge case found | Record authority basis before promoting to binding REQ. |
| Test/verification work | Map REQ or statement IDs to real evidence, not only generated stubs. |

## Feature Archetype Reflex

Before writing or implementing L2, choose the matching archetype packs and
answer their prompts:

| Archetype | Required prompts |
|---|---|
| Async customer operation | generic timeout, pending state, retry, refresh/re-entry, still-processing |
| Source or file ingestion | upload completion vs analysis readiness, parse/OCR failure, input preservation, retry/split/reduce |
| External AI or automation | schema failure, partial output, low confidence, valid input failure, usable draft |
| Approval or decision | stale state, duplicate submit, actor authority, already-decided object, audit trail |
| Payment, entitlement, or billing | idempotency, double charge, provider success with local failure, entitlement reconciliation |
| Auth or account | callback replay, state mismatch, backend sync failure, partial session prevention |
| Deletion or privacy | authorization, retention, partial cleanup, audit, idempotency |
| External integration | provider timeout, retry policy, local persistence failure, reconciliation path |

If a feature matches an archetype but the spec has no corresponding
`[Unwanted]`, state, or L3 contract, treat that as a spec gap before code work.

## Implementation Reflex

When implementing accepted behavior, do this before editing application code:

1. List the governing `REQ-...` or `REQ-...:Sx` IDs.
2. Identify which statements need new or changed verification.
3. Decide where the evidence belongs: unit, integration, API, UI, guardrail,
   smoke, or manual UX/runtime record.
4. Add or update the test/guardrail together with the code, not after the
   implementation is "done."
5. Run the relevant verification and report any statement that remains
   `generated_stub`, `mapped`, `traced`, `blocked`, or `manual_only`.

If no verification is added for changed behavior, report the behavior as
unverified. Do not imply completion.

Use this sequence for mismatches:

```text
authority check
  -> target release check
  -> evidence check
  -> classify spec gap / code gap / both gap / decision gap / edge-case gap
  -> update spec, code, and verification in that order
```

## Edge-Case Review Prompts

For every meaningful action, ask:

- What if the user submits twice?
- What if state is stale after refresh or navigation?
- What if the actor lacks ownership or permission?
- What if an external service succeeds but local persistence fails?
- What if local persistence succeeds but notification, billing, or delivery
  fails?
- What if the async step stays pending too long?
- What if the action can outlive the generic API timeout?
- What if the user supplied valid input but automation, extraction, generation,
  or analysis fails?
- What if the user cancels, retries, rejects, or comes back later?
- What next action does the user see after every unwanted path?

Promote the edge case to L2/L3 only when the authority basis is one of:

- L0 value;
- L1 invariant;
- product decision;
- platform, security, privacy, money, deletion, or ownership rule;
- explicit review decision.

Otherwise keep it as a candidate finding in `spec/reviews/`.

## Required Output Shape For Agents

When reporting work, include these compact sections when relevant:

- Spec impact: L0/L1/L2/L3 touched, REQ IDs changed.
- Evidence boundary: what was reviewed as spec, code, test, runtime, or manual
  evidence.
- Edge cases considered: accepted, rejected, or still candidate.
- Release impact: blocker only if the four blocker conditions were checked.
- Verification: commands run and generated-vs-real evidence status.
- Unverified statements: any `REQ-...:Sx` still lacking executed or recorded
  evidence.

## Do Not

- Do not remove accepted behavior from `spec/` only because current code lacks
  it.
- Do not put `missing`, `partial`, `ready`, or `implemented` into normative
  spec behavior.
- Do not treat proposal-only requirements as current release blockers.
- Do not count generated skipped tests as behavior verification.
- Do not treat a non-generated `@Spec(...)` trace as final proof until the
  matching test, guardrail, smoke check, or manual review has executed or been
  recorded.
- Do not let a plan-mode output become source of truth unless it is merged back
  into `spec/`.
