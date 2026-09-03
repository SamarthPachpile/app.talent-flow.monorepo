import type { Request, Response, NextFunction } from "express";
import { logger } from "@talent-flow/utilities";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `[HTTP] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
}

export default loggerMiddleware;
