const { execSync } = require("child_process");
const fs = require("fs");

const PR_BODY = process.env.PR_BODY || "";
const DEFAULT_URL = process.env.DEFAULT_URL || "";
const PATH_REGEX = /https:\/\/[^\s]+/g;

const allUrls = PR_BODY.match(PATH_REGEX) || [];

const rawPreviewUrl =
  allUrls.find(
    (url) =>
      url.includes("preview_theme_id=") || url.includes("shopifypreview.com")
  ) || "";

let previewUrl = "";
if (rawPreviewUrl) {
  try {
    const parsed = new URL(rawPreviewUrl);
    const previewThemeId = parsed.searchParams.get("preview_theme_id");

    if (previewThemeId) {
      previewUrl = `${parsed.origin}?preview_theme_id=${previewThemeId}`;
    }
  } catch (err) {
    console.warn("Invalid preview URL:", rawPreviewUrl);
  }
}

const path = previewUrl ? new URL(previewUrl).pathname : "";

console.log("Preview URL:", previewUrl);
console.log("Default URL:", DEFAULT_URL);
console.log("Path:", path);

const urlsToTest = {};

const addUrlToTest = (url, key) => {
  if (url && !urlsToTest[key]) {
    urlsToTest[key] = url;
  }
};

if (previewUrl) {
  addUrlToTest(previewUrl, "preview");
}

if (DEFAULT_URL) {
  addUrlToTest(`${DEFAULT_URL}${path}`, "default");
}

if (urlsToTest.length === 0) {
  console.log("No valid URLs found for accessibility testing.");
  process.exit(0);
}

Object.entries(urlsToTest)
  .map(([key, url]) => ({
    key,
    url,
  }))
  .forEach(({ key, url }) => {
    console.log(`Running axe on ${key}: ${url}`);
    const reportPath = `axe-report-${key}.json`;
    try {
      execSync(`axe ${url} --save ${reportPath}`, { stdio: "inherit" });
      console.log(`Saved: ${reportPath}`);
    } catch (err) {
      console.error(`❌ Error running axe on ${key}:`, err.message);
      fs.writeFileSync(
        reportPath,
        JSON.stringify({ error: err.message, url }, null, 2)
      );
    }
  });
