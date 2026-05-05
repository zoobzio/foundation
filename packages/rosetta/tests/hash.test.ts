import { describe, it, expect } from "vitest";
import { hashText } from "../src/hash";

describe("hashText", () => {
  it("returns a 12-character hex string", () => {
    const result = hashText("Hello");
    expect(result).toMatch(/^[a-f0-9]{12}$/);
  });

  it("is deterministic", () => {
    expect(hashText("Save changes")).toBe(hashText("Save changes"));
  });

  it("produces different hashes for different inputs", () => {
    expect(hashText("Save")).not.toBe(hashText("Cancel"));
  });

  it("handles empty string", () => {
    const result = hashText("");
    expect(result).toMatch(/^[a-f0-9]{12}$/);
  });

  it("handles special characters", () => {
    const result = hashText("Hello {name}, welcome!");
    expect(result).toMatch(/^[a-f0-9]{12}$/);
  });
});
