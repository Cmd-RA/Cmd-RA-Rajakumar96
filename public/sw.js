
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'नई सूचना', body: 'मोनेटाइजेशन: आपके लिए एक नया अपडेट है!' };
  const options = {
    body: data.body,
    icon: 'https://picsum.photos/seed/notif/192/192',
    badge: 'https://picsum.photos/seed/badge/96/96',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
