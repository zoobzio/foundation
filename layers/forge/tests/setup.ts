import { vi } from "vitest";

// Forge schema auto-imports
vi.stubGlobal("DataTableSnapshotSchema", (await import("../app/schemas/data-table")).DataTableSnapshotSchema);
vi.stubGlobal("DataChartSnapshotSchema", (await import("../app/schemas/data-chart")).DataChartSnapshotSchema);
vi.stubGlobal("DataPreviewSnapshotSchema", (await import("../app/schemas/data-preview")).DataPreviewSnapshotSchema);
vi.stubGlobal("DataDeckSnapshotSchema", (await import("../app/schemas/data-deck")).DataDeckSnapshotSchema);
vi.stubGlobal("DataFormSnapshotSchema", (await import("../app/schemas/data-form")).DataFormSnapshotSchema);

// Forge factory auto-imports
vi.stubGlobal("WIDGET_CONFIGS", (await import("../app/factories/data-table")).WIDGET_CONFIGS);

// Forge util auto-imports
vi.stubGlobal("formatDate", (await import("../app/utils/unravel")).formatDate);
vi.stubGlobal("formatCell", (await import("../app/utils/format-cell")).formatCell);
vi.stubGlobal("formatFilter", (await import("../app/utils/format-filter")).formatFilter);

// Forge composable auto-imports
vi.stubGlobal("useFilterUnravel", (await import("../app/composables/unravel")).useFilterUnravel);
