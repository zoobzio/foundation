// The factory composes store + service through the shim's Nuxt seams — the
// tests assert the triple, the keyed-state instancing model, and the
// definition constructors (`defineAdapter`, `defineDirectory`); override and
// bridge logic get their depth in tests/services/adapter.test.ts.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { createAdapter } from "#foundation/factories/adapter";
import { defineAdapter } from "#foundation/definitions/adapter";
import { defineDirectory } from "#foundation/definitions/directory";
import Directory from "#foundation/components/core/directory.vue";

const FixtureLogo = defineComponent({
  name: "FixtureLogo",
  props: { src: { type: String, default: "/fallback.svg" } },
  setup(props) {
    return () => h("img", { class: "fixture-logo", src: props.src });
  },
});

// A component with a required prop, for the contract-typed path: the
// contract mirrors the requiredness, which makes `settings` mandatory in
// the definition.
const FixtureBadge = defineComponent({
  name: "FixtureBadge",
  props: { label: { type: String, required: true } },
  emits: ["activate"],
  setup(props, { emit }) {
    return () =>
      h(
        "output",
        { class: "fixture-badge", onClick: () => emit("activate", props.label) },
        props.label,
      );
  },
});

type BadgeContract = {
  label: string;
  onActivate?: (label: string) => void;
};

const logoDefinition = defineAdapter({
  component: FixtureLogo,
  emits: {},
  settings: { src: "/logo.svg" },
});

describe("createAdapter", () => {
  it("yields the widget triple carrying the wrapped component", () => {
    const widget = createAdapter("logo", logoDefinition)();
    expect(widget.service.id).toBe("logo");
    expect(widget.service.component).toBe(FixtureLogo);
    expect(widget.component).toBeDefined();
    expect(widget.settings).toEqual({ src: "/logo.svg" });
  });

  it("settings stay optional and raw for all-optional contracts", () => {
    const settings = () => ({ src: "/logo.svg" });
    const bare = defineAdapter({ component: FixtureLogo, emits: {} });
    const reactive = defineAdapter({
      component: FixtureLogo,
      emits: {},
      settings,
    });
    expect(createAdapter("logo", bare)().settings).toBeUndefined();
    expect(createAdapter("logo", reactive)().settings).toBe(settings);
  });

  it("contract-typed definitions verify component, emits, and settings", () => {
    const badge = defineAdapter<BadgeContract>({
      component: FixtureBadge,
      emits: { activate: true },
      settings: { label: "beta" },
    });
    const widget = createAdapter("badge", badge)();
    expect(widget.service.component).toBe(FixtureBadge);
    expect(widget.service.emits).toEqual(["activate"]);
    expect(widget.settings).toEqual({ label: "beta" });
  });

  it("a composite definition slots into the adapter as settings", () => {
    const nav = defineDirectory({ groups: [] });
    const adapter = defineAdapter({
      component: Directory,
      emits: { select: true },
      settings: nav,
    });
    const widget = createAdapter("nav", adapter)();
    expect(widget.service.component).toBe(Directory);
    expect(widget.service.emits).toEqual(["select"]);
    expect(widget.settings).toBe(nav);
  });

  it("same id shares the override layer across instances", () => {
    const useLogo = createAdapter("logo", logoDefinition);
    const a = useLogo().service;
    const b = useLogo().service;
    a.patch({ src: "/patched.svg" });
    expect(b.props).toEqual({ src: "/patched.svg" });
  });

  it("different ids stay independent — one definition, many instances", () => {
    const a = createAdapter("one", logoDefinition)().service;
    const b = createAdapter("two", logoDefinition)().service;
    a.patch({ src: "/patched.svg" });
    expect(b.props).toEqual({});
  });
});
