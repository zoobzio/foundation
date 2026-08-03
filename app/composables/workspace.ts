import type { Service } from "#foundation/types/system/workspace";
import type { AnyWidget, Widgets } from "#foundation/types/widget";

import { computed } from "#imports";
import { entries } from "objectively";
import { useServiceRefs } from "#foundation/composables/refs";

/**
 * The view surface of the workspace: the service's state as refs, the
 * resolved widget registry, and each grid cell paired with its resolved
 * widget. Registry factories run here, in setup, where they may run; the
 * render path binds through the erased view — correlation was proven per
 * factory.
 */
export const useWorkspace = <R extends Widgets>(workspace: Service<R>) => {
  const serviceRefs = useServiceRefs(workspace);

  const widgets: Record<string, AnyWidget> = {};
  for (const [key, make] of entries(workspace.config.widgets)) {
    widgets[String(key)] = make();
  }

  // Each grid cell paired with its resolved widget, if the layout assigns
  // one.
  const cells = computed(() =>
    workspace.layout.slots.map((slot) => {
      const key = slot.widget === undefined ? undefined : String(slot.widget);
      return {
        slot,
        key,
        widget: key === undefined ? undefined : widgets[key],
      };
    }),
  );

  return { ...serviceRefs, widgets, cells };
};
