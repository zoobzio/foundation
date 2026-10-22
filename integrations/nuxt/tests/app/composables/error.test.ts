// The error builder: the code's status text, the stamp, and the options
// carried through onto the Nuxt error.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useError } from "../../../app/composables/error";

const NOW = "2026-10-22T12:00:00.000Z";

describe("useError", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds a stamped error with the code's status text", () => {
    const err = useError(404, "No such order");
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("No such order");
    expect(err.statusCode).toBe(404);
    expect(err.statusText).toBe("Not Found");
    expect(err.fatal).toBeUndefined();
    expect(err.data).toEqual({ submitted: NOW, notification: undefined });
  });

  it("carries the notification, cause, and fatal flag", () => {
    const cause = new Error("upstream");
    const err = useError(502, "Unavailable", {
      notification: { variant: "warning", title: "Try again" },
      cause,
      fatal: true,
    });
    expect(err.statusText).toBe("Bad Gateway");
    expect(err.fatal).toBe(true);
    expect(err.cause).toBe(cause);
    expect(err.data?.notification).toEqual({
      variant: "warning",
      title: "Try again",
    });
  });
});
