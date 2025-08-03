/**
 * Video Data Adapter - Alex Rodriguez Videographer
 * Adaptador que funciona con API real o datos estáticos como fallback
 * Permite transición suave entre desarrollo y producción
 */

class VideoDataAdapter {
    constructor() {
        this.apiBaseUrl = './api/videos.php';
        this.useAPI = true; // Cambiar a false para usar datos estáticos
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        
        // Detectar automáticamente si la API está disponible
        this.detectAPIAvailability();
    }

    // Detectar si la API está disponible
    async detectAPIAvailability() {
        try {
            const response = await fetch(`${this.apiBaseUrl}?limit=1`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.useAPI = data.success === true;
                console.log('API Status:', this.useAPI ? 'Available' : 'Unavailable');
            } else {
                this.useAPI = false;
                console.log('API not available, using fallback data');
            }
        } catch (error) {
            this.useAPI = false;
            console.log('API detection failed, using fallback data:', error.message);
        }
    }

    // Obtener videos con cache inteligente
    async getVideos(options = {}) {
        const {
            category = 'all',
            page = 1,
            limit = 12,
            featured = null,
            forceRefresh = false
        } = options;

        const cacheKey = `videos_${category}_${page}_${limit}_${featured}`;
        
        // Verificar cache
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            let result;
            
            if (this.useAPI) {
                result = await this.getVideosFromAPI(options);
            } else {
                result = await this.getVideosFromFallback(options);
            }

            // Guardar en cache
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;

        } catch (error) {
            console.error('Error getting videos:', error);
            
            // Si la API falla, intentar con fallback
            if (this.useAPI) {
                console.log('API failed, trying fallback data...');
                this.useAPI = false;
                return await this.getVideosFromFallback(options);
            }
            
            throw error;
        }
    }

    // Obtener videos desde la API
    async getVideosFromAPI(options) {
        const params = new URLSearchParams();
        
        if (options.category && options.category !== 'all') {
            params.append('category', options.category);
        }
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.featured !== null) params.append('featured', options.featured);

        const response = await fetch(`${this.apiBaseUrl}?${params}`);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const apiData = await response.json();
        
        if (!apiData.success) {
            throw new Error(apiData.error || 'API returned error');
        }

        // Transformar datos de API al formato esperado por el frontend
        return {
            videos: apiData.data.map(video => this.transformAPIVideo(video)),
            pagination: apiData.pagination,
            total: apiData.pagination.total,
            hasMore: apiData.pagination.has_next
        };
    }

    // Obtener video específico
    async getVideo(id) {
        const cacheKey = `video_${id}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            let result;
            
            if (this.useAPI) {
                const response = await fetch(`${this.apiBaseUrl}?id=${id}`);
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }

                const apiData = await response.json();
                
                if (!apiData.success) {
                    throw new Error(apiData.error || 'Video not found');
                }

                result = {
                    video: this.transformAPIVideo(apiData.data),
                    related: apiData.related?.map(v => this.transformAPIVideo(v)) || []
                };
            } else {
                // Buscar en datos estáticos
                const fallbackData = await this.getFallbackVideos();
                const video = fallbackData.find(v => v.id == id);
                
                if (!video) {
                    throw new Error('Video not found');
                }

                result = {
                    video: video,
                    related: fallbackData
                        .filter(v => v.id != id && v.category === video.category)
                        .slice(0, 4)
                };
            }

            // Guardar en cache
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;

        } catch (error) {
            console.error('Error getting video:', error);
            throw error;
        }
    }

    // Obtener categorías
    async getCategories() {
        const cacheKey = 'categories';
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            let categories;
            
            if (this.useAPI) {
                const response = await fetch(`${this.apiBaseUrl}?action=categories`);
                const apiData = await response.json();
                
                if (apiData.success) {
                    categories = apiData.data;
                } else {
                    throw new Error('Failed to fetch categories from API');
                }
            } else {
                categories = this.getFallbackCategories();
            }

            this.cache.set(cacheKey, {
                data: categories,
                timestamp: Date.now()
            });

            return categories;

        } catch (error) {
            console.error('Error getting categories:', error);
            return this.getFallbackCategories();
        }
    }

    // Tracking de eventos
    async trackEvent(videoId, eventType, additionalData = {}) {
        if (!this.useAPI) {
            // En modo fallback, solo log local
            console.log('Event tracked (local):', { videoId, eventType, ...additionalData });
            return;
        }

        try {
            await fetch(`${this.apiBaseUrl}?action=track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    video_id: videoId,
                    event_type: eventType,
                    ...additionalData
                })
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    // Transformar video de API al formato del frontend
    transformAPIVideo(apiVideo) {
        return {
            id: apiVideo.id,
            title: apiVideo.title,
            description: apiVideo.description,
            thumbnail: apiVideo.thumbnail_url || apiVideo.thumbnail,
            video: apiVideo.video_url || apiVideo.video_file,
            poster: apiVideo.poster_url || apiVideo.poster,
            category: apiVideo.category,
            featured: apiVideo.featured,
            duration: apiVideo.duration,
            durationFormatted: apiVideo.duration_formatted,
            views: apiVideo.views,
            likes: apiVideo.likes,
            downloads: apiVideo.downloads,
            uploadDate: apiVideo.upload_date,
            tags: apiVideo.tags || [],
            metadata: apiVideo.metadata || {},
            seoTitle: apiVideo.seo_title,
            seoDescription: apiVideo.seo_description
        };
    }

    // Datos de fallback (los actuales del sistema)
    async getVideosFromFallback(options) {
        const allVideos = await this.getFallbackVideos();
        let filteredVideos = allVideos;

        // Filtrar por categoría
        if (options.category && options.category !== 'all') {
            filteredVideos = allVideos.filter(video => video.category === options.category);
        }

        // Filtrar por destacados
        if (options.featured !== null) {
            const isFeatured = options.featured === true || options.featured === 'true';
            filteredVideos = filteredVideos.filter(video => video.featured === isFeatured);
        }

        // Paginación
        const page = options.page || 1;
        const limit = options.limit || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

        return {
            videos: paginatedVideos,
            pagination: {
                current_page: page,
                per_page: limit,
                total: filteredVideos.length,
                total_pages: Math.ceil(filteredVideos.length / limit),
                has_next: endIndex < filteredVideos.length,
                has_prev: page > 1
            },
            total: filteredVideos.length,
            hasMore: endIndex < filteredVideos.length
        };
    }

    // Videos de fallback (importar desde el sistema actual)
    async getFallbackVideos() {
        // Aquí importaremos los videos actuales del sistema
        return [
            {
                id: 1,
                title: "Mountain Escape",
                description: "A cinematic journey through the Rocky Mountains showcasing the serene beauty of nature.",
                thumbnail: "img/tn-01.jpg",
                video: "video/wheat-field.mp4",
                category: "nature",
                featured: true,
                duration: 225,
                durationFormatted: "3:45",
                views: 1250,
                likes: 89,
                downloads: 23,
                uploadDate: "2024-01-15T10:00:00Z",
                tags: ["nature", "mountains", "cinematic", "colorado"],
                metadata: { fps: 24, codec: "h264", bitrate: "8000kbps" }
            },
            {
                id: 2,
                title: "Urban Chronicles",
                description: "Dynamic timelapse capturing the pulse of city life in downtown Denver.",
                thumbnail: "img/tn-02.jpg",
                video: "video/wheat-field.mp4",
                category: "lifestyle",
                featured: true,
                duration: 180,
                durationFormatted: "3:00",
                views: 980,
                likes: 67,
                downloads: 15,
                uploadDate: "2024-01-12T14:30:00Z",
                tags: ["urban", "timelapse", "city", "denver"]
            },
            {
                id: 3,
                title: "Coastal Dreams",
                description: "Romantic wedding film capturing precious moments by the Pacific Coast.",
                thumbnail: "img/tn-03.jpg",
                video: "video/wheat-field.mp4",
                category: "wedding",
                featured: true,
                duration: 300,
                durationFormatted: "5:00",
                views: 2100,
                likes: 156,
                downloads: 45,
                uploadDate: "2024-01-10T16:45:00Z",
                tags: ["wedding", "romance", "coast", "love"]
            },
            {
                id: 4,
                title: "Creative Vision",
                description: "Experimental artistic piece exploring light, shadow, and movement.",
                thumbnail: "img/tn-04.jpg",
                video: "video/wheat-field.mp4",
                category: "creative",
                featured: true,
                duration: 150,
                durationFormatted: "2:30",
                views: 750,
                likes: 92,
                downloads: 18,
                uploadDate: "2024-01-08T11:20:00Z",
                tags: ["creative", "artistic", "experimental", "visual"]
            }
        ];
    }

    // Categorías de fallback
    getFallbackCategories() {
        return [
            { id: 1, name: "Nature & Landscapes", slug: "nature", color: "#22c55e", icon: "fas fa-mountain", video_count: 3 },
            { id: 2, name: "Lifestyle & Events", slug: "lifestyle", color: "#3b82f6", icon: "fas fa-heart", video_count: 2 },
            { id: 3, name: "Corporate & Business", slug: "corporate", color: "#6366f1", icon: "fas fa-building", video_count: 1 },
            { id: 4, name: "Creative & Artistic", slug: "creative", color: "#8b5cf6", icon: "fas fa-palette", video_count: 2 },
            { id: 5, name: "Adventure & Sports", slug: "adventure", color: "#f59e0b", icon: "fas fa-bicycle", video_count: 1 },
            { id: 6, name: "Wedding & Romance", slug: "wedding", color: "#ec4899", icon: "fas fa-rings-wedding", video_count: 4 }
        ];
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    // Obtener estadísticas del cache
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            usingAPI: this.useAPI
        };
    }
}

// Instancia global
window.videoDataAdapter = new VideoDataAdapter();

// Funciones de compatibilidad para el código existente
window.getVideoData = async (options) => {
    return await window.videoDataAdapter.getVideos(options);
};

window.getVideoById = async (id) => {
    const result = await window.videoDataAdapter.getVideo(id);
    return result.video;
};

window.trackVideoEvent = async (videoId, eventType, data) => {
    return await window.videoDataAdapter.trackEvent(videoId, eventType, data);
};

console.log('Video Data Adapter initialized');
