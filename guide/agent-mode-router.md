# Agent Mode Router

Use this page before choosing a workflow. ILS works best when an AI agent first
names the task mode, then follows that mode's completion rule.

The router exists because a single phrase like "review this", "apply latest",
or "verify it" can mean different work. The agent should not improvise the
workflow from memory.

## Routing Table

| User request shape | Mode | First move | Completion rule |
|---|---|---|---|
| "Write / update the spec" | Spec authoring | Identify authority, layer impact, and feature archetype packs. | L1/L2/L3 updated, requirements extractable, verification paths mapped. |
| "Build / fix this from the spec" | Implementation | List governing `REQ-...` / `REQ-...:Sx` IDs and verification obligations before code. | Code and real evidence updated, or unfinished statements reported as `blocked` / `manual_only`. |
| "This flow feels wrong" or "review the experience" | Reverse review | Read the spec as a user journey before code. | Candidate gaps classified with authority basis and next spec/code/evidence action. |
| "Check if the implementation matches" | Implementation audit | Inspect code/test/runtime evidence after authority and release-scope checks. | Gaps classified as `missing_implementation`, `partial_implementation`, `missing_test`, `wrong_code`, `wrong_spec`, or `decision_gap`. |
| "Make tests from specs" or "verify every REQ" | Evidence mapping | Map statement IDs to generated slots, non-generated traces, and executed evidence. | Generated artifacts current and evidence state reported per statement. |
| "Ready to launch?" | Release audit | Check authority, target release, implementation evidence, and core journey impact. | Release impact assigned only after all four blocker conditions are known. |
| "Apply latest ILS / upstream rule / new template" | Method update | Install governance, inventory authoritative specs, then run propagation audit. | Every in-scope spec reviewed or explicitly excluded; otherwise report `partial`. |

## Completion Claim Contract

The final answer should not use `done`, `complete`, `ready`, or equivalent
language unless the selected mode's completion rule is satisfied.

If the rule is not satisfied, report one of:

- `partial`: some in-scope work remains, such as `pending_spec_review`;
- `blocked`: the next required action is known but cannot currently run;
- `unverified`: code/spec changes exist but evidence has not executed;
- `manual_only`: manual review is the accepted evidence path and the record is
  named.

## Mode-Specific Guards

| Mode | Forbidden shortcut |
|---|---|
| Spec authoring | Writing only happy-path REQ IDs without archetype, unwanted, latency, and recovery review. |
| Implementation | Editing code before listing governing statements and verification obligations. |
| Reverse review | Calling code `missing` from spec-only review. |
| Implementation audit | Weakening accepted spec to match current code. |
| Evidence mapping | Counting generated stubs or `@Spec(...)` traces as executed proof. |
| Release audit | Calling something a blocker without authority, scope, evidence, and core-journey impact. |
| Method update | Stopping after AGENTS/README/templates/scripts/generated files change without feature-spec propagation audit. |

## Ambiguous Requests

When the user asks for broad work such as "check everything", "make it latest",
or "finish it", choose the narrowest mode that makes the final claim truthful.

Examples:

- "Apply the latest ILS to this project" means Method update, not only
  repository maintenance.
- "Spec says this exists; verify it" means Implementation audit, not spec
  authoring.
- "The page feels wrong" means Reverse review first, then code review if
  evidence is needed.
- "All spec tests" means Evidence mapping first, then Implementation only for
  accepted gaps.

If more than one mode applies, report the sequence explicitly instead of
collapsing it into a vague "done."
