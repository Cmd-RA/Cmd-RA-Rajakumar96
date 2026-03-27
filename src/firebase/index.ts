'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

/**
 * Initializes Firebase and its services safely.
 */
export function initializeFirebase() {
  // Defensive check for environment variables
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "undefined" || firebaseConfig.apiKey === "") {
    console.warn("Firebase API key is missing. Ensure NEXT_PUBLIC_ variables are set in Netlify.");
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

  try {
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
      storage: getStorage(firebaseApp),
      messaging: typeof window !== 'undefined' ? getMessaging(firebaseApp) : null
    };
  } catch (err) {
    console.error("Error initializing Firebase SDKs:", err);
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null,
      messaging: null
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
