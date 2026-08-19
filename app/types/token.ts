import type { AppUnthemeContract } from "#imports";

/**
 * A theme token name, derived from the untheme contract. This module sits
 * upstream of `config/components.ts` (which types its token slots with it),
 * so it must not import the registry or anything derived from it — that
 * would close an import cycle.
 */
export type Token = keyof AppUnthemeContract["tokens"];
