export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

function getDefaultApiBaseUrl(): string {
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

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl !== undefined ? baseUrl : getDefaultApiBaseUrl();
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("talentflow_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    if (!params) return url;

    const queryString = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    return queryString ? `${url}?${queryString}` : url;
  }

  async get<T = unknown>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<{ data: T; success?: boolean; message?: string }> {
    const url = this.buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(options?.headers),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `GET ${endpoint} failed with status ${res.status}`);
    }

    return res.json();
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<{ data: T; success?: boolean; message?: string }> {
    const url = this.buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `POST ${endpoint} failed with status ${res.status}`);
    }

    return res.json();
  }

  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<{ data: T; success?: boolean; message?: string }> {
    const url = this.buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `PATCH ${endpoint} failed with status ${res.status}`);
    }

    return res.json();
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<{ data: T; success?: boolean; message?: string }> {
    const url = this.buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(options?.headers),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `DELETE ${endpoint} failed with status ${res.status}`);
    }

    return res.json();
  }
}

export const httpClient = new HttpClient();
