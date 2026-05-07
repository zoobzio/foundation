import { describe, it, expect } from "vitest";
import { meetsLevel } from "../src/levels";

describe("meetsLevel", () => {
  it("debug meets debug", () => expect(meetsLevel("debug", "debug")).toBe(true));
  it("info meets debug", () => expect(meetsLevel("info", "debug")).toBe(true));
  it("debug does not meet info", () => expect(meetsLevel("debug", "info")).toBe(false));
  it("error meets warn", () => expect(meetsLevel("error", "warn")).toBe(true));
  it("warn does not meet error", () => expect(meetsLevel("warn", "error")).toBe(false));
  it("fatal meets everything", () => expect(meetsLevel("fatal", "fatal")).toBe(true));
  it("debug does not meet fatal", () => expect(meetsLevel("debug", "fatal")).toBe(false));
});
