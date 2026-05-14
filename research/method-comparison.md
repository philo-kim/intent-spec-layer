# Method Comparison Notes

Date: 2026-05-15

## Question

What structure should govern AI-assisted coding so the system works across
projects instead of changing by taste each time?

## Conclusion

Use `spec/` as the repository-native Intent Specification Layer.

- `spec` is the operational name: a verifiable promise that code must satisfy.
- `intent` is the philosophy: preserving human/system intention so the AI does
  not have to guess.
- `layer` is the architecture concept: L0 Constitution, L1 Domain, L2 Behavior,
  L3 Contracts.
- The method is bidirectional: it guides implementation before code exists and
  exposes missing user journey, failure, and recovery behavior after code exists.

## Investigated Alternatives

### Project Rule Files

Examples: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, Kiro steering files.

Verdict: necessary but insufficient. They provide ambient constraints but do not
capture feature-specific behavior, unwanted cases, or rollback contracts.

### PRD

Verdict: useful for product alignment, insufficient as an AI implementation
contract. PRDs often assume humans will fill gaps with organizational context.
AI agents fill gaps too, but not reliably in the intended direction.

### GitHub Spec Kit

Observed facts:

- Treats specifications as the central source of truth.
- Uses a constitution to constrain architecture and implementation.
- Emphasizes implementable specs, plans, and tasks.
- Uses templates and commands to reduce ambiguity and premature implementation.

Verdict: strong workflow and philosophy. Best used as a tool that consumes
`spec/`, not as the only structure that owns project intent.

### Kiro Feature Specs

Observed facts:

- Supports requirements-first and design-first workflows.
- Requirements use EARS notation.
- Emphasizes clarity, testability, traceability, and completeness.

Verdict: validates EARS as a practical AI-coding requirement syntax. Avoid
locking the repository source layer to one IDE's folder convention.

### OpenSpec

Observed facts:

- Uses change proposals before code.
- Describes deltas and archives accepted changes.
- Works well for brownfield evolution.

Verdict: strong delta workflow. Borrow the `changes/` idea, but keep current
governing specs explicit.

### BMAD Method

Observed facts:

- Provides structured workflows and specialized roles.
- Targets full lifecycle planning and implementation.
- Useful when planning itself is large.

Verdict: useful for complex planning, too heavy as the default for ordinary
feature work. Its outputs should still anchor back to `spec/`.

### Augment Intent

Observed facts:

- Treats specs as source of truth.
- Tries to reduce drift with agent-updated specs.
- Uses coordinator and specialist agents.

Verdict: directly attacks spec drift. The repository folder should remain
tool-neutral as `spec/`.

### EARS

Observed facts:

- EARS reduces ambiguity, complexity, and vagueness in natural-language
  requirements.
- The unwanted-behavior pattern is valuable because undesired situations are a
  common source of omissions.

Verdict: best Layer 2 syntax because it keeps natural language while forcing
testable behavior categories.

## Local Empirical Checks

Two local checks are included:

1. `npm run benchmark`
   - Measures whether a candidate spec explicitly contains behavior,
     vocabulary, interface, constitution, and traceability signals.
   - Result: PRD 0.000, BDD 0.100, EARS 0.513, Domain+EARS 0.750, Full Spec
     Layer 1.000.

2. `npm run simulate`
   - Uses concrete implementations constrained to each spec level and runs the
     same 15 tests against all of them.
   - Result: PRD 2/15, BDD 5/15, EARS 11/15, Domain+EARS 12/15, Full Spec Layer
     15/15.

The simulation is not fully blind because the same author created the
experiment. Its value is diagnostic: failures appear exactly where a layer is
missing.
