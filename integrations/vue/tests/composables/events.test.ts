import { describe, expect, it, vi } from "vitest";
import { useServiceEmits } from "../../src/composables/events";
import { makeTable } from "#test/mount/table";
import { withSetup } from "#test/mount/composable";

describe("useServiceEmits", () => {
  it("relays the named events with their payloads and stops on dispose", async () => {
    const { service } = makeTable();
    const emit = vi.fn();
    const { app } = withSetup(() => {
      useServiceEmits(service, ["updated", "filtered"], emit);
    });

    await service.init();
    service.query.add({ kind: "text", value: "x" });
    expect(emit).toHaveBeenCalledWith("updated", {
      id: "test-table",
      total: 3,
    });
    expect(emit).toHaveBeenCalledWith("filtered", {
      id: "test-table",
      query: "x",
      filters: [],
    });
    // `change` is not in the list.
    expect(emit.mock.calls.every(([name]) => name !== "change")).toBe(true);

    const calls = emit.mock.calls.length;
    app.unmount();
    await service.fetch();
    expect(emit.mock.calls.length).toBe(calls);
  });
});
