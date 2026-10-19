// Constructor-injected seams — a plain state container, vi.fn() Actions
// fakes, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (action calls,
// events).
import { describe, expect, it, vi } from "vitest";
import { FormService } from "../src/service";
import { createFormState } from "../src/state";
import type {
  Actions,
  Change,
  Config,
  Options,
  Service,
  State,
} from "../src/types";
import { defaults, fakeConfig, validPayload } from "./data";
import type { Payload } from "./data";

const makeService = (
  overrides: {
    state?: State<Payload>;
    actions?: Actions<Payload>;
    config?: Partial<Config<Payload>>;
    options?: Options<Payload>;
  } = {},
) => {
  const config = { ...fakeConfig, ...overrides.config };
  const state = overrides.state ?? createFormState<Payload>(config);
  const actions = overrides.actions ?? {};
  const service = new FormService<Payload>(
    "test-form",
    config,
    state,
    actions,
    overrides.options,
  );
  const initialized = vi.fn();
  const submitted = vi.fn();
  const rejected = vi.fn();
  const restored = vi.fn();
  const reset = vi.fn();
  const failed = vi.fn();
  service.on("initialized", initialized);
  service.on("submitted", submitted);
  service.on("rejected", rejected);
  service.on("restored", restored);
  service.on("reset", reset);
  service.on("failed", failed);
  return {
    service,
    state,
    actions,
    initialized,
    submitted,
    rejected,
    restored,
    reset,
    failed,
  };
};

describe("config", () => {
  it("exposes the id and config", () => {
    const { service } = makeService();
    expect(service.id).toBe("test-form");
    expect(service.config).toEqual(fakeConfig);
  });

  it("actions default to none", () => {
    const service = new FormService<Payload>(
      "bare",
      fakeConfig,
      createFormState(fakeConfig),
    );
    expect(service.payload).toEqual(defaults);
  });
});

describe("initialize", () => {
  it("runs the init action with the service and emits initialized", async () => {
    const init = vi.fn(async (service: Service<Payload>) => {
      service.set("amount", 5);
    });
    const { service, initialized } = makeService({ actions: { init } });
    await expect(service.initialize()).resolves.toBe(true);
    expect(init).toHaveBeenCalledWith(service);
    expect(service.initialized).toBe(true);
    expect(initialized).toHaveBeenCalledWith({
      id: "test-form",
      data: { ...defaults, amount: 5 },
    });
  });

  it("initializes without an init action", async () => {
    const { service, initialized } = makeService();
    await service.initialize();
    expect(service.initialized).toBe(true);
    expect(initialized).toHaveBeenCalledOnce();
  });

  it("runs once and guards re-entry", async () => {
    const init = vi.fn(async () => {});
    const { service, initialized } = makeService({ actions: { init } });
    await service.initialize();
    await expect(service.initialize()).resolves.toBe(true);
    expect(init).toHaveBeenCalledOnce();
    expect(initialized).toHaveBeenCalledOnce();
  });

  it("emits failed and rethrows when the init action throws", async () => {
    const cause = new Error("boom");
    const init = vi.fn(async () => {
      throw cause;
    });
    const { service, initialized, failed } = makeService({
      actions: { init },
    });
    await expect(service.initialize()).rejects.toBe(cause);
    expect(service.initialized).toBe(false);
    expect(initialized).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledWith({
      id: "test-form",
      stage: "init",
      cause,
    });
  });
});

describe("check", () => {
  it("records the first issue of a failing key", () => {
    const { service } = makeService();
    service.set("email", "nope");
    expect(service.check("email")).toBe(false);
    expect(service.errors).toEqual({ email: "Invalid email" });
  });

  it("clears the key's error when it passes and keeps the others", () => {
    const { service, state } = makeService();
    state.errors = { email: "Invalid email", name: "Name is required" };
    service.set("email", "a@b.co");
    expect(service.check("email")).toBe(true);
    expect(service.errors).toEqual({ name: "Name is required" });
  });
});

describe("validate", () => {
  it("records every error and touches every field on failure", () => {
    const { service } = makeService();
    expect(service.validate()).toBe(false);
    expect(service.errors).toEqual({
      email: "Required",
      amount: "Required",
    });
    expect(service.touched).toEqual(
      new Set(["name", "email", "amount", "active"]),
    );
  });

  it("leaves state untouched on success", () => {
    const { service } = makeService();
    service.update(validPayload);
    expect(service.validate()).toBe(true);
    expect(service.errors).toEqual({});
    expect(service.touched).toEqual(new Set());
  });

  it("validates an explicit payload instead of the current one", () => {
    const { service } = makeService();
    expect(service.validate(validPayload)).toBe(true);
    expect(service.validate({ name: "" })).toBe(false);
  });
});

