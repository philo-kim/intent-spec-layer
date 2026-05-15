# Method Update Propagation Ledger

Use this ledger when applying a new ILS version, upstream rule, template, or
authoring-quality standard to an existing project.

## Update Scope

| Field | Value |
|---|---|
| Upstream rule/version |  |
| Date |  |
| Agent / reviewer |  |
| Target project |  |
| Target release or scope |  |

## Governance Install

| Surface | Updated? | Evidence |
|---|---|---|
| AGENTS / AI entrypoint | yes / no / not applicable |  |
| README / project guide | yes / no / not applicable |  |
| Templates | yes / no / not applicable |  |
| Scripts / guardrails | yes / no / not applicable |  |
| Generated artifacts | yes / no / not applicable |  |

## Authoritative Spec Inventory

Do not write "all specs reviewed" without listing the files.

| Spec file | In scope? | Reason if excluded | Review status |
|---|---|---|---|
| `spec/...` | yes / no |  | reviewed / pending_spec_review |

## Propagation Audit

| Spec file | Archetype packs applied | Accepted edits | Residual gap |
|---|---|---|---|
| `spec/...` | async / source ingestion / external AI / approval / payment / auth / deletion / external integration | L1 / L2 / L3 / none | none / candidate_edge_case / accepted_spec_gap / missing_implementation / missing_test / blocked |

## Residual Gaps

| Gap ID | Label | Spec file | Authority basis | Next action |
|---|---|---|---|---|
| GAP-XXX-001 | pending_spec_review / candidate_edge_case / accepted_spec_gap / missing_implementation / missing_test / blocked |  | L0 / L1 / product / platform / common UX / sample import |  |

## Verification

| Check | Result |
|---|---|
| Requirement artifacts regenerated | yes / no |
| Link check | pass / fail / not run |
| Project check | pass / fail / not run |
| Remaining blocked checks |  |

## Completion

Completion status: complete / partial

Reason:

-
