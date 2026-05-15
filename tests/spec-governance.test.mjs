import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function listSpecFiles(dir) {
  const fullDir = path.join(root, dir);
  const files = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const fullPath = path.join(fullDir, entry.name);
    const relativePath = path.relative(root, fullPath).replaceAll(path.sep, "/");
    if (entry.isDirectory()) {
      files.push(...listSpecFiles(relativePath));
    } else if (entry.isFile() && entry.name === "spec.md") {
      files.push(relativePath);
    }
  }
  return files.sort();
}

test("project governance specs exist and are discoverable", () => {
  // @Spec(REQ-GOV-001:S1) verification_status=verified
  const required = [
    "spec/README.md",
    "spec/00_constitution.md",
    "spec/features/spec-governance/spec.md",
    "spec/features/spec-to-test-bridge/spec.md",
    "spec/features/agent-operating-protocol/spec.md",
    "spec/features/spec-authoring-quality/spec.md",
    "spec/features/public-discovery/spec.md",
    "spec/features/release-and-versioning/spec.md",
  ];

  for (const relativePath of required) {
    assert.ok(fs.existsSync(path.join(root, relativePath)), `${relativePath} should exist`);
  }

  const index = read("spec/README.md");
  for (const relativePath of required.slice(2)) {
    assert.match(index, new RegExp(relativePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("feature specs map their local requirements to verification evidence", () => {
  // @Spec(REQ-GOV-002:S1) verification_status=verified
  for (const specPath of listSpecFiles("spec/features")) {
    const text = read(specPath);
    assert.match(text, /## Verification Map/u, `${specPath} should have a Verification Map`);

    const requirementIds = new Set(
      [...text.matchAll(/^- \[(REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3})\]\[[A-Za-z-]+\]/gmu)].map(
        (match) => match[1],
      ),
    );
    assert.ok(requirementIds.size > 0, `${specPath} should define requirements`);

    const verificationSection = text.slice(text.indexOf("## Verification Map"));
    for (const requirementId of requirementIds) {
      assert.match(verificationSection, new RegExp(`\\b${requirementId}(?::S\\d+)?\\b`, "u"));
    }
  }
});
