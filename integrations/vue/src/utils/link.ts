import type { LinkProps, LinkTarget } from "../types/common";
import type { Passthrough } from "../types/passthrough";

/**
 * The recipe of a link part over an item's `link`: a plain anchor that
 * drops its `href` while the item is disabled, so it stays inert.
 */
export const anchor = (
  target: LinkTarget | undefined,
  disabled?: boolean,
): Passthrough<LinkProps> => ({
  as: "a",
  href: disabled ? undefined : target?.to,
  target: target?.target,
});
