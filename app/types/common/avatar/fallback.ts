import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  AvatarFallbackProps as RekaAvatarFallbackProps,
} from "reka-ui";

export type AvatarFallbackForward = Reshape<RekaAvatarFallbackProps>;

export type AvatarFallbackProps = RekaAvatarFallbackProps & {
  modifiers?: ModifierProps<"avatar-fallback">;
  tokens?: TokenProps<"avatar-fallback">;
  aria?: AriaProps<"avatar-fallback">;
};

export type AvatarFallbackEmits = ComponentEvents["avatar-fallback"];

export type AvatarFallbackBindings = Bindings<"avatar-fallback", AvatarFallbackForward>;

export type AvatarFallbackContext = Reshape<AvatarFallbackProps> & {
  bindings: AvatarFallbackBindings;
  el: ComponentPublicInstance | null;
};

export type AvatarFallbackSlots = {
  default(props: AvatarFallbackContext): VNode[];
};
