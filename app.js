// Sections Configuration
const sectionCategories = [
    {
        title: 'Core',
        items: [
            {
                id: 'title',
                name: 'Project Title',
                template: '# Project Title\n\n> A brief description of what this project does and who it\'s for.\n'
            },
            {
                id: 'description',
                name: 'Description',
                template: '## Description\n\nExplain the problem your project solves. This is the "why" behind your code.\n'
            }
        ]
    },
    {
        title: 'Engagement',
        items: [
            {
                id: 'badges',
                name: 'Badges',
                template: '[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)\n![GitHub stars](https://img.shields.io/github/stars/username/repo?style=social)\n![GitHub forks](https://img.shields.io/github/forks/username/repo?style=social)\n![GitHub contributors](https://img.shields.io/github/contributors/username/repo)\n![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)\n'
            },
            {
                id: 'socials',
                name: 'Social Links',
                template: '## Connect with me\n\n[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)\n[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourhandle)\n'
            }
        ]
    },
    {
        title: 'Technical',
        items: [
            {
                id: 'techstack',
                name: 'Tech Stack',
                template: '### Tech Stack\n\n**Client:** React, Tailwind CSS, Lucide React\n\n**Server:** Node.js, Express, MongoDB\n\n**Badges:**\n![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)\n![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)\n'
            },
            {
                id: 'installation',
                name: 'Installation',
                template: '## Installation\n\nGive instructions on how to install your project and its dependencies.\n\n```bash\nnpm install my-project\n```\n'
            },
            {
                id: 'usage',
                name: 'Usage',
                template: '## Usage\n\nShow examples of how to use your project.\n\n```javascript\nimport { feature } from \'my-project\';\nfeature();\n```\n'
            }
        ]
    },
    {
        title: 'Other',
        items: [
            {
                id: 'roadmap',
                name: 'Roadmap',
                template: '## Roadmap\n\n- [ ] Task 1\n- [x] Task 2\n- [ ] Task 3\n'
            },
            {
                id: 'license',
                name: 'License',
                template: '## License\n\n[MIT](https://choosealicense.com/licenses/mit/)\n'
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

let activeSection = null;

// Initialize Lucide Icons
lucide.createIcons();

// Functions
function updatePreview(element, content) {
    const cleanHTML = DOMPurify.sanitize(marked.parse(content));
    element.innerHTML = cleanHTML;

    // Highlight code blocks
    element.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
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
}

function closeSectionModal() {
    modal.classList.add('hidden');
    activeSection = null;
}

function insertFromModal() {
    const template = modalEditor.value;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;

    const prefix = text.length > 0 && text[Math.max(0, start - 1)] !== '\n' ? '\n\n' : '';
    const formattedTemplate = `${prefix}${template}\n`;

    editor.value = text.substring(0, start) + formattedTemplate + text.substring(end);
    closeSectionModal();
    handleEditorInput();
    editor.focus();
}

function renderSections() {
    sectionsList.innerHTML = '';
    sectionCategories.forEach(category => {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'text-[10px] font-bold text-github-muted uppercase mt-4 mb-2 first:mt-0';
        categoryHeader.textContent = category.title;
        sectionsList.appendChild(categoryHeader);

        category.items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-1.5 rounded-md text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-colors flex items-center justify-between group';
            button.innerHTML = `
                <span class="truncate">${item.name}</span>
                <i data-lucide="chevron-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            `;
            button.onclick = () => openSectionModal(item);
            sectionsList.appendChild(button);
        });
    });
    lucide.createIcons();
}

async function copyText(text, btn) {
    try {
        await navigator.clipboard.writeText(text);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i> Copied!`;
        lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            lucide.createIcons();
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

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
        editor.value = '';
        handleEditorInput();
    }
});

// Close modal on click outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSectionModal();
});

// Escape key to close modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSectionModal();
});

// Initial Load
window.onload = () => {
    renderSections();
    const savedContent = localStorage.getItem('readme-content');
    if (savedContent) {
        editor.value = savedContent;
    } else {
        editor.value = '# New Project\n\nWelcome to your new project!';
    }
    handleEditorInput();
};
