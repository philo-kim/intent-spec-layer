import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("agent mode router maps broad requests to explicit modes", () => {
  // @Spec(REQ-AGENT-006:S1) verification_status=verified
  const router = read("guide/agent-mode-router.md");

  assert.match(router, /Routing Table/u);
  assert.match(router, /Spec authoring/u);
  assert.match(router, /Implementation audit/u);
  assert.match(router, /Evidence mapping/u);
  assert.match(router, /Release audit/u);
  assert.match(router, /Method update/u);
});

test("latest ILS requests route to method update propagation", () => {
  // @Spec(REQ-AGENT-006:S2) verification_status=verified
  const router = read("guide/agent-mode-router.md");

  assert.match(router, /Apply latest ILS/u);
  assert.match(router, /upstream rule/u);
  assert.match(router, /Method update/u);
  assert.match(router, /feature-spec propagation audit/u);
});

test("completion claims require mode-specific status", () => {
  // @Spec(REQ-AGENT-006:S3) verification_status=verified
  const router = read("guide/agent-mode-router.md");
  const brief = read("templates/agent-task-brief.md");

  assert.match(router, /Completion Claim Contract/u);
  assert.match(router, /done`, `complete`, `ready`/u);
  assert.match(router, /partial/u);
  assert.match(router, /blocked/u);
  assert.match(router, /unverified/u);
  assert.match(brief, /Completion status: complete \/ partial \/ blocked \/ unverified \/ manual_only/u);
});
