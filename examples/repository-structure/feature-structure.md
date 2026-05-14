# Feature Structure Example

Use this when authority sources and change cadence differ by domain slice.

```text
spec/
  README.md
  00_constitution.md
  features/
    account-access/spec.md
    billing/spec.md
    project-workflow/spec.md
    deletion/spec.md
  changes/
  templates/
  schemas/
  experiments/
```

Best fit:

- different upstream authorities;
- feature teams or reviewers differ;
- some slices need L3 and others do not;
- generated artifacts differ per feature.
