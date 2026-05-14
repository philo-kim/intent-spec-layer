# LLM Codegen Simulation

Date: 2026-05-15

This experiment is the practical counterpart to the information-sufficiency
benchmark.

Instead of only checking whether a spec contains required signals, it includes
five concrete implementations that simulate what an LLM would build when asked
to follow each spec level:

1. PRD
2. BDD/Gherkin
3. EARS only
4. Domain model + EARS
5. Full Spec Layer: 0 + 1 + 2 + 3

Important limitation: the authoring LLM has already seen the hidden test themes,
so this is not a statistically blind model benchmark. To reduce contamination,
each implementation is deliberately constrained to behavior that is present in
the corresponding spec level.

Run:

```bash
npm run simulate
```

Outputs:

- `results.json`
- `results.md`
