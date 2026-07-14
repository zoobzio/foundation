import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Preview } from "#foundation/types/data/preview";
import type { DataPreviewFieldsPassthrough } from "#foundation/types/data/preview-fields";
import type { DataPreviewContentPassthrough } from "#foundation/types/data/preview-content";

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
