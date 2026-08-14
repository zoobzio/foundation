import type { GroupProps } from "../../common/group";
import type { FabProps, FabEmits } from "../../core/fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../../passthrough";
import type { Service, Events } from "../chart";
import type { ChartCanvasPassthrough } from "./canvas";
import type {
  ChartControlAnchor,
  ChartControlProps,
} from "./control";
import type { ComponentPublicInstance, VNode } from "vue";

export type ChartWidgetPassthrough<T> = {
  root: Passthrough<GroupProps>;
  toolbar: Passthrough<GroupProps>;
  title: Passthrough<GroupProps>;
  actions: Passthrough<GroupProps>;
  control: PassthroughIter<ChartControlAnchor, ChartControlProps<T>>;
  refresh: Passthrough<FabProps, FabEmits>;
};

export type ChartWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<ChartWidgetPassthrough<T>> & {
    canvas?: PT<ChartCanvasPassthrough>;
  };
};

export type ChartWidgetEmits = {
  updated: Parameters<Events["chart:updated"]>;
  "variant-changed": Parameters<Events["chart:variant-changed"]>;
  "renderer-changed": Parameters<Events["chart:renderer-changed"]>;
};

export type ChartWidgetContext<T> = {
  chart: Service<T>;
  el: ComponentPublicInstance | null;
  settings: ChartWidgetPassthrough<T>;
};

export type ChartWidgetSlots<T> = {
  toolbar?: (props: ChartWidgetContext<T>) => VNode[];
  loading?: (props: ChartWidgetContext<T>) => VNode[];
  empty?: (props: ChartWidgetContext<T>) => VNode[];
};
