# Intent Specification Layer

A repository-native specification layer for AI-assisted coding.

The core rule is simple:

> `docs/` explains. `spec/` governs.

AI coding fails when unstated intent becomes implementation guesswork. PRDs,
chat prompts, and plan-mode outputs often describe the happy path while leaving
authority, vocabulary, unwanted behavior, rollback, and drift controls implicit.
The Intent Specification Layer turns those implicit decisions into a reviewable
model of user experience and system behavior.

It is bidirectional:

- before implementation, it reduces AI and human guesswork;
- after implementation, it lets reviewers find missing UX, domain, and failure
  behavior without reading all the code first.

## What This Is

This repository contains:

- a practical guide to the L0-L3 spec model;
- reusable templates for project constitutions and feature specs;
- a spec review loop for finding product and code gaps from the spec itself;
- a review ledger pattern that keeps spec-only findings separate from code
  evidence;
- an agent operating protocol that keeps AI agents from confusing intent,
  evidence, review findings, and generated stubs;
- a REQ-ID and statement-level test-stub bridge that keeps generated
  placeholders, planned evidence, and real verification separate;
- a worked coupon-order example;
- two reproducible experiments that compare PRD, BDD, EARS, Domain+EARS, and
  the full spec layer;
- repository health files for citation, licensing, contributions, and releases.

## The Model

| Layer | Purpose | Required when |
|---|---|---|
| L0 Constitution | Product-wide values, authorities, forbidden shortcuts | Always |
| L1 Domain Truth | Entities, states, vocabulary, invariants, ownership | Shared concepts or 2+ modules |
| L2 Behavior Spec | EARS requirements for system response | Every behavior change |
| L3 Interface Contract | Ordering, payloads, idempotency, rollback, partial failure | Multi-step or cross-resource mutation |

Minimum rule set:

1. L0 always exists.
2. Behavior changes require L2.
3. Shared terms require L1.
4. Partial failure, rollback, retry, deletion, payment, entitlement, or
   idempotency requires L3.
5. A reviewer should be able to understand the intended user journey from the
   spec before reading implementation code.
6. Accepted future behavior belongs in `spec/`; implementation readiness belongs
   in tests, evidence records, or review ledgers.
7. Every REQ-ID or statement ID should generate a test stub and map to
   verification, while generated stubs remain clearly marked as pending
   evidence.
8. Tools consume the source layer; they do not define it.

## Start Here

- [Agent operating rules](AGENTS.md)
- [Agent operating protocol](guide/agent-operating-protocol.md)
- [Guide](guide/intent-specification-layer.md)
- [Adoption playbook](guide/adoption.md)
- [Spec review loop](guide/spec-review-loop.md)
- [Spec-to-test bridge](guide/spec-to-test-bridge.md)
- [Naming and structure decision](guide/naming-and-structure.md)
- [Research notes](research/method-comparison.md)
- [References](references.md)
- [Feature spec template](templates/feature-spec.md)
- [Experience review template](templates/experience-review.md)
- [Spec review finding template](templates/spec-review-finding.md)
- [Review ledger template](templates/review-ledger.md)
- [Agent task brief template](templates/agent-task-brief.md)
- [Coupon-order example](examples/coupon-order-system/spec.md)
- [Heading-style EARS example](examples/account-session-heading-style/spec.md)
- [Frontmatter schema](schemas/frontmatter.schema.json)

## Repository Shape

```text
spec/
  README.md
  00_constitution.md
  features/<feature>/spec.md
  changes/
  reviews/
  schemas/

docs/
  narrative documentation, design notes, research, history
```

Use a global structure when the product has one unified domain. Use a feature
structure when different domain slices have different authorities, change
cadences, or failure modes.

## Evidence

Run the local checks:

```bash
npm run check
```

This checks syntax, local Markdown links, generated requirement artifacts,
agent operating protocol guardrails, generated statement stubs, the generated
verification report, the benchmark, and the simulation.

Current diagnostic results:

| Method | Information sufficiency | LLM-style runtime simulation |
|---|---:|---:|
| PRD | 0.000 | 2/15 |
| BDD/Gherkin | 0.100 | 5/15 |
| EARS only | 0.513 | 11/15 |
| Domain + EARS | 0.750 | 12/15 |
| Full Spec Layer | 1.000 | 15/15 |

These are not universal model benchmarks. They are diagnostic checks showing
which failure classes remain implicit when a layer is missing.

## Relationship To Existing SDD Tools

This project is not a replacement for Spec Kit, OpenSpec, Kiro, BMAD, Augment
Intent, or plan-mode workflows. It is the source layer those tools can consume.

The distinction:

- SDD tools help execute a workflow.
- This layer defines and reviews what must remain true.

## Status

This is an initial public version. The method is usable today, but the empirical
checks are deliberately small and should be expanded across more domains,
models, and real projects.

## Cite

Use the GitHub "Cite this repository" control or see [CITATION.cff](CITATION.cff).

## License

- Guide and research notes: CC BY 4.0. See
  [LICENSE-DOCS.md](LICENSE-DOCS.md).
- Templates, examples, scripts, and executable experiment code: MIT. See
  [LICENSE-CODE.md](LICENSE-CODE.md).
