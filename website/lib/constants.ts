/**
 * Global website configuration constants for Sloth.
 * Update these URLs and text snippets when publishing the extension or repository.
 */

export const SITE_CONFIG = {
  name: "Sloth",
  tagline: "Git, without the busywork.",
  description:
    "Sloth is a lightweight VS Code extension that automates repetitive Git workflows so you can spend less time typing commands and more time building.",
  heroHeading: "GIT, WITHOUT THE BUSYWORK.",
  heroSupportingText:
    "Automate commits, Git workflows and repetitive developer actions directly inside VS Code.",
  
  // External URLs (Placeholder constants to easily replace later)
  urls: {
    vsCodeMarketplace: "https://marketplace.visualstudio.com/",
    gitHubRepo: "https://github.com/lelixn/sloth",
    gitHubIssues: "https://github.com/lelixn/sloth/issues",
    gitHubContributing: "https://github.com/lelixn/sloth/blob/main/CONTRIBUTING.md",
    license: "https://github.com/lelixn/sloth/blob/main/LICENSE"
  },

  installCommand: "code --install-extension sloth-dev.sloth",
  cloneCommand: "git clone github.com/lelixn/sloth",

  licenseText: "Open source • MIT License",
  
  status: {
    isPublishedToMarketplace: false,
    marketplaceStatusLabel: "Marketplace — coming soon"
  }
} as const;
