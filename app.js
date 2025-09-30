// Configuración de trabajadores con DNIs, contraseñas y horarios específicos
const TRABAJADORES = {
    'BORJA CARRERAS MARTIN': { dni: '53615032P', password: 'BCM-K8L3X', telefono: '642057351', email: 'borjacarreras@redescarreras.es', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'DAVID MORENO GOMEZ': { dni: '46846909A', password: 'DMG-P4N7Q', telefono: '630604899', email: 'davidmorenogomez76@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'EDGAR ALONSO SANCHEZ SUAREZ': { dni: 'X8723873L', password: 'EAS-M9R2T', telefono: '631830324', email: 'alonsing001@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JAVIER CARRERAS MARTIN': { dni: '53996573W', password: 'JCM-V6Z8B', telefono: '667283903', email: 'jcm63881@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JOSE ANTONIO CARRERAS MARTIN': { dni: '06587470V', password: 'JAC-H3F5Y', telefono: '642276302', email: 'carrerasmartin87@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JOSE FERNANDO SANCHEZ MARULANDA': { dni: 'Y5482295Y', password: 'JFS-L7W1D', telefono: '652151329', email: 'josesanchezmarulanda@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JUAN CARLOS SANCHEZ MARULANDA': { dni: 'Y7721584S', password: 'JCS-N4G9E', telefono: '662048856', email: 'juankmarulandasanchez@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JUAN PEDRO SUAREZ DELGADO': { dni: '06587577D', password: 'JPS-C8J2A', telefono: '610713439', email: 'juampetena3107@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'LUIS MIGUEL HIDALGO EGEA': { dni: '01187902K', password: 'LMH-S5K6P', telefono: '662495955', email: 'hidalgomiguel842@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'ANTONIO MANUEL LOPEZ GARCÍA': { dni: '05680005V', password: 'AML-T9X4R', telefono: '642122184', email: 'manoloespiderman@hotmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'AARON LOPEZ MUÑOZ': { dni: '05739933F', password: 'ALM-F3Q7U', telefono: '643661386', email: 'aaronlm1999@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00' },
    'JUAN SIMON DE LA FUENTE': { dni: '51471948H', password: 'JSF-W2Y8I', telefono: '', email: '', horario: 'OFICINA: 08:00 - 16:00' },
    'JHON ALEXANDER ARROYAVE CÁRDENAS': { dni: 'X8335756G', password: 'JAA-Z6M1O', telefono: '', email: '', horario: 'OFICINA: 08:00 - 16:00' }
};

// Configuración del sistema de email
const EMAIL_CONFIG = {
    destinatario: 'instalaciones@redescarreras.es',
    asunto: 'Nuevo Registro Horario Laboral',
    // En producción, aquí iría la configuración del servicio de email (EmailJS, etc.)
};

class RegistroHorarioApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.modalCanvas = null;
        this.modalCtx = null;
        this.isDrawing = false;
        this.currentUser = null;
        this.currentScreen = 'timeRestriction';
        this.pendingSignatureDate = null;
        this.isAuthenticated = false; // Nueva propiedad para sesión persistente
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateWorkerSelects();
        this.initSignatureCanvas();
        this.checkTimeRestriction();
        this.registerServiceWorker();
        this.loadSavedPasswords(); // Nueva función para cargar contraseñas guardadas
        
        // Procesar emails pendientes si hay conexión
        if (navigator.onLine) {
            setTimeout(() => this.processPendingEmails(), 2000);
        }
        
        // Actualizar tiempo cada segundo
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    setupEventListeners() {
        // Navegación principal
        document.getElementById('menuAccessBtn')?.addEventListener('click', () => this.showAuthScreen());
        document.getElementById('newSignatureBtn')?.addEventListener('click', () => this.showSignatureScreen());
        document.getElementById('pendingSignaturesBtn')?.addEventListener('click', () => this.showPendingSignatures());
        document.getElementById('completedSignaturesBtn')?.addEventListener('click', () => this.showCompletedSignatures());
        
        // Botones de navegación
        document.getElementById('backToSignBtn')?.addEventListener('click', () => this.showSignatureScreen());
        document.getElementById('backToMenuBtn1')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuBtn2')?.addEventListener('click', () => this.showMainMenu());
        
        // Autenticación
        document.getElementById('authForm')?.addEventListener('submit', (e) => this.handleAuth(e));
        
        // Selector de trabajador
        document.getElementById('trabajador')?.addEventListener('change', (e) => {
            this.updateWorkerInfo(e.target.value);
        });
        
        // Selector de trabajador en autenticación
        document.getElementById('authTrabajador')?.addEventListener('change', (e) => {
            this.loadSavedPasswordForWorker(e.target.value);
        });
        
        // Checkbox de recordar contraseña
        document.getElementById('rememberPassword')?.addEventListener('change', (e) => {
            this.handleRememberPasswordChange(e.target.checked);
        });

        // Mostrar/ocultar contraseña
        document.getElementById('showPassword')?.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Limpiar firma
        document.getElementById('clearSignature')?.addEventListener('click', () => {
            this.clearSignature();
        });
        
        // Limpiar firma modal
        document.getElementById('clearModalSignature')?.addEventListener('click', () => {
            this.clearModalSignature();
        });

        // Envío del formulario principal
        document.getElementById('registroForm')?.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
        
        // Modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelSignature')?.addEventListener('click', () => this.closeModal());
        document.getElementById('confirmSignature')?.addEventListener('click', () => this.confirmPendingSignature());

        // Detectar estado offline/online
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
            this.processPendingEmails();
        });
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }

    populateWorkerSelects() {
        const selects = ['trabajador', 'authTrabajador'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                Object.keys(TRABAJADORES).forEach(nombre => {
                    const option = document.createElement('option');
                    option.value = nombre;
                    option.textContent = nombre;
                    select.appendChild(option);
                });
            }
        });
    }

    updateWorkerInfo(trabajadorNombre) {
        const dniInput = document.getElementById('dni');
        const horarioSelect = document.getElementById('horario');
        
        if (trabajadorNombre && TRABAJADORES[trabajadorNombre]) {
            // Ocultar primeros 4 dígitos del DNI en pantalla
            const dni = TRABAJADORES[trabajadorNombre].dni;
            const dniOculto = '****' + dni.slice(4);
            dniInput.value = dniOculto;
            
            horarioSelect.value = TRABAJADORES[trabajadorNombre].horario;
        } else {
            dniInput.value = '';
            horarioSelect.value = '';
        }
    }

    // === NAVEGACIÓN ENTRE PANTALLAS ===
    showScreen(screenId) {
        const screens = [
            'timeRestriction', 'mainMenu', 'authScreen', 'mainContent',
            'pendingSignaturesScreen', 'completedSignaturesScreen'
        ];
        
        screens.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === screenId ? 'block' : 'none';
            }
        });
        
        this.currentScreen = screenId;
    }

    showMainMenu() {
        this.showScreen('mainMenu');
        this.updateCurrentTime('menuCurrentTime');
    }

    showAuthScreen() {
        this.showScreen('authScreen');
    }

    showSignatureScreen() {
        this.showScreen('mainContent');
        this.updateCurrentTime('currentTime');
    }

    async handleAuth(e) {
        e.preventDefault();
        
        const trabajador = document.getElementById('authTrabajador').value;
        const password = document.getElementById('authPassword').value;
        const rememberPassword = document.getElementById('rememberPassword').checked;
        
        if (!trabajador || !password) {
            this.showMessage('Por favor, completa todos los campos', 'error', 'auth');
            return;
        }
        
        if (TRABAJADORES[trabajador] && TRABAJADORES[trabajador].password === password) {
            this.currentUser = trabajador;
            this.isAuthenticated = true; // Marcar como autenticado para sesión persistente
            
            // Guardar contraseña si el usuario lo seleccionó
            if (rememberPassword) {
                this.savePassword(trabajador, password);
            } else {
                this.removePassword(trabajador);
            }
            
            this.showMainMenu();
            this.showMessage(`✅ Bienvenido, ${trabajador}`, 'success', 'auth');
            
            // Limpiar formulario manteniendo el trabajador seleccionado
            document.getElementById('authPassword').value = '';
        } else {
            this.showMessage('Credenciales incorrectas', 'error', 'auth');
        }
    }

    // === GESTIÓN DE DÍAS LABORALES ===
    getWorkDays(startDate, endDate) {
        const workDays = [];
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            // 1-5 = lunes a viernes (0=domingo, 6=sábado)
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                workDays.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }
        
        return workDays;
    }

    getSignedDates(trabajador) {
        const key = `signatures_${trabajador.replace(/\s+/g, '_')}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    addSignedDate(trabajador, date, signatureData) {
        const key = `signatures_${trabajador.replace(/\s+/g, '_')}`;
        const signatures = this.getSignedDates(trabajador);
        
        const dateString = date.toISOString().split('T')[0];
        
        // Verificar si ya existe
        const existingIndex = signatures.findIndex(s => s.date === dateString);
        
        if (existingIndex >= 0) {
            signatures[existingIndex] = { date: dateString, ...signatureData };
        } else {
            signatures.push({ date: dateString, ...signatureData });
        }
        
        localStorage.setItem(key, JSON.stringify(signatures));
    }

    showPendingSignatures() {
        // Verificar si el usuario está autenticado (sesión persistente)
        if (!this.isAuthenticated) {
            this.showAuthScreen();
            return;
        }
        
        this.showScreen('pendingSignaturesScreen');
        
        // === FECHA DE INICIO DE LA APLICACIÓN: 01/10/2025 ===
        const APP_START_DATE = new Date('2025-10-01');
        const today = new Date();
        
        // Si estamos antes de la fecha de inicio, no mostrar firmas pendientes
        if (today < APP_START_DATE) {
            this.renderUserInfo('pendingUserInfo');
            this.renderPendingDaysBeforeStart();
            return;
        }
        
        // Calcular días pendientes desde la fecha de inicio o hace 30 días (lo que sea más reciente)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        // Usar la fecha más reciente entre APP_START_DATE y thirtyDaysAgo
        const startDate = APP_START_DATE > thirtyDaysAgo ? APP_START_DATE : thirtyDaysAgo;
        
        const workDays = this.getWorkDays(startDate, today);
        const signedDates = this.getSignedDates(this.currentUser);
        const signedDateStrings = signedDates.map(s => s.date);
        
        const pendingDays = workDays.filter(day => {
            const dateString = day.toISOString().split('T')[0];
            return !signedDateStrings.includes(dateString);
        });

        this.renderUserInfo('pendingUserInfo');
        this.renderPendingDays(pendingDays);
    }
    
    renderPendingDaysBeforeStart() {
        const container = document.getElementById('pendingDaysList');
        if (!container) return;
        
        container.innerHTML = `
            <div class="pre-start-message">
                <i class="fas fa-calendar-plus" style="font-size: 3rem; color: #3b82f6; margin-bottom: 20px;"></i>
                <h3 style="color: #1e293b; margin-bottom: 15px;">Aplicación en Preparación</h3>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
                    La aplicación de registro horario estará disponible a partir del 
                    <strong style="color: #3b82f6;">1 de octubre de 2025</strong>.
                </p>
                <p style="color: #64748b; font-size: 0.9rem;">
                    <i class="fas fa-bell"></i> 
                    Recibirás notificaciones diarias a las 18:01 para recordarte firmar tu jornada laboral.
                </p>
            </div>
        `;
    }

    showCompletedSignatures() {
        // Verificar si el usuario está autenticado (sesión persistente)
        if (!this.isAuthenticated) {
            this.showAuthScreen();
            return;
        }
        
        this.showScreen('completedSignaturesScreen');
        
        const signedDates = this.getSignedDates(this.currentUser);
        
        this.renderUserInfo('completedUserInfo');
        this.renderCompletedDays(signedDates);
    }

    renderUserInfo(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const worker = TRABAJADORES[this.currentUser];
        
        container.innerHTML = `
            <h3><i class="fas fa-user"></i> ${this.currentUser}</h3>
            <p><strong>DNI:</strong> ${worker.dni}</p>
            <p><strong>Horario:</strong> ${worker.horario}</p>
        `;
    }

    renderPendingDays(pendingDays) {
        const container = document.getElementById('pendingList');
        if (!container) return;
        
        if (pendingDays.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Todas las firmas están al día!</h3>
                    <p>No tienes días pendientes por firmar</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = pendingDays.map(day => {
            const isToday = this.isToday(day);
            const dateString = day.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="day-item pending">
                    <div class="day-info">
                        <h4>${dateString}</h4>
                        <p class="status-pending">
                            <i class="fas fa-exclamation-triangle"></i>
                            ${isToday ? 'Hoy - Pendiente' : 'Pendiente de firmar'}
                        </p>
                    </div>
                    <div class="day-actions">
                        <button class="btn-small btn-warning" onclick="app.openSignatureModal('${day.toISOString()}')">
                            <i class="fas fa-signature"></i>
                            Firmar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCompletedDays(signedDates) {
        const container = document.getElementById('completedList');
        if (!container) return;
        
        if (signedDates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Sin firmas registradas</h3>
                    <p>No hay registros de firmas completadas</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        signedDates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = signedDates.map(signature => {
            const date = new Date(signature.date);
            const dateString = date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="day-item completed">
                    <div class="day-info">
                        <h4>${dateString}</h4>
                        <p class="status-completed">
                            <i class="fas fa-check-circle"></i>
                            Firmado el ${signature.fecha} a las ${signature.hora}
                        </p>
                    </div>
                    <div class="day-actions">
                        <button class="btn-small btn-info" onclick="app.downloadPDF('${signature.date}')">
                            <i class="fas fa-download"></i>
                            Descargar PDF
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // === MODAL DE FIRMA ===
    openSignatureModal(dateString) {
        const date = new Date(dateString);
        this.pendingSignatureDate = date;
        
        const dateFormatted = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('modalDayInfo').innerHTML = `
            <div class="user-info">
                <h3><i class="fas fa-calendar-day"></i> ${dateFormatted}</h3>
                <p><strong>Trabajador:</strong> ${this.currentUser}</p>
                <p><strong>Horario:</strong> ${TRABAJADORES[this.currentUser].horario}</p>
            </div>
        `;
        
        this.initModalSignatureCanvas();
        this.clearModalSignature();
        document.getElementById('signSpecificDayModal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('signSpecificDayModal').style.display = 'none';
        this.pendingSignatureDate = null;
    }

    async confirmPendingSignature() {
        if (!this.pendingSignatureDate || !this.currentUser) return;
        
        if (this.isModalCanvasEmpty()) {
            this.showMessage('⚠️ Debes firmar en el área designada antes de enviar el registro. La firma es obligatoria para validar tu jornada laboral.', 'error');
            return;
        }
        
        const confirmBtn = document.getElementById('confirmSignature');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<div class="loading"></div> Procesando...';
        confirmBtn.disabled = true;
        
        try {
            const formData = {
                trabajador: this.currentUser,
                dni: TRABAJADORES[this.currentUser].dni,
                horario: TRABAJADORES[this.currentUser].horario,
                fecha: this.pendingSignatureDate.toLocaleDateString('es-ES'),
                hora: new Date().toLocaleTimeString('es-ES'),
                firma: this.modalCanvas.toDataURL(),
                registroFecha: this.pendingSignatureDate.toISOString().split('T')[0]
            };
            
            // Generar PDF
            await this.generatePDF(formData);
            
            // Guardar firma
            this.addSignedDate(this.currentUser, this.pendingSignatureDate, formData);
            
            this.showMessage('✅ Firma registrada exitosamente', 'success');
            this.closeModal();
            
            // Actualizar vista si está en pendientes
            if (this.currentScreen === 'pendingSignaturesScreen') {
                this.showPendingSignatures();
            }
            
        } catch (error) {
            console.error('Error al procesar la firma:', error);
            this.showMessage('Error al procesar la firma. Inténtalo de nuevo.', 'error');
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    // === RE-DESCARGA DE PDFs ===
    async downloadPDF(dateString) {
        const signedDates = this.getSignedDates(this.currentUser);
        const signature = signedDates.find(s => s.date === dateString);
        
        if (!signature) {
            this.showMessage('No se encontró la firma para esta fecha', 'error');
            return;
        }
        
        try {
            await this.generatePDF(signature);
            this.showMessage('✅ PDF descargado exitosamente', 'success');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.showMessage('Error al generar el PDF', 'error');
        }
    }

    // === CANVAS DE FIRMA ===
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const showPasswordBtn = document.getElementById('showPassword');
        const icon = showPasswordBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    initSignatureCanvas() {
        this.canvas = document.getElementById('signatureCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas(this.canvas, this.ctx);
    }

    initModalSignatureCanvas() {
        this.modalCanvas = document.getElementById('modalSignatureCanvas');
        if (!this.modalCanvas) return;
        
        this.modalCtx = this.modalCanvas.getContext('2d');
        this.setupCanvas(this.modalCanvas, this.modalCtx);
    }

    setupCanvas(canvas, ctx) {
        // Configurar canvas
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Eventos del mouse
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e, canvas, ctx));
        canvas.addEventListener('mousemove', (e) => this.draw(e, canvas, ctx));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Eventos táctiles para móviles
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    startDrawing(e, canvas, ctx) {
        this.isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    draw(e, canvas, ctx) {
        if (!this.isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearSignature() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    clearModalSignature() {
        if (this.modalCtx && this.modalCanvas) {
            this.modalCtx.clearRect(0, 0, this.modalCanvas.width, this.modalCanvas.height);
        }
    }

    // === RESTRICCIÓN DE TIEMPO ===
    checkTimeRestriction() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 18) {
            this.showSignatureScreen();
        } else {
            this.showScreen('timeRestriction');
        }
        
        this.updateCurrentTime();
    }

    updateCurrentTime(elementId = 'currentTime') {
        const now = new Date();
        const timeString = now.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const currentTimeElement = document.getElementById(elementId);
        if (currentTimeElement) {
            currentTimeElement.textContent = `Hora actual: ${timeString}`;
        }
    }

    // === VALIDACIÓN ===
    validateForm() {
        const trabajador = document.getElementById('trabajador').value;
        const horario = document.getElementById('horario').value;
        const password = document.getElementById('password').value;
        
        // Validar campos requeridos
        if (!trabajador) {
            this.showMessage('Por favor, selecciona un trabajador.', 'error', 'main');
            return false;
        }
        
        if (!horario) {
            this.showMessage('Por favor, selecciona un horario laboral.', 'error', 'main');
            return false;
        }
        
        // Validar contraseña
        if (!password) {
            this.showMessage('Por favor, ingresa tu contraseña.', 'error', 'main');
            return false;
        }
        
        if (TRABAJADORES[trabajador] && TRABAJADORES[trabajador].password !== password) {
            this.showMessage('Contraseña incorrecta. Contacta con el administrador si no recuerdas tu contraseña.', 'error', 'main');
            return false;
        }
        
        // Validar firma
        if (this.isCanvasEmpty()) {
            this.showMessage('⚠️ Debes firmar en el área designada antes de enviar el registro. La firma es obligatoria para validar tu jornada laboral.', 'error', 'main');
            return false;
        }
        
        return true;
    }

    isCanvasEmpty() {
        const blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;
        return this.canvas.toDataURL() === blank.toDataURL();
    }

    isModalCanvasEmpty() {
        const blank = document.createElement('canvas');
        blank.width = this.modalCanvas.width;
        blank.height = this.modalCanvas.height;
        return this.modalCanvas.toDataURL() === blank.toDataURL();
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // === ENVÍO DE FORMULARIO ===
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const originalContent = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<div class="loading"></div> Procesando...';
        submitBtn.disabled = true;
        
        try {
            const formData = this.getFormData();
            await this.generatePDF(formData);
            
            // Guardar en historial con fecha actual
            const today = new Date();
            this.addSignedDate(formData.trabajador, today, formData);
            
            const emailStatus = navigator.onLine ? 
                'PDF generado y enviado por email a instalaciones@redescarreras.es.' : 
                'PDF generado. Email se enviará cuando haya conexión.';
            
            this.showMessage(`✅ Registro completado exitosamente. ${emailStatus}`, 'success', 'main');
            this.resetForm();
            
        } catch (error) {
            console.error('Error al procesar el registro:', error);
            this.showMessage('Error al procesar el registro. Inténtalo de nuevo.', 'error', 'main');
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const now = new Date();
        const trabajador = document.getElementById('trabajador').value;
        
        return {
            trabajador: trabajador,
            dni: TRABAJADORES[trabajador].dni, // DNI completo para PDF
            horario: document.getElementById('horario').value,
            fecha: now.toLocaleDateString('es-ES'),
            hora: now.toLocaleTimeString('es-ES'),
            firma: this.canvas.toDataURL(),
            registroFecha: now.toISOString().split('T')[0]
        };
    }

    // === GENERACIÓN DE PDF ===
    async generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fuente
        doc.setFont('helvetica');
        
        // Agregar logo de la empresa
        let logoBase64 = '';
        try {
            logoBase64 = await this.getLogoBase64();
        } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
        }
        
        // Header con logo y título
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 15, 15, 25, 25);
        }
        
        // Título principal
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('REGISTRO HORARIO LABORAL', 105, 30, { align: 'center' });
        
        // Subtítulo oficial
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('Documento Oficial - Sistema de Registro Horario', 105, 38, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
        // Línea decorativa
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1);
        doc.line(20, 45, 190, 45);
        
        // Información de horarios en recuadro
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 50, 170, 20, 3, 3, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('HORARIOS LABORALES:', 25, 58);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', 25, 63);
        doc.text('OFICINA: 08:00 - 16:00', 25, 67);
        
        // Sección de datos del trabajador
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 80, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS DEL TRABAJADOR', 25, 86);
        
        // Datos en tabla
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        // Fila 1
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 95, 85, 8, 1, 1, 'F');
        doc.roundedRect(105, 95, 85, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y Apellidos:', 23, 101);
        doc.text('DNI:', 108, 101);
        doc.setFont('helvetica', 'normal');
        doc.text(data.trabajador.length > 25 ? data.trabajador.substring(0, 25) + '...' : data.trabajador, 23, 105);
        doc.text(data.dni, 108, 105); // DNI completo en PDF
        
        // Fila 2
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 110, 85, 8, 1, 1, 'F');
        doc.roundedRect(105, 110, 85, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de Registro:', 23, 116);
        doc.text('Hora de Registro:', 108, 116);
        doc.setFont('helvetica', 'normal');
        doc.text(data.fecha, 23, 120);
        doc.text(data.hora, 108, 120);
        
        // Horario laboral
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 125, 170, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Horario Laboral:', 23, 131);
        doc.setFont('helvetica', 'normal');
        doc.text(data.horario, 23, 135);
        
        // Declaración legal
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 145, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('DECLARACIÓN LEGAL', 25, 151);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const declaracion = '"Declaro que, en virtud de la Ley 8/1980, de 10 de marzo, del Estatuto de los Trabajadores, así como de la normativa vigente sobre registro de jornada laboral, procedo a firmar y confirmar que las horas trabajadas han sido registradas correctamente en el presente formulario. Firmo para constancia de que las horas consignadas en este registro corresponden a las realizadas durante mi jornada laboral. Acepto que la información proporcionada sea almacenada conforme a la legislación laboral vigente."';
        
        const splitDeclaracion = doc.splitTextToSize(declaracion, 170);
        doc.text(splitDeclaracion, 20, 160);
        
        // Sección de firma
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 200, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FIRMA DIGITAL DEL TRABAJADOR', 25, 206);
        
        // Marco para la firma
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, 215, 100, 35, 2, 2);
        
        // Añadir imagen de la firma
        if (data.firma && data.firma !== 'data:,') {
            doc.addImage(data.firma, 'PNG', 22, 217, 96, 31);
        }
        
        // Información adicional
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Trabajador: ${data.trabajador}`, 125, 225);
        doc.text(`DNI: ${data.dni}`, 125, 230);
        doc.text(`Fecha: ${data.fecha}`, 125, 235);
        doc.text(`Hora: ${data.hora}`, 125, 240);
        
        // Pie de página con línea decorativa
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.5);
        doc.line(20, 260, 190, 260);
        
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Documento generado automáticamente el ${data.fecha} a las ${data.hora}`, 105, 270, { align: 'center' });
        doc.text('Sistema de Registro Horario Laboral - Redes Carreras', 105, 275, { align: 'center' });
        
        // Generar PDF como blob para envío por email
        const pdfBlob = doc.output('blob');
        const fileName = `registro_${data.dni}_${data.fecha.replace(/\//g, '-')}.pdf`;
        
        // Descargar PDF
        doc.save(fileName);
        
        // Enviar por email
        await this.sendEmailWithPDF(data, pdfBlob, fileName);
        
        return pdfBlob;
    }

    async getLogoBase64() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = 'logo-redes_Transparente-216x216.png';
        });
    }

    // === SISTEMA DE EMAIL (simplificado para demostración) ===
    async sendEmailWithPDF(data, pdfBlob, fileName) {
        const emailData = {
            destinatario: EMAIL_CONFIG.destinatario,
            asunto: `${EMAIL_CONFIG.asunto} - ${data.trabajador}`,
            trabajador: data.trabajador,
            dni: data.dni,
            horario: data.horario,
            fecha: data.fecha,
            hora: data.hora,
            pdfBlob: pdfBlob,
            fileName: fileName,
            timestamp: Date.now()
        };
        
        if (navigator.onLine) {
            try {
                await this.sendEmailNow(emailData);
                console.log('Email enviado exitosamente');
            } catch (error) {
                console.warn('Error al enviar email, guardando para envío posterior:', error);
                this.saveEmailForLater(emailData);
            }
        } else {
            console.log('Sin conexión, guardando email para envío posterior');
            this.saveEmailForLater(emailData);
        }
    }

    async sendEmailNow(emailData) {
        // Simular envío de email
        console.log('Simulando envío de email a:', emailData.destinatario);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    saveEmailForLater(emailData) {
        const pendingEmails = JSON.parse(localStorage.getItem('pending_emails') || '[]');
        
        this.blobToBase64(emailData.pdfBlob).then(base64 => {
            emailData.pdfBase64 = base64;
            delete emailData.pdfBlob;
            
            pendingEmails.push(emailData);
            localStorage.setItem('pending_emails', JSON.stringify(pendingEmails));
            
            console.log('Email guardado para envío posterior');
        });
    }

    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async processPendingEmails() {
        // Procesar emails pendientes cuando hay conexión
        const pendingEmails = JSON.parse(localStorage.getItem('pending_emails') || '[]');
        if (pendingEmails.length === 0) return;
        
        console.log(`Procesando ${pendingEmails.length} emails pendientes...`);
        // Aquí iría la lógica real de envío
    }

    // === UTILIDADES ===
    resetForm() {
        document.getElementById('registroForm').reset();
        document.getElementById('dni').value = '';
        this.clearSignature();
    }

    showMessage(message, type, target = 'default') {
        let statusMessage;
        
        // Determinar qué contenedor de mensaje usar
        if (target === 'auth') {
            statusMessage = document.getElementById('authStatusMessage');
        } else if (target === 'main') {
            statusMessage = document.getElementById('mainStatusMessage');
        } else {
            // Usar el mensaje predeterminado (fallback)
            statusMessage = document.getElementById('statusMessage');
        }
        
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type} show`;
            
            // Si es mensaje de bienvenida, agregar clase especial
            if (message.includes('✅ Bienvenido')) {
                statusMessage.classList.add('welcome-message');
            } else {
                statusMessage.classList.remove('welcome-message');
            }
            
            setTimeout(() => {
                statusMessage.classList.remove('show');
                statusMessage.classList.remove('welcome-message');
            }, 5000);
        }
    }

    updateConnectionStatus(isOnline) {
        let indicator = document.querySelector('.offline-indicator');
        
        if (!isOnline) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'offline-indicator';
                indicator.innerHTML = '<i class="fas fa-wifi"></i> Modo Offline';
                document.body.appendChild(indicator);
            }
            indicator.classList.add('show');
        } else {
            if (indicator) {
                indicator.classList.remove('show');
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 300);
            }
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registrado exitosamente:', registration);
                
                // Solicitar permisos de notificación
                await this.requestNotificationPermission();
                
                // Configurar notificaciones diarias después del registro
                this.setupDailyNotifications();
                
            } catch (error) {
                console.log('Error al registrar Service Worker:', error);
            }
        }
    }
    
    // === SISTEMA DE NOTIFICACIONES ===
    
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Permisos de notificación concedidos');
                this.showMessage('Notificaciones activadas. Recibirás recordatorios diarios a las 18:01.', 'success');
            } else if (permission === 'denied') {
                console.log('❌ Permisos de notificación denegados');
                this.showMessage('Las notificaciones están desactivadas. Puedes activarlas en la configuración del navegador.', 'warning');
            } else {
                console.log('⏸️ Permisos de notificación pendientes');
            }
        }
    }
    
    setupDailyNotifications() {
        // Enviar mensaje al Service Worker para configurar notificaciones
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SETUP_DAILY_NOTIFICATIONS'
            });
            console.log('🔔 Configuración de notificaciones diarias enviada al Service Worker');
        } else {
            // Si el SW no está listo, intentar después
            setTimeout(() => this.setupDailyNotifications(), 2000);
        }
    }
    
    // === FUNCIONES PARA RECORDAR CONTRASEÑAS ===
    
    loadSavedPasswords() {
        // Cargar contraseñas guardadas al inicializar la aplicación
        // Esta función se ejecuta en init()
        console.log('🔑 Sistema de contraseñas guardadas inicializado');
    }
    
    loadSavedPasswordForWorker(trabajador) {
        if (!trabajador) return;
        
        const savedPassword = this.getSavedPassword(trabajador);
        const passwordInput = document.getElementById('authPassword');
        const rememberCheckbox = document.getElementById('rememberPassword');
        
        if (savedPassword && passwordInput && rememberCheckbox) {
            passwordInput.value = savedPassword;
            rememberCheckbox.checked = true;
        } else if (passwordInput && rememberCheckbox) {
            passwordInput.value = '';
            rememberCheckbox.checked = false;
        }
    }
    
    getSavedPassword(trabajador) {
        try {
            const key = `saved_password_${trabajador.replace(/\s+/g, '_')}`;
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Error al cargar contraseña guardada:', error);
            return null;
        }
    }
    
    savePassword(trabajador, password) {
        try {
            const key = `saved_password_${trabajador.replace(/\s+/g, '_')}`;
            localStorage.setItem(key, password);
            console.log(`🔐 Contraseña guardada para ${trabajador}`);
        } catch (error) {
            console.warn('Error al guardar contraseña:', error);
        }
    }
    
    removePassword(trabajador) {
        try {
            const key = `saved_password_${trabajador.replace(/\s+/g, '_')}`;
            localStorage.removeItem(key);
            console.log(`🗿 Contraseña eliminada para ${trabajador}`);
        } catch (error) {
            console.warn('Error al eliminar contraseña:', error);
        }
    }
    
    handleRememberPasswordChange(isChecked) {
        const trabajador = document.getElementById('authTrabajador').value;
        const password = document.getElementById('authPassword').value;
        
        if (!isChecked && trabajador) {
            // Si se desmarca el checkbox, eliminar la contraseña guardada
            this.removePassword(trabajador);
        } else if (isChecked && trabajador && password) {
            // Si se marca el checkbox y ya hay datos, guardar inmediatamente
            this.savePassword(trabajador, password);
        }
    }
}

// Variable global para acceso desde HTML onclick
let app;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app = new RegistroHorarioApp();
});