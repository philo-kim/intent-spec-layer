import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const homepage = "https://philo-kim.github.io/intent-spec-layer/";
const repository = "https://github.com/philo-kim/intent-spec-layer";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function headerPages() {
  const config = read("_config.yml");
  const lines = config.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === "header_pages:");
  assert.notEqual(start, -1, "_config.yml should declare header_pages");
  const pages = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith("  - ")) break;
    pages.push(line.slice(4).trim());
  }
  return pages;
}

test("GitHub Pages navigation is curated for onboarding and evidence", () => {
  // @Spec(REQ-DISC-001:S1) verification_status=verified
  const pages = headerPages();

  assert.ok(pages.length > 0);
  assert.ok(pages.length <= 8, "primary navigation should stay compact");
  assert.ok(pages.includes("index.md"));
  assert.ok(pages.includes("AGENTS.md"));
  assert.ok(pages.includes("guide/intent-specification-layer.md"));
  assert.ok(pages.includes("generated/verification-report.md"));
  assert.ok(!pages.some((page) => page.startsWith("templates/")));
  assert.ok(!pages.some((page) => page.startsWith("examples/")));
  assert.ok(!pages.some((page) => page.startsWith("experiments/")));
});

test("repository and homepage metadata align across public surfaces", () => {
  // @Spec(REQ-DISC-002:S1) verification_status=verified
  const pkg = JSON.parse(read("package.json"));
  const discovery = read("docs/github-discovery.md");

  assert.equal(pkg.homepage, homepage);
  assert.equal(pkg.repository.url, `git+${repository}.git`);
  assert.match(discovery, new RegExp(repository.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(discovery, new RegExp(homepage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("README labels experiment results as diagnostic rather than universal benchmark", () => {
  // @Spec(REQ-DISC-003:S1) verification_status=verified
  const readme = read("README.md");

  assert.match(readme, /not universal model benchmarks/u);
  assert.match(readme, /diagnostic checks/u);
});
