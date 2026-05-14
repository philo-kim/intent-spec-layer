# Intent Specification Layer Guide

## 1. Purpose

AI-assisted coding has a recurring failure mode: the model implements what was
said, then guesses everything that was not said.

The guesses often hide in places that are not obvious from a happy-path demo:

- identity and billing authority;
- canonical IDs and terms;
- bad input and stale state;
- retry, rollback, and partial failure;
- whether generated artifacts or human specs are the source of truth.

The Intent Specification Layer exists to reduce those guesses and expose the
ones that remain. It is not a documentation archive. It is the
implementation-governing layer of a repository.

```text
docs/ explains.
spec/ governs.
```

If code and spec disagree, update the code or update the spec first. Do not
leave them divergent.

Its essential value is not "more requirements." It is a smaller, reviewable
model of the user experience and system promises.

That model works in two directions:

- forward: intent -> plan -> implementation -> verification;
- reverse: spec review -> missing journey/state/failure found -> spec and code
  correction -> verification.

A good spec lets a reviewer understand the intended user journey before reading
all the code. If the spec review reveals that a step, state, error, or next
action is missing, that is a product defect until the spec and code are brought
back into alignment.

## 2. Values Provided

The layer provides five practical values:

1. **Guess reduction.** It turns unstated assumptions into explicit
   requirements, terms, authorities, and contracts.
2. **Experience inspectability.** It lets humans and AI review the user journey
   from a compact artifact before reading the whole implementation.
3. **Defect discovery.** It reveals missing states, missing recovery paths, and
   implementation behavior that has no product justification.
4. **Change continuity.** It preserves why behavior exists, not only what code
   currently does.
5. **Tool independence.** It gives Spec Kit, OpenSpec, Kiro, BMAD, Augment
   Intent, plan mode, and ordinary code review a shared source layer.

## 3. Source Layer Vs Tools

Spec-driven development tools are execution tools. The spec layer is the source
layer they consume.

| Tool or method | Core purpose | Relationship to this layer |
|---|---|---|
| Spec Kit | spec -> plan -> tasks -> code | Can consume `spec/` as source |
| OpenSpec | change deltas and archival | Inspires `spec/changes/` |
| Kiro | IDE specs, design, tasks | Can read/write feature specs |
| BMAD | role-based planning depth | Useful for large planning, anchored back to `spec/` |
| Augment Intent | living spec and drift reduction | Same goal, productized workflow |
| Plan Mode | implementation sequence | Runs after relevant spec is loaded |

Do not create a new root folder just because a tool has a preferred convention.
If a tool needs generated working files, keep them clearly separate or sync the
accepted result back into `spec/`.

## 4. Layer Model

| Layer | Purpose | Required when |
|---|---|---|
| L0 Constitution | Product-wide values, authorities, forbidden shortcuts | Always |
| L1 Domain Truth | Entities, states, vocabulary, invariants, ownership | Shared concepts or 2+ modules |
| L2 Behavior Spec | EARS requirements for system response | Every behavior change |
| L3 Interface Contract | Ordering, payloads, idempotency, rollback, partial failure | Multi-step or cross-resource mutation |

Fixed rules:

1. L0 is always ambient context.
2. L2 is required for every behavior-changing implementation.
3. L1 is required when terms, states, or entities are shared across modules.
4. L3 is required when partial failure, retry, rollback, deletion, payment,
   entitlement, external service calls, or idempotency matter.

## 5. Layer Selection

Use this decision order:

```text
Always:
  read L0

If behavior changes:
  write or update L2

If two or more modules share nouns, states, IDs, ownership, or authority:
  write or update L1

If the implementation mutates multiple resources, calls external services,
requires retry, supports deletion, charges money, grants entitlement, or needs
rollback/compensation:
  write or update L3
```

Minimum viable spec by work type:

| Work type | Minimum layer set |
|---|---|
| Copy-only or docs-only change | L0 check; no feature spec unless behavior changes |
| Single isolated UI behavior | L0 + L2 |
| Shared model, state, permission, or workflow | L0 + L1 + L2 |
| Auth, billing, deletion, uploads, external API, async workflow | L0 + L1 + L2 + L3 |
| Bug caused by missing intent | Update the missing layer before or with the fix |

## 6. Structure Decision

There are two valid repository structures. Choose by domain shape.

### Global Structure

Use when the product has one strongly unified domain model.

```text
spec/
  README.md
  00_constitution.md
  01_domain.md
  02_behavior/
  03_contracts/
  changes/
  schemas/
```

### Feature Structure

Use when authority sources and change cadence differ by domain slice.

```text
spec/
  README.md
  00_constitution.md
  features/
    account-access/spec.md
    billing/spec.md
    project-workflow/spec.md
  changes/
  templates/
  schemas/
  experiments/
```

## 7. L2 Behavior: EARS

Layer 2 uses EARS because it keeps natural language but forces behavior shape.

| Pattern | Use |
|---|---|
| `[Ubiquitous]` | Always true behavior or invariant |
| `[Event-driven]` | Response to an event |
| `[State-driven]` | Behavior while a state holds |
| `[Unwanted]` | Error, race, stale state, bad input, failure, abuse |
| `[Optional]` | Feature flag, entitlement, optional condition |

