import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Initializes and exports a Firebase app instance and auth instance for
 * client‑side usage. Configuration values are pulled from environment
 * variables prefixed with `NEXT_PUBLIC_`. When deploying to Vercel you
 * should define these variables in the project settings. See
 * https://firebase.google.com/docs/web/setup for details on how to
 * obtain your Firebase config.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once in the client. `getApps()` returns
// an array of initialized apps; if empty we call `initializeApp`.
const app = !getApps().length ? initializeApp(firebaseConfig as any) : getApp();

export const auth = getAuth(app);

export default app;
