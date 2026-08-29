import type { FabProps, FabEmits } from "../../core/fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../../passthrough";
import type { Service, Events } from "../chart";
import type {
  ChartControlAnchor,
  ChartControlProps,
} from "./control";
import type { VNode } from "vue";

export type ChartWidgetPassthrough<T> = {
  control: PassthroughIter<ChartControlAnchor, ChartControlProps<T>>;
  refresh: Passthrough<FabProps, FabEmits>;
};

export type ChartWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<ChartWidgetPassthrough<T>>;
};

export type ChartWidgetEmits = {
  updated: Parameters<Events["chart:updated"]>;
  "variant-changed": Parameters<Events["chart:variant-changed"]>;
  "renderer-changed": Parameters<Events["chart:renderer-changed"]>;
};

export type ChartWidgetContext<T> = {
  chart: Service<T>;
  el: HTMLDivElement | null;
  settings: ChartWidgetPassthrough<T>;
};

export type ChartWidgetSlots<T> = {
  toolbar?: (props: ChartWidgetContext<T>) => VNode[];
  loading?: (props: ChartWidgetContext<T>) => VNode[];
  empty?: (props: ChartWidgetContext<T>) => VNode[];
};
