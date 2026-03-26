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

      // Register service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        // Use the provided VAPID key
        const token = await getToken(messaging, {
          vapidKey: 'BIb4sp-wtFazJ82-liTgnFkmGjIcwpGHrFdOMRIAZZvN_JyD4TgGGjCh8KnEOF3q3m_GYlzqpBZD8O9gDR784YU',
          serviceWorkerRegistration: registration,
        });

        if (token) {
          // In a real app, you would save this token to the user's document in Firestore
          console.log('FCM Token generated successfully:', token);
        }
      }

      // Handle foreground messages
      onMessage(messaging, (payload) => {
        toast({
          title: payload.notification?.title || 'नई सूचना',
          description: payload.notification?.body || 'आपके लिए एक नया अपडेट है!',
        });
      });
    } catch (error) {
      console.error('Error setting up messaging:', error);
    }
  }

  return null;
}
