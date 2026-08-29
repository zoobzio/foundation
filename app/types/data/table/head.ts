import type {
  CheckboxEmits,
  CheckboxProps,
} from "../../core/checkbox";
import type { Passthrough, PT } from "../../passthrough";
import type { DataTableColumn, Service } from "../table";
import type { VNode } from "vue";

export type TableHeadPassthrough = {
  selectAllCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
};

export type TableHeadProps<T> = {
  table: Service<T>;
  pt?: PT<TableHeadPassthrough>;
};

export type TableHeadContext<T> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableHeadPassthrough;
};

export type TableHeadSlots<T> = {
  header?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
};
