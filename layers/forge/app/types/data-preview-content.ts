import type { Preview } from "./data-preview";

export type DataPreviewContentPassthrough = {
  root?: Passthrough<GroupProps>;
  scroller?: Passthrough<ScrollerProps>;
  codeView?: Passthrough<CodeViewProps>;
  footer?: Passthrough<GroupProps>;
  languageBadge?: Passthrough<ChipProps>;
  search?: Passthrough<InputProps>;
  info?: Passthrough<SpanProps>;
};

export interface DataPreviewContentProps<T> {
  preview: Preview<T>;
  pt?: DataPreviewContentPassthrough;
}
