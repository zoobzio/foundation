import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  PopoverRootEmits as RekaPopoverRootEmits,
  PopoverRootProps as RekaPopoverRootProps,
} from "reka-ui";

export type PopoverRootProps = RekaPopoverRootProps;

export type PopoverRootEmits = RekaPopoverRootEmits;

export type PopoverRootContext = Reshape<PopoverRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type PopoverRootSlots = {
  default(props: PopoverRootContext): VNode[];
};
