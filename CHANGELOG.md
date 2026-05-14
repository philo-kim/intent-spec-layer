# Changelog

This project follows the spirit of Keep a Changelog.

## [0.1.7] - 2026-05-15

### Added

- Root `AGENTS.md` with compact operating rules for AI coding agents.
- Agent operating protocol guide.
- Agent task brief template for handing work to an AI agent.
- `check:agent` guardrail that verifies the agent entrypoints and core
  authority/evidence/release-impact reminders remain present.
- Authority, release scope, implementation evidence, review finding, and
  generated-artifact boundary rules.
- `adopted` lifecycle status for accepted behavior whose implementation may
  still be pending.
- Release impact fields in review finding and ledger templates.
- Edge-case discovery guidance for duplicate submit, stale state, permission,
  timeout, rollback, cancellation, expiry, retry, and recovery cases.

### Changed

- Clarified that accepted future behavior belongs in authoritative specs and
  should not be removed merely because code has not caught up.
- Strengthened review guidance so release blockers require authority, target
  release scope, implementation evidence, and core-journey impact.
- Updated checklists and templates to keep implementation readiness labels out
  of normative L1/L2/L3 behavior.
- Clarified that common-sense edge cases start as candidate findings until their
  authority basis is checked.
- Added the agent protocol guardrail to the default `npm run check` flow.

## [0.1.6] - 2026-05-15

### Added

- Review ledger template for multi-finding spec audits.
- Explicit status model for reverse spec review:
  `spec_status`, `implementation_status`, and `verification_status`.

### Changed

- Clarified that spec-only findings must start as
  `implementation_status=unverified` and must not be labeled missing,
  partial, or implemented without code/test/design/runtime evidence.
- Updated feature and review templates to track implementation and verification
  state separately from authoritative requirements.

## [0.1.5] - 2026-05-15

### Added

- Heading-style account session example that exercises multi-statement
  extraction in CI.
- Planned verification evidence in the generated verification report.

### Changed

- Multi-statement requirements now require statement-level Verification Map
  entries.
- Unknown `@Spec(...)` references now fail generated artifact checks.
- Broad `@Spec(REQ-...)` references are rejected for multi-statement
  requirements; use `REQ-...:S1` style IDs instead.
- Public docs and review checklists now describe statement-level verification
  rules more precisely.

## [0.1.4] - 2026-05-15

### Added

- Statement-level generated test stubs using IDs such as `REQ-XXX-001:S1`.
- Generated verification report that separates generated-only placeholders from
  real `@Spec(...)` traces.
- Heading-style EARS extraction for requirements with multiple statements.
- Spec review finding template with spec gap, code gap, both gap, and decision
  gap classifications.

### Changed

- Strengthened the spec-to-test bridge guide to state that generated stubs are
  not validation evidence.
- Updated templates and review checklists to track verification status, not just
  stub existence.

## [0.1.3] - 2026-05-15

### Added

- REQ-ID extraction and generated test-stub tool.
- `generated/requirements.json` and `generated/requirements.test.mjs`.
- Spec-to-test bridge guide.
- `npm run req:test:generate`, `npm run check:reqs`, and `npm run test:reqs`.

### Changed

- Full check now verifies generated REQ-ID test artifacts and runs the generated
  test stubs.

## [0.1.2] - 2026-05-15

### Added

- Frontmatter schema for feature specs.
- Local Markdown link checker.

### Changed

- Expanded the GitHub Pages landing page so it can stand alone when shared.
- Moved templates and examples under the MIT license to make reuse in real
  projects simpler.

## [0.1.1] - 2026-05-15

### Added

- Spec review loop for using specs as a defect-discovery surface after
  implementation.
- Experience review template for reconstructing user journeys from specs.
- Experience review section in the feature spec template.

### Changed

- Reframed the method as a bidirectional intent contract: forward from intent to
  code, reverse from spec review to missing UX and code corrections.

## [0.1.0] - 2026-05-15

### Added

- Initial Intent Specification Layer guide.
- L0-L3 model and layer-selection rules.
- Templates for constitution, feature specs, change proposals, and reviews.
- Coupon-order example.
- Method comparison experiment.
- LLM-style codegen simulation experiment.
- Repository health files and CI workflow.
