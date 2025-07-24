/**
 * PWA Manager for Alex Rodriguez Videographer
 * Handles service worker registration, install prompts, and PWA features
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.swRegistration = null;
        this.init();
    }

    async init() {
        this.checkInstallStatus();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupUpdateHandler();
        this.setupOfflineHandler();
        this.trackPWAUsage();
    }

    // Check if app is already installed
    checkInstallStatus() {
        // Check if running as PWA
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');

        if (this.isInstalled) {
            console.log('PWA is installed and running in standalone mode');
            this.trackPWALaunch();
        }
    }

    // Register service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registered successfully:', this.swRegistration);

                // Handle service worker updates
                this.swRegistration.addEventListener('updatefound', () => {
                    this.handleServiceWorkerUpdate();
                });

                // Check for existing service worker
                if (this.swRegistration.active) {
                    console.log('Service Worker is active');
                }

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported');
        }
    }

    // Setup install prompt handling
    setupInstallPrompt() {
        console.log('🔧 Setting up install prompt handlers...');

        // Check install criteria
        this.checkInstallCriteria();

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🎯 beforeinstallprompt event fired!');
            console.log('📱 Platforms:', e.platforms);

            // Prevent the mini-infobar from appearing
            e.preventDefault();

            // Store the event for later use
            this.deferredPrompt = e;

            // Show custom install button
            this.showInstallButton();

            // Log to debug panel
            if (window.debugPanel) {
                window.debugPanel.log('🎯 Install prompt available!');
            }
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.trackPWAInstall();

            if (window.debugPanel) {
                window.debugPanel.log('✅ App installed successfully!');
            }
        });

        // Timeout to check if prompt fired
        setTimeout(() => {
            if (!this.deferredPrompt) {
                console.log('⚠️ Install prompt not available after 5 seconds');
                this.diagnoseInstallIssues();
            }
        }, 5000);
    }

    // Check PWA install criteria
    checkInstallCriteria() {
        const criteria = {
            https: location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1',
            manifest: document.querySelector('link[rel="manifest"]') !== null,
            serviceWorker: 'serviceWorker' in navigator,
            notInstalled: !this.isInstalled,
            validManifest: this.checkManifestValidity()
        };

        console.log('🔍 PWA Install Criteria Check:');
        Object.entries(criteria).forEach(([key, value]) => {
            console.log(`${value ? '✅' : '❌'} ${key}:`, value);
        });

        return Object.values(criteria).every(Boolean);
    }

    // Check manifest validity
    checkManifestValidity() {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) return false;

        // Try to fetch and validate manifest
        fetch(manifestLink.href)
            .then(response => response.json())
            .then(manifest => {
                console.log('📋 Manifest loaded:', manifest);
                const isValid = manifest.name && manifest.start_url && manifest.display && manifest.icons;
                console.log('📋 Manifest valid:', isValid);
                return isValid;
            })
            .catch(error => {
                console.error('❌ Manifest error:', error);
                return false;
            });

        return true; // Assume valid for now
    }

    // Diagnose why install prompt isn't showing
    diagnoseInstallIssues() {
        console.log('🔍 Diagnosing install issues...');

        const issues = [];

        // Check protocol
        if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
            issues.push('❌ Not served over HTTPS');
        }

        // Check if already installed
        if (this.isInstalled) {
            issues.push('ℹ️ App already installed');
        }

        // Check manifest
        if (!document.querySelector('link[rel="manifest"]')) {
            issues.push('❌ No manifest link found');
        }

        // Check service worker
        if (!('serviceWorker' in navigator)) {
            issues.push('❌ Service Worker not supported');
        } else if (!this.swRegistration) {
            issues.push('❌ Service Worker not registered');
        }

        // Check browser
        const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
        const isEdge = /Edg/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);

        if (!isChrome && !isEdge && !isFirefox) {
            issues.push('⚠️ Browser may not support install prompts');
        }

        // Check if file:// protocol
        if (location.protocol === 'file:') {
            issues.push('❌ File protocol - PWA requires HTTP server');
        }

        console.log('🔍 Install Issues Found:');
        issues.forEach(issue => console.log(issue));

        if (window.debugPanel) {
            issues.forEach(issue => window.debugPanel.log(issue));
        }

        // Show manual install option if no major issues
        if (issues.length === 0 || issues.every(issue => issue.includes('ℹ️'))) {
            this.showManualInstallOption();
        }
    }

    // Show manual install option
    showManualInstallOption() {
        console.log('📱 Showing manual install option...');

        // Create manual install button
        const button = this.createInstallButton();
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Add to Home Screen
        `;

        button.addEventListener('click', () => {
            this.showManualInstallInstructions();
        });

        document.body.appendChild(button);
        button.style.display = 'block';
    }

    // Show manual install instructions
    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let instructions = '';

        if (isIOS) {
            instructions = `
                <h3>📱 Install on iOS</h3>
                <ol>
                    <li>Tap the Share button <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to confirm</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <h3>📱 Install on Android</h3>
                <ol>
                    <li>Tap the menu button (⋮)</li>
                    <li>Tap "Add to Home screen" or "Install app"</li>
                    <li>Tap "Add" to confirm</li>
                </ol>
            `;
        } else {
            instructions = `
                <h3>💻 Install on Desktop</h3>
                <ol>
                    <li>Look for the install icon in the address bar</li>
                    <li>Or go to browser menu → "Install Alex Rodriguez..."</li>
                    <li>Click "Install" to confirm</li>
                </ol>
            `;
        }

        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                    font-family: 'Source Sans Pro', sans-serif;
                ">
                    ${instructions}
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                    ">Got it!</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Show custom install button
    showInstallButton() {
        // Create install button if it doesn't exist
        let installButton = document.getElementById('pwa-install-button');
        
        if (!installButton) {
            installButton = this.createInstallButton();
            document.body.appendChild(installButton);
        }

        installButton.style.display = 'block';
        
        // Add click handler
        installButton.addEventListener('click', () => {
            this.promptInstall();
        });
    }

    // Create install button element
    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-button';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Install App
        `;
        
        // Style the button
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: '1000',
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontFamily: 'Source Sans Pro, sans-serif'
        });

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });

        return button;
    }

    // Hide install button
    hideInstallButton() {
        const installButton = document.getElementById('pwa-install-button');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    // Prompt user to install
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for user response
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`Install prompt outcome: ${outcome}`);
        
        if (outcome === 'accepted') {
            this.trackPWAInstallAccepted();
        } else {
            this.trackPWAInstallDismissed();
        }

        // Clear the deferred prompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    // Handle service worker updates
    handleServiceWorkerUpdate() {
        const newWorker = this.swRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                this.showUpdateNotification();
            }
        });
    }

    // Show update notification
    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 15px;
                font-family: 'Source Sans Pro', sans-serif;
                font-size: 14px;
            ">
                <span>New version available!</span>
                <button onclick="window.pwaManager.applyUpdate()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                ">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: transparent;
                    color: white;
                    border: 1px solid #666;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                ">Later</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // Apply service worker update
    applyUpdate() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    // Setup offline handler
    setupOfflineHandler() {
        window.addEventListener('online', () => {
            console.log('Back online');
            this.hideOfflineNotification();
        });

        window.addEventListener('offline', () => {
            console.log('Gone offline');
            this.showOfflineNotification();
        });
    }

    // Show offline notification
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.id = 'offline-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #ff6b6b;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-family: 'Source Sans Pro', sans-serif;
                font-size: 14px;
                z-index: 1001;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            ">
                📡 You're offline - Some features may be limited
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    // Hide offline notification
    hideOfflineNotification() {
        const notification = document.getElementById('offline-notification');
        if (notification) {
            notification.remove();
        }
    }

    // Setup update handler for service worker messages
    setupUpdateHandler() {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                this.showUpdateNotification();
            }
        });
    }

    // Analytics tracking for PWA events
    trackPWAUsage() {
        if (this.isInstalled && window.analyticsTracker) {
            window.analyticsTracker.trackPWAUsage('launch');
        }
    }

    trackPWALaunch() {
        if (window.gtag) {
            gtag('event', 'pwa_launch', {
                event_category: 'PWA',
                event_label: 'App launched in standalone mode'
            });
        }
    }

    trackPWAInstall() {
        if (window.gtag) {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'App installed',
                value: 1
            });
        }
    }

    trackPWAInstallAccepted() {
        if (window.gtag) {
            gtag('event', 'pwa_install_prompt', {
                event_category: 'PWA',
                event_label: 'Install prompt accepted'
            });
        }
    }

    trackPWAInstallDismissed() {
        if (window.gtag) {
            gtag('event', 'pwa_install_prompt', {
                event_category: 'PWA',
                event_label: 'Install prompt dismissed'
            });
        }
    }

    // Public methods
    getInstallStatus() {
        return {
            isInstalled: this.isInstalled,
            canInstall: !!this.deferredPrompt,
            isServiceWorkerSupported: 'serviceWorker' in navigator
        };
    }

    forceInstallPrompt() {
        if (this.deferredPrompt) {
            this.promptInstall();
        } else {
            console.log('Install prompt not available');
        }
    }
}

// Initialize PWA Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
    console.log('PWA Manager initialized');
});

// Export for external use
window.getPWAStatus = () => {
    return window.pwaManager ? window.pwaManager.getInstallStatus() : null;
};
