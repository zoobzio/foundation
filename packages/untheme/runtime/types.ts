// @ts-ignore only available at runtime within a module
import type { ElementRegistry } from "#build/types/untheme.d.ts";

// Utility type for accessing element token types, keyed by element name
export type Tokens<T extends keyof ElementRegistry> = {
  [K in T]?: ElementRegistry[K];
};
