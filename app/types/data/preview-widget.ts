import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough } from "#foundation/types/passthrough";
import type { Preview } from "#foundation/types/data/preview";

export type DataPreviewPassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  title?: Passthrough<SpanProps>;
  body?: Passthrough<GroupProps>;
};

export interface DataPreviewProps<T> {
  preview: Preview<T>;
  pt?: DataPreviewPassthrough;
}
