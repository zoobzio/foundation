import { defineElement, defineElements } from "@foundation/untheme/config";

// ============================================================================
// Standalone Elements
// ============================================================================

export const contentFiltersSection = defineElement("content-filters-section", "flexbox");
export const contentAccordion = defineElement("content-accordion", "flexbox");

// ============================================================================
// Compound Elements
// ============================================================================

export const contentSearch = defineElements("content-search", {
  root: ["flexbox", "overflow"],
  status: ["textflow"],
  results: ["flexbox", "overflow"],
  group: ["flexbox"],
  groupTitle: ["textflow"],
  result: ["flexbox", "interactive", "animated"],
  resultTitle: ["textflow", "overflow"],
  resultSeparator: ["flexbox"],
  resultDate: ["textflow"],
});

export const toc = defineElements("toc", {
  root: ["flexbox"],
  content: ["flexbox"],
  item: ["flexbox", "interactive", "selected", "animated", "textflow", "overflow"],
});

export const attribution = defineElements("attribution", {
  root: ["flexbox"],
  author: ["flexbox", "textflow"],
  published: ["flexbox", "textflow"],
  readtime: ["flexbox", "textflow"],
  edit: ["flexbox", "interactive", "textflow"],
});

export const navList = defineElements("nav-list", {
  root: ["flexbox"],
  group: ["flexbox"],
  item: ["flexbox", "interactive", "selected", "animated", "textflow", "overflow"],
  label: ["textflow", "overflow"],
});

export const contentGrid = defineElements("content-grid", {
  root: ["grid"],
  item: ["flexbox", "interactive", "animated"],
  title: [],
  description: [],
  meta: ["flexbox"],
  author: ["flexbox", "textflow"],
  published: ["flexbox", "textflow"],
});

export const surround = defineElements("surround", {
  root: ["flexbox"],
  prev: ["flexbox", "interactive", "animated"],
  next: ["flexbox", "interactive", "animated"],
  label: ["flexbox"],
  title: [],
  prevDescription: [],
  nextDescription: [],
});
