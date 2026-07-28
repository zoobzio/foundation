import type {
  DialogRootProps,
  DialogRootEmits,
} from "#foundation/types/common/dialog/root";
import type { DialogOverlayProps } from "#foundation/types/common/dialog/overlay";
import type {
  DialogContentProps,
  DialogContentEmits,
} from "#foundation/types/common/dialog/content";
import type { DialogTitleProps } from "#foundation/types/common/dialog/title";
import type { DialogDescriptionProps } from "#foundation/types/common/dialog/description";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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

export type DialogEmits = ComponentEvents["dialog"] & {
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
