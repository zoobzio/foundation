import type { IconAlias } from "../../src/types";

// @ts-expect-error only available at runtime within a module
import aliases from "#build/iconic.config.mjs";

export const useIconAlias = (alias: IconAlias) => aliases[alias];
