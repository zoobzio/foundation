import type { DataTableSnapshot } from "#foundation/schemas/table";
import type { DataChartSnapshot } from "#foundation/schemas/chart";
import type { DataPreviewSnapshot } from "#foundation/schemas/preview";
import type { DeckSnapshot } from "#foundation/schemas/deck";
import type { FormSnapshot } from "#foundation/schemas/form";
import type { LogLine } from "#foundation/types/log";

declare module "#app" {
  interface RuntimeNuxtHooks {
    // logging
    log: (line: LogLine) => void;
    // widgets
    "widget:table:snapshot": (event: {
      id: string;
      snapshot: DataTableSnapshot;
    }) => void;
    "widget:chart:snapshot": (event: {
      id: string;
      snapshot: DataChartSnapshot;
    }) => void;
    "widget:preview:snapshot": (event: {
      id: string;
      snapshot: DataPreviewSnapshot;
    }) => void;
    "widget:deck:snapshot": (event: {
      id: string;
      snapshot: DeckSnapshot;
    }) => void;
    "widget:form:snapshot": (event: {
      id: string;
      snapshot: FormSnapshot;
    }) => void;
    "widget:form:submitted": (event: { id: string; data: unknown }) => void;
  }
}

export {};
