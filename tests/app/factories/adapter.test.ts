// The factory composes store + service through the shim's Nuxt seams — the
// tests assert the triple, the keyed-state instancing model, and the
// contract-typed authoring path; override and bridge logic get their depth
// in tests/services/adapter.test.ts.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { createAdapter } from "#foundation/factories/adapter";
import Directory from "#foundation/components/core/directory.vue";
import type { Contract } from "#foundation/types/data/adapter";
import type {
  DirectoryEmits,
  DirectoryItem,
  DirectoryProps,
} from "#foundation/types/core/directory";

const FixtureLogo = defineComponent({
  name: "FixtureLogo",
  props: { src: { type: String, default: "/fallback.svg" } },
  setup(props) {
    return () => h("img", { class: "fixture-logo", src: props.src });
  },
});

// A component with a required prop, for the contract-typed path: the
// contract mirrors the requiredness, which makes `settings` mandatory.
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

describe("createAdapter", () => {
  it("yields the widget triple carrying the wrapped component", () => {
    const widget = createAdapter(
      "logo",
      { component: FixtureLogo, emits: {} },
      { src: "/logo.svg" },
    )();
    expect(widget.service.id).toBe("logo");
    expect(widget.service.component).toBe(FixtureLogo);
    expect(widget.component).toBeDefined();
    expect(widget.settings).toEqual({ src: "/logo.svg" });
  });

  it("settings stay optional and raw for all-optional contracts", () => {
    const settings = () => ({ src: "/logo.svg" });
    const make = (s?: typeof settings) =>
      createAdapter("logo", { component: FixtureLogo, emits: {} }, s)();
    expect(make().settings).toBeUndefined();
    expect(make(settings).settings).toBe(settings);
  });

  it("contract-typed adapters verify component, emits, and settings", () => {
    const widget = createAdapter<BadgeContract>(
      "badge",
      { component: FixtureBadge, emits: { activate: true } },
      { label: "beta" },
    )();
    expect(widget.service.component).toBe(FixtureBadge);
    expect(widget.service.emits).toEqual(["activate"]);
    expect(widget.settings).toEqual({ label: "beta" });
  });

  it("Contract composes a component's Props/Emits into an adapter surface", () => {
    type NavContract = Contract<
      DirectoryProps<DirectoryItem>,
      DirectoryEmits<DirectoryItem>
    >;
    const widget = createAdapter<NavContract>(
      "nav",
      { component: Directory, emits: { select: true } },
      { groups: [] },
    )();
    expect(widget.service.component).toBe(Directory);
    expect(widget.service.emits).toEqual(["select"]);
    expect(widget.settings).toEqual({ groups: [] });
  });

  it("same id shares the override layer across instances", () => {
    const useLogo = createAdapter("logo", {
      component: FixtureLogo,
      emits: {},
    });
    const a = useLogo().service;
    const b = useLogo().service;
    a.patch({ src: "/patched.svg" });
    expect(b.props).toEqual({ src: "/patched.svg" });
  });

  it("different ids stay independent", () => {
    const a = createAdapter("one", {
      component: FixtureLogo,
      emits: {},
    })().service;
    const b = createAdapter("two", {
      component: FixtureLogo,
      emits: {},
    })().service;
    a.patch({ src: "/patched.svg" });
    expect(b.props).toEqual({});
  });
});
