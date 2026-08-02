import type { Preview } from "#foundation/types/data/preview";

import { computed } from "#imports";
import { PREVIEW_DEFAULT_FILENAME_BASE } from "#foundation/constants/preview";

/**
 * The feature half of the preview widget: the file actions over the content
 * value (clipboard, download, external link) and the derived filename. All DOM
 * — clipboard, Blob, `document`, `window` — stops here, never the service.
 */
export const usePreview = <T>(preview: Preview<T>) => {
  const content = preview.content;

  const filename = computed(() => {
    if (content.type === "code" && content.filename) return content.filename;
    const ext = content.type === "code" ? content.language : "txt";
    return `${PREVIEW_DEFAULT_FILENAME_BASE}.${ext}`;
  });

  const copy = async () => {
    await navigator.clipboard.writeText(preview.contentValue.value);
  };

  const download = () => {
    const blob = new Blob([preview.contentValue.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.value;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openExternal = () => {
    if (content.type === "code" && content.externalUrl) {
      window.open(content.externalUrl, "_blank");
    }
  };

  const hasExternal = computed(
    () => content.type === "code" && !!content.externalUrl,
  );

  return { filename, hasExternal, copy, download, openExternal };
};
