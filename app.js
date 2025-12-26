// Sections Configuration
const sections = [
    {
        id: 'title',
        name: 'Project Title',
        template: '# Project Title\n\n> A brief description of what this project does and who it\'s for.\n'
    },
    {
        id: 'description',
        name: 'Description',
        template: '## Description\n\nExplain the problem your project solves. This is the "why" behind your code.\n'
    },
    {
        id: 'installation',
        name: 'Installation',
        template: '## Installation\n\nGive instructions on how to install your project and its dependencies.\n\n```bash\nnpm install my-project\n```\n'
    },
    {
        id: 'usage',
        name: 'Usage',
        template: '## Usage\n\nShow examples of how to use your project. Code snippets are great here!\n\n```javascript\nimport { feature } from \'my-project\';\n\nfeature();\n```\n'
    },
    {
        id: 'roadmap',
        name: 'Roadmap',
        template: '## Roadmap\n\n- [ ] Task 1\n- [x] Task 2\n- [ ] Task 3\n'
    },
    {
        id: 'contributing',
        name: 'Contributing',
        template: '## Contributing\n\nContributions are always welcome! Please read the contribution guidelines first.\n'
    },
    {
        id: 'license',
        name: 'License',
        template: '## License\n\n[MIT](https://choosealicense.com/licenses/mit/)\n'
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

// Initialize Lucide Icons
lucide.createIcons();

// Functions
function updatePreview() {
    const value = editor.value;
    const cleanHTML = DOMPurify.sanitize(marked.parse(value));
    preview.innerHTML = cleanHTML;
    charCount.textContent = `${value.length} characters`;
    
    // Auto-save to localStorage
    localStorage.setItem('readme-content', value);
}

function insertSection(template) {
    const cursorFallback = editor.value.length;
    const start = editor.selectionStart ?? cursorFallback;
    const end = editor.selectionEnd ?? cursorFallback;
    const text = editor.value;
    
    // Add newlines if needed
    const prefix = text.length > 0 && text[start - 1] !== '\n' ? '\n' : '';
    const formattedTemplate = `${prefix}${template}\n`;
    
    editor.value = text.substring(0, start) + formattedTemplate + text.substring(end);
    editor.focus();
    updatePreview();
}

function renderSections() {
    sections.forEach(section => {
        const button = document.createElement('button');
        button.className = 'w-full text-left px-3 py-2 rounded-md text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-colors flex items-center gap-2';
        button.innerHTML = `<i data-lucide="plus" class="w-3 h-3"></i> ${section.name}`;
        button.onclick = () => insertSection(section.template);
        sectionsList.appendChild(button);
    });
    lucide.createIcons(); // Refresh icons for new buttons
}

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(editor.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i> Copied!`;
        lucide.createIcons();
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
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

function clearEditor() {
    if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
        editor.value = '';
        updatePreview();
    }
}

// Event Listeners
editor.addEventListener('input', updatePreview);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadMarkdown);
clearBtn.addEventListener('click', clearEditor);

// Keyboard Shortcuts
editor.addEventListener('keydown', (e) => {
    // Ctrl+S or Cmd+S to "Save" (already auto-saves, so we just prevent default)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Maybe show a tiny toast? 
    }
});

// Initial Load
window.onload = () => {
    renderSections();
    const savedContent = localStorage.getItem('readme-content');
    if (savedContent) {
        editor.value = savedContent;
    } else {
        editor.value = sections[0].template; // Load project title by default
    }
    updatePreview();
};
