import { describe, expect, it } from "vitest";
import { createFormState } from "../src/state";
import { FORM_STATE_FIELDS } from "../src/constants";
import { defaults, fakeConfig } from "./data";
import type { Payload } from "./data";

describe("createFormState", () => {
  it("initializes every field with its default", () => {
    const state = createFormState<Payload>(fakeConfig);
    expect(state).toEqual({
      initialized: false,
      payload: { name: "Alice", active: true },
      errors: {},
      touched: new Set(),
      submitting: false,
      submitted: false,
    });
  });

  it("copies the defaults rather than sharing them", () => {
    const state = createFormState<Payload>(fakeConfig);
    expect(state.payload).not.toBe(defaults);
    state.payload.name = "Bob";
    expect(defaults.name).toBe("Alice");
  });

  it("payload is empty with no defaults", () => {
    const state = createFormState<Payload>({
      ...fakeConfig,
      defaults: undefined,
    });
    expect(state.payload).toEqual({});
  });

  it("each call returns an independent container", () => {
    const a = createFormState<Payload>(fakeConfig);
    const b = createFormState<Payload>(fakeConfig);
    a.touched.add("name");
    a.errors.name = "bad";
    expect(b.touched.size).toBe(0);
    expect(b.errors).toEqual({});
  });

  it("FORM_STATE_FIELDS names exactly the container's fields", () => {
    const state = createFormState<Payload>(fakeConfig);
    expect(Object.keys(FORM_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
