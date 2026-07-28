import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  AvatarImageEmits as RekaAvatarImageEmits,
  AvatarImageProps as RekaAvatarImageProps,
} from "reka-ui";

export type AvatarImageForward = Reshape<RekaAvatarImageProps>;

export type AvatarImageProps = RekaAvatarImageProps & {
  modifiers?: ModifierProps<"avatar-image">;
  tokens?: TokenProps<"avatar-image">;
  aria?: AriaProps<"avatar-image">;
};

export type AvatarImageEmits = RekaAvatarImageEmits & ComponentEvents["avatar-image"];

export type AvatarImageBindings = Bindings<"avatar-image", AvatarImageForward>;

export type AvatarImageContext = Reshape<AvatarImageProps> & {
  bindings: AvatarImageBindings;
  el: ComponentPublicInstance | null;
};

export type AvatarImageSlots = {
  default(props: AvatarImageContext): VNode[];
};
