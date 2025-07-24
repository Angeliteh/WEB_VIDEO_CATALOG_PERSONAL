/**
 * Google Analytics 4 Implementation for Alex Rodriguez Videographer
 * Enhanced tracking for video portfolio website
 */

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID

// Initialize Google Analytics 4
function initializeGA4() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    // Configure GA4
    gtag('config', GA_MEASUREMENT_ID, {
        // Enhanced measurement
        enhanced_measurement: true,
        // Custom parameters
        custom_map: {
            'custom_parameter_1': 'video_category',
            'custom_parameter_2': 'filter_used'
        },
        // Cookie settings
        cookie_flags: 'SameSite=None;Secure',
        // Debug mode (set to false in production)
        debug_mode: false
    });

    // Make gtag globally available
    window.gtag = gtag;
}

// Custom Event Tracking
class AnalyticsTracker {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.trackPageView();
    }

    // Track page views
    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                content_group1: this.getPageCategory()
            });
        }
    }

    // Track video interactions
    trackVideoInteraction(action, videoTitle, category = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_interaction', {
                event_category: 'Video',
                event_label: videoTitle,
                video_action: action,
                video_category: category,
                value: 1
            });
        }
    }

    // Track filter usage
    trackFilterUsage(filterType, filterValue) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_used', {
                event_category: 'Gallery',
                event_label: `${filterType}: ${filterValue}`,
                filter_type: filterType,
                filter_value: filterValue
            });
        }
    }

    // Track contact form interactions
    trackContactForm(action, formField = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form', {
                event_category: 'Contact',
                event_label: action,
                form_field: formField,
                value: action === 'submit' ? 10 : 1
            });
        }
    }

    // Track language changes
    trackLanguageChange(fromLang, toLang) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                event_category: 'Localization',
                event_label: `${fromLang} to ${toLang}`,
                from_language: fromLang,
                to_language: toLang
            });
        }
    }

    // Track theme changes
    trackThemeChange(theme) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                event_category: 'UI',
                event_label: theme,
                theme: theme
            });
        }
    }

    // Track scroll depth
    trackScrollDepth(percentage) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                event_category: 'Engagement',
                event_label: `${percentage}%`,
                scroll_depth: percentage
            });
        }
    }

    // Track external link clicks
    trackExternalLink(url, linkText) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'External Link',
                event_label: url,
                link_text: linkText,
                link_url: url
            });
        }
    }

    // Get page category for content grouping
    getPageCategory() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'Portfolio';
        if (path.includes('about')) return 'About';
        if (path.includes('contact')) return 'Contact';
        if (path.includes('video')) return 'Video Detail';
        return 'Other';
    }

    // Setup automatic event listeners
    setupEventListeners() {
        // Track external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                this.trackExternalLink(link.href, link.textContent);
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 90, 100];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone reached
                const milestone = scrollMilestones.find(m => m <= scrollPercent && m > (maxScroll - scrollPercent));
                if (milestone) {
                    this.trackScrollDepth(milestone);
                }
            }
        });

        // Track form interactions
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            // Track form start
            contactForm.addEventListener('focusin', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    this.trackContactForm('start', e.target.name);
                }
            }, { once: true });

            // Track form submission
            contactForm.addEventListener('submit', () => {
                this.trackContactForm('submit');
            });
        }
    }
}

// Enhanced E-commerce tracking (for future use)
class EcommerceTracker {
    // Track service inquiries as conversions
    trackServiceInquiry(serviceType, value = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                currency: 'USD',
                value: value,
                service_type: serviceType
            });
        }
    }

    // Track quote requests
    trackQuoteRequest(serviceType, projectDetails) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: 0,
                service_type: serviceType,
                project_type: projectDetails
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GA4
    initializeGA4();
    
    // Initialize trackers
    window.analyticsTracker = new AnalyticsTracker();
    window.ecommerceTracker = new EcommerceTracker();
    
    console.log('Analytics initialized for Alex Rodriguez Videographer');
});

// Export for use in other scripts
window.trackVideoInteraction = (action, title, category) => {
    if (window.analyticsTracker) {
        window.analyticsTracker.trackVideoInteraction(action, title, category);
    }
};

window.trackFilterUsage = (type, value) => {
    if (window.analyticsTracker) {
        window.analyticsTracker.trackFilterUsage(type, value);
    }
};
