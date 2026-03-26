// Scripts for firebase-app and firebase-messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCjJjHUM1MDbMMI-rhDPGpuf64NoguhoD0",
  authDomain: "studio-4058108348-1a977.firebaseapp.com",
  projectId: "studio-4058108348-1a977",
  storageBucket: "studio-4058108348-1a977.firebasestorage.app",
  messagingSenderId: "1021954880890",
  appId: "1:1021954880890:web:47d26b8b0e9cca1992d2c3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico' // Ensure you have an icon at this path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
