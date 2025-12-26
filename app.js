/**
 * GitHub README Pro - Advanced Creator Logic
 */

// Configuration: Massive & Refined Templates
const categories = [
    {
        name: 'Introduction',
        icon: 'user-circle',
        items: [
            { id: 'banner', name: 'Project Banner', template: '<p align="center">\n  <img src="https://via.placeholder.com/800x200?text=YOUR+PROJECT+BANNER" alt="Banner" width="100%">\n</p>\n\n# 👋 Hello, fellow developers!\n' },
            { id: 'title', name: 'Header & Quote', template: '# [PROJECT_NAME]\n\n> "[Insert a punchy, one-sentence description that explains the core value proposition]" 🚀\n' },
            { id: 'about', name: 'Detailed About', template: '## 📝 About the Project\n\n[PROJECT_NAME] was built to solve [SPECIFIC_PROBLEM]. It focuses on [KEY_ASPECT_1], [KEY_ASPECT_2], and [KEY_ASPECT_3].\n\nHere\'s why you should use it:\n- ⚡ **Performance**: Lightning fast execution.\n- 🎨 **UX**: Clean and intuitive interface.\n- 🛠 **Flexibility**: Works everywhere.\n' }
        ]
    },
    {
        name: 'Quick Stats & Links',
        icon: 'bar-chart-2',
        items: [
            { id: 'badges', name: 'Activity Badges', template: '![GitHub release (latest by date)](https://img.shields.io/github/v/release/[USER]/[REPO]?style=for-the-badge&color=2f81f7)\n![GitHub last commit](https://img.shields.io/github/last-commit/[USER]/[REPO]?style=for-the-badge&color=238636)\n![GitHub stars](https://img.shields.io/github/stars/[USER]/[REPO]?style=for-the-badge&color=e3b341)\n![GitHub issues](https://img.shields.io/github/issues/[USER]/[REPO]?style=for-the-badge&color=d73a49)\n' },
            { id: 'social', name: 'Premium Socials', template: '## 🔗 Connect with the Creator\n\n<p align="left">\n<a href="https://twitter.com/[USER]"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>\n<a href="https://linkedin.com/in/[USER]"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>\n<a href="https://discord.gg/[INVITE]"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a>\n</p>\n' },
            { id: 'deploy', name: 'Live Deployments', template: '## 🌐 Live Demo\n\nCheck out the live application here: [**Live Link**](https://[APP_NAME].vercel.app) 🚀\n' }
        ]
    },
    {
        name: 'Technical Depth',
        icon: 'terminal',
        items: [
            { id: 'tech', name: 'Tech Stack Grid', template: '### 💻 Built With\n\n| Frontend | Backend | DevTools |\n| :--- | :--- | :--- |\n| ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | ![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |\n| ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |\n' },
            { id: 'api', name: 'Endpoint Docs', template: '## 📖 API Documentation\n\n| Method | Endpoint | Data | Description |\n| :--- | :--- | :--- | :--- |\n| `GET` | `/v1/auth/user` | `none` | Returns user data |\n| `POST` | `/v1/auth/login` | `{email, pass}` | Sets auth cookie |\n' },
            { id: 'install', name: 'Pro Installation', template: '## 🛠 Installation & Setup\n\n1. Clone the repository\n   ```bash\n   git clone https://github.com/[USER]/[REPO].git\n   ```\n2. Install dependencies\n   ```bash\n   npm install\n   ```\n3. Start the dev server\n   ```bash\n   npm run dev\n   ```\n' }
        ]
    },
    {
        name: 'Badge Studio',
        icon: 'shield',
        isBadgeStudio: true,
        items: [
            { id: 'custom-badge', name: 'Generate Any Badge', template: '![Custom Badge](https://img.shields.io/badge/[LABEL]-[MESSAGE]-[COLOR]?style=[STYLE])' }
        ]
    },
    {
        name: 'Guidelines',
        icon: 'book-open',
        items: [
            { id: 'contributing', name: 'Code of Conduct', template: '## 🤝 Contributing\n\n1. Fork the repo\n2. Create feature branch\n3. Push changes\n4. Open a PR!\n\nCheck out the full [contribution guide](CONTRIBUTING.md) for details.\n' },
            { id: 'license', name: 'License Info', template: '## 📜 License\n\nDistributed under the **MIT License**. See `LICENSE` for details.\n' }
        ]
    }
];

