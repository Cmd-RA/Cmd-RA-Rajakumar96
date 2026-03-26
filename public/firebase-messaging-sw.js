// Scripts for firebase and firebase-messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object
firebase.initializeApp({
  apiKey: "AIzaSyCjJjHUM1MDbMMI-rhDPGpuf64NoguhoD0",
  authDomain: "studio-4058108348-1a977.firebaseapp.com",
  projectId: "studio-4058108348-1a977",
  storageBucket: "studio-4058108348-1a977.firebasestorage.app",
  messagingSenderId: "1021954880890",
  appId: "1:1021954880890:web:47d26b8b0e9cca1992d2c3"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title || 'मोनेटाइजेशन अपडेट';
  const notificationOptions = {
    body: payload.notification.body || 'आपके लिए एक नई सूचना है!',
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
