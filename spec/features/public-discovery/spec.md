---
id: SPEC-PUBLIC-DISCOVERY
title: Public Discovery
status: active
owners: [maintainers]
updated: 2026-05-15
layers: [L0, L1, L2]
target_release: v0.2.0
---

# Public Discovery Spec

## Scope

README positioning, GitHub Pages navigation, repository metadata, and discovery
notes for public sharing.

## Authority Sources

- README: `README.md`
- Pages config: `_config.yml`
- Discovery notes: `docs/github-discovery.md`
- Launch draft: `docs/korean-community-launch.md`

## Layer 1: Domain Truth

| Term | Meaning | Source of truth |
|---|---|---|
| `homepage` | Public GitHub Pages URL | repository metadata and `package.json` |
| `primary navigation` | Curated Pages links visible in the header | `_config.yml` |
| `discovery note` | Operational record for repository sharing | `docs/github-discovery.md` |

## Layer 2: Behavior Spec

- [REQ-DISC-001][Ubiquitous] GitHub Pages primary navigation shall expose only
  curated onboarding and evidence surfaces, not every template, internal
  experiment, or generated page.
- [REQ-DISC-002][Event-driven] When repository discovery metadata changes, the
  package metadata and public docs shall keep the same repository and homepage
  targets.
- [REQ-DISC-003][Unwanted] If public experiment results are shared, then the
  README shall state that the results are diagnostic checks and not universal
  model benchmarks.

## Verification Map

| Requirement / statement | Verification type | Evidence target | Execution / record | Status |
|---|---|---|---|---|
| REQ-DISC-001:S1 | test | `tests/public-discovery.test.mjs` | `npm run test:project` | verified |
| REQ-DISC-002:S1 | test | `tests/public-discovery.test.mjs` | `npm run test:project` | verified |
| REQ-DISC-003:S1 | test | `tests/public-discovery.test.mjs` | `npm run test:project` | verified |
