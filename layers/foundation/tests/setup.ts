import { vi } from "vitest";
import { status } from "ltrl-http";

// Foundation auto-imports
vi.stubGlobal("status", status);
vi.stubGlobal("createError", (input: Record<string, unknown>) => {
  const err = new Error(typeof input === "string" ? input : (input.message ?? "")) as Error & Record<string, unknown>;
  if (typeof input === "object") {
    err.statusCode = input.statusCode;
    err.fatal = input.fatal;
    err.data = input.data;
  }
  return err;
});
vi.stubGlobal("showError", vi.fn());
vi.stubGlobal("clearError", vi.fn());
vi.stubGlobal("useHead", vi.fn());
