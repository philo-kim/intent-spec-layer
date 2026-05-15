# Intent Specification Layer Specs

This folder is the authoritative operating spec for this repository.

`docs/` explains the method. `spec/` governs how this project itself is
changed, released, verified, and presented.

## Load Order

1. `spec/00_constitution.md`
2. The relevant `spec/features/<feature>/spec.md`
3. Related templates, examples, generated reports, and scripts

## Feature Specs

- `spec/features/spec-governance/spec.md`: repository dogfooding rules.
- `spec/features/spec-to-test-bridge/spec.md`: REQ/S extraction, generated
  stubs, trace references, and executed evidence.
- `spec/features/agent-operating-protocol/spec.md`: agent-facing rules and
  guardrails.
- `spec/features/spec-authoring-quality/spec.md`: archetype packs, valid-input
  failure, latency contracts, and under-decomposition checks.
- `spec/features/public-discovery/spec.md`: README, GitHub Pages, repository
  metadata, and community discovery surfaces.
- `spec/features/release-and-versioning/spec.md`: package, changelog, tags, and
  release alignment.

## Evidence Boundary

Generated requirement stubs are not evidence. A statement becomes stronger only
when a non-generated `@Spec(...)` trace exists and the referenced command,
guardrail, smoke check, or manual record has run.
