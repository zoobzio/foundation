import type { Chart } from "./data-chart";
import type { DataChartCanvasPassthrough } from "./data-chart-canvas";

export type DataChartPassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  title?: Passthrough<GroupProps>;
  actions?: Passthrough<GroupProps>;

  // Sub-component passthrough
  canvas?: DataChartCanvasPassthrough;
};

export interface DataChartProps<T> {
  chart: Chart<T>;
  pt?: DataChartPassthrough;
}
