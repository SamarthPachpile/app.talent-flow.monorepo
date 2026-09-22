/**
 * Backend API & SDK Text Constants
 * Contains standardized server response messages, error strings, email subjects, and route descriptions.
 */

export const API_TEXT_CONSTANTS = {
  server: {
    running: "TalentFlow API Server is running and listening on port",
    databaseConnected: "MongoDB Atlas database connection established successfully.",
    databaseDisconnected: "MongoDB Atlas connection terminated.",
    healthCheckOk: "TalentFlow Ecosystem API is fully operational and healthy.",
    rateLimitExceeded: "Too many requests. Please slow down and try again later.",
  },
  auth: {
    loginSuccess: "Candidate authentication successful.",
    logoutSuccess: "Logged out successfully.",
    invalidCredentials: "The email or password entered is incorrect.",
    accountNotFound: "No matching account found with the provided credentials.",
    accountAlreadyExists: "An account with this email address is already registered.",
    unauthorized: "Authentication required to access this endpoint.",
    forbidden: "Access forbidden. Administrative privileges required.",
    sessionExpired: "Your active session has expired. Please sign in again.",
    otpSent: "Verification code sent to your registered email address.",
    otpInvalid: "Invalid or expired verification code. Please request a new one.",
  },
  companies: {
    created: "Company workspace created successfully.",
    updated: "Company profile details updated successfully.",
    notFound: "Company workspace could not be found.",
    candidateRegistered: "Candidate successfully registered under the company workspace.",
  },
  candidates: {
    created: "Candidate profile initialized successfully.",
    updated: "Candidate profile details saved successfully.",
    notFound: "Candidate profile record not found.",
    offerAccepted: "Offer letter signed and accepted successfully.",
    hardwareOrdered: "Hardware equipment order confirmed and dispatched to IT.",
  },
  emails: {
    candidateWelcomeSubject: "Welcome to TalentFlow - Your Onboarding Journey Begins",
    offerLetterSubject: "Important: Your Official Employment Offer Letter is Ready",
    interviewScheduledSubject: "Confirmed: Interview Schedule with",
    verificationOtpSubject: "Your TalentFlow Security Verification Code",
  },
  errors: {
    internalServerError: "An unexpected internal server error occurred.",
    badRequest: "Invalid request payload or query parameters.",
    validationFailed: "Request validation failed. Please check the submitted fields.",
    databaseError: "Database query execution failed.",
  },
} as const;

export default API_TEXT_CONSTANTS;
