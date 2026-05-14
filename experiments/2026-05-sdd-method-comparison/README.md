# SDD Method Comparison Experiment

Date: 2026-05-15

This experiment evaluates whether candidate middle-document methods provide
enough explicit information to prevent known defect classes.

It is intentionally local and deterministic. It does not claim that every LLM
will generate code with the exact same pass rate. It measures a prerequisite:
whether the spec contains the decisions an AI would otherwise have to guess.

Run:

```bash
npm run benchmark
```

Inputs:

- `case.json`: defect controls and required signals.
- `specs/*.md`: candidate spec formats.
- `evaluate.mjs`: deterministic evaluator.

Outputs:

- `results.json`
- `results.md`

Compared methods:

1. PRD
2. BDD/Gherkin
3. EARS only
4. Domain model + EARS
5. Full Spec Layer: Layer 0 + 1 + 2 + 3
