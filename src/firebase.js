import { getApp, getApps, initializeApp } from "firebase/app";

// Firebase client configuration (safe to be public on the web).
const firebaseConfig = {
  apiKey: "AIzaSyAZ9t0bbaTxv8BjIov1v1DkW8ncKhLpnSY",
  authDomain: "dispatch-zero.firebaseapp.com",
  projectId: "dispatch-zero",
  storageBucket: "dispatch-zero.firebasestorage.app",
  messagingSenderId: "457396706510",
  appId: "1:457396706510:web:779574d1883c99655a049f",
  measurementId: "G-47P20ST94R",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Lazily initialize Analytics only in supported browser environments.
 * Returns `null` on server / unsupported browsers.
 */
export async function getAnalyticsIfSupported() {
  if (typeof window === "undefined") return null;

  // Avoid importing analytics during SSR / Node evaluation.
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  return getAnalytics(app);
}

