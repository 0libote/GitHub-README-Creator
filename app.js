/**
 * GitHub README Creator - Core Application
 * Main application logic and initialization
 */

// Application State
const App = {
    vars: {
        user: '',
        repo: '',
        title: ''
    },
    ui: {},
    currentSection: null,
    isResizing: false
};

/**
 * Update the main preview pane with rendered markdown
 */
function updatePreview() {
    const raw = App.ui.editor.value;
    const html = Utils.parseMarkdown(raw);
    App.ui.preview.innerHTML = html;

    // Syntax highlighting for code blocks
    if (window.hljs) {
        App.ui.preview.querySelectorAll('pre code').forEach(el => {
            hljs.highlightElement(el);
        });
    }

    // Update character count
    App.ui.charCount.textContent = `${raw.length} chars`;

    // Save draft
    Utils.storage.set('readme_draft_v4', raw);
}

/**
 * Render the sidebar with section categories
 */
function renderSidebar() {
    App.ui.sectionsList.innerHTML = '';

    window.SECTIONS.forEach(category => {
        const group = document.createElement('div');
        group.className = 'section-group';

        group.innerHTML = `
            <div class="section-header">
                <i data-lucide="${category.icon}" class="section-icon"></i>
                <span class="section-title">${category.name}</span>
            </div>
            <div class="section-items"></div>
        `;

        const itemsContainer = group.querySelector('.section-items');

        category.items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'section-btn';
            button.textContent = item.name;
            button.addEventListener('click', () => openModal(item, category));
            itemsContainer.appendChild(button);
        });

        App.ui.sectionsList.appendChild(group);
    });

    Utils.initIcons();
}

/**
 * Open the modal with a section template
 */
function openModal(item, category) {
    App.currentSection = { ...item, isBadge: category.isBadgeStudio };

    App.ui.modalTitle.textContent = item.name;
    App.ui.modalIcon.setAttribute('data-lucide', category.icon);

    if (category.isBadgeStudio) {
        App.ui.badgeControls.classList.remove('hidden');
        syncBadge();
    } else {
        App.ui.badgeControls.classList.add('hidden');
        App.ui.modalEditor.value = Utils.injectVariables(item.template, App.vars);
    }

    syncModalPreview();

    // Show modal with animation
    App.ui.modal.classList.remove('hidden');
    App.ui.modal.classList.add('flex');

    requestAnimationFrame(() => {
        App.ui.modal.style.opacity = '1';
        App.ui.modalWindow.style.transform = 'scale(1)';
    });

    Utils.initIcons();
}

/**
 * Close the modal with animation
 */
function closeModal() {
    App.ui.modal.style.opacity = '0';
    App.ui.modalWindow.style.transform = 'scale(0.95)';

    setTimeout(() => {
        App.ui.modal.classList.add('hidden');
        App.ui.modal.classList.remove('flex');
    }, 200);
}

/**
 * Sync badge preview based on input controls
 */
function syncBadge() {
    const label = encodeURIComponent(App.ui.badgeLabel.value || 'Label');
    const value = encodeURIComponent(App.ui.badgeValue.value || 'Value');
    const color = App.ui.badgeColor.value.replace('#', '');
    const style = App.ui.badgeStyle.value;

    App.ui.modalEditor.value = `![Badge](https://img.shields.io/badge/${label}-${value}-${color}?style=${style})`;
    syncModalPreview();
}

/**
 * Update modal preview
 */
function syncModalPreview() {
    const html = Utils.parseMarkdown(App.ui.modalEditor.value);
    App.ui.modalPreview.innerHTML = html;

    if (window.hljs) {
        App.ui.modalPreview.querySelectorAll('pre code').forEach(el => {
            hljs.highlightElement(el);
        });
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    App.ui.toastMsg.textContent = message;
    App.ui.toast.classList.remove('translate-y-full', 'opacity-0');
    App.ui.toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        App.ui.toast.classList.remove('translate-y-0', 'opacity-100');
        App.ui.toast.classList.add('translate-y-full', 'opacity-0');
    }, 2500);
}

/**
 * Initialize resizable panels
 */
function initResizer() {
    App.ui.dragHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        App.isResizing = true;
        document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!App.isResizing) return;

        const sidebarWidth = App.ui.sidebar.getBoundingClientRect().width;
        const availableWidth = window.innerWidth - sidebarWidth;
        const relativeX = e.clientX - sidebarWidth;
        let percentage = (relativeX / availableWidth) * 100;
        percentage = Math.max(20, Math.min(80, percentage));

        App.ui.editorPane.style.flexBasis = `${percentage}%`;
        App.ui.previewPane.style.flexBasis = `${100 - percentage}%`;
    });

    document.addEventListener('mouseup', () => {
        if (App.isResizing) {
            App.isResizing = false;
            document.body.classList.remove('resizing');
        }
    });
}

