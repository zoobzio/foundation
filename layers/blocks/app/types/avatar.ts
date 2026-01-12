export type AvatarProps = {
  src: string;
  alt?: string;
  fallback?: string;
  tokens?: Tokens<"avatar-root" | "avatar-image" | "avatar-fallback">;
};

export type AvatarEmits = {};

export const defineAvatar = useComponentRecipe<AvatarProps, AvatarEmits>();
