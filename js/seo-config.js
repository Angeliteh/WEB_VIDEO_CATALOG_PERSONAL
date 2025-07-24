/**
 * SEO Configuration for Alex Rodriguez Videographer
 * Centralized SEO settings and dynamic meta tag management
 */

const SEO_CONFIG = {
    // Site Information
    site: {
        name: "Alex Rodriguez Videographer",
        url: "https://alexrodriguez-videographer.com",
        description: "Professional videographer in Colorado specializing in wedding films, corporate videos, and creative storytelling.",
        author: "Alex Rodriguez",
        email: "hello@alexrodriguez-videographer.com",
        phone: "+1-720-555-0123",
        location: {
            city: "Colorado",
            state: "CO",
            country: "US",
            coordinates: {
                lat: "39.7392",
                lng: "-104.9903"
            }
        }
    },

    // Social Media
    social: {
        instagram: "https://instagram.com/alexrodriguezfilm",
        youtube: "https://youtube.com/alexrodriguezfilm", 
        linkedin: "https://linkedin.com/in/alexrodriguezfilm",
        twitter: "@alexrodriguezfilm"
    },

    // Services for Schema.org
    services: [
        {
            name: "Wedding Videography",
            description: "Cinematic wedding films capturing your special day with artistic storytelling",
            category: "wedding"
        },
        {
            name: "Corporate Video Production", 
            description: "Professional promotional videos and brand storytelling for businesses",
            category: "corporate"
        },
        {
            name: "Drone Cinematography",
            description: "Stunning aerial footage and cinematic drone videography",
            category: "drone"
        },
        {
            name: "Event Documentation",
            description: "Comprehensive coverage of conferences, celebrations, and special events",
            category: "events"
        }
    ],

    // Keywords by page
    keywords: {
        home: [
            "videographer Colorado",
            "wedding videographer",
            "corporate video production", 
            "drone footage",
            "cinematic videos",
            "visual storyteller",
            "video portfolio",
            "Colorado wedding films"
        ],
        about: [
            "Alex Rodriguez videographer",
            "Colorado videographer about",
            "wedding videographer Colorado",
            "professional video services",
            "visual storyteller biography"
        ],
        contact: [
            "contact videographer Colorado",
            "book wedding videographer", 
            "hire video production",
            "Colorado video services",
            "Alex Rodriguez contact"
        ]
    },

    // Page-specific meta data
    pages: {
        home: {
            title: "Alex Rodriguez - Professional Videographer & Visual Storyteller | Colorado",
            description: "Professional videographer in Colorado specializing in wedding films, corporate videos, and creative storytelling. View my portfolio of cinematic work and book your next project."
        },
        about: {
            title: "About Alex Rodriguez - Professional Videographer | Colorado Visual Storyteller", 
            description: "Meet Alex Rodriguez, a passionate videographer with 8 years of experience in Colorado. Specializing in wedding films, corporate videos, and creative storytelling projects."
        },
        contact: {
            title: "Contact Alex Rodriguez - Book Your Video Project | Colorado Videographer",
            description: "Ready to create something amazing? Contact Alex Rodriguez for wedding videography, corporate videos, and creative projects in Colorado. Professional video services with quick response."
        },
        video: {
            title: "Professional Video Work - Alex Rodriguez | Colorado Videographer",
            description: "Explore professional video work by Alex Rodriguez. High-quality cinematic footage showcasing expertise in wedding, corporate, and creative videography."
        }
    }
};

// Dynamic Meta Tag Manager
class SEOManager {
    constructor() {
        this.config = SEO_CONFIG;
        this.init();
    }

    init() {
        this.updatePageMeta();
        this.addStructuredData();
        this.setupDynamicSEO();
    }

    // Update meta tags based on current page
    updatePageMeta() {
        const currentPage = this.getCurrentPage();
        const pageConfig = this.config.pages[currentPage];
        
        if (pageConfig) {
            // Update title
            document.title = pageConfig.title;
            
            // Update description
            this.updateMetaTag('description', pageConfig.description);
            
            // Update keywords
            const keywords = this.config.keywords[currentPage];
            if (keywords) {
                this.updateMetaTag('keywords', keywords.join(', '));
            }
            
            // Update Open Graph
            this.updateOpenGraph(pageConfig);
            
            // Update Twitter Cards
            this.updateTwitterCards(pageConfig);
        }
    }

    // Update or create meta tag
    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    // Update Open Graph tags
    updateOpenGraph(pageConfig) {
        this.updateMetaProperty('og:title', pageConfig.title);
        this.updateMetaProperty('og:description', pageConfig.description);
        this.updateMetaProperty('og:url', window.location.href);
        this.updateMetaProperty('og:site_name', this.config.site.name);
    }

    // Update Twitter Card tags
    updateTwitterCards(pageConfig) {
        this.updateMetaProperty('twitter:title', pageConfig.title);
        this.updateMetaProperty('twitter:description', pageConfig.description);
        this.updateMetaProperty('twitter:creator', this.config.social.twitter);
    }

    // Update meta property
    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    // Get current page type
    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html' || path.endsWith('/')) return 'home';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        if (path.includes('video')) return 'video';
        return 'home';
    }

    // Add structured data dynamically
    addStructuredData() {
        const currentPage = this.getCurrentPage();
        
        // Add breadcrumbs for non-home pages
        if (currentPage !== 'home') {
            this.addBreadcrumbSchema(currentPage);
        }
        
        // Add FAQ schema if applicable
        if (currentPage === 'about') {
            this.addFAQSchema();
        }
    }

    // Add breadcrumb structured data
    addBreadcrumbSchema(currentPage) {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": this.config.site.url
                },
                {
                    "@type": "ListItem", 
                    "position": 2,
                    "name": currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
                    "item": window.location.href
                }
            ]
        };

        this.addJSONLD(breadcrumbSchema);
    }

    // Add FAQ schema for about page
    addFAQSchema() {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What video services does Alex Rodriguez offer?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Alex Rodriguez offers wedding videography, corporate video production, drone cinematography, and event documentation services throughout Colorado."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Where is Alex Rodriguez based?",
                    "acceptedAnswer": {
                        "@type": "Answer", 
                        "text": "Alex Rodriguez is based in Colorado and serves clients throughout the state for video production services."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can I book Alex Rodriguez for my project?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You can contact Alex Rodriguez through the contact form on the website or by email at hello@alexrodriguez-videographer.com to discuss your video project needs."
                    }
                }
            ]
        };

        this.addJSONLD(faqSchema);
    }

    // Add JSON-LD structured data
    addJSONLD(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Setup dynamic SEO for SPA-like behavior
    setupDynamicSEO() {
        // Update meta tags when hash changes (for future SPA features)
        window.addEventListener('hashchange', () => {
            this.updatePageMeta();
        });

        // Update canonical URL
        this.updateCanonicalURL();
    }

    // Update canonical URL
    updateCanonicalURL() {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', window.location.href);
    }
}

// Initialize SEO Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.seoManager = new SEOManager();
    console.log('SEO Manager initialized');
});

// Export configuration for use in other scripts
window.SEO_CONFIG = SEO_CONFIG;
