import type { ButtonProps } from "../../common/button";
import type { GroupProps } from "../../common/group";
import type { IconProps } from "../../common/icon";
import type { SpanProps } from "../../common/span";
import type { ThProps } from "../../common/th";
import type { TheadProps } from "../../common/thead";
import type { TrProps } from "../../common/tr";
import type {
  CheckboxEmits,
  CheckboxProps,
} from "../../core/checkbox";
import type { Passthrough, PT } from "../../passthrough";
import type { DataTableColumn, Service } from "../table";
import type { ComponentPublicInstance, VNode } from "vue";

export type TableHeadPassthrough = {
  thead: Passthrough<TheadProps>;
  theadTr: Passthrough<TrProps>;
  th: Passthrough<ThProps>;
  selectAllCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  headerWrap: Passthrough<GroupProps>;
  sortButton: Passthrough<ButtonProps>;
  // `alias` is data-driven (the active sort direction), bound by the template.
  sortIcon: Passthrough<Omit<IconProps, "alias">>;
  headerLabel: Passthrough<SpanProps>;
  dragIcon: Passthrough<IconProps>;
};

export type TableHeadProps<T, K = unknown> = {
  table: Service<T, K>;
  pt?: PT<TableHeadPassthrough>;
};

export type TableHeadContext<T, K = unknown> = {
  table: Service<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableHeadPassthrough;
};

export type TableHeadSlots<T, K = unknown> = {
  header?: (
    props: TableHeadContext<T, K> & { column: DataTableColumn<T> },
  ) => VNode[];
};
