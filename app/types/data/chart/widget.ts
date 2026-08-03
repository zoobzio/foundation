import type { GroupProps } from "#foundation/types/common/group";
import type { FabProps, FabEmits } from "#foundation/types/core/fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { Chart, Events } from "#foundation/types/data/chart";
import type { ChartCanvasPassthrough } from "#foundation/types/data/chart/canvas";
import type {
  ChartControlAnchor,
  ChartControlProps,
} from "#foundation/types/data/chart/control";
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
  chart: Chart<T>;
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
  chart: Chart<T>;
  el: ComponentPublicInstance | null;
  settings: ChartWidgetPassthrough<T>;
};

export type ChartWidgetSlots<T> = {
  toolbar?: (props: ChartWidgetContext<T>) => VNode[];
  loading?: (props: ChartWidgetContext<T>) => VNode[];
  empty?: (props: ChartWidgetContext<T>) => VNode[];
};
