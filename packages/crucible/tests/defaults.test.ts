import { describe, it, expect } from "vitest";
import { defaultHookLevels } from "../src/defaults";

describe("defaultHookLevels", () => {
  it("maps app:error to error", () => {
    expect(defaultHookLevels["app:error"]).toBe("error");
  });

  it("maps app:chunkError to error", () => {
    expect(defaultHookLevels["app:chunkError"]).toBe("error");
  });

  it("maps vue:error to error", () => {
    expect(defaultHookLevels["vue:error"]).toBe("error");
  });

  it("maps app:error:cleared to warn", () => {
    expect(defaultHookLevels["app:error:cleared"]).toBe("warn");
  });

  it("maps app:created to info", () => {
    expect(defaultHookLevels["app:created"]).toBe("info");
  });

  it("maps page:finish to info", () => {
    expect(defaultHookLevels["page:finish"]).toBe("info");
  });

  it("maps page:start to debug", () => {
    expect(defaultHookLevels["page:start"]).toBe("debug");
  });

  it("maps vue:setup to debug", () => {
    expect(defaultHookLevels["vue:setup"]).toBe("debug");
  });

  it("has entries for all runtime hooks", () => {
    const expected = [
      "app:created", "app:beforeMount", "app:mounted", "app:rendered",
      "app:redirected", "app:suspense:resolve", "app:error", "app:error:cleared",
      "app:chunkError", "app:data:refresh", "app:manifest:update",
      "page:start", "page:finish", "page:transition:finish",
      "page:view-transition:start", "page:loading:start", "page:loading:end",
      "vue:setup", "vue:error", "dev:ssr-logs", "link:prefetch",
    ];
    for (const hook of expected) {
      expect(defaultHookLevels[hook]).toBeDefined();
    }
  });
});
