# Spec-To-Test Bridge

REQ-IDs must not remain only human-readable trace labels. They need a
verification bridge. The bridge may generate test stubs, but the stubs are only
proof obligations. They must not pretend that generated placeholders, planned
verification rows, or non-generated `@Spec(...)` traces are finished
verification.

The bridge has seven levels:

1. **Spec coverage.** Every EARS statement has a stable `REQ-...` ID.
2. **Statement coverage.** Multi-statement requirements are split into
   statement IDs such as `REQ-AUTH-004:S1` and `REQ-AUTH-004:S2`.
3. **Verification-map coverage.** Every requirement or statement appears in the
   feature spec's Verification Map. Multi-statement requirements must map each
   statement ID explicitly.
4. **Generated stub coverage.** Every statement becomes an executable skipped
   test slot.
5. **Trace coverage.** Non-generated implementation tests, guardrails, or code
   paths reference `@Spec(REQ-...:Sx)` outside generated artifacts.
6. **Execution coverage.** The referenced verification command runs in CI or
   locally, or a named manual UX review records the evidence.
7. **Result coverage.** The report records whether the statement is pending,
   mapped, traced, verified, blocked, or explicitly manual-only.

The generated stub is not the final proof. It is the forcing function that keeps
requirements from disappearing between spec review and code review.

The dangerous false positive is:

```text
generated stub exists -> trace report is green -> behavior is assumed verified
```

That is wrong. A generated stub means "this behavior still needs proof." The
verification report must keep generated-only statements visible. A
non-generated `@Spec(...)` trace is stronger than a stub, but it is still not
the same as executed evidence unless the matching test, guardrail, smoke check,
or manual review result is recorded.

## Commands

Generate requirement artifacts:

```bash
npm run req:test:generate
```

Check that generated artifacts are current:

```bash
npm run check:reqs
```

Run generated requirement test stubs:

```bash
npm run test:reqs
```

The full check includes all three:

```bash
npm run check
```

## Agent Implementation Rule

For an AI agent, the bridge should create an immediate implementation reflex:

```text
touch accepted behavior -> touch verification evidence
```

When a statement changes or a code path is implemented for it, the agent should
look at the Verification Map before editing code and decide where the proof will
live:

| Statement kind | Usual evidence |
|---|---|
| Pure transformation or validation rule | Unit test |
| API behavior, auth, permissions, persistence, or idempotency | Integration/API test |
| User-visible state, recovery, decision card, or empty state | UI/component test or manual UX record |
| Repository policy, generated artifacts, naming, or forbidden shortcut | Guardrail/static check |
| Deployment, SSO, billing, deletion, or external service path | Smoke test plus integration or manual runtime evidence |

If the agent cannot add evidence, it must leave the statement visibly
`blocked`, `manual_only`, or still unverified. It should not report the
implementation as complete.

## Generated Artifacts

```text
generated/requirements.json
generated/requirements.test.mjs
generated/verification-report.md
```

`requirements.json` is the machine-readable manifest.

`requirements.test.mjs` is an executable Node test file where each REQ-ID is a
skipped test. These skipped tests should be treated as implementation work
slots, not as completed validation.

`verification-report.md` separates generated stub slots, planned Verification
Map evidence, and non-generated `@Spec(...)` references outside generated
artifacts.

Generated files or references marked `generated_stub=true` are intentionally not
counted as real trace evidence.

## Rules

1. Every L2 EARS requirement must have a stable `REQ-...` ID.
2. Every EARS statement must be traceable. If a requirement has multiple EARS
   statements, the tool assigns statement IDs.
3. Single-statement requirements may use `REQ-...` in the feature spec's
   Verification Map. Multi-statement requirements must use `REQ-...:S1`,
   `REQ-...:S2`, and so on.
4. Generated artifacts must be current in CI.
5. Generated skipped tests are allowed only as placeholders.
6. Real implementation tests, guardrails, smoke checks, or manual verification
   notes should reference the same REQ-ID or statement ID.
7. Do not count generated stubs as runtime validation.
8. Unknown `@Spec(...)` references fail `npm run check:reqs`.
9. A non-generated `@Spec(REQ-...)` reference is accepted only for
   single-statement requirements. Multi-statement requirements must reference
   statement IDs.
10. Mark a statement `verified` only after the verification command ran, the
    smoke check passed, or the manual UX evidence was recorded with reviewer,
    date, and artifact.

## Proof Obligation Ladder

Use the strongest available evidence for each statement.

| Level | Name | Counts as verified? | Meaning |
|---|---|---:|---|
| 0 | missing | No | No requirement or statement exists yet. |
| 1 | generated_stub | No | A skipped placeholder exists. This is a work slot. |
| 2 | mapped | No | The spec names the intended evidence path. |
| 3 | traced | No by itself | A non-generated test, guardrail, code path, or manual note references the statement. |
| 4 | executed | Usually | The referenced automated verification command ran. |
| 5 | manual_recorded | Usually | A named manual UX/runtime review recorded evidence and artifact links. |
| 6 | verified | Yes | The evidence result satisfies the statement for the reviewed scope. |
| blocked | blocked | No | The evidence path is known but cannot run yet; the block must be explicit. |

This ladder is deliberately stricter than "REQ-ID automatically becomes a
test." Automatic stubs create visibility. They do not create behavioral proof.

## Supported EARS Styles

Inline style:

```md
- [REQ-AUTH-004][Unwanted] If backend account sync fails after central OAuth
  succeeds, the system shall show a recoverable login error.
```

Heading style:

```md
### REQ-AUTH-004 - Account setup after OAuth

**[Event-driven]** When central OAuth succeeds, the system shall create or
resume the local session.

**[Unwanted]** If backend account sync fails, the system shall show a
recoverable login error and shall not create a partial session.
```

Heading style is useful when one requirement contains multiple EARS statements.
The generated manifest will split them into `REQ-AUTH-004:S1`,
`REQ-AUTH-004:S2`, and so on.

## Verification Statuses

Use separate words for separate states:

| State | Meaning |
|---|---|
| `generated_stub` | A skipped placeholder exists. This is not validation. |
| `mapped` | The spec names a planned verification path. |
| `traced` | A non-generated test, guardrail, manual record, or code path references the spec ID. |
| `verified` | The verification has run or been manually recorded. |
| `manual_only` | Automation is impractical and a named manual review is the accepted evidence. |
| `blocked` | Verification is known but cannot run yet. |

This prevents the bridge from becoming a scoreboard that rewards paperwork
instead of behavior.

## Why This Matters

Without generated test stubs, a requirement can be written, reviewed, and then
silently ignored during implementation. With the bridge, every requirement gets
a visible test slot, and code review can ask a concrete question:

> Is this requirement or statement ID still only a generated stub, or does it
> have adapter-backed verification evidence?
