/**
 * Console Debug Logger for Alex Rodriguez Videographer
 * Comprehensive logging without visual panel
 */

class ConsoleDebugger {
    constructor() {
        this.init();
    }

    init() {
        this.logHeader();
        this.logSystemInfo();
        this.monitorPWA();
        this.monitorFeatures();
        this.setupPeriodicChecks();
    }

    logHeader() {
        console.log('%c🔧 ALEX RODRIGUEZ VIDEOGRAPHER - DEBUG MODE', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%c' + '='.repeat(60), 'color: #00ff00;');
    }

    logSystemInfo() {
        console.group('📊 SYSTEM INFO');
        console.log('🌐 URL:', window.location.href);
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('💻 Platform:', navigator.platform);
        console.log('📺 Screen:', `${screen.width}x${screen.height}`);
        console.log('🖼️ Viewport:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('🔒 Protocol:', location.protocol);
        console.log('🏠 Host:', location.host);
        console.log('🌍 Online:', navigator.onLine);
        
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            console.log('📶 Connection:', connection.effectiveType);
        }
        
        console.groupEnd();
    }

    monitorPWA() {
        console.group('🚀 PWA MONITORING');
        
        // Check PWA support
        console.log('🔧 Service Worker Support:', 'serviceWorker' in navigator);
        console.log('📋 Manifest Support:', 'manifest' in document.createElement('link'));
        console.log('🔒 HTTPS/Localhost:', location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname));
        
        // Check manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        console.log('📋 Manifest Link Found:', !!manifestLink);
        if (manifestLink) {
            console.log('📋 Manifest URL:', manifestLink.href);
            this.validateManifest(manifestLink.href);
        }
        
        // Monitor beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('%c🎯 BEFOREINSTALLPROMPT FIRED!', 'color: #00ff00; font-size: 14px; font-weight: bold;');
            console.log('📱 Platforms:', e.platforms);
            console.log('💾 Event stored for later use');
        });

        // Monitor app installed
        window.addEventListener('appinstalled', () => {
            console.log('%c✅ APP INSTALLED SUCCESSFULLY!', 'color: #00ff00; font-size: 14px; font-weight: bold;');
        });

        // Check if already installed
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone ||
                           document.referrer.includes('android-app://');
        
        console.log('📱 Already Installed:', isInstalled);
        console.log('🖥️ Standalone Mode:', window.matchMedia('(display-mode: standalone)').matches);
        
        // Browser detection
        const browser = this.detectBrowser();
        console.log('🌐 Browser:', browser);
        console.log('✅ PWA Compatible Browser:', ['Chrome', 'Edge', 'Firefox', 'Safari'].includes(browser));
        
        console.groupEnd();
        
        // Diagnose install issues after delay
        setTimeout(() => {
            this.diagnoseInstallIssues();
        }, 3000);
    }

    validateManifest(manifestUrl) {
        fetch(manifestUrl)
            .then(response => {
                console.log('📋 Manifest Response Status:', response.status);
                return response.json();
            })
            .then(manifest => {
                console.group('📋 MANIFEST VALIDATION');
                console.log('✅ Manifest loaded successfully');
                console.log('📝 Name:', manifest.name);
                console.log('🏠 Start URL:', manifest.start_url);
                console.log('🖥️ Display:', manifest.display);
                console.log('🎨 Theme Color:', manifest.theme_color);
                console.log('🖼️ Icons Count:', manifest.icons?.length || 0);
                
                // Validate required fields
                const required = ['name', 'start_url', 'display', 'icons'];
                const missing = required.filter(field => !manifest[field]);
                
                if (missing.length === 0) {
                    console.log('%c✅ Manifest is valid!', 'color: #00ff00; font-weight: bold;');
                } else {
                    console.log('%c❌ Missing required fields:', 'color: #ff4444; font-weight: bold;', missing);
                }
                
                console.groupEnd();
            })
            .catch(error => {
                console.error('❌ Manifest validation failed:', error);
            });
    }

    diagnoseInstallIssues() {
        console.group('🔍 PWA INSTALL DIAGNOSIS');
        
        const issues = [];
        const warnings = [];
        
        // Protocol check
        if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
            issues.push('Not served over HTTPS');
        }
        
        // File protocol check
        if (location.protocol === 'file:') {
            issues.push('File protocol detected - PWA requires HTTP server');
        }
        
        // Manifest check
        if (!document.querySelector('link[rel="manifest"]')) {
            issues.push('No manifest link found');
        }
        
        // Service Worker check
        if (!('serviceWorker' in navigator)) {
            issues.push('Service Worker not supported');
        }
        
        // Browser check
        const browser = this.detectBrowser();
        if (!['Chrome', 'Edge', 'Firefox'].includes(browser)) {
            warnings.push(`Browser ${browser} may have limited PWA support`);
        }
        
        // Already installed check
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (isInstalled) {
            warnings.push('App appears to already be installed');
        }
        
        // Display results
        if (issues.length === 0 && warnings.length === 0) {
            console.log('%c✅ No issues found - Install prompt should appear soon!', 'color: #00ff00; font-weight: bold;');
        } else {
            if (issues.length > 0) {
                console.log('%c❌ CRITICAL ISSUES:', 'color: #ff4444; font-weight: bold;');
                issues.forEach(issue => console.log('  ❌', issue));
            }
            
            if (warnings.length > 0) {
                console.log('%c⚠️ WARNINGS:', 'color: #ffaa00; font-weight: bold;');
                warnings.forEach(warning => console.log('  ⚠️', warning));
            }
        }
        
        // Provide solutions
        if (issues.includes('Not served over HTTPS')) {
            console.log('%c💡 SOLUTION: Use HTTPS or serve from localhost', 'color: #00aaff; font-weight: bold;');
        }
        
        if (issues.includes('File protocol detected - PWA requires HTTP server')) {
            console.log('%c💡 SOLUTION: Use "python -m http.server 8000" or similar', 'color: #00aaff; font-weight: bold;');
        }
        
        console.groupEnd();
    }

    monitorFeatures() {
        console.group('🎨 FEATURES STATUS');
        
        const features = {
            'Video Gallery': 'videoGallery',
            'Lazy Loading': 'lazyLoader',
            'PWA Manager': 'pwaManager',
            'Analytics Tracker': 'analyticsTracker',
            'i18n System': 'i18n',
            'Dark Mode Manager': 'darkModeManager',
            'CSS Loader': 'cssLoader',
            'Background Images': 'backgroundImageHandler'
        };
        
        Object.entries(features).forEach(([name, variable]) => {
            const exists = !!window[variable];
            console.log(`${exists ? '✅' : '❌'} ${name}:`, exists);
        });
        
        console.groupEnd();
    }

    setupPeriodicChecks() {
        // Check every 10 seconds for the first minute
        let checks = 0;
        const maxChecks = 6;
        
        const interval = setInterval(() => {
            checks++;
            
            if (window.pwaManager?.deferredPrompt) {
                console.log('%c🎯 INSTALL PROMPT NOW AVAILABLE!', 'color: #00ff00; font-size: 14px; font-weight: bold;');
                clearInterval(interval);
                return;
            }
            
            if (checks >= maxChecks) {
                console.log('%c⏰ Install prompt still not available after 1 minute', 'color: #ffaa00; font-weight: bold;');
                console.log('💡 This is normal for some browsers/conditions');
                clearInterval(interval);
            } else {
                console.log(`⏳ Waiting for install prompt... (${checks}/${maxChecks})`);
            }
        }, 10000);
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Edg/')) return 'Edge';
        if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
        if (ua.includes('Firefox/')) return 'Firefox';
        if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
        if (ua.includes('Opera/')) return 'Opera';
        
        return 'Unknown';
    }

    logPerformance() {
        console.group('⚡ PERFORMANCE STATUS');
        
        // Load time
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
            console.log('⏱️ Page Load Time:', loadTime + 'ms');
            console.log('🎯 LCP Target: <2500ms', loadTime < 2500 ? '✅' : '❌');
        }
        
        // Images
        const totalImages = document.querySelectorAll('img').length;
        const lazyImages = document.querySelectorAll('img[data-src]').length;
        const loadedImages = document.querySelectorAll('img.lazy-loaded').length;
        
        console.log('📸 Total Images:', totalImages);
        console.log('🔄 Lazy Images:', lazyImages);
        console.log('✅ Loaded Images:', loadedImages);
        
        // Features
        console.log('🚀 Lazy Loading Active:', !!window.lazyLoader);
        console.log('🎨 Critical CSS Loaded:', !!document.querySelector('link[href*="critical.css"]'));
        console.log('💾 Service Worker Caching:', !!window.pwaManager?.swRegistration);
        
        console.groupEnd();
    }

    logSEO() {
        console.group('🔍 SEO STATUS');
        
        console.log('📝 Title:', document.title);
        console.log('📄 Description:', document.querySelector('meta[name="description"]')?.content || 'Not found');
        console.log('🌐 Open Graph:', !!document.querySelector('meta[property^="og:"]'));
        console.log('📋 Schema.org:', !!document.querySelector('script[type="application/ld+json"]'));
        console.log('🔗 Canonical:', !!document.querySelector('link[rel="canonical"]'));
        
        console.groupEnd();
    }
}

// Initialize console debugger
document.addEventListener('DOMContentLoaded', () => {
    window.consoleDebugger = new ConsoleDebugger();
    
    // Log performance and SEO after everything loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.consoleDebugger.logPerformance();
            window.consoleDebugger.logSEO();
        }, 1000);
    });
});

// Quick access functions
window.debugPWA = () => {
    if (window.consoleDebugger) {
        window.consoleDebugger.diagnoseInstallIssues();
    }
};

window.debugStatus = () => {
    if (window.consoleDebugger) {
        window.consoleDebugger.logSystemInfo();
        window.consoleDebugger.monitorFeatures();
    }
};
