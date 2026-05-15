import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const reqIdSource = "REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*-\\d{3}[A-Z0-9]*";
const inlineRequirementPattern = new RegExp(`^-\\s+\\[(${reqIdSource})\\]\\[([A-Za-z-]+)\\]\\s+(.*)$`, "u");
const headingRequirementPattern = new RegExp(`^#{2,4}\\s+(${reqIdSource})(?:\\s+[—-]\\s*(.*)|\\s+(.*))?$`, "u");
const earsMarkerPattern = /^\*\*\[([A-Za-z-]+)\]\*\*/u;

const requiredContent = [
  {
    file: "guide/spec-as-product-standard.md",
    // @Spec(REQ-AGENT-004:S1, REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
    checks: [
      "Spec As Product Standard",
      "not implementation inventories",
      "Do not downgrade accepted specs",
      "implementation or evidence gap",
      "missing_implementation",
      "partial_implementation",
      "missing_test",
      "wrong_spec",
      "wrong_code",
      "decision_gap",
    ],
  },
  {
    file: "guide/spec-authoring-quality.md",
    // @Spec(REQ-AUTHOR-001:S1, REQ-AUTHOR-002:S1, REQ-AUTHOR-003:S1, REQ-AUTHOR-004:S1) verification_status=verified
    checks: [
      "Feature Archetype Packs",
      "Valid Input Failure Rule",
      "Latency / Processing Contract",
      "Under-Decomposition Warning",
      "Spec Is A Standard, Not A Code Summary",
      "missing_implementation",
      "empty manual-only fallback",
      "generic API timeout",
    ],
  },
  {
    file: "templates/feature-spec.md",
    // @Spec(REQ-AUTHOR-001:S1, REQ-AUTHOR-002:S1, REQ-AUTHOR-003:S1) verification_status=verified
    checks: [
      "## Feature Archetype Packs",
      "### Normative Boundary",
      "Implementation Gap Handling",
      "missing_implementation",
      "wrong_spec",
      "### Latency / Processing Contract",
      "### Valid Input Failure Rule",
      "empty manual-only fallback",
      "Source or file ingestion",
      "External AI or automation",
    ],
  },
  {
    file: "templates/spec-review-checklist.md",
    // @Spec(REQ-AUTHOR-004:S1) verification_status=verified
    checks: [
      "feature archetype packs",
      "latency / processing contract",
      "Valid input failure",
      "empty manual-only fallback",
      "under-decomposition",
      "Do not downgrade accepted specs",
    ],
  },
  {
    file: "templates/agent-task-brief.md",
    checks: [
      "Standard / Evidence Boundary",
      "Do Not Downgrade",
      "Feature Archetype Packs",
      "Latency And Valid Input Failure",
      "valid input + automation failure",
      "empty manual-only fallback risk",
    ],
  },
  {
    file: "AGENTS.md",
    // @Spec(REQ-AUTHOR-005:S1) verification_status=verified
    checks: [
      "Feature Archetype Reflex",
      "Valid input failure",
      "latency contract",
      "empty manual-only fallback",
      "Do not downgrade accepted specs",
    ],
  },
  {
    file: "README.md",
    checks: [
      "[Spec as product standard](guide/spec-as-product-standard.md)",
      "[Spec authoring quality](guide/spec-authoring-quality.md)",
      "Do not downgrade accepted specs",
      "feature archetype packs",
      "empty manual-only fallback",
      "explicit latency contract",
    ],
  },
  {
    file: "guide/spec-review-loop.md",
    checks: [
      "Archetype-Based Review",
      "Gap Ledger, Not Spec Downgrade",
      "missing_implementation",
      "wrong_spec",
      "Latency Contract Review",
      "Valid Input Failure Review",
      "empty manual-only fallback",
    ],
  },
];

const failures = [];
const warnings = [];

function normalizeText(value) {
  return value.replace(/\s+/gu, " ").trim().toLowerCase();
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(dir, predicate, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, acc);
    } else if (entry.isFile() && predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

for (const item of requiredContent) {
  const fullPath = path.join(root, item.file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${item.file} is missing.`);
    continue;
  }
  const normalized = normalizeText(fs.readFileSync(fullPath, "utf8"));
  for (const needle of item.checks) {
    if (!normalized.includes(normalizeText(needle))) {
      failures.push(`${item.file} is missing required authoring phrase: ${needle}`);
    }
  }
}

function specFiles() {
  const files = new Set();
  for (const file of walk(path.join(root, "spec", "features"), (candidate) => candidate.endsWith("spec.md"))) {
    files.add(file);
  }
  for (const file of walk(path.join(root, "examples"), (candidate) => path.basename(candidate) === "spec.md")) {
    files.add(file);
  }
  return [...files].sort();
}

function countStatementsByRequirement(text) {
  const lines = text.split(/\r?\n/u);
  const counts = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const inline = lines[index].match(inlineRequirementPattern);
    if (inline) {
      counts.set(inline[1], (counts.get(inline[1]) || 0) + 1);
      continue;
    }

    const heading = lines[index].match(headingRequirementPattern);
    if (!heading) continue;
    const requirementId = heading[1];
    let sectionEnd = lines.length;
    for (let lookahead = index + 1; lookahead < lines.length; lookahead += 1) {
      if (/^#{2,4}\s/u.test(lines[lookahead])) {
        sectionEnd = lookahead;
        break;
      }
    }
    let markerCount = 0;
    for (let bodyIndex = index + 1; bodyIndex < sectionEnd; bodyIndex += 1) {
      if (earsMarkerPattern.test(lines[bodyIndex])) {
        markerCount += 1;
      }
    }
    if (markerCount > 0) {
      counts.set(requirementId, (counts.get(requirementId) || 0) + markerCount);
    }
  }

  return counts;
}

// This is intentionally a warning, not a failure. Equal REQ/EARS counts are a
// smell, not proof of poor authoring.
for (const file of specFiles()) {
  const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
  const counts = countStatementsByRequirement(fs.readFileSync(file, "utf8"));
  const values = [...counts.values()];
  if (values.length >= 4 && values.every((count) => count === 1)) {
    warnings.push(
      `${relativePath}: every requirement has one statement; review for under-decomposition if this is customer-facing.`,
    );
  }
}

if (failures.length > 0) {
  console.error("Spec authoring quality check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn("Spec authoring quality warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

console.log("Spec authoring guardrails OK.");
