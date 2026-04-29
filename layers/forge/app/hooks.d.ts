import type { DataTableSnapshot } from "./schemas/data-table";
import type { DataChartSnapshot } from "./schemas/data-chart";
import type { DataPreviewSnapshot } from "./schemas/data-preview";
import type { DataDeckSnapshot } from "./schemas/data-deck";
import type { DataFormSnapshot } from "./schemas/data-form";

declare module "#app" {
  interface RuntimeNuxtHooks {
    "widget:table:snapshot": (event: { id: string; snapshot: DataTableSnapshot }) => void;
    "widget:chart:snapshot": (event: { id: string; snapshot: DataChartSnapshot }) => void;
    "widget:preview:snapshot": (event: { id: string; snapshot: DataPreviewSnapshot }) => void;
    "widget:deck:snapshot": (event: { id: string; snapshot: DataDeckSnapshot }) => void;
    "widget:form:snapshot": (event: { id: string; snapshot: DataFormSnapshot }) => void;
    "widget:form:submitted": (event: { id: string; data: unknown }) => void;
  }
}

export {};
