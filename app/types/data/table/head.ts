import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { ThProps } from "#foundation/types/common/th";
import type { TheadProps } from "#foundation/types/common/thead";
import type { TrProps } from "#foundation/types/common/tr";
import type {
  CheckboxEmits,
  CheckboxProps,
} from "#foundation/types/core/checkbox";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { DataTableColumn, Table } from "#foundation/types/data/table";
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
  table: Table<T, K>;
  pt?: PT<TableHeadPassthrough>;
};

export type TableHeadContext<T, K = unknown> = {
  table: Table<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableHeadPassthrough;
};

export type TableHeadSlots<T, K = unknown> = {
  header?: (
    props: TableHeadContext<T, K> & { column: DataTableColumn<T> },
  ) => VNode[];
};
