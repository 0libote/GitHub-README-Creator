/**
 * GitHub README Creator - Utilities
 * Reusable helper functions
 */

const Utils = {
    /**
     * Replace template variables with user-defined values
     * @param {string} text - Template text with [USER], [REPO], [TITLE] placeholders
     * @param {Object} vars - Object containing user, repo, title values
     * @returns {string} - Text with variables replaced
     */
    injectVariables(text, vars) {
        return text
            .replace(/\[USER\]/g, vars.user || 'username')
            .replace(/\[REPO\]/g, vars.repo || 'repository')
            .replace(/\[TITLE\]/g, vars.title || 'Project Title')
            .replace(/\[PROJECT_TITLE\]/g, vars.title || 'Project Title');
    },

    /**
     * Copy text to clipboard with fallback
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (e) {
                console.error('Copy failed:', e);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    },

    /**
     * Download text as a file
     * @param {string} content - File content
     * @param {string} filename - Name of the file
     * @param {string} mimeType - MIME type of the file
     */
    downloadFile(content, filename = 'README.md', mimeType = 'text/markdown') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Debounce function to limit rapid calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait = 150) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Safely parse and sanitize markdown
     * @param {string} markdown - Raw markdown text
     * @returns {string} - Sanitized HTML
     */
    parseMarkdown(markdown) {
        try {
            const html = marked.parse(markdown);
            return DOMPurify.sanitize(html);
        } catch (e) {
            console.error('Markdown parse error:', e);
            return '';
        }
    },

    /**
     * Initialize Lucide icons safely
     */
    initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try {
                window.lucide.createIcons();
            } catch (e) {
                console.error('Icon initialization error:', e);
            }
        }
    },

    /**
     * Local storage helpers with error handling
     */
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? item : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        }
    }
};

// Export for use in app.js
window.Utils = Utils;
