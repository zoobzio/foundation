import type { Root, RootContent } from "mdast";

export type MarkdownPassthrough = {
  root?: Passthrough<ArticleProps>;
  h1?: Passthrough<H1Props>;
  h2?: Passthrough<H2Props>;
  h3?: Passthrough<H3Props>;
  h4?: Passthrough<H4Props>;
  h5?: Passthrough<H5Props>;
  h6?: Passthrough<H6Props>;
  p?: Passthrough<PProps>;
  strong?: Passthrough<StrongProps>;
  em?: Passthrough<EmProps>;
  del?: Passthrough<DelProps>;
  blockquote?: Passthrough<BlockquoteProps>;
  ul?: Passthrough<UlProps>;
  ol?: Passthrough<OlProps>;
  li?: Passthrough<LiProps>;
  anchor?: Passthrough<AnchorProps>;
  img?: Passthrough<ImgProps>;
  code?: Passthrough<CodeProps>;
  pre?: Passthrough<PreProps>;
  hr?: Passthrough<HrProps>;
  table?: Passthrough<TableProps>;
  thead?: Passthrough<TheadProps>;
  tbody?: Passthrough<TbodyProps>;
  tr?: Passthrough<TrProps>;
  th?: Passthrough<ThProps>;
  td?: Passthrough<TdProps>;
};

export type MarkdownProps = {
  content: string;
  pt?: MarkdownPassthrough;
};

export type MarkdownEmits = {};

export type MarkdownRecipe = Recipe<MarkdownProps, MarkdownEmits>;

export type MarkdownNode = Root | RootContent;
