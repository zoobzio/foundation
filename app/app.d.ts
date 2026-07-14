import type { DataTableSnapshot } from "#foundation/schemas/data/table";
import type { DataChartSnapshot } from "#foundation/schemas/data/chart";
import type { DataPreviewSnapshot } from "#foundation/schemas/data/preview";
import type { DataDeckSnapshot } from "#foundation/schemas/data/deck";
import type { DataFormSnapshot } from "#foundation/schemas/data/form";

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
