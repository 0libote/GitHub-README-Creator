/**
 * GitHub README Creator - Core Logic
 */

// Configuration: Templates
const categories = [
    {
        name: 'Essential',
        icon: 'star',
        items: [
            { id: 'title', name: 'Project Title', template: '# Project Title\n\n> A concise one-line description of your project.\n' },
            { id: 'desc', name: 'Detailed Description', template: '## 📝 Description\n\nProvide a detailed overview of your project. What problem does it solve? Who is it for? Key features include:\n\n- Feature 1: Modern UI\n- Feature 2: High Performance\n- Feature 3: Ease of Use\n' },
            { id: 'install', name: 'Installation', template: '## 🛠 Installation\n\nInstall my-project following these steps:\n\n```bash\n# Clone the repository\ngit clone https://github.com/username/repo.git\n\n# Navigate to project\ncd my-project\n\n# Install dependencies\nnpm install\n```\n' }
        ]
    },
    {
        name: 'Engagement',
        icon: 'activity',
        items: [
            { id: 'badges', name: 'Social Badges', template: '## 🔗 Connect with me\n\n[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/username)\n[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/username)\n[![Portfolio](https://img.shields.io/badge/Portfolio-25292E?style=for-the-badge&logo=google-chrome&logoColor=white)](https://example.com)\n' },
            { id: 'status', name: 'Project Status', template: '![Build Status](https://img.shields.io/github/actions/workflow/status/username/repo/deploy.yml?branch=main&style=for-the-badge)\n![Version](https://img.shields.io/github/v/release/username/repo?style=for-the-badge&color=blue)\n![License](https://img.shields.io/github/license/username/repo?style=for-the-badge&color=green)\n' },
            { id: 'stats', name: 'GitHub Stats', template: '## 📊 GitHub Stats\n\n![My Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=tokyonight)\n![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=tokyonight)\n' }
        ]
    },
    {
        name: 'Technical',
        icon: 'code',
        items: [
            { id: 'tech', name: 'Tech Stack', template: '### 💻 Tech Stack\n\n**Frontend:** React, Tailwind CSS, Lucide Icons\n**Backend:** Node.js, Express, MongoDB\n**Tools:** Vite, GitHub Actions\n\n![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)\n![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)\n![Tailwind](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)\n' },
            { id: 'usage', name: 'Usage Examples', template: '## 🚀 Usage\n\n```javascript\nimport { feature } from \'my-project\';\n\n// Basic usage\nfeature.init();\n\n// Advanced usage\nfeature.configure({ theme: \'dark\' });\n```\n' },
            { id: 'api', name: 'API Reference', template: '## 📖 API Reference\n\n| Method | Endpoint | Description |\n| :--- | :--- | :--- |\n| `GET` | `/api/users` | List all users |\n| `POST` | `/api/login` | Authenticate user |\n' }
        ]
    },
    {
        name: 'Community',
        icon: 'users',
        items: [
            { id: 'contribute', name: 'Contributing', template: '## 🤝 Contributing\n\n1. Fork the Project\n2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)\n3. Commit your Changes (`git commit -m \'Add AmazingFeature\'`)\n4. Push to the Branch (`git push origin feature/AmazingFeature`)\n5. Open a Pull Request\n' },
            { id: 'license', name: 'License', template: '## 📜 License\n\nDistributed under the MIT License. See `LICENSE` for more information.\n' },
            { id: 'thanks', name: 'Acknowledge', template: '## 💖 Acknowledgements\n\n- [Awesome Library](https://github.com/lib)\n- [Inspiration](https://github.com/inspire)\n' }
        ]
    }
];

// State Management
const state = {
    content: '',
    modalSection: null,
    isDark: true
};

