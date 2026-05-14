import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const generatedDir = path.join(root, "generated");
const requirementsJsonPath = path.join(generatedDir, "requirements.json");
const requirementsTestPath = path.join(generatedDir, "requirements.test.mjs");
const verificationReportPath = path.join(generatedDir, "verification-report.md");

const reqIdSource = "REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*-\\d{3}[A-Z0-9]*";
const requirementTokenPattern = new RegExp(`\\b${reqIdSource}(?::S\\d+)?\\b`, "gu");
const inlineRequirementPattern = new RegExp(`^-\\s+\\[(${reqIdSource})\\]\\[([A-Za-z-]+)\\]\\s+(.*)$`, "u");
const headingRequirementPattern = new RegExp(`^#{2,4}\\s+(${reqIdSource})(?:\\s+[—-]\\s*(.*)|\\s+(.*))?$`, "u");
const earsMarkerPattern = /^\*\*\[([A-Za-z-]+)\]\*\*\s*(.*)$/u;
const supportedPatterns = new Set([
  "Ubiquitous",
  "Event-driven",
  "State-driven",
  "Unwanted",
  "Optional",
]);

const traceableExtensions = new Set([
  ".c",
  ".cc",
  ".cpp",
  ".cs",
  ".dart",
  ".go",
  ".java",
  ".js",
  ".jsx",
  ".kt",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".swift",
  ".ts",
  ".tsx",
]);

