---
id: SPEC-RELEASE-VERSIONING
title: Release And Versioning
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2, L3]
target_release: v0.2.1
---

# Release And Versioning Spec

## Scope

Package metadata, citation metadata, changelog headings, release tags, and
release publication readiness.

## Authority Sources

- Package manifest: `package.json`
- Citation metadata: `CITATION.cff`
- Release notes: `CHANGELOG.md`
- Repository releases and tags

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `package version` | Current project version | `package.json` |
| `citation version` | Public citation version | `CITATION.cff` |
| `latest changelog version` | First release heading in changelog | `CHANGELOG.md` |
| `release tag` | Git tag named `v<package version>` | GitHub release process |
| `packable artifact` | Files included by npm packaging | `npm pack --dry-run` |

## Layer 2: Behavior Spec

- [REQ-REL-001][Ubiquitous] The package version shall match the latest
  changelog release heading.
- [REQ-REL-002][Ubiquitous] The package manifest shall expose repository,
  homepage, bugs, license, keywords, and package file boundaries for public
  reuse.
- [REQ-REL-003][Event-driven] When a release is published, the release tag shall
  use `v<package version>` and the changelog entry shall describe the released
  behavior.
- [REQ-REL-004][Ubiquitous] The citation metadata version shall match the
  package version and latest changelog release heading.

## Layer 3: Interface Contract

### Contract: release publication

Ordering:

1. Update `package.json`.
2. Update `CITATION.cff`.
3. Add a top `CHANGELOG.md` entry with the same version.
4. Run `npm run check`.
5. Run `npm pack --dry-run`.
6. Commit and push.
7. Create and push tag `v<package version>`.
8. Publish the GitHub release from the same tag.

Partial failure:

- If checks fail, do not tag.
- If tagging succeeds but release publication fails, retry release publication
  from the existing tag instead of moving the tag.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-REL-001:S1 | test | `tests/release-versioning.test.mjs` | `npm run test:project` | verified |
| REQ-REL-002:S1 | test | `tests/release-versioning.test.mjs` | `npm run test:project` | verified |
| REQ-REL-003:S1 | manual release guardrail | release checklist in this spec | tag and release command after `npm run check` | mapped |
| REQ-REL-004:S1 | test | `tests/release-versioning.test.mjs` | `npm run test:project` | verified |
