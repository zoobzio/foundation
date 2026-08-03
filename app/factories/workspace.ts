import type {
  Actions,
  Config,
  Slot,
  Workspace,
} from "#foundation/types/system/workspace";

import { accessWorkspace } from "#foundation/stores/workspace";
import { computed, useNuxtApp } from "#imports";
import { WorkspaceService } from "#foundation/services/workspace";

export const createWorkspace = (
  id: string,
  config: Config,
  actions: Actions = {},
) => {
  return (): Workspace => {
    const nuxt = useNuxtApp();
    const state = accessWorkspace(id, config);
    const service = new WorkspaceService(nuxt, id, config, state, actions);
    return {
      id,
      config,

      initialized: computed(() => service.initialized),
      loading: computed(() => service.loading),
      layout: computed(() => service.layout),

      gridStyle: computed(() => service.gridStyle),
      slotStyle: (slot: Slot) => service.slotStyle(slot),

      init: () => service.init(),
    };
  };
};
