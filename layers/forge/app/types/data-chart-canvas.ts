import type { Chart } from "./data-chart";

export type DataChartCanvasPassthrough = {
  root?: Passthrough<GroupProps>;
};

export interface DataChartCanvasProps<T> {
  chart: Chart<T>;
  pt?: DataChartCanvasPassthrough;
}
