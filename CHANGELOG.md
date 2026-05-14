# Changelog

This project follows the spirit of Keep a Changelog.

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
