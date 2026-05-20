import { describe, it, expect } from "vitest";
import { defineAuth } from "../src/config";

describe("defineAuth", () => {
  it("returns the config as-is", () => {
    const config = defineAuth({
      basePath: "/auth",
      publicRoutes: ["/"],
    });
    expect(config.basePath).toBe("/auth");
    expect(config.publicRoutes).toEqual(["/"]);
  });
});
