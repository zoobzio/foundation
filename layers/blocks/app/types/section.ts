import type { section } from "../../elements.config";

export type SectionProps = {
  tokens?: Tokens<typeof section.key>;
};

export type SectionEmits = {};

export const defineSection = useComponentRecipe<SectionProps, SectionEmits>();
