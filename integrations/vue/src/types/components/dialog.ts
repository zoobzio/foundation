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

/**
 * The parts of the dialog that accept passthrough.
 */
export type DialogPassthrough = {
  root: Passthrough<DialogRootProps, DialogRootEmits>;
  overlay: Passthrough<DialogOverlayProps>;
  content: Passthrough<DialogContentProps, DialogContentEmits>;
  title: Passthrough<DialogTitleProps>;
  description: Passthrough<DialogDescriptionProps>;
};

/**
 * Props of the dialog.
 */
export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;
  pt?: PT<DialogPassthrough>;
};

/**
 * Emits of the dialog.
 */
export type DialogEmits = {
  "update:open": [value: boolean];
};

/**
 * The dialog view model, served to `defineExpose` and the slots.
 */
export type DialogContext = {
  title: string;
  description: string;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: DialogPassthrough;
};

/**
 * Slots of the dialog. Each slot receives the context.
 */
export type DialogSlots = {
  default?: (props: DialogContext) => VNode[];
  overlay?: (props: DialogContext) => VNode[];
  content?: (props: DialogContext) => VNode[];
  title?: (props: DialogContext) => VNode[];
  description?: (props: DialogContext) => VNode[];
};

/**
 * A dialog instance as data: props plus emit listeners.
 */
export type DialogDefinition = Definition<DialogProps, DialogEmits>;
