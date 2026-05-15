import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("method update guide separates governance install from propagation audit", () => {
  // @Spec(REQ-AGENT-005:S1, REQ-AGENT-005:S2, REQ-AGENT-005:S3) verification_status=verified
  const guide = read("guide/method-update-propagation.md");

  assert.match(guide, /governance install/u);
  assert.match(guide, /authoritative spec inventory/u);
  assert.match(guide, /feature-spec propagation audit/u);
  assert.match(guide, /residual gap ledger/u);
  assert.match(guide, /pending_spec_review/u);
  assert.match(guide, /`partial`, not `complete`/u);
});

test("method update template requires concrete inventory and residual gaps", () => {
  // @Spec(REQ-AGENT-005:S2, REQ-AGENT-005:S3) verification_status=verified
  const template = read("templates/method-update-propagation.md");

  assert.match(template, /Authoritative Spec Inventory/u);
  assert.match(template, /Do not write "all specs reviewed"/u);
  assert.match(template, /reviewed \/ pending_spec_review/u);
  assert.match(template, /Residual Gaps/u);
  assert.match(template, /Completion status: complete \/ partial/u);
});

test("agent entrypoints expose method update propagation mode", () => {
  // @Spec(REQ-AGENT-005:S1) verification_status=verified
  const agents = read("AGENTS.md");
  const protocol = read("guide/agent-operating-protocol.md");
  const brief = read("templates/agent-task-brief.md");

  assert.match(agents, /Method Update Propagation Reflex/u);
  assert.match(protocol, /Method Update Propagation/u);
  assert.match(brief, /Method update \/ upstream rule propagation/u);
});
