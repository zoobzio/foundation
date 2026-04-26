import { defineComponent, h, type VNode } from "vue";

/**
 * Creates a simple stub component that renders a given tag with $attrs and default slot.
 * Use for reka-ui primitives and ore components in alloy tests.
 */
export const createStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.());
    },
  });

/**
 * Creates a stub that exposes a scoped slot (v-slot) with given data.
 * Use for reka-ui components that provide slot props (e.g. CalendarRoot v-slot="{ weekDays, grid }").
 */
export const createScopedStub = (name: string, slotProps: Record<string, unknown> = {}, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs }, slots.default?.(slotProps));
    },
  });

/**
 * Creates a stub that renders ALL named slots (default + any named).
 * Use for wrapper components like Popover where children use `<template #content>`.
 */
export const createAllSlotsStub = (name: string, tag = "div") =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        const children: VNode[] = [];
        for (const slotFn of Object.values(slots)) {
          const nodes = slotFn?.();
          if (nodes) children.push(...nodes);
        }
        return h(tag, { ...attrs }, children);
      };
    },
  });

// --- Ore component stubs (individually exported) ---
export const Icon = createStub("Icon", "i");
export const Group = createStub("Group", "div");
export const Button = createStub("Button", "button");
export const Span = createStub("Span", "span");
export const Label = createStub("Label", "label");
export const Caption = createStub("Caption", "div");
export const Section = createStub("Section", "section");
export const H1 = createStub("H1", "h1");
export const Em = createStub("Em", "em");
export const P = createStub("P", "p");
export const Kbd = createStub("Kbd", "kbd");

/** All ore stubs keyed by component name */
export const oreStubs = { Icon, Group, Button, Span, Label, Caption, Section, H1, Em, P, Kbd } as const;

// --- Alloy sub-component stubs (for composed components) ---
export const alloyStubs = {
  Accordion: createStub("Accordion"),
  Avatar: createStub("Avatar"),
  Calendar: createStub("Calendar"),
  Checkbox: createStub("Checkbox"),
  Command: createStub("Command"),
  DateFilters: createStub("DateFilters"),
  DatePicker: createStub("DatePicker"),
  DateRangePicker: createStub("DateRangePicker"),
  Dialog: createAllSlotsStub("Dialog"),
  Fab: createStub("Fab"),
  Facets: createStub("Facets"),
  Hero: createStub("Hero"),
  Keywords: createStub("Keywords"),
  Listbox: createStub("Listbox"),
  Menu: createStub("Menu"),
  MultiSelect: createStub("MultiSelect"),
  Pagination: createStub("Pagination"),
  Popover: createAllSlotsStub("Popover"),
  Radio: createStub("Radio"),
  RangeCalendar: createStub("RangeCalendar"),
  Scroller: createStub("Scroller"),
  SegmentedControl: createStub("SegmentedControl"),
  Select: createStub("Select"),
  Tabs: createStub("Tabs"),
  TagsInput: createAllSlotsStub("TagsInput"),
  Toast: createStub("Toast"),
  Toaster: createStub("Toaster"),
  Tooltip: createStub("Tooltip"),
} as const;

// --- Reka-UI stub factory ---
/** Creates stubs for a list of reka-ui component names */
export const rekaStubs = (...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, createStub(name)]));
