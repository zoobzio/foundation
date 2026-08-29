import type { IconAlias } from "../icon";
import type { EventEmits } from "../events";
import type { VNode } from "vue";

export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
};

export type FabEmits = EventEmits<"click">;

export type FabContext = {
  icon?: IconAlias;
  label?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
  el: HTMLButtonElement | null;
};

export type FabSlots = {
  icon?: (props: FabContext) => VNode[];
  badge?: (props: FabContext) => VNode[];
};
