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
        this.isDrawing = false;
        this.signatures = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateWorkerSelect();
        this.initSignatureCanvas();
        this.checkTimeRestriction();
        this.registerServiceWorker();
        
        // Procesar emails pendientes si hay conexión
        if (navigator.onLine) {
            setTimeout(() => this.processPendingEmails(), 2000);
        }
        
        // Actualizar tiempo cada segundo
        setInterval(() => this.updateCurrentTime(), 1000);
        setInterval(() => this.checkTimeRestriction(), 60000); // Verificar cada minuto
    }

    setupEventListeners() {
        // Selector de trabajador
        document.getElementById('trabajador').addEventListener('change', (e) => {
            this.updateWorkerInfo(e.target.value);
        });

        // Mostrar/ocultar contraseña
        document.getElementById('showPassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Limpiar firma
        document.getElementById('clearSignature').addEventListener('click', () => {
            this.clearSignature();
        });

        // Envío del formulario
        document.getElementById('registroForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Detectar estado offline/online
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
            this.processPendingEmails(); // Procesar emails pendientes al recuperar conexión
        });
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }

    populateWorkerSelect() {
        const select = document.getElementById('trabajador');
        Object.keys(TRABAJADORES).forEach(nombre => {
            const option = document.createElement('option');
            option.value = nombre;
            option.textContent = nombre;
            select.appendChild(option);
        });
    }

    updateWorkerInfo(trabajadorNombre) {
        const dniInput = document.getElementById('dni');
        const horarioSelect = document.getElementById('horario');
        
        if (trabajadorNombre && TRABAJADORES[trabajadorNombre]) {
            dniInput.value = TRABAJADORES[trabajadorNombre].dni;
            horarioSelect.value = TRABAJADORES[trabajadorNombre].horario;
        } else {
            dniInput.value = '';
            horarioSelect.value = '';
        }
    }

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
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar canvas
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Eventos del mouse
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Eventos táctiles para móviles
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    clearSignature() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    checkTimeRestriction() {
        const now = new Date();
        const hour = now.getHours();
        const isAfter6PM = hour >= 18;
        
        const timeRestriction = document.getElementById('timeRestriction');
        const mainContent = document.getElementById('mainContent');
        
        if (isAfter6PM) {
            timeRestriction.style.display = 'none';
            mainContent.style.display = 'block';
        } else {
            timeRestriction.style.display = 'block';
            mainContent.style.display = 'none';
        }
        
        this.updateCurrentTime();
    }

    updateCurrentTime() {
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
        
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            currentTimeElement.textContent = `Hora actual: ${timeString}`;
        }
    }

    validateForm() {
        const trabajador = document.getElementById('trabajador').value;
        const horario = document.getElementById('horario').value;
        const password = document.getElementById('password').value;
        
        // Validar campos requeridos
        if (!trabajador) {
            this.showMessage('Por favor, selecciona un trabajador.', 'error');
            return false;
        }
        
        if (!horario) {
            this.showMessage('Por favor, selecciona un horario laboral.', 'error');
            return false;
        }
        
        // Validar contraseña
        if (!password) {
            this.showMessage('Por favor, ingresa tu contraseña.', 'error');
            return false;
        }
        
        if (TRABAJADORES[trabajador] && TRABAJADORES[trabajador].password !== password) {
            this.showMessage('Contraseña incorrecta. Contacta con el administrador si no recuerdas tu contraseña.', 'error');
            return false;
        }
        
        // Validar firma
        if (this.isCanvasEmpty()) {
            this.showMessage('⚠️ Debes firmar en el área designada antes de enviar el registro. La firma es obligatoria para validar tu jornada laboral.', 'error');
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
            await this.saveRegistro(formData);
            
            const emailStatus = navigator.onLine ? 
                'PDF generado y enviado por email a instalaciones@redescarreras.es.' : 
                'PDF generado. Email se enviará cuando haya conexión.';
            
            this.showMessage(`✅ Registro completado exitosamente. ${emailStatus}`, 'success');
            this.resetForm();
            
        } catch (error) {
            console.error('Error al procesar el registro:', error);
            this.showMessage('Error al procesar el registro. Inténtalo de nuevo.', 'error');
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const now = new Date();
        return {
            trabajador: document.getElementById('trabajador').value,
            dni: document.getElementById('dni').value,
            horario: document.getElementById('horario').value,
            fecha: now.toLocaleDateString('es-ES'),
            hora: now.toLocaleTimeString('es-ES'),
            firma: this.canvas.toDataURL()
        };
    }

    async generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fuente
        doc.setFont('helvetica');
        
        // Agregar logo de la empresa (convertir imagen a base64)
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
        doc.setTextColor(37, 99, 235); // Color azul corporativo
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
        doc.text(data.dni, 108, 105);
        
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
        doc.text(`Documento oficial generado el ${data.fecha} a las ${data.hora}`, 105, 270, { align: 'center' });
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
        // Convertir blob a base64 para el envío
        const pdfBase64 = await this.blobToBase64(emailData.pdfBlob);
        
        const emailBody = `
            <h2>Nuevo Registro Horario Laboral</h2>
            <p><strong>Trabajador:</strong> ${emailData.trabajador}</p>
            <p><strong>DNI:</strong> ${emailData.dni}</p>
            <p><strong>Horario:</strong> ${emailData.horario}</p>
            <p><strong>Fecha:</strong> ${emailData.fecha}</p>
            <p><strong>Hora:</strong> ${emailData.hora}</p>
            <p><strong>Estado:</strong> Documento Oficial</p>
            <br>
            <p>El documento PDF con la firma digital se adjunta a este email.</p>
            <p><em>Este registro ha sido generado automáticamente por el sistema de registro horario laboral.</em></p>
        `;
        
        // En un entorno real, aquí usarías un servicio como EmailJS, SendGrid, etc.
        // Por ahora, simulamos el envío y mostramos un mensaje
        console.log('Simulando envío de email a:', emailData.destinatario);
        console.log('Asunto:', emailData.asunto);
        console.log('Contenido:', emailBody);
        console.log('PDF adjunto:', emailData.fileName);
        
        // Simular tiempo de envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En producción, aquí iría la llamada real al servicio de email:
        /*
        await emailService.send({
            to: emailData.destinatario,
            subject: emailData.asunto,
            html: emailBody,
            attachments: [{
                filename: emailData.fileName,
                content: pdfBase64,
                type: 'application/pdf'
            }]
        });
        */
    }

    saveEmailForLater(emailData) {
        // Guardar emails pendientes para enviar cuando haya conexión
        const pendingEmails = JSON.parse(localStorage.getItem('pending_emails') || '[]');
        
        // Convertir blob a base64 para almacenamiento
        this.blobToBase64(emailData.pdfBlob).then(base64 => {
            emailData.pdfBase64 = base64;
            delete emailData.pdfBlob; // Remover blob para evitar problemas de serialización
            
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
        if (!navigator.onLine) return;
        
        const pendingEmails = JSON.parse(localStorage.getItem('pending_emails') || '[]');
        if (pendingEmails.length === 0) return;
        
        console.log(`Procesando ${pendingEmails.length} emails pendientes...`);
        
        const processedEmails = [];
        for (const emailData of pendingEmails) {
            try {
                // Reconstituir el blob desde base64
                emailData.pdfBlob = this.base64ToBlob(emailData.pdfBase64, 'application/pdf');
                await this.sendEmailNow(emailData);
                processedEmails.push(emailData);
                console.log(`Email enviado: ${emailData.trabajador}`);
            } catch (error) {
                console.warn(`Error enviando email para ${emailData.trabajador}:`, error);
            }
        }
        
        // Remover emails enviados exitosamente
        const remainingEmails = pendingEmails.filter(email => 
            !processedEmails.some(processed => processed.timestamp === email.timestamp)
        );
        localStorage.setItem('pending_emails', JSON.stringify(remainingEmails));
        
        if (processedEmails.length > 0) {
            this.showMessage(`✅ ${processedEmails.length} registros enviados por email exitosamente`, 'success');
        }
    }

    base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    async saveRegistro(data) {
        // Guardar en localStorage para funcionamiento offline
        const registros = JSON.parse(localStorage.getItem('registros_horarios') || '[]');
        registros.push({ ...data, id: Date.now().toString() });
        localStorage.setItem('registros_horarios', JSON.stringify(registros));
        
        // Si está online, intentar enviar al servidor (implementar según necesidades)
        if (navigator.onLine) {
            try {
                // Aquí se podría implementar el envío al servidor
                console.log('Registro guardado localmente y listo para sincronizar con servidor');
            } catch (error) {
                console.log('Error al sincronizar con servidor, datos guardados localmente');
            }
        }
    }

    resetForm() {
        document.getElementById('registroForm').reset();
        document.getElementById('dni').value = '';
        this.clearSignature();
    }

    showMessage(message, type) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 5000);
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
            } catch (error) {
                console.log('Error al registrar Service Worker:', error);
            }
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistroHorarioApp();
});