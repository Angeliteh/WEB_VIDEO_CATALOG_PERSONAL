<?php
/**
 * API para manejo de videos - Alex Rodriguez Videographer
 * Endpoints RESTful para obtener, crear, actualizar y eliminar videos
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

class VideoAPI {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    // GET /api/videos.php - Obtener videos
    public function getVideos() {
        try {
            $category = $_GET['category'] ?? 'all';
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = min(50, max(1, intval($_GET['limit'] ?? 12)));
            $featured = $_GET['featured'] ?? null;
            $status = $_GET['status'] ?? 'published';
            
            $offset = ($page - 1) * $limit;
            
            // Construir query base
            $whereConditions = ['status = :status'];
            $params = ['status' => $status];
            
            // Filtro por categoría
            if ($category !== 'all') {
                $whereConditions[] = 'category = :category';
                $params['category'] = $category;
            }
            
            // Filtro por destacados
            if ($featured !== null) {
                $whereConditions[] = 'featured = :featured';
                $params['featured'] = $featured === 'true' ? 1 : 0;
            }
            
            $whereClause = implode(' AND ', $whereConditions);
            
            // Query principal
            $sql = "SELECT 
                        id, title, description, slug, video_file, thumbnail, poster,
                        category, featured, duration, resolution, upload_date,
                        views, likes, downloads, seo_title, seo_description, tags,
                        metadata, sort_order
                    FROM videos 
                    WHERE {$whereClause}
                    ORDER BY 
                        CASE WHEN featured = 1 THEN 0 ELSE 1 END,
                        sort_order ASC,
                        upload_date DESC
                    LIMIT :limit OFFSET :offset";
            
            $params['limit'] = $limit;
            $params['offset'] = $offset;
            
            $videos = $this->db->fetchAll($sql, $params);
            
            // Procesar datos de videos
            foreach ($videos as &$video) {
                $video['tags'] = json_decode($video['tags'] ?? '[]', true);
                $video['metadata'] = json_decode($video['metadata'] ?? '{}', true);
                $video['upload_date'] = date('c', strtotime($video['upload_date']));
                $video['duration_formatted'] = $this->formatDuration($video['duration']);
                
                // URLs completas para archivos
                $video['video_url'] = $this->getFullUrl($video['video_file']);
                $video['thumbnail_url'] = $this->getFullUrl($video['thumbnail']);
                $video['poster_url'] = $this->getFullUrl($video['poster']);
            }
            
            // Contar total para paginación
            $countSql = "SELECT COUNT(*) as total FROM videos WHERE {$whereClause}";
            unset($params['limit'], $params['offset']);
            $totalResult = $this->db->fetchOne($countSql, $params);
            $total = $totalResult['total'];
            
            $response = [
                'success' => true,
                'data' => $videos,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'total_pages' => ceil($total / $limit),
                    'has_next' => $page < ceil($total / $limit),
                    'has_prev' => $page > 1
                ],
                'filters' => [
                    'category' => $category,
                    'featured' => $featured,
                    'status' => $status
                ]
            ];
            
            return $this->sendResponse($response);
            
        } catch (Exception $e) {
            return $this->sendError('Error fetching videos: ' . $e->getMessage(), 500);
        }
    }

    // GET /api/videos.php?id=123 - Obtener video específico
    public function getVideo($id) {
        try {
            $sql = "SELECT 
                        id, title, description, slug, video_file, thumbnail, poster,
                        category, featured, duration, file_size, resolution, 
                        upload_date, last_modified, views, likes, downloads,
                        status, seo_title, seo_description, tags, metadata,
                        sort_order, created_by
                    FROM videos 
                    WHERE id = :id AND status = 'published'";
            
            $video = $this->db->fetchOne($sql, ['id' => $id]);
            
            if (!$video) {
                return $this->sendError('Video not found', 404);
            }
            
            // Procesar datos
            $video['tags'] = json_decode($video['tags'] ?? '[]', true);
            $video['metadata'] = json_decode($video['metadata'] ?? '{}', true);
            $video['upload_date'] = date('c', strtotime($video['upload_date']));
            $video['last_modified'] = date('c', strtotime($video['last_modified']));
            $video['duration_formatted'] = $this->formatDuration($video['duration']);
            $video['file_size_formatted'] = $this->formatFileSize($video['file_size']);
            
            // URLs completas
            $video['video_url'] = $this->getFullUrl($video['video_file']);
            $video['thumbnail_url'] = $this->getFullUrl($video['thumbnail']);
            $video['poster_url'] = $this->getFullUrl($video['poster']);
            
            // Incrementar contador de vistas
            $this->incrementViews($id);
            
            // Obtener videos relacionados
            $relatedVideos = $this->getRelatedVideos($video['category'], $id, 4);
            
            $response = [
                'success' => true,
                'data' => $video,
                'related' => $relatedVideos
            ];
            
            return $this->sendResponse($response);
            
        } catch (Exception $e) {
            return $this->sendError('Error fetching video: ' . $e->getMessage(), 500);
        }
    }

    // GET /api/videos.php?action=categories - Obtener categorías
    public function getCategories() {
        try {
            $sql = "SELECT 
                        c.id, c.name, c.slug, c.description, c.color, c.icon, c.sort_order,
                        COUNT(v.id) as video_count
                    FROM categories c
                    LEFT JOIN videos v ON c.slug = v.category AND v.status = 'published'
                    WHERE c.active = 1
                    GROUP BY c.id
                    ORDER BY c.sort_order ASC, c.name ASC";
            
            $categories = $this->db->fetchAll($sql);
            
            $response = [
                'success' => true,
                'data' => $categories
            ];
            
            return $this->sendResponse($response);
            
        } catch (Exception $e) {
            return $this->sendError('Error fetching categories: ' . $e->getMessage(), 500);
        }
    }

    // POST /api/videos.php?action=track - Tracking de eventos
    public function trackEvent() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $videoId = $input['video_id'] ?? null;
            $eventType = $input['event_type'] ?? null;
            $durationWatched = $input['duration_watched'] ?? 0;
            
            if (!$videoId || !$eventType) {
                return $this->sendError('Missing required fields', 400);
            }
            
            // Obtener información del cliente
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
            $userIP = $this->getRealIpAddr();
            $referrer = $_SERVER['HTTP_REFERER'] ?? '';
            $sessionId = session_id() ?: uniqid();
            
            $sql = "INSERT INTO video_analytics 
                    (video_id, event_type, user_ip, user_agent, referrer, session_id, duration_watched, device_type, browser)
                    VALUES (:video_id, :event_type, :user_ip, :user_agent, :referrer, :session_id, :duration_watched, :device_type, :browser)";
            
            $params = [
                'video_id' => $videoId,
                'event_type' => $eventType,
                'user_ip' => $userIP,
                'user_agent' => $userAgent,
                'referrer' => $referrer,
                'session_id' => $sessionId,
                'duration_watched' => $durationWatched,
                'device_type' => $this->detectDeviceType($userAgent),
                'browser' => $this->detectBrowser($userAgent)
            ];
            
            $this->db->query($sql, $params);
            
            return $this->sendResponse(['success' => true, 'message' => 'Event tracked']);
            
        } catch (Exception $e) {
            return $this->sendError('Error tracking event: ' . $e->getMessage(), 500);
        }
    }

    // Métodos auxiliares
    private function getRelatedVideos($category, $excludeId, $limit = 4) {
        $sql = "SELECT id, title, slug, thumbnail, duration, views
                FROM videos 
                WHERE category = :category AND id != :exclude_id AND status = 'published'
                ORDER BY views DESC, upload_date DESC
                LIMIT :limit";
        
        return $this->db->fetchAll($sql, [
            'category' => $category,
            'exclude_id' => $excludeId,
            'limit' => $limit
        ]);
    }

    private function incrementViews($videoId) {
        $sql = "UPDATE videos SET views = views + 1 WHERE id = :id";
        $this->db->query($sql, ['id' => $videoId]);
    }

    private function formatDuration($seconds) {
        if (!$seconds) return '0:00';
        
        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;
        
        return sprintf('%d:%02d', $minutes, $seconds);
    }

    private function formatFileSize($bytes) {
        if (!$bytes) return '0 B';
        
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    private function getFullUrl($path) {
        if (!$path) return null;
        
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        return $protocol . '://' . $host . '/' . ltrim($path, '/');
    }

    private function getRealIpAddr() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
    }

    private function detectDeviceType($userAgent) {
        if (preg_match('/mobile|android|iphone|ipad/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    private function detectBrowser($userAgent) {
        if (strpos($userAgent, 'Chrome') !== false) return 'Chrome';
        if (strpos($userAgent, 'Firefox') !== false) return 'Firefox';
        if (strpos($userAgent, 'Safari') !== false) return 'Safari';
        if (strpos($userAgent, 'Edge') !== false) return 'Edge';
        return 'Other';
    }

    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    private function sendError($message, $statusCode = 400) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'timestamp' => date('c')
        ], JSON_PRETTY_PRINT);
        exit;
    }
}

// Router principal
try {
    $api = new VideoAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    $id = $_GET['id'] ?? null;

    switch ($method) {
        case 'GET':
            if ($id) {
                $api->getVideo($id);
            } elseif ($action === 'categories') {
                $api->getCategories();
            } else {
                $api->getVideos();
            }
            break;
            
        case 'POST':
            if ($action === 'track') {
                $api->trackEvent();
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}
?>
