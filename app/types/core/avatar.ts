import type { AvatarRootProps } from "#foundation/types/common/avatar/root";
import type {
  AvatarImageProps,
  AvatarImageEmits,
} from "#foundation/types/common/avatar/image";
import type { AvatarFallbackProps } from "#foundation/types/common/avatar/fallback";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type AvatarPassthrough = {
  root: Passthrough<AvatarRootProps>;
  image: Passthrough<AvatarImageProps, AvatarImageEmits>;
  fallback: Passthrough<AvatarFallbackProps>;
};

export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  pt?: PT<AvatarPassthrough>;
};

export type AvatarEmits = ComponentEvents["avatar"];

export type AvatarContext = {
  src: string;
  alt?: string;
  fallback?: string;
  el: ComponentPublicInstance | null;
  settings: AvatarPassthrough;
};

export type AvatarSlots = {
  root?: (props: AvatarContext) => VNode[];
  image?: (props: AvatarContext) => VNode[];
  fallback?: (props: AvatarContext) => VNode[];
};
