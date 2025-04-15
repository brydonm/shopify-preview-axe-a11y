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
  process.exit(0);
}

urlsToTest.forEach((url, idx) => {
  console.log(`Running axe on ${url}`);
  const reportPath = `report-${idx}.json`;
  try {
    execSync(`axe ${url} --save ${reportPath}`, { stdio: "inherit" });
    console.log(`Saved: ${reportPath}`);
  } catch (err) {
    console.error(`❌ Error running axe on ${url}:`, err.message);
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ error: err.message, url }, null, 2)
    );
  }
});
