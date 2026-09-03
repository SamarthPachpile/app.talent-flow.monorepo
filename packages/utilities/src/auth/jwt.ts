import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { IUser } from "@talent-flow/schema-types";
import { User } from "@talent-flow/schema-types/models";

const JWT_SECRET = process.env.JWT_SECRET || "talentflow_super_secret_jwt_key_2026_production";
const JWT_EXPIRES_IN = "7d";

export interface JwtUserPayload {
  id: string;
  email: string;
  role: "admin" | "company" | "candidate";
  fullName?: string;
  companyId?: string;
  candidateId?: string;
}

export function generateToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export async function authenticateToken(
  req: Request & { user?: IUser | JwtUserPayload },
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ success: false, error: "Authentication token required" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ success: false, error: "Invalid or expired token" });
    return;
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      req.user = decoded;
    } else {
      req.user = user;
    }
    next();
  } catch {
    req.user = decoded;
    next();
  }
}
