/**
 * Lazy Loading Implementation for Alex Rodriguez Videographer
 * Optimizes image loading for better performance
 */

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.config = {
            // Start loading when image is 50px away from viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        };
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }

        this.setupImageErrorHandling();
        this.processExistingImages();
    }

    setupIntersectionObserver() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, this.config);
    }

    processExistingImages() {
        // Process images that are already in the DOM
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.observeImage(img));

        // Process background images
        const bgImages = document.querySelectorAll('[data-bg-src]');
        bgImages.forEach(element => this.observeBackgroundImage(element));
    }

    observeImage(img) {
        if (this.imageObserver) {
            // Add loading placeholder
            img.classList.add('lazy-loading');
            this.imageObserver.observe(img);
        } else {
            // Fallback: load immediately
            this.loadImage(img);
        }
    }

    observeBackgroundImage(element) {
        if (this.imageObserver) {
            element.classList.add('lazy-loading');
            this.imageObserver.observe(element);
        } else {
            this.loadBackgroundImage(element);
        }
    }

    loadImage(img) {
        // Create a new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Image loaded successfully
            this.setImageSource(img, imageLoader.src);
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            // Trigger custom event
            img.dispatchEvent(new CustomEvent('lazyLoaded', {
                detail: { src: imageLoader.src }
            }));

            // Track performance if analytics available
            if (window.analyticsTracker && typeof window.analyticsTracker.trackImageLoad === 'function') {
                window.analyticsTracker.trackImageLoad(img.dataset.src);
            }
        };

        imageLoader.onerror = () => {
            // Handle error
            this.handleImageError(img);
        };

        // Support for WebP with fallback (ready for future)
        const src = this.getOptimalImageSource(img);
        imageLoader.src = src;
    }

    loadBackgroundImage(element) {
        const bgSrc = element.dataset.bgSrc;
        if (bgSrc) {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                element.style.backgroundImage = `url(${bgSrc})`;
                element.classList.remove('lazy-loading');
                element.classList.add('lazy-loaded');
            };

            imageLoader.onerror = () => {
                element.classList.add('lazy-error');
            };

            imageLoader.src = bgSrc;
        }
    }

    setImageSource(img, src) {
        // Set the actual source
        img.src = src;
        
        // Remove data-src to avoid reprocessing
        img.removeAttribute('data-src');
        
        // Set srcset if available
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }
    }

    getOptimalImageSource(img) {
        const dataSrc = img.dataset.src;
        
        // Future WebP support - ready for when images are converted
        if (this.supportsWebP() && img.dataset.webpSrc) {
            return img.dataset.webpSrc;
        }
        
        // Return original source for now
        return dataSrc;
    }

    supportsWebP() {
        // Check WebP support (ready for future)
        if (this.webpSupport === undefined) {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            this.webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return this.webpSupport;
    }

    handleImageError(img) {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
        
        // Set fallback image or hide
        const fallback = img.dataset.fallback;
        if (fallback) {
            img.src = fallback;
        } else {
            img.style.display = 'none';
        }

        console.warn('Failed to load image:', img.dataset.src);
    }

    setupImageErrorHandling() {
        // Global error handler for images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.classList.contains('lazy-loading')) {
                this.handleImageError(e.target);
            }
        }, true);
    }

    // Method to manually add new images (for dynamic content)
    addImage(img) {
        if (img.dataset.src) {
            this.observeImage(img);
        }
    }

    // Method to add background image
    addBackgroundImage(element) {
        if (element.dataset.bgSrc) {
            this.observeBackgroundImage(element);
        }
    }

    // Fallback for browsers without Intersection Observer
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));

        const bgImages = document.querySelectorAll('[data-bg-src]');
        bgImages.forEach(element => this.loadBackgroundImage(element));
    }

    // Method to preload critical images
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        criticalImages.forEach(img => {
            if (img.dataset.src) {
                this.loadImage(img);
            }
        });
    }

    // Destroy observer (cleanup)
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// Utility function to convert existing images to lazy loading
function convertToLazyLoading() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
        // Skip if already processed or is critical
        if (img.dataset.src || img.dataset.critical === 'true') {
            return;
        }

        // Move src to data-src
        if (img.src && img.src !== window.location.href) {
            img.dataset.src = img.src;
            
            // Set placeholder or low-quality image
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4=';
            
            // Add lazy loading class
            img.classList.add('lazy-image');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Convert existing images to lazy loading
    convertToLazyLoading();
    
    // Initialize lazy loader
    window.lazyLoader = new LazyLoader();
    
    // Preload critical images immediately
    window.lazyLoader.preloadCriticalImages();
    
    console.log('Lazy Loading initialized');
});

// Export for use in other scripts
window.addLazyImage = (img) => {
    if (window.lazyLoader) {
        window.lazyLoader.addImage(img);
    }
};

window.addLazyBackgroundImage = (element) => {
    if (window.lazyLoader) {
        window.lazyLoader.addBackgroundImage(element);
    }
};
