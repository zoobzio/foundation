import type { GroupProps } from "../../common/group";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../chart";
import type { ComponentPublicInstance } from "vue";

export type ChartCanvasPassthrough = {
  root: Passthrough<GroupProps>;
};

export type ChartCanvasProps<T> = {
  chart: Service<T>;
  pt?: PT<ChartCanvasPassthrough>;
};

export type ChartCanvasContext<T> = {
  chart: Service<T>;
  el: ComponentPublicInstance | null;
  settings: ChartCanvasPassthrough;
};
