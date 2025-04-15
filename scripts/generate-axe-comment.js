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

const impactEmojis = {
  critical: "❗️",
  serious: "⚠️",
  moderate: "🔶",
  minor: "🔷",
  info: "ℹ️",
};

const currentReport = readReport("axe-report-preview.json");
const previousReport = readReport("axe-report-default.json");

const currentViolations = currentReport?.violations
  ? currentReport.violations.flatMap((v) =>
      v.nodes.map((n) => ({
        ...v,
        ...n,
      }))
    )
  : [];
const previousViolations = previousReport?.violations
  ? previousReport.violations.flatMap((v) =>
      v.nodes.map((n) => ({
        ...v,
        ...n,
      }))
    )
  : [];

const newViolations = currentViolations.filter(
  (v) => !previousViolations.some((pv) => pv.id === v.id)
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

const buildViolationsTable = ({ title, violations }) => {
  if (violations.length === 0) return "";

  let table = "<details>";
  table += `<summary>${title}</summary>\n\n`;
  table += "| Issue | Target | Help | Summary |\n";
  table += "|-------|--------|------|---------|\n";

  violations.forEach((n) => {
    const impact = n.impact || "n/a";
    const help = `[${n.help}](${n.helpUrl})`;
    const target = Array.isArray(n.target) ? n.target.join(", ") : "n/a";

    table += `| ${impactEmojis[impact]} ${help} | ${target} | ${n.summary} |\n`;
  });
  table += "</details>\n\n";

  return table;
};

output += buildViolationsTable({
  title: "⚠️ New violations compared to previous report",
  violations: newViolations,
});

output += buildViolationsTable({
  title: "🔗 All preview link violations",
  violations: currentViolations,
});

output += buildViolationsTable({
  title: "🧪 All live violations",
  violations: previousViolations,
});

fs.writeFileSync("axe-comment.md", output);
console.log("✅ axe-comment.md generated");
