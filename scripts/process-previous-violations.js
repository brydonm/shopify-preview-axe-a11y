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
  JSON.stringify(sortByImpact(violations), null, 2)
);
