/**
 * Background Image Handler for Alex Rodriguez Videographer
 * Manages background images with fallbacks and lazy loading
 */

class BackgroundImageHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackgroundImages();
        this.handleImageErrors();
    }

    setupBackgroundImages() {
        // Check and setup about page background
        const aboutHero = document.querySelector('.tm-fixed-header-2');
        if (aboutHero) {
            this.setupAboutBackground(aboutHero);
        }

        // Setup any other background images
        const bgElements = document.querySelectorAll('[data-bg-image]');
        bgElements.forEach(element => {
            this.setupBackgroundImage(element);
        });
    }

    setupAboutBackground(element) {
        const imagePath = 'img/about-1.jpg';
        
        // Check if image exists
        this.checkImageExists(imagePath)
            .then(exists => {
                if (exists) {
                    // Image exists, ensure it's set
                    this.setBackgroundImage(element, imagePath);
                } else {
                    // Image doesn't exist, use fallback
                    this.setFallbackBackground(element);
                }
            })
            .catch(() => {
                // Error checking image, use fallback
                this.setFallbackBackground(element);
            });
    }

    setupBackgroundImage(element) {
        const imagePath = element.dataset.bgImage;
        if (!imagePath) return;

        this.checkImageExists(imagePath)
            .then(exists => {
                if (exists) {
                    this.setBackgroundImage(element, imagePath);
                } else {
                    this.setFallbackBackground(element);
                }
            })
            .catch(() => {
                this.setFallbackBackground(element);
            });
    }

    checkImageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            
            // Set a timeout to avoid hanging
            setTimeout(() => resolve(false), 3000);
            
            img.src = imagePath;
        });
    }

    setBackgroundImage(element, imagePath) {
        // Get current background style
        const currentStyle = window.getComputedStyle(element);
        const currentBg = currentStyle.backgroundImage;
        
        // If it's already set correctly, don't change it
        if (currentBg.includes(imagePath)) {
            return;
        }

        // Set the background image
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const overlay = isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)';
        
        element.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url('${imagePath}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center center';
        element.style.backgroundRepeat = 'no-repeat';
        
        // Add loaded class
        element.classList.add('bg-image-loaded');
        
        // Track successful load
        if (window.analyticsTracker) {
            window.analyticsTracker.trackImageLoad(imagePath);
        }
    }

    setFallbackBackground(element) {
        // Create a gradient fallback
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode) {
            element.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)';
        } else {
            element.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        // Add fallback class
        element.classList.add('bg-image-fallback');
        
        console.warn('Background image not found, using fallback gradient');
    }

    handleImageErrors() {
        // Listen for theme changes to update overlays
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateBackgroundOverlays();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    updateBackgroundOverlays() {
        const bgElements = document.querySelectorAll('.tm-fixed-header-2, [data-bg-image]');
        
        bgElements.forEach(element => {
            if (element.classList.contains('bg-image-loaded')) {
                // Re-apply background with new overlay
                const bgImage = element.style.backgroundImage;
                const imageUrl = bgImage.match(/url\(['"]?([^'"]*?)['"]?\)/);
                
                if (imageUrl && imageUrl[1]) {
                    this.setBackgroundImage(element, imageUrl[1]);
                }
            } else if (element.classList.contains('bg-image-fallback')) {
                // Update fallback gradient
                this.setFallbackBackground(element);
            }
        });
    }

    // Method to manually set background image
    setCustomBackground(selector, imagePath) {
        const element = document.querySelector(selector);
        if (element) {
            this.setupBackgroundImage(element);
        }
    }

    // Method to preload background images
    preloadBackgroundImages() {
        const imagesToPreload = [
            'img/about-1.jpg',
            'img/hero-bg.jpg', // Add other background images here
        ];

        imagesToPreload.forEach(imagePath => {
            this.checkImageExists(imagePath).then(exists => {
                if (exists) {
                    // Preload the image
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = imagePath;
                    document.head.appendChild(link);
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.backgroundImageHandler = new BackgroundImageHandler();
    
    // Preload background images
    window.backgroundImageHandler.preloadBackgroundImages();
    
    console.log('Background Image Handler initialized');
});

// Export for external use
window.setCustomBackground = (selector, imagePath) => {
    if (window.backgroundImageHandler) {
        window.backgroundImageHandler.setCustomBackground(selector, imagePath);
    }
};
