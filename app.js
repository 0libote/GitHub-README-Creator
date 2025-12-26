/**
 * GitHub README Pro - Core Engine
 */

// 1. Data Definitions
const SECTIONS = [
    {
        name: 'Introduction',
        icon: 'user',
        items: [
            { id: 'banner', name: 'Premium Banner', template: '<p align="center">\n  <img src="https://via.placeholder.com/800x200?text=YOUR+PROJECT+BANNER" alt="Banner" width="100%">\n</p>\n\n# 👋 Welcome to [Project Name]\n' },
            { id: 'header', name: 'Header & Tagline', template: '# [Project Name]\n\n> A professional and highly efficient solution for [Problem Space]. 🚀\n' },
            { id: 'about', name: 'About the Project', template: '## 📝 Overview\n\n[Project Name] provides a robust architecture for [Feature]. It is designed with performance and scalability in mind.\n\n### Key Highlights\n- ⚡ **Speed**: Optimized for rapid execution.\n- 🛡️ **Security**: Built with modern security standards.\n- 🎨 **Customizable**: Tailored to your specific needs.\n' }
        ]
    },
    {
        name: 'Interactive Stats',
        icon: 'bar-chart',
        items: [
            { id: 'activity', name: 'Project Activity', template: '![GitHub release (latest by date)](https://img.shields.io/github/v/release/[User]/[Repo]?style=for-the-badge&color=2f81f7)\n![GitHub last commit](https://img.shields.io/github/last-commit/[User]/[Repo]?style=for-the-badge&color=238636)\n![GitHub stars](https://img.shields.io/github/stars/[User]/[Repo]?style=for-the-badge&color=e3b341)\n' },
            { id: 'socials', name: 'Connect & Support', template: '## 🔗 Reach Out\n\n<p align="left">\n<a href="https://twitter.com/[User]"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>\n<a href="https://linkedin.com/in/[User]"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>\n</p>\n' }
        ]
    },
    {
        name: 'Technical Info',
        icon: 'terminal',
        items: [
            { id: 'stack', name: 'Tech Stack Grid', template: '### 💻 Built With\n\n| Level | Technology | Purpose |\n| :--- | :--- | :--- |\n| Frontend | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Layer |\n| Backend | ![Node](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | Server Logic |\n| Styling | ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Design System |\n' },
            { id: 'setup', name: 'Installation Guide', template: '## 🛠 Getting Started\n\n### Prerequisites\n- Node.js (v18+)\n- npm or yarn\n\n### Installation\n1. Clone the repo\n   ```bash\n   git clone https://github.com/[User]/[Repo].git\n   ```\n2. Install packages\n   ```bash\n   npm install\n   ```\n3. Run development\n   ```bash\n   npm run dev\n   ```\n' }
        ]
    },
    {
        name: 'Badge Studio',
        icon: 'shield',
        isBadgeStudio: true,
        items: [
            { id: 'badge-gen', name: 'Create Any Badge', template: '![Badge](https://img.shields.io/badge/[Label]-[Value]-[Color]?style=[Style])' }
        ]
    }
];

// 2. Global UI Object
const ui = {};
let currentSelection = null;

