import type { FabEmits, FabProps } from "./fab";
import type {
  Passthrough,
  PT,
} from "../passthrough";
import type { SelectEmits, SelectProps } from "./select";
import type { Option } from "./common";
import type { Ref, VNode } from "vue";

export type PaginationPassthrough = {
  first: Passthrough<FabProps, FabEmits>;
  prev: Passthrough<FabProps, FabEmits>;
  next: Passthrough<FabProps, FabEmits>;
  last: Passthrough<FabProps, FabEmits>;
  size: Passthrough<SelectProps<Option>, SelectEmits<Option>>;
};

export type PaginationProps = {
  page: number;
  size: number;
  count: number;
  total: number;
  pt?: PT<PaginationPassthrough>;
};

export type PaginationEmits = {
  "update:page": [value: number];
  "update:size": [value: number];
};

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
