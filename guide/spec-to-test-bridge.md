# Spec-To-Test Bridge

REQ-IDs must not remain only human-readable trace labels. They need a generated
test surface, and that surface must not pretend that generated placeholders are
finished verification.

The bridge has six levels:

1. **Spec coverage.** Every EARS statement has a stable `REQ-...` ID.
2. **Statement coverage.** Multi-statement requirements are split into
   statement IDs such as `REQ-AUTH-004:S1` and `REQ-AUTH-004:S2`.
3. **Verification-map coverage.** Every requirement or statement appears in the
   feature spec's Verification Map.
4. **Generated stub coverage.** Every statement becomes an executable skipped
   test slot.
5. **Trace coverage.** Real implementation tests, guardrails, or code comments
   reference `@Spec(REQ-...:Sx)` outside generated artifacts.
6. **Runtime or review evidence.** The referenced verification actually runs,
   or a named manual UX review records the evidence.

The generated stub is not the final proof. It is the forcing function that keeps
requirements from disappearing between spec review and code review.

The dangerous false positive is:

```text
generated stub exists -> trace report is green -> behavior is assumed verified
```

That is wrong. A generated stub means "this behavior still needs proof." The
verification report must keep generated-only statements visible.

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

`verification-report.md` separates generated stub slots from real `@Spec(...)`
references outside generated artifacts.

Generated files or references marked `generated_stub=true` are intentionally not
counted as real trace evidence.

## Rules

1. Every L2 EARS requirement must have a stable `REQ-...` ID.
2. Every EARS statement must be traceable. If a requirement has multiple EARS
   statements, the tool assigns statement IDs.
3. Every REQ-ID or statement ID must appear in the feature spec's Verification
   Map.
4. Generated artifacts must be current in CI.
5. Generated skipped tests are allowed only as placeholders.
6. Real implementation tests, guardrails, smoke checks, or manual verification
   notes should reference the same REQ-ID or statement ID.
7. Do not count generated stubs as runtime validation.

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
| `traced` | A real test, guardrail, or code path references the spec ID. |
| `verified` | The verification has run or been manually recorded. |
| `blocked` | Verification is known but cannot run yet. |

This prevents the bridge from becoming a scoreboard that rewards paperwork
instead of behavior.

## Why This Matters

Without generated test stubs, a requirement can be written, reviewed, and then
silently ignored during implementation. With the bridge, every requirement gets
a visible test slot, and code review can ask a concrete question:

> Is this requirement or statement ID still only a generated stub, or does it
> have adapter-backed verification evidence?
