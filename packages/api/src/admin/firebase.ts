import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import type { FirebaseAppConfig, FirebaseBackendStatus } from "../types";

// Firebase configuration for Admin package
export const adminFirebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCXXXyzCRJEMiRXFv7JAOEF70TcPLKslaU",
  authDomain: "talent-hub-portal.firebaseapp.com",
  projectId: "talent-hub-portal",
  storageBucket: "talent-hub-portal.firebasestorage.app",
  messagingSenderId: "770159121874",
  appId: "1:770159121874:web:d643552a37bd50ce7c240b",
  measurementId: "G-9DDXQWV602",
};

let adminApp: FirebaseApp;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: FirebaseStorage;
let adminAnalytics: Analytics | null = null;

export function initializeAdminFirebase(customConfig?: Partial<FirebaseAppConfig>): FirebaseApp {
  const config = { ...adminFirebaseConfig, ...customConfig };
  const existingApp = getApps().find((app) => app.name === "adminApp");

  if (existingApp) {
    adminApp = existingApp;
  } else {
    adminApp = initializeApp(config, "adminApp");
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);

  if (typeof window !== "undefined") {
    isAnalyticsSupported()
      .then((supported) => {
        if (supported) {
          adminAnalytics = getAnalytics(adminApp);
        }
      })
      .catch(() => {
        // Ignore analytics unsupported environments (e.g. SSR)
      });
  }

  return adminApp;
}

// Auto initialize on module load
adminApp = initializeAdminFirebase();

export { adminApp, adminAuth, adminDb, adminStorage, adminAnalytics };

/**
 * Upload a local file/blob to Firebase Storage for Admin app.
 * Falls back to Base64 Data URL if storage bucket fails or offline.
 */
export async function uploadAdminFileToStorage(file: File | Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(adminStorage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn("Admin Firebase storage upload error/fallback to base64 Data URL:", error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file as Blob);
    });
  }
}

export function getAdminBackendStatus(): FirebaseBackendStatus {
  return {
    initialized: !!adminApp,
    connected: true,
    projectId: adminFirebaseConfig.projectId,
    authStatus: adminAuth && adminAuth.currentUser ? "ready" : "unauthenticated",
    firestoreStatus: adminDb ? "active" : "offline",
    lastPing: new Date().toISOString(),
  };
}
