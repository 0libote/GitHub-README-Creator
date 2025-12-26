/**
 * GitHub README Creator - Section Templates
 * Professional, clean templates without excessive emojis
 */

const SECTIONS = [
    {
        name: 'Header & Intro',
        icon: 'file-text',
        items: [
            {
                id: 'banner',
                name: 'Project Banner',
                template: `<p align="center">
  <img src="https://via.placeholder.com/800x200/0d1117/2f81f7?text=[TITLE]" alt="[TITLE] Banner" width="100%">
</p>

<h1 align="center">[TITLE]</h1>

<p align="center">
  <em>A brief, compelling description of your project goes here.</em>
</p>
`
            },
            {
                id: 'header-simple',
                name: 'Simple Header',
                template: `# [TITLE]

> A brief tagline describing what [REPO] does.
`
            },
            {
                id: 'about',
                name: 'About Section',
                template: `## About

**[TITLE]** is designed to solve [describe problem]. Built with a focus on simplicity and developer experience.

### Key Features

- Feature one description
- Feature two description
- Feature three description
`
            }
        ]
    },
    {
        name: 'Badges & Status',
        icon: 'shield',
        items: [
            {
                id: 'badges-standard',
                name: 'Standard Badges',
                template: `![GitHub release](https://img.shields.io/github/v/release/[USER]/[REPO]?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/[USER]/[REPO]?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/[USER]/[REPO]?style=for-the-badge)
`
            },
            {
                id: 'badges-flat',
                name: 'Flat Badges',
                template: `![Stars](https://img.shields.io/github/stars/[USER]/[REPO]?style=flat-square)
![Forks](https://img.shields.io/github/forks/[USER]/[REPO]?style=flat-square)
![Issues](https://img.shields.io/github/issues/[USER]/[REPO]?style=flat-square)
`
            },
            {
                id: 'badges-ci',
                name: 'CI/CD Badges',
                template: `![Build Status](https://img.shields.io/github/actions/workflow/status/[USER]/[REPO]/ci.yml?branch=main&style=for-the-badge&label=Build)
![Tests](https://img.shields.io/github/actions/workflow/status/[USER]/[REPO]/test.yml?branch=main&style=for-the-badge&label=Tests)
`
            }
        ]
    },
    {
        name: 'Installation & Usage',
        icon: 'terminal',
        items: [
            {
                id: 'install-npm',
                name: 'NPM Installation',
                template: `## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/[USER]/[REPO].git

# Navigate to directory
cd [REPO]

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`
`
            },
            {
                id: 'install-yarn',
                name: 'Yarn Installation',
                template: `## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/[USER]/[REPO].git
cd [REPO]

# Install with Yarn
yarn install

# Start the application
yarn start
\`\`\`
`
            },
            {
                id: 'usage',
                name: 'Usage Example',
                template: `## Usage

\`\`\`javascript
import { example } from '[REPO]';

// Basic usage
const result = example({
  option: 'value'
});

console.log(result);
\`\`\`
`
            }
        ]
    },
    {
        name: 'Badge Studio',
        icon: 'palette',
        isBadgeStudio: true,
        items: [
            {
                id: 'badge-custom',
                name: 'Custom Badge',
                template: '![Badge](https://img.shields.io/badge/[LABEL]-[VALUE]-[COLOR]?style=[STYLE])'
            }
        ]
    },
    {
        name: 'Tech & Stack',
        icon: 'layers',
        items: [
            {
                id: 'tech-stack',
                name: 'Tech Stack',
                template: `## Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL, Redis |
| DevOps | Docker, GitHub Actions |
`
            },
            {
                id: 'tech-badges',
                name: 'Tech Badges',
                template: `## Built With

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
`
            }
        ]
    },
    {
        name: 'Documentation',
        icon: 'book-open',
        items: [
            {
                id: 'toc',
                name: 'Table of Contents',
                template: `## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
`
            },
            {
                id: 'api-docs',
                name: 'API Documentation',
                template: `## API Reference

### \`functionName(param)\`

Description of what the function does.

| Parameter | Type | Description |
|-----------|------|-------------|
| \`param\` | \`string\` | Description of parameter |

**Returns:** \`Object\` - Description of return value

**Example:**
\`\`\`javascript
const result = functionName('example');
\`\`\`
`
            }
        ]
    },
    {
        name: 'Community',
        icon: 'users',
        items: [
            {
                id: 'contributing',
                name: 'Contributing',
                template: `## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.
`
            },
            {
                id: 'authors',
                name: 'Authors & Credits',
                template: `## Authors

- **@[USER]** - *Initial work* - [GitHub](https://github.com/[USER])

See the list of [contributors](https://github.com/[USER]/[REPO]/contributors) who participated in this project.
`
            }
        ]
    },
    {
        name: 'Legal',
        icon: 'scale',
        items: [
            {
                id: 'license-mit',
                name: 'MIT License',
                template: `## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`
            },
            {
                id: 'license-apache',
                name: 'Apache License',
                template: `## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.
`
            }
        ]
    }
];

// Export for use in app.js
window.SECTIONS = SECTIONS;
