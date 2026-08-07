import {
  adminApp,
  adminAuth,
  adminDb,
  adminStorage,
  adminAnalytics,
  getAdminBackendStatus,
  uploadAdminFileToStorage,
} from "./admin/firebase";
import {
  companyApp,
  companyAuth,
  companyDb,
  companyStorage,
  companyAnalytics,
  getCompanyBackendStatus,
  uploadCompanyFileToStorage,
} from "./companies/firebase";
import {
  candidateApp,
  candidateAuth,
  candidateDb,
  candidateStorage,
  candidateAnalytics,
  getCandidateBackendStatus,
  uploadCandidateFileToStorage,
} from "./candidates/firebase";
import type { FirebaseAppConfig, FirebaseBackendStatus } from "./types";

export {
  // Admin App Firebase exports
  adminApp,
  adminAuth,
  adminDb,
  adminStorage,
  adminAnalytics,
  getAdminBackendStatus,
  uploadAdminFileToStorage,
  // Company App Firebase exports
  companyApp,
  companyAuth,
  companyDb,
  companyStorage,
  companyAnalytics,
  getCompanyBackendStatus,
  uploadCompanyFileToStorage,
  // Candidate App Firebase exports
  candidateApp,
  candidateAuth,
  candidateDb,
  candidateStorage,
  candidateAnalytics,
  getCandidateBackendStatus,
  uploadCandidateFileToStorage,
};

// Aliases for default/legacy imports pointing to Company/Default App
export const app = companyApp;
export const auth = companyAuth;
export const db = companyDb;
export const storage = companyStorage;
export const analytics = companyAnalytics;
export const defaultFirebaseConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCXXXyzCRJEMiRXFv7JAOEF70TcPLKslaU",
  authDomain: "talent-hub-portal.firebaseapp.com",
  projectId: "talent-hub-portal",
  storageBucket: "talent-hub-portal.firebasestorage.app",
  messagingSenderId: "770159121874",
  appId: "1:770159121874:web:d643552a37bd50ce7c240b",
  measurementId: "G-9DDXQWV602",
};

export function initializeFirebase() {
  return companyApp;
}

export function getBackendStatus(): FirebaseBackendStatus {
  return getCompanyBackendStatus();
}

export async function uploadFileToStorage(file: File | Blob, path: string): Promise<string> {
  return uploadCompanyFileToStorage(file, path);
}
