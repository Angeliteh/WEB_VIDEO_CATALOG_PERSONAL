<?php
/**
 * Database Configuration for Alex Rodriguez Videographer
 * Configuración de base de datos con manejo de errores y múltiples entornos
 */

// Configuración por entorno
$environment = $_SERVER['SERVER_NAME'] ?? 'localhost';

// Configuraciones por entorno
$config = [
    'localhost' => [
        'host' => 'localhost',
        'dbname' => 'alex_videographer_local',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4'
    ],
    'staging' => [
        'host' => 'localhost',
        'dbname' => 'alex_videographer_staging',
        'username' => 'staging_user',
        'password' => 'staging_password',
        'charset' => 'utf8mb4'
    ],
    'production' => [
        'host' => 'localhost', // Hostinger suele usar localhost
        'dbname' => 'u123456789_alexvideo', // Formato típico de Hostinger
        'username' => 'u123456789_alexuser',
        'password' => 'SecurePassword123!',
        'charset' => 'utf8mb4'
    ]
];

// Detectar entorno automáticamente
if (strpos($environment, 'localhost') !== false || strpos($environment, '127.0.0.1') !== false) {
    $currentConfig = $config['localhost'];
} elseif (strpos($environment, 'staging') !== false || strpos($environment, 'dev') !== false) {
    $currentConfig = $config['staging'];
} else {
    $currentConfig = $config['production'];
}

// Clase Database con singleton pattern
class Database {
    private static $instance = null;
    private $connection;
    private $config;

    private function __construct($config) {
        $this->config = $config;
        $this->connect();
    }

    public static function getInstance($config = null) {
        if (self::$instance === null) {
            global $currentConfig;
            self::$instance = new Database($config ?? $currentConfig);
        }
        return self::$instance;
    }

    private function connect() {
        try {
            $dsn = "mysql:host={$this->config['host']};dbname={$this->config['dbname']};charset={$this->config['charset']}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->config['charset']} COLLATE utf8mb4_unicode_ci"
            ];

            $this->connection = new PDO($dsn, $this->config['username'], $this->config['password'], $options);
            
            // Log successful connection (solo en desarrollo)
            if ($this->config === $GLOBALS['config']['localhost']) {
                error_log("Database connected successfully to: " . $this->config['dbname']);
            }
            
        } catch (PDOException $e) {
            // Log error securely
            error_log("Database connection failed: " . $e->getMessage());
            
            // En producción, mostrar mensaje genérico
            if ($this->config !== $GLOBALS['config']['localhost']) {
                die("Database connection failed. Please try again later.");
            } else {
                die("Database connection failed: " . $e->getMessage());
            }
        }
    }

    public function getConnection() {
        return $this->connection;
    }

    // Método para ejecutar queries con manejo de errores
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query failed: " . $e->getMessage() . " | SQL: " . $sql);
            throw new Exception("Database query failed");
        }
    }

    // Método para obtener un solo registro
    public function fetchOne($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }

    // Método para obtener múltiples registros
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    // Método para insertar y obtener el ID
    public function insert($sql, $params = []) {
        $this->query($sql, $params);
        return $this->connection->lastInsertId();
    }

    // Método para contar registros
    public function count($table, $where = '', $params = []) {
        $sql = "SELECT COUNT(*) as total FROM {$table}";
        if ($where) {
            $sql .= " WHERE {$where}";
        }
        $result = $this->fetchOne($sql, $params);
        return $result['total'] ?? 0;
    }

    // Método para verificar si la tabla existe
    public function tableExists($tableName) {
        $sql = "SHOW TABLES LIKE ?";
        $result = $this->fetchOne($sql, [$tableName]);
        return !empty($result);
    }

    // Método para crear las tablas si no existen
    public function initializeDatabase() {
        $schemaFile = __DIR__ . '/../database/schema.sql';
        
        if (!file_exists($schemaFile)) {
            throw new Exception("Schema file not found: {$schemaFile}");
        }

        $schema = file_get_contents($schemaFile);
        $statements = explode(';', $schema);

        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (!empty($statement)) {
                try {
                    $this->connection->exec($statement);
                } catch (PDOException $e) {
                    // Ignorar errores de "tabla ya existe"
                    if (strpos($e->getMessage(), 'already exists') === false) {
                        error_log("Schema execution error: " . $e->getMessage());
                    }
                }
            }
        }
    }

    // Método para backup de la base de datos
    public function backup($filename = null) {
        if (!$filename) {
            $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        }

        $backupDir = __DIR__ . '/../backups/';
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        // Aquí iría la lógica de backup usando mysqldump
        // Por simplicidad, solo creamos el archivo
        $backupPath = $backupDir . $filename;
        
        // En un entorno real, ejecutarías mysqldump aquí
        $command = "mysqldump -h{$this->config['host']} -u{$this->config['username']} -p{$this->config['password']} {$this->config['dbname']} > {$backupPath}";
        
        return $backupPath;
    }
}

// Función helper para obtener la conexión
function getDB() {
    global $currentConfig;
    return Database::getInstance($currentConfig);
}

// Función helper para logging
function logError($message, $context = []) {
    $logMessage = date('Y-m-d H:i:s') . " - " . $message;
    if (!empty($context)) {
        $logMessage .= " | Context: " . json_encode($context);
    }
    error_log($logMessage);
}

// Inicializar conexión global
try {
    $db = Database::getInstance($currentConfig);
    
    // Verificar si las tablas existen, si no, crearlas
    if (!$db->tableExists('videos')) {
        $db->initializeDatabase();
    }
    
} catch (Exception $e) {
    logError("Failed to initialize database: " . $e->getMessage());
    
    // En producción, redirigir a página de mantenimiento
    if (strpos($_SERVER['SERVER_NAME'] ?? '', 'localhost') === false) {
        header('Location: /maintenance.html');
        exit;
    }
}

// Configuración adicional
ini_set('display_errors', $currentConfig === $config['localhost'] ? 1 : 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

?>
