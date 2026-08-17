import type {
  CommandEmits,
  CommandOption,
  CommandProps,
} from "../../core/command";
import type { FabProps } from "../../core/fab";
import type { PopoverEmits, PopoverProps } from "../../core/popover";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../table";
import type { ComponentPublicInstance } from "vue";

export type TableColumnsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  command: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
};

export type TableColumnsProps<T> = {
  table: Service<T>;
  pt?: PT<TableColumnsPassthrough>;
};

export type TableColumnsContext<T> = {
  table: Service<T>;
  el: ComponentPublicInstance | null;
  settings: TableColumnsPassthrough;
};
