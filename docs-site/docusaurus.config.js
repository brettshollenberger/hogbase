// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Hogbase",
  tagline: "A/B Testing and Landing Page Library",
  url: "https://github.com/brettshollenberger/hogbase",
  baseUrl: "/hogbase/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "brettshollenberger", // Usually your GitHub org/user name.
  projectName: "hogbase", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/yourusername/hogbase/tree/main/docs-site/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Hogbase",
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/yourusername/hogbase",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Documentation",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/yourusername/hogbase",
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Hogbase. Built with Docusaurus.`,
      },
      prism: {
        theme: {
          plain: {
            color: "#393A34",
            backgroundColor: "#f6f8fa",
          },
          styles: [
            {
              types: ["comment", "prolog", "doctype", "cdata"],
              style: {
                color: "#999988",
                fontStyle: "italic",
              },
            },
            {
              types: ["namespace"],
              style: {
                opacity: 0.7,
              },
            },
            {
              types: ["string", "attr-value"],
              style: {
                color: "#e3116c",
              },
            },
            {
              types: ["punctuation", "operator"],
              style: {
                color: "#393A34",
              },
            },
            {
              types: [
                "entity",
                "url",
                "symbol",
                "number",
                "boolean",
                "variable",
                "constant",
                "property",
                "regex",
                "inserted",
              ],
              style: {
                color: "#36acaa",
              },
            },
            {
              types: ["atrule", "keyword", "attr-name", "selector"],
              style: {
                color: "#00a4db",
              },
            },
            {
              types: ["function", "deleted", "tag"],
              style: {
                color: "#d73a49",
              },
            },
            {
              types: ["function-variable"],
              style: {
                color: "#6f42c1",
              },
            },
            {
              types: ["tag", "selector", "keyword"],
              style: {
                color: "#00009f",
              },
            },
          ],
        },
        darkTheme: {
          plain: {
            color: "#F8F8F2",
            backgroundColor: "#282A36",
          },
          styles: [
            {
              types: ["prolog", "constant", "builtin"],
              style: {
                color: "#FF79C6",
              },
            },
            {
              types: ["inserted", "function"],
              style: {
                color: "#50FA7B",
              },
            },
            {
              types: ["deleted"],
              style: {
                color: "#FF5555",
              },
            },
            {
              types: ["changed"],
              style: {
                color: "#FFB86C",
              },
            },
            {
              types: ["punctuation", "symbol"],
              style: {
                color: "#F8F8F2",
              },
            },
            {
              types: ["string", "char", "tag", "selector"],
              style: {
                color: "#FF79C6",
              },
            },
            {
              types: ["keyword", "variable"],
              style: {
                color: "#BD93F9",
                fontStyle: "italic",
              },
            },
            {
              types: ["comment"],
              style: {
                color: "#6272A4",
              },
            },
            {
              types: ["attr-name"],
              style: {
                color: "#50FA7B",
              },
            },
          ],
        },
      },
    }),
};
