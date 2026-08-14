import type { ButtonEmits, ButtonProps } from "../common/button";
import type { GroupProps } from "../common/group";
import type { IconProps } from "../common/icon";
import type { IconAlias } from "../common/iconic";
import type { EventEmits } from "../events";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type FabPassthrough = {
  root: Passthrough<ButtonProps, ButtonEmits>;
  icon: Passthrough<IconProps>;
  badge: Passthrough<GroupProps>;
};

export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
  pt?: PT<FabPassthrough>;
};

export type FabEmits = EventEmits<"click">;

export type FabContext = {
  icon?: IconAlias;
  label?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
  el: ComponentPublicInstance | null;
  settings: FabPassthrough;
};

export type FabSlots = {
  icon?: (props: FabContext) => VNode[];
  badge?: (props: FabContext) => VNode[];
};
