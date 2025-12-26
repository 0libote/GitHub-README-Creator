// Sections Configuration with expanded categories
const sectionCategories = [
    {
        title: 'Core Sections',
        items: [
            {
                id: 'title',
                name: 'Project Title',
                template: '# Project Title\n\n> A brief description of what this project does and who it\'s for.\n'
            },
            {
                id: 'description',
                name: 'Description',
                template: '## Description\n\nExplain the problem your project solves. This is the "why" behind your code. Include screenshots if possible to make it more engaging.\n'
            },
            {
                id: 'installation',
                name: 'Installation',
                template: '## 🛠 Installation\n\nInstall my-project with npm\n\n```bash\n  npm install my-project\n  cd my-project\n```\n'
            },
            {
                id: 'usage',
                name: 'Usage/Examples',
                template: '## 🚀 Usage/Examples\n\n```javascript\nimport { feature } from \'my-project\'\n\nfunction App() {\n  return feature();\n}\n```\n'
            }
        ]
    },
    {
        title: 'Project Engagement',
        items: [
            {
                id: 'badges',
                name: 'Status Badges',
                template: '## Status\n\n![Build Status](https://img.shields.io/github/actions/workflow/status/username/repo/deploy.yml?branch=main&style=for-the-badge)\n![License](https://img.shields.io/github/license/username/repo?style=for-the-badge)\n![Stars](https://img.shields.io/github/stars/username/repo?style=for-the-badge)\n![Issues](https://img.shields.io/github/issues/username/repo?style=for-the-badge)\n'
            },
            {
                id: 'techstack',
                name: 'Tech Stack',
                template: '## 💻 Tech Stack\n\n**Client:** React, Redux, Tailwind CSS\n\n**Server:** Node, Express\n\n**Database:** MongoDB\n\n![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)\n![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)\n![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)\n'
            }
        ]
    },
    {
        title: 'Documentation',
        items: [
            {
                id: 'api',
                name: 'API Reference',
                template: '## 📖 API Reference\n\n#### Get all items\n\n```http\n  GET /api/items\n```\n\n| Parameter | Type     | Description                |\n| :-------- | :------- | :------------------------- |\n| `api_key` | `string` | **Required**. Your API key |\n'
            },
            {
                id: 'structure',
                name: 'Directory Structure',
                template: '## 📂 Directory Structure\n\n```text\n.\n├── src/\n│   ├── components/\n│   ├── hooks/\n│   └── styles/\n├── public/\n├── tests/\n└── package.json\n```\n'
            }
        ]
    },
    {
        title: 'Community',
        items: [
            {
                id: 'contributing',
                name: 'Contributing',
                template: '## 🤝 Contributing\n\nContributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/username/repo/issues).\n'
            },
            {
                id: 'feedback',
                name: 'Feedback',
                template: '## 💬 Feedback\n\nIf you have any feedback, please reach out to us at support@example.com\n'
            },
            {
                id: 'authors',
                name: 'Authors',
                template: '## ✍️ Authors\n\n- [@username](https://www.github.com/username)\n'
            }
        ]
    },
    {
        title: 'Layout & Styles',
        items: [
            {
                id: 'center',
                name: 'Center Image',
                template: '<p align="center">\n  <img src="https://via.placeholder.com/150" alt="Logo" width="150" height="150">\n</p>\n'
            },
            {
                id: 'collapsible',
                name: 'Collapsible Section',
                template: '<details>\n  <summary>Click to expand!</summary>\n  \n  This is hidden content that can be expanded by the user.\n</details>\n'
            }
        ]
    }
];

// DOM Elements
const editor = document.getElementById('markdown-input');
const preview = document.getElementById('markdown-preview');
const sectionsList = document.getElementById('sections-list');
const charCount = document.getElementById('char-count');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');

