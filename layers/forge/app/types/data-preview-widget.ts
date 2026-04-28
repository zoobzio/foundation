import type { Preview } from "./data-preview";
import type { DataPreviewFieldsPassthrough } from "./data-preview-fields";
import type { DataPreviewContentPassthrough } from "./data-preview-content";

export type DataPreviewPassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  title?: Passthrough<SpanProps>;
  body?: Passthrough<GroupProps>;

  // Sub-component passthrough
  fields?: DataPreviewFieldsPassthrough;
  content?: DataPreviewContentPassthrough;
};

export interface DataPreviewProps<T> {
  preview: Preview<T>;
  pt?: DataPreviewPassthrough;
}
