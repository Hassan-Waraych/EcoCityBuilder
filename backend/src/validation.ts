import type {
  TakeActionBody,
  ValidationResult,
  ValidationFail,
  ValidationOk,
} from "./types/index.ts";

export type { ValidationResult, ValidationFail, ValidationOk };

/**
 * Build a validation failure with a tooltip-friendly message (e.g. for 409 blocked actions).
 */
export function constraintFail(message: string): ValidationFail {
  return { ok: false, message };
}

/**
 * Validate the request body for POST /api/city/action.
 * Only checks shape; constraint checks (budget, placement) are done by the sim engine.
 */
export function validateTakeActionBody(body: unknown): ValidationResult<TakeActionBody> {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Invalid request body" };
  }
  const obj = body as Record<string, unknown>;
  if (typeof obj.kind !== "string" || obj.kind.trim() === "") {
    return { ok: false, message: "Missing or invalid action kind" };
  }
  if (obj.payload !== undefined) {
    if (obj.payload === null || typeof obj.payload !== "object" || Array.isArray(obj.payload)) {
      return { ok: false, message: "Invalid action payload" };
    }
  }
  const data: TakeActionBody = {
    kind: obj.kind,
    ...(obj.payload !== undefined && { payload: obj.payload as Record<string, unknown> }),
  };
  return { ok: true, data };
}
