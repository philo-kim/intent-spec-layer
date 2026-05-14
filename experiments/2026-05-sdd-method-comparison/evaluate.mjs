#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const caseFile = path.join(here, "case.json");
const specsDir = path.join(here, "specs");
const resultsJson = path.join(here, "results.json");
const resultsMd = path.join(here, "results.md");

const benchmark = JSON.parse(fs.readFileSync(caseFile, "utf8"));
const specFiles = fs
  .readdirSync(specsDir)
  .filter((file) => file.endsWith(".md"))
  .sort();

const categoryWeights = {
  behavior: 0.35,
  unwanted: 0.2,
  vocabulary: 0.15,
  interface: 0.15,
  constitution: 0.1,
  traceability: 0.05,
};

function normalize(value) {
  return value.toLowerCase().replace(/[`*#>]/g, " ").replace(/\s+/g, " ");
}

function hasAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase.toLowerCase()));
}

function controlMatched(text, control) {
  return control.groups.every((group) => hasAny(text, group));
}

function byCategory(controls) {
  const grouped = new Map();
  for (const control of controls) {
    const list = grouped.get(control.category) ?? [];
    list.push(control);
    grouped.set(control.category, list);
  }
  return grouped;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function scoreSpec(file) {
  const raw = fs.readFileSync(path.join(specsDir, file), "utf8");
  const text = normalize(raw);
  const controls = benchmark.controls.map((control) => ({
    ...control,
    matched: controlMatched(text, control),
  }));
  const grouped = byCategory(controls);
  const categoryScores = {};

  for (const [category, list] of grouped) {
    const matched = list.filter((control) => control.matched).length;
    categoryScores[category] = {
      matched,
      total: list.length,
      ratio: round(matched / list.length),
    };
  }

  const weightedScore = Object.entries(categoryWeights).reduce(
    (total, [category, weight]) => {
      const score = categoryScores[category]?.ratio ?? 0;
      return total + score * weight;
    },
    0,
  );

  const expectedTermsPresent = benchmark.expectedTerms.filter((term) =>
    text.includes(term),
  );
  const bannedAliasesPresent = benchmark.bannedAliases.filter((term) =>
    text.includes(term),
  );
  const earsPatternsPresent = benchmark.earsPatterns.filter((pattern) =>
    text.includes(pattern),
  );
  const layerMarkers = ["layer 0", "layer 1", "layer 2", "layer 3"].filter(
    (marker) => text.includes(marker),
  );

  return {
    method: file.replace(/^\d+-/, "").replace(/\.md$/, ""),
    file,
    weightedScore: round(weightedScore),
    categoryScores,
    matchedControls: controls
      .filter((control) => control.matched)
      .map((control) => control.id),
    missingControls: controls
      .filter((control) => !control.matched)
      .map((control) => ({
        id: control.id,
        category: control.category,
        description: control.description,
      })),
    expectedTermsPresent,
    bannedAliasesPresent,
    earsPatternsPresent,
    layerMarkers,
  };
}

function markdownReport(results) {
  const lines = [];
  lines.push("# SDD Method Comparison Results");
  lines.push("");
  lines.push(`Case: \`${benchmark.caseId}\``);
  lines.push("");
  lines.push("| Method | Weighted score | Behavior | Unwanted | Vocabulary | Interface | Constitution | Traceability | Missing controls |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---|");
  for (const result of results) {
    const cat = (name) => {
      const score = result.categoryScores[name] ?? { matched: 0, total: 0 };
      return `${score.matched}/${score.total}`;
    };
    lines.push(
      `| ${result.method} | ${result.weightedScore} | ${cat("behavior")} | ${cat("unwanted")} | ${cat("vocabulary")} | ${cat("interface")} | ${cat("constitution")} | ${cat("traceability")} | ${result.missingControls.map((control) => control.id).join(", ") || "-"} |`,
    );
  }

  lines.push("");
  lines.push("## Interpretation");
  lines.push("");
  lines.push("- PRD-style prose leaves too many decisions implicit.");
  lines.push("- BDD improves concrete scenarios but does not force systematic unwanted-behavior exploration.");
  lines.push("- EARS improves edge-case coverage, especially when unwanted behavior is explicit.");
  lines.push("- Domain Truth adds vocabulary stability and source-of-truth clarity.");
  lines.push("- Interface Contracts are the decisive layer for idempotency and partial rollback.");
  lines.push("- Layer 0 blocks convenient but invalid local shortcuts.");
  lines.push("");
  lines.push("## Method Details");
  lines.push("");
  for (const result of results) {
    lines.push(`### ${result.method}`);
    lines.push("");
    lines.push(`- File: \`${result.file}\``);
    lines.push(`- Score: ${result.weightedScore}`);
    lines.push(`- EARS patterns: ${result.earsPatternsPresent.join(", ") || "-"}`);
    lines.push(`- Layer markers: ${result.layerMarkers.join(", ") || "-"}`);
    lines.push(`- Expected terms present: ${result.expectedTermsPresent.join(", ") || "-"}`);
    lines.push(`- Banned aliases present: ${result.bannedAliasesPresent.join(", ") || "-"}`);
    lines.push(
      `- Missing controls: ${result.missingControls.map((control) => `${control.id} (${control.category})`).join(", ") || "-"}`,
    );
    lines.push("");
  }
  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

const results = specFiles.map(scoreSpec);
fs.writeFileSync(
  resultsJson,
  JSON.stringify({ benchmark, results }, null, 2),
);
fs.writeFileSync(resultsMd, markdownReport(results));

console.log(markdownReport(results));

const best = results[results.length - 1];
if (best.weightedScore < 0.99) {
  console.error("Full Spec Layer benchmark score is below the expected threshold.");
  process.exit(1);
}
