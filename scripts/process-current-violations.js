// scripts/process-violations.js
const fs = require("fs");
const { sortByImpact } = require("./utils");

const axeBranchPath = process.argv[2];

const report = JSON.parse(fs.readFileSync(axeBranchPath, "utf8"));
const violations = report?.[0]?.violations || [];

fs.writeFileSync(
  "axe-current-violations.json",
  JSON.stringify(sortByImpact(violations), null, 2)
);
