import type { Preview, DataPreviewConfig } from "../types/data-preview";
import { DataPreviewSnapshotSchema } from "../schemas/data-preview";
import type { DataPreviewSnapshot } from "../schemas/data-preview";

export const createPreview = <T>(id: string, config: DataPreviewConfig<T>) => {
  return (): Preview<T> => {
    const configs = inject(WIDGET_CONFIGS, {});
    DataPreviewSnapshotSchema.parse(configs[id] ?? {});

    // Initialization
    const initialized = useState<boolean>(
      `preview-${id}-initialized`,
      () => false,
    );

    // State
    const loading = useState<boolean>(`preview-${id}-loading`, () => false);
    const data = useState<T | null>(
      `preview-${id}-data`,
      () => null,
    );

    // Getters
    const contentValue = computed(() => {
      const d = data.value;
      if (!d) return "";
      return String(d[config.content.key]);
    });

    const fieldValue = (key: keyof T): unknown => {
      const d = data.value;
      if (!d) return "";
      return d[key];
    };

    // Actions
    const fetchData = async () => {
      loading.value = true;
      try {
        data.value = await config.fetch();
      } finally {
        loading.value = false;
        useNuxtApp().callHook("widget:preview:snapshot", {
          id,
          snapshot: getSnapshot(),
        });
      }
    };

    const init = async () => {
      if (initialized.value) return true;
      initialized.value = true;
      await fetchData();
      return true;
    };

    // Persistence
    const getSnapshot = (): DataPreviewSnapshot => ({});

    const restoreSnapshot = (_snapshot: DataPreviewSnapshot) => {};

    return {
      loading,
      initialized,
      data,
      fields: config.fields,
      content: config.content,
      contentValue,
      fieldValue,
      fetch: fetchData,
      init,
      getSnapshot,
      restoreSnapshot,
    };
  };
};
