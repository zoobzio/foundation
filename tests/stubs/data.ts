import { createStub, createAllSlotsStub } from "#test/stubs/factories";

// Data-tier sub-components are imported under feature-generic binding names
// (Body, Toolbar, Canvas, …) that collide across features, so each feature
// gets its own map — spread only the map for the feature under test.
export const tableStubs = {
  Head: createStub("Head", "thead"),
  Body: createAllSlotsStub("Body", "tbody"),
  BulkActions: createStub("BulkActions"),
  Columns: createStub("Columns"),
} as const;

export const deckStubs = {
  Toolbar: createStub("Toolbar"),
  Feed: createAllSlotsStub("Feed"),
} as const;

export const chartStubs = {
  Canvas: createStub("Canvas"),
  Control: createStub("Control"),
} as const;

export const formStubs = {
  Field: createAllSlotsStub("Field"),
} as const;

export const autocompleteStubs = {
  Item: createStub("Item"),
} as const;
