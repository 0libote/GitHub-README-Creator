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
    isResizing: false,
    collapsedSections: {}
};

/**
 * Update the main preview pane with rendered markdown
 */
function updatePreview() {
    const raw = App.ui.editor.value;
    const injected = Utils.injectVariables(raw, App.vars);
    const html = Utils.parseMarkdown(injected);
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
    Utils.storage.set('readme_draft_v6', raw);
}

/**
 * Render the sidebar with section categories
 */
/**
 * Render the sidebar with section categories
 */
function renderSidebar() {
    App.ui.sectionsList.innerHTML = '';

    App.sections.forEach((category, index) => {
        // Filter items based on search
        const filteredItems = category.items.filter(item => {
            if (!App.searchQuery) return true;
            return item.name.toLowerCase().includes(App.searchQuery) ||
                category.name.toLowerCase().includes(App.searchQuery);
        });

        if (filteredItems.length === 0) return;

        const group = document.createElement('div');
        // Default to collapsed (true) if not explicitly set to false
        // If searching, always expand
        let isCollapsed = App.collapsedSections[category.name];
        if (isCollapsed === undefined) isCollapsed = true; // Default closed
        if (App.searchQuery) isCollapsed = false; // Always open when searching

        group.className = `section-group ${isCollapsed ? 'collapsed' : ''}`;

        group.innerHTML = `
            <div class="section-header" data-category="${category.name}">
                <i data-lucide="${category.icon}" class="section-icon"></i>
                <span class="section-title">${category.name}</span>
                <i data-lucide="chevron-down" class="section-chevron"></i>
            </div>
            <div class="section-items" style="max-height: 1500px;"></div>
        `;

        const itemsContainer = group.querySelector('.section-items');
        const header = group.querySelector('.section-header');

        header.addEventListener('click', () => {
            const nowCollapsed = !group.classList.contains('collapsed');

            group.classList.toggle('collapsed');
            App.collapsedSections[category.name] = nowCollapsed;

            // Persist setting
            Utils.storage.set('collapsed_sections', JSON.stringify(App.collapsedSections));
        });

        filteredItems.forEach(item => {
            const button = document.createElement('button');
            button.className = 'section-btn';
            button.textContent = item.name;
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(item, category);
            });
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

        // Fetch manifest first with cache busting
        const manifestRes = await fetch(`sections/manifest.json?t=${Date.now()}`);
        const manifest = await manifestRes.json();

        // Fetch all categories in parallel with cache busting
        const categoryPromises = manifest.categories.map(file =>
            fetch(`sections/${file}?t=${Date.now()}`).then(res => res.json())
        );

        App.sections = await Promise.all(categoryPromises);
        renderSidebar();
    } catch (err) {
        console.error('Failed to load sections:', err);
        App.ui.sectionsList.innerHTML = '<div class="p-4 text-xs text-github-danger">Error loading components</div>';
    }
}

/**
 * Open the modal with a section template
 */
/**
 * Field Definitions for Badge Studio & Components
 */
const FIELD_DEFINITIONS = {
    // Styles
    style: {
        type: 'select',
        label: 'Style',
        options: [
            { value: 'for-the-badge', label: 'For the Badge' },
            { value: 'flat', label: 'Flat' },
            { value: 'flat-square', label: 'Flat Square' },
            { value: 'plastic', label: 'Plastic' },
            { value: 'social', label: 'Social' }
        ]
    },
    // Colors
    color: { type: 'color', label: 'Color', default: '#238636' },
    labelColor: { type: 'color', label: 'Label Color', default: '#333333' },
    logoColor: { type: 'text', label: 'Logo Color (Name/Hex)', placeholder: 'white' },

    // Text
    label: { type: 'text', label: 'Label', placeholder: 'Build' },
    value: { type: 'text', label: 'Value', placeholder: 'Passing' },
    logo: { type: 'text', label: 'Logo (Simple Icons)', placeholder: 'github' },

    // Global/Standard
    title: { type: 'text', label: 'Project Title' },
    user: { type: 'text', label: 'GitHub Username' },
    repo: { type: 'text', label: 'Repository Name' },

    // Specific
    icons: { type: 'text', label: 'Icons List (comma separated)', placeholder: 'react,ts,nodejs...' },
    problem_description: { type: 'textarea', label: 'Problem Description', placeholder: 'Describe the problem your project solves...' },

    // Fallback
    default: { type: 'text' }
};

/**
 * Open the modal with a section template
 */
function openModal(item, category) {
    App.currentSection = { ...item };
    App.ui.modalTitle.textContent = item.name;
    App.ui.modalIcon.setAttribute('data-lucide', category.icon);

    // Initialize Dynamic Inputs
    initDynamicInputs(item);

    // Initial Sync
    syncFromInputs();

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
/**
 * Initialize dynamic field inputs based on configuration or template
 */
function initDynamicInputs(item) {
    const container = document.getElementById('dynamic-inputs');
    container.innerHTML = '';

    // Determine fields: use explicit config if available, otherwise detect from template
    let fields = [];

    if (item.fields && Array.isArray(item.fields)) {
        fields = item.fields;
    } else {
        // Fallback: Regex detection
        const regex = /\[([A-Z0-9_]+)\]/g;
        const found = new Set();
        let match;
        while ((match = regex.exec(item.template)) !== null) {
            found.add(match[1]); // e.g., TITLE, USER
        }
        fields = Array.from(found);
    }

    if (fields.length === 0) {
        container.innerHTML = '<div class="text-xs text-github-muted p-2">No customizable fields. Edit markdown directly.</div>';
        App.ui.modalEditor.value = item.template;
        return;
    }

    fields.forEach(fieldKey => {
        // Handle case-insensitivity: config uses 'label', regex finds 'LABEL'
        const key = fieldKey.toLowerCase();
        const varName = fieldKey.toUpperCase(); // We'll map back to [VAR]

        const def = FIELD_DEFINITIONS[key] || { ...FIELD_DEFINITIONS.default, label: varName.replace(/_/g, ' ') };

        const wrapper = document.createElement('div');
        wrapper.className = 'dynamic-field-group';

        const label = document.createElement('label');
        label.className = 'dynamic-field-label';
        label.textContent = def.label;

        let input;

        if (def.type === 'select') {
            input = document.createElement('select');
            input.className = 'dynamic-field-input cursor-pointer';
            def.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                input.appendChild(option);
            });
        } else if (def.type === 'color') {
            // Color input requires flexible wrapper or specific styling
            wrapper.classList.add('flex', 'items-center', 'justify-between');
            label.classList.add('mb-0');

            input = document.createElement('input');
            input.type = 'color';
            input.className = 'w-16 h-8 bg-github-canvas border border-github-border rounded cursor-pointer p-0.5';
            input.value = def.default || '#000000';
        } else if (def.type === 'textarea') {
            input = document.createElement('textarea');
            input.className = 'dynamic-field-input min-h-[80px] resize-y custom-scrollbar';
            if (def.placeholder) input.placeholder = def.placeholder;
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'dynamic-field-input';
            if (def.placeholder) input.placeholder = def.placeholder;
        }

        // Set attributes
        input.setAttribute('data-target-var', varName);
        input.setAttribute('data-field-type', def.type);

        // Pre-fill logic (Globals overrides defaults)
        if (varName === 'USER' && App.vars.user) input.value = App.vars.user;
        if (varName === 'REPO' && App.vars.repo) input.value = App.vars.repo;
        if (varName === 'TITLE' && App.vars.title) input.value = App.vars.title;

        // Listener
        input.addEventListener('input', () => syncFromInputs());

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });
}

