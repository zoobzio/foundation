import type { avatar } from "../../elements.config";

export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  tokens?: Tokens<typeof avatar.root | typeof avatar.image | typeof avatar.fallback>;
};

export type AvatarEmits = {};

export const defineAvatar = useComponentRecipe<AvatarProps, AvatarEmits>();
