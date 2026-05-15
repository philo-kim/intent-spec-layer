import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "guide/agent-mode-router.md",
  "guide/agent-operating-protocol.md",
  "guide/spec-as-product-standard.md",
  "guide/method-update-propagation.md",
  "templates/agent-task-brief.md",
  "templates/method-update-propagation.md",
  "README.md",
  "index.md",
  "docs/index.md",
];

const requiredContent = [
  {
    file: "AGENTS.md",
    // @Spec(REQ-AGENT-001:S1) verification_status=verified
    // @Spec(REQ-AGENT-002:S1) verification_status=verified
    checks: [
      "guide/agent-operating-protocol.md",
      "guide/agent-mode-router.md",
      "guide/spec-as-product-standard.md",
      "guide/method-update-propagation.md",
      "Accepted future behavior belongs in `spec/`",
      "Do not downgrade accepted specs",
      "Generated requirement stubs are trace slots, not validation evidence.",
      "Do not treat a non-generated `@Spec(...)` trace as final proof",
      "A finding is a release blocker only after authority, target release scope",
      "Common-sense edge cases are valuable",
      "Feature Archetype Reflex",
      "Valid input failure",
      "latency contract",
      "Implementation Reflex",
      "Method Update Propagation Reflex",
      "authoritative spec inventory",
      "Completion claim",
      "If no verification is added for changed behavior",
    ],
  },
  {
    file: "guide/agent-operating-protocol.md",
    // @Spec(REQ-AGENT-003:S1) verification_status=verified
    // @Spec(REQ-AGENT-004:S1, REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
    // @Spec(REQ-AGENT-005:S1) verification_status=verified
    // @Spec(REQ-AGENT-006:S1, REQ-AGENT-006:S3) verification_status=verified
    checks: [
      "Agent Mode Router",
      "spec = authoritative intent",
      "evidence = implementation proof",
      "ledger = review and readiness trail",
      "generated = trace scaffolding",
      "Spec Standard Reflex",
      "Do not downgrade accepted specs",
      "missing_implementation",
      "wrong_spec",
      "wrong_code",
      "Release Blocker Test",
      "Edge-Case Discovery Loop",
      "feature archetype packs",
      "valid input failure",
      "latency contract",
      "Generated stubs are required but insufficient.",
      "non-generated trace -> executed evidence",
      "Implementation Verification Reflex",
      "Method Update Propagation",
      "authoritative spec inventory",
      "feature-spec propagation audit",
      "pending_spec_review",
      "Completion: complete / partial",
      "Completion claim",
      "Mode-specific rule satisfied",
      "tests are not a later cleanup task",
    ],
  },
  {
    file: "guide/agent-mode-router.md",
    // @Spec(REQ-AGENT-006:S1, REQ-AGENT-006:S2, REQ-AGENT-006:S3) verification_status=verified
    checks: [
      "Agent Mode Router",
      "Routing Table",
      "Completion Claim Contract",
      "Method update",
      "Apply latest ILS",
      "completion rule",
      "partial",
      "blocked",
      "unverified",
      "manual_only",
    ],
  },
  {
    file: "guide/method-update-propagation.md",
    // @Spec(REQ-AGENT-005:S1, REQ-AGENT-005:S2, REQ-AGENT-005:S3) verification_status=verified
    checks: [
      "Method Update Propagation",
      "governance install",
      "authoritative spec inventory",
      "feature-spec propagation audit",
      "residual gap ledger",
      "pending_spec_review",
      "complete / partial",
      "The word `complete` is reserved",
    ],
  },
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
    file: "templates/agent-task-brief.md",
    // @Spec(REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
    // @Spec(REQ-AGENT-005:S1, REQ-AGENT-005:S3) verification_status=verified
    // @Spec(REQ-AGENT-006:S1, REQ-AGENT-006:S3) verification_status=verified
    checks: [
      "Task Mode",
      "Method update / upstream rule propagation",
      "Authority",
      "Standard / Evidence Boundary",
      "Do Not Downgrade",
      "missing_implementation",
      "Implementation Verification Obligation",
      "Edge-Case Prompt",
      "Feature Archetype Packs",
      "Latency And Valid Input Failure",
      "Method Update Propagation",
      "Specs still pending",
      "complete / partial",
      "Completion status",
      "Release Impact",
      "Verification Plan",
      "command/result, reviewer/date, or block reason",
      "Stop Conditions",
    ],
  },
  {
    file: "templates/method-update-propagation.md",
    // @Spec(REQ-AGENT-005:S1, REQ-AGENT-005:S2, REQ-AGENT-005:S3) verification_status=verified
    checks: [
      "Method Update Propagation Ledger",
      "Governance Install",
      "Authoritative Spec Inventory",
      "Propagation Audit",
      "Residual Gaps",
      "pending_spec_review",
      "Completion status: complete / partial",
    ],
  },
  {
    file: "templates/change-proposal.md",
    checks: [
      "Authority",
      "Target release",
      "Edge-Case Discovery",
      "Feature Archetype Packs",
      "Latency And Valid Input Failure",
      "Generated stubs create trace slots",
      "command/result, reviewer/date, or block reason",
      "Release Impact",
    ],
  },
  {
    file: "templates/experience-review.md",
    checks: [
      "Evidence Boundary",
      "implementation_status=unverified",
      "Edge-Case Candidates",
      "Code Evidence Review",
      "Release Impact",
    ],
  },
  {
    file: "templates/review-ledger.md",
    // @Spec(REQ-AGENT-004:S2, REQ-AGENT-004:S3) verification_status=verified
    checks: [
      "Authority basis",
      "Release impact",
      "Gap Taxonomy",
      "missing_implementation",
      "wrong_spec",
      "wrong_code",
      "edge_case_gap",
      "Edge-Case Candidates",
      "Release Impact Pass",
    ],
  },
  {
    file: "templates/spec-review-checklist.md",
    checks: [
      "Accepted future behavior remains in `spec/`",
      "Do not downgrade accepted specs",
      "Method Update Propagation",
      "pending_spec_review",
      "Common-sense edge cases are marked with an authority basis",
      "feature archetype packs",
      "empty manual-only fallback",
      "Real `@Spec(...)` traces are treated as trace evidence",
      "No finding is marked `blocker` unless authority",
    ],
  },
  {
    file: "README.md",
    checks: [
      "[Agent operating rules](AGENTS.md)",
      "[Agent mode router](guide/agent-mode-router.md)",
      "[Agent operating protocol](guide/agent-operating-protocol.md)",
      "[Method update propagation](guide/method-update-propagation.md)",
      "[Spec authoring quality](guide/spec-authoring-quality.md)",
      "[Agent task brief template](templates/agent-task-brief.md)",
      "For AI Agents",
    ],
  },
  {
    file: "schemas/frontmatter.schema.json",
    checks: [
      "adopted",
      "target_release",
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