// UI Reference
const ui = {
    editor: document.getElementById('markdown-input'),
    preview: document.getElementById('markdown-preview'),
    sectionsList: document.getElementById('sections-list'),
    charCount: document.getElementById('char-count'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),
    clearBtn: document.getElementById('clear-btn'),

    modal: document.getElementById('section-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalEditor: document.getElementById('modal-editor'),
    modalPreview: document.getElementById('modal-preview'),
    modalCopyBtn: document.getElementById('modal-copy-btn'),
    modalClearBtn: document.getElementById('modal-clear-btn'),
    insertBtn: document.getElementById('insert-btn'),
    closeModal: document.getElementById('close-modal'),
    modalIcon: document.getElementById('modal-icon'),

    badgeConfig: document.getElementById('badge-configurator'),
    badgeLabel: document.getElementById('badge-label'),
    badgeMessage: document.getElementById('badge-message'),
    badgeColor: document.getElementById('badge-color'),
    badgeStyle: document.getElementById('badge-style'),

    resizer: document.getElementById('resizer'),
    editorContainer: document.getElementById('editor-container'),
    previewContainer: document.getElementById('preview-container'),

    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    toastIcon: document.getElementById('toast-icon')
};

let currentSection = null;

// --- App Boot ---

function boot() {
    renderSidebar();
    loadWorkspace();
    setupCoreListeners();
    setupResizer();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Sidebar Logic ---

function renderSidebar() {
    ui.sectionsList.innerHTML = '';
    categories.forEach(cat => {
        const catGroup = document.createElement('div');
        catGroup.innerHTML = `
            <div class="flex items-center gap-2 mb-3 px-1">
                <i data-lucide="${cat.icon}" class="w-3.5 h-3.5 text-github-accent/80"></i>
                <span class="text-[11px] font-bold text-github-muted tracking-widest uppercase">${cat.name}</span>
            </div>
            <div class="space-y-1 ml-0.5"></div>
        `;
        const list = catGroup.querySelector('.space-y-1');

        cat.items.forEach(item => {
            const row = document.createElement('button');
            row.className = 'w-full text-left px-3 py-2 rounded-lg text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-all group flex items-center justify-between border border-transparent hover:border-github-border/50 active:scale-[0.98]';
            row.innerHTML = `
                <span class="truncate font-medium">${item.name}</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"></i>
            `;
            row.onclick = () => openModal(item, cat);
            list.appendChild(row);
        });
        ui.sectionsList.appendChild(catGroup);
    });
}

// --- Resizer Logic ---

function setupResizer() {
    let isResizing = false;

    ui.resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const totalWidth = window.innerWidth - ui.sectionsList.parentElement.offsetWidth;
        const offsetLeft = e.clientX - ui.sectionsList.parentElement.offsetWidth;
        let percentage = (offsetLeft / totalWidth) * 100;

        // Boundaries
        percentage = Math.max(10, Math.min(90, percentage));

        ui.editorContainer.style.flex = `0 1 ${percentage}%`;
        ui.previewContainer.style.flex = `0 1 ${100 - percentage}%`;
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.classList.remove('resizing');
    });
}

// --- Preview & State ---

function notifyChange() {
    const val = ui.editor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(val));
        ui.preview.innerHTML = html;
        if (typeof hljs !== 'undefined') {
            ui.preview.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
        }
    } catch (e) { console.warn(e); }

    ui.charCount.textContent = `${val.length} CHARS`;
    localStorage.setItem('readme_pro_draft', val);
}

// --- Modal & Badge Studio ---

