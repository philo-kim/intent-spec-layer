# Agent Operating Protocol

Use this protocol when an AI agent applies the Intent Specification Layer to a
real repository.

The goal is to keep the agent from forgetting the method's central distinction:

```text
spec = authoritative intent
evidence = implementation proof
ledger = review and readiness trail
generated = trace scaffolding
```

## 1. Start With The Task Mode

Classify the request before reading implementation code.

| Mode | Trigger | First move |
|---|---|---|
| Spec authoring | New behavior or changed product promise | Write or update L1/L2/L3. |
| Implementation | Build behavior from accepted spec | Load governing REQ IDs and write the verification obligation before code. |
| Reverse review | Flow feels wrong or code already exists | Review spec as user journey first. |
| Evidence mapping | Tests or CI requested | Map REQ IDs to real tests, guardrails, runtime, or manual evidence. |
| Release audit | "Ready?", "blocker?", "launch?" | Check authority, release scope, implementation evidence, and core journey impact. |

If the mode is unclear, default to reverse review. It exposes missing intent
without prematurely accusing the implementation.

## 2. Apply Layer Selection

Use the minimum sufficient layer set:

| Condition | Required layer |
|---|---|
| Product-wide value, authority, or forbidden shortcut | L0 |
| Shared term, state, ID, ownership, or invariant | L1 |
| Any behavior change | L2 |
| External service, async boundary, deletion, money, entitlement, retry, rollback, idempotency, or partial failure | L3 |

Do not skip L3 for "small" flows that cross these boundaries. Small flows can
still create irreversible or inconsistent states.

## 3. Preserve Authority/Evidence Boundary

Before saying a behavior is missing, ask:

1. Is the spec requirement authoritative or only a draft, proposal, sample, or
   stale import?
2. Is the requirement in the reviewed release scope?
3. Has code, test, runtime, design, or manual evidence been checked?
4. Does the behavior affect the core user, operator, or system journey?

Only then classify:

| Classification | Use when |
|---|---|
| Spec gap | Product authority or code has reasonable behavior that spec does not explain, or spec imported a promise with no authority. |
| Code gap | Authoritative spec promise is not satisfied by reviewed implementation evidence. |
| Both gap | Neither spec nor code handles a real journey, state, failure, or recovery path. |
| Edge-case gap | A likely edge case was found but needs authority before becoming binding. |
| Decision gap | Correct behavior is not knowable from current authority. |

## 4. Edge-Case Discovery Loop

For every action, run this prompt set:

```text
duplicate submit?
stale state?
wrong actor or ownership?
external success + local failure?
local success + downstream failure?
pending too long?
generic timeout exceeded by normal processing?
valid input failure after extraction, analysis, generation, or automation?
empty manual-only fallback after valid input?
cancel, reject, retry, expire?
user-visible next action?
```

Then decide the authority basis:

| Authority basis | Action |
|---|---|
| L0 value or L1 invariant | Promote to L2/L3 unless explicitly rejected. |
| Security, privacy, money, deletion, ownership, or data integrity | Promote to L2/L3 and require verification. |
| Product decision | Promote to L2/L3 and map evidence. |
| Common UX expectation | Record candidate; accept or reject explicitly. |
| Sample or previous project import | Re-authorize before treating as binding. |

## 4A. Feature Archetype Packs

Before L2 authoring or implementation, choose the relevant feature archetype
packs from [Spec authoring quality](spec-authoring-quality.md). The packs are
there to make predictable failure surfaces hard to forget:

- async customer operation;
- source or file ingestion;
- external AI or automation;
- approval or decision;
- payment, entitlement, or billing;
- auth or account;
- deletion or privacy;
- external integration.

For each selected pack, make sure the spec contains the corresponding state,
`[Unwanted]`, or L3 contract.

The two checks most likely to prevent false completion are:

- **valid input failure**: accepted user input is preserved when automation
  fails, with draft, still-processing, retry, or actionable error recovery;
- **latency contract**: work that can outlive the generic timeout declares
  synchronous, long request, polling, background job, or streaming behavior.

## 5. Release Blocker Test

Do not call a finding a blocker unless all are true:

```text
authoritative requirement
+ current target release
+ missing or partial implementation evidence
+ required for core journey
= release blocker
```

If any condition is unknown, the release impact is `unknown`, not `blocker`.

## 6. Verification Discipline

Generated stubs are required but insufficient.

```text
REQ-ID -> statement ID -> generated stub -> mapped evidence -> non-generated trace -> executed evidence
```

Real evidence can be:

- unit, integration, API, or UI test;
- guardrail or static check;
- smoke test;
- screenshot or runtime review;
- named manual UX evidence when automation is impractical.

Use statement IDs such as `REQ-AUTH-004:S1` for multi-statement requirements.

Do not report a statement as verified only because:

- it appears in the Verification Map;
- `generated/requirements.test.*` contains a skipped placeholder;
- a non-generated `@Spec(...)` comment exists.

Those are useful intermediate states. The final state requires an executed test
or guardrail, a passing smoke check, or a named manual UX/runtime record with
reviewer, date, scope, and artifact.

When filling a Verification Map or task brief, use this status language:

| Status | Meaning |
|---|---|
| `generated_stub` | Placeholder exists; no proof yet. |
| `mapped` | Intended evidence target is named. |
| `traced` | Non-generated code, test, guardrail, or manual note references the statement. |
| `verified` | Evidence ran or was manually recorded and satisfies the statement. |
| `manual_only` | Manual review is the accepted evidence for this statement. |
| `blocked` | Evidence path is known but cannot currently run. |

## 7. Implementation Verification Reflex

When the mode is Implementation, tests are not a later cleanup task. Treat each
touched statement as an obligation that must be closed or explicitly left open.

Before editing application code:

1. Copy the governing `REQ-...` or `REQ-...:Sx` IDs into the task notes.
2. Mark which statements are already verified and which need new evidence.
3. Choose the evidence type for each changed statement: unit, integration, API,
   UI, guardrail, smoke, or manual UX/runtime record.
4. If no practical verification path exists, mark the statement `blocked` or
   `manual_only` with a reason before implementation continues.

During implementation:

- write or update the test/guardrail in the same change as the code;
- include the statement ID in the non-generated test, guardrail, or manual
  evidence record where practical;
- keep generated stubs as visible backlog only, never as completion evidence.

Before reporting done:

- run the relevant verification commands;
- list any touched statement still at `generated_stub`, `mapped`, or `traced`;
- do not call the implementation complete if an authoritative in-scope statement
  lacks executed or recorded evidence.

## 8. Agent Report Template

Use this shape in the final report for non-trivial work:

```md
Spec impact:
- L1:
- L2:
- L3:
- REQ IDs:

Evidence boundary:
- Spec reviewed:
- Code/test/runtime evidence reviewed:
- Unverified:

Edge cases:
- Accepted into spec:
- Candidate only:
- Rejected/non-goal:

Release impact:
- blocker / non_blocker / proposal_only / not_applicable / unknown
- Reason:

Verification:
- Commands:
- Generated stubs:
- Mapped evidence:
- Non-generated traces:
- Real evidence:
- Still unverified:
```
