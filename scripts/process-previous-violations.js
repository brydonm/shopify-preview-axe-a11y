// scripts/process-violations.js
const fs = require("fs");
const { sortByImpact } = require("./utils");

const targetBranch = process.argv[2];
const path = `_axe-a11y-reports/${targetBranch}-branch-report.json`;

if (!fs.existsSync(path)) {
  console.log(`No report found at ${path}`);
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(path, "utf8"));
const violations = report?.[0]?.violations || [];

fs.writeFileSync(
  "axe-previous-violations.json",
  JSON.stringify(violations, null, 2)
);

// if (violations.length === 0) {
//   console.log("No violations found in downloaded report.");
//   process.exit(0);
// }

// let violationsTable = "### 🧪 Violations from Downloaded Report\n\n";
// violationsTable += "| Issue | Impact | Target | Help |\n";
// violationsTable += "|-------|--------|--------|------|\n";

// sortByImpact(violations).forEach((v) => {
//   const impact = v.impact || "n/a";
//   const help = `[${v.help}](${v.helpUrl})`;
//   v.nodes.forEach((n) => {
//     const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";
//     violationsTable += `| ${v.id} | ${impact} | ${target} | ${help} |\n`;
//   });
// });

// fs.writeFileSync("axe-violations-summary.md", violationsTable);
