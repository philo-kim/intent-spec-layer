import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const generatedDir = path.join(root, "generated");
const requirementsJsonPath = path.join(generatedDir, "requirements.json");
const requirementsTestPath = path.join(generatedDir, "requirements.test.mjs");
const requirementLinePattern = /^-\s+\[(REQ-[A-Z0-9-]+)\]\[([A-Za-z-]+)\]\s+(.*)$/u;
const supportedPatterns = new Set([
  "Ubiquitous",
  "Event-driven",
  "State-driven",
  "Unwanted",
  "Optional",
]);

function usage() {
  console.log(`Usage:
  node scripts/generate-req-tests.mjs --write
  node scripts/generate-req-tests.mjs --check

Scans:
  spec/**/*.md
  examples/**/spec.md

Outputs:
  generated/requirements.json
  generated/requirements.test.mjs`);
}

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--help")) {
    usage();
    process.exit(0);
  }
  if (args.has("--write") === args.has("--check")) {
    usage();
    console.error("Choose exactly one of --write or --check.");
    process.exit(1);
  }
  return {
    mode: args.has("--write") ? "write" : "check",
  };
}

function walk(dir, predicate, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, acc);
      continue;
    }
    if (entry.isFile() && predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function findSpecFiles() {
  const files = new Set();
  for (const file of walk(path.join(root, "spec"), (candidate) => candidate.endsWith(".md"))) {
    files.add(file);
  }
  for (const file of walk(path.join(root, "examples"), (candidate) => path.basename(candidate) === "spec.md")) {
    files.add(file);
  }
  return [...files].sort();
}

function normalizeContinuation(line) {
  return line.trim().replace(/\s+/gu, " ");
}

function extractVerificationSection(text) {
  const headingMatch = /^## Verification Map\s*$/mu.exec(text);
  if (!headingMatch) return "";
  const bodyStart = headingMatch.index + headingMatch[0].length;
  const rest = text.slice(bodyStart);
  const nextHeadingMatch = /^##\s/mu.exec(rest);
  return nextHeadingMatch ? rest.slice(0, nextHeadingMatch.index) : rest;
}

function extractRequirements(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/u);
  const relativePath = path.relative(root, file);
  const verificationSection = extractVerificationSection(text);
  const verificationIds = new Set([...verificationSection.matchAll(/\bREQ-[A-Z0-9-]+\b/gu)].map((match) => match[0]));
  const requirements = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(requirementLinePattern);
    if (!match) continue;

    const [, id, pattern, firstText] = match;
    const textParts = [normalizeContinuation(firstText)];

    for (let lookahead = index + 1; lookahead < lines.length; lookahead += 1) {
      const line = lines[lookahead];
      if (line.startsWith("- ") || line.startsWith("## ") || line.startsWith("# ")) break;
      if (line.trim() === "") break;
      textParts.push(normalizeContinuation(line));
    }

    requirements.push({
      id,
      pattern,
      text: textParts.join(" "),
      source: relativePath,
      line: index + 1,
      verificationMapped: verificationIds.has(id),
    });
  }

  return requirements;
}

function validateRequirements(requirements) {
  const failures = [];
  const seen = new Map();

  for (const requirement of requirements) {
    if (!supportedPatterns.has(requirement.pattern)) {
      failures.push(`${requirement.source}:${requirement.line} uses unsupported EARS pattern ${requirement.pattern}`);
    }
    if (seen.has(requirement.id)) {
      failures.push(
        `${requirement.source}:${requirement.line} duplicates ${requirement.id} from ${seen.get(requirement.id)}`,
      );
    } else {
      seen.set(requirement.id, `${requirement.source}:${requirement.line}`);
    }
    if (!requirement.verificationMapped) {
      failures.push(`${requirement.source}:${requirement.line} ${requirement.id} is missing from its Verification Map`);
    }
  }

  return failures;
}

function buildRequirementsJson(requirements) {
  return `${JSON.stringify({ requirements }, null, 2)}\n`;
}

function shortTestName(requirement) {
  const compact = requirement.text.replace(/\s+/gu, " ");
  const maxLength = 110;
  if (compact.length <= maxLength) {
    return `${requirement.id} [${requirement.pattern}] ${compact}`;
  }
  const prefix = compact.slice(0, maxLength - 3);
  const boundary = prefix.lastIndexOf(" ");
  const clipped = `${prefix.slice(0, boundary > 60 ? boundary : maxLength - 3)}...`;
  return `${requirement.id} [${requirement.pattern}] ${clipped}`;
}

function buildTestStub(requirements) {
  const lines = [
    "// Generated by scripts/generate-req-tests.mjs. Do not edit manually.",
    "// These skipped tests are the executable bridge from REQ-ID to implementation tests.",
    "// Replace each stub with an adapter-backed test or keep a separate real test that references the same REQ-ID.",
    "import { test } from \"node:test\";",
    "",
  ];

  for (const requirement of requirements) {
    lines.push(`test(${JSON.stringify(shortTestName(requirement))}, {`);
    lines.push(`  skip: ${JSON.stringify(`Generated stub from ${requirement.source}:${requirement.line}. Add an adapter-backed test.`)},`);
    lines.push("}, () => {");
    lines.push(`  // Source: ${requirement.source}:${requirement.line}`);
    lines.push(`  // Requirement: ${requirement.text}`);
    lines.push("});");
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

function checkFile(pathname, expected) {
  if (!fs.existsSync(pathname)) {
    return `${path.relative(root, pathname)} is missing. Run npm run req:test:generate.`;
  }
  const actual = fs.readFileSync(pathname, "utf8");
  if (actual !== expected) {
    return `${path.relative(root, pathname)} is stale. Run npm run req:test:generate.`;
  }
  return null;
}

const { mode } = parseArgs();
const specFiles = findSpecFiles();
const requirements = specFiles.flatMap(extractRequirements).sort((left, right) => left.id.localeCompare(right.id));
const validationFailures = validateRequirements(requirements);

if (requirements.length === 0) {
  validationFailures.push("No REQ-ID requirements found in spec/**/*.md or examples/**/spec.md.");
}

if (validationFailures.length > 0) {
  console.error("Requirement extraction failed:");
  for (const failure of validationFailures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const expectedJson = buildRequirementsJson(requirements);
const expectedTest = buildTestStub(requirements);

if (mode === "write") {
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(requirementsJsonPath, expectedJson);
  fs.writeFileSync(requirementsTestPath, expectedTest);
  console.log(`Generated ${requirements.length} requirement test stubs.`);
} else {
  const failures = [
    checkFile(requirementsJsonPath, expectedJson),
    checkFile(requirementsTestPath, expectedTest),
  ].filter(Boolean);
  if (failures.length > 0) {
    console.error("Generated requirement test artifacts are not current:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
  console.log(`Checked ${requirements.length} generated requirement test stubs.`);
}
