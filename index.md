# Intent Specification Layer

A repository-native specification layer for AI-assisted coding.

The core rule:

```text
docs/ explains.
spec/ governs.
```

The layer is bidirectional:

- before implementation, it reduces AI and human guesswork;
- after implementation, it lets reviewers find missing UX, domain, and failure
  behavior without reading all the code first.

## Start Here

- [Guide](guide/intent-specification-layer.md)
- [Spec review loop](guide/spec-review-loop.md)
- [Spec-to-test bridge](guide/spec-to-test-bridge.md)
- [Adoption playbook](guide/adoption.md)
- [Naming and structure decision](guide/naming-and-structure.md)
- [Feature spec template](templates/feature-spec.md)
- [Experience review template](templates/experience-review.md)
- [Spec review finding template](templates/spec-review-finding.md)
- [Review ledger template](templates/review-ledger.md)
- [Coupon-order example](examples/coupon-order-system/spec.md)
- [Heading-style EARS example](examples/account-session-heading-style/spec.md)
- [Research notes](research/method-comparison.md)

## Model

| Layer | Purpose | Required when |
|---|---|---|
| L0 Constitution | Product-wide values, authorities, forbidden shortcuts | Always |
| L1 Domain Truth | Entities, states, vocabulary, invariants, ownership | Shared concepts or 2+ modules |
| L2 Behavior Spec | EARS requirements for system response | Every behavior change |
| L3 Interface Contract | Ordering, payloads, idempotency, rollback, partial failure | Multi-step or cross-resource mutation |

## Evidence

Run the local experiments:

```bash
npm run check
```

Generate REQ-ID statement test stubs and the verification report:

```bash
npm run req:test:generate
```

Current diagnostic results:

| Method | Information sufficiency | LLM-style runtime simulation |
|---|---:|---:|
| PRD | 0.000 | 2/15 |
| BDD/Gherkin | 0.100 | 5/15 |
| EARS only | 0.513 | 11/15 |
| Domain + EARS | 0.750 | 12/15 |
| Full Spec Layer | 1.000 | 15/15 |
