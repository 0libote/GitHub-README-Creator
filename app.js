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
    sections: [],
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

    App.sections.forEach(category => {
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
 * Load sections from JSON
 */
async function loadSections() {
    try {
        App.ui.sectionsList.innerHTML = '<div class="p-4 text-xs text-github-muted">Loading components...</div>';
        const response = await fetch('sections.json');
        App.sections = await response.json();
        renderSidebar();
    } catch (err) {
        console.error('Failed to load sections:', err);
        App.ui.sectionsList.innerHTML = '<div class="p-4 text-xs text-github-danger">Error loading components</div>';
    }
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
    const labelColor = App.ui.badgeLabelColor.value.replace('#', '');
    const logo = encodeURIComponent(App.ui.badgeLogo.value || '');
    const logoColor = encodeURIComponent(App.ui.badgeLogoColor.value || '');
    const style = App.ui.badgeStyle.value;

    let template = App.currentSection.template;

    // Auto-inject variables first
    template = Utils.injectVariables(template, App.vars);

    // Then inject badge metadata
    template = template.replace(/\[LABEL\]/g, label);
    template = template.replace(/\[VALUE\]/g, value);
    template = template.replace(/\[COLOR\]/g, color);
    template = template.replace(/\[STYLE\]/g, style);
    template = template.replace(/\[LOGO\]/g, logo);
    template = template.replace(/\[LOGO_COLOR\]/g, logoColor);
    template = template.replace(/\[LABEL_COLOR\]/g, labelColor);

    App.ui.modalEditor.value = template;
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
 * Initialize the formatting toolbar
 */
function initFormattingToolbar() {
    const editor = App.ui.editor;
    const toolbar = document.getElementById('format-toolbar');

    editor.addEventListener('select', () => handleSelection());
    editor.addEventListener('mouseup', () => {
        setTimeout(handleSelection, 10);
    });

    function handleSelection() {
        const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selection.trim().length > 0) {
            const rect = getCursorXY(editor, editor.selectionEnd);
            const editorRect = editor.getBoundingClientRect();

            toolbar.style.left = `${editorRect.left + rect.x - 40}px`;
            toolbar.style.top = `${editorRect.top + rect.y - 45}px`;
            toolbar.classList.remove('hidden');
            requestAnimationFrame(() => {
                toolbar.style.opacity = '1';
                toolbar.style.transform = 'translateY(0)';
            });
        } else {
            toolbar.style.opacity = '0';
            toolbar.style.transform = 'translateY(5px)';
            setTimeout(() => {
                if (editor.selectionStart === editor.selectionEnd) {
                    toolbar.classList.add('hidden');
                }
            }, 200);
        }
    }

    toolbar.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const format = btn.getAttribute('data-format');
            applyFormat(format);
        });
    });

    function applyFormat(type) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        const selectedText = text.substring(start, end);
        let replacement = '';

        switch (type) {
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
            case 'inline-code':
                replacement = `\`${selectedText}\``;
                break;
            case 'link':
                replacement = `[${selectedText}](url)`;
                break;
        }

        editor.value = text.substring(0, start) + replacement + text.substring(end);
        editor.focus();
        editor.setSelectionRange(start, start + replacement.length);
        updatePreview();
    }

    // Helper to get cursor coordinates
    function getCursorXY(input, selectionPoint) {
        const { offsetLeft: elLeft, offsetTop: elTop } = input;
        const style = window.getComputedStyle(input);
        const div = document.createElement('div');
        const copyStyle = Array.from(style);
        copyStyle.forEach((prop) => {
            div.style[prop] = style[prop];
        });
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.style.width = input.clientWidth + 'px';
        div.innerHTML = input.value.substring(0, selectionPoint).replace(/\n/g, '<br/>') + '<span>|</span>';
        document.body.appendChild(div);
        const span = div.querySelector('span');
        const { offsetLeft: spanLeft, offsetTop: spanTop } = span;
        document.body.removeChild(div);
        return {
            x: spanLeft,
            y: spanTop - input.scrollTop
        };
    }
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
        badgeLabelColor: document.getElementById('input-badge-label-color'),
        badgeLogo: document.getElementById('input-badge-logo'),
        badgeLogoColor: document.getElementById('input-badge-logo-color'),
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
    [
        App.ui.badgeLabel,
        App.ui.badgeValue,
        App.ui.badgeColor,
        App.ui.badgeLabelColor,
        App.ui.badgeLogo,
        App.ui.badgeLogoColor,
        App.ui.badgeStyle
    ].forEach(el => {
        if (el) el.addEventListener('input', syncBadge);
    });

    // Initialize formatting toolbar
    initFormattingToolbar();

    // Initialize resizer
    initResizer();

    // Load sections from JSON
    loadSections();

    // Initialize icons
    Utils.initIcons();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
