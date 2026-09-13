import type { Request, Response, NextFunction } from "express";
import { verifyToken, JwtUserPayload } from "@talent-flow/utilities/auth";
import { httpStatusCodes } from "@talent-flow/schema-types";
import { errorResponse } from "@talent-flow/utilities";

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export function validateJwtToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(
      res,
      httpStatusCodes.UNAUTHORIZED,
      "Missing or invalid authorization header. Format: Bearer <jwt_token>",
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return errorResponse(res, httpStatusCodes.UNAUTHORIZED, "Invalid or expired JWT token");
  }

  req.user = payload;
  next();
}

export const requireAuth = validateJwtToken;

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(
          res,
          httpStatusCodes.UNAUTHORIZED,
          "Authorization header required (Bearer <jwt_token>)",
        );
      }
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);
      if (!payload) {
        return errorResponse(res, httpStatusCodes.UNAUTHORIZED, "Invalid or expired JWT token");
      }
      req.user = payload;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        httpStatusCodes.FORBIDDEN,
        `Access denied. Requires one of roles: [${roles.join(", ")}]`,
      );
    }

    next();
  };
}

export function optionalJwtToken(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

export default validateJwtToken;
