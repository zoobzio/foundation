import { createStub, createAllSlotsStub } from "@zoobz-io/alloy/stubs";

export { createStub, createScopedStub, createAllSlotsStub, rekaStubs, oreStubs, alloyStubs } from "@zoobz-io/alloy/stubs";

export const forgeStubs = {
  DataTableWidget: createStub("DataTableWidget"),
  DataTableHead: createStub("DataTableHead"),
  DataTableBody: createAllSlotsStub("DataTableBody"),
  DataTableFilters: createStub("DataTableFilters"),
  DataTableColumns: createStub("DataTableColumns"),
  DataTableSearch: createStub("DataTableSearch"),
  DataTableBulkActions: createStub("DataTableBulkActions"),
  DataTableFilterHelp: createStub("DataTableFilterHelp"),
  DataChartWidget: createStub("DataChartWidget"),
  DataChartCanvas: createStub("DataChartCanvas"),
  DataPreviewWidget: createStub("DataPreviewWidget"),
  DataPreviewFields: createAllSlotsStub("DataPreviewFields"),
  DataPreviewContent: createStub("DataPreviewContent"),
  DataDeckWidget: createStub("DataDeckWidget"),
  DataDeckToolbar: createStub("DataDeckToolbar"),
  DataDeckFeed: createAllSlotsStub("DataDeckFeed"),
  DataFormWidget: createStub("DataFormWidget"),
  DataFormField: createAllSlotsStub("DataFormField"),
} as const;
