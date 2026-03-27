'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

export function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  
  // Strict check for API key to prevent 'auth/invalid-api-key' error
  if (!firebaseConfig.apiKey) {
    if (isClient) {
      console.warn("Firebase API Key is missing. Check your Netlify Environment Variables.");
    }
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null,
      messaging: null
    };
  }

  try {
    const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null,
      messaging: null
    };
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) {
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null,
      messaging: null
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
