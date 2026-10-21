import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarImageEmits,
  AvatarFallbackProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The parts of the avatar that accept passthrough.
 */
export type AvatarPassthrough = {
  root: Passthrough<AvatarRootProps>;
  image: Passthrough<AvatarImageProps, AvatarImageEmits>;
  fallback: Passthrough<AvatarFallbackProps>;
};

/**
 * Props of the avatar. `fallback` is the text shown when the image has not
 * loaded or fails to load.
 */
export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  pt?: PT<AvatarPassthrough>;
};

/**
 * The avatar has no emits.
 */
export type AvatarEmits = {};

/**
 * The avatar view model, served to `defineExpose` and the slots.
 */
export type AvatarContext = {
  src: string;
  alt?: string;
  fallback?: string;
  el: ComponentPublicInstance | null;
  settings: AvatarPassthrough;
};

/**
 * Slots of the avatar. Each slot receives the context.
 */
export type AvatarSlots = {
  root?: (props: AvatarContext) => VNode[];
  image?: (props: AvatarContext) => VNode[];
  fallback?: (props: AvatarContext) => VNode[];
};

/**
 * An avatar instance as data: props plus emit listeners.
 */
export type AvatarDefinition = Definition<AvatarProps, AvatarEmits>;
