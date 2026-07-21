import type { IconAlias } from "#foundation/types/common/iconic";
export type BannerProps = {
  label?: string;
  role?: "banner" | "status" | "alert";
  icon?: IconAlias;
};
