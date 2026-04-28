export type CodeViewPassthrough = {
  root?: Passthrough<GroupProps>;
  editor?: Passthrough<GroupProps>;
};

export type CodeViewProps = {
  content: string;
  language?: string;
  lineNumbers?: boolean;
  folding?: boolean;
  wordWrap?: boolean;
  pt?: CodeViewPassthrough;
};

export type CodeViewEmits = {};

export type CodeViewRecipe = Recipe<CodeViewProps, CodeViewEmits>;
