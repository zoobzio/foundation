import type { GroupProps } from "#foundation/types/common/group";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Chart } from "#foundation/types/data/chart";

export type DataChartCanvasPassthrough = {
  root?: Passthrough<GroupProps>;
};

export interface DataChartCanvasProps<T> {
  chart: Chart<T>;
  pt?: DataChartCanvasPassthrough;
}
