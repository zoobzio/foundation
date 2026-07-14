import type { AnchorProps } from "#foundation/types/common/anchor";
import type { ArticleProps } from "#foundation/types/common/article";
import type { BlockquoteProps } from "#foundation/types/common/blockquote";
import type { CodeProps } from "#foundation/types/common/code";
import type { DelProps } from "#foundation/types/common/del";
import type { EmProps } from "#foundation/types/common/em";
import type { H1Props } from "#foundation/types/common/h1";
import type { H2Props } from "#foundation/types/common/h2";
import type { H3Props } from "#foundation/types/common/h3";
import type { H4Props } from "#foundation/types/common/h4";
import type { H5Props } from "#foundation/types/common/h5";
import type { H6Props } from "#foundation/types/common/h6";
import type { HrProps } from "#foundation/types/common/hr";
import type { ImgProps } from "#foundation/types/common/img";
import type { LiProps } from "#foundation/types/common/li";
import type { OlProps } from "#foundation/types/common/ol";
import type { PProps } from "#foundation/types/common/p";
import type { PreProps } from "#foundation/types/common/pre";
import type { StrongProps } from "#foundation/types/common/strong";
import type { TableProps } from "#foundation/types/common/table";
import type { TbodyProps } from "#foundation/types/common/tbody";
import type { TdProps } from "#foundation/types/common/td";
import type { ThProps } from "#foundation/types/common/th";
import type { TheadProps } from "#foundation/types/common/thead";
import type { TrProps } from "#foundation/types/common/tr";
import type { UlProps } from "#foundation/types/common/ul";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
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
