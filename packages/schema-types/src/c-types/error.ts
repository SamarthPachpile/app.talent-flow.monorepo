export type ApiError = {
  statusCode: number;
  message: string;
  details?: unknown;
  name: "ApiError";
};
