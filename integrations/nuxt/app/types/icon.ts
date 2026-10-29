import type { Alias } from "#build/types/icon-sheets.d.ts";

/**
 * An icon alias the app's sprite holds. `@icon-sheets/nuxt` derives the
 * union at build time from the merged contract, so inside the layer it is
 * the foundation contract (`@zoobzio/icons`) and inside an app it is that
 * contract plus the app's own aliases. The wrappers' defaults and an
 * app's own `icon` fields are checked against the same names.
 */
export type IconAlias = Alias;
