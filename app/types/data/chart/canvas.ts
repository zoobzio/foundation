import type { GroupProps } from "#foundation/types/common/group";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Chart } from "#foundation/types/data/chart";
import type { ComponentPublicInstance } from "vue";

export type ChartCanvasPassthrough = {
  root: Passthrough<GroupProps>;
};

export type ChartCanvasProps<T> = {
  chart: Chart<T>;
  pt?: PT<ChartCanvasPassthrough>;
};

export type ChartCanvasContext<T> = {
  chart: Chart<T>;
  el: ComponentPublicInstance | null;
  settings: ChartCanvasPassthrough;
};
