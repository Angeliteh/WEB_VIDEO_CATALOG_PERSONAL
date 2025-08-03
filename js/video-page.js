/**
 * Video Page Dynamic Content Loader
 * Loads video data based on URL parameter and displays it
 */

class VideoPageLoader {
    constructor() {
        this.currentVideo = null;
        this.allVideos = [];
        this.filteredVideos = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.videosPerPage = 16; // 4x4 grid for video page
        this.init();
    }

    init() {
        this.loadVideoData();
        this.loadCurrentVideo();
        this.setupEventListeners();
    }

    loadVideoData() {
        // Complete video data - all videos from gallery.js
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
                date: '2024-01-05',
                location: 'Aspen, Colorado',
                equipment: 'DJI Mavic 3, Action Camera',
                videoFile: 'video/mountain-adventure.mp4'
            },
            {
                id: 5,
                title: 'videos.forest_wildlife.title',
                description: 'videos.forest_wildlife.description',
                thumbnail: 'img/tn-05.jpg',
                category: 'nature',
                featured: true,
                date: '2024-01-03',
                location: 'Yellowstone National Park',
                equipment: 'Sony A7IV, Telephoto Lens',
                videoFile: 'video/forest-wildlife.mp4'
            },
            {
                id: 6,
                title: 'videos.sunset_magic.title',
                description: 'videos.sunset_magic.description',
                thumbnail: 'img/tn-06.jpg',
                category: 'drone',
                featured: false,
                date: '2024-01-01',
                location: 'Grand Canyon, Arizona',
                equipment: 'DJI Mavic 3, ND Filters',
                videoFile: 'video/sunset-magic.mp4'
            },
            {
                id: 7,
                title: 'videos.tech_innovation.title',
                description: 'videos.tech_innovation.description',
                thumbnail: 'img/tn-07.jpg',
                category: 'technology',
                featured: false,
                date: '2023-12-28',
                location: 'Silicon Valley, California',
                equipment: 'Sony A7IV, Macro Lens',
                videoFile: 'video/tech-innovation.mp4'
            },
            {
                id: 8,
                title: 'videos.cultural_heritage.title',
                description: 'videos.cultural_heritage.description',
                thumbnail: 'img/tn-08.jpg',
                category: 'lifestyle',
                featured: false,
                date: '2023-12-25',
                location: 'Santa Fe, New Mexico',
                equipment: 'Sony A7IV, Prime Lens',
                videoFile: 'video/cultural-heritage.mp4'
            },
            {
                id: 9,
                title: 'videos.extreme_sports.title',
                description: 'videos.extreme_sports.description',
                thumbnail: 'img/tn-09.jpg',
                category: 'actions',
                featured: false,
                date: '2023-12-20',
                location: 'Vail, Colorado',
                equipment: 'GoPro Hero 11, DJI Mavic 3',
                videoFile: 'video/extreme-sports.mp4'
            },
            {
                id: 10,
                title: 'videos.wedding_moments.title',
                description: 'videos.wedding_moments.description',
                thumbnail: 'img/tn-10.jpg',
                category: 'lifestyle',
                featured: false,
                date: '2023-12-15',
                location: 'Aspen, Colorado',
                equipment: 'Sony A7IV, 85mm Lens',
                videoFile: 'video/wedding-moments.mp4'
            },
            {
                id: 11,
                title: 'videos.startup_story.title',
                description: 'videos.startup_story.description',
                thumbnail: 'img/tn-11.jpg',
                category: 'technology',
                featured: false,
                date: '2023-12-10',
                location: 'Boulder, Colorado',
                equipment: 'Sony A7IV, Interview Setup',
                videoFile: 'video/startup-story.mp4'
            },
            {
                id: 12,
                title: 'videos.adventure_hiking.title',
                description: 'videos.adventure_hiking.description',
                thumbnail: 'img/tn-12.jpg',
                category: 'actions',
                featured: false,
                date: '2023-12-05',
                location: 'Rocky Mountain National Park',
                equipment: 'GoPro Hero 11, Drone',
                videoFile: 'video/adventure-hiking.mp4'
            }
        ];

        // Initialize filtered videos
        this.filteredVideos = [...this.allVideos];
    }

    loadCurrentVideo() {
        // Get video ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = parseInt(urlParams.get('id'));

        if (videoId) {
            this.currentVideo = this.allVideos.find(video => video.id === videoId);
        }

        // If no video found or no ID, default to first video
        if (!this.currentVideo) {
            this.currentVideo = this.allVideos[0];
        }

        this.renderVideoContent();
        this.renderRelatedVideos();
    }

    renderVideoContent() {
        if (!this.currentVideo) return;

        // Update video title
        const titleElement = document.querySelector('.tm-video-title');
        if (titleElement) {
            titleElement.textContent = this.getTranslatedText(this.currentVideo.title);
            titleElement.setAttribute('data-i18n', this.currentVideo.title);
        }

        // Update video description
        const descElement = document.querySelector('.tm-video-description-box p');
        if (descElement) {
            descElement.textContent = this.getTranslatedText(this.currentVideo.description);
            descElement.setAttribute('data-i18n', this.currentVideo.description);
        }

        // Update video details
        this.updateVideoDetails();

        // Update video source (if video element exists)
        this.updateVideoSource();
    }

    updateVideoDetails() {
        // Update location
        const locationValue = document.querySelector('[data-i18n="video_page.location_value"]');
        if (locationValue) {
            locationValue.textContent = this.currentVideo.location || 'Unknown Location';
        }

        // Update date
        const dateValue = document.querySelector('[data-i18n="video_page.date_value"]');
        if (dateValue) {
            dateValue.textContent = this.formatDate(this.currentVideo.date);
        }

        // Update equipment
        const equipmentValue = document.querySelector('[data-i18n="video_page.equipment_value"]');
        if (equipmentValue) {
            equipmentValue.textContent = this.currentVideo.equipment || 'Professional Equipment';
        }
    }

    updateVideoSource() {
        const videoElement = document.querySelector('#tm-video video');
        if (videoElement && this.currentVideo.videoFile) {
            const source = videoElement.querySelector('source');
            if (source) {
                source.src = this.currentVideo.videoFile;
                videoElement.load(); // Reload video with new source
            }
        }
    }

    renderRelatedVideos() {
        const relatedContainer = document.querySelector('#related-videos-container');
        if (!relatedContainer) return;

        // Initialize with all videos except current one
        this.filteredVideos = this.allVideos.filter(video => video.id !== this.currentVideo.id);
        this.currentFilter = 'all';
        this.currentPage = 1;

        this.renderVideoGallery();
        this.setupFilterListeners();
    }

    renderVideoGallery() {
        const container = document.querySelector('#related-videos-container');
        if (!container) return;

        // Apply current filter
        let videosToShow = this.filteredVideos;
        if (this.currentFilter !== 'all') {
            videosToShow = this.filteredVideos.filter(video => {
                if (this.currentFilter === 'featured') {
                    return video.featured;
                }
                return video.category === this.currentFilter;
            });
        }

        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.videosPerPage;
        const endIndex = startIndex + this.videosPerPage;
        const paginatedVideos = videosToShow.slice(startIndex, endIndex);

        // Clear container
        container.innerHTML = '';

        // Render videos with full index-style format
        paginatedVideos.forEach(video => {
            const videoElement = this.createIndexStyleVideoElement(video);
            container.appendChild(videoElement);
        });

        // Render pagination
        this.renderPagination(videosToShow.length);

        // Force translation update
        this.updateTranslations();
    }

    updateTranslations() {
        // Force update all data-i18n elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslatedText(key);
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        });
    }

    createIndexStyleVideoElement(video) {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 col-sm-12 tm-catalog-item video-page-item';

        const translatedTitle = this.getTranslatedText(video.title);
        const translatedDescription = this.getTranslatedText(video.description);

        col.innerHTML = `
            <div class="video-card">
                <div class="position-relative tm-thumbnail-container">
                    <img src="${video.thumbnail}"
                         alt="${translatedTitle}"
                         class="img-fluid tm-catalog-item-img">
                    <a href="video-page.html?id=${video.id}" class="position-absolute tm-img-overlay">
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

        return col;
    }

    setupFilterListeners() {
        const filterLinks = document.querySelectorAll('.tm-category-link');
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Update active state
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update filter and reset page
                this.currentFilter = link.getAttribute('data-filter');
                this.currentPage = 1;

                // Re-render gallery
                this.renderVideoGallery();
            });
        });
    }

    renderPagination(totalVideos) {
        const paginationContainer = document.querySelector('#related-pagination-container');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalVideos / this.videosPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<nav aria-label="Video pagination"><ul class="pagination justify-content-center">';

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += '</ul></nav>';
        paginationContainer.innerHTML = paginationHTML;

        // Add pagination event listeners
        const pageLinks = paginationContainer.querySelectorAll('.page-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentPage = parseInt(link.getAttribute('data-page'));
                this.renderVideoGallery();
            });
        });
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

    getTranslatedText(key) {
        // Use the same translation system as the main site
        if (window.i18n && window.i18n.getTranslation) {
            const translation = window.i18n.getTranslation(key);
            return translation !== key ? translation : this.getFallbackTranslation(key);
        }
        return this.getFallbackTranslation(key);
    }

    getFallbackTranslation(key) {
        // Fallback translations for video titles and descriptions
        const fallbacks = {
            // Titles
            'videos.cinematic_landscapes.title': 'Mountain Escape',
            'videos.urban_timelapse.title': 'City Life Chronicles',
            'videos.ocean_waves.title': 'Coastal Memories',
            'videos.mountain_adventure.title': 'Alpine Adventure',
            'videos.forest_wildlife.title': 'Backyard Wildlife',
            'videos.sunset_magic.title': 'Golden Hour Collection',
            'videos.tech_innovation.title': 'Creative Process',
            'videos.cultural_heritage.title': 'Family Heritage',
            'videos.extreme_sports.title': 'Weekend Warriors',
            'videos.wedding_moments.title': 'Wedding Memories',
            'videos.startup_story.title': 'Startup Journey',
            'videos.adventure_hiking.title': 'Mountain Adventures',

            // Descriptions
            'videos.cinematic_landscapes.description': 'A personal project capturing the serene beauty of my weekend hiking trip to the Rocky Mountains. Shot with my drone during golden hour, this piece represents my love for nature photography and cinematography.',
            'videos.urban_timelapse.description': 'My ongoing documentation of urban life in downtown. This timelapse compilation shows 6 months of capturing the same intersection at different times, revealing the rhythm of city life.',
            'videos.ocean_waves.description': 'Summer vacation footage from my trip to the Pacific Coast. These intimate moments with the ocean waves remind me why I fell in love with videography - capturing fleeting beauty.',
            'videos.mountain_adventure.description': 'Behind-the-scenes of my mountain climbing expedition. This personal documentary showcases not just the stunning landscapes, but the journey and challenges of outdoor photography.',
            'videos.forest_wildlife.description': 'A year-long project documenting the wildlife in my local forest preserve. Patient observation and respect for nature resulted in these intimate wildlife encounters.',
            'videos.sunset_magic.description': 'My favorite sunset captures from various locations around the world. Each sunset tells a different story - from solo travels to family moments, all preserved in cinematic quality.',
            'videos.tech_innovation.description': 'A behind-the-scenes look at my creative workflow, from planning shoots to post-production. This meta-project shows how I organize and manage my growing video library.',
            'videos.cultural_heritage.description': 'Documenting my grandmother\'s stories and our family traditions. This ongoing project preserves precious memories and cultural heritage for future generations.',
            'videos.extreme_sports.description': 'Action footage from my friends\' extreme sports adventures. From skateboarding to rock climbing, these videos capture the adrenaline and friendship of our weekend escapades.',
            'videos.wedding_moments.description': 'Intimate wedding cinematography capturing the most precious moments of couples\' special days. Each story is unique and beautifully personal.',
            'videos.startup_story.description': 'Following the entrepreneurial journey of a Boulder-based tech startup from concept to launch. A documentary-style exploration of modern business.',
            'videos.adventure_hiking.description': 'Epic hiking adventures through Colorado\'s most challenging trails. These videos capture both the struggle and triumph of conquering nature\'s obstacles.'
        };
        return fallbacks[key] || key;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    setupEventListeners() {
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.renderVideoContent();
            this.renderRelatedVideos();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.videoPageLoader = new VideoPageLoader();
});
