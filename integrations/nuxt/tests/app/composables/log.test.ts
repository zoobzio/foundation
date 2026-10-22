// The logger: lines at or above the level are kept with the logger's name,
// lines below are dropped, and every logger shares the level and backlog.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLogger } from "../../../app/composables/log";

const NOW = "2026-10-22T12:00:00.000Z";

describe("useLogger", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps a line at or above the level and stamps it", () => {
    const log = useLogger("users");
    log.info("Loaded", { count: 2 });
    log.warn("Slow");
    expect(log.backlog.value).toEqual([
      {
        name: "users",
        level: "info",
        message: "Loaded",
        data: { count: 2 },
        submitted: NOW,
      },
      {
        name: "users",
        level: "warn",
        message: "Slow",
        data: {},
        submitted: NOW,
      },
    ]);
  });

  it("drops a line below the level", () => {
    const log = useLogger();
    log.debug("Hidden");
    log.trace("Hidden too");
    expect(log.backlog.value).toEqual([]);
  });

  it("follows the level as it changes", () => {
    const log = useLogger();
    log.level.value = "debug";
    log.debug("Now visible");
    log.level.value = "error";
    log.warn("Now hidden");
    log.error("Still visible");
    expect(log.backlog.value.map((line) => line.message)).toEqual([
      "Now visible",
      "Still visible",
    ]);
  });

  it("defaults the name to the root and shares the backlog", () => {
    const root = useLogger();
    const users = useLogger("users");
    root.info("From root");
    users.info("From users");
    expect(root.backlog).toBe(users.backlog);
    expect(root.backlog.value.map((line) => line.name)).toEqual([
      "app",
      "users",
    ]);
  });
});
