/**
 * GitHub README Pro - Core Logic v2
 */

// 1. Centralized Templates
const SECTIONS = [
    {
        name: 'Essential',
        icon: 'star',
        items: [
            { id: 'banner', name: 'Premium Banner', template: '<p align="center">\n  <img src="https://via.placeholder.com/800x200?text=[TITLE]" alt="Banner" width="100%">\n</p>\n\n# 👋 Welcome to [TITLE]\n' },
            { id: 'header', name: 'Title & Quote', template: '# [TITLE] 🚀\n\n> "Simplifying [REPO] with modern engineering."\n' },
            { id: 'about', name: 'About the Project', template: '## 📝 Overview\n\n**[TITLE]** is a robust solution designed to handle [PROBLEM]. Built by **@[USER]**, it focuses on efficiency and developer experience.\n' }
        ]
    },
    {
        name: 'Status & Socials',
        icon: 'activity',
        items: [
            { id: 'badges', name: 'Live Badges', template: '![GitHub release](https://img.shields.io/github/v/release/[USER]/[REPO]?style=for-the-badge&color=2f81f7)\n![GitHub Activity](https://img.shields.io/github/last-commit/[USER]/[REPO]?style=for-the-badge&color=238636)\n![Build Status](https://img.shields.io/github/actions/workflow/status/[USER]/[REPO]/deploy.yml?branch=main&style=for-the-badge)\n' },
            { id: 'links', name: 'Project Links', template: '## 🔗 Connect\n\n- [GitHub Profile](https://github.com/[USER])\n- [Repository](https://github.com/[USER]/[REPO])\n- [Live Demo](https://[REPO].vercel.app)\n' }
        ]
    },
    {
        name: 'Technical Depth',
        icon: 'terminal',
        items: [
            { id: 'stack', name: 'Tech Stack', template: '### 💻 Built With\n\n- **Frontend**: React, Tailwind CSS\n- **Backend**: Node.js, GitHub Actions\n- **Deployment**: [REPO] on Vercel\n' },
            { id: 'install', name: 'Pro Setup', template: '## 🛠 Installation\n\n```bash\ngit clone https://github.com/[USER]/[REPO].git\ncd [REPO]\nnpm install\nnpm run dev\n```\n' }
        ]
    },
    {
        name: 'Badge Studio',
        icon: 'shield',
        isBadgeStudio: true,
        items: [
            { id: 'badge-gen', name: 'Custom Shield', template: '![Badge](https://img.shields.io/badge/[LABEL]-[VALUE]-[COLOR]?style=[STYLE])' }
        ]
    },
    {
        name: 'Legal & Guidelines',
        icon: 'file-text',
        items: [
            { id: 'contributing', name: 'Contributing', template: '## 🤝 Contributing\n\nContributions to **[REPO]** are always welcome! Check out the [Guide](CONTRIBUTING.md).\n' },
            { id: 'license', name: 'License', template: '## 📜 License\n\nDistributed under the MIT License. See `LICENSE` for more information.\n' }
        ]
    }
];

// 2. Global State & UI
const APP = {
    vars: {
        user: '0libote',
        repo: 'GitHub-README-Creator',
        title: 'README Creator Pro'
    },
    ui: {},
    currentSection: null,
    isResizing: false
};

// 3. Logic Functions
function injectVariables(text) {
    return text
        .replace(/\[USER\]/g, APP.vars.user || 'YOUR_USER')
        .replace(/\[REPO\]/g, APP.vars.repo || 'YOUR_REPO')
        .replace(/\[TITLE\]/g, APP.vars.title || 'YOUR_PROJECT');
}

function updatePreview() {
    const raw = APP.ui.editor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(raw));
        APP.ui.preview.innerHTML = html;
        if (window.hljs) APP.ui.preview.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    } catch (e) { }
    APP.ui.charCount.textContent = `${raw.length} CHARS`;
    localStorage.setItem('readme_draft_v3', raw);
}

