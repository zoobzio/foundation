import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type AvatarRootEmits = ComponentEvents["avatar-root"];

export type AvatarRootBindings = Bindings<"avatar-root", AvatarRootForward>;

export type AvatarRootContext = Reshape<AvatarRootProps> & {
  bindings: AvatarRootBindings;
  el: ComponentPublicInstance | null;
};

export type AvatarRootSlots = {
  default(props: AvatarRootContext): VNode[];
};
