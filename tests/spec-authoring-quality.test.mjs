import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("authoring guide exposes archetype packs and recovery rules", () => {
  // @Spec(REQ-AUTHOR-001:S1, REQ-AUTHOR-002:S1, REQ-AUTHOR-003:S1) verification_status=verified
  const guide = read("guide/spec-authoring-quality.md");

  assert.match(guide, /Feature Archetype Packs/u);
  assert.match(guide, /Valid Input Failure Rule/u);
  assert.match(guide, /Latency \/ Processing Contract/u);
  assert.match(guide, /empty\s+manual-only fallback/u);
});

test("standard guide prevents code-summary downgrade", () => {
  // @Spec(REQ-AGENT-004:S1, REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
  const guide = read("guide/spec-as-product-standard.md");

  assert.match(guide, /Spec As Product Standard/u);
  assert.match(guide, /not implementation inventories/u);
  assert.match(guide, /Do not downgrade accepted specs/u);
  assert.match(guide, /missing_implementation/u);
  assert.match(guide, /partial_implementation/u);
  assert.match(guide, /missing_test/u);
  assert.match(guide, /wrong_spec/u);
  assert.match(guide, /wrong_code/u);
});

test("feature template forces archetype, latency, and valid-input review", () => {
  // @Spec(REQ-AUTHOR-001:S1, REQ-AUTHOR-002:S1, REQ-AUTHOR-003:S1, REQ-AUTHOR-004:S1) verification_status=verified
  const template = read("templates/feature-spec.md");

  assert.match(template, /## Feature Archetype Packs/u);
  assert.match(template, /### Latency \/ Processing Contract/u);
  assert.match(template, /### Valid Input Failure Rule/u);
  assert.match(template, /under-decomposition|valid input failure|empty manual fallback/iu);
});

test("agent templates preserve standard and evidence boundary", () => {
  // @Spec(REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
  const taskBrief = read("templates/agent-task-brief.md");
  const ledger = read("templates/review-ledger.md");
  const finding = read("templates/spec-review-finding.md");

  assert.match(taskBrief, /Standard \/ Evidence Boundary/u);
  assert.match(taskBrief, /Do Not Downgrade/u);
  assert.match(ledger, /Gap Taxonomy/u);
  assert.match(ledger, /missing_implementation/u);
  assert.match(ledger, /wrong_code/u);
  assert.match(finding, /Implementation Gap Label/u);
  assert.match(finding, /Use `remove` only for `wrong_spec`/u);
});

test("authoring guardrail is part of the repository check suite", () => {
  // @Spec(REQ-AUTHOR-005:S1) verification_status=verified
  const pkg = JSON.parse(read("package.json"));
  const script = read("scripts/check-spec-authoring.mjs");

  assert.equal(pkg.scripts["check:authoring"], "node scripts/check-spec-authoring.mjs");
  assert.match(pkg.scripts.check, /check:authoring/u);
  assert.match(script, /Spec authoring guardrails OK/u);
});
