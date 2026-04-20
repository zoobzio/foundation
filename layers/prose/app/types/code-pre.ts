export type CodePrePassthrough = {};

export type CodePreProps = {
  code: string;
  pt?: CodePrePassthrough;
};

export type CodePreEmits = {};

export const defineCodePre = useComponentRecipe<CodePreProps, CodePreEmits>();

export type CodePreRecipe = ComponentRecipe<CodePreProps, CodePreEmits>;
