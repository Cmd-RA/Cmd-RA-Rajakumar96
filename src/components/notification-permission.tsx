'use client';

import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export function NotificationPermission() {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        requestPermission();
      } else if (Notification.permission === 'granted') {
        setupMessaging();
      }
    }
  }, []);

  async function requestPermission() {
    try {
      const status = await Notification.requestPermission();
      setPermission(status);
      if (status === 'granted') {
        setupMessaging();
      }
    } catch (error) {
      console.error('Notification permission denied', error);
    }
  }

  async function setupMessaging() {
    try {
      const { messaging } = initializeFirebase();
      if (!messaging) return;

      // Register service worker if not already registered
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE', // You need to get this from Firebase Console > Project Settings > Cloud Messaging
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log('FCM Token received:', token);
          // Here you would typically save this token to your user's Firestore document
        }
      }

      // Handle foreground messages
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast({
          title: payload.notification?.title || 'नई सूचना',
          description: payload.notification?.body || 'आपके लिए एक नया अपडेट है!',
        });
      });
    } catch (error) {
      console.error('Error setting up messaging:', error);
    }
  }

  return null; // This is a utility component, it doesn't render anything UI-wise
}
