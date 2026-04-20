import type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps } from "reka-ui";

export type AvatarPassthrough = {
  root?: Passthrough<AvatarRootProps>;
  image?: Passthrough<AvatarImageProps>;
  fallback?: Passthrough<AvatarFallbackProps>;
};

export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  pt?: AvatarPassthrough;
};

export type AvatarEmits = {};

export const defineAvatar = useComponentRecipe<AvatarProps, AvatarEmits>();

export type AvatarRecipe = ComponentRecipe<AvatarProps, AvatarEmits>;
