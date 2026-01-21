// @ts-ignore generated at build time
import type { ElementRegistry } from "#build/types/untheme.d.ts";

export function createTokenDef<E extends keyof ElementRegistry>(
  element: E,
  tokens: ElementRegistry[E]
) {
  return { key: element, tokens };
}
