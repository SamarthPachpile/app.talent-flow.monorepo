import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import type { FirebaseAppConfig, FirebaseBackendStatus } from "../types";

// Firebase configuration for Companies package
export const companyFirebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCXXXyzCRJEMiRXFv7JAOEF70TcPLKslaU",
  authDomain: "talent-hub-portal.firebaseapp.com",
  projectId: "talent-hub-portal",
  storageBucket: "talent-hub-portal.firebasestorage.app",
  messagingSenderId: "770159121874",
  appId: "1:770159121874:web:d643552a37bd50ce7c240b",
  measurementId: "G-9DDXQWV602",
};

let companyApp: FirebaseApp;
let companyAuth: Auth;
let companyDb: Firestore;
let companyStorage: FirebaseStorage;
let companyAnalytics: Analytics | null = null;

export function initializeCompanyFirebase(customConfig?: Partial<FirebaseAppConfig>): FirebaseApp {
  const config = { ...companyFirebaseConfig, ...customConfig };
  const existingApp = getApps().find((app) => app.name === "companyApp");

  if (existingApp) {
    companyApp = existingApp;
  } else {
    companyApp = initializeApp(config, "companyApp");
  }

  companyAuth = getAuth(companyApp);
  companyDb = getFirestore(companyApp);
  companyStorage = getStorage(companyApp);

  if (typeof window !== "undefined") {
    isAnalyticsSupported()
      .then((supported) => {
        if (supported) {
          companyAnalytics = getAnalytics(companyApp);
        }
      })
      .catch(() => {
        // Ignore analytics unsupported environments (e.g. SSR)
      });
  }

  return companyApp;
}

// Auto initialize on module load
companyApp = initializeCompanyFirebase();

export { companyApp, companyAuth, companyDb, companyStorage, companyAnalytics };

/**
 * Upload a local file/blob to Firebase Storage for Companies app.
 * Falls back to Base64 Data URL if storage bucket fails or offline.
 */
export async function uploadCompanyFileToStorage(file: File | Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(companyStorage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn("Company Firebase storage upload error/fallback to base64 Data URL:", error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file as Blob);
    });
  }
}

export function getCompanyBackendStatus(): FirebaseBackendStatus {
  return {
    initialized: !!companyApp,
    connected: true,
    projectId: companyFirebaseConfig.projectId,
    authStatus: companyAuth && companyAuth.currentUser ? "ready" : "unauthenticated",
    firestoreStatus: companyDb ? "active" : "offline",
    lastPing: new Date().toISOString(),
  };
}
