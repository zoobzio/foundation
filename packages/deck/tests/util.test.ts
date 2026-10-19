import { describe, expect, it } from "vitest";
import { change, sortLabel } from "../src/util";
import type { FakeRow } from "./data";

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<FakeRow>("query", "", "acme")).toEqual({
      field: "query",
      before: "",
      after: "acme",
    });
  });
});

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
