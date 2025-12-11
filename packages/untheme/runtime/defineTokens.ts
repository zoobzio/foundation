// @ts-ignore only available at runtime within a module
import config from "#build/untheme.config.mjs";
// @ts-ignore generated at build time
import type { ElementRegistry } from "#build/types/untheme.d.ts";
import { useHead } from "#app";
import { computed } from "vue";
import { useTokenRegistry } from "./state";

type ElementConfig = { keys: string[]; roles: string[] };

// Helper to check if a value is a token reference
const isTokenReference = (value: string): boolean => {
  return (
    value.startsWith("ref-") ||
    value.startsWith("sys-") ||
    value.startsWith("shiki-")
  );
};

// Helper to wrap token references in var()
const wrapValue = (value: string): string => {
  if (isTokenReference(value)) {
    return `var(--${value})`;
  }
  return value;
};

// Generate CSS for element tokens
function generateElementCSS(
  element: string,
  tokens: Record<string, string>,
): string {
  const lines = Object.entries(tokens)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => `  --${element}-${key}: ${wrapValue(value)};`);

  if (lines.length === 0) return "";
  return `:root {\n${lines.join("\n")}\n}`;
}

export function defineTokens<E extends keyof ElementRegistry>(
  element: E,
  tokens: ElementRegistry[E],
): void {
  const registry = useTokenRegistry();
  const elementConfig = config[element] as ElementConfig | undefined;

  // Strict validation against build-time registry
  const validKeys = elementConfig?.keys ?? [];
  for (const key of Object.keys(tokens as object)) {
    if (!validKeys.includes(key)) {
      console.warn(
        `[untheme] Invalid token key "${key}" for element "${String(element)}".`,
      );
    }
  }

  // Merge with existing (latest wins)
  registry.value[element as string] = {
    ...registry.value[element as string],
    ...(tokens as Record<string, string>),
  };

  // Generate CSS for this element's tokens
  const css = computed(() =>
    generateElementCSS(element as string, registry.value[element as string] || {}),
  );

  // Inject via useHead
  useHead({
    style: [
      {
        key: `untheme-${String(element)}`,
        innerHTML: css,
      },
    ],
  });
}
