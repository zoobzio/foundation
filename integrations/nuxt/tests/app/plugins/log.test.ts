// The plugin provides the root logger and the logger constructor.
import { describe, expect, it } from "vitest";
import plugin from "../../../app/plugins/log";
import { useLogger } from "../../../app/composables/log";

describe("plugins/log", () => {
  it("provides the root logger and the constructor", () => {
    const result = plugin();
    if (!result || !("provide" in result) || !result.provide) {
      throw new Error("plugin provided nothing");
    }
    const { log, logger } = result.provide;
    expect(logger).toBe(useLogger);
    log.info("Hello");
    expect(log.backlog.value.map((line) => [line.name, line.message])).toEqual([
      ["app", "Hello"],
    ]);
    expect(logger("users").backlog).toBe(log.backlog);
  });
});
