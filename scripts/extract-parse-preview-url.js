const fs = require("fs");

const prBody = process.env.GITHUB_EVENT_PULL_REQUEST_BODY;

if (!prBody) {
  console.error("PR body is empty, exiting...");
  process.exit(1);
}

console.log("Extracting URLs from PR body...");
const allUrls = [...prBody.matchAll(/https?:\/\/[^\s)\n]+/g)].map(
  (match) => match[0]
);

console.log("Extracted URLs:\n", allUrls.join("\n"));

const matchingUrl = allUrls.find(
  (url) =>
    url.includes("?preview_theme_id=") || url.includes("shopifypreview.com")
);

console.log("==== DEBUG INFO ====");
console.log("Matched URL:", matchingUrl || "No match found");
console.log("====================");

if (!matchingUrl) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `path=\n`);
  process.exit(1);
}

const pathWithQuery = matchingUrl.replace(/^https?:\/\/[^/]+/, "");
const cleanPath = pathWithQuery.replace(/\?.*$/, "");
const sanitizedPath = cleanPath.replace(/\//g, "-");

fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${matchingUrl}\n`);
fs.appendFileSync(process.env.GITHUB_OUTPUT, `path=${cleanPath}\n`);
fs.appendFileSync(
  process.env.GITHUB_OUTPUT,
  `sanitized_path=${sanitizedPath}\n`
);
