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

test("feature template forces archetype, latency, and valid-input review", () => {
  // @Spec(REQ-AUTHOR-001:S1, REQ-AUTHOR-002:S1, REQ-AUTHOR-003:S1, REQ-AUTHOR-004:S1) verification_status=verified
  const template = read("templates/feature-spec.md");

  assert.match(template, /## Feature Archetype Packs/u);
  assert.match(template, /### Latency \/ Processing Contract/u);
  assert.match(template, /### Valid Input Failure Rule/u);
  assert.match(template, /under-decomposition|valid input failure|empty manual fallback/iu);
});

test("authoring guardrail is part of the repository check suite", () => {
  // @Spec(REQ-AUTHOR-005:S1) verification_status=verified
  const pkg = JSON.parse(read("package.json"));
  const script = read("scripts/check-spec-authoring.mjs");

  assert.equal(pkg.scripts["check:authoring"], "node scripts/check-spec-authoring.mjs");
  assert.match(pkg.scripts.check, /check:authoring/u);
  assert.match(script, /Spec authoring guardrails OK/u);
});
