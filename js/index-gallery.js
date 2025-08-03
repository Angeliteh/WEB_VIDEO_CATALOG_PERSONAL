/**
 * Simple Gallery for Index Page - Only Featured Videos
 * Shows exactly 4 featured videos in 2x2 grid
 */

class IndexGallery {
    constructor() {
        this.featuredVideos = [];
        this.init();
    }

    init() {
        // Verify required DOM elements exist
        const gallery = document.getElementById('video-gallery');
        if (!gallery) {
            console.error('Gallery container not found');
            return;
        }

        this.loadFeaturedVideos();
        this.renderFeaturedVideos();

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.renderFeaturedVideos();
        });
    }

    loadFeaturedVideos() {
        // Only the 4 featured videos for index page
        this.featuredVideos = [
            {
                id: 1,
                title: 'videos.cinematic_landscapes.title',
                description: 'videos.cinematic_landscapes.description',
                thumbnail: 'img/tn-01.jpg',
                category: 'nature',
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
                date: '2024-01-08',
                location: 'Pacific Coast, California',
                equipment: 'DJI Mavic 3, ND Filters',
                videoFile: 'video/ocean-waves.mp4'
            },
            {
                id: 5,
                title: 'videos.forest_wildlife.title',
                description: 'videos.forest_wildlife.description',
                thumbnail: 'img/tn-05.jpg',
                category: 'nature',
                date: '2024-01-03',
                location: 'Yellowstone National Park',
                equipment: 'Sony A7IV, Telephoto Lens',
                videoFile: 'video/forest-wildlife.mp4'
            }
        ];
    }

    renderFeaturedVideos() {
        const container = document.getElementById('video-gallery');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Render exactly 4 featured videos
        this.featuredVideos.forEach(video => {
            const videoElement = this.createVideoElement(video);
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

    createVideoElement(video) {
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

    getTranslatedText(key) {
        if (window.i18n && window.i18n.getTranslation) {
            return window.i18n.getTranslation(key);
        }
        return key; // Fallback to key if translation not available
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }

    getCategoryName(category) {
        const categoryNames = {
            'nature': 'Nature',
            'lifestyle': 'Lifestyle', 
            'drone': 'Aerial',
            'technology': 'Tech',
            'actions': 'Action'
        };
        return categoryNames[category] || category;
    }

    animateVideoCards() {
        const cards = document.querySelectorAll('.tm-catalog-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = '0.5s';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0px)';
            }, index * 150);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndexGallery();
});
