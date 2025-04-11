const fs = require("fs");

const currentViolations = JSON.parse(
  fs.readFileSync("axe-current-violations.json", "utf8")
);
const previousViolations = fs.existsSync("axe-previous-violations.json")
  ? JSON.parse(fs.readFileSync("axe-previous-violations.json", "utf8"))
  : [];

const newViolations = currentViolations.filter(
  (v) =>
    !previousViolations.some(
      (pv) => pv.id === v.id && v.nodes.length === pv.nodes.length
    )
);

let output = `### 🧪 Axe Accessibility Report\n\n`;
output += `- ${currentViolations.length} violations found on the preview url.\n`;
output += `- ${previousViolations.length} violations found on the live url.\n\n`;

if (newViolations.length > 0) {
  output += "<details>";
  output +=
    "<summary>🧪 New violations compared to previous report</summary>\n\n";
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

output += "<details>";
output += "<summary>🧪 All preview link violations</summary>\n\n";
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

fs.writeFileSync("axe-comment.md", output);
