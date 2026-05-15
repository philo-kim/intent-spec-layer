import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("package version matches latest changelog release heading", () => {
  // @Spec(REQ-REL-001:S1) verification_status=verified
  const pkg = JSON.parse(read("package.json"));
  const changelog = read("CHANGELOG.md");
  const heading = changelog.match(/^## \[([^\]]+)\] - \d{4}-\d{2}-\d{2}$/mu);

  assert.ok(heading, "CHANGELOG.md should start with a versioned release heading");
  assert.equal(pkg.version, heading[1]);
});

test("package manifest exposes public reuse metadata and file boundaries", () => {
  // @Spec(REQ-REL-002:S1) verification_status=verified
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.private, false);
  assert.equal(pkg.license, "SEE LICENSE IN LICENSE");
  assert.equal(pkg.homepage, "https://philo-kim.github.io/intent-spec-layer/");
  assert.equal(pkg.repository.type, "git");
  assert.equal(pkg.repository.url, "git+https://github.com/philo-kim/intent-spec-layer.git");
  assert.equal(pkg.bugs.url, "https://github.com/philo-kim/intent-spec-layer/issues");
  assert.ok(pkg.keywords.includes("spec-driven-development"));
  assert.ok(pkg.keywords.includes("verification"));
  assert.ok(pkg.files.includes("spec"));
  assert.ok(pkg.files.includes("scripts"));
  assert.ok(pkg.files.includes("templates"));
  assert.ok(pkg.files.includes("experiments"));
  assert.ok(pkg.files.includes("tests"));
});
