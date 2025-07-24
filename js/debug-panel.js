/**
 * Debug Panel for Alex Rodriguez Videographer
 * Comprehensive debugging and status monitoring
 */

class DebugPanel {
    constructor() {
        this.isVisible = false;
        this.debugData = {};
        this.init();
    }

    init() {
        this.createDebugPanel();
        this.setupKeyboardShortcut();
        this.startMonitoring();
        this.logInitialState();
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: 80vh;
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                padding: 15px;
                border-radius: 8px;
                z-index: 10000;
                overflow-y: auto;
                display: none;
                backdrop-filter: blur(10px);
                border: 1px solid #333;
            ">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #00ff00; font-size: 14px;">🔧 DEBUG PANEL</h3>
                    <button onclick="window.debugPanel.toggle()" style="
                        background: #ff4444;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 10px;
                        margin-left: auto;
                    ">✕</button>
                </div>
                
                <div id="debug-content">
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">🚀 PWA STATUS</h4>
                        <div id="pwa-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">⚡ PERFORMANCE</h4>
                        <div id="performance-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">🔍 SEO</h4>
                        <div id="seo-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">📱 DEVICE INFO</h4>
                        <div id="device-info">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">🌐 NETWORK</h4>
                        <div id="network-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">📊 ANALYTICS</h4>
                        <div id="analytics-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">🎨 FEATURES</h4>
                        <div id="features-status">Loading...</div>
                    </div>
                    
                    <div class="debug-section">
                        <h4 style="color: #ffff00; margin: 10px 0 5px 0;">📝 CONSOLE LOG</h4>
                        <div id="console-log" style="max-height: 150px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; text-align: center;">
                        <button onclick="window.debugPanel.runTests()" style="
                            background: #00aa00;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            margin: 2px;
                        ">🧪 Run Tests</button>
                        
                        <button onclick="window.debugPanel.exportData()" style="
                            background: #0066cc;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            margin: 2px;
                        ">📤 Export</button>
                        
                        <button onclick="window.debugPanel.clearLogs()" style="
                            background: #cc6600;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            margin: 2px;
                        ">🗑️ Clear</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
    }

