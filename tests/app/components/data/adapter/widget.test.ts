// The adapter widget is the bridge: it renders the service's captured
// component with the settings base under the service's patch overrides,
// absorbs the widget-contract props, and wraps the service's declared emits
// so the captured listener and `service.emitted` both hear them (bus
// dispatch is service depth, not tested here).
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import type { FunctionalComponent } from "vue";
import { mount } from "@vue/test-utils";
import Widget from "#foundation/components/data/adapter/widget.vue";
import { createAdapter } from "#foundation/factories/adapter";
import type { AdapterWidgetProps } from "#foundation/types/data/adapter/widget";
import type { Service } from "#foundation/types/data/adapter";

const FixtureLogo = defineComponent({
  name: "FixtureLogo",
  props: { src: { type: String, default: "/fallback.svg" } },
  emits: ["activate"],
  setup(props, { emit }) {
    return () =>
      h("img", {
        class: "fixture-logo",
        src: props.src,
        onClick: () => emit("activate", props.src),
      });
  },
});

type LogoContract = {
  src?: string;
  onActivate?: (src: string) => void;
};

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates P for the harness.
const Adapter: FunctionalComponent<AdapterWidgetProps<LogoContract>> = Widget;

const makeService = () =>
  createAdapter<LogoContract>("logo", {
    component: FixtureLogo,
    emits: { activate: true },
  })().service;

// Contract mock for the bridge-boundary cases, where the declared list must
// vary independently of the factory's exhaustive config.
const mockService = (
  emits: readonly "activate"[],
): Service<LogoContract> => ({
  id: "logo",
  component: FixtureLogo,
  emits,
  props: {},
  patch: vi.fn(),
  reset: vi.fn(),
  emitted: vi.fn(),
});

const mountAdapter = (
  service: Service<LogoContract>,
  pt?: LogoContract,
) => {
  return mount(
    defineComponent({
      setup() {
        return () => h(Adapter, { service, pt });
      },
    }),
  );
};

describe("data adapter widget", () => {
  it("renders the wrapped component with pt as its props", () => {
    const logo = mountAdapter(makeService(), { src: "/logo.svg" }).get(
      ".fixture-logo",
    );
    expect(logo.attributes("src")).toBe("/logo.svg");
  });

  it("renders on the wrapped component's defaults when pt is omitted", () => {
    const logo = mountAdapter(makeService()).get(".fixture-logo");
    expect(logo.attributes("src")).toBe("/fallback.svg");
  });

  it("absorbs the widget-contract props — nothing leaks into the DOM", () => {
    const logo = mountAdapter(makeService(), { src: "/logo.svg" }).get(
      ".fixture-logo",
    );
    expect(logo.attributes("service")).toBeUndefined();
    expect(logo.attributes("pt")).toBeUndefined();
  });

  it("patch overrides win over pt and track reactively", async () => {
    const service = makeService();
    const wrapper = mountAdapter(service, { src: "/logo.svg" });
    service.patch({ src: "/patched.svg" });
    await nextTick();
    expect(wrapper.get(".fixture-logo").attributes("src")).toBe("/patched.svg");
    service.reset();
    await nextTick();
    expect(wrapper.get(".fixture-logo").attributes("src")).toBe("/logo.svg");
  });

  it("declared emits reach the captured listener and the bridge", async () => {
    const service = mockService(["activate"]);
    const captured = vi.fn();
    const wrapper = mountAdapter(service, {
      src: "/logo.svg",
      onActivate: captured,
    });
    await wrapper.get(".fixture-logo").trigger("click");
    expect(captured).toHaveBeenCalledWith("/logo.svg");
    expect(service.emitted).toHaveBeenCalledWith("activate", ["/logo.svg"]);
  });

  it("emits outside the declared list stay local", async () => {
    const service = mockService([]);
    const captured = vi.fn();
    const wrapper = mountAdapter(service, {
      src: "/logo.svg",
      onActivate: captured,
    });
    await wrapper.get(".fixture-logo").trigger("click");
    expect(captured).toHaveBeenCalledWith("/logo.svg");
    expect(service.emitted).not.toHaveBeenCalled();
  });
});
