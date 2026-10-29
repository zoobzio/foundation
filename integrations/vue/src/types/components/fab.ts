import type { EventEmits } from "../events";
import type { Definition } from "../definition";
import type { VNode } from "vue";

/**
 * Props of the floating action button.
 */
export type FabProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
};

/**
 * Emits of the fab: the native `click`.
 */
export type FabEmits = EventEmits<"click">;

/**
 * The fab view model, served to `defineExpose` and the slots.
 */
export type FabContext = {
  label?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  badge?: number | string;
  el: HTMLButtonElement | null;
};

/**
 * Slots of the fab. The default slot is the button's one content, in
 * place of the label text; `badge` is the badge. Each receives the context.
 */
export type FabSlots = {
  default?: (props: FabContext) => VNode[];
  badge?: (props: FabContext) => VNode[];
};

/**
 * A fab instance as data: props plus emit listeners.
 */
export type FabDefinition = Definition<FabProps, FabEmits>;