// 3. Core Functions (Global Scope)
function populateUI() {
    ui.sidebar = document.getElementById('main-sidebar');
    ui.sectionsList = document.getElementById('sections-list');
    ui.editor = document.getElementById('markdown-input');
    ui.preview = document.getElementById('markdown-preview');
    ui.charCount = document.getElementById('char-count');
    ui.copyBtn = document.getElementById('copy-btn');
    ui.downloadBtn = document.getElementById('download-btn');
    ui.clearBtn = document.getElementById('clear-btn');

    ui.modal = document.getElementById('modal-overlay');
    ui.modalWindow = document.getElementById('modal-window');
    ui.modalTitle = document.getElementById('modal-title-text');
    ui.modalDesc = document.getElementById('modal-desc-text');
    ui.modalEditor = document.getElementById('input-modal-markdown');
    ui.modalPreview = document.getElementById('output-modal-preview');
    ui.modalClose = document.getElementById('modal-close-btn');
    ui.modalIcon = document.getElementById('modal-header-icon');
    ui.modalClear = document.getElementById('modal-clear-text');
    ui.modalInsert = document.getElementById('action-modal-insert');
    ui.modalCopy = document.getElementById('action-modal-copy');

    ui.badgeControls = document.getElementById('badge-controls');
    ui.badgeLabel = document.getElementById('input-badge-label');
    ui.badgeValue = document.getElementById('input-badge-value');
    ui.badgeColor = document.getElementById('input-badge-color');
    ui.badgeStyle = document.getElementById('input-badge-style');

    ui.dragHandle = document.getElementById('drag-handle');
    ui.editorPane = document.getElementById('editor-pane');
    ui.previewPane = document.getElementById('preview-pane');

    ui.toast = document.getElementById('toast-ui');
    ui.toastMsg = document.getElementById('toast-ui-msg');
    ui.toastIcon = document.getElementById('toast-ui-icon');
}

function renderSidebar() {
    ui.sectionsList.innerHTML = '';
    SECTIONS.forEach(cat => {
        const group = document.createElement('div');
        group.innerHTML = `
            <div class="flex items-center gap-2 mb-3 px-1">
                <i data-lucide="${cat.icon}" class="w-3.5 h-3.5 text-github-accent/70"></i>
                <span class="text-[11px] font-bold text-github-muted uppercase tracking-widest">${cat.name}</span>
            </div>
            <div class="space-y-1"></div>
        `;
        const container = group.querySelector('.space-y-1');
        cat.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-3 py-2 rounded-lg text-sm text-github-muted hover:bg-github-btn hover:text-github-text transition-all group flex items-center justify-between border border-transparent hover:border-github-border/40';
            btn.innerHTML = `
                <span class="truncate font-medium">${item.name}</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
            `;
            btn.onclick = () => openModalWindow(item, cat);
            container.appendChild(btn);
        });
        ui.sectionsList.appendChild(group);
    });
    if (window.lucide) window.lucide.createIcons();
}

function updatePreview() {
    const raw = ui.editor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(raw));
        ui.preview.innerHTML = html;
        if (window.hljs) ui.preview.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    } catch (e) { console.error(e); }
    ui.charCount.textContent = `${raw.length} CHARS`;
    localStorage.setItem('readme_pro_v2_data', raw);
}

function openModalWindow(item, cat) {
    currentSelection = { ...item, isBadge: cat.isBadgeStudio };
    ui.modalTitle.textContent = item.name;
    ui.modalIcon.setAttribute('data-lucide', cat.icon);

    if (cat.isBadgeStudio) {
        ui.badgeControls.classList.remove('hidden');
        ui.modalDesc.textContent = 'Badge Studio: Adjust parameters to generate a shield';
        syncBadgeLogic();
    } else {
        ui.badgeControls.classList.add('hidden');
        ui.modalDesc.textContent = 'Customizer: Edit this section before adding it';
        ui.modalEditor.value = item.template;
    }

    refreshModalPreview();
    ui.modal.classList.remove('hidden');
    ui.modal.classList.add('flex');
    setTimeout(() => {
        ui.modal.style.opacity = '1';
        ui.modalWindow.style.transform = 'scale(1)';
    }, 10);
    if (window.lucide) window.lucide.createIcons();
}

function closeModalWindow() {
    ui.modal.style.opacity = '0';
    ui.modalWindow.style.transform = 'scale(0.95)';
    setTimeout(() => {
        ui.modal.classList.add('hidden');
        ui.modal.classList.remove('flex');
    }, 300);
}

function syncBadgeLogic() {
    const l = encodeURIComponent(ui.badgeLabel.value || 'Label');
    const v = encodeURIComponent(ui.badgeValue.value || 'Value');
    const c = ui.badgeColor.value.replace('#', '');
    const s = ui.badgeStyle.value;
    ui.modalEditor.value = `![Badge](https://img.shields.io/badge/${l}-${v}-${c}?style=${s})`;
    refreshModalPreview();
}

