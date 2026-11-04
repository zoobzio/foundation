import { describe, expect, it } from "vitest";
import { z } from "zod";
import { check, flatten } from "../src/util";
import { schema } from "./data";

describe("flatten", () => {
  it("keeps the first issue per path", () => {
    const result = z
      .object({ name: z.string().min(2, "short").max(1, "long") })
      .safeParse({ name: "a".repeat(3) });
    if (result.success) throw new Error("expected failure");
    expect(flatten(result.error)).toEqual({ name: "long" });
  });

  it("joins nested paths with dots", () => {
    const result = z
      .object({ address: z.object({ city: z.string() }) })
      .safeParse({ address: { city: 1 } });
    if (result.success) throw new Error("expected failure");
    expect(Object.keys(flatten(result.error))).toEqual(["address.city"]);
  });
});

describe("check", () => {
  it("returns undefined for a key without a schema entry", () => {
    expect(check(schema, "ghost", "anything")).toBeUndefined();
  });

  it("returns undefined when the value passes", () => {
    expect(check(schema, "email", "a@b.co")).toBeUndefined();
  });

  it("returns the first issue message when the value fails", () => {
    expect(check(schema, "email", "nope")).toBe("Invalid email");
    expect(check(schema, "name", "")).toBe("Name is required");
  });
});
