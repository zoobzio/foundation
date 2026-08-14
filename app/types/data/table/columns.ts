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

export type TableColumnsProps<T, K = unknown> = {
  table: Service<T, K>;
  pt?: PT<TableColumnsPassthrough>;
};

export type TableColumnsContext<T, K = unknown> = {
  table: Service<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableColumnsPassthrough;
};
