export type SectionProps = {
  tokens?: Tokens<"section">;
};

export type SectionEmits = {};

export const defineSection = useComponentRecipe<SectionProps, SectionEmits>();