// Modal Elements
const modal = document.getElementById('section-modal');
const modalTitle = document.getElementById('modal-title');
const modalPreview = document.getElementById('modal-preview');
const modalEditor = document.getElementById('modal-editor');
const modalCopyBtn = document.getElementById('modal-copy-btn');
const insertBtn = document.getElementById('insert-btn');
const closeModal = document.getElementById('close-modal');
const themeToggle = document.getElementById('theme-toggle');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');

let activeSection = null;

// Functions
function updatePreview(element, content) {
    if (!element) return;

    try {
        const cleanHTML = DOMPurify.sanitize(marked.parse(content));
        element.innerHTML = cleanHTML;

        // Highlight code blocks
        if (typeof hljs !== 'undefined') {
            element.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    } catch (err) {
        console.error('Preview error:', err);
    }
}

function handleEditorInput() {
    const value = editor.value;
    updatePreview(preview, value);
    charCount.textContent = `${value.length} characters`;
    localStorage.setItem('readme-content', value);
}

function handleModalInput() {
    updatePreview(modalPreview, modalEditor.value);
}

function openSectionModal(section) {
    activeSection = section;
    modalTitle.textContent = section.name;
    modalEditor.value = section.template;
    updatePreview(modalPreview, section.template);
    modal.classList.remove('hidden');
    // Force relayout for animation
    void modal.offsetWidth;
    modal.classList.add('flex');
}

function closeSectionModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    activeSection = null;
}

function insertFromModal() {
    const template = modalEditor.value;
    const start = editor.selectionStart || 0;
    const end = editor.selectionEnd || 0;
    const text = editor.value;

    const prefix = text.length > 0 && text[Math.max(0, start - 1)] !== '\n' ? '\n\n' : '';
    const formattedTemplate = `${prefix}${template}\n`;

    editor.value = text.substring(0, start) + formattedTemplate + text.substring(end);
    closeSectionModal();
    handleEditorInput();

    // Set cursor after the inserted text
    const newCursorPos = start + formattedTemplate.length;
    editor.setSelectionRange(newCursorPos, newCursorPos);
    editor.focus();
}

function renderSections() {
    sectionsList.innerHTML = '';
    sectionCategories.forEach(category => {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'text-[10px] font-bold text-github-muted uppercase mt-6 mb-2 first:mt-0 tracking-widest';
        categoryHeader.textContent = category.title;
        sectionsList.appendChild(categoryHeader);

        category.items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 rounded-md text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-all flex items-center justify-between group border border-transparent hover:border-github-border';
            button.innerHTML = `
                <span class="truncate">${item.name}</span>
                <i data-lucide="plus" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            `;
            button.onclick = () => openSectionModal(item);
            sectionsList.appendChild(button);
        });
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function copyText(text, btn) {
    try {
        await navigator.clipboard.writeText(text);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i> Copied!`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

function downloadMarkdown() {
    const blob = new Blob([editor.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listeners
editor.addEventListener('input', handleEditorInput);
modalEditor.addEventListener('input', handleModalInput);

copyBtn.addEventListener('click', () => copyText(editor.value, copyBtn));
modalCopyBtn.addEventListener('click', () => copyText(modalEditor.value, modalCopyBtn));

downloadBtn.addEventListener('click', downloadMarkdown);
insertBtn.addEventListener('click', insertFromModal);
closeModal.addEventListener('click', closeSectionModal);

// Theme Toggle
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    themeIconSun.classList.toggle('hidden', !isDark);
    themeIconMoon.classList.toggle('hidden', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor? This will erase all your progress locally.')) {
        editor.value = '';
        handleEditorInput();
    }
});

// Close modal on click outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSectionModal();
});

// Escape key for modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSectionModal();
});

// Initial Load
window.onload = () => {
    // Theme Init
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
    }

    renderSections();
    const savedContent = localStorage.getItem('readme-content');
    if (savedContent && savedContent.trim() !== '') {
        editor.value = savedContent;
    } else {
        // Default template
        editor.value = '# 👋 Welcome to your README\n\nEdit this file or select a section from the left to get started!';
    }
    handleEditorInput();
    if (typeof lucide !== 'undefined') lucide.createIcons();
};
