import type { CommandEmits, CommandOption, CommandProps } from "./command";
import type { FabProps } from "./fab";
import type { PopoverEmits, PopoverProps } from "./popover";
import type { PT, Passthrough, Rendered } from "../passthrough";
import type { Service } from "@zoobzio/table";
import type { ComponentPublicInstance, Ref } from "vue";
import type { VNode } from "vue";

/**
 * The parts of the column manager that accept passthrough.
 */
export type TableColumnsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Rendered<FabProps>;
  command: Rendered<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
};

/**
 * Props of the column manager: the headless service, the popover's open
 * state, plus passthrough.
 */
export type TableColumnsProps<T> = {
  service: Service<T>;
  open?: boolean;
  pt?: PT<TableColumnsPassthrough>;
};

/**
 * Emits of the column manager.
 */
export type TableColumnsEmits = {
  "update:open": [value: boolean];
};

/**
 * The column manager view model, served to `defineExpose` and the slots.
 */
export type TableColumnsContext<T> = {
  table: Service<T>;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: TableColumnsPassthrough;
};

/**
 * Slots of the column manager, around its trigger's label.
 */
export type TableColumnsSlots<T> = {
  columnsPrepend?: (props: TableColumnsContext<T>) => VNode[];
  columnsAppend?: (props: TableColumnsContext<T>) => VNode[];
};
