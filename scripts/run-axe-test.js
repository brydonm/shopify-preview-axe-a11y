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
  JSON.stringify(sortByImpact(violations), null, 2)
);
