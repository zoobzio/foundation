import type { Actions, Config } from "#foundation/types/system/workspace";
import type { WorkspaceStructureProps } from "#foundation/types/system/workspace/structure";
import type { Widget, Widgets, WidgetSettings } from "#foundation/types/widget";

import component from "#foundation/components/system/workspace/structure.vue";

import { accessWorkspace } from "#foundation/stores/workspace";
import { useNuxtApp } from "#imports";
import { WorkspaceService } from "#foundation/services/workspace";

export const createWorkspace = <R extends Widgets>(
  id: string,
  config: Config<R>,
  actions: Actions<R> = {},
  settings?: WidgetSettings<WorkspaceStructureProps<R>>,
) => {
  return (): Widget<WorkspaceStructureProps<R>> => {
    const nuxt = useNuxtApp();
    const state = accessWorkspace(id, config);
    const service = new WorkspaceService(nuxt, id, config, state, actions);

    return {
      service,
      component,
      settings,
    };
  };
};
