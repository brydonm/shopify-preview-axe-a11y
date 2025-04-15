const { execSync } = require("child_process");
const fs = require("fs");

const PR_BODY = process.env.PR_BODY || "";
const DEFAULT_URL = process.env.DEFAULT_URL || "";
const PATH_REGEX = /preview:\/\/\[([^\]]+)\](\/[^\s]*)?/;

const match = PR_BODY.match(PATH_REGEX);
const previewUrl = match?.[1] || "";
const path = match?.[2] || "";

const urlsToTest = [];

if (previewUrl) {
  urlsToTest.push(`${previewUrl}${path}`);
}

if (DEFAULT_URL) {
  urlsToTest.push(`${DEFAULT_URL}${path}`);
}

if (urlsToTest.length === 0) {
  console.log("No valid URLs found for accessibility testing.");
  fs.writeFileSync(
    "axe-comment.md",
    "⚠️ No valid preview or default URL found."
  );
  process.exit(0);
}

fs.writeFileSync("axe-comment.md", "## 🧪 Axe A11y Report\n\n");

urlsToTest.forEach((url, idx) => {
  console.log(`Running axe on ${url}`);
  const reportPath = `report-${idx}.json`;
  try {
    execSync(`axe ${url} --save ${reportPath}`, { stdio: "inherit" });
    const result = JSON.parse(fs.readFileSync(reportPath));
    const violations = result.violations || [];

    fs.appendFileSync(
      "axe-comment.md",
      `### [${url}]\n- ${violations.length} violations found\n\n`
    );
  } catch (err) {
    console.error(`Failed to run axe on ${url}:`, err.message);
    fs.appendFileSync(
      "axe-comment.md",
      `### [${url}]\n❌ Error running axe.\n\n`
    );
  }
});
