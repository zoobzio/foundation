import type { GroupProps } from "#foundation/types/common/group";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Chart } from "#foundation/types/data/chart";
import type { DataChartCanvasPassthrough } from "#foundation/types/data/chart-canvas";

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
