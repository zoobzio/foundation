import type { ChipProps } from "#foundation/types/common/chip";
import type { GroupProps } from "#foundation/types/common/group";
import type { InputProps } from "#foundation/types/common/input";
import type { SpanProps } from "#foundation/types/common/span";
import type { CodeViewProps } from "#foundation/types/core/code-view";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { ScrollerProps } from "#foundation/types/core/scroller";
import type { Preview } from "#foundation/types/data/preview";

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
