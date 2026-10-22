// The queue over the store: push assigns an id and appends, remove drops by
// id, and both operate on the shared list.
import { describe, expect, it } from "vitest";
import { useNotifications } from "../../../app/composables/notification";

describe("useNotifications", () => {
  it("push appends the notification with a fresh id", () => {
    const { notifications, push } = useNotifications();
    const a = push({ variant: "success", title: "Saved" });
    const b = push({ variant: "error", title: "Failed", description: "Why" });
    expect(a.id).not.toBe(b.id);
    expect(notifications.value).toEqual([
      { id: a.id, variant: "success", title: "Saved" },
      { id: b.id, variant: "error", title: "Failed", description: "Why" },
    ]);
  });

  it("remove drops the notification with that id only", () => {
    const { notifications, push, remove } = useNotifications();
    const a = push({ variant: "info", title: "One" });
    const b = push({ variant: "info", title: "Two" });
    remove(a.id);
    expect(notifications.value).toEqual([b]);
    remove("missing");
    expect(notifications.value).toEqual([b]);
  });

  it("every caller sees the same queue", () => {
    const producer = useNotifications();
    const consumer = useNotifications();
    const entry = producer.push({ variant: "warning", title: "Heads up" });
    expect(consumer.notifications.value).toEqual([entry]);
    consumer.remove(entry.id);
    expect(producer.notifications.value).toEqual([]);
  });
});
