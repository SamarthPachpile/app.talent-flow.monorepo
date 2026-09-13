import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "talentflow_super_secret_jwt_key_2026_production";
const JWT_EXPIRES_IN = "7d";

export interface JwtAuthPayload {
  id: string;
  email: string;
  role: "admin" | "company" | "candidate";
  fullName?: string;
  companyId?: string;
  candidateId?: string;
  [key: string]: unknown;
}

// Alias for backwards compatibility
export type JwtUserPayload = JwtAuthPayload;

export interface SignTokenOptions {
  expiresIn?: string | number;
}

export function generateToken(payload: JwtAuthPayload, options?: SignTokenOptions): string {
  const expiresIn = options?.expiresIn || JWT_EXPIRES_IN;
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtAuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtAuthPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JwtAuthPayload | null {
  try {
    return jwt.decode(token) as JwtAuthPayload;
  } catch {
    return null;
  }
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }
  return authHeader.trim();
}

export async function authenticateToken(
  req: Request & { user?: JwtAuthPayload; auth?: JwtAuthPayload },
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);

  if (!token) {
    res
      .status(401)
      .json({ success: false, error: "Authentication token required (Bearer <token>)" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ success: false, error: "Invalid or expired JWT token" });
    return;
  }

  req.user = decoded;
  req.auth = decoded;
  next();
}
