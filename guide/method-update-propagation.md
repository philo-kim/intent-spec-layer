# Method Update Propagation

Use this guide when applying a newer ILS version, rule, template, or upstream
method change to an existing project.

A method update is not complete when the repository receives the new guide,
README text, templates, or scripts. It is complete only after the new rule has
been propagated through the in-scope authoritative specs, or every unreviewed
area is explicitly recorded as out of scope or still pending.

## The Failure This Prevents

The common AI failure is:

```text
1. read new upstream method
2. add the rule to project governance
3. regenerate artifacts
4. report done
```

That is only a governance install. It does not prove that existing feature
specs were re-read under the new rule.

The correct shape is:

```text
method update
  -> governance install
  -> authoritative spec inventory
  -> feature-spec propagation audit
  -> accepted spec edits
  -> verification bridge update
  -> residual gap ledger
  -> final report
```

## Required Completion Criteria

Before reporting a method update as complete, the agent must provide:

- the upstream rule or version applied;
- the authoritative spec inventory reviewed;
- every spec file excluded from scope and why;
- the archetype packs or review prompts applied to each feature spec;
- accepted L1/L2/L3 edits made;
- candidate gaps left in the review ledger;
- generated artifact updates;
- verification commands and results.

If any authoritative feature spec was not reviewed, the correct final status is
`partial`, not `complete`.

## Propagation Audit

For each in-scope feature spec:

1. Read L0 and L1 first.
2. Identify the feature archetype packs that apply.
3. Review L2 for state, unwanted, latency, valid-input failure, permission,
   duplicate, stale-state, recovery, and user next-action behavior.
4. Review L3 when external services, async boundaries, deletion, money,
   entitlement, retry, idempotency, rollback, or partial failure are involved.
5. Remove implementation-readiness wording from normative L1/L2/L3.
6. Add accepted missing requirements to L2/L3.
7. Put implementation status in Verification Maps or review ledgers, not in
   normative specs.
8. Regenerate requirement artifacts.

## Inventory Format

Use a concrete file list, not a vague statement like "all specs reviewed."

| Spec file | In scope? | Archetype packs | Action | Residual status |
|---|---|---|---|---|
| `spec/02_behavior/auth.md` | yes | auth or account, external integration | added stale callback and backend sync failure requirements | no residual gap |
| `spec/02_behavior/import.md` | yes | source ingestion, external AI, async operation | added valid input failure and latency contract | `missing_test` |
| `spec/02_behavior/admin.md` | no | - | excluded: not in target release | out of scope |

## Residual Gap Discipline

A propagation audit often finds more than can be safely fixed in one pass. That
is acceptable only when the residual state is explicit.

Use these labels:

| Label | Meaning |
|---|---|
| `pending_spec_review` | The file was not reviewed under the new rule. |
| `candidate_edge_case` | A plausible edge case needs authority before becoming binding. |
| `accepted_spec_gap` | The requirement is accepted but not yet written into L2/L3. |
| `missing_implementation` | Accepted spec exists but reviewed code lacks it. |
| `missing_test` | Code may exist but no executed evidence proves it. |
| `blocked` | The next action is known but cannot currently run. |

Do not hide residual gaps behind "updated to latest." The point of ILS is to
make unfinished intent and evidence visible.

## Agent Report Template

Use this in the final response for method updates:

```md
Method update:
- Upstream rule/version:
- Governance installed:

Propagation audit:
- Specs reviewed:
- Specs excluded:
- Specs still pending:

Spec edits:
- L1:
- L2:
- L3:

Residual gaps:
- pending_spec_review:
- candidate_edge_case:
- accepted_spec_gap:
- missing_implementation:
- missing_test:

Verification:
- Generated artifacts:
- Commands:
- Result:

Completion:
- complete / partial
- Reason:
```

The word `complete` is reserved for the case where all in-scope authoritative
specs were inventoried, reviewed, updated or explicitly excluded, and the
verification bridge was regenerated.
