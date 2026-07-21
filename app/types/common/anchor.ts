import type { IconAlias } from "#foundation/types/common/iconic";
export type AnchorProps = {
  label?: string;
  to?: string;
  icon?: IconAlias;
  external?: boolean;
  target?: "_blank" | "_self";
  replace?: boolean;
  prefetch?: boolean;
  disabled?: boolean;
  ariaCurrent?: "page" | "step" | "location" | "date" | "time" | boolean;
};