// DOM Refs
const elements = {
    editor: document.getElementById('markdown-input'),
    preview: document.getElementById('markdown-preview'),
    sectionsList: document.getElementById('sections-list'),
    charCount: document.getElementById('char-count'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),
    clearBtn: document.getElementById('clear-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),

    modal: document.getElementById('section-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalEditor: document.getElementById('modal-editor'),
    modalPreview: document.getElementById('modal-preview'),
    modalCopyBtn: document.getElementById('modal-copy-btn'),
    modalClearBtn: document.getElementById('modal-clear-btn'),
    insertBtn: document.getElementById('insert-btn'),
    closeModal: document.getElementById('close-modal'),

    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// --- Initialization ---

function init() {
    renderSidebar();
    loadStorage();
    setupListeners();
    updateThemeUI();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Sidebar & Templates ---

function renderSidebar() {
    elements.sectionsList.innerHTML = '';

    categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <i data-lucide="${cat.icon}" class="w-3 h-3 text-github-accent"></i>
                <span class="text-[10px] uppercase tracking-wider font-bold text-github-muted">${cat.name}</span>
            </div>
            <div class="space-y-1 mb-4"></div>
        `;
        const itemContainer = catDiv.querySelector('.space-y-1');

        cat.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-3 py-1.5 rounded-md text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-all flex items-center justify-between group border border-transparent hover:border-github-border';
            btn.innerHTML = `
                <span class="truncate">${item.name}</span>
                <i data-lucide="plus" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            `;
            btn.onclick = () => openModal(item);
            itemContainer.appendChild(btn);
        });

        elements.sectionsList.appendChild(catDiv);
    });
}

// --- Preview & Logic ---

function renderMarkdown(content, targetEl) {
    if (!targetEl) return;
    try {
        const html = DOMPurify.sanitize(marked.parse(content));
        targetEl.innerHTML = html;

        // Code highlighting
        if (typeof hljs !== 'undefined') {
            targetEl.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        }
    } catch (e) {
        console.error('Markdown error:', e);
    }
}

function handleEditorChange() {
    state.content = elements.editor.value;
    renderMarkdown(state.content, elements.preview);
    elements.charCount.textContent = `${state.content.length} characters`;
    localStorage.setItem('readme-creator-data', state.content);
}

// --- Modal Control ---

function openModal(item) {
    state.modalSection = item;
    elements.modalTitle.textContent = item.name;
    elements.modalEditor.value = item.template;
    renderMarkdown(item.template, elements.modalPreview);

    elements.modal.classList.remove('hidden');
    elements.modal.classList.add('flex');
    elements.modalEditor.focus();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
    elements.modal.classList.add('hidden');
    elements.modal.classList.remove('flex');
    state.modalSection = null;
}

function handleModalInsert() {
    const template = elements.modalEditor.value;
    const start = elements.editor.selectionStart || 0;
    const end = elements.editor.selectionEnd || 0;
    const current = elements.editor.value;

    const prefix = current.length > 0 && current[Math.max(0, start - 1)] !== '\n' ? '\n\n' : '';
    const output = current.substring(0, start) + prefix + template + '\n' + current.substring(end);

    elements.editor.value = output;
    closeModal();
    handleEditorChange();
    showToast('Section inserted! ✨');

    const newPos = start + prefix.length + template.length + 1;
    elements.editor.setSelectionRange(newPos, newPos);
    elements.editor.focus();
}

// --- Utilities ---

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('translate-y-20', 'opacity-0');
    elements.toast.classList.add('-translate-y-0', 'opacity-100');

    setTimeout(() => {
        elements.toast.classList.add('translate-y-20', 'opacity-0');
        elements.toast.classList.remove('-translate-y-0', 'opacity-100');
    }, 2500);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard! 📋');
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

function downloadFile() {
    const blob = new Blob([elements.editor.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloading README.md... 💾');
}

function updateThemeUI() {
    const isDark = state.isDark;
    document.documentElement.classList.toggle('dark', isDark);
    elements.themeIconSun.classList.toggle('hidden', !isDark);
    elements.themeIconMoon.classList.toggle('hidden', isDark);
}

function loadStorage() {
    const saved = localStorage.getItem('readme-creator-data');
    if (saved !== null) {
        elements.editor.value = saved;
    } else {
        elements.editor.value = '# 👋 Welcome to your README\n\nSelect a section from the left to start building your professional project documentation.';
    }

    const theme = localStorage.getItem('readme-theme');
    if (theme === 'light') state.isDark = false;

    handleEditorChange();
}

// --- Event Listeners ---

function setupListeners() {
    elements.editor.addEventListener('input', handleEditorChange);
    elements.modalEditor.addEventListener('input', () => renderMarkdown(elements.modalEditor.value, elements.modalPreview));

    elements.copyBtn.addEventListener('click', () => copyToClipboard(elements.editor.value));
    elements.downloadBtn.addEventListener('click', downloadFile);
    elements.clearBtn.addEventListener('click', () => {
        if (confirm('Clear everything?')) {
            elements.editor.value = '';
            handleEditorChange();
        }
    });

    elements.themeToggle.addEventListener('click', () => {
        state.isDark = !state.isDark;
        localStorage.setItem('readme-theme', state.isDark ? 'dark' : 'light');
        updateThemeUI();
    });

    // Modal
    elements.closeModal.addEventListener('click', closeModal);
    elements.insertBtn.addEventListener('click', handleModalInsert);
    elements.modalCopyBtn.addEventListener('click', () => copyToClipboard(elements.modalEditor.value));
    elements.modalClearBtn.addEventListener('click', () => {
        elements.modalEditor.value = '';
        renderMarkdown('', elements.modalPreview);
    });

    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Boot
window.onload = init;
