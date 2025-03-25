/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['analytics', 'experiments-provider'],
    },
    {
      type: 'category',
      label: 'Hooks',
      items: ['use-experiment', 'use-pricing-signup'],
    },
  ],
};

module.exports = sidebars;
