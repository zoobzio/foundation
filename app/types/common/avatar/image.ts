import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
