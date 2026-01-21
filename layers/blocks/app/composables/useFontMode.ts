export type FontMode = "monospace" | "sans";

const STORAGE_KEY = "blocks-font-mode";

export const useFontMode = () => {
  const mode = useState<FontMode>("font-mode", () => "sans");

  const isMonospace = computed(() => mode.value === "monospace");

  const toggle = () => {
    mode.value = isMonospace.value ? "sans" : "monospace";
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, mode.value);
    }
  };

  // Initialize from localStorage on client
  if (import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY) as FontMode | null;
    if (stored === "monospace" || stored === "sans") {
      mode.value = stored;
    }
  }

  return {
    mode,
    isMonospace,
    toggle,
  };
};
