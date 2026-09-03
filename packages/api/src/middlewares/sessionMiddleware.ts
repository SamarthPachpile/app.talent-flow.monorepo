import type { Request, Response, NextFunction } from "express";
import { DragonflySessionService } from "@talent-flow/utilities/dragonfly";
import { httpStatusCodes } from "@talent-flow/schema-types";
import { errorResponse } from "@talent-flow/utilities";

export async function validateSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId =
    (req.headers["session-id"] as string) || (req.headers["x-session-id"] as string);

  if (!sessionId) {
    return next();
  }

  try {
    const session = await DragonflySessionService.getSession(sessionId);
    if (!session) {
      return errorResponse(
        res,
        httpStatusCodes.UNAUTHORIZED,
        "Session has expired or is invalid. Please sign in again.",
      );
    }
    next();
  } catch {
    next();
  }
}

export const sessionValidation = validateSessionMiddleware;
export default validateSessionMiddleware;
