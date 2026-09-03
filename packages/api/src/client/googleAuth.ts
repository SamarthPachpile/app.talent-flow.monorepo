/**
 * Google Identity Services (GIS) & OAuth 2.0 Client Authentication
 * Directly launches Google's official sign-in screen (accounts.google.com)
 */

export interface GoogleAuthProfile {
  email: string;
  fullName: string;
  googleId: string;
  avatarUrl?: string;
}

let isGisLoaded = false;
let gisLoadPromise: Promise<boolean> | null = null;

export function loadGoogleGisScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.accounts) return Promise.resolve(true);
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve) => {
    const existing = document.getElementById("google-gis-sdk");
    if (existing) {
      existing.addEventListener("load", () => {
        isGisLoaded = true;
        resolve(true);
      });
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gis-sdk";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGisLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

/**
 * Retrieves the active Google Client ID from environment variables or backend
 */
export async function getGoogleClientId(): Promise<string> {
  if (typeof window === "undefined") return "";

  // 1. Check Vite environment variable
  const viteClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  if (viteClientId && !viteClientId.startsWith("mock_")) {
    return viteClientId.trim();
  }

  // 2. Check localStorage for developer override
  try {
    const stored = localStorage.getItem("talentflow_google_client_id");
    if (stored && !stored.startsWith("mock_")) {
      return stored.trim();
    }
  } catch {
    // localStorage may be restricted in sandboxed environments
  }

  // 3. Fetch from backend /api/auth/google/config
  try {
    const res = await fetch("/api/auth/google/config");
    if (res.ok) {
      const data = await res.json();
      if (data.clientId && !data.clientId.startsWith("mock_")) {
        return data.clientId.trim();
      }
    }
  } catch {
    // API server may not be reachable during initial bootstrap
  }

  return "";
}

/**
 * Initiates the Google OAuth Screen popup using Google Identity Services (GIS)
 * directly connecting to accounts.google.com
 */
export async function launchGoogleOAuthScreen(
  role: "candidate" | "company" = "company",
): Promise<{ profile?: GoogleAuthProfile; error?: string }> {
  if (typeof window === "undefined") {
    return { error: "Client window environment required" };
  }

  const clientId = await getGoogleClientId();

  // If no real Google Cloud OAuth Client ID is configured yet
  if (!clientId || clientId.startsWith("mock_")) {
    return {
      error:
        "GOOGLE_CLIENT_ID_MISSING: Google OAuth requires a valid Google Cloud Client ID. Please set VITE_GOOGLE_CLIENT_ID in your .env file or Google Cloud Console.",
    };
  }

  await loadGoogleGisScript();

  // 1. Official Google Identity Services (GIS) Token Client
  if ((window as any).google?.accounts?.oauth2) {
    return new Promise((resolve) => {
      try {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
          prompt: "select_account",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              resolve({
                error:
                  tokenResponse.error_description ||
                  tokenResponse.error ||
                  "Google authentication was cancelled",
              });
              return;
            }

            try {
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const data = await res.json();

              if (!data.email) {
                resolve({ error: "Failed to retrieve email from Google profile" });
                return;
              }

              resolve({
                profile: {
                  email: data.email.toLowerCase(),
                  fullName: data.name || data.email.split("@")[0],
                  googleId: data.sub || `google_${Date.now()}`,
                  avatarUrl:
                    data.picture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || data.email)}`,
                },
              });
            } catch (err: unknown) {
              resolve({ error: (err as Error)?.message || "Failed to retrieve Google userinfo" });
            }
          },
          error_callback: (nonOAuthErr: any) => {
            resolve({ error: nonOAuthErr?.message || "Google OAuth dialog closed" });
          },
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });
      } catch (err) {
        resolve({ error: (err as Error)?.message || "Google OAuth initialization error" });
      }
    });
  }

  // 2. Direct Google OAuth Popup Window to accounts.google.com
  return new Promise((resolve) => {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin,
      response_type: "token id_token",
      scope: "openid email profile",
      nonce: `${Date.now()}`,
      prompt: "select_account",
    });

    const popupUrl = `${authEndpoint}?${params.toString()}`;
    const popup = window.open(
      popupUrl,
      "GoogleAuthWindow",
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`,
    );

    if (!popup) {
      resolve({
        error: "Popup blocked. Please allow popups for this site to sign in with Google.",
      });
      return;
    }

    let isResolved = false;

    const messageHandler = (event: MessageEvent) => {
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.type === "GOOGLE_AUTH_SUCCESS"
      ) {
        isResolved = true;
        window.removeEventListener("message", messageHandler);
        clearInterval(checkClosed);
        try {
          popup.close();
        } catch {
          // Popup window may already be closed
        }
        resolve({ profile: event.data.profile });
      }
    };

    window.addEventListener("message", messageHandler);

    const checkClosed = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          if (!isResolved) {
            resolve({ error: "Google Sign-In window was closed." });
          }
        }
      } catch {
        // cross-origin access error is normal while navigating on accounts.google.com
      }
    }, 1000);
  });
}
