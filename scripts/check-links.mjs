import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules"]);
const markdownFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".md")) {
      markdownFiles.push(fullPath);
    }
  }
}

function stripAnchor(link) {
  const hashIndex = link.indexOf("#");
  return hashIndex === -1 ? link : link.slice(0, hashIndex);
}

function isExternalOrSpecial(link) {
  return (
    link === "" ||
    link.startsWith("#") ||
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:")
  );
}

function isLikelyImageAltPrefix(text, index) {
  return index > 0 && text[index - 1] === "!";
}

walk(root);

const failures = [];
const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(markdownLinkPattern)) {
    if (isLikelyImageAltPrefix(text, match.index ?? 0)) continue;
    const rawTarget = match[2].trim();
    const targetWithoutTitle = rawTarget.split(/\s+["']/u)[0];
    const target = decodeURIComponent(stripAnchor(targetWithoutTitle));
    if (isExternalOrSpecial(target)) continue;

    const resolved = path.resolve(path.dirname(file), target);
    if (!resolved.startsWith(root)) {
      failures.push(`${path.relative(root, file)} -> ${rawTarget} escapes repository`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      failures.push(`${path.relative(root, file)} -> ${rawTarget} is missing`);
    }
  }
}

if (failures.length > 0) {
  console.error("Broken local markdown links:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} markdown files. Local links OK.`);
