export type AnchorProps = Link & {
  tokens?: Tokens<"a">;
};

export type AnchorEmits = {};

export const defineAnchor = useComponentRecipe<
  AnchorProps,
  AnchorEmits & MouseEvents & FocusEvents
>();
