/**
 * Dark Mode Toggle System for MediaVault Pro
 * Handles theme switching and persistence
 */

class DarkModeToggle {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'mediavault_theme';
        this.toggleButton = null;
        
        this.init();
    }

    init() {
        // Get saved theme or detect system preference
        this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
        
        // Apply the theme
        this.applyTheme(this.currentTheme);
        
        // Create toggle button
        this.createToggleButton();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
    }

    getSavedTheme() {
        return localStorage.getItem(this.storageKey);
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Update toggle button icon
        this.updateToggleButton();
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    createToggleButton() {
        // Find existing buttons in HTML (desktop and mobile)
        const desktopButton = document.getElementById('theme-toggle');
        const mobileButton = document.getElementById('theme-toggle-mobile');

        // Add event listeners to existing buttons
        if (desktopButton) {
            desktopButton.addEventListener('click', () => {
                this.toggleTheme();
            });
            this.toggleButton = desktopButton;
        }

        if (mobileButton) {
            mobileButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Update icons
        this.updateToggleButton();
    }

    updateToggleButton() {
        const desktopButton = document.getElementById('theme-toggle');
        const mobileButton = document.getElementById('theme-toggle-mobile');

        const isLight = this.currentTheme === 'light';
        const icon = isLight ? 'fa-moon' : 'fa-sun';
        const text = isLight ? 'Dark' : 'Light';
        const mobileText = isLight ? 'Dark Mode' : 'Light Mode';
        const title = isLight ? 'Switch to dark mode' : 'Switch to light mode';

        // Update desktop button
        if (desktopButton) {
            const iconElement = desktopButton.querySelector('i');
            const textElement = desktopButton.querySelector('span');

            if (iconElement) {
                iconElement.className = `fas ${icon}`;
            }
            if (textElement) {
                textElement.textContent = text;
            }

            desktopButton.setAttribute('title', title);
            desktopButton.setAttribute('aria-label', title);
        }

        // Update mobile button
        if (mobileButton) {
            const iconElement = mobileButton.querySelector('i');
            const textElement = mobileButton.querySelector('span');

            if (iconElement) {
                iconElement.className = `fas ${icon} mr-2`;
            }
            if (textElement) {
                textElement.textContent = mobileText;
            }

            mobileButton.setAttribute('title', title);
            mobileButton.setAttribute('aria-label', title);
        }
    }

    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem(this.storageKey)) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                }
            });
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }

    // Method to reset to system preference
    resetToSystemTheme() {
        localStorage.removeItem(this.storageKey);
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme);
    }
}

// Initialize dark mode system when DOM is loaded
let darkModeToggle;

document.addEventListener('DOMContentLoaded', () => {
    darkModeToggle = new DarkModeToggle();
});

// Export for use in other scripts
window.darkModeToggle = darkModeToggle;

// Additional utility functions
window.setTheme = (theme) => {
    if (window.darkModeToggle) {
        window.darkModeToggle.setTheme(theme);
    }
};

window.getCurrentTheme = () => {
    return window.darkModeToggle ? window.darkModeToggle.getCurrentTheme() : 'light';
};

// Listen for theme changes and update i18n if needed
window.addEventListener('themeChanged', (e) => {
    // Update any theme-specific translations if needed
    console.log('Theme changed to:', e.detail.theme);
    
    // You can add theme-specific logic here
    // For example, updating certain text based on theme
});

// Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + D)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (window.darkModeToggle) {
            window.darkModeToggle.toggleTheme();
        }
    }
});

// Add CSS class for theme transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to prevent flash of unstyled content
    setTimeout(() => {
        document.body.classList.add('theme-transitions-enabled');
    }, 100);
});

// Handle theme preference for print media
window.addEventListener('beforeprint', () => {
    // Temporarily switch to light mode for printing
    const currentTheme = window.getCurrentTheme();
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme-print-backup', 'dark');
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

window.addEventListener('afterprint', () => {
    // Restore original theme after printing
    const backupTheme = document.documentElement.getAttribute('data-theme-print-backup');
    if (backupTheme) {
        document.documentElement.setAttribute('data-theme', backupTheme);
        document.documentElement.removeAttribute('data-theme-print-backup');
    }
});
