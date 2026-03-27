'use client';

import { useEffect, useState } from 'react';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { initializeFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export function NotificationPermission() {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkSupportAndRequest = async () => {
      // Avoid server-side messaging init
      if (typeof window === 'undefined') return;

      const messagingSupported = await isSupported();
      if (!messagingSupported) return;

      if ('Notification' in window) {
        setPermission(Notification.permission);
        
        if (Notification.permission === 'default') {
          try {
            const status = await Notification.requestPermission();
            setPermission(status);
            if (status === 'granted') {
              setupMessaging();
            }
          } catch (err) {
            console.warn('Notification request failed:', err);
          }
        } else if (Notification.permission === 'granted') {
          setupMessaging();
        }
      }
    };

    checkSupportAndRequest();
  }, []);

  async function setupMessaging() {
    try {
      const { messaging } = initializeFirebase();
      if (!messaging) return;

      if ('serviceWorker' in navigator) {
        // Use the VAPID key from environment variables
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        
        const token = await getToken(messaging, {
          vapidKey: vapidKey,
        });

        if (token) {
          console.log('FCM Token generated successfully');
        }
      }

      onMessage(messaging, (payload) => {
        toast({
          title: payload.notification?.title || 'नई सूचना',
          description: payload.notification?.body || 'मोनेटाइजेशन: आपके लिए एक नया अपडेट है!',
        });
      });
    } catch (error) {
      console.warn('Messaging setup failed:', error);
    }
  }

  return null;
}
