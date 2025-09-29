# 🎮 GUÍA RÁPIDA PARA EL DEMO

## ¿Cómo probar la aplicación AHORA?

### 🚀 Acceso Inmediato al Demo

1. **Abrir**: <filepath>demo-index.html</filepath> en tu navegador
2. **Sin restricciones**: Funciona a cualquier hora del día
3. **Datos reales**: Usa los 13 trabajadores configurados

---

## 📝 Pasos para Probar

### 1. Seleccionar Trabajador
- Elige cualquier trabajador del desplegable
- El DNI se completa automáticamente

### 2. Usar Contraseñas de Prueba

| Trabajador | Contraseña |
|------------|------------|
| **BORJA CARRERAS MARTIN** | `BCM-K8L3X` |
| **DAVID MORENO GOMEZ** | `DMG-P4N7Q` |
| **EDGAR ALONSO SANCHEZ SUAREZ** | `EAS-M9R2T` |
| **JAVIER CARRERAS MARTIN** | `JCM-V6Z8B` |

*(Ver archivo CONTRASEÑAS_TRABAJADORES.md para lista completa)*

### 3. Completar el Formulario
- ✅ Seleccionar horario laboral
- ✅ Introducir contraseña correspondiente
- ✅ **IMPORTANTE**: Dibujar firma en el canvas (obligatorio)
- ✅ Hacer clic en "Firmar y Registrar"

### 4. Resultado
- 📄 PDF se descarga automáticamente
- ✅ Mensaje de confirmación
- 💾 Datos guardados localmente

---

## 🔗 Enlaces Directos

- **[demo-index.html](demo-index.html)** → Demo funcional SIN restricción horaria
- **[index.html](index.html)** → Aplicación real (solo después 18:00)
- **[demo.html](demo.html)** → Página de información y características

---

## 💡 Características del Demo

### ✅ Funcionalidad Completa
- Todos los 13 trabajadores configurados
- Contraseñas únicas por trabajador
- Firma digital táctil
- Generación de PDF automática
- Funcionamiento offline

### ⚡ Diferencias del Demo
- **Sin restricción horaria** (disponible 24/7)
- Banner "MODO DEMO" visible
- PDF marcado como "DEMO - NO VÁLIDO LEGALMENTE"
- Datos guardados con prefijo "demo"

---

## 🎯 Casos de Prueba Sugeridos

### Test Básico
1. **Trabajador**: BORJA CARRERAS MARTIN
2. **Contraseña**: BCM-K8L3X
3. **Horario**: PLANTA EXTERNA
4. **Resultado**: PDF descargado exitosamente

### Test de Validación
1. Intentar sin firma → Error esperado
2. Contraseña incorrecta → Error esperado
3. Campos vacíos → Errores esperados

### Test Mobile
1. Abrir en dispositivo móvil
2. Probar firma táctil
3. Verificar diseño responsive

---

## 📱 Instalación como PWA

1. Abrir en Chrome/Edge
2. Menú → "Instalar aplicación"
3. Usar como app nativa
4. Funciona offline completamente

---

**¿Problemas con el demo?** Verifica que todos los archivos estén en la misma carpeta y que tengas conexión inicial para cargar las librerías externas (jsPDF, FontAwesome).

---

## ✨ **NUEVAS FUNCIONALIDADES IMPLEMENTADAS**

### 🎯 **Auto-Selección de Horario**
- Al seleccionar un trabajador, su horario se asigna automáticamente
- **Solo 2 trabajadores tienen horario de OFICINA:**
  - Juan Simón de la Fuente
  - Jhon Alexander Arroyave Cárdenas
- **El resto tienen horario de PLANTA EXTERNA**

### 📧 **Envío Automático por Email**
- **Destinatario**: instalaciones@redescarreras.es
- **Contenido**: PDF adjunto + datos del registro
- **Modo Offline**: Si no hay conexión, se guarda y envía automáticamente cuando la recupere
- **Procesamiento Automático**: Al recuperar conexión, procesa todos los emails pendientes

### 🎨 **PDF Mejorado**
- **Logo corporativo** incluido en el PDF
- **Diseño profesional** con colores corporativos
- **Formato estructurado** con secciones claramente definidas
- **Información completa** del trabajador y registro