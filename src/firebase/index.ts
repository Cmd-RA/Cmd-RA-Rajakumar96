'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

export function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  
  if (isClient && !firebaseConfig.apiKey) {
    console.warn("Firebase API Key is missing. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your environment variables.");
  }

  if (!getApps().length) {
    // Only initialize if we have a valid API Key to prevent auth/invalid-api-key crash
    if (!firebaseConfig.apiKey) {
      return {
        firebaseApp: null as any,
        auth: null as any,
        firestore: null as any,
        storage: null as any,
        messaging: null as any
      };
    }
    
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any,
      storage: null as any,
      messaging: null as any
    };
  }
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
    messaging: typeof window !== 'undefined' ? getMessaging(firebaseApp) : null
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
