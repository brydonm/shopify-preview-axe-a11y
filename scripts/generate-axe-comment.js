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

let output = "### 🧪 New violations compared to previous report\n\n";
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

output += "\n\n### 🧪 All violations\n\n";
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

output += "\n\n### 🧪 Previous violations\n\n";
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

fs.writeFileSync("axe-comment.md", output);
