import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  AvatarRootProps as RekaAvatarRootProps,
} from "reka-ui";

export type AvatarRootForward = Reshape<RekaAvatarRootProps>;

export type AvatarRootProps = RekaAvatarRootProps & {
  modifiers?: ModifierProps<"avatar-root">;
  tokens?: TokenProps<"avatar-root">;
  aria?: AriaProps<"avatar-root">;
};

export type AvatarRootEmits = {};

export type AvatarRootBindings = Bindings<"avatar-root", AvatarRootForward>;

export type AvatarRootContext = Reshape<AvatarRootProps> & {
  bindings: AvatarRootBindings;
  el: ComponentPublicInstance | null;
};

export type AvatarRootSlots = {
  default(props: AvatarRootContext): VNode[];
};
