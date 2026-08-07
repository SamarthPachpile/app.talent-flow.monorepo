import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import type { FirebaseAppConfig, FirebaseBackendStatus } from "../types";

// Firebase configuration for Candidates package
export const candidateFirebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCXXXyzCRJEMiRXFv7JAOEF70TcPLKslaU",
  authDomain: "talent-hub-portal.firebaseapp.com",
  projectId: "talent-hub-portal",
  storageBucket: "talent-hub-portal.firebasestorage.app",
  messagingSenderId: "770159121874",
  appId: "1:770159121874:web:d9b49ae23826a0647c240b",
  measurementId: "G-MQN7NR18KW",
};

let candidateApp: FirebaseApp;
let candidateAuth: Auth;
let candidateDb: Firestore;
let candidateStorage: FirebaseStorage;
let candidateAnalytics: Analytics | null = null;

export function initializeCandidateFirebase(
  customConfig?: Partial<FirebaseAppConfig>,
): FirebaseApp {
  const config = { ...candidateFirebaseConfig, ...customConfig };
  const existingApp = getApps().find((app) => app.name === "candidateApp");

  if (existingApp) {
    candidateApp = existingApp;
  } else {
    candidateApp = initializeApp(config, "candidateApp");
  }

  candidateAuth = getAuth(candidateApp);
  candidateDb = getFirestore(candidateApp);
  candidateStorage = getStorage(candidateApp);

  if (typeof window !== "undefined") {
    isAnalyticsSupported()
      .then((supported) => {
        if (supported) {
          candidateAnalytics = getAnalytics(candidateApp);
        }
      })
      .catch(() => {
        // Ignore analytics unsupported environments (e.g. SSR)
      });
  }

  return candidateApp;
}

// Auto initialize on module load
candidateApp = initializeCandidateFirebase();

export { candidateApp, candidateAuth, candidateDb, candidateStorage, candidateAnalytics };

/**
 * Upload a local file/blob to Firebase Storage for Candidates app.
 * Falls back to Base64 Data URL if storage bucket fails or offline.
 */
export async function uploadCandidateFileToStorage(
  file: File | Blob,
  path: string,
): Promise<string> {
  try {
    const storageRef = ref(candidateStorage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn("Candidate Firebase storage upload error/fallback to base64 Data URL:", error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file as Blob);
    });
  }
}

export function getCandidateBackendStatus(): FirebaseBackendStatus {
  return {
    initialized: !!candidateApp,
    connected: true,
    projectId: candidateFirebaseConfig.projectId,
    authStatus: candidateAuth && candidateAuth.currentUser ? "ready" : "unauthenticated",
    firestoreStatus: candidateDb ? "active" : "offline",
    lastPing: new Date().toISOString(),
  };
}
