/**
 * Utilities Package Text Constants
 * Contains standardized text messages, logger templates, cache sync messages, and formatting constants.
 */

export const UTILITIES_TEXT_CONSTANTS = {
  logger: {
    ready: "Logger initialized and ready.",
    shutdown: "Logger shutting down gracefully.",
    prefix: "[TalentFlow-Monorepo]",
    levels: {
      info: "INFO",
      warn: "WARN",
      error: "ERROR",
      debug: "DEBUG",
      http: "HTTP",
    },
  },
  auth: {
    tokenMissing: "Authorization header with Bearer token is missing.",
    tokenInvalid: "Provided authorization token is invalid or expired.",
    tokenVerified: "Token verified successfully.",
    sessionExpired: "User session expired. Please sign in again.",
    unauthorizedAccess: "Access denied. Insufficient credentials for this resource.",
  },
  dragonfly: {
    connecting: "Connecting to Dragonfly DB high-throughput cache cluster...",
    connected: "Dragonfly DB cache engine successfully connected.",
    disconnected: "Dragonfly DB disconnected. Falling back to local fallback strategy.",
    syncStarted: "Dragonfly-MongoDB background synchronization started.",
    syncCompleted: "Dragonfly-MongoDB background synchronization completed successfully.",
    cacheHit: "Cache HIT for requested key.",
    cacheMiss: "Cache MISS. Fetching from primary data store.",
    errorSyncing: "Encountered an error while syncing documents to Dragonfly cache.",
  },
  formatting: {
    unknownDate: "N/A",
    defaultCurrency: "USD",
    currencySymbol: "$",
    defaultLocale: "en-US",
  },
} as const;

export default UTILITIES_TEXT_CONSTANTS;
