import { describe, expect, it, vi } from "vitest";
import { makeEmitter } from "../src/emitter";

type Map = { ping: [n: number]; quiet: [] };

describe("makeEmitter", () => {
  it("calls listeners in subscription order with the arguments", () => {
    const bus = makeEmitter<Map>();
    const order: string[] = [];
    bus.on("ping", (n) => order.push(`a${n}`));
    bus.on("ping", (n) => order.push(`b${n}`));
    bus.emit("ping", 1);
    expect(order).toEqual(["a1", "b1"]);
  });

  it("returns an unsubscribe function", () => {
    const bus = makeEmitter<Map>();
    const listener = vi.fn();
    const off = bus.on("ping", listener);
    off();
    bus.emit("ping", 1);
    expect(listener).not.toHaveBeenCalled();
  });

  it("lets a listener unsubscribe itself during the call", () => {
    const bus = makeEmitter<Map>();
    const seen = vi.fn();
    const off = bus.on("ping", () => {
      seen();
      off();
    });
    bus.emit("ping", 1);
    bus.emit("ping", 2);
    expect(seen).toHaveBeenCalledOnce();
  });

  it("heard reports whether an event has a listener", () => {
    const bus = makeEmitter<Map>();
    expect(bus.heard("quiet")).toBe(false);
    const off = bus.on("quiet", () => {});
    expect(bus.heard("quiet")).toBe(true);
    off();
    expect(bus.heard("quiet")).toBe(false);
  });

  it("emits with no listeners without error", () => {
    const bus = makeEmitter<Map>();
    expect(() => bus.emit("quiet")).not.toThrow();
  });
});
