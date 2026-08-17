// Gold standard: the wiring runner, exercised over the real hook bus from
// the #imports shim — id filtering, services record, and scope teardown are
// the behavior under test. Fixture widgets stand in for feature-composable
// yields (AnyWidget-shaped).
import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { useNuxtApp } from "#imports";
import { useWiring } from "../../../app/composables/widgets";
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
  return { alpha, beta, widgets: { alpha, beta } };
};

describe("useWiring", () => {
  it("dispatches a machine's event to its handler with the services record", async () => {
    const { alpha, beta, widgets } = makeRegistry();
    const handler = vi.fn();

    withSetup(() => {
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
    const { widgets } = makeRegistry();
    const handler = vi.fn();

    withSetup(() => {
      useWiring({ alpha: { "table:updated": handler } }, widgets);
    });

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "other-machine", total: 9 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("tears down with the component scope", async () => {
    const { widgets } = makeRegistry();
    const handler = vi.fn();

    const { app } = withSetup(() => {
      useWiring({ alpha: { "table:updated": handler } }, widgets);
    });
    app.unmount();

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "alpha-machine", total: 1 });

    expect(handler).not.toHaveBeenCalled();
  });

  it("ignores absent wiring and unknown registry keys", () => {
    const { widgets } = makeRegistry();

    withSetup(() => {
      useWiring(undefined, widgets);
      useWiring({ missing: { "table:updated": vi.fn() } }, widgets);
    });
  });
});