function openModal(item, cat) {
    currentSection = { ...item, type: cat.isBadgeStudio ? 'badge' : 'item' };

    ui.modalTitle.textContent = item.name;
    ui.modalIcon.setAttribute('data-lucide', cat.icon);
    ui.modalIcon.className = \`w-6 h-6 \${cat.isBadgeStudio ? 'text-github-success' : 'text-github-accent'}\`;
    
    if (cat.isBadgeStudio) {
        ui.badgeConfig.classList.remove('hidden');
        ui.modalSubtitle.textContent = 'Generator Mode: Create custom Shields.io badges';
        syncBadge();
    } else {
        ui.badgeConfig.classList.add('hidden');
        ui.modalSubtitle.textContent = 'Customization Mode: Adapt this block to your needs';
        ui.modalEditor.value = item.template;
    }
    
    syncModalPreview();
    ui.modal.classList.remove('hidden');
    ui.modal.classList.add('flex');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function syncBadge() {
    const label = encodeURIComponent(ui.badgeLabel.value || 'Label');
    const msg = encodeURIComponent(ui.badgeMessage.value || 'Value');
    const color = ui.badgeColor.value.replace('#', '');
    const style = ui.badgeStyle.value;
    
    const template = \`![Custom Badge](https://img.shields.io/badge/\${label}-\${msg}-\${color}?style=\${style})\`;
    ui.modalEditor.value = template;
    syncModalPreview();
}

function syncModalPreview() {
    const raw = ui.modalEditor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(raw));
        ui.modalPreview.innerHTML = html;
    } catch (e) { }
}

function insertToWorkspace() {
    const val = ui.modalEditor.value;
    const start = ui.editor.selectionStart || 0;
    const end = ui.editor.selectionEnd || 0;
    const current = ui.editor.value;
    
    const gap = current.length > 0 && current[Math.max(0, start - 1)] !== '\n' ? '\n\n' : '';
    ui.editor.value = current.substring(0, start) + gap + val + '\n' + current.substring(end);
    
    closeModal();
    notifyChange();
    showToast('Block inserted successfully', 'check-circle');
    
    const next = start + gap.length + val.length + 1;
    ui.editor.setSelectionRange(next, next);
    ui.editor.focus();
}

// --- User Feedback ---

function showToast(msg, icon = 'check') {
    ui.toastMessage.textContent = msg;
    ui.toastIcon.setAttribute('data-lucide', icon);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    ui.toast.classList.remove('translate-y-32', 'opacity-0');
    ui.toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        ui.toast.classList.remove('translate-y-0', 'opacity-100');
        ui.toast.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}

function loadWorkspace() {
    const saved = localStorage.getItem('readme_pro_draft');
    if (saved) {
        ui.editor.value = saved;
    } else {
        ui.editor.value = '# 🏁 Welcome to BuildSpace\n\nChoose a template from the left to start building your GitHub documentation. Automagically rendered for you.';
    }
    notifyChange();
}

// --- Event Listeners ---

function setupCoreListeners() {
    ui.editor.addEventListener('input', notifyChange);
    
    ui.copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(ui.editor.value);
            showToast('README copied to clipboard');
        } catch (e) { showToast('Copy failed', 'x-circle'); }
    });
    
    ui.downloadBtn.addEventListener('click', () => {
        const blob = new Blob([ui.editor.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        a.click();
        showToast('README.md saved');
    });
    
    ui.clearBtn.addEventListener('click', () => {
        if (confirm('Clear workspace? All unsaved work will be lost.')) {
            ui.editor.value = '';
            notifyChange();
            showToast('Workspace reset', 'trash');
        }
    });

    // Modal
    ui.closeModal.addEventListener('click', closeModal);
    ui.insertBtn.addEventListener('click', insertToWorkspace);
    ui.modalCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(ui.modalEditor.value);
        showToast('Section copied', 'copy');
    });
    ui.modalClearBtn.addEventListener('click', () => {
        ui.modalEditor.value = '';
        syncModalPreview();
    });
    ui.modalEditor.addEventListener('input', syncModalPreview);
    
    // Badge Config
    [ui.badgeLabel, ui.badgeMessage, ui.badgeColor, ui.badgeStyle].forEach(el => {
        el.addEventListener('input', syncBadge);
    });

    function closeModal() {
        ui.modal.classList.add('hidden');
        ui.modal.classList.remove('flex');
    }
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Boot the App
window.onload = boot;
