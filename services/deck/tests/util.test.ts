import { describe, expect, it } from "vitest";
import { sortLabel } from "../src/util";

describe("sortLabel", () => {
  it("uses the known label of a common sort field", () => {
    expect(sortLabel("created")).toBe("Created");
    expect(sortLabel("modified")).toBe("Modified");
  });

  it("capitalizes an unknown field", () => {
    expect(sortLabel("shipped")).toBe("Shipped");
    expect(sortLabel("")).toBe("");
  });
});
