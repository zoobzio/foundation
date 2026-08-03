import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
