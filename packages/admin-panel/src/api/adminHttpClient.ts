/**
 * Admin Panel Dedicated HTTP Client
 * Manages communication between the Admin Panel and the backend REST API.
 */
export interface AdminRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface AdminApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
  timestamp?: string;
}

function getBaseUrl(): string {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
      // @ts-ignore
      return import.meta.env.VITE_API_URL;
    }
  } catch {
    // Fall back to process.env if import.meta is unavailable
  }
  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  return "";
}

export async function adminApiRequest<T = unknown>(
  endpoint: string,
  options: AdminRequestOptions = {},
): Promise<AdminApiResponse<T>> {
  const { params, headers = {}, ...restOptions } = options;
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes("?") ? "&" : "?") + qs;
    }
  }

  let authHeader = "";
  if (typeof window !== "undefined") {
    try {
      const token =
        localStorage.getItem("talentflow_auth_token") ||
        localStorage.getItem("talentflow_admin_token") ||
        localStorage.getItem("talentflow_jwt_token");
      if (token) {
        authHeader = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authHeader ? { Authorization: authHeader } : {}),
  };

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...restOptions,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errObj = data as { error?: string; message?: string } | null;
    const errorMsg = errObj?.error || errObj?.message || `HTTP ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data as AdminApiResponse<T>;
}

export const adminHttpClient = {
  get: <T = unknown>(endpoint: string, options?: AdminRequestOptions) =>
    adminApiRequest<T>(endpoint, { method: "GET", ...options }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: AdminRequestOptions) =>
    adminApiRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = unknown>(endpoint: string, body?: unknown, options?: AdminRequestOptions) =>
    adminApiRequest<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = unknown>(endpoint: string, options?: AdminRequestOptions) =>
    adminApiRequest<T>(endpoint, { method: "DELETE", ...options }),
};

export default adminHttpClient;
