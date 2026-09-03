/**
 * Graviton IT Solutions Dedicated HTTP Client
 * Manages communication between Graviton Corporate portal and backend REST API.
 */
export interface GravitonRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface GravitonApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
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

export async function gravitonApiRequest<T = unknown>(
  endpoint: string,
  options: GravitonRequestOptions = {},
): Promise<GravitonApiResponse<T>> {
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

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
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

  return data as GravitonApiResponse<T>;
}

export const gravitonHttpClient = {
  get: <T = unknown>(endpoint: string, options?: GravitonRequestOptions) =>
    gravitonApiRequest<T>(endpoint, { method: "GET", ...options }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: GravitonRequestOptions) =>
    gravitonApiRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
};

export default gravitonHttpClient;
