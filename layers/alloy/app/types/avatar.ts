import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarImageEmits,
  AvatarFallbackProps,
} from "reka-ui";

export type AvatarPassthrough = {
  root?: Passthrough<AvatarRootProps>;
  image?: Passthrough<AvatarImageProps, AvatarImageEmits>;
  fallback?: Passthrough<AvatarFallbackProps>;
};

export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  pt?: AvatarPassthrough;
};

export type AvatarEmits = {};

export type AvatarRecipe = Recipe<AvatarProps, AvatarEmits>;
