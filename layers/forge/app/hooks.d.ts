import type { DataTableSnapshot } from "./schemas/data-table";
import type { DataChartSnapshot } from "./schemas/data-chart";

declare module "#app" {
  interface RuntimeNuxtHooks {
    "widget:table:snapshot": (event: { id: string; snapshot: DataTableSnapshot }) => void;
    "widget:chart:snapshot": (event: { id: string; snapshot: DataChartSnapshot }) => void;
  }
}

export {};