describe("set", () => {
  it("writes one key as a new payload object", () => {
    const { service, state } = makeService();
    const before = state.payload;
    service.set("amount", 42);
    expect(service.payload).toEqual({ ...defaults, amount: 42 });
    expect(state.payload).not.toBe(before);
  });

  it("applies the key's value middleware", () => {
    const { service } = makeService({
      actions: { middleware: { name: (v) => v.trim() } },
    });
    service.set("name", "  Bob  ");
    expect(service.payload.name).toBe("Bob");
  });

  it("stores undefined without calling the middleware", () => {
    const trim = vi.fn((v: string) => v.trim());
    const { service } = makeService({
      actions: { middleware: { name: trim } },
    });
    service.set("name", undefined);
    expect(trim).not.toHaveBeenCalled();
    expect(service.payload.name).toBeUndefined();
    expect("name" in service.payload).toBe(true);
  });

  it("accepts the value-first overload", () => {
    const { service } = makeService();
    const write = <V>(form: Service<Payload>, key: never, value: V) =>
      form.set<V>(key, value);
    write(service, "active" as never, false);
    expect(service.payload.active).toBe(false);
  });
});

describe("update", () => {
  it("sets every defined key and skips undefined ones", () => {
    const { service } = makeService({
      actions: { middleware: { name: (v) => v.toUpperCase() } },
    });
    service.update({ name: "bob", amount: 3, email: undefined });
    expect(service.payload).toEqual({ ...defaults, name: "BOB", amount: 3 });
  });

  it("payload setter routes through update", () => {
    const { service } = makeService();
    service.payload = { amount: 7 };
    expect(service.payload).toEqual({ ...defaults, amount: 7 });
  });
});

describe("restore", () => {
  it("resets then applies a valid record and emits reset then restored", () => {
    const { service, state, restored, reset } = makeService({
      actions: { middleware: { name: (v) => v.toUpperCase() } },
    });
    state.errors = { name: "x" };
    state.touched = new Set(["name"]);
    state.submitted = true;
    const order: string[] = [];
    service.on("reset", () => order.push("reset"));
    service.on("restored", () => order.push("restored"));

    service.restore(validPayload);

    expect(service.payload).toEqual({ ...validPayload, name: "BOB" });
    expect(service.errors).toEqual({});
    expect(service.touched).toEqual(new Set());
    expect(service.submitted).toBe(false);
    expect(reset).toHaveBeenCalledOnce();
    expect(restored).toHaveBeenCalledWith({
      id: "test-form",
      data: validPayload,
    });
    expect(order).toEqual(["reset", "restored"]);
  });

  it("emits failed and throws on an invalid record, leaving state alone", () => {
    const { service, state, restored, reset, failed } = makeService();
    state.payload = { name: "Keep" };
    const bad = { ...validPayload, email: "nope" };

    expect(() => service.restore(bad)).toThrow("Invalid email");
    expect(service.payload).toEqual({ name: "Keep" });
    expect(reset).not.toHaveBeenCalled();
    expect(restored).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledOnce();
    expect(failed.mock.calls[0]?.[0]).toMatchObject({
      id: "test-form",
      stage: "restore",
    });
  });
});

describe("touch", () => {
  it("adds the key to a new touched set", () => {
    const { service, state } = makeService();
    const before = state.touched;
    service.touch("name");
    service.touch("email");
    expect(service.touched).toEqual(new Set(["name", "email"]));
    expect(state.touched).not.toBe(before);
  });
});