/**
 * Initialize the application
 */
function init() {
    // Map UI elements
    App.ui = {
        // Main editor
        editor: document.getElementById('markdown-input'),
        preview: document.getElementById('markdown-preview'),
        sectionsList: document.getElementById('sections-list'),
        charCount: document.getElementById('char-count'),

        // Header actions
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        clearBtn: document.getElementById('clear-btn'),

        // Modal elements
        modal: document.getElementById('modal-overlay'),
        modalWindow: document.getElementById('modal-window'),
        modalTitle: document.getElementById('modal-title-text'),
        modalEditor: document.getElementById('input-modal-markdown'),
        modalPreview: document.getElementById('output-modal-preview'),
        modalClose: document.getElementById('modal-close-btn'),
        modalIcon: document.getElementById('modal-header-icon'),
        modalCopy: document.getElementById('action-modal-copy'),

        // Badge controls
        badgeControls: document.getElementById('badge-controls'),
        badgeLabel: document.getElementById('input-badge-label'),
        badgeValue: document.getElementById('input-badge-value'),
        badgeColor: document.getElementById('input-badge-color'),
        badgeStyle: document.getElementById('input-badge-style'),

        // Layout elements
        dragHandle: document.getElementById('drag-handle'),
        editorPane: document.getElementById('editor-pane'),
        previewPane: document.getElementById('preview-pane'),
        sidebar: document.getElementById('main-sidebar'),

        // Toast
        toast: document.getElementById('toast-ui'),
        toastMsg: document.getElementById('toast-ui-msg'),

        // Variables
        varUser: document.getElementById('var-user'),
        varRepo: document.getElementById('var-repo'),
        varTitle: document.getElementById('var-title')
    };

    // Load saved draft or default
    const draft = Utils.storage.get('readme_draft_v4');
    if (draft) {
        App.ui.editor.value = draft;
    } else {
        App.ui.editor.value = `# Project Title

> A brief description of what this project does and who it's for.

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

Add your usage instructions here.

## License

[MIT](LICENSE)
`;
    }

    updatePreview();

    // Variable inputs
    App.ui.varUser.addEventListener('input', (e) => {
        App.vars.user = e.target.value;
    });
    App.ui.varRepo.addEventListener('input', (e) => {
        App.vars.repo = e.target.value;
    });
    App.ui.varTitle.addEventListener('input', (e) => {
        App.vars.title = e.target.value;
    });

    // Editor input with debounce
    App.ui.editor.addEventListener('input', Utils.debounce(updatePreview, 100));

    // Header button actions
    App.ui.copyBtn.addEventListener('click', async () => {
        const success = await Utils.copyToClipboard(App.ui.editor.value);
        showToast(success ? 'Copied to clipboard' : 'Copy failed');
    });

    App.ui.downloadBtn.addEventListener('click', () => {
        Utils.downloadFile(App.ui.editor.value, 'README.md');
        showToast('README.md downloaded');
    });

    App.ui.clearBtn.addEventListener('click', () => {
        if (confirm('Clear the current draft? This cannot be undone.')) {
            App.ui.editor.value = '';
            Utils.storage.remove('readme_draft_v4');
            updatePreview();
            showToast('Draft cleared');
        }
    });

    // Modal event listeners
    App.ui.modalClose.addEventListener('click', closeModal);

    App.ui.modal.addEventListener('click', (e) => {
        if (e.target === App.ui.modal) {
            closeModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !App.ui.modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    App.ui.modalEditor.addEventListener('input', syncModalPreview);

    App.ui.modalCopy.addEventListener('click', async () => {
        const success = await Utils.copyToClipboard(App.ui.modalEditor.value);
        showToast(success ? 'Copied to clipboard' : 'Copy failed');
    });

    // Badge controls
    [App.ui.badgeLabel, App.ui.badgeValue, App.ui.badgeColor, App.ui.badgeStyle].forEach(el => {
        if (el) el.addEventListener('input', syncBadge);
    });

    // Initialize resizer
    initResizer();

    // Render sidebar sections
    renderSidebar();

    // Initialize icons
    Utils.initIcons();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
