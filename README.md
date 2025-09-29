# Registro Horario Laboral - Aplicación Web

## 📋 Descripción

Aplicación web moderna para el registro de horario laboral con firma digital, diseñada para cumplir con la legislación española sobre registro de jornada laboral (Ley 8/1980 del Estatuto de los Trabajadores).

## ✨ Características Principales

### 🔒 Seguridad y Autenticación
- **Contraseñas únicas**: Cada trabajador tiene una contraseña única generada automáticamente
- **Validación de identidad**: Verificación de DNI y contraseña antes del registro
- **Restricción horaria**: Solo funciona después de las 18:00 horas
- **Auto-asignación de horario**: Se asigna automáticamente según el trabajador seleccionado

### 📧 Sistema de Notificaciones
- **Envío automático**: PDF enviado a instalaciones@redescarreras.es
- **Modo offline**: Emails guardados y enviados al recuperar conexión
- **Procesamiento automático**: Gestión inteligente de emails pendientes

### 📱 Funcionalidad Multiplataforma
- **Responsive Design**: Adaptado para móviles, tablets y escritorio
- **PWA (Progressive Web App)**: Instalable como aplicación nativa
- **Offline First**: Funciona sin conexión a internet
- **Sincronización**: Los datos se guardan localmente y se pueden sincronizar posteriormente

### ✍️ Firma Digital
- **Canvas HTML5**: Interfaz táctil para firma digital
- **Multi-touch**: Compatible con dispositivos táctiles
- **Validación de firma**: Requiere firma obligatoria para completar el registro

### 📄 Generación de PDFs
- **PDF automático**: Genera PDF con todos los datos del registro
- **Formato legal**: Incluye declaración conforme a la legislación vigente
- **Descarga inmediata**: PDF disponible al momento del registro
- **Diseño profesional**: Logo corporativo y formato estructurado
- **Envío automático**: Enviado por email a instalaciones@redescarreras.es

## 🏢 Horarios Laborales

- **PLANTA EXTERNA**: 08:00 - 14:00 / 15:00 - 17:00 (Mayoría de trabajadores)
- **OFICINA**: 08:00 - 16:00 (Solo Juan Simón de la Fuente y Jhon Alexander Arroyave)

**Nota**: El horario se asigna automáticamente según el trabajador seleccionado.

## 👥 Trabajadores Registrados

| Nombre | DNI | Contraseña |
|--------|-----|------------|
| BORJA CARRERAS MARTIN | 53615032P | BCM-K8L3X |
| DAVID MORENO GOMEZ | 46846909A | DMG-P4N7Q |
| EDGAR ALONSO SANCHEZ SUAREZ | X8723873L | EAS-M9R2T |
| JAVIER CARRERAS MARTIN | 53996573W | JCM-V6Z8B |
| JOSE ANTONIO CARRERAS MARTIN | 06587470V | JAC-H3F5Y |
| JOSE FERNANDO SANCHEZ MARULANDA | Y5482295Y | JFS-L7W1D |
| JUAN CARLOS SANCHEZ MARULANDA | Y7721584S | JCS-N4G9E |
| JUAN PEDRO SUAREZ DELGADO | 06587577D | JPS-C8J2A |
| LUIS MIGUEL HIDALGO EGEA | 01187902K | LMH-S5K6P |
| ANTONIO MANUEL LOPEZ GARCÍA | 05680005V | AML-T9X4R |
| AARON LOPEZ MUÑOZ | 05739933F | ALM-F3Q7U |
| JUAN SIMON DE LA FUENTE | 51471948H | JSF-W2Y8I |
| JHON ALEXANDER ARROYAVE CÁRDENAS | X8335756G | JAA-Z6M1O |

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado

### Instrucciones de Instalación

1. **Servidor Web Local**:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js
   npx serve .
   
   # Usando PHP
   php -S localhost:8000
   ```

2. **Abrir en navegador**:
   - Navegar a `http://localhost:8000`
   - La aplicación se cargará automáticamente

3. **Instalación como PWA**:
   - El navegador mostrará opción de "Instalar aplicación"
   - Una vez instalada, funcionará como app nativa

### Uso de la Aplicación

1. **Restricción de Acceso**:
   - La aplicación solo está disponible después de las 18:00 horas
   - Antes de esta hora se muestra un mensaje de restricción

2. **Proceso de Registro**:
   - Seleccionar nombre del trabajador del desplegable
   - El DNI se completa automáticamente
   - Seleccionar horario laboral correspondiente
   - Introducir contraseña única del trabajador
   - Firmar en el canvas digital
   - Hacer clic en "Firmar y Registrar"

3. **Generación de PDF**:
   - Se genera automáticamente un PDF con todos los datos
   - El PDF incluye la declaración legal requerida
   - Se descarga inmediatamente al dispositivo

## 🔧 Arquitectura Técnica

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con CSS Grid/Flexbox
- **JavaScript ES6+**: Lógica de aplicación moderna
- **Canvas API**: Para firma digital
- **LocalStorage**: Persistencia de datos offline

### Funcionalidades Avanzadas
- **Service Worker**: Caching y funcionamiento offline
- **jsPDF**: Generación de documentos PDF
- **Responsive Design**: CSS Grid y Flexbox
- **Touch Events**: Soporte para dispositivos táctiles

### Bibliotecas Externas
- **jsPDF**: Generación de PDFs
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía (Inter)

## 📁 Estructura de Archivos

```
/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica de la aplicación
├── sw.js              # Service Worker para offline
├── manifest.json      # Configuración PWA
├── logo-redes_Transparente-216x216.png  # Logo corporativo
└── README.md          # Documentación
```

## 🛡️ Seguridad y Compliance

### Cumplimiento Legal
- **Ley 8/1980**: Estatuto de los Trabajadores
- **Normativa de registro de jornada**: RD-ley 8/2019
- **Protección de datos**: Almacenamiento local seguro

### Medidas de Seguridad
- Contraseñas únicas por trabajador
- Validación de identidad antes del registro
- Restricción de acceso por horario
- Datos almacenados solo localmente

## 🌐 Funcionamiento Offline

La aplicación funciona completamente sin conexión a internet:

1. **Caching**: Service Worker cachea todos los recursos necesarios
2. **Almacenamiento Local**: Los registros se guardan en localStorage
3. **Sincronización**: Los datos pueden sincronizarse cuando haya conexión
4. **Indicador de Estado**: Muestra el estado de conexión al usuario

## 🎨 Personalización

### Colores Principales
- **Primario**: #2563eb (Azul)
- **Fondo**: Gradiente azul-morado
- **Superficie**: #ffffff (Blanco)

### Tipografía
- **Font Principal**: Inter (Google Fonts)
- **Fallbacks**: System fonts

## 🔄 Actualizaciones Futuras

### Funcionalidades Planificadas
- [ ] Integración con backend para sincronización
- [ ] Notificaciones push
- [ ] Reportes y estadísticas
- [ ] Exportación a Excel
- [ ] Autenticación biométrica

### Mejoras Técnicas
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Optimización de rendimiento
- [ ] Accesibilidad mejorada

## 📞 Soporte

Para soporte técnico o consultas sobre la aplicación, contactar al administrador del sistema.

---

**© 2025 - Registro Horario Laboral**  
*Desarrollado con ❤️ para cumplir con la legislación laboral española*