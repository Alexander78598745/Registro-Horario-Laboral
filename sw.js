const CACHE_NAME = 'registro-horario-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './logo-redes_Transparente-216x216.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caché abierto');
                return cache.addAll(urlsToCache.map(url => {
                    // Para URLs externas, usar mode: 'no-cors' para evitar problemas de CORS
                    if (url.startsWith('http')) {
                        return new Request(url, { mode: 'no-cors' });
                    }
                    return url;
                }));
            })
            .catch((error) => {
                console.log('Error al cachear archivos:', error);
                // Continuar con la instalación aunque falle el caché de algunos archivos
            })
    );
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si encontramos el archivo en caché, lo devolvemos
                if (response) {
                    return response;
                }
                
                // Si no está en caché, intentamos obtenerlo de la red
                return fetch(event.request)
                    .then((response) => {
                        // Verificar si recibimos una respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clonar la respuesta para poder usarla en el caché y devolverla
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Si falla la red, devolver una respuesta offline para páginas HTML
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});