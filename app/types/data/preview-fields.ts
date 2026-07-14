import type { GroupProps } from "#foundation/types/common/group";
import type { LabelProps } from "#foundation/types/common/label";
import type { SpanProps } from "#foundation/types/common/span";
import type { MarkdownProps } from "#foundation/types/core/markdown";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { ScrollerProps } from "#foundation/types/core/scroller";
import type { Preview } from "#foundation/types/data/preview";

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
