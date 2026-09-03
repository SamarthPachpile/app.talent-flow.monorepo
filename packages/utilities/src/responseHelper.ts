import type { Response } from "express";
import { httpStatusCodes } from "@talent-flow/schema-types";
import type { ApiError } from "@talent-flow/schema-types";

export function successResponse(
  res: Response,
  statusCode: number = httpStatusCodes.SUCCESS,
  message: string = "Request was successful",
  data: unknown = {},
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR,
  message: string = "Request failed",
  error: unknown = null,
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}

export const createApiResponse = <T>(data: T, message: string = "Request was successful") => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = (
  error: ApiError | Error | string,
  statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR,
) => {
  if (typeof error === "string") {
    return {
      success: false,
      error: { message: error, statusCode },
    };
  }
  return {
    success: false,
    error: {
      message: error.message,
      statusCode: (error as ApiError).statusCode || statusCode,
      details: (error as ApiError).details,
    },
  };
};

export const createError = (statusCode: number, message: string, details?: unknown): ApiError => ({
  statusCode,
  message,
  details,
  name: "ApiError",
});

export const handleError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "statusCode" in error) {
    return error as ApiError;
  }
  if (error instanceof Error) {
    return createError(httpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
  return createError(httpStatusCodes.INTERNAL_SERVER_ERROR, "Internal server error");
};
