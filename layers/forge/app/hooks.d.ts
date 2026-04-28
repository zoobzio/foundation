import type { DataTableSnapshot } from "./schemas/data-table";
import type { DataChartSnapshot } from "./schemas/data-chart";
import type { DataPreviewSnapshot } from "./schemas/data-preview";
import type { DataDeckSnapshot } from "./schemas/data-deck";

declare module "#app" {
  interface RuntimeNuxtHooks {
    "widget:table:snapshot": (event: { id: string; snapshot: DataTableSnapshot }) => void;
    "widget:chart:snapshot": (event: { id: string; snapshot: DataChartSnapshot }) => void;
    "widget:preview:snapshot": (event: { id: string; snapshot: DataPreviewSnapshot }) => void;
    "widget:deck:snapshot": (event: { id: string; snapshot: DataDeckSnapshot }) => void;
  }
}

export {};
