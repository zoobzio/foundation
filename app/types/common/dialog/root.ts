import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DialogRootEmits as RekaDialogRootEmits,
  DialogRootProps as RekaDialogRootProps,
} from "reka-ui";

export type DialogRootProps = RekaDialogRootProps;

export type DialogRootEmits = RekaDialogRootEmits;

export type DialogRootContext = Reshape<DialogRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type DialogRootSlots = {
  default(props: DialogRootContext): VNode[];
};
