/**
 * Internationalization (i18n) System for CinemaVault
 * Handles language switching and content translation
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.defaultLanguage = 'en';
        this.supportedLanguages = ['en', 'es'];
        
        // Initialize the system
        this.init();
    }

    async init() {
        // Get saved language from localStorage or detect browser language
        const savedLang = localStorage.getItem('cinemavault_language');
        const browserLang = navigator.language.split('-')[0];
        
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
        } else if (this.supportedLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
        }

        // Load translations
        await this.loadTranslations();
        
        // Apply translations to the page
        this.translatePage();
        
        // Update language selector
        this.updateLanguageSelector();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    async loadTranslations() {
        try {
            const response = await fetch(`lang/${this.currentLanguage}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${this.currentLanguage} translations`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to default language if current language fails
            if (this.currentLanguage !== this.defaultLanguage) {
                this.currentLanguage = this.defaultLanguage;
                await this.loadTranslations();
            }
        }
    }

    translate(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        
        return value || fallback || key;
    }

    translatePage() {
        // Update document title
        document.title = this.translate('site.title');
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', this.translate('site.description'));
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Translate all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate elements with data-i18n-html (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.translate(key);
            element.innerHTML = translation;
        });

        // Translate placeholders
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.translate(key);
            element.placeholder = translation;
        });

        // Translate alt attributes
        const altElements = document.querySelectorAll('[data-i18n-alt]');
        altElements.forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.translate(key);
            element.alt = translation;
        });

        // Translate title attributes
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.translate(key);
            element.title = translation;
        });
    }

    async changeLanguage(newLanguage) {
        if (!this.supportedLanguages.includes(newLanguage)) {
            console.error(`Language ${newLanguage} is not supported`);
            return;
        }

        this.currentLanguage = newLanguage;
        localStorage.setItem('cinemavault_language', newLanguage);
        
        await this.loadTranslations();
        this.translatePage();
        this.updateLanguageSelector();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage }
        }));
    }

    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
        }

        // Update language toggle buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Language selector dropdown
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Language toggle buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    // Helper method to format numbers according to locale
    formatNumber(number) {
        return new Intl.NumberFormat(this.currentLanguage).format(number);
    }

    // Helper method to format dates according to locale
    formatDate(date) {
        return new Intl.DateTimeFormat(this.currentLanguage).format(date);
    }
}

// Initialize i18n system when DOM is loaded
let i18n;

document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
});

// Export for use in other scripts
window.i18n = i18n;