function refreshModalPreview() {
    const raw = ui.modalEditor.value;
    try {
        const html = DOMPurify.sanitize(marked.parse(raw));
        ui.modalPreview.innerHTML = html;
        if (window.hljs) ui.modalPreview.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    } catch (e) { }
}

function insertMarkdown() {
    const content = ui.modalEditor.value;
    const start = ui.editor.selectionStart || 0;
    const end = ui.editor.selectionEnd || 0;
    const currentText = ui.editor.value;

    const prefix = currentText.length > 0 && currentText[Math.max(0, start - 1)] !== '\n' ? '\n\n' : '';
    ui.editor.value = currentText.substring(0, start) + prefix + content + '\n' + currentText.substring(end);

    closeModalWindow();
    updatePreview();
    showToastNotification('Section added to README');

    const newPos = start + prefix.length + content.length + 1;
    ui.editor.setSelectionRange(newPos, newPos);
    ui.editor.focus();
}

function showToastNotification(msg) {
    ui.toastMsg.textContent = msg;
    ui.toast.classList.remove('translate-y-32', 'opacity-0');
    ui.toast.classList.add('translate-y-0', 'opacity-100');
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        ui.toast.classList.remove('translate-y-0', 'opacity-100');
        ui.toast.classList.add('translate-y-32', 'opacity-0');
    }, 2500);
}

// 4. Initialization & Listeners
function setupEvents() {
    ui.editor.oninput = updatePreview;
    ui.copyBtn.onclick = () => {
        navigator.clipboard.writeText(ui.editor.value);
        showToastNotification('Copied to clipboard!');
    };
    ui.downloadBtn.onclick = () => {
        const b = new Blob([ui.editor.value], { type: 'text/markdown' });
        const u = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = u; a.download = 'README.md'; a.click();
        showToastNotification('README.md saved!');
    };
    ui.clearBtn.onclick = () => {
        if (confirm('Are you sure you want to reset your work?')) {
            ui.editor.value = '';
            updatePreview();
            showToastNotification('Workspace reset');
        }
    };

    // Modal Events
    ui.modalClose.onclick = closeModalWindow;
    ui.modalOverlay = ui.modal; // Aliasing for clarity
    ui.modalOverlay.onclick = (e) => { if (e.target === ui.modal) closeModalWindow(); };
    ui.modalEditor.oninput = refreshModalPreview;
    ui.modalClear.onclick = () => { ui.modalEditor.value = ''; refreshModalPreview(); };
    ui.modalInsert.onclick = insertMarkdown;
    ui.modalCopy.onclick = () => {
        navigator.clipboard.writeText(ui.modalEditor.value);
        showToastNotification('Section copied');
    };

    // Badge Params
    [ui.badgeLabel, ui.badgeValue, ui.badgeColor, ui.badgeStyle].forEach(el => {
        el.oninput = syncBadgeLogic;
    });

    // Resizer Logic
    let isResizing = false;
    ui.dragHandle.onmousedown = () => { isResizing = true; document.body.style.cursor = 'col-resize'; };
    document.onmousemove = (e) => {
        if (!isResizing) return;
        const sidebarW = ui.sidebar.getBoundingClientRect().width;
        const availableW = window.innerWidth - sidebarW;
        const relativeX = e.clientX - sidebarW;
        let p = (relativeX / availableW) * 100;
        p = Math.max(10, Math.min(90, p));
        ui.editorPane.style.flexBasis = `${p}%`;
        ui.previewPane.style.flexBasis = `${100 - p}%`;
    };
    document.onmouseup = () => { isResizing = false; document.body.style.cursor = 'default'; };

    window.onkeydown = (e) => { if (e.key === 'Escape') closeModalWindow(); };
}

// 5. App Start
window.onload = () => {
    populateUI();
    renderSidebar();

    const saved = localStorage.getItem('readme_pro_v2_data');
    if (saved) ui.editor.value = saved;
    else ui.editor.value = '# 👋 Welcome to your README\n\nChoose components from the left to build your professional documentation.';

    updatePreview();
    setupEvents();
    if (window.lucide) window.lucide.createIcons();
};
