import { describe, it, expect } from "vitest";
import { isLogEntry, isLogLevel } from "../src/guards";

describe("isLogLevel", () => {
  it("accepts valid levels", () => {
    expect(isLogLevel("debug")).toBe(true);
    expect(isLogLevel("info")).toBe(true);
    expect(isLogLevel("warn")).toBe(true);
    expect(isLogLevel("error")).toBe(true);
    expect(isLogLevel("fatal")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isLogLevel("trace")).toBe(false);
    expect(isLogLevel("")).toBe(false);
    expect(isLogLevel(42)).toBe(false);
    expect(isLogLevel(null)).toBe(false);
  });
});

describe("isLogEntry", () => {
  it("accepts a valid entry", () => {
    expect(isLogEntry({
      level: "info",
      message: "hello",
      timestamp: Date.now(),
    })).toBe(true);
  });

  it("accepts entry with optional fields", () => {
    expect(isLogEntry({
      level: "error",
      message: "fail",
      timestamp: Date.now(),
      data: { userId: "123" },
      hook: "app:error",
      source: "server",
    })).toBe(true);
  });

  it("rejects missing level", () => {
    expect(isLogEntry({ message: "no level", timestamp: 1 })).toBe(false);
  });

  it("rejects invalid level", () => {
    expect(isLogEntry({ level: "trace", message: "bad", timestamp: 1 })).toBe(false);
  });

  it("rejects missing message", () => {
    expect(isLogEntry({ level: "info", timestamp: 1 })).toBe(false);
  });

  it("rejects missing timestamp", () => {
    expect(isLogEntry({ level: "info", message: "no time" })).toBe(false);
  });

  it("rejects null", () => expect(isLogEntry(null)).toBe(false));
  it("rejects string", () => expect(isLogEntry("not an entry")).toBe(false));
});
