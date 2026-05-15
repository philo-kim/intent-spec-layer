# Project Constitution

## Purpose

Intent Specification Layer exists to make AI-assisted coding work against
explicit intent, explicit behavior, and explicit verification obligations.

## Values

1. Specs govern behavior; docs explain behavior.
2. Generated artifacts provide visibility, not proof.
3. A claim about verified behavior requires executed automated evidence or a
   named manual record.
4. Public examples must not imply that paperwork is equivalent to runtime
   validation.
5. Release surfaces must not drift from package, changelog, docs, and tags.
6. Spec authoring must make predictable failure surfaces visible before
   implementation, especially valid-input automation failure and
   customer-visible latency.

## Forbidden Shortcuts

- Do not remove accepted behavior from `spec/` because implementation is not
  finished.
- Do not label generated requirement stubs as verified.
- Do not treat a non-generated `@Spec(...)` trace as executed evidence unless
  the associated command or record is named and run.
- Do not let GitHub Pages expose every internal template as primary navigation.
- Do not publish a release while package version, changelog entry, and tag are
  knowingly out of sync.

## Authority

This constitution is the Layer 0 source for the repository. Feature specs may
refine it, but they must not weaken the evidence boundary or public truthfulness
requirements.
