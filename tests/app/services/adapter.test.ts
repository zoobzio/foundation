// Constructor-injected seams: a hand-rolled State ref and the shim's
// NuxtApp. The machine under test is small — the props override layer and
// the emit bridge are its whole logic. P is an authored contract, the
// recommended shape.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { useNuxtApp } from "#imports";
import { AdapterService } from "../../../app/services/adapter";
import type { State } from "../../../app/types/data/adapter";

const FixtureLogo = defineComponent({
  name: "FixtureLogo",
  props: {
    src: { type: String, default: "/fallback.svg" },
    alt: { type: String, default: undefined },
  },
  emits: ["activate"],
  setup(props, { emit }) {
    return () =>
      h("img", {
        class: "fixture-logo",
        src: props.src,
        alt: props.alt,
        onClick: () => emit("activate", props.src),
      });
  },
});

type LogoContract = {
  src?: string;
  alt?: string;
  onActivate?: (src: string) => void;
};

const makeService = () => {
  const state: State<LogoContract> = { props: ref({}) };
  const nuxt = useNuxtApp();
  const emitSpy = vi.spyOn(nuxt, "callHook");
  const service = new AdapterService<LogoContract>(
    nuxt,
    "logo",
    { component: FixtureLogo, emits: { activate: true } },
    state,
  );
  return { service, state, emitSpy };
};

describe("AdapterService", () => {
  it("exposes the captured component and the contract's emits", () => {
    const { service } = makeService();
    expect(service.id).toBe("logo");
    expect(service.component).toBe(FixtureLogo);
    expect(service.emits).toEqual(["activate"]);
  });

  it("a contract without listener props bridges nothing", () => {
    const service = new AdapterService<{ src?: string }>(
      useNuxtApp(),
      "logo",
      { component: FixtureLogo, emits: {} },
      { props: ref({}) },
    );
    expect(service.emits).toEqual([]);
  });

  it("patch merges flat per key, last write wins", () => {
    const { service } = makeService();
    service.patch({ src: "/a.svg" });
    service.patch({ alt: "logo" });
    expect(service.props).toEqual({ src: "/a.svg", alt: "logo" });
    service.patch({ src: "/b.svg" });
    expect(service.props).toEqual({ src: "/b.svg", alt: "logo" });
  });

  it("reset clears the override layer", () => {
    const { service } = makeService();
    service.patch({ src: "/a.svg" });
    service.reset();
    expect(service.props).toEqual({});
  });

  it("emitted dispatches the id-scoped bridge event", () => {
    const { service, emitSpy } = makeService();
    service.emitted("activate", ["/a.svg"]);
    expect(emitSpy).toHaveBeenCalledWith("adapter:emitted", {
      id: "logo",
      emit: "activate",
      args: ["/a.svg"],
    });
  });
});
