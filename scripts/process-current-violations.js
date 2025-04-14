// scripts/process-violations.js
const fs = require("fs");
const { sortByImpact } = require("./utils");

const axeBranchPath = process.argv[2];

const report = JSON.parse(fs.readFileSync(axeBranchPath, "utf8"));

fs.writeFileSync(
  "axe-current-report.json",
  JSON.stringify(sortByImpact(report), null, 2)
);
