import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

/**
 * The prop surface every element wrapper shares — what the suite mounts with.
 * `aria.hidden` is the bindings-channel probe: it is GlobalAria (valid for
 * every role) and lands on the root as `aria-hidden`, proving the useBindings
 * spread reaches the element. The other channels ride the same `v-bind`, and
 * their mapping logic is covered by tests/composables/bindings.test.ts.
 */
export interface ElementProps {
  label?: string;
  aria?: { hidden?: boolean };
}

export interface ElementSuiteConfig {
  /** Mounts the element; the suite passes shared props, files add specifics. */
  mount: (props?: ElementProps, slots?: Record<string, string>) => VueWrapper;
  /** Root element tag — asserted together with the `f-<name>` class. */
  tag: string;
  /** Set false for elements without a label prop / default slot (hr, img, …). */
  label?: boolean;
  /** Native events the element re-emits from its root (config/components.ts). */
  events?: readonly string[];
}

/**
 * Shared axes for components/common element wrappers. Test files stay thin:
 * one runElementSuite call plus a describe block for element-specific
 * behavior (branching, extra props, ctx content).
 */
export const runElementSuite = (name: string, config: ElementSuiteConfig) => {
  const { mount: mountEl, tag, events = [] } = config;
  const selector = `${tag}.f-${name}`;

  describe(`element: ${name}`, () => {
    it(`renders <${tag}> with the f-${name} class`, () => {
      expect(mountEl().find(selector).exists()).toBe(true);
    });

    it("spreads the bindings channels onto the root", () => {
      const wrapper = mountEl({ aria: { hidden: true } });
      expect(wrapper.get(selector).attributes("aria-hidden")).toBe("true");
    });

    if (config.label !== false) {
      it("renders the label prop as default content", () => {
        expect(mountEl({ label: "Probe" }).text()).toContain("Probe");
      });

      it("default slot content overrides the label", () => {
        const wrapper = mountEl({ label: "Probe" }, { default: "<em>slotted</em>" });
        expect(wrapper.text()).toContain("slotted");
        expect(wrapper.text()).not.toContain("Probe");
      });
    }

    for (const event of events) {
      it(`re-emits ${event} from the root`, async () => {
        const wrapper = mountEl();
        await wrapper.get(selector).trigger(event);
        const emitted = wrapper.emitted(event);
        expect(emitted).toHaveLength(1);
        expect(emitted?.at(0)?.at(0)).toBeInstanceOf(Event);
      });
    }
  });
};
