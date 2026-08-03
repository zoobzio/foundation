import type { ButtonProps, ButtonEmits } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Service } from "#foundation/types/data/table";
import type { ComponentPublicInstance } from "vue";

export type TableBulkActionsPassthrough = {
  root: Passthrough<GroupProps>;
  count: Passthrough<SpanProps>;
  action: Passthrough<ButtonProps, ButtonEmits>;
  // `alias` is data-driven (the bulk action's icon), bound by the template.
  actionIcon: Passthrough<Omit<IconProps, "alias">>;
  clear: Passthrough<ButtonProps, ButtonEmits>;
};

export type TableBulkActionsProps<T, K = unknown> = {
  table: Service<T, K>;
  pt?: PT<TableBulkActionsPassthrough>;
};

export type TableBulkActionsContext<T, K = unknown> = {
  table: Service<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableBulkActionsPassthrough;
};
