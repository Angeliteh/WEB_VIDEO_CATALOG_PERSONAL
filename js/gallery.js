/**
 * Gallery System for MediaVault Pro
 * Handles filtering, pagination, and video display
 */

class VideoGallery {
    constructor() {
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.videosPerPage = 9;
        this.allVideos = [];
        this.filteredVideos = [];
        
        this.init();
    }

    init() {
        // Verify required DOM elements exist
        const gallery = document.getElementById('video-gallery');
        if (!gallery) {
            console.error('Gallery container not found');
            return;
        }

        this.loadVideoData();
        this.renderFeaturedGallery(); // Show only featured videos for index

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.renderFeaturedGallery();
        });
    }

    loadVideoData() {
        // Video data with categories and metadata
        this.allVideos = [
            {
                id: 1,
                title: 'videos.cinematic_landscapes.title',
                description: 'videos.cinematic_landscapes.description',
                thumbnail: 'img/tn-01.jpg',
                category: 'nature',
                featured: true,
                date: '2024-01-15',
                location: 'Rocky Mountains, Colorado',
                equipment: 'DJI Mavic 3, Sony A7IV',
                videoFile: 'video/cinematic-landscapes.mp4'
            },
            {
                id: 2,
                title: 'videos.urban_timelapse.title',
                description: 'videos.urban_timelapse.description',
                thumbnail: 'img/tn-02.jpg',
                category: 'lifestyle',
                featured: true,
                date: '2024-01-10',
                location: 'Downtown Denver, Colorado',
                equipment: 'Sony A7IV, Gimbal Stabilizer',
                videoFile: 'video/urban-timelapse.mp4'
            },
            {
                id: 3,
                title: 'videos.ocean_waves.title',
                description: 'videos.ocean_waves.description',
                thumbnail: 'img/tn-03.jpg',
                category: 'nature',
                featured: true,
                date: '2024-01-08',
                location: 'Pacific Coast, California',
                equipment: 'DJI Mavic 3, ND Filters',
                videoFile: 'video/ocean-waves.mp4'
            },
            {
                id: 4,
                title: 'videos.mountain_adventure.title',
                description: 'videos.mountain_adventure.description',
                thumbnail: 'img/tn-04.jpg',
                category: 'drone',
                featured: false,
                date: '2024-01-05'
            },
            {
                id: 5,
                title: 'videos.forest_wildlife.title',
                description: 'videos.forest_wildlife.description',
                thumbnail: 'img/tn-05.jpg',
                category: 'nature',
                featured: true,
                date: '2024-01-03'
            },
            {
                id: 6,
                title: 'videos.sunset_magic.title',
                description: 'videos.sunset_magic.description',
                thumbnail: 'img/tn-06.jpg',
                category: 'drone',
                featured: false,
                date: '2024-01-01'
            },
            {
                id: 7,
                title: 'videos.tech_innovation.title',
                description: 'videos.tech_innovation.description',
                thumbnail: 'img/tn-07.jpg',
                category: 'technology',
                featured: false,
                date: '2023-12-28'
            },
            {
                id: 8,
                title: 'videos.cultural_heritage.title',
                description: 'videos.cultural_heritage.description',
                thumbnail: 'img/tn-08.jpg',
                category: 'lifestyle',
                featured: false,
                date: '2023-12-25'
            },
            {
                id: 9,
                title: 'videos.extreme_sports.title',
                description: 'videos.extreme_sports.description',
                thumbnail: 'img/tn-09.jpg',
                category: 'actions',
                featured: false,
                date: '2023-12-20'
            },
            // Add more videos for pagination demo
            {
                id: 10,
                title: 'videos.cinematic_landscapes.title',
                description: 'videos.cinematic_landscapes.description',
                thumbnail: 'img/tn-01.jpg',
                category: 'nature',
                featured: false,
                date: '2023-12-15'
            },
            {
                id: 11,
                title: 'videos.urban_timelapse.title',
                description: 'videos.urban_timelapse.description',
                thumbnail: 'img/tn-02.jpg',
                category: 'lifestyle',
                featured: false,
                date: '2023-12-10'
            },
            {
                id: 12,
                title: 'videos.ocean_waves.title',
                description: 'videos.ocean_waves.description',
                thumbnail: 'img/tn-03.jpg',
                category: 'nature',
                featured: false,
                date: '2023-12-05'
            }
        ];

        this.applyFilter();
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.tm-category-link');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter') || 'all';
                this.setFilter(filter);
            });
        });

        // Pagination will be set up after rendering
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1; // Reset to first page

        // Track filter usage
        if (window.trackFilterUsage) {
            window.trackFilterUsage('category', filter);
        }

        // Update active filter button
        document.querySelectorAll('.tm-category-link').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.querySelector(`[data-filter="${filter}"]`) ||
                           document.querySelector('.tm-category-link');
        activeButton.classList.add('active');

        this.applyFilter();
        this.renderGallery();
    }

    applyFilter() {
        if (this.currentFilter === 'all') {
            this.filteredVideos = [...this.allVideos];
        } else if (this.currentFilter === 'featured') {
            this.filteredVideos = this.allVideos.filter(video => video.featured);
        } else {
            this.filteredVideos = this.allVideos.filter(video => video.category === this.currentFilter);
        }
    }

    renderGallery() {
        const container = document.getElementById('video-gallery');
        if (!container) return;

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredVideos.length / this.videosPerPage);
        const startIndex = (this.currentPage - 1) * this.videosPerPage;
        const endIndex = startIndex + this.videosPerPage;
        const videosToShow = this.filteredVideos.slice(startIndex, endIndex);

        // Clear container
        container.innerHTML = '';

        // Render videos
        videosToShow.forEach(video => {
            const videoElement = this.createVideoElement(video);
            container.appendChild(videoElement);
        });

        // Update translations for new content immediately
        if (window.i18n && window.i18n.translatePage) {
            // Force translation update
            setTimeout(() => {
                window.i18n.translatePage();
            }, 50);
        }

        // Render pagination
        this.renderPagination(totalPages);

        // Add loading animation
        this.animateVideoCards();
    }

    renderFeaturedGallery() {
        const container = document.getElementById('video-gallery');
        if (!container) {
            console.error('Gallery container not found');
            return;
        }

        // Get only featured videos, limit to 4 for 2x2 grid
        const featuredVideos = this.allVideos
            .filter(video => video.featured)
            .slice(0, 4);

        // Clear container
        container.innerHTML = '';

        // Render featured videos
        featuredVideos.forEach(video => {
            const videoElement = this.createFeaturedVideoElement(video);
            container.appendChild(videoElement);
        });

        // Update translations for new content immediately
        if (window.i18n && window.i18n.translatePage) {
            setTimeout(() => {
                window.i18n.translatePage();
            }, 100);
        }

        // Add loading animation
        this.animateVideoCards();
    }

    createFeaturedVideoElement(video) {
        const col = document.createElement('div');
        col.className = 'col-lg-6 col-md-6 col-sm-12 tm-catalog-item'; // 2x2 grid

        // Get translated text
        const translatedTitle = this.getTranslatedText(video.title);
        const translatedDescription = this.getTranslatedText(video.description);

        col.innerHTML = `
            <div class="video-card featured-video-card">
                <div class="position-relative tm-thumbnail-container">
                    <img data-src="${video.thumbnail}"
                         alt="${translatedTitle}"
                         class="img-fluid tm-catalog-item-img lazy-image"
                         src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4="
                         ${video.webpThumbnail ? `data-webp-src="${video.webpThumbnail}"` : ''}>
                    <a href="video-page.html?id=${video.id}" class="position-absolute tm-img-overlay" data-video-id="${video.id}" data-video-title="${video.title}" data-video-category="${video.category}">
                        <i class="fas fa-play tm-overlay-icon"></i>
                    </a>
                    <div class="featured-badge">Featured</div>
                </div>
                <div class="p-4 tm-bg-gray tm-catalog-item-description">
                    <h3 class="tm-text-primary mb-3 tm-catalog-item-title" data-i18n="${video.title}">${translatedTitle}</h3>
                    <p class="tm-catalog-item-text" data-i18n="${video.description}">${translatedDescription}</p>
                    <div class="video-meta">
                        <span class="video-date">${this.formatDate(video.date)}</span>
                        <span class="video-category">${this.getCategoryName(video.category)}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click tracking to video links
        const videoLink = col.querySelector('.tm-img-overlay');
        if (videoLink) {
            videoLink.addEventListener('click', (e) => {
                if (window.trackVideoInteraction) {
                    window.trackVideoInteraction('click', video.title, video.category);
                }
            });
        }

        // Add lazy loading to the new image
        const lazyImage = col.querySelector('.lazy-image');
        if (lazyImage && window.addLazyImage) {
            window.addLazyImage(lazyImage);
        }

        return col;
    }

    createVideoElement(video) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-12 tm-catalog-item';

        // Get translated text
        const translatedTitle = this.getTranslatedText(video.title);
        const translatedDescription = this.getTranslatedText(video.description);

        col.innerHTML = `
            <div class="video-card">
                <div class="position-relative tm-thumbnail-container">
                    <img data-src="${video.thumbnail}"
                         alt="${translatedTitle}"
                         class="img-fluid tm-catalog-item-img lazy-image"
                         src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4="
                         ${video.webpThumbnail ? `data-webp-src="${video.webpThumbnail}"` : ''}>
                    <a href="video-page.html?id=${video.id}" class="position-absolute tm-img-overlay" data-video-id="${video.id}" data-video-title="${video.title}" data-video-category="${video.category}">
                        <i class="fas fa-play tm-overlay-icon"></i>
                    </a>
                    ${video.featured ? '<div class="featured-badge">Featured</div>' : ''}
                </div>
                <div class="p-4 tm-bg-gray tm-catalog-item-description">
                    <h3 class="tm-text-primary mb-3 tm-catalog-item-title" data-i18n="${video.title}">${translatedTitle}</h3>
                    <p class="tm-catalog-item-text" data-i18n="${video.description}">${translatedDescription}</p>
                    <div class="video-meta">
                        <span class="video-date">${this.formatDate(video.date)}</span>
                        <span class="video-category">${this.getCategoryName(video.category)}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click tracking to video links
        const videoLink = col.querySelector('.tm-img-overlay');
        if (videoLink) {
            videoLink.addEventListener('click', (e) => {
                if (window.trackVideoInteraction) {
                    window.trackVideoInteraction('click', video.title, video.category);
                }
            });
        }

        // Add lazy loading to the new image
        const lazyImage = col.querySelector('.lazy-image');
        if (lazyImage && window.addLazyImage) {
            window.addLazyImage(lazyImage);
        }
        
        return col;
    }

    getTranslatedText(key) {
        // Try to get translated text from i18n system
        if (window.i18n && window.i18n.translations && window.i18n.currentLanguage) {
            const translations = window.i18n.translations[window.i18n.currentLanguage];
            const keys = key.split('.');
            let value = translations;

            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    // Fallback to key if translation not found
                    return key;
                }
            }

            return typeof value === 'string' ? value : key;
        }

        // Fallback to key if no i18n system
        return key;
    }

    renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<nav class="tm-paging-links"><ul class="nav">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <li class="nav-item">
                    <a href="#" class="nav-link tm-paging-link" data-page="${this.currentPage - 1}">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `
                <li class="nav-item ${activeClass}">
                    <a href="#" class="nav-link tm-paging-link" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <li class="nav-item">
                    <a href="#" class="nav-link tm-paging-link" data-page="${this.currentPage + 1}">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
        }

        paginationHTML += '</ul></nav>';
        paginationContainer.innerHTML = paginationHTML;

        // Add pagination event listeners
        const paginationLinks = paginationContainer.querySelectorAll('.tm-paging-link');
        paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                this.goToPage(page);
            });
        });
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderGallery();
        
        // Smooth scroll to gallery
        const gallery = document.getElementById('video-gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    animateVideoCards() {
        const cards = document.querySelectorAll('.tm-catalog-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const currentLanguage = window.i18n?.currentLanguage || 'en';
        return date.toLocaleDateString(currentLanguage, {
            year: 'numeric',
            month: 'short'
        });
    }

    getCategoryName(category) {
        const categoryMap = {
            'nature': 'Nature',
            'lifestyle': 'Lifestyle',
            'drone': 'Aerial',
            'actions': 'Action',
            'technology': 'Tech'
        };
        return categoryMap[category] || category;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.videoGallery = new VideoGallery();
});
