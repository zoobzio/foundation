import { describe, it, expect } from "vitest";
import { status } from "ltrl-http";
import { fatal, error, warning, info } from "#foundation/utils/errors";

describe("error factories", () => {
  it("fatal returns an error with fatal: true", () => {
    const err = fatal({ code: status.NOT_FOUND, message: "Page not found" });
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Page not found");
    expect(err.fatal).toBe(true);
    expect(err.data).toEqual({ severity: "fatal", detail: undefined });
  });

  it("error returns a non-fatal error with severity 'error'", () => {
    const err = error({ code: status.INTERNAL_SERVER_ERROR, message: "Save failed" });
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe("Save failed");
    expect(err.fatal).toBe(false);
    expect(err.data).toEqual({ severity: "error", detail: undefined });
  });

  it("warning returns a non-fatal error with severity 'warning'", () => {
    const err = warning({ code: status.TOO_MANY_REQUESTS, message: "Slow down" });
    expect(err.statusCode).toBe(429);
    expect(err.message).toBe("Slow down");
    expect(err.fatal).toBe(false);
    expect(err.data).toEqual({ severity: "warning", detail: undefined });
  });

  it("info returns a non-fatal error with severity 'info'", () => {
    const err = info({ code: status.OK, message: "Changes saved" });
    expect(err.statusCode).toBe(200);
    expect(err.message).toBe("Changes saved");
    expect(err.fatal).toBe(false);
    expect(err.data).toEqual({ severity: "info", detail: undefined });
  });

  it("passes custom data through as detail", () => {
    const data = { kind: "validation", field: "email" };
    const err = error({ code: status.BAD_REQUEST, message: "Invalid input", data });
    expect(err.data).toEqual({ severity: "error", detail: data });
  });
});