describe("submit", () => {
  it("rejects an invalid payload without calling the action", async () => {
    const submit = vi.fn(async () => {});
    const { service, submitted, rejected } = makeService({
      actions: { submit },
    });
    await service.submit();
    expect(submit).not.toHaveBeenCalled();
    expect(submitted).not.toHaveBeenCalled();
    expect(service.submitted).toBe(false);
    expect(rejected).toHaveBeenCalledWith({
      id: "test-form",
      data: defaults,
      errors: { email: "Required", amount: "Required" },
    });
  });

  it("runs the action on a valid payload and emits submitted", async () => {
    const submit = vi.fn(async (service: Service<Payload>) => {
      expect(service.submitting).toBe(true);
    });
    const { service, submitted } = makeService({ actions: { submit } });
    service.update(validPayload);

    const flight = service.submit();
    expect(service.submitting).toBe(true);
    await flight;

    expect(submit).toHaveBeenCalledWith(service);
    expect(service.submitting).toBe(false);
    expect(service.submitted).toBe(true);
    expect(submitted).toHaveBeenCalledWith({
      id: "test-form",
      data: validPayload,
    });
  });

  it("submits without a submit action", async () => {
    const { service, submitted } = makeService();
    service.update(validPayload);
    await service.submit();
    expect(service.submitted).toBe(true);
    expect(submitted).toHaveBeenCalledOnce();
  });

  it("emits failed, rethrows, and clears submitting when the action throws", async () => {
    const cause = new Error("boom");
    const submit = vi.fn(async () => {
      throw cause;
    });
    const { service, submitted, failed } = makeService({
      actions: { submit },
    });
    service.update(validPayload);
    await expect(service.submit()).rejects.toBe(cause);
    expect(service.submitting).toBe(false);
    expect(service.submitted).toBe(false);
    expect(submitted).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledWith({
      id: "test-form",
      stage: "submit",
      cause,
    });
  });
});

describe("reset", () => {
  it("returns every field to its default and emits reset", () => {
    const { service, state, reset } = makeService();
    service.update(validPayload);
    state.errors = { name: "x" };
    state.touched = new Set(["name"]);
    state.submitted = true;

    service.reset();

    expect(service.payload).toEqual(defaults);
    expect(service.payload).not.toBe(defaults);
    expect(service.errors).toEqual({});
    expect(service.touched).toEqual(new Set());
    expect(service.submitted).toBe(false);
    expect(reset).toHaveBeenCalledWith({ id: "test-form", data: defaults });
  });
});

describe("valid", () => {
  it("reflects the schema over the current payload without writing", () => {
    const { service, state } = makeService();
    expect(service.valid).toBe(false);
    service.update(validPayload);
    expect(service.valid).toBe(true);
    expect(state.errors).toEqual({});
  });
});

describe("middleware", () => {
  it("get middleware shapes every read of its field", () => {
    const { service, state } = makeService({
      options: {
        get: { state: { submitted: (submitted) => !submitted } },
      },
    });
    expect(service.submitted).toBe(true);
    expect(state.submitted).toBe(false);
  });

  it("set middleware shapes the stored value", () => {
    const { service, state } = makeService({
      options: {
        set: {
          state: {
            payload: (payload) => ({ ...payload, name: payload.name?.trim() }),
          },
        },
      },
    });
    service.set("name", "  Bob  ");
    expect(state.payload.name).toBe("Bob");
    expect(service.payload.name).toBe("Bob");
  });

  it("a missing slot passes the value on", () => {
    const { service, state } = makeService({ options: { get: {}, set: {} } });
    service.touch("name");
    expect(state.touched).toEqual(new Set(["name"]));
    expect(service.touched).toEqual(new Set(["name"]));
  });
});

describe("events", () => {
  it("emits change for every write, after the set middleware", () => {
    const changes: Change<Payload>[] = [];
    const { service } = makeService({
      options: { set: { state: { submitting: () => true } } },
    });
    service.on("change", (change) => changes.push(change));
    service.touch("name");
    expect(changes).toEqual([
      { field: "touched", before: new Set(), after: new Set(["name"]) },
    ]);
  });

  it("change narrows on field", () => {
    const { service } = makeService();
    const seen: Partial<Payload>[] = [];
    service.on("change", (change) => {
      if (change.field === "payload") seen.push(change.after);
    });
    service.set("amount", 1);
    service.touch("amount");
    expect(seen).toEqual([{ ...defaults, amount: 1 }]);
  });

  it("calls listeners in subscription order and unsubscribes", () => {
    const { service } = makeService();
    const order: string[] = [];
    const off = service.on("reset", () => order.push("a"));
    service.on("reset", () => order.push("b"));
    service.reset();
    off();
    service.reset();
    expect(order).toEqual(["a", "b", "b"]);
  });

  it("a listener can unsubscribe itself during the call", () => {
    const { service } = makeService();
    const calls = vi.fn();
    const off = service.on("reset", () => {
      calls();
      off();
    });
    service.reset();
    service.reset();
    expect(calls).toHaveBeenCalledOnce();
  });

  it("skips the change object when nothing listens", () => {
    const { service, state } = makeService();
    service.touch("name");
    expect(state.touched).toEqual(new Set(["name"]));
  });
});
