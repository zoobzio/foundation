import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useAutocomplete } from "../../src/composables/autocomplete";
import { fakeOptions, fakeOptionsWithDisabled } from "#test/data/options";
import { withSetup } from "#test/mount/composable";

const setup = (
  overrides: Partial<{
    model: string | undefined;
    items: typeof fakeOptions;
    trail: (typeof fakeOptions)[];
    steps: typeof fakeOptions;
  }> = {},
) => {
  const emit = vi.fn();
  const model = ref<string | undefined>(overrides.model);
  const source = ref({
    items: overrides.items ?? fakeOptionsWithDisabled,
    trail: overrides.trail ?? [],
    steps: overrides.steps ?? [],
  });
  const { result } = withSetup(() =>
    useAutocomplete(model, () => source.value, emit),
  );
  return { ...result, emit, model, source };
};

const keydown = (key: string, prevented = false) => {
  const event = new KeyboardEvent("keydown", { key, cancelable: true });
  if (prevented) event.preventDefault();
  return event;
};

/** A scrollable element with fixed geometry; happy-dom does no layout. */
const scrollable = (scrollTop: number) => {
  const el = document.createElement("div");
  Object.defineProperties(el, {
    scrollTop: { value: scrollTop, writable: true, configurable: true },
    clientHeight: { value: 200, configurable: true },
    scrollHeight: { value: 1000, configurable: true },
  });
  return el;
};

const scroll = (el: HTMLElement, handler: (event: Event) => void) => {
  el.addEventListener("scroll", handler);
  el.dispatchEvent(new Event("scroll"));
  el.removeEventListener("scroll", handler);
};

describe("useAutocomplete panels", () => {
  it("stacks the trail panels, then the items", () => {
    const { panels } = setup({ trail: [fakeOptions] });
    expect(panels.value).toEqual([fakeOptions, fakeOptionsWithDisabled]);
  });

  it("omits the items panel when there are no items", () => {
    const { panels } = setup({ items: [], trail: [fakeOptions] });
    expect(panels.value).toEqual([fakeOptions]);
  });

  it("tracks the source", () => {
    const { panels, source } = setup();
    expect(panels.value).toHaveLength(1);
    source.value = { ...source.value, trail: [fakeOptions] };
    expect(panels.value).toHaveLength(2);
  });
});

describe("useAutocomplete select", () => {
  it("emits the option when enabled", () => {
    const { select, emit } = setup();
    const active = fakeOptionsWithDisabled[0];
    if (!active) throw new Error("fixture is empty");
    select(active);
    expect(emit).toHaveBeenCalledWith("select", active);
  });

  it("ignores a disabled option", () => {
    const { select, emit } = setup();
    const disabled = fakeOptionsWithDisabled[1];
    if (!disabled?.disabled) throw new Error("fixture lost its disabled entry");
    select(disabled);
    expect(emit).not.toHaveBeenCalled();
  });
});

describe("useAutocomplete keydown", () => {
  it("submits the input text on an unclaimed Enter", () => {
    const { onInputKeydown, emit } = setup({ model: "app" });
    const event = keydown("Enter");
    onInputKeydown(event);
    expect(emit).toHaveBeenCalledWith("submit", "app");
    expect(event.defaultPrevented).toBe(true);
  });

  it("submits an empty string when the model is undefined", () => {
    const { onInputKeydown, emit } = setup();
    onInputKeydown(keydown("Enter"));
    expect(emit).toHaveBeenCalledWith("submit", "");
  });

  it("leaves an Enter reka already claimed alone", () => {
    const { onInputKeydown, emit } = setup({ model: "app" });
    onInputKeydown(keydown("Enter", true));
    expect(emit).not.toHaveBeenCalled();
  });

  it("unwraps on Backspace when the input is empty and steps exist", () => {
    const { onInputKeydown, emit } = setup({ steps: fakeOptions });
    const event = keydown("Backspace");
    onInputKeydown(event);
    expect(emit).toHaveBeenCalledWith("unwrap");
    expect(event.defaultPrevented).toBe(true);
  });

  it("lets Backspace edit text when the input has content", () => {
    const { onInputKeydown, emit } = setup({
      model: "a",
      steps: fakeOptions,
    });
    const event = keydown("Backspace");
    onInputKeydown(event);
    expect(emit).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("does nothing on Backspace without steps", () => {
    const { onInputKeydown, emit } = setup();
    onInputKeydown(keydown("Backspace"));
    expect(emit).not.toHaveBeenCalled();
  });

  it("ignores other keys", () => {
    const { onInputKeydown, emit } = setup({ model: "app" });
    onInputKeydown(keydown("a"));
    expect(emit).not.toHaveBeenCalled();
  });
});

describe("useAutocomplete scroll", () => {
  it("emits more once when the panel scrolls near its end", () => {
    const { onPanelScroll, emit } = setup();
    const el = scrollable(800);
    scroll(el, onPanelScroll);
    scroll(el, onPanelScroll);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("more");
  });

  it("stays quiet away from the end", () => {
    const { onPanelScroll, emit } = setup();
    scroll(scrollable(100), onPanelScroll);
    expect(emit).not.toHaveBeenCalled();
  });

  it("re-arms after scrolling away from the end", () => {
    const { onPanelScroll, emit } = setup();
    const el = scrollable(800);
    scroll(el, onPanelScroll);
    el.scrollTop = 100;
    scroll(el, onPanelScroll);
    el.scrollTop = 800;
    scroll(el, onPanelScroll);
    expect(emit).toHaveBeenCalledTimes(2);
  });

  it("ignores events without an element target", () => {
    const { onPanelScroll, emit } = setup();
    onPanelScroll(new Event("scroll"));
    expect(emit).not.toHaveBeenCalled();
  });
});
