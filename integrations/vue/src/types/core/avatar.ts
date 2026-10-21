import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarImageEmits,
  AvatarFallbackProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
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

export type AvatarEmits = {};

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

/**
 * A avatar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AvatarDefinition = Definition<AvatarProps, AvatarEmits>;
