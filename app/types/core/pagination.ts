import type { ButtonEmits, ButtonProps } from "../common/button";
import type { GroupProps } from "../common/group";
import type { SpanProps } from "../common/span";
import type { FabEmits, FabProps } from "./fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { SelectEmits, SelectProps } from "./select";
import type { Option } from "./common";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type PaginationPassthrough = {
  root: Passthrough<GroupProps>;
  info: Passthrough<SpanProps>;
  pages: Passthrough<GroupProps>;
  first: Passthrough<FabProps, FabEmits>;
  prev: Passthrough<FabProps, FabEmits>;
  next: Passthrough<FabProps, FabEmits>;
  last: Passthrough<FabProps, FabEmits>;
  options: Passthrough<GroupProps>;
  option: PassthroughIter<number | "...", ButtonProps, ButtonEmits>;
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
  el: ComponentPublicInstance | null;
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
