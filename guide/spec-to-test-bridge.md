# Spec-To-Test Bridge

REQ-IDs must not remain only human-readable trace labels. They need a generated
test surface.

The bridge has three levels:

1. **Requirement extraction.** Every EARS line with `REQ-...` is parsed into a
   machine-readable manifest.
2. **Generated test stub.** Every REQ-ID becomes an executable skipped test.
   This gives the repository a visible test slot for each requirement.
3. **Adapter-backed implementation test.** Product code should replace or
   complement each generated stub with a real test that exercises the
   implementation.

The generated stub is not the final proof. It is the forcing function that keeps
requirements from disappearing between spec review and code review.

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
```

`requirements.json` is the machine-readable manifest.

`requirements.test.mjs` is an executable Node test file where each REQ-ID is a
skipped test. These skipped tests should be treated as implementation work
slots, not as completed validation.

## Rules

1. Every L2 EARS requirement must have a stable `REQ-...` ID.
2. Every REQ-ID must appear in the feature spec's Verification Map.
3. Generated artifacts must be current in CI.
4. Generated skipped tests are allowed only as placeholders.
5. Real implementation tests, guardrails, smoke checks, or manual verification
   notes must reference the same REQ-ID.

## Why This Matters

Without generated test stubs, a requirement can be written, reviewed, and then
silently ignored during implementation. With the bridge, every requirement gets
a visible test slot, and code review can ask a concrete question:

> Is this REQ-ID still only a generated stub, or does it have an adapter-backed
> implementation test?
