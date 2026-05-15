# Intent Specification Layer

A repository-native specification layer for AI-assisted coding.

Intent Specification Layer helps AI coding agents stop guessing, and stop
calling work done before behavior is verified.

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

## The Problem It Solves

AI agents can produce plausible code from vague natural language. The dangerous
failure is not that the code never runs. The dangerous failure is that the code
runs while unstated intent, edge cases, rollback rules, and verification remain
implicit.

This layer makes the agent work against explicit obligations:

```text
intent -> EARS behavior -> REQ/S statement ID -> verification obligation
       -> generated stub -> non-generated trace -> executed evidence
```

A generated test stub is not evidence. A code comment is not evidence. The
behavior is only complete when a real test, guardrail, smoke check, or named
manual UX/runtime review has run or been recorded.

## Quick Try

```bash
npm install
npm run check
```

The check regenerates and validates requirement artifacts, verifies local links,
runs agent protocol guardrails, runs generated requirement slots, and executes
the included method-comparison simulations.

## What This Is

This repository contains:

- an authoritative `spec/` folder that dogfoods the method for this project;
- a practical guide to the L0-L3 spec model;
- reusable templates for project constitutions and feature specs;
- a spec review loop for finding product and code gaps from the spec itself;
- a review ledger pattern that keeps spec-only findings separate from code
  evidence;
- a spec-as-product-standard rule that prevents agents from weakening accepted
  requirements just because implementation is missing;
- a method-update propagation protocol that prevents agents from stopping after
  governance files change while feature specs remain unaudited;
- an agent mode router that makes broad user requests choose a concrete
  workflow and completion rule before the agent acts;
- an agent operating protocol that keeps AI agents from confusing intent,
  evidence, review findings, and generated stubs;
- feature archetype packs that force predictable edge cases into review before
  implementation;
- a REQ-ID and statement-level verification bridge that turns each intent
  statement into a proof obligation, while keeping generated placeholders,
  planned evidence, non-generated traces, and executed verification separate;
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
7. Do not downgrade accepted specs to match incomplete code. If code is
   missing, record an implementation or evidence gap and keep the standard
   visible.
8. Every REQ-ID or statement ID should generate a test stub and map to a
   verification path, while generated stubs remain clearly marked as pending
   evidence.
9. A statement is not complete because a stub exists or an `@Spec(...)` trace is
   present. It is complete only when a real test, guardrail, smoke check, or
   named manual UX review has executed or recorded evidence for that statement.
10. Tools consume the source layer; they do not define it.
11. Use feature archetype packs to force common-sense edge-case discovery before
    implementation. Async work, source ingestion, external AI, approval,
    payment, auth, deletion, and external integration each have predictable
    failure surfaces.
12. If a user provides valid input and automation fails, the system must
    preserve that input and provide a recoverable draft, still-processing state,
    retry path, or actionable error. Do not collapse valid input into an empty
    manual-only fallback.
13. Customer-visible work that can outlive the generic API timeout needs an
    explicit latency contract: synchronous, endpoint-specific long request,
    polling, background job, or streaming.
14. Applying a new ILS version or upstream rule to an existing project requires
    a propagation audit across in-scope authoritative feature specs. Governance
    updates alone are not completion.
15. Broad completion language (`done`, `complete`, `ready`) is allowed only when
    the selected task mode's completion rule is satisfied.

## Standard, Not Snapshot

ILS specs are product and system standards, not implementation inventories.
When accepted spec and current code disagree, keep the accepted spec and record
an implementation or evidence gap. Do not downgrade accepted specs to match
incomplete code.

Use [Spec as product standard](guide/spec-as-product-standard.md) when an AI
agent is unsure whether to update the spec, code, tests, or review ledger.

## Start Here

- [Agent operating rules](AGENTS.md)
- [Project specs](spec/README.md)
- [Agent mode router](guide/agent-mode-router.md)
- [Agent operating protocol](guide/agent-operating-protocol.md)
- [Guide](guide/intent-specification-layer.md)
- [Spec as product standard](guide/spec-as-product-standard.md)
- [Method update propagation](guide/method-update-propagation.md)
- [Spec authoring quality](guide/spec-authoring-quality.md)
- [Adoption playbook](guide/adoption.md)
- [Spec review loop](guide/spec-review-loop.md)
- [Spec-to-test bridge](guide/spec-to-test-bridge.md)
- [Naming and structure decision](guide/naming-and-structure.md)
- [Research notes](research/method-comparison.md)
- [References](references.md)
- [GitHub discovery setup](docs/github-discovery.md)
- [Korean community launch draft](docs/korean-community-launch.md)
- [Feature spec template](templates/feature-spec.md)
- [Experience review template](templates/experience-review.md)
- [Change proposal template](templates/change-proposal.md)
- [Spec review finding template](templates/spec-review-finding.md)
- [Review ledger template](templates/review-ledger.md)
- [Method update propagation template](templates/method-update-propagation.md)
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

This repository now uses that shape for itself. Use a global structure when the
product has one unified domain. Use a feature structure when different domain
slices have different authorities, change cadences, or failure modes.

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

## For AI Agents

If an AI agent implements accepted behavior from this layer, the default action
is to create or update verification evidence in the same change. The agent
should not finish with only generated stubs, planned evidence, or `@Spec(...)`
breadcrumbs. Those are intermediate states. The implementation is complete only
when each touched statement is verified, manually recorded, or explicitly left
blocked with a reason.

If implementation evidence shows a behavior is missing, the agent should not
weaken the accepted spec. It should classify the mismatch as
`missing_implementation`, `partial_implementation`, `missing_test`, or
`wrong_code`, then update code and evidence or record the blocker.

If the task is to apply a newer ILS rule to a project, the agent should not
claim completion after updating AGENTS, README, templates, or generated files.
It must inventory the authoritative specs, audit in-scope feature specs under
the new rule, update accepted L1/L2/L3 text, regenerate artifacts, and list any
residual `pending_spec_review` or gap entries.

For broad requests, the agent should route the work through
[Agent mode router](guide/agent-mode-router.md) before editing. This makes the
completion claim depend on a mode-specific rule instead of the agent's memory or
confidence.

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
