// The log store: two keyed containers, shared by every caller, with the
// level at `info` and the backlog empty to start.
import { describe, expect, it } from "vitest";
import { accessLogs } from "../../../app/stores/log";

describe("accessLogs", () => {
  it("starts at info with an empty backlog", () => {
    const { level, backlog } = accessLogs();
    expect(level.value).toBe("info");
    expect(backlog.value).toEqual([]);
  });

  it("shares both refs across calls", () => {
    const first = accessLogs();
    first.level.value = "debug";
    const second = accessLogs();
    expect(second.level).toBe(first.level);
    expect(second.backlog).toBe(first.backlog);
    expect(second.level.value).toBe("debug");
  });
});
