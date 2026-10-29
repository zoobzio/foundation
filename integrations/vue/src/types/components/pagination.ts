import type { FabEmits, FabProps } from "./fab";
import type { PT, Rendered } from "../passthrough";
import type { SelectEmits, SelectProps } from "./select";
import type { Option } from "../common";
import type { Definition } from "../definition";
import type { Ref, VNode } from "vue";

/**
 * The parts of the pagination that accept passthrough.
 */
export type PaginationPassthrough = {
  first: Rendered<FabProps, FabEmits>;
  prev: Rendered<FabProps, FabEmits>;
  next: Rendered<FabProps, FabEmits>;
  last: Rendered<FabProps, FabEmits>;
  size: Rendered<SelectProps<Option>, SelectEmits<Option>>;
};

/**
 * Props of the pagination. `page` and `size` are models, falling back to
 * page 1 and the default page size. `count` is the page count. `total` is
 * the item count.
 */
export type PaginationProps = {
  page?: number;
  size?: number;
  count: number;
  total: number;
  pt?: PT<PaginationPassthrough>;
};

/**
 * Emits of the pagination.
 */
export type PaginationEmits = {
  "update:page": [value: number];
  "update:size": [value: number];
};

/**
 * The pagination view model, served to `defineExpose` and the slots.
 * `options` is the page list with `"..."` for gaps.
 */
export type PaginationContext = {
  page: Ref<number>;
  size: Ref<number>;
  count: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  options: (number | "...")[];
  el: HTMLDivElement | null;
  settings: PaginationPassthrough;
};

/**
 * Slots of the pagination. Each slot receives the context.
 * The option slot also receives the `option`.
 */
export type PaginationSlots = {
  info?: (props: PaginationContext) => VNode[];
  pages?: (props: PaginationContext) => VNode[];
  first?: (props: PaginationContext) => VNode[];
  prev?: (props: PaginationContext) => VNode[];
  options?: (props: PaginationContext) => VNode[];
  option?: (props: PaginationContext & { option: number | "..." }) => VNode[];
  next?: (props: PaginationContext) => VNode[];
  last?: (props: PaginationContext) => VNode[];
  size?: (props: PaginationContext) => VNode[];
};

/**
 * A pagination instance as data: props plus emit listeners.
 */
export type PaginationDefinition = Definition<PaginationProps, PaginationEmits>;
