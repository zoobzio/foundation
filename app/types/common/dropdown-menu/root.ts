import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DropdownMenuRootEmits as RekaDropdownMenuRootEmits,
  DropdownMenuRootProps as RekaDropdownMenuRootProps,
} from "reka-ui";

export type DropdownMenuRootProps = RekaDropdownMenuRootProps;

export type DropdownMenuRootEmits = RekaDropdownMenuRootEmits;

export type DropdownMenuRootContext = Reshape<DropdownMenuRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuRootSlots = {
  default(props: DropdownMenuRootContext): VNode[];
};