    setupKeyboardShortcut() {
        // Press Ctrl+Shift+D to toggle debug panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.panel.querySelector('div').style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.updateAllStatus();
        }
    }

    startMonitoring() {
        // Update every 5 seconds
        setInterval(() => {
            if (this.isVisible) {
                this.updateAllStatus();
            }
        }, 5000);

        // Monitor PWA events
        this.monitorPWAEvents();
    }

    logInitialState() {
        this.log('🚀 Debug Panel initialized');
        this.log(`📱 User Agent: ${navigator.userAgent}`);
        this.log(`🌐 URL: ${window.location.href}`);
        this.log(`📊 Screen: ${screen.width}x${screen.height}`);
    }

    updateAllStatus() {
        this.updatePWAStatus();
        this.updatePerformanceStatus();
        this.updateSEOStatus();
        this.updateDeviceInfo();
        this.updateNetworkStatus();
        this.updateAnalyticsStatus();
        this.updateFeaturesStatus();
    }

    updatePWAStatus() {
        const status = document.getElementById('pwa-status');
        if (!status) return;

        const pwaData = {
            serviceWorker: 'serviceWorker' in navigator,
            swRegistered: !!window.pwaManager?.swRegistration,
            swActive: !!window.pwaManager?.swRegistration?.active,
            manifestSupport: 'manifest' in document.createElement('link'),
            installPrompt: !!window.pwaManager?.deferredPrompt,
            isInstalled: window.pwaManager?.isInstalled || false,
            standalone: window.matchMedia('(display-mode: standalone)').matches,
            beforeInstallPrompt: this.debugData.beforeInstallPromptFired || false
        };

        status.innerHTML = `
            <div style="color: ${pwaData.serviceWorker ? '#00ff00' : '#ff4444'};">
                SW Support: ${pwaData.serviceWorker ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.swRegistered ? '#00ff00' : '#ff4444'};">
                SW Registered: ${pwaData.swRegistered ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.swActive ? '#00ff00' : '#ff4444'};">
                SW Active: ${pwaData.swActive ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.manifestSupport ? '#00ff00' : '#ff4444'};">
                Manifest Support: ${pwaData.manifestSupport ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.installPrompt ? '#00ff00' : '#ffaa00'};">
                Install Prompt: ${pwaData.installPrompt ? '✅ Available' : '⏳ Waiting'}
            </div>
            <div style="color: ${pwaData.isInstalled ? '#00ff00' : '#ffaa00'};">
                Is Installed: ${pwaData.isInstalled ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.standalone ? '#00ff00' : '#ffaa00'};">
                Standalone Mode: ${pwaData.standalone ? '✅' : '❌'}
            </div>
            <div style="color: ${pwaData.beforeInstallPrompt ? '#00ff00' : '#ff4444'};">
                beforeinstallprompt: ${pwaData.beforeInstallPrompt ? '✅ Fired' : '❌ Not fired'}
            </div>
        `;
    }

    updatePerformanceStatus() {
        const status = document.getElementById('performance-status');
        if (!status) return;

        const perfData = {
            lazyLoading: !!window.lazyLoader,
            criticalCSS: document.querySelector('link[href*="critical.css"]') !== null,
            serviceWorkerCache: !!window.pwaManager?.swRegistration,
            imagesLoaded: document.querySelectorAll('img.lazy-loaded').length,
            totalImages: document.querySelectorAll('img[data-src]').length
        };

        status.innerHTML = `
            <div style="color: ${perfData.lazyLoading ? '#00ff00' : '#ff4444'};">
                Lazy Loading: ${perfData.lazyLoading ? '✅' : '❌'}
            </div>
            <div style="color: ${perfData.criticalCSS ? '#00ff00' : '#ff4444'};">
                Critical CSS: ${perfData.criticalCSS ? '✅' : '❌'}
            </div>
            <div style="color: ${perfData.serviceWorkerCache ? '#00ff00' : '#ff4444'};">
                SW Caching: ${perfData.serviceWorkerCache ? '✅' : '❌'}
            </div>
            <div>Images: ${perfData.imagesLoaded}/${perfData.totalImages} loaded</div>
            <div>Load Time: ${this.getLoadTime()}ms</div>
        `;
    }

    updateSEOStatus() {
        const status = document.getElementById('seo-status');
        if (!status) return;

        const seoData = {
            title: document.title.length > 0,
            description: document.querySelector('meta[name="description"]') !== null,
            openGraph: document.querySelector('meta[property^="og:"]') !== null,
            schema: document.querySelector('script[type="application/ld+json"]') !== null,
            canonical: document.querySelector('link[rel="canonical"]') !== null,
            sitemap: true, // We created it
            robots: true   // We created it
        };

        status.innerHTML = `
            <div style="color: ${seoData.title ? '#00ff00' : '#ff4444'};">
                Title: ${seoData.title ? '✅' : '❌'}
            </div>
            <div style="color: ${seoData.description ? '#00ff00' : '#ff4444'};">
                Description: ${seoData.description ? '✅' : '❌'}
            </div>
            <div style="color: ${seoData.openGraph ? '#00ff00' : '#ff4444'};">
                Open Graph: ${seoData.openGraph ? '✅' : '❌'}
            </div>
            <div style="color: ${seoData.schema ? '#00ff00' : '#ff4444'};">
                Schema.org: ${seoData.schema ? '✅' : '❌'}
            </div>
            <div style="color: ${seoData.canonical ? '#00ff00' : '#ff4444'};">
                Canonical: ${seoData.canonical ? '✅' : '❌'}
            </div>
        `;
    }

    updateDeviceInfo() {
        const status = document.getElementById('device-info');
        if (!status) return;

        status.innerHTML = `
            <div>Platform: ${navigator.platform}</div>
            <div>Mobile: ${/Mobi|Android/i.test(navigator.userAgent) ? '✅' : '❌'}</div>
            <div>iOS: ${/iPad|iPhone|iPod/.test(navigator.userAgent) ? '✅' : '❌'}</div>
            <div>Chrome: ${/Chrome/.test(navigator.userAgent) ? '✅' : '❌'}</div>
            <div>HTTPS: ${location.protocol === 'https:' ? '✅' : '❌'}</div>
            <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
        `;
    }

    updateNetworkStatus() {
        const status = document.getElementById('network-status');
        if (!status) return;

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        status.innerHTML = `
            <div style="color: ${navigator.onLine ? '#00ff00' : '#ff4444'};">
                Online: ${navigator.onLine ? '✅' : '❌'}
            </div>
            <div>Connection: ${connection ? connection.effectiveType : 'Unknown'}</div>
            <div>Protocol: ${location.protocol}</div>
            <div>Host: ${location.host}</div>
        `;
    }

    updateAnalyticsStatus() {
        const status = document.getElementById('analytics-status');
        if (!status) return;

        const analyticsData = {
            gtag: typeof gtag !== 'undefined',
            tracker: !!window.analyticsTracker,
            i18n: !!window.i18n,
            darkMode: !!window.darkModeManager
        };

        status.innerHTML = `
            <div style="color: ${analyticsData.gtag ? '#00ff00' : '#ff4444'};">
                Google Analytics: ${analyticsData.gtag ? '✅' : '❌'}
            </div>
            <div style="color: ${analyticsData.tracker ? '#00ff00' : '#ff4444'};">
                Analytics Tracker: ${analyticsData.tracker ? '✅' : '❌'}
            </div>
            <div style="color: ${analyticsData.i18n ? '#00ff00' : '#ff4444'};">
                i18n System: ${analyticsData.i18n ? '✅' : '❌'}
            </div>
            <div style="color: ${analyticsData.darkMode ? '#00ff00' : '#ff4444'};">
                Dark Mode: ${analyticsData.darkMode ? '✅' : '❌'}
            </div>
        `;
    }

    updateFeaturesStatus() {
        const status = document.getElementById('features-status');
        if (!status) return;

        const featuresData = {
            gallery: !!window.videoGallery,
            lazyLoading: !!window.lazyLoader,
            cssLoader: !!window.cssLoader,
            backgroundImages: !!window.backgroundImageHandler
        };

        status.innerHTML = `
            <div style="color: ${featuresData.gallery ? '#00ff00' : '#ff4444'};">
                Video Gallery: ${featuresData.gallery ? '✅' : '❌'}
            </div>
            <div style="color: ${featuresData.lazyLoading ? '#00ff00' : '#ff4444'};">
                Lazy Loading: ${featuresData.lazyLoading ? '✅' : '❌'}
            </div>
            <div style="color: ${featuresData.cssLoader ? '#00ff00' : '#ff4444'};">
                CSS Loader: ${featuresData.cssLoader ? '✅' : '❌'}
            </div>
            <div style="color: ${featuresData.backgroundImages ? '#00ff00' : '#ff4444'};">
                Background Images: ${featuresData.backgroundImages ? '✅' : '❌'}
            </div>
        `;
    }

    monitorPWAEvents() {
        // Monitor beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            this.debugData.beforeInstallPromptFired = true;
            this.log('🎯 beforeinstallprompt event fired!');
            this.log(`📱 Platform: ${e.platforms?.join(', ') || 'unknown'}`);
        });

        // Monitor appinstalled
        window.addEventListener('appinstalled', () => {
            this.log('✅ App installed successfully!');
        });

        // Monitor service worker events
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.log(`📨 SW Message: ${JSON.stringify(event.data)}`);
            });
        }
    }

    log(message) {
        const logContainer = document.getElementById('console-log');
        if (logContainer) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '2px';
            logEntry.innerHTML = `<span style="color: #666;">[${timestamp}]</span> ${message}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        console.log(`[DEBUG] ${message}`);
    }

    getLoadTime() {
        const perfData = performance.getEntriesByType('navigation')[0];
        return perfData ? Math.round(perfData.loadEventEnd - perfData.fetchStart) : 'N/A';
    }

    runTests() {
        this.log('🧪 Running comprehensive tests...');
        
        // Test PWA install criteria
        this.testPWAInstallCriteria();
        
        // Test performance
        this.testPerformance();
        
        // Test features
        this.testFeatures();
        
        this.log('✅ Tests completed!');
    }

    testPWAInstallCriteria() {
        this.log('🔍 Testing PWA install criteria...');
        
        const criteria = {
            https: location.protocol === 'https:' || location.hostname === 'localhost',
            manifest: document.querySelector('link[rel="manifest"]') !== null,
            serviceWorker: 'serviceWorker' in navigator,
            notInstalled: !window.matchMedia('(display-mode: standalone)').matches
        };
        
        Object.entries(criteria).forEach(([key, value]) => {
            this.log(`${value ? '✅' : '❌'} ${key}: ${value}`);
        });
        
        if (!criteria.https) {
            this.log('⚠️ PWA requires HTTPS or localhost!');
        }
    }

    testPerformance() {
        this.log('⚡ Testing performance...');
        
        const images = document.querySelectorAll('img');
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        this.log(`📸 Total images: ${images.length}`);
        this.log(`🔄 Lazy images: ${lazyImages.length}`);
        this.log(`⏱️ Load time: ${this.getLoadTime()}ms`);
    }

    testFeatures() {
        this.log('🎨 Testing features...');
        
        const features = [
            'videoGallery',
            'lazyLoader', 
            'pwaManager',
            'analyticsTracker',
            'i18n',
            'darkModeManager'
        ];
        
        features.forEach(feature => {
            const exists = !!window[feature];
            this.log(`${exists ? '✅' : '❌'} ${feature}: ${exists}`);
        });
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            debugData: this.debugData,
            performance: this.getLoadTime(),
            features: {
                pwa: !!window.pwaManager,
                gallery: !!window.videoGallery,
                analytics: !!window.analyticsTracker
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.log('📤 Debug data exported!');
    }

    clearLogs() {
        const logContainer = document.getElementById('console-log');
        if (logContainer) {
            logContainer.innerHTML = '';
        }
        this.log('🗑️ Logs cleared');
    }
}

// Initialize debug panel
document.addEventListener('DOMContentLoaded', () => {
    window.debugPanel = new DebugPanel();
    console.log('🔧 Debug Panel ready! Press Ctrl+Shift+D to open');
});

// Show debug panel automatically in development
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    setTimeout(() => {
        if (window.debugPanel) {
            window.debugPanel.toggle();
        }
    }, 2000);
}
