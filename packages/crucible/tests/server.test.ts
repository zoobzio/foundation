import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("#build/crucible.config.mjs", () => ({
  default: { minLevel: "debug", hookLevels: {} },
}));

vi.mock("nitropack/runtime", () => ({
  useNitroApp: () => ({
    hooks: { afterEach: vi.fn() },
  }),
}));

const mockWrite = vi.fn();
const mockReadBody = vi.fn();
const mockReadRawBody = vi.fn();
const mockGetHeader = vi.fn();

vi.mock("h3", () => ({
  defineEventHandler: (fn: (event: unknown) => unknown) => fn,
  readBody: (...args: unknown[]) => mockReadBody(...args),
  readRawBody: (...args: unknown[]) => mockReadRawBody(...args),
  getRequestHeader: (...args: unknown[]) => mockGetHeader(...args),
}));

const { defineCrucibleHandler } = await import("../runtime/server");

const handler = defineCrucibleHandler({ write: mockWrite });

const makeEvent = () => ({ path: "/api/crucible", context: {} });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("defineCrucibleHandler", () => {
  describe("JSON entries", () => {
    it("calls write for each valid entry", async () => {
      mockGetHeader.mockReturnValue("application/json");
      mockReadBody.mockResolvedValue([
        { level: "info", message: "hello", timestamp: 1 },
        { level: "error", message: "fail", timestamp: 2 },
      ]);
      await handler(makeEvent());
      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite.mock.calls[0][0].message).toBe("hello");
      expect(mockWrite.mock.calls[0][0].source).toBe("client");
      expect(mockWrite.mock.calls[1][0].message).toBe("fail");
    });

    it("skips invalid entries", async () => {
      mockGetHeader.mockReturnValue("application/json");
      mockReadBody.mockResolvedValue([
        { level: "info", message: "valid", timestamp: 1 },
        { invalid: true },
        "not an object",
      ]);
      await handler(makeEvent());
      expect(mockWrite).toHaveBeenCalledTimes(1);
    });

    it("handles empty array", async () => {
      mockGetHeader.mockReturnValue("application/json");
      mockReadBody.mockResolvedValue([]);
      const result = await handler(makeEvent());
      expect(result).toEqual({ ok: true });
      expect(mockWrite).not.toHaveBeenCalled();
    });

    it("handles non-array body", async () => {
      mockGetHeader.mockReturnValue("application/json");
      mockReadBody.mockResolvedValue({ not: "array" });
      const result = await handler(makeEvent());
      expect(result).toEqual({ ok: true });
      expect(mockWrite).not.toHaveBeenCalled();
    });
  });

  describe("sendBeacon (text/plain)", () => {
    it("parses JSON from text body", async () => {
      mockGetHeader.mockReturnValue("text/plain");
      mockReadRawBody.mockResolvedValue(JSON.stringify([
        { level: "warn", message: "beacon", timestamp: 3 },
      ]));
      await handler(makeEvent());
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite.mock.calls[0][0].message).toBe("beacon");
      expect(mockWrite.mock.calls[0][0].source).toBe("client");
    });

    it("handles malformed text body", async () => {
      mockGetHeader.mockReturnValue("text/plain");
      mockReadRawBody.mockResolvedValue("not json");
      const result = await handler(makeEvent());
      expect(result).toEqual({ ok: true });
      expect(mockWrite).not.toHaveBeenCalled();
    });
  });
});