Writing rules:

1. One line means one requirement.
2. Every requirement gets a stable ID: `REQ-<AREA>-<NUMBER>`.
3. Every feature spec needs at least one `[Unwanted]` requirement.
4. Avoid vague capability phrasing such as "the user can".
5. Prefer "When/While/If ..., the system shall ..." so the line is testable.
6. Split separate behaviors into separate lines.

Example:

```md
- [REQ-AUTH-004][Unwanted] If backend account sync fails after central OAuth
  succeeds, the system shall show a recoverable login error and shall not create
  a partial local session.
```

## 8. L3 Interface Contracts

EARS says what must happen. L3 says how modules preserve the promise when the
operation crosses a boundary.

Add L3 when implementation needs any of these:

- ordered calls;
- durable mutation of multiple resources;
- external service calls;
- retry;
- idempotency;
- rollback or compensation;
- partial failure reporting;
- deletion and audit behavior.

At minimum, an L3 contract should state:

- caller and callee;
- request and response;
- auth and authority source;
- call ordering;
- idempotency key or duplicate-call rule;
- partial failure behavior;
- rollback or compensation behavior;
- audit or observability signal when relevant.

Implementation hints are allowed. If exact rollback requires tracking
`reserved_items`, write that. This is not over-specification; it is the contract
that prevents the AI from guessing.

## 9. Lifecycle

| Status | Meaning |
|---|---|
| `draft` | Being explored; do not implement as authority yet |
| `review` | Ready for human or agent review before code |
| `active` | Governs current implementation |
| `stable` | Mature and rarely changed, still authoritative |
| `deprecated` | Superseded but not removed yet |
| `archived` | Historical only; no longer governs implementation |

Changes that are not ready to merge into active specs live under
`spec/changes/<YYYY-MM-DD-short-name>/`. After implementation and verification,
merge accepted behavior into the relevant feature spec.

## 10. Traceability And Drift

Spec drift is the main failure mode.

Control rule:

> A behavior-changing code change must either update the relevant spec or state
> why the spec remains unchanged.

Recommended traceability:

- Put stable IDs on EARS requirements.
- Reference requirement IDs from tests, pull requests, or comments when useful.
- Use `@Spec(REQ-...)` sparingly on complex code paths where future agents need
  a direct breadcrumb.
- Add a test, guardrail, smoke check, or manual verification note for each new
  behavior requirement.

Generated artifacts such as OpenAPI JSON or generated frontend types are
generated contracts, not the source of product intent.

## 11. Spec Review As Defect Discovery

The spec is also a review tool.

Reviewers should be able to read a feature spec and answer:

- what journey the user is supposed to experience;
- what state the system starts in and ends in;
- what the user sees after each important action;
- what can fail;
- what the user can do after failure;
- which authority owns identity, payment, entitlement, deletion, or other shared
  state;
- what must not happen.

If those answers are missing, write the missing intent into L1, L2, or L3. Then
fix the code to satisfy it. If the answers are present in the spec but missing
from the implementation, fix the code and tests. If the code contains behavior
that the spec does not justify, either add the missing spec or remove the
behavior.

This reverse loop is as important as pre-implementation planning:

```text
spec review -> missing UX/system promise found -> update spec -> update code -> verify
```

Use it when a flow feels wrong, when a bug reveals an unstated assumption, or
when an AI-generated implementation technically works but does not guide the
user toward the next step.

## 12. Agent Workflow

```text
1. Read L0.
2. Locate the relevant feature spec.
3. Update or create L1 terms when shared vocabulary changes.
4. Write L2 EARS requirements for behavior changes.
5. Add L3 only when cross-module or partial-failure semantics matter.
6. Use plan mode or another tool to create the implementation plan.
7. Implement.
8. Verify each relevant requirement.
9. Update spec first when a bug reveals missing intent.
```

Do not start with implementation planning when the governing behavior is still
implicit. Plan mode answers "what steps should I take"; `spec/` answers "what
truth must those steps preserve."

## 13. Anti-Patterns

- A PRD that describes value but omits bad states.
- A behavior change with no EARS requirement.
- A spec that cannot reconstruct the user journey.
- An error state with no user next action.
- A shared ID with multiple aliases across modules.
- A multi-resource mutation with no rollback or idempotency rule.
- A design snapshot treated as implementation authority without migration into
  `spec/`.
- A tool-generated plan that becomes the source of truth while `spec/` stays
  stale.
- A passing happy-path smoke test used as proof that the contract is complete.
- A code path that exists only because the AI invented a plausible behavior.

## 14. Final Operating Principles

1. `docs/` explains; `spec/` governs.
2. L0 always exists.
3. Behavior changes require L2.
4. Shared terms require L1.
5. Partial failure, rollback, retry, deletion, payment, entitlement, or
   idempotency requires L3.
6. Use global structure for a unified domain.
7. Use feature structure for authority-split domains.
8. Tools consume the source layer; they do not define it.
9. Code and spec must not drift silently.
10. The spec must be reviewable as a model of the intended user journey.
11. The goal is not more documents. The goal is fewer AI guesses and faster
    discovery of missing intent.
