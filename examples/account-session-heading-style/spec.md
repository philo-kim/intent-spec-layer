---
id: SPEC-ACCOUNT-SESSION
title: Account Session Setup
status: active
owners: [example]
updated: 2026-05-15
layers: [L0, L1, L2]
---

# Account Session Setup Spec

## Scope

Account session setup after an external identity provider returns a successful
authorization result.

This example demonstrates heading-style EARS extraction, where one requirement
contains multiple statements and each statement receives its own generated
statement ID.

## Layer 0: Constitution

- Identity authority must be explicit.
- A partial local session must not be created when account setup fails.

## Layer 1: Domain Truth

Canonical terms:

- `account_id`: account identifier from the identity authority.
- `session_id`: local session identifier.
- `callback_url`: post-login destination requested before sign-in.

Session states:

- `pending_setup`
- `active`
- `failed_setup`

## Layer 2: Behavior Spec

### REQ-SESSION-001 - Session setup after identity callback

**[Event-driven]** When identity authorization succeeds, the system shall
exchange the authorization result for an `account_id`, create a local
`session_id`, and redirect to the validated `callback_url`.

**[Unwanted]** If local account setup fails after identity authorization
succeeds, the system shall show a recoverable setup error and shall not create
an `active` session.

## Experience Review

### Happy Path

1. The user returns from the identity provider.
2. The system creates or resumes the local account session.
3. The user lands on the validated `callback_url`.

### Unwanted / Recovery Paths

| Situation | User-visible result | Next action | Requirement |
|---|---|---|---|
| Local setup fails after identity authorization | Recoverable setup error | Retry setup or restart sign-in | REQ-SESSION-001:S2 |

## Verification Map

| Requirement / statement | Verification |
|---|---|
| REQ-SESSION-001:S1 | Integration test for successful callback exchange |
| REQ-SESSION-001:S2 | Integration test for recoverable setup failure |