function renderSidebar() {
    APP.ui.sectionsList.innerHTML = '';
    SECTIONS.forEach(cat => {
        const group = document.createElement('div');
        group.innerHTML = `
            <div class="flex items-center gap-2 mb-3 px-1">
                <i data-lucide="${cat.icon}" class="w-3 h-3 text-github-accent/80"></i>
                <span class="text-[9px] font-bold text-github-muted uppercase tracking-widest">${cat.name}</span>
            </div>
            <div class="space-y-1"></div>
        `;
        const container = group.querySelector('.space-y-1');

        cat.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-3 py-1.5 rounded-lg text-xs text-github-muted hover:bg-github-btn hover:text-github-text transition-all group border border-transparent hover:border-github-border/40';
            btn.innerHTML = `<span>${item.name}</span>`;
            btn.onclick = () => openModal(item, cat);
            container.appendChild(btn);
        });
        APP.ui.sectionsList.appendChild(group);
    });
    if (window.lucide) window.lucide.createIcons();
}

function openModal(item, cat) {
    APP.currentSection = { ...item, isBadge: cat.isBadgeStudio };
    APP.ui.modalTitle.textContent = item.name;
    APP.ui.modalIcon.setAttribute('data-lucide', cat.icon);

    if (cat.isBadgeStudio) {
        APP.ui.badgeControls.classList.remove('hidden');
        syncBadge();
    } else {
        APP.ui.badgeControls.classList.add('hidden');
        APP.ui.modalEditor.value = injectVariables(item.template);
    }

    syncModalPreview();
    APP.ui.modal.classList.remove('hidden');
    APP.ui.modal.classList.add('flex');
    setTimeout(() => {
        APP.ui.modal.style.opacity = '1';
        APP.ui.modalWindow.style.transform = 'scale(1)';
    }, 10);
    if (window.lucide) window.lucide.createIcons();
}

function closeModal() {
    APP.ui.modal.style.opacity = '0';
    APP.ui.modalWindow.style.transform = 'scale(0.95)';
    setTimeout(() => {
        APP.ui.modal.classList.add('hidden');
        APP.ui.modal.classList.remove('flex');
    }, 200);
}

function syncBadge() {
    const l = encodeURIComponent(APP.ui.badgeLabel.value || 'Label');
    const v = encodeURIComponent(APP.ui.badgeValue.value || 'Value');
    const c = APP.ui.badgeColor.value.replace('#', '');
    const s = APP.ui.badgeStyle.value;
    APP.ui.modalEditor.value = `![Badge](https://img.shields.io/badge/${l}-${v}-${c}?style=${s})`;
    syncModalPreview();
}

function syncModalPreview() {
    const raw = APP.ui.modalEditor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(raw));
        APP.ui.modalPreview.innerHTML = html;
        if (window.hljs) APP.ui.modalPreview.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    } catch (e) { }
}

function showToast(msg) {
    APP.ui.toastMsg.textContent = msg;
    APP.ui.toast.classList.remove('translate-y-32', 'opacity-0');
    APP.ui.toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        APP.ui.toast.classList.remove('translate-y-0', 'opacity-100');
        APP.ui.toast.classList.add('translate-y-32', 'opacity-0');
    }, 2500);
}

