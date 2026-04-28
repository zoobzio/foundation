import type { Preview } from "./data-preview";

export type DataPreviewFieldsPassthrough = {
  root?: Passthrough<GroupProps>;
  scroller?: Passthrough<ScrollerProps>;
  field?: Passthrough<GroupProps>;
  label?: Passthrough<LabelProps>;
  value?: Passthrough<SpanProps>;
  markdown?: Passthrough<MarkdownProps>;
};

export interface DataPreviewFieldsProps<T> {
  preview: Preview<T>;
  pt?: DataPreviewFieldsPassthrough;
}
