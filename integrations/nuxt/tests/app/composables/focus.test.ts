// The focus key: a bare press of the key anywhere outside a field focuses
// the target and is cancelled; a press within a field, or with a modifier
// held, is left alone; the listener goes with the component.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, useTemplateRef } from "vue";
import { useFocusKey } from "../../../app/composables/focus";

const Host = defineComponent({
  setup() {
    const field = useTemplateRef<HTMLInputElement>("field");
    useFocusKey(field, "/");
    return () => [
      h("input", { ref: "field", class: "target" }),
      h("input", { class: "other" }),
      h("div", { class: "note", contenteditable: "true" }),
    ];
  },
});

const mounted: { unmount: () => void }[] = [];

const mountHost = () => {
  const wrapper = mount(Host, { attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

const press = (
  target: EventTarget,
  init: KeyboardEventInit = {},
): KeyboardEvent => {
  const down = new KeyboardEvent("keydown", {
    key: "/",
    code: "Slash",
    bubbles: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(down);
  target.dispatchEvent(
    new KeyboardEvent("keyup", { ...init, key: "/", bubbles: true }),
  );
  return down;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("useFocusKey", () => {
  it("focuses the target on the key and cancels the press", () => {
    const wrapper = mountHost();
    const target = wrapper.get(".target").element;
    const event = press(window);
    expect(document.activeElement).toBe(target);
    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves a press within a field or an editable region alone", () => {
    const wrapper = mountHost();
    const target = wrapper.get(".target").element;
    const other = wrapper.get<HTMLInputElement>(".other").element;
    other.focus();
    expect(press(other).defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(other);
    const note = wrapper.get<HTMLElement>(".note").element;
    note.focus();
    expect(press(note).defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(target);
  });

  it("leaves a press with a modifier held alone", () => {
    const wrapper = mountHost();
    const target = wrapper.get(".target").element;
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Control", ctrlKey: true }),
    );
    const event = press(window, { ctrlKey: true });
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Control" }));
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(target);
  });

  it("ignores another key", () => {
    const wrapper = mountHost();
    const target = wrapper.get(".target").element;
    press(window, { key: "?", code: "Slash", shiftKey: true });
    expect(document.activeElement).not.toBe(target);
  });

  it("removes the listener with the component", () => {
    const wrapper = mountHost();
    const target = wrapper.get(".target").element;
    wrapper.unmount();
    mounted.pop();
    document.body.append(target);
    expect(press(window).defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(target);
  });
});
