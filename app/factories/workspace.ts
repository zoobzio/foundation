import { computed, useState } from "#imports";
import type { PageSlot } from "#foundation/types/system/page";
import type {
  WorkspaceFactoryConfig,
  WorkspaceLayout,
  Workspace,
} from "#foundation/types/system/workspace";

export const createWorkspace = (
  id: string,
  factoryConfig: WorkspaceFactoryConfig,
) => {
  return (): Workspace => {
    const initialized = useState<boolean>(`workspace-${id}-initialized`, () => false);
    const loading = useState<boolean>(`workspace-${id}-loading`, () => false);

    const layout = useState<WorkspaceLayout>(
      `workspace-${id}-layout`,
      () => factoryConfig.layout,
    );

    const gridStyle = computed((): Record<string, string> => ({
      display: "grid",
      "grid-template-columns": `repeat(${layout.value.columns}, 1fr)`,
      "grid-template-rows": `repeat(${layout.value.rows}, 1fr)`,
    }));

    const slotStyle = (slot: PageSlot): Record<string, string> => ({
      "grid-column": `${slot.position[0] + 1} / span ${slot.span[0]}`,
      "grid-row": `${slot.position[1] + 1} / span ${slot.span[1]}`,
    });

    const init = async () => {
      if (initialized.value) return true;
      loading.value = true;
      try {
        // Extensible — consumers wire hooks in their own composables
        initialized.value = true;
      } finally {
        loading.value = false;
      }
      return true;
    };

    return {
      initialized,
      loading,
      layout,
      gridStyle,
      slotStyle,
      init,
    };
  };
};
