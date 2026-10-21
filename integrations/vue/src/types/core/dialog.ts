import type {
  DialogRootProps,
  DialogRootEmits,
  DialogOverlayProps,
  DialogContentProps,
  DialogContentEmits,
  DialogTitleProps,
  DialogDescriptionProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type DialogPassthrough = {
  root: Passthrough<DialogRootProps, DialogRootEmits>;
  overlay: Passthrough<DialogOverlayProps>;
  content: Passthrough<DialogContentProps, DialogContentEmits>;
  title: Passthrough<DialogTitleProps>;
  description: Passthrough<DialogDescriptionProps>;
};

export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;
  pt?: PT<DialogPassthrough>;
};

export type DialogEmits = {
  "update:open": [value: boolean];
};

export type DialogContext = {
  title: string;
  description: string;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DialogPassthrough;
};

export type DialogSlots = {
  default?: (props: DialogContext) => VNode[];
  overlay?: (props: DialogContext) => VNode[];
  content?: (props: DialogContext) => VNode[];
  title?: (props: DialogContext) => VNode[];
  description?: (props: DialogContext) => VNode[];
};

/**
 * A dialog instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DialogDefinition = Definition<DialogProps, DialogEmits>;
