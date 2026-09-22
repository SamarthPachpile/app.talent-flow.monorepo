/**
 * Safe Browser Storage & JSON Utilities
 * Handles SSR safety, JSON parsing, and localStorage operations gracefully.
 */

export function safeJsonParse<T = unknown>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getStorageItem<T = unknown>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return fallback;
    return safeJsonParse<T>(item, fallback);
  } catch {
    return fallback;
  }
}

export function setStorageItem<T = unknown>(key: string, value: T): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, str);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
