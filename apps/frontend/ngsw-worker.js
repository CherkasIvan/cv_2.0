const CACHE_VERSION = 'v1';
const USER_STATE_CACHE = `user-state-cache-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName !== USER_STATE_CACHE &&
                        cacheName.startsWith('user-state-cache')
                    ) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/app-state/')) {
        const key = event.request.url.split('/app-state/')[1];
        event.respondWith(
            caches
                .open(USER_STATE_CACHE)
                .then((cache) => {
                    return cache.match(new Request(key));
                })
                .then((response) => response || new Response(null)),
        );
    }
    if (
        event.request.url.startsWith(
            'https://firebasestorage.googleapis.com/v0/b/cv-cherkas-db.appspot.com/',
        )
    ) {
        event.respondWith(
            caches.open('firebase-images').then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        console.log('Serving from cache:', event.request.url);
                        fetch(event.request).then((newResponse) => {
                            if (newResponse.status === 200) {
                                cache.put(event.request, newResponse.clone());
                            }
                        });
                        return response;
                    } else {
                        return fetch(event.request).then((newResponse) => {
                            if (newResponse.status === 200) {
                                cache.put(event.request, newResponse.clone());
                            }
                            return newResponse;
                        });
                    }
                });
            }),
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('message', (event) => {
    if (!event.data) return;

    const { action, key, value } = event.data;
    console.log('Received message:', action, key, value);

    if (action === 'SAVE_STATE') {
        event.waitUntil(
            caches
                .open(USER_STATE_CACHE)
                .then((cache) => {
                    return cache.put(
                        new Request(key),
                        new Response(JSON.stringify(value)),
                    );
                })
                .then(() => console.log(`State saved for key: ${key}`)),
        );
    }

    if (action === 'GET_STATE') {
        event.waitUntil(
            caches
                .open(USER_STATE_CACHE)
                .then((cache) => {
                    return cache.match(new Request(key));
                })
                .then((response) => {
                    if (response) {
                        return response.json();
                    }
                    return null;
                })
                .then((state) => {
                    event.ports[0].postMessage(state);
                }),
        );
    }
});

self.addEventListener('message', (event) => {
    if (!event.data) return;

    const { action, state } = event.data;
    console.log('Received message:', action, state);

    if (action === 'updateUsersState') {
        event.waitUntil(
            caches
                .open(USER_STATE_CACHE)
                .then((cache) => {
                    console.log(cache);
                    return cache.put(
                        'userState',
                        new Response(JSON.stringify(state)),
                    );
                })
                .then(() => console.log('State stored successfully'))
                .catch((err) => console.error('State storage failed:', err)),
        );
    }
});
