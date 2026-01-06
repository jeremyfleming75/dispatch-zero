import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const REQUIRED_ENV_KEYS = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

/**
 * Builds Firebase config from an env-like object.
 *
 * For Node, pass nothing (defaults to process.env).
 * For Vite, pass import.meta.env.
 */
export function getFirebaseConfigFromEnv(env = process.env) {
  const missing = REQUIRED_ENV_KEYS.filter((k) => !env?.[k]);
  if (missing.length) {
    throw new Error(
      `Missing Firebase env vars: ${missing.join(
        ", "
      )}. Copy .env.example and fill it in.`
    );
  }

  return {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    ...(env.FIREBASE_MEASUREMENT_ID
      ? { measurementId: env.FIREBASE_MEASUREMENT_ID }
      : {}),
  };
}

/**
 * Initializes and returns the default Firebase app.
 * Idempotent: safe to call multiple times.
 */
export function initFirebase(config = getFirebaseConfigFromEnv()) {
  if (getApps().length) return getApp();
  return initializeApp(config);
}

/**
 * Returns a Firestore instance for the default app.
 */
export function getDb() {
  return getFirestore(initFirebase());
}

