import type { IconAlias } from "../../src/types";
import type { IconData } from "../../src/config";

// @ts-ignore only available at runtime within a module
import aliases from "#build/iconic.config.mjs";

export const useIconAlias = (alias: IconAlias): IconData => aliases[alias];
