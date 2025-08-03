# 🚀 Setup Instructions - Alex Rodriguez Videographer

## 📋 **OVERVIEW**
Esta web está lista para funcionar tanto con datos estáticos (modo demo) como con una base de datos real para videos dinámicos. El sistema detecta automáticamente qué modo usar.

---

## 🎯 **MODO ACTUAL: DEMO/ESTÁTICO**
✅ **Funciona inmediatamente** - No requiere configuración
✅ **Videos de ejemplo** hardcodeados
✅ **Todas las funcionalidades** del frontend funcionan
✅ **Perfecto para mostrar** a clientes potenciales

---

## 🔧 **PARA ACTIVAR MODO DINÁMICO (BASE DE DATOS)**

### **📊 1. CONFIGURAR BASE DE DATOS EN HOSTINGER**

#### **A. Crear Base de Datos:**
1. Ir a **cPanel** → **MySQL Databases**
2. Crear nueva base de datos: `u123456789_alexvideo`
3. Crear usuario: `u123456789_alexuser`
4. Asignar permisos completos al usuario

#### **B. Importar Estructura:**
1. Ir a **phpMyAdmin**
2. Seleccionar la base de datos creada
3. Ir a **Import** → **Choose File**
4. Subir el archivo `database/schema.sql`
5. Click **Go** para ejecutar

### **📁 2. CONFIGURAR ARCHIVOS PHP**

#### **A. Editar config/database.php:**
```php
// Línea 18-24, cambiar por tus datos reales:
'production' => [
    'host' => 'localhost',
    'dbname' => 'u123456789_alexvideo',    // Tu base de datos
    'username' => 'u123456789_alexuser',   // Tu usuario
    'password' => 'TuPasswordSeguro123!',  // Tu password
    'charset' => 'utf8mb4'
]
```

#### **B. Crear Carpetas en el Hosting:**
```bash
# Crear estas carpetas con permisos 755:
/uploads/videos/original/
/uploads/videos/thumbnails/
/logs/
/backups/
```

### **📤 3. SUBIR ARCHIVOS AL HOSTING**

#### **Estructura de archivos a subir:**
```
public_html/
├── (todos los archivos actuales de la web)
├── api/
│   └── videos.php
├── config/
│   └── database.php
├── admin/
│   └── index.html
├── database/
│   └── schema.sql
└── js/
    └── video-data-adapter.js
```

### **🔄 4. ACTIVAR MODO API**

El sistema detecta automáticamente si la API está disponible. Una vez configurada la base de datos:

1. **Verificar API**: Ir a `tudominio.com/api/videos.php`
2. **Debería mostrar**: JSON con videos de ejemplo
3. **El frontend cambiará automáticamente** a usar la API

---

## 🎬 **FUNCIONALIDADES DISPONIBLES**

### **✅ MODO DEMO (ACTUAL):**
- ✅ Galería de videos con datos estáticos
- ✅ Reproductor profesional completo
- ✅ Sistema de compartir avanzado
- ✅ Descarga de videos
- ✅ Modo oscuro y responsive
- ✅ Internacionalización (EN/ES)
- ✅ SEO completo y PWA

### **🚀 MODO DINÁMICO (CON BD):**
- ✅ **Todo lo anterior** +
- ✅ Panel de administración completo
- ✅ Upload de videos reales
- ✅ Gestión de categorías
- ✅ Analytics de reproducciones
- ✅ Sistema de tracking avanzado
- ✅ Backup automático de datos

---

## 🔍 **VERIFICAR INSTALACIÓN**

### **1. Verificar Base de Datos:**
```sql
-- Ejecutar en phpMyAdmin para verificar:
SELECT COUNT(*) as total_videos FROM videos;
SELECT COUNT(*) as total_categories FROM categories;
```

### **2. Verificar API:**
- **URL**: `tudominio.com/api/videos.php`
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### **3. Verificar Admin Panel:**
- **URL**: `tudominio.com/admin/`
- **Debería mostrar**: Panel de administración funcional

---

## 🛠️ **TROUBLESHOOTING**

### **❌ Error: "Database connection failed"**
**Solución:**
1. Verificar datos de conexión en `config/database.php`
2. Verificar que la base de datos existe
3. Verificar permisos del usuario

### **❌ Error: "API not available"**
**Solución:**
1. Verificar que `api/videos.php` existe y es accesible
2. Verificar permisos de archivos (644 para PHP)
3. Verificar logs de error del servidor

### **❌ Videos no se muestran**
**Solución:**
1. El sistema usa fallback automático
2. Verificar consola del navegador para errores
3. Verificar que `js/video-data-adapter.js` está cargado

---

## 📞 **SOPORTE TÉCNICO**

### **Para Implementación Completa:**
1. **Configuración de hosting** (30 min)
2. **Setup de base de datos** (15 min)
3. **Testing completo** (15 min)
4. **Capacitación básica** (30 min)

### **Archivos Críticos:**
- `config/database.php` - Configuración de BD
- `api/videos.php` - API principal
- `js/video-data-adapter.js` - Adaptador inteligente
- `database/schema.sql` - Estructura de BD

---

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

### **Para Cliente Final:**
1. ✅ **Configurar hosting** y base de datos
2. ✅ **Subir videos reales** del cliente
3. ✅ **Personalizar textos** y colores
4. ✅ **Configurar dominio** personalizado
5. ✅ **Setup de analytics** (Google Analytics)

### **Para Venta como Template:**
1. ✅ **Documentación completa** ✓
2. ✅ **Código limpio** y comentado ✓
3. ✅ **Instalación automática** ✓
4. ✅ **Soporte técnico** incluido

---

## 🌟 **CARACTERÍSTICAS ÚNICAS**

### **🎬 Reproductor Profesional:**
- Controles completamente personalizados
- Picture-in-Picture avanzado
- Controles de teclado completos
- UX inteligente (auto-hide)

### **📤 Sistema de Compartir:**
- Modal elegante estilo YouTube
- QR Code automático
- Código embed personalizado
- Redes sociales integradas

### **🔄 Arquitectura Híbrida:**
- Funciona sin base de datos (demo)
- Transición automática a modo dinámico
- Fallback inteligente
- Zero downtime durante setup

### **📱 PWA Completa:**
- Instalable como app
- Funciona offline
- Service worker optimizado
- Manifest completo

---

**🎉 ¡La web está 100% lista para usar en modo demo y 95% lista para producción con base de datos!**
