# Global Structure Example

Use this when one domain model governs most of the product.

```text
spec/
  README.md
  00_constitution.md
  01_domain.md
  02_behavior/
    onboarding.md
    payments.md
    notifications.md
  03_contracts/
    payments.md
    deletion.md
  changes/
  schemas/
```

Best fit:

- one tight domain vocabulary;
- one product authority model;
- many features sharing the same entities and states.