/**
 * Sync from dynamic inputs to editor and preview
 */
function syncFromInputs() {
    let template = App.currentSection.template;
    const inputs = document.querySelectorAll('#dynamic-inputs input, #dynamic-inputs select, #dynamic-inputs textarea');

    // First, auto-inject globals (base layer)
    template = Utils.injectVariables(template, App.vars);

    inputs.forEach(input => {
        const varName = input.getAttribute('data-target-var');
        let value = input.value;
        const type = input.getAttribute('data-field-type');

        // Logic for specific types
        if (type === 'color') {
            value = value.replace('#', ''); // Badges use hex without hash
        } else if (type === 'text' || type === 'select' || type === 'textarea') {
            // Encode if it seems dangerous, but textarea usually needs raw newlines preserved?
            // Actually, for badges we encode. For markdown body text (textarea), we probably SHOULD NOT encodeURIComponent 
            // because users want markdown.
            // But wait, if they type "foo & bar", it should be "foo & bar" in MD.

            // Refinement: Only encode if it's strictly a badge-like field or single line?
            // "problem_description" -> [PROBLEM_DESCRIPTION] -> likely markdown block.
            // "style" -> [STYLE] -> badge param -> needs encoding? (usually no special chars)

            // Decision: Don't encode textarea content so markdown works.
            // Do encode single-line text if it seems capable of breaking things? 
            // The previous logic encoded everything.
            // Let's refine: Textarea = no encode. Text/Select = encode (safer for badges).

            if (type !== 'textarea') {
                value = encodeURIComponent(value);
            }
        }

        // Replace all instances
        const regex = new RegExp(`\\[${varName}\\]`, 'gi');
        template = template.replace(regex, value);
    });

    App.ui.modalEditor.value = template;
    syncModalPreview();
}
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
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selection = editor.value.substring(start, end);

        if (selection.trim().length > 0) {
            const startPos = getCursorXY(editor, start);
            const endPos = getCursorXY(editor, end);
            const editorRect = editor.getBoundingClientRect();

            // Calculate center point
            // If on same line, use midpoint of X. If multiple lines, use start X + small offset or just start X.
            let centerX = startPos.x;
            if (startPos.y === endPos.y) {
                centerX = (startPos.x + endPos.x) / 2;
            } else {
                // For multi-line, centering is tricky, so we'll center relative to the first line's start
                centerX = startPos.x + 10;
            }

            toolbar.style.left = `${editorRect.left + centerX}px`;
            toolbar.style.top = `${editorRect.top + startPos.y - 45}px`;

            toolbar.classList.remove('hidden');
            requestAnimationFrame(() => {
                toolbar.classList.add('visible');
            });
        } else {
            toolbar.classList.remove('visible');
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

        // Badge controls - Legacy container (hidden but kept to avoid null refs if any exist, though we don't use them anymore)
        badgeControls: document.getElementById('badge-controls'),

        // Search
        searchInput: document.getElementById('component-search'),

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

    // Load collapsed states
    try {
        const savedCollapsed = Utils.storage.get('collapsed_sections');
        if (savedCollapsed) App.collapsedSections = JSON.parse(savedCollapsed);
    } catch (e) {
        console.error('Failed to load collapsed sections:', e);
    }

    // Load saved draft or default
    const draft = Utils.storage.get('readme_draft_v6');
    if (draft) {
        App.ui.editor.value = draft;
    } else {
        App.ui.editor.value = `# 🚀 Get Started

Quickly build your professional \`README.md\` by selecting components from the sidebar.

### ⚡ Quick Tips
- **Variables**: Fill in your GitHub username and repo name at the top to auto-fill templates.
- **Components**: Click any category on the left to browse and customize snippets.
- **Format**: Highlight text in this editor to see the formatting toolbar.
- **Live Preview**: Your changes are rendered instantly on the right.

---
## 📦 Current Project: [TITLE]
- **Maintainer**: @[USER]
- **Repo**: [REPO]
`;
    }

    updatePreview();

    // Variable inputs
    App.ui.varUser.addEventListener('input', (e) => {
        App.vars.user = e.target.value;
        updatePreview();
    });
    App.ui.varRepo.addEventListener('input', (e) => {
        App.vars.repo = e.target.value;
        updatePreview();
    });
    App.ui.varTitle.addEventListener('input', (e) => {
        App.vars.title = e.target.value;
        updatePreview();
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
            Utils.storage.remove('readme_draft_v6');
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
