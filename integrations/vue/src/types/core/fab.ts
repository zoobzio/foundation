import type { EventEmits } from "../events";
import type { Definition } from "../definition";
import type { VNode } from "vue";

export type FabProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
};

export type FabEmits = EventEmits<"click">;

export type FabContext = {
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

/**
 * A fab instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type FabDefinition = Definition<FabProps, FabEmits>;
