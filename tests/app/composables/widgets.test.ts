// Gold standard: the widget consumption infra. Fixture composables stand in
// for factory yields (AnyWidget-shaped); the wiring runner is exercised over
// the real hook bus from the #imports shim — id filtering, services record,
// and scope teardown are the behavior under test.
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { useNuxtApp } from "#imports";
import { useWidgets, useWiring } from "../../../app/composables/widgets";
import { withSetup } from "#test/mount/composable";
import type { AnyWidget } from "../../../app/types/widget";

const FixtureView = defineComponent({
  name: "FixtureView",
  render: () => null,
});

const makeRegistry = () => {
  const alpha: AnyWidget = {
    service: { id: "alpha-machine" },
    component: FixtureView,
  };
  const beta: AnyWidget = {
    service: { id: "beta-machine" },
    component: FixtureView,
  };
  const makeAlpha = vi.fn(() => alpha);
  const makeBeta = vi.fn(() => beta);
  return { alpha, beta, registry: { alpha: makeAlpha, beta: makeBeta } };
};

describe("useWidgets", () => {
  it("invokes each composable once, keyed like the registry", () => {
    const { alpha, beta, registry } = makeRegistry();
    const widgets = useWidgets(registry);
    expect(widgets).toEqual({ alpha, beta });
    expect(registry.alpha).toHaveBeenCalledOnce();
    expect(registry.beta).toHaveBeenCalledOnce();
  });
});

describe("useWiring", () => {
  it("dispatches a machine's event to its handler with the services record", async () => {
    const { alpha, beta, registry } = makeRegistry();
    const handler = vi.fn();

    withSetup(() => {
      const widgets = useWidgets(registry);
      useWiring({ alpha: { "table:updated": handler } }, widgets);
    });

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "alpha-machine", total: 3 });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(
      { id: "alpha-machine", total: 3 },
      { alpha: alpha.service, beta: beta.service },
    );
  });

  it("filters by machine id — other instances do not fire the handler", async () => {
    const { registry } = makeRegistry();
    const handler = vi.fn();

    withSetup(() => {
      useWiring({ alpha: { "table:updated": handler } }, useWidgets(registry));
    });

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "other-machine", total: 9 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("tears down with the component scope", async () => {
    const { registry } = makeRegistry();
    const handler = vi.fn();

    const { app } = withSetup(() => {
      useWiring({ alpha: { "table:updated": handler } }, useWidgets(registry));
    });
    app.unmount();

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "alpha-machine", total: 1 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("ignores absent wiring and unknown registry keys", () => {
    const { registry } = makeRegistry();

    withSetup(() => {
      const widgets = useWidgets(registry);
      useWiring(undefined, widgets);
      useWiring({ missing: { "table:updated": vi.fn() } }, widgets);
    });
  });
});
