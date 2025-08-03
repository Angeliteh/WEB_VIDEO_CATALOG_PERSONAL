-- Base de datos para Alex Rodriguez Videographer
-- Estructura completa para manejo de videos profesional

-- Tabla principal de videos
CREATE TABLE videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    video_file VARCHAR(500), -- ruta del archivo de video
    thumbnail VARCHAR(500), -- ruta de la miniatura
    poster VARCHAR(500), -- imagen de portada
    category VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    duration INT, -- duración en segundos
    file_size BIGINT, -- tamaño del archivo en bytes
    resolution VARCHAR(20), -- 1080p, 4K, etc.
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    downloads INT DEFAULT 0,
    status ENUM('draft', 'published', 'private') DEFAULT 'draft',
    seo_title VARCHAR(255),
    seo_description TEXT,
    tags JSON, -- etiquetas del video
    metadata JSON, -- información técnica (fps, codec, etc.)
    sort_order INT DEFAULT 0,
    created_by VARCHAR(100) DEFAULT 'admin',
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_upload_date (upload_date)
);

-- Tabla de categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#667eea', -- color hex para la UI
    icon VARCHAR(50) DEFAULT 'fas fa-video', -- icono FontAwesome
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de analytics de videos
CREATE TABLE video_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video_id INT,
    event_type ENUM('view', 'play', 'pause', 'complete', 'share', 'download', 'like') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id VARCHAR(100),
    duration_watched INT, -- segundos reproducidos
    device_type ENUM('desktop', 'tablet', 'mobile') DEFAULT 'desktop',
    browser VARCHAR(50),
    country VARCHAR(2), -- código de país
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    INDEX idx_video_id (video_id),
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (timestamp)
);

-- Tabla de configuración del sitio
CREATE TABLE site_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de contactos/leads
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    project_type VARCHAR(100), -- wedding, corporate, etc.
    budget_range VARCHAR(50),
    event_date DATE,
    status ENUM('new', 'contacted', 'quoted', 'booked', 'completed') DEFAULT 'new',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
);

-- Insertar categorías por defecto
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('Nature & Landscapes', 'nature', 'Beautiful nature and landscape cinematography', '#22c55e', 'fas fa-mountain', 1),
('Lifestyle & Events', 'lifestyle', 'Lifestyle content and special events', '#3b82f6', 'fas fa-heart', 2),
('Corporate & Business', 'corporate', 'Professional corporate and business videos', '#6366f1', 'fas fa-building', 3),
('Creative & Artistic', 'creative', 'Creative and artistic video projects', '#8b5cf6', 'fas fa-palette', 4),
('Adventure & Sports', 'adventure', 'Adventure and extreme sports footage', '#f59e0b', 'fas fa-bicycle', 5),
('Wedding & Romance', 'wedding', 'Wedding films and romantic stories', '#ec4899', 'fas fa-rings-wedding', 6);

-- Insertar configuración básica del sitio
INSERT INTO site_config (config_key, config_value, description) VALUES
('site_title', 'Alex Rodriguez - Professional Videographer', 'Título principal del sitio'),
('site_description', 'Professional videographer specializing in wedding films, corporate videos, and creative storytelling in Colorado.', 'Descripción del sitio para SEO'),
('contact_email', 'alex@alexrodriguez-videographer.com', 'Email de contacto principal'),
('contact_phone', '+1 (555) 123-4567', 'Teléfono de contacto'),
('social_instagram', '@alexrodriguezfilm', 'Usuario de Instagram'),
('social_youtube', 'AlexRodriguezVideographer', 'Canal de YouTube'),
('max_upload_size', '500', 'Tamaño máximo de upload en MB'),
('videos_per_page', '12', 'Videos por página en la galería'),
('featured_videos_count', '4', 'Número de videos destacados en home'),
('analytics_enabled', 'true', 'Habilitar tracking de analytics'),
('maintenance_mode', 'false', 'Modo mantenimiento del sitio');

-- Insertar videos de ejemplo (para testing)
INSERT INTO videos (title, description, slug, video_file, thumbnail, category, featured, duration, resolution, status, seo_title, seo_description, tags, metadata) VALUES
('Mountain Escape', 'A cinematic journey through the Rocky Mountains showcasing the serene beauty of nature.', 'mountain-escape', 'videos/mountain-escape.mp4', 'img/tn-01.jpg', 'nature', TRUE, 225, '1080p', 'published', 'Mountain Escape - Cinematic Nature Film | Alex Rodriguez', 'Professional nature cinematography capturing the breathtaking beauty of the Rocky Mountains.', '["nature", "mountains", "cinematic", "colorado"]', '{"fps": 24, "codec": "h264", "bitrate": "8000kbps"}'),

('Urban Chronicles', 'Dynamic timelapse capturing the pulse of city life in downtown Denver.', 'urban-chronicles', 'videos/urban-chronicles.mp4', 'img/tn-02.jpg', 'lifestyle', TRUE, 180, '4K', 'published', 'Urban Chronicles - City Life Timelapse | Alex Rodriguez', 'Professional urban timelapse showcasing the energy and rhythm of city life.', '["urban", "timelapse", "city", "denver"]', '{"fps": 30, "codec": "h265", "bitrate": "12000kbps"}'),

('Coastal Dreams', 'Romantic wedding film capturing precious moments by the Pacific Coast.', 'coastal-dreams', 'videos/coastal-dreams.mp4', 'img/tn-03.jpg', 'wedding', TRUE, 300, '1080p', 'published', 'Coastal Dreams - Wedding Film | Alex Rodriguez', 'Beautiful wedding cinematography capturing love stories by the ocean.', '["wedding", "romance", "coast", "love"]', '{"fps": 24, "codec": "h264", "bitrate": "10000kbps"}'),

('Creative Vision', 'Experimental artistic piece exploring light, shadow, and movement.', 'creative-vision', 'videos/creative-vision.mp4', 'img/tn-04.jpg', 'creative', TRUE, 150, '1080p', 'published', 'Creative Vision - Artistic Film | Alex Rodriguez', 'Experimental cinematography exploring artistic expression through visual storytelling.', '["creative", "artistic", "experimental", "visual"]', '{"fps": 24, "codec": "h264", "bitrate": "8000kbps"}');
