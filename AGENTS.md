# Agent Operating Rules

This file is for AI coding agents that read or apply this repository.

## Load Order

Read in this order before making decisions:

1. `AGENTS.md`
2. `README.md`
3. `guide/agent-mode-router.md`
4. `guide/agent-operating-protocol.md`
5. `guide/spec-as-product-standard.md`
6. `guide/intent-specification-layer.md`
7. `guide/spec-review-loop.md`
8. `guide/spec-to-test-bridge.md`
9. The relevant template or example for the task

For a compact workflow after this file, use
`guide/agent-operating-protocol.md`.
For method updates or upstream rule propagation, also read
`guide/method-update-propagation.md`.

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
7. Do not downgrade accepted specs to match incomplete code. If reviewed code
   lacks accepted behavior, keep the spec and classify an implementation or
   evidence gap.
8. Generated requirement stubs are trace slots, not validation evidence.
9. A spec-only review may find candidate gaps, but it must not label code
   `missing`, `partial`, or `implemented` until code, test, runtime, design, or
   manual evidence is checked.
10. A finding is a release blocker only after authority, target release scope,
   implementation evidence, and core-journey impact are all checked.
11. Common-sense edge cases are valuable, but they start as candidates until
    their authority basis is clear.
12. Implementation from accepted spec is not done until each touched statement
    has real verification evidence or an explicit `blocked` / `manual_only`
    record.
13. Feature archetype packs are required prompts, not optional inspiration.
    Async work, source ingestion, external AI, approval, payment, auth,
    deletion, and external integration each have predictable failure surfaces.
14. Valid input failure must be handled explicitly. If a user provides valid
    input and automation fails, preserve the input and provide a recoverable
    draft, still-processing state, retry path, or actionable error rather than
    an empty manual-only fallback.
15. Customer-visible work that can outlive the generic API timeout needs a
    latency contract: synchronous, endpoint-specific long request, polling,
    background job, or streaming.
16. A method update is not complete after governance files are changed. It
    requires an authoritative spec inventory, propagation audit across in-scope
    feature specs, generated artifact update, and residual gap ledger.
17. Do not claim `done`, `complete`, or `ready` until the selected task mode's
    completion rule in `guide/agent-mode-router.md` is satisfied.

## Decision Flow

Before implementing or reviewing, classify the task:

| Task type | Required action |
|---|---|
| Ambiguous broad request | Route through `guide/agent-mode-router.md` before acting. |
| New behavior | Create or update L2; add L1/L3 when required. |
| Existing behavior feels wrong | Run reverse spec review before code changes. |
| Code differs from spec | Check spec authority before deciding spec gap or code gap. |
| Code lacks accepted spec behavior | Keep the spec; record `missing_implementation`, `partial_implementation`, `missing_test`, or `wrong_code` after evidence review. |
| Edge case found | Record authority basis before promoting to binding REQ. |
| Test/verification work | Map REQ or statement IDs to real evidence, not only generated stubs. |
| Method update / upstream upgrade | Install governance, inventory specs, audit propagation, update L1/L2/L3, regenerate artifacts, and report residual gaps. |

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
  -> classify wrong_spec / wrong_code / missing_implementation / partial_implementation / missing_test / decision gap / edge-case gap
  -> update spec, code, and verification in that order
```

## Method Update Propagation Reflex

When applying a new ILS version, upstream rule, template, or authoring-quality
standard to an existing repository, do not stop after updating AGENTS, README,
templates, scripts, or generated artifacts.

Use `guide/method-update-propagation.md` and complete this sequence:

1. Name the upstream rule or version.
2. List the authoritative spec inventory.
3. Mark every spec as reviewed, excluded, or still pending.
4. Apply archetype packs and edge-case prompts to each in-scope feature spec.
5. Update accepted L1/L2/L3 requirements and L3 contracts.
6. Keep implementation readiness in Verification Maps, review ledgers, or
   release trackers.
7. Regenerate requirement artifacts and run checks.
8. Report `complete` only if every in-scope authoritative spec was reviewed or
   explicitly excluded.

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
- Method update propagation: spec inventory reviewed, exclusions, pending
  specs, residual gaps, and whether completion is `complete` or `partial`.
- Completion claim: `complete`, `partial`, `blocked`, `unverified`, or
  `manual_only`, with the reason from the selected task mode.

## Do Not

- Do not remove accepted behavior from `spec/` only because current code lacks
  it.
- Do not downgrade accepted specs to match incomplete code; use the evidence
  gap taxonomy from `guide/spec-as-product-standard.md`.
- Do not put `missing`, `partial`, `ready`, or `implemented` into normative
  spec behavior.
- Do not treat proposal-only requirements as current release blockers.
- Do not count generated skipped tests as behavior verification.
- Do not treat a non-generated `@Spec(...)` trace as final proof until the
  matching test, guardrail, smoke check, or manual review has executed or been
  recorded.
- Do not let a plan-mode output become source of truth unless it is merged back
  into `spec/`.
- Do not report "updated to latest" when only governance files changed and
  feature specs were not inventoried and audited.
- Do not use broad completion language when the mode-specific completion rule
  has not been satisfied.
