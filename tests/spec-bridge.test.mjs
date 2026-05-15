import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("verification report separates generated-only statements from non-generated traces", () => {
  // @Spec(REQ-BRIDGE-002:S1) verification_status=verified
  const report = read("generated/verification-report.md");

  assert.match(report, /## Pending Generated-Only Statements/u);
  assert.match(report, /## Non-Generated @Spec References/u);
  assert.match(report, /A non-generated trace is not automatically execution proof/u);
});

test("project tests provide non-generated statement traces", () => {
  // @Spec(REQ-BRIDGE-004:S1) verification_status=verified
  const manifest = JSON.parse(read("generated/requirements.json"));

  assert.ok(manifest.totals.nonGeneratedSpecReferences > 0);
  assert.ok(manifest.realSpecReferences.some((reference) => reference.source.startsWith("tests/")));
  assert.ok(manifest.realSpecReferences.some((reference) => reference.source.startsWith("scripts/")));
  assert.ok(
    manifest.realSpecReferences.some((reference) => reference.id === "REQ-BRIDGE-004:S1"),
    "bridge test should trace its governing statement",
  );
});
