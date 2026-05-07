import { describe, it, expect } from "vitest";
import { defineRampart } from "../src/config";

describe("defineRampart", () => {
  it("returns the config as-is", () => {
    const config = defineRampart({
      basePath: "/auth",
      publicRoutes: ["/"],
    });
    expect(config.basePath).toBe("/auth");
    expect(config.publicRoutes).toEqual(["/"]);
  });
});
