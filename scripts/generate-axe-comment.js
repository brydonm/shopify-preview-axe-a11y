const fs = require("fs");

const readReport = (filename) => {
  if (!fs.existsSync(filename)) return null;
  const data = JSON.parse(fs.readFileSync(filename, "utf8"));
  return Array.isArray(data.violations)
    ? data
    : Array.isArray(data)
    ? data[0]
    : null;
};

const currentReport = readReport("axe-report-preview.json");
const previousReport = readReport("axe-report-default.json");

// const currentViolations = currentReport?.violations || [];
// const previousViolations = previousReport?.violations || [];

// instead of .violations, build an array of violations.nodes
const currentViolations = currentReport?.violations
  ? currentReport.violations.flatMap((v) => v.nodes)
  : [];
const previousViolations = previousReport?.violations
  ? previousReport.violations.flatMap((v) => v.nodes)
  : [];

const newViolations = currentViolations.filter(
  (v) =>
    !previousViolations.some(
      (pv) => pv.id === v.id && v.nodes.length === pv.nodes.length
    )
);

let output = `### 🧪 Axe Accessibility Report\n\n`;

output += `- ${newViolations.length} new violations found compared to the previous report\n`;
output += `- ${
  currentViolations.length
} violations found on the preview url (\`${
  currentReport?.url || "unknown"
}\`)\n`;
output += `- ${previousViolations.length} violations found on the live url (\`${
  previousReport?.url || "unknown"
}\`)\n`;

if (newViolations.length > 0) {
  output += "<details>";
  output +=
    "<summary>⚠️ New violations compared to previous report</summary>\n\n";
  output += "| Issue | Impact | Target | Help |\n";
  output += "|-------|--------|--------|------|\n";
  newViolations.forEach((v) => {
    const impact = v.impact || "n/a";
    const help = `[${v.help}](${v.helpUrl})`;
    v.nodes.forEach((n) => {
      const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";
      output += `| ${v.id} | ${impact} | ${target} | ${help} |\n`;
    });
  });
  output += "</details>\n\n";
}

if (currentViolations.length > 0) {
  output += "<details>";
  output += "<summary>🔗 All preview link violations</summary>\n\n";
  output += "| Issue | Impact | Target | Help |\n";
  output += "|-------|--------|--------|------|\n";
  currentViolations.forEach((v) => {
    const impact = v.impact || "n/a";
    const help = `[${v.help}](${v.helpUrl})`;
    v.nodes.forEach((n) => {
      const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";
      output += `| ${v.id} | ${impact} | ${target} | ${help} |\n`;
    });
  });
  output += "</details>\n\n";
}

if (previousViolations.length > 0) {
  output += "<details>";
  output += "<summary>🧪 All live violations</summary>\n\n";
  output += "| Issue | Impact | Target | Help |\n";
  output += "|-------|--------|--------|------|\n";
  previousViolations.forEach((v) => {
    const impact = v.impact || "n/a";
    const help = `[${v.help}](${v.helpUrl})`;
    v.nodes.forEach((n) => {
      const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";
      output += `| ${v.id} | ${impact} | ${target} | ${help} |\n`;
    });
  });
  output += "</details>\n\n";
}

fs.writeFileSync("axe-comment.md", output);
console.log("✅ axe-comment.md generated");
