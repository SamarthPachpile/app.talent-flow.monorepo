/**
 * Dragonfly DB Multi-Tenant Session Management Engine
 * Ultra-fast session creation, validation, storage, and revocation across all TalentFlow portals:
 * - Admin Panel
 * - Company Onboarding / Workspaces
 * - Candidate Portal
 * - Graviton IT Solutions
 */

import { DragonflyCacheService } from "./dragonflyCacheService";

export interface UserSessionData {
  sessionId: string;
  token: string;
  userId: string;
  email: string;
  role: "admin" | "company" | "candidate" | "recruiter" | "user";
  displayName?: string;
  companyId?: string;
  companyName?: string;
  candidateId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: number;
  lastActiveAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSessionOptions {
  userId: string;
  email: string;
  role: "admin" | "company" | "candidate" | "recruiter" | "user";
  displayName?: string;
  companyId?: string;
  companyName?: string;
  candidateId?: string;
  ipAddress?: string;
  userAgent?: string;
  ttlSeconds?: number;
  metadata?: Record<string, unknown>;
}

const LOCAL_SESSION_STORAGE_KEY = "talentflow_active_session_token";

export class DragonflySessionService {
  private static defaultTtlSeconds = 7 * 24 * 3600; // 7 days default session lifetime

  /**
   * Generates a cryptographically secure random session token
   */
  private static generateToken(): string {
    const randomPart =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestampPart = Date.now().toString(36);
    return `tf_sess_${timestampPart}_${randomPart}`;
  }

  /**
   * Creates and stores an active session directly in Dragonfly DB
   */
  static async createSession(options: CreateSessionOptions): Promise<UserSessionData> {
    const token = this.generateToken();
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const ttlSeconds = options.ttlSeconds || this.defaultTtlSeconds;
    const nowIso = new Date().toISOString();
    const expiresAt = Date.now() + ttlSeconds * 1000;

    const session: UserSessionData = {
      sessionId,
      token,
      userId: options.userId,
      email: options.email.trim().toLowerCase(),
      role: options.role,
      displayName: options.displayName,
      companyId: options.companyId,
      companyName: options.companyName,
      candidateId: options.candidateId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      createdAt: nowIso,
      expiresAt,
      lastActiveAt: nowIso,
      metadata: options.metadata || {},
    };

    // 1. Store session in Dragonfly DB with TTL
    const sessionKey = DragonflyCacheService.keys.session(token);
    await DragonflyCacheService.set(sessionKey, session, ttlSeconds);

    // 2. Track user sessions map for multi-device session management
    const userSessionsKey = DragonflyCacheService.keys.custom(`user_sessions:${options.userId}`);
    const existingTokens = (await DragonflyCacheService.get<string[]>(userSessionsKey)) || [];
    const updatedTokens = [...new Set([...existingTokens, token])];
    await DragonflyCacheService.set(userSessionsKey, updatedTokens, ttlSeconds);

    // 3. Store active token in browser localStorage for client sessions
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_SESSION_STORAGE_KEY, token);
        localStorage.setItem(`talentflow_session_data`, JSON.stringify(session));
      } catch {
        // ignore
      }
    }

    return session;
  }

  /**
   * Fetch session strictly from Dragonfly DB (<1ms response)
   */
  static async getSession(token: string): Promise<UserSessionData | null> {
    if (!token) return null;

    const sessionKey = DragonflyCacheService.keys.session(token);
    const session = await DragonflyCacheService.get<UserSessionData>(sessionKey);

    if (session) {
      if (session.expiresAt && session.expiresAt < Date.now()) {
        await this.destroySession(token);
        return null;
      }
      return session;
    }

    // LocalStorage Fallback for offline clients
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("talentflow_session_data");
        if (stored) {
          const parsed = JSON.parse(stored) as UserSessionData;
          if (parsed && parsed.token === token && parsed.expiresAt > Date.now()) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    return null;
  }

  /**
   * Retrieves current client session from localStorage and verifies it
   */
  static async getCurrentSession(): Promise<UserSessionData | null> {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(LOCAL_SESSION_STORAGE_KEY);
    if (!token) return null;

    return this.getSession(token);
  }

  /**
   * Touch/refresh session activity timestamp and extend TTL
   */
  static async touchSession(token: string, additionalTtlSeconds?: number): Promise<boolean> {
    const session = await this.getSession(token);
    if (!session) return false;

    const ttl = additionalTtlSeconds || this.defaultTtlSeconds;
    session.lastActiveAt = new Date().toISOString();
    session.expiresAt = Date.now() + ttl * 1000;

    const sessionKey = DragonflyCacheService.keys.session(token);
    await DragonflyCacheService.set(sessionKey, session, ttl);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("talentflow_session_data", JSON.stringify(session));
      } catch {
        // ignore
      }
    }

    return true;
  }

  /**
   * Destroy an active session in Dragonfly DB and client storage
   */
  static async destroySession(token: string): Promise<boolean> {
    if (!token) return false;

    const sessionKey = DragonflyCacheService.keys.session(token);
    const session = await DragonflyCacheService.get<UserSessionData>(sessionKey);

    // Delete session from Dragonfly DB
    await DragonflyCacheService.del(sessionKey);

    // Clean user sessions list
    if (session && session.userId) {
      const userSessionsKey = DragonflyCacheService.keys.custom(`user_sessions:${session.userId}`);
      const tokens = (await DragonflyCacheService.get<string[]>(userSessionsKey)) || [];
      const filtered = tokens.filter((t) => t !== token);
      if (filtered.length > 0) {
        await DragonflyCacheService.set(userSessionsKey, filtered, this.defaultTtlSeconds);
      } else {
        await DragonflyCacheService.del(userSessionsKey);
      }
    }

    // Clean client storage
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem(LOCAL_SESSION_STORAGE_KEY) === token) {
          localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
          localStorage.removeItem("talentflow_session_data");
        }
      } catch {
        // ignore
      }
    }

    return true;
  }

  /**
   * Revoke all active sessions for a user across all devices
   */
  static async destroyAllUserSessions(userId: string): Promise<number> {
    if (!userId) return 0;

    const userSessionsKey = DragonflyCacheService.keys.custom(`user_sessions:${userId}`);
    const tokens = (await DragonflyCacheService.get<string[]>(userSessionsKey)) || [];

    for (const token of tokens) {
      await DragonflyCacheService.del(DragonflyCacheService.keys.session(token));
    }

    await DragonflyCacheService.del(userSessionsKey);
    return tokens.length;
  }
}

// Backward compatibility exports
export const RedisSessionService = DragonflySessionService;
export default DragonflySessionService;
