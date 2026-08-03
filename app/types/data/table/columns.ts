import type {
  CommandEmits,
  CommandOption,
  CommandProps,
} from "#foundation/types/core/command";
import type { FabProps } from "#foundation/types/core/fab";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Service } from "#foundation/types/data/table";
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
