import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import type { FirebaseAppConfig, FirebaseBackendStatus } from "./types";

// Default Firebase configuration for TalentFlow backend portal
export const defaultFirebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCXXXyzCRJEMiRXFv7JAOEF70TcPLKslaU",
  authDomain: "talent-hub-portal.firebaseapp.com",
  projectId: "talent-hub-portal",
  storageBucket: "talent-hub-portal.firebasestorage.app",
  messagingSenderId: "770159121874",
  appId: "1:770159121874:web:d643552a37bd50ce7c240b",
  measurementId: "G-9DDXQWV602",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

export function initializeFirebase(customConfig?: Partial<FirebaseAppConfig>): FirebaseApp {
  const config = { ...defaultFirebaseConfig, ...customConfig };

  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  if (typeof window !== "undefined") {
    isAnalyticsSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })
      .catch(() => {
        // Ignore analytics unsupported environments (e.g. SSR)
      });
  }

  return app;
}

// Auto initialize on module load
app = initializeFirebase();

export { app, auth, db, storage, analytics };

/**
 * Upload a local file/blob to Firebase Storage.
 * Falls back to Base64 Data URL if storage bucket fails or offline.
 */
export async function uploadFileToStorage(file: File | Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn("Firebase storage upload error/fallback to base64 Data URL:", error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file as Blob);
    });
  }
}

export function getBackendStatus(): FirebaseBackendStatus {
  return {
    initialized: !!app,
    connected: true,
    projectId: defaultFirebaseConfig.projectId,
    authStatus: auth && auth.currentUser ? "ready" : "unauthenticated",
    firestoreStatus: db ? "active" : "offline",
    lastPing: new Date().toISOString(),
  };
}
