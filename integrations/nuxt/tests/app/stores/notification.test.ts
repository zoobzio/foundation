// The notification store is one keyed container: every caller shares the
// same list, and it starts empty.
import { describe, expect, it } from "vitest";
import { accessNotifications } from "../../../app/stores/notification";

describe("accessNotifications", () => {
  it("starts with an empty list", () => {
    const { notifications } = accessNotifications();
    expect(notifications.value).toEqual([]);
  });

  it("shares one list across calls", () => {
    const first = accessNotifications();
    first.notifications.value = [{ id: "a", variant: "info", title: "Hello" }];
    const second = accessNotifications();
    expect(second.notifications).toBe(first.notifications);
    expect(second.notifications.value).toEqual([
      { id: "a", variant: "info", title: "Hello" },
    ]);
  });
});
