
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
      const messagingSupported = await isSupported();
      if (!messagingSupported) return;

      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission);
        
        if (Notification.permission === 'default') {
          try {
            const status = await Notification.requestPermission();
            setPermission(status);
            if (status === 'granted') {
              setupMessaging();
            }
          } catch (err) {
            console.error('Notification error:', err);
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
        // We assume sw is registered or use the default one
        const token = await getToken(messaging, {
          vapidKey: 'BIb4sp-wtFazJ82-liTgnFkmGjIcwpGHrFdOMRIAZZvN_JyD4TgGGjCh8KnEOF3q3m_GYlzqpBZD8O9gDR784YU',
        });

        if (token) {
          console.log('FCM Token generated');
        }
      }

      onMessage(messaging, (payload) => {
        toast({
          title: payload.notification?.title || 'नई सूचना',
          description: payload.notification?.body || 'आपके लिए एक नया अपडेट है!',
        });
      });
    } catch (error) {
      console.warn('Messaging setup failed:', error);
    }
  }

  return null;
}
