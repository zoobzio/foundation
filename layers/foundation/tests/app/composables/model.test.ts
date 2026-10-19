// Gold standard: composables. Pure reactive paths run through withSetup (a
// real setup() scope, no template); the `explicit` path inspects the mounting
// vnode, so it earns a harness component and one mount per detection path.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { useModel } from "../../../app/composables/model";
import { withSetup } from "#test/mount/composable";

describe("useModel", () => {
  it("reads the prop while provided, falls back to the default", () => {
    const { result: $model } = withSetup(() =>
      useModel<string>(() => "controlled", vi.fn(), { default: "fallback" }),
    );
    expect($model.value).toBe("controlled");
  });

  it("serves the internal default when the prop is absent", () => {
    const { result: $model } = withSetup(() =>
      useModel<string>(() => undefined, vi.fn(), { default: "fallback" }),
    );
    expect($model.value).toBe("fallback");
  });

  it("set updates internal state and emits", () => {
    const emit = vi.fn();
    const { result: $model } = withSetup(() =>
      useModel<string>(() => undefined, emit, { default: "a" }),
    );
    $model.value = "b";
    expect(emit).toHaveBeenCalledWith("b");
    expect($model.value).toBe("b");
  });

  it("prop wins over a previously set internal value", () => {
    const { result: $model } = withSetup(() =>
      useModel<string>(() => "prop", vi.fn()),
    );
    $model.value = "internal";
    expect($model.value).toBe("prop");
  });
});

describe("useModel explicit", () => {
  // The explicit option switches controlled/uncontrolled on whether the parent
  // actually passed the prop — observable only through a real mount. The
  // harness renders the model value and toggles it on click so tests stay in
  // the DOM.
  const Harness = defineComponent({
    props: {
      openValue: { type: Boolean, default: undefined },
    },
    emits: ["update:openValue"],
    setup(props, { emit }) {
      const $open = useModel<boolean>(
        () => props.openValue,
        (v) => emit("update:openValue", v),
        { default: false, explicit: "openValue" },
      );
      return () =>
        h(
          "button",
          { onClick: () => ($open.value = !$open.value) },
          String($open.value),
        );
    },
  });

  it("uncontrolled when the prop is not passed — internal state drives", async () => {
    const wrapper = mount(Harness);
    expect(wrapper.text()).toBe("false");
    await wrapper.trigger("click");
    expect(wrapper.text()).toBe("true");
    expect(wrapper.emitted("update:openValue")).toEqual([[true]]);
  });

  it("controlled when the prop is passed — reads the prop even after set", async () => {
    const wrapper = mount(Harness, { props: { openValue: false } });
    await wrapper.trigger("click");
    // Parent never updated the prop, so the model still reports it.
    expect(wrapper.text()).toBe("false");
    expect(wrapper.emitted("update:openValue")).toEqual([[true]]);
  });

  it("detects kebab-case prop spelling as provided", async () => {
    const wrapper = mount(Harness, { attrs: { "open-value": false } });
    await wrapper.trigger("click");
    expect(wrapper.text()).toBe("false");
  });
});
