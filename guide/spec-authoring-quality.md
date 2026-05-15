# Spec Authoring Quality

This guide defines the writing checks that make a spec useful to AI agents.
The goal is not to document one failure case. The goal is to make predictable
failure surfaces hard to forget.

## Core Principle

A feature spec is incomplete when it only says what should happen on the happy
path. It must also say what the user sees when normal processing is slow,
external automation fails, state is stale, or the action is repeated.

The practical rule:

```text
feature intent -> archetype prompts -> EARS statements -> latency/recovery
contract -> verification obligation
```

## Feature Archetype Packs

Most edge cases are not random. They cluster by feature type. Select every pack
that applies before writing L2 or L3.

| Pack | Use when | Required prompts |
|---|---|---|
| Async customer operation | The user waits for work that may take longer than a normal request | timeout window, pending state, retry, refresh/re-entry, still-processing |
| Source or file ingestion | The user submits text, files, URLs, scans, OCR, or parsed content | upload completion vs analysis readiness, parse/OCR failure, input preservation, reduce/split/retry |
| External AI or automation | The system extracts, analyzes, classifies, summarizes, translates, or generates | schema failure, partial output, low confidence, valid input failure, usable draft |
| Approval or decision | A user approves, rejects, accepts, confirms, cancels, or signs off | duplicate submit, stale state, wrong actor, already-decided object, audit trail |
| Payment, entitlement, or billing | Money, credit, quote authorization, subscription, or access changes | idempotency, double charge, provider success with local failure, reconciliation |
| Auth or account | Login, callback, account linking, provisioning, or session creation | replay, state mismatch, backend sync failure, partial session prevention |
| Deletion or privacy | User data, account deletion, retention, anonymization, or cleanup | authorization, retention, partial cleanup, audit, idempotency |
| External integration | A provider, webhook, API, queue, or storage service is involved | provider timeout, retry policy, local persistence failure, reconciliation path |

If a feature matches a pack but no corresponding `[Unwanted]`, state behavior,
or L3 contract exists, treat that as a spec gap.

## Valid Input Failure Rule

This rule prevents a common AI implementation failure: the system receives
valid user input, automation fails, and the user is dropped into an empty
manual-only fallback.

Normative rule:

> If the user provided valid input and automation fails, the system must
> preserve the input and return one of: recoverable draft, still-processing
> state, retry path, or actionable error. It must not collapse into an empty
> manual-only fallback.

Use this rule for extraction, parsing, OCR, LLM analysis, classification,
quote generation, document generation, and similar automation.

Good EARS shape:

```md
### REQ-SRC-004 - Automated extraction recovery

**[Unwanted]** If automated extraction fails after receiving valid source
input, the system shall preserve the source and return a recoverable draft,
still-processing state, retry path, or actionable error.
```

## Latency / Processing Contract

Generic API timeouts are infrastructure defaults, not product experience
contracts. If normal customer-visible processing can outlive the generic
timeout, choose one shape:

| Shape | Use when | Spec must say |
|---|---|---|
| synchronous | Work reliably finishes inside the generic timeout | direct success/failure response |
| endpoint-specific long request | Work may exceed the default but should still return in one request | timeout budget, retry policy, user pending copy |
| polling | Work becomes a job with status | job states, poll endpoint, timeout, still-processing result |
| background job | User can leave and return later | re-entry state, notification, persistence, cancellation |
| streaming | Partial progress matters | partial result semantics, finalization, failure recovery |

If the spec does not choose one, an AI agent will usually reuse the generic API
client and turn normal processing time into a false failure.

## Under-Decomposition Warning

`REQ` and EARS statement counts should not always be identical.

- `REQ` is a user capability, system promise, or product rule.
- An EARS statement is one behavior under that capability.

For important customer-facing features, one REQ often needs multiple
statements:

- `[Event-driven]` for the happy event;
- `[State-driven]` for pending or constrained states;
- `[Unwanted]` for stale, invalid, duplicate, slow, failed, or unauthorized
paths;
- `[Optional]` only when an entitlement or feature flag changes behavior.

If every requirement has exactly one behavior statement, the spec may be
under-decomposed. It is not automatically wrong, but reviewers should ask
whether the feature is hiding state and recovery behavior.

## AI Authoring Reflex

When an AI agent writes or reviews a spec, it should follow this sequence:

1. Identify the user capability and governing authority.
2. Choose relevant feature archetype packs.
3. Write the happy path.
4. Write state and unwanted paths from the selected packs.
5. Add a latency / processing contract for customer-visible async work.
6. Apply the valid input failure rule to automation.
7. Add L3 when ordering, idempotency, retry, rollback, or partial failure
   matters.
8. Map each statement to verification.

Do not report the spec as ready merely because REQ-IDs exist. REQ-IDs create
traceability; the quality comes from whether the statements cover the feature's
predictable failure surfaces.
