// Gold standard: element wrappers. The shared axes run through the element
// suite; only button-specific behavior (type default, disabled forwarding,
// ctx slot scope) earns its own mounts.
import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import Button from "#foundation/components/common/button.vue";
import { runElementSuite } from "#test/suites/element";

runElementSuite("button", {
  mount: (props = {}, slots = {}) => mount(Button, { props, slots }),
  tag: "button",
  events: ["click"],
});

describe("button", () => {
  it("defaults type to button, honors an explicit type", () => {
    expect(mount(Button).get("button").attributes("type")).toBe("button");
    expect(
      mount(Button, { props: { type: "submit" } })
        .get("button")
        .attributes("type"),
    ).toBe("submit");
  });

  it("disabled reaches the native attribute", () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });

  it("serves its view model to the default slot as ctx", () => {
    const wrapper = mount(Button, {
      props: { label: "Save", disabled: true },
      slots: {
        default: (ctx: { label?: string; disabled?: boolean }) =>
          h("span", `${ctx.label}:${ctx.disabled}`),
      },
    });
    expect(wrapper.text()).toBe("Save:true");
  });
});
