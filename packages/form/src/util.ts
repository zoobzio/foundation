import type { ZodError, ZodRawShape } from "zod";

/**
 * Collapses a ZodError into a `path -> message` record, keeping the first
 * issue per path.
 */
export const flatten = (error: ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
};

/**
 * Validates a single key of an object schema against a value. Returns the
 * first issue message, or undefined when the value passes or the key has
 * no schema entry.
 */
export const check = (
  schema: { shape: ZodRawShape },
  key: string,
  value: unknown,
): string | undefined => {
  const field = schema.shape[key];
  if (!field) return undefined;

  const result = field.safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.message;
};
