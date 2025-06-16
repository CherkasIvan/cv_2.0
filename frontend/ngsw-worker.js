self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
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
    const { action, state } = event.data;

    if (action === 'updateUsersState') {
        caches.open('user-state-cache').then((cache) => {
            cache.put('userState', new Response(JSON.stringify(state)));
        });
    }
});
