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
      "Missing or invalid authorization header",
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return errorResponse(res, httpStatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }

  req.user = payload;
  next();
}

export default validateJwtToken;
