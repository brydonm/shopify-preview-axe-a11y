// scripts/process-violations.js
const fs = require("fs");
const { sortByImpact } = require("./utils");

const targetBranch = process.argv[2];

const report = JSON.parse(
  fs.readFileSync(
    `./_axe-a11y-reports/${targetBranch}-branch-report.json`,
    "utf8"
  )
);
const violations = report?.[0]?.violations || [];

fs.writeFileSync(
  "axe-current-violations.json",
  JSON.stringify(violations, null, 2)
);

// if (violations.length === 0) {
//   fs.writeFileSync("axe-summary.md", `✅ No accessibility issues found.\n\n`);
//   process.exit(0);
// }

// let table = `### 🧪 Axe Accessibility Report\n\n`;
// table += `| Issue | Impact | Target | Help |\n`;
// table += `|-------|--------|--------|------|\n`;

// sortByImpact(violations).forEach((v) => {
//   const impact = v.impact || "n/a";
//   const help = `[${v.help}](${v.helpUrl})`;
//   v.nodes.forEach((n) => {
//     const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";
//     table += `| ${v.id} | ${impact} | \`${target}\` | ${help} |\n`;
//   });
// });

// fs.writeFileSync("axe-summary.md", table);
