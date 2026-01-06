import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config is read from environment variables so you can keep keys out of code.
// Put these in `.env.local` (see `.env.example`).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // You provided an App ID; we use it as a fallback if env var isn't set.
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:457396706510:web:779574d1883c99655a049f",
};

function hasMinimumConfig(cfg) {
  return Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId);
}

export const firebaseApp = (() => {
  if (!hasMinimumConfig(firebaseConfig)) return null;
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
})();

export const db = firebaseApp ? getFirestore(firebaseApp) : null;