// 4. Initializer
function init() {
    // Map UI
    APP.ui = {
        editor: document.getElementById('markdown-input'),
        preview: document.getElementById('markdown-preview'),
        sectionsList: document.getElementById('sections-list'),
        charCount: document.getElementById('char-count'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        clearBtn: document.getElementById('clear-btn'),

        modal: document.getElementById('modal-overlay'),
        modalWindow: document.getElementById('modal-window'),
        modalTitle: document.getElementById('modal-title-text'),
        modalEditor: document.getElementById('input-modal-markdown'),
        modalPreview: document.getElementById('output-modal-preview'),
        modalClose: document.getElementById('modal-close-btn'),
        modalIcon: document.getElementById('modal-header-icon'),
        modalInsert: document.getElementById('action-modal-insert'),
        modalCopy: document.getElementById('action-modal-copy'),

        badgeControls: document.getElementById('badge-controls'),
        badgeLabel: document.getElementById('input-badge-label'),
        badgeValue: document.getElementById('input-badge-value'),
        badgeColor: document.getElementById('input-badge-color'),
        badgeStyle: document.getElementById('input-badge-style'),

        dragHandle: document.getElementById('drag-handle'),
        editorPane: document.getElementById('editor-pane'),
        previewPane: document.getElementById('preview-pane'),
        sidebar: document.getElementById('main-sidebar'),

        toast: document.getElementById('toast-ui'),
        toastMsg: document.getElementById('toast-ui-msg'),

        varUser: document.getElementById('var-user'),
        varRepo: document.getElementById('var-repo'),
        varTitle: document.getElementById('var-title')
    };

    // Load Draft
    const draft = localStorage.getItem('readme_draft_v3');
    if (draft) APP.ui.editor.value = draft;
    else APP.ui.editor.value = '# 🏁 Get Started\n\nSetup your variables above and select components from the left.';
    updatePreview();

    // Variable Listeners
    [APP.ui.varUser, APP.ui.varRepo, APP.ui.varTitle].forEach(el => {
        el.addEventListener('input', (e) => {
            const id = e.target.id;
            if (id === 'var-user') APP.vars.user = e.target.value;
            if (id === 'var-repo') APP.vars.repo = e.target.value;
            if (id === 'var-title') APP.vars.title = e.target.value;
        });
    });

    // Core Listeners
    APP.ui.editor.oninput = updatePreview;
    APP.ui.copyBtn.onclick = () => {
        navigator.clipboard.writeText(APP.ui.editor.value);
        showToast('COPIED');
    };
    APP.ui.downloadBtn.onclick = () => {
        const b = new Blob([APP.ui.editor.value], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'README.md'; a.click();
        showToast('SAVED');
    };
    APP.ui.clearBtn.onclick = () => {
        if (confirm('Clear draft?')) {
            APP.ui.editor.value = '';
            updatePreview();
        }
    };

    // Modal Listeners
    APP.ui.modalClose.onclick = closeModal;
    APP.ui.modal.onclick = (e) => { if (e.target === APP.ui.modal) closeModal(); };
    APP.ui.modalEditor.oninput = syncModalPreview;
    APP.ui.modalInsert.onclick = () => {
        const text = APP.ui.modalEditor.value;
        const start = APP.ui.editor.selectionStart;
        const end = APP.ui.editor.selectionEnd;
        const current = APP.ui.editor.value;
        const gap = current.length > 0 && current[start - 1] !== '\n' ? '\n\n' : '';
        APP.ui.editor.value = current.substring(0, start) + gap + text + '\n' + current.substring(end);
        closeModal();
        updatePreview();
        showToast('INSERTED');
        const pos = start + gap.length + text.length + 1;
        APP.ui.editor.setSelectionRange(pos, pos);
        APP.ui.editor.focus();
    };
    APP.ui.modalCopy.onclick = () => {
        navigator.clipboard.writeText(APP.ui.modalEditor.value);
        showToast('COPIED');
    };

    // Badge Listeners
    [APP.ui.badgeLabel, APP.ui.badgeValue, APP.ui.badgeColor, APP.ui.badgeStyle].forEach(el => {
        el.oninput = syncBadge;
    });

    // Resizer logic
    APP.ui.dragHandle.onmousedown = () => {
        APP.isResizing = true;
        document.body.classList.add('resizing');
    };
    document.onmousemove = (e) => {
        if (!APP.isResizing) return;
        const sidebarW = APP.ui.sidebar.getBoundingClientRect().width;
        const availableW = window.innerWidth - sidebarW;
        const relativeX = e.clientX - sidebarW;
        let p = (relativeX / availableW) * 100;
        p = Math.max(10, Math.min(90, p));
        APP.ui.editorPane.style.flexBasis = `${p}%`;
        APP.ui.previewPane.style.flexBasis = `${100 - p}%`;
    };
    document.onmouseup = () => {
        APP.isResizing = false;
        document.body.classList.remove('resizing');
    };

    renderSidebar();
}

window.onload = init;
