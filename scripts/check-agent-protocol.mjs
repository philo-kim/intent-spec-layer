import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "guide/agent-operating-protocol.md",
  "templates/agent-task-brief.md",
  "README.md",
  "index.md",
  "docs/index.md",
];

const requiredContent = [
  {
    file: "AGENTS.md",
    checks: [
      "guide/agent-operating-protocol.md",
      "Accepted future behavior belongs in `spec/`",
      "Generated requirement stubs are trace slots, not validation evidence.",
      "A finding is a release blocker only after authority, target release scope",
      "Common-sense edge cases are valuable",
    ],
  },
  {
    file: "guide/agent-operating-protocol.md",
    checks: [
      "spec = authoritative intent",
      "evidence = implementation proof",
      "ledger = review and readiness trail",
      "generated = trace scaffolding",
      "Release Blocker Test",
      "Edge-Case Discovery Loop",
      "Generated stubs are required but insufficient.",
    ],
  },
  {
    file: "templates/agent-task-brief.md",
    checks: [
      "Task Mode",
      "Authority",
      "Edge-Case Prompt",
      "Release Impact",
      "Verification Plan",
      "Stop Conditions",
    ],
  },
  {
    file: "templates/review-ledger.md",
    checks: [
      "Authority basis",
      "Release impact",
      "edge_case_gap",
      "Edge-Case Candidates",
      "Release Impact Pass",
    ],
  },
  {
    file: "templates/spec-review-checklist.md",
    checks: [
      "Accepted future behavior remains in `spec/`",
      "Common-sense edge cases are marked with an authority basis",
      "No finding is marked `blocker` unless authority",
    ],
  },
  {
    file: "README.md",
    checks: [
      "[Agent operating rules](AGENTS.md)",
      "[Agent operating protocol](guide/agent-operating-protocol.md)",
      "[Agent task brief template](templates/agent-task-brief.md)",
    ],
  },
];

const failures = [];

function normalizeText(value) {
  return value.replace(/\s+/gu, " ").trim();
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Missing required agent protocol file: ${file}`);
  }
}

for (const item of requiredContent) {
  const fullPath = path.join(root, item.file);
  if (!fs.existsSync(fullPath)) continue;
  const text = fs.readFileSync(fullPath, "utf8");
  const normalizedText = normalizeText(text);
  for (const needle of item.checks) {
    if (!normalizedText.includes(normalizeText(needle))) {
      failures.push(`${item.file} is missing required phrase: ${needle}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Agent protocol check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Agent protocol guardrails OK.");
