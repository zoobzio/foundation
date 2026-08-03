import type { ButtonEmits, ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { IconAlias } from "#foundation/types/common/iconic";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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

export type FabEmits = ComponentEvents["fab"];

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
