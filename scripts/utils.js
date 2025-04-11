const violations = [
  {
    id: "meta-viewport",
    impact: "critical",
    tags: [
      "cat.sensory-and-visual-cues",
      "wcag2aa",
      "wcag144",
      "EN-301-549",
      "EN-9.1.4.4",
      "ACT",
    ],
    description:
      'Ensure <meta name="viewport"> does not disable text scaling and zooming',
    help: "Zooming and scaling must not be disabled",
    helpUrl:
      "https://dequeuniversity.com/rules/axe/4.10/meta-viewport?application=webdriverjs",
    nodes: [
      {
        any: [
          {
            id: "meta-viewport",
            data: "maximum-scale",
            relatedNodes: [],
            impact: "critical",
            message:
              "maximum-scale on <meta> tag disables zooming on mobile devices",
          },
        ],
        all: [],
        none: [],
        impact: "critical",
        html: '<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,maximum-scale=1">',
        target: ['meta[name="viewport"]'],
        failureSummary:
          "Fix any of the following:\n  maximum-scale on <meta> tag disables zooming on mobile devices",
      },
    ],
  },
];
/**
 * Sorts the violations by impact level. `critical` > `serious` > `moderate` > `minor`.
 * @param {Array} violations - The array of violations to sort.
 * @returns {Array} - The sorted array of violations.
 */
export function sortByImpact(violations) {
  const impactOrder = {
    critical: 1,
    serious: 2,
    moderate: 3,
    minor: 4,
  };

  return violations.sort((a, b) => {
    const impactA = impactOrder[a.impact] || 5;
    const impactB = impactOrder[b.impact] || 5;
    return impactA - impactB;
  });
}
