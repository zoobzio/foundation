import type { Actions, Config, State, View } from "@zoobzio/views";

import { reactive } from "vue";
import { vi } from "vitest";
import { z } from "zod";
import { ViewsService, createViewsState } from "@zoobzio/views";

export const fakeViewSchema = z.object({
  sort: z.string().nullable(),
  size: z.number(),
});

export type FakeView = z.output<typeof fakeViewSchema>;

export const fakeStoredView: View<FakeView> = {
  id: "mine",
  name: "Mine",
  origin: "user",
  payload: { sort: "name", size: 50 },
};

/**
 * A real views service over a reactive container and a reactive target,
 * past `init`, with one stored view of the user's beside the app's two.
 * The shape every consumer builds.
 */
export const makeViews = async (wiring: Partial<Actions<FakeView>> = {}) => {
  const config: Config<FakeView> = {
    schema: fakeViewSchema,
    views: [
      { id: "all", name: "All", payload: { sort: null, size: 10 } },
      { id: "recent", name: "Recent", payload: { sort: "created", size: 25 } },
    ],
  };
  const state: State<FakeView> = reactive(createViewsState(config));
  const target = reactive<{ live: FakeView }>({
    live: { sort: null, size: 10 },
  });
  const save = vi.fn(async () => {});
  const remove = vi.fn(async () => {});
  const service = new ViewsService<FakeView>("test-views", config, state, {
    read: () => target.live,
    apply: (payload) => {
      target.live = payload;
    },
    load: async () => [fakeStoredView],
    save,
    remove,
    key: () => "new",
    ...wiring,
  });
  await service.init();
  return { service, state, target, save, remove };
};
