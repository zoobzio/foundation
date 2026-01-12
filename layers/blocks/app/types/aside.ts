export type AsideProps = {
  tokens?: Tokens<"aside">;
};

export type AsideEmits = {};

export const defineAside = useComponentRecipe<AsideProps, AsideEmits>();
