/**
 * @file lib/errors.ts
 * @description Custom error classes and a NextResponse error helper.
 */

import { NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  Error classes                                                      */
/* ------------------------------------------------------------------ */

/** Resource not found (404). */
export class NotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(resource: string, id?: string | number) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`);
    this.name = "NotFoundError";
  }
}

/** Client sent a bad request (400). */
export class BadRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

/** Authentication / authorisation failure (401). */
export class UnauthorizedError extends Error {
  public readonly statusCode = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** External service error (502). */
export class ExternalServiceError extends Error {
  public readonly statusCode = 502;
  constructor(service: string, detail?: string) {
    super(`External service error (${service})${detail ? `: ${detail}` : ""}`);
    this.name = "ExternalServiceError";
  }
}

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

type AppError =
  | NotFoundError
  | BadRequestError
  | UnauthorizedError
  | ExternalServiceError;

/**
 * Build a JSON `NextResponse` from any error.
 * Recognised app errors map to their status code; unknown errors → 500.
 */
export function errorResponse(error: unknown): NextResponse {
  console.error("[QuantoTa API Error]", error);

  if (error instanceof Error && "statusCode" in error) {
    const appErr = error as AppError;
    return NextResponse.json(
      { error: appErr.name, message: appErr.message },
      { status: appErr.statusCode },
    );
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";

  return NextResponse.json(
    { error: "InternalServerError", message },
    { status: 500 },
  );
}
