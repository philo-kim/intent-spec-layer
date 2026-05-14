# Project Constitution

Layer 0 rules apply to all implementation work. They constrain humans and AI
agents before feature-level specs are considered.

## Authority

1. **Name upstream authorities.** Identity, billing, data ownership, deletion,
   and external contracts must name their source of truth.

2. **Do not invent local authority.** A product must not introduce local
   authority for a centrally governed concept unless the upstream contract
   changes first.

3. **Generated artifacts are outputs.** OpenAPI files, generated types, and
   generated plans are derived contracts, not the source of product intent.

## Product Integrity

4. **Do not show success for unknown state.** A workflow step that failed or is
   still pending must not be presented as completed.

5. **No silent paid or privileged work.** Customer-visible paid work and
   privileged access must not begin before the relevant authority grants it.

6. **Cross-resource operations need failure semantics.** Any operation that
   mutates more than one durable resource must define idempotency and partial
   failure behavior before implementation.

7. **Deletion must be auditable and idempotent.** Deletion adapters must support
   dry-run and delete modes, return counts or statuses, verify authority, and
   tolerate repeated calls.

## Implementation Discipline

8. **Spec changes precede behavior changes.** If code changes user-visible or
   cross-module behavior, update the relevant feature spec first or document why
   no spec change is required.

9. **Tests trace to spec.** New behavior requirements should have a matching
   test, guardrail, smoke check, or explicit manual-verification note.

10. **Do not add speculative features.** Implement only behavior that traces to
    a requirement, domain invariant, interface contract, bug fix, or explicit
    user instruction.
