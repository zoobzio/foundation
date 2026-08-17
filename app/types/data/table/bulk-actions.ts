import type { ButtonProps, ButtonEmits } from "../../common/button";
import type { GroupProps } from "../../common/group";
import type { IconProps } from "../../common/icon";
import type { SpanProps } from "../../common/span";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../table";
import type { ComponentPublicInstance } from "vue";

export type TableBulkActionsPassthrough = {
  root: Passthrough<GroupProps>;
  count: Passthrough<SpanProps>;
  action: Passthrough<ButtonProps, ButtonEmits>;
  // `alias` is data-driven (the bulk action's icon), bound by the template.
  actionIcon: Passthrough<Omit<IconProps, "alias">>;
  clear: Passthrough<ButtonProps, ButtonEmits>;
};

export type TableBulkActionsProps<T> = {
  table: Service<T>;
  pt?: PT<TableBulkActionsPassthrough>;
};

export type TableBulkActionsContext<T> = {
  table: Service<T>;
  el: ComponentPublicInstance | null;
  settings: TableBulkActionsPassthrough;
};