const traceRootNames = new Set([
  "app",
  "apps",
  "backend",
  "frontend",
  "lib",
  "packages",
  "server",
  "src",
  "test",
  "tests",
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
  generated/requirements.test.mjs
  generated/verification-report.md`);
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

function findTraceFiles() {
  const files = [];
  for (const traceRootName of traceRootNames) {
    const traceRoot = path.join(root, traceRootName);
    for (const file of walk(traceRoot, (candidate) => traceableExtensions.has(path.extname(candidate)))) {
      const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
      if (relativePath.startsWith("generated/")) continue;
      files.push(file);
    }
  }
  return [...new Set(files)].sort();
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

function verificationTokensFor(text) {
  return new Set([...text.matchAll(requirementTokenPattern)].map((match) => match[0]));
}

function collectContinuation(lines, startIndex) {
  const textParts = [];
  let index = startIndex;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") break;
    if (line.startsWith("#")) break;
    if (inlineRequirementPattern.test(line)) break;
    if (earsMarkerPattern.test(line)) break;
    textParts.push(normalizeContinuation(line));
    index += 1;
  }
  return { textParts, nextIndex: index };
}

function extractInlineRequirements(lines, relativePath, verificationTokens) {
  const statements = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(inlineRequirementPattern);
    if (!match) continue;

    const [, requirementId, pattern, firstText] = match;
    const { textParts } = collectContinuation(lines, index + 1);
    const text = [normalizeContinuation(firstText), ...textParts].join(" ");
    statements.push({
      requirementId,
      title: text,
      pattern,
      text,
      source: relativePath,
      line: index + 1,
      verificationTokens,
      style: "inline",
    });
  }

  return statements;
}

function extractHeadingRequirements(lines, relativePath, verificationTokens) {
  const statements = [];
  const failures = [];

  for (let index = 0; index < lines.length; index += 1) {
    const headingMatch = lines[index].match(headingRequirementPattern);
    if (!headingMatch) continue;

    const [, requirementId, dashTitle, plainTitle] = headingMatch;
    const title = normalizeContinuation(dashTitle || plainTitle || requirementId);
    let sectionEnd = lines.length;
    for (let lookahead = index + 1; lookahead < lines.length; lookahead += 1) {
      if (/^#{2,4}\s/u.test(lines[lookahead])) {
        sectionEnd = lookahead;
        break;
      }
    }

    const beforeCount = statements.length;
    for (let bodyIndex = index + 1; bodyIndex < sectionEnd; bodyIndex += 1) {
      const markerMatch = lines[bodyIndex].match(earsMarkerPattern);
      if (!markerMatch) continue;

      const [, pattern, firstText] = markerMatch;
      const { textParts, nextIndex } = collectContinuation(lines, bodyIndex + 1);
      statements.push({
        requirementId,
        title,
        pattern,
        text: [normalizeContinuation(firstText), ...textParts].filter(Boolean).join(" "),
        source: relativePath,
        line: bodyIndex + 1,
        verificationTokens,
        style: "heading",
      });
      bodyIndex = nextIndex - 1;
    }

    if (statements.length === beforeCount) {
      failures.push(`${relativePath}:${index + 1} ${requirementId} heading has no EARS statements`);
    }
  }

  return { statements, failures };
}

function extractRequirements(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/u);
  const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
  const verificationTokens = verificationTokensFor(extractVerificationSection(text));
  const { statements: headingStatements, failures } = extractHeadingRequirements(lines, relativePath, verificationTokens);
  const inlineStatements = extractInlineRequirements(lines, relativePath, verificationTokens);

  return {
    statements: [...inlineStatements, ...headingStatements],
    failures,
  };
}

function assignStatementIds(rawStatements) {
  const ordered = [...rawStatements].sort((left, right) => {
    const byId = left.requirementId.localeCompare(right.requirementId);
    if (byId !== 0) return byId;
    const bySource = left.source.localeCompare(right.source);
    if (bySource !== 0) return bySource;
    return left.line - right.line;
  });
  const counters = new Map();

  return ordered.map((statement) => {
    const nextIndex = (counters.get(statement.requirementId) || 0) + 1;
    counters.set(statement.requirementId, nextIndex);
    const statementId = `${statement.requirementId}:S${nextIndex}`;
    return {
      ...statement,
      statementIndex: nextIndex,
      statementId,
      verificationMapped:
        statement.verificationTokens.has(statement.requirementId) ||
        statement.verificationTokens.has(statementId),
    };
  });
}

function validateStatements(statements, extractionFailures) {
  const failures = [...extractionFailures];
  const seenStatementIds = new Map();

  for (const statement of statements) {
    if (!supportedPatterns.has(statement.pattern)) {
      failures.push(`${statement.source}:${statement.line} uses unsupported EARS pattern ${statement.pattern}`);
    }
    if (seenStatementIds.has(statement.statementId)) {
      failures.push(
        `${statement.source}:${statement.line} duplicates ${statement.statementId} from ${seenStatementIds.get(
          statement.statementId,
        )}`,
      );
    } else {
      seenStatementIds.set(statement.statementId, `${statement.source}:${statement.line}`);
    }
    if (!statement.verificationMapped) {
      failures.push(
        `${statement.source}:${statement.line} ${statement.statementId} is missing from its Verification Map`,
      );
    }
  }

  return failures;
}

function groupRequirements(statements) {
  const grouped = new Map();
  for (const statement of statements) {
    if (!grouped.has(statement.requirementId)) {
      grouped.set(statement.requirementId, {
        id: statement.requirementId,
        title: statement.title,
        source: statement.source,
        line: statement.line,
        statements: [],
      });
    }
    grouped.get(statement.requirementId).statements.push(stripExtractionOnlyFields(statement));
  }
  return [...grouped.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function stripExtractionOnlyFields(statement) {
  const {
    verificationTokens,
    ...publicStatement
  } = statement;
  return {
    ...publicStatement,
    generatedStub: true,
    verificationStatus: "pending",
  };
}

function scanSpecReferences() {
  const references = [];
  const specReferencePattern = /@Spec\(\s*([^)]*?)\s*\)/gu;

  for (const file of findTraceFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (/Auto-generated stub|Generated by .*generate.*stubs?/iu.test(text.slice(0, 600))) {
      continue;
    }
    const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
    for (const match of text.matchAll(specReferencePattern)) {
      const line = text.slice(0, match.index).split(/\r?\n/u).length;
      const lineStart = text.lastIndexOf("\n", match.index) + 1;
      const lineEndCandidate = text.indexOf("\n", match.index);
      const lineEnd = lineEndCandidate === -1 ? text.length : lineEndCandidate;
      const lineText = text.slice(lineStart, lineEnd);
      if (/generated_stub\s*=\s*true/iu.test(lineText)) {
        continue;
      }
      for (const token of match[1].matchAll(requirementTokenPattern)) {
        references.push({
          id: token[0],
          source: relativePath,
          line,
        });
      }
    }
  }

  return references.sort((left, right) => {
    const byId = left.id.localeCompare(right.id);
    if (byId !== 0) return byId;
    const bySource = left.source.localeCompare(right.source);
    if (bySource !== 0) return bySource;
    return left.line - right.line;
  });
}

function buildRequirementsJson(statements, references) {
  const requirementIds = new Set(statements.map((statement) => statement.requirementId));
  const referencedIds = new Set(references.map((reference) => reference.id));
  const statementIds = new Set(statements.map((statement) => statement.statementId));
  const tracedStatements = statements.filter(
    (statement) => referencedIds.has(statement.statementId) || referencedIds.has(statement.requirementId),
  );
  const codeOnlyReferences = references.filter(
    (reference) => !statementIds.has(reference.id) && !requirementIds.has(reference.id),
  );

  const payload = {
    generatedBy: "scripts/generate-req-tests.mjs",
    totals: {
      requirements: requirementIds.size,
      statements: statements.length,
      generatedStubSlots: statements.length,
      verificationMappedStatements: statements.filter((statement) => statement.verificationMapped).length,
      realSpecReferences: references.length,
      realTracedStatements: tracedStatements.length,
      pendingGeneratedOnlyStatements: statements.length - tracedStatements.length,
      codeOnlyReferences: codeOnlyReferences.length,
    },
    requirements: groupRequirements(statements),
    statements: statements.map(stripExtractionOnlyFields),
    realSpecReferences: references,
    codeOnlyReferences,
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function shortTestName(statement) {
  const compact = statement.text.replace(/\s+/gu, " ");
  const maxLength = 105;
  if (compact.length <= maxLength) {
    return `${statement.statementId} [${statement.pattern}] ${compact}`;
  }
  const prefix = compact.slice(0, maxLength - 3);
  const boundary = prefix.lastIndexOf(" ");
  const clipped = `${prefix.slice(0, boundary > 60 ? boundary : maxLength - 3)}...`;
  return `${statement.statementId} [${statement.pattern}] ${clipped}`;
}

function buildTestStub(statements) {
  const lines = [
    "// Generated by scripts/generate-req-tests.mjs. Do not edit manually.",
    "// These skipped tests are executable placeholders, not validation evidence.",
    "// Keep or replace each stub with a real test/guardrail/manual-verification note that references the same @Spec ID.",
    "import { test } from \"node:test\";",
    "",
  ];

  for (const statement of statements) {
    lines.push(`test(${JSON.stringify(shortTestName(statement))}, {`);
    lines.push(`  skip: ${JSON.stringify(`Generated stub from ${statement.source}:${statement.line}. Verification is still pending.`)},`);
    lines.push("}, () => {");
    lines.push(`  // @Spec(${statement.statementId}) generated_stub=true verification_status=pending`);
    lines.push(`  // Source: ${statement.source}:${statement.line}`);
    lines.push(`  // Requirement: ${statement.requirementId}`);
    lines.push(`  // Statement: ${statement.text}`);
    lines.push("});");
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

function buildVerificationReport(statements, references) {
  const requirementIds = new Set(statements.map((statement) => statement.requirementId));
  const statementIds = new Set(statements.map((statement) => statement.statementId));
  const referencedIds = new Set(references.map((reference) => reference.id));
  const tracedStatements = statements.filter(
    (statement) => referencedIds.has(statement.statementId) || referencedIds.has(statement.requirementId),
  );
  const codeOnlyReferences = references.filter(
    (reference) => !statementIds.has(reference.id) && !requirementIds.has(reference.id),
  );
  const pendingGeneratedOnly = statements.filter(
    (statement) => !referencedIds.has(statement.statementId) && !referencedIds.has(statement.requirementId),
  );

  const lines = [
    "# Requirement Verification Report",
    "",
    "Generated by `scripts/generate-req-tests.mjs`.",
    "",
    "Generated stubs are not proof of behavior. They are pending verification slots.",
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "|---|---:|",
    `| Requirements | ${requirementIds.size} |`,
    `| EARS statements | ${statements.length} |`,
    `| Verification-map covered statements | ${statements.filter((statement) => statement.verificationMapped).length} |`,
    `| Generated stub slots | ${statements.length} |`,
    `| Real @Spec references outside generated artifacts | ${references.length} |`,
    `| Statements with real @Spec trace | ${tracedStatements.length} |`,
    `| Pending generated-only statements | ${pendingGeneratedOnly.length} |`,
    `| Code-only @Spec references | ${codeOnlyReferences.length} |`,
    "",
    "## Pending Generated-Only Statements",
    "",
  ];

  if (pendingGeneratedOnly.length === 0) {
    lines.push("None.");
  } else {
    lines.push("| Statement | Pattern | Source |");
    lines.push("|---|---|---|");
    for (const statement of pendingGeneratedOnly) {
      lines.push(`| ${statement.statementId} | ${statement.pattern} | ${statement.source}:${statement.line} |`);
    }
  }

  lines.push("", "## Real @Spec References", "");
  if (references.length === 0) {
    lines.push("None found outside generated artifacts.");
  } else {
    lines.push("| Reference | Source |");
    lines.push("|---|---|");
    for (const reference of references) {
      lines.push(`| ${reference.id} | ${reference.source}:${reference.line} |`);
    }
  }

  if (codeOnlyReferences.length > 0) {
    lines.push("", "## Code-Only References", "");
    lines.push("| Reference | Source |");
    lines.push("|---|---|");
    for (const reference of codeOnlyReferences) {
      lines.push(`| ${reference.id} | ${reference.source}:${reference.line} |`);
    }
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
const extractionResults = findSpecFiles().map(extractRequirements);
const rawStatements = extractionResults.flatMap((result) => result.statements);
const extractionFailures = extractionResults.flatMap((result) => result.failures);
const statements = assignStatementIds(rawStatements);
const validationFailures = validateStatements(statements, extractionFailures);

if (statements.length === 0) {
  validationFailures.push("No REQ-ID requirements found in spec/**/*.md or examples/**/spec.md.");
}

if (validationFailures.length > 0) {
  console.error("Requirement extraction failed:");
  for (const failure of validationFailures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const references = scanSpecReferences();
const expectedJson = buildRequirementsJson(statements, references);
const expectedTest = buildTestStub(statements);
const expectedVerificationReport = buildVerificationReport(statements, references);

if (mode === "write") {
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(requirementsJsonPath, expectedJson);
  fs.writeFileSync(requirementsTestPath, expectedTest);
  fs.writeFileSync(verificationReportPath, expectedVerificationReport);
  console.log(`Generated ${statements.length} requirement statement test stubs.`);
} else {
  const failures = [
    checkFile(requirementsJsonPath, expectedJson),
    checkFile(requirementsTestPath, expectedTest),
    checkFile(verificationReportPath, expectedVerificationReport),
  ].filter(Boolean);
  if (failures.length > 0) {
    console.error("Generated requirement artifacts are not current:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
  console.log(`Checked ${statements.length} generated requirement statement test stubs.`);
}
