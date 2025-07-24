/**
 * Asynchronous CSS Loader for Performance Optimization
 * Loads non-critical CSS after critical content is rendered
 */

class CSSLoader {
    constructor() {
        this.loadedStyles = new Set();
        this.loadQueue = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        // Load non-critical CSS after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadNonCriticalCSS();
            });
        } else {
            this.loadNonCriticalCSS();
        }

        // Load additional CSS on user interaction
        this.setupInteractionLoading();
    }

    loadNonCriticalCSS() {
        // Define non-critical CSS files in order of priority
        const nonCriticalCSS = [
            {
                href: 'css/modern-gallery.css',
                priority: 'high',
                media: 'all'
            },
            {
                href: 'css/clean-layout.css', 
                priority: 'high',
                media: 'all'
            },
            {
                href: 'css/lazy-loading.css',
                priority: 'medium',
                media: 'all'
            },
            {
                href: 'css/dark-mode.css',
                priority: 'medium',
                media: 'all'
            },
            {
                href: 'css/i18n.css',
                priority: 'low',
                media: 'all'
            }
        ];

        // Load high priority CSS immediately
        const highPriority = nonCriticalCSS.filter(css => css.priority === 'high');
        highPriority.forEach(css => this.loadCSS(css.href, css.media));

        // Load medium priority CSS after a short delay
        setTimeout(() => {
            const mediumPriority = nonCriticalCSS.filter(css => css.priority === 'medium');
            mediumPriority.forEach(css => this.loadCSS(css.href, css.media));
        }, 100);

        // Load low priority CSS after page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                const lowPriority = nonCriticalCSS.filter(css => css.priority === 'low');
                lowPriority.forEach(css => this.loadCSS(css.href, css.media));
            }, 200);
        });
    }

    loadCSS(href, media = 'all') {
        // Check if already loaded
        if (this.loadedStyles.has(href)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Check if link already exists
            const existingLink = document.querySelector(`link[href="${href}"]`);
            if (existingLink) {
                this.loadedStyles.add(href);
                resolve();
                return;
            }

            // Create link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = media;
            
            // Add loading class to body
            document.body.classList.add('non-critical-loading');

            // Handle load event
            link.onload = () => {
                this.loadedStyles.add(href);
                document.body.classList.remove('non-critical-loading');
                document.body.classList.add('non-critical-loaded');
                
                // Trigger custom event
                document.dispatchEvent(new CustomEvent('cssLoaded', {
                    detail: { href, media }
                }));

                resolve();
            };

            // Handle error
            link.onerror = () => {
                console.warn(`Failed to load CSS: ${href}`);
                document.body.classList.remove('non-critical-loading');
                reject(new Error(`Failed to load CSS: ${href}`));
            };

            // Add to document head
            document.head.appendChild(link);
        });
    }

    // Load CSS on user interaction (for very low priority styles)
    setupInteractionLoading() {
        const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
        let hasInteracted = false;

        const handleInteraction = () => {
            if (hasInteracted) return;
            hasInteracted = true;

            // Remove event listeners
            interactionEvents.forEach(event => {
                document.removeEventListener(event, handleInteraction, { passive: true });
            });

            // Load interaction-triggered CSS
            this.loadInteractionCSS();
        };

        // Add event listeners
        interactionEvents.forEach(event => {
            document.addEventListener(event, handleInteraction, { passive: true });
        });

        // Fallback: load after 3 seconds if no interaction
        setTimeout(() => {
            if (!hasInteracted) {
                handleInteraction();
            }
        }, 3000);
    }

    loadInteractionCSS() {
        // CSS that's only needed after user interaction
        const interactionCSS = [
            // Add any CSS files that are only needed after interaction
            // For now, all our CSS is loaded earlier
        ];

        interactionCSS.forEach(css => {
            this.loadCSS(css.href, css.media);
        });
    }

    // Method to preload CSS for future pages
    preloadCSS(href) {
        if (this.loadedStyles.has(href)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
            // Convert preload to stylesheet
            link.rel = 'stylesheet';
            this.loadedStyles.add(href);
        };
        
        document.head.appendChild(link);
    }

    // Method to load CSS conditionally
    loadConditionalCSS(condition, href, media = 'all') {
        if (condition) {
            return this.loadCSS(href, media);
        }
        return Promise.resolve();
    }

    // Method to get loading status
    getLoadingStatus() {
        return {
            loaded: Array.from(this.loadedStyles),
            isLoading: this.isLoading,
            totalLoaded: this.loadedStyles.size
        };
    }
}

// Font loading optimization
class FontLoader {
    constructor() {
        this.init();
    }

    init() {
        // Preload critical fonts
        this.preloadFonts();
        
        // Load fonts with font-display: swap fallback
        this.setupFontDisplay();
    }

    preloadFonts() {
        const criticalFonts = [
            {
                family: 'Source Sans Pro',
                weight: '400',
                style: 'normal'
            },
            {
                family: 'Source Sans Pro', 
                weight: '600',
                style: 'normal'
            }
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = `https://fonts.gstatic.com/s/sourcesanspro/v21/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff2`;
            
            document.head.appendChild(link);
        });
    }

    setupFontDisplay() {
        // Add font-display: swap to Google Fonts
        const googleFontsLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (googleFontsLink) {
            const href = googleFontsLink.href;
            if (!href.includes('display=swap')) {
                googleFontsLink.href = href + '&display=swap';
            }
        }
    }
}

// Initialize loaders
document.addEventListener('DOMContentLoaded', () => {
    window.cssLoader = new CSSLoader();
    window.fontLoader = new FontLoader();
    
    console.log('CSS and Font loaders initialized');
});

// Export for external use
window.loadCSS = (href, media) => {
    if (window.cssLoader) {
        return window.cssLoader.loadCSS(href, media);
    }
    return Promise.reject('CSS Loader not initialized');
};

window.preloadCSS = (href) => {
    if (window.cssLoader) {
        window.cssLoader.preloadCSS(href);
    }
};
